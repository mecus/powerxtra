import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, ViewChild, OnInit, OnDestroy, AfterViewInit, Inject, PLATFORM_ID, inject, ChangeDetectorRef, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule, MatSliderThumb } from '@angular/material/slider';
import { RadioService } from '../../../core/services/radio-service/radio.service';
import { select, Store } from '@ngrx/store';
import { Media, StoreService } from '../../../store';
// import IcecastMetadataStats from 'icecast-metadata-js';

@Component({
  selector: 'radio-player',
  imports: [MatButtonModule, MatIconModule,
    MatSliderModule, CommonModule, FormsModule,  MatSliderThumb,
    ReactiveFormsModule
  ],
  templateUrl: './radio-player.html',
  styleUrl: './radio-player.scss',

})

export class RadioPlayer implements OnInit, OnDestroy, AfterViewInit {

  private platformId = inject(PLATFORM_ID);
  private audioCtx;
  private analyser;
  currentTimeProgress = signal(0);
  mediaState = signal<Media>({media: "autoDJ"});
  constructor(
     public radioService: RadioService,
     private store: Store<any>,
      private cdr: ChangeDetectorRef,
      private media: StoreService
    // @Inject(PLATFORM_ID) private platformId: Object
  ){
    this.media.getMediaState().subscribe((data: Media) => {
        console.log("Player", data)
        this.mediaState.set(data);
      });

  }
  @ViewChild('visualizerCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private dataArray!: Uint8Array | any;
  private animationId!: number;
  // Access the hidden audio element
  private audio!: HTMLAudioElement;

  currentTrack = {
    name: 'Essence',
    artist: 'Wizkid ft. Tems',
    thumbnail: 'assets/wizkid.jpg',
    artwork: "https://radioafricana.com/wp-content/uploads/2025/05/HSOTW-1536x1536.jpg",
    url: '', //'https://s2.radio.co' // Replace with your Afrobeats stream
  };

  isPlaying = false;
  isLiked = false;
  volume = 0.7;
  currentTime = '';
  duration = signal(0);
  timeLine = 0;
  isMuted: boolean = false;
  nowPlaying = signal({
    title: '',
    name: 'PowerXtra DJ Mix',
    artist: 'PowerXtra DJ Mix',
    thumbnail: 'assets/wizkid.jpg',
    artwork: "https://radioafricana.com/wp-content/uploads/2025/05/HSOTW-1536x1536.jpg",
    url: ''
  });
  isPlay = signal(false);
  isLive = signal(false);
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)){
      // this.audioCtx = new AudioContext();
      // this.analyser = this.audioCtx.createAnalyser();

      this.setupAudio();
    }
     this.store.pipe(select('radio')).subscribe((data: any) => {
      // console.log(data)
      this.setMetas(data);
    })
  }
  setMetas(data) {
    this.volume = data.volume;
    this.isPlaying = data.playing;
    this.isPlay.set(data.playing);
    this.duration.set(data.duration);
    this.currentTime = this.formatTime(data.currentTime);
    this.timeLine = data.currentTime;
    this.currentTimeProgress.set(data.currentTime);
    this.nowPlaying.set(data.nowPlaying);
    this.isLive.set(data.live);
    // this.cdr.detectChanges();
  }

  // setupAudio() {

  //   this.audio.crossOrigin = "anonymous";
  //   this.audio.src = this.currentTrack.url;
  //   this.audio.load();
  //   this.updateVolume();

  //   // 1. Get total duration once metadata loads
  //   this.audio.addEventListener('loadedmetadata', () => {
  //     // If it's a live stream, duration will be Infinity
  //     this.duration = isFinite(this.audio.duration) ? this.audio.duration : 0;
  //   });

  //   // 2. Update 'currentTime' as the track plays
  //   this.audio.addEventListener('timeupdate', () => {
  //     this.currentTime = this.audio.currentTime;
  //   });

  //   // 3. Handle track end
  //   this.audio.addEventListener('ended', () => {
  //     this.nextTrack();
  //   });
  // }

  setupAudio() {
    // 1. Set this BEFORE setting the src to avoid security errors
    this.audio = new Audio();

    // this.audio.crossOrigin = "anonymous";
    // this.audio.preload = "auto";


    // 2. Use a 'try-catch' or check if URL exists
    console.log("Loading track", this.currentTrack.url)
    this.audio.src = this.currentTrack.url;
    this.audio.volume = this.volume;
    this.audio.load();
    console.log(this.audio)

     // 1. Get total duration once metadata loads
    this.audio.addEventListener('loadedmetadata', () => {
      // If it's a live stream, duration will be Infinity
      // this.duration = isFinite(this.audio.duration) ? this.audio.duration : 0;
    });

    // 2. Update 'currentTime' as the track plays
    this.audio.addEventListener('timeupdate', () => {
      // this.currentTime = this.audio.currentTime;
    });

    // 3. Handle track end
    this.audio.addEventListener('ended', () => {
      this.nextTrack();
    });

    this.audio.addEventListener('error', (e) => {
      console.error("Audio Source Error:", this.audio.error);
      // This will tell you if it's a 404, Network, or Decode error
    });
  }


  // async togglePlay() {
  // // Resume the context if it was suspended by the browser
  //  if (!isPlatformBrowser(this.platformId)) return;
  //   if (this.audioCtx.state === 'suspended') {
  //     await this.audioCtx.resume();
  //   }

  //   this.isPlaying = !this.isPlaying;
  //   this.isPlaying ? this.audio.play() : this.audio.pause();
  // }
  async togglePlay() {
    // this.radioService.play();
    try {
      if (this.isPlaying) {
        this.audio.pause();
      } else {
        // Ensure the AudioContext is active for the visualizer
        if (this.audioCtx?.state === 'suspended') {
          await this.audioCtx.resume();
        }

        // Play returns a promise; awaiting it prevents "Interrupted by call to pause" errors
        await this.audio.play();
      }
      this.isPlaying = !this.isPlaying;
    } catch (err) {
      console.error("Playback failed:", err);
      // If you see "NotSupportedError" here, the stream URL is likely down or blocked
    }
  }
  toggleVolume(){
    if(this.isMuted){
      this.isMuted = false;
      this.radioService.toggleValume(false);
    }else{
      this.isMuted = true;
      this.radioService.toggleValume(true);
    }
  }

  toggleLike() { this.isLiked = !this.isLiked; }

  onSeek(event: any) {
    // When user drags the slider, update the audio position
    // console.log(event)
    if(event) this.radioService.setCurrentTime(event);
    // const seekTime = event.target.value;
    // this.audio.currentTime = seekTime;
  }

  nextTrack() { /* Logic for next track */
    this.radioService.nextTrack();
   }
  prevTrack() { /* Logic for previous track */
     this.radioService.prevTrack();
   }

  updateVolume(value) {
    console.log(value)
    if(!value) return;
    this.radioService.setVolume(value)
    this.audio.volume = this.volume;
  }

  formatTime(seconds: number): string {
    // console.log("DURAT:", seconds)
    if(seconds == 0) return 'LIVE';
    if (isNaN(seconds) || seconds === Infinity) return 'LIVE';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  ngOnDestroy() {
    this.audio?.pause();
    // this.audio.src = '';
  }
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupAudio();
     this.setupVisualizer();
    }
  }


  setupVisualizer() {
    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;

    if (!AudioContextClass) {
      console.error("Web Audio API is not supported in this browser");
      return;
    }

    this.audioCtx = new AudioContextClass();
    const source = this.audioCtx.createMediaElementSource(this.audio);
    this.analyser = this.audioCtx.createAnalyser();

    source.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);

    this.analyser.fftSize = 256; // Lower for "blocky" bars, higher for smooth waves
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);

    // this.draw();
  }




  draw() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    this.animationId = requestAnimationFrame(() => this.draw());

    this.analyser.getByteFrequencyData(this.dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / this.dataArray.length) * 2.5;
    let x = 0;

    this.dataArray.forEach((value: any) => {
      const barHeight = (value / 255) * canvas.height;
      // Spotify-style Green with varying opacity based on frequency
      ctx.fillStyle = `rgba(29, 185, 84, ${value / 255})`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    });
  }

  updateMetadata() {
    // const stats = new IcecastMetadataStats('https://your-stream-url.mp3');

    // stats.on('metadata', (metadata) => {
    //   if (metadata.StreamTitle) {
    //     const [artist, title] = metadata.StreamTitle.split(' - ');
    //     this.currentTrack.name = title || metadata.StreamTitle;
    //     this.currentTrack.artist = artist || 'Live Stream';
    //   }
    // });

    // stats.start();
  }
}






// export class RadioPlayerComponent implements AfterViewInit {
//   @ViewChild('visualizerCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

//   private audioCtx = new AudioContext();
//   private analyser = this.audioCtx.createAnalyser();
//   private dataArray!: Uint8Array;
//   private animationId!: number;

//   ngAfterViewInit() {
//     this.setupVisualizer();
//   }

//   setupVisualizer() {
//     const source = this.audioCtx.createMediaElementSource(this.audio);
//     source.connect(this.analyser);
//     this.analyser.connect(this.audioCtx.destination);

//     this.analyser.fftSize = 256; // Lower for "blocky" bars, higher for smooth waves
//     const bufferLength = this.analyser.frequencyBinCount;
//     this.dataArray = new Uint8Array(bufferLength);

//     this.draw();
//   }

//   draw() {
//     const canvas = this.canvasRef.nativeElement;
//     const ctx = canvas.getContext('2d')!;
//     this.animationId = requestAnimationFrame(() => this.draw());

//     this.analyser.getByteFrequencyData(this.dataArray);
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     const barWidth = (canvas.width / this.dataArray.length) * 2.5;
//     let x = 0;

//     this.dataArray.forEach(value => {
//       const barHeight = (value / 255) * canvas.height;
//       // Spotify-style Green with varying opacity based on frequency
//       ctx.fillStyle = `rgba(29, 185, 84, ${value / 255})`;
//       ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
//       x += barWidth + 1;
//     });
//   }
// }


// export class RadioPlayerComponent {
//   currentTrack = {
//     name: 'Essence',
//     artist: 'Wizkid ft. Tems',
//     thumbnail: 'assets/afrobeats-cover.jpg'
//   };

//   isPlaying = false;
//   isLiked = false;
//   volume = 0.7;
//   currentTime = 0;
//   duration = 240; // 4:00 in seconds

//   togglePlay() { this.isPlaying = !this.isPlaying; }
//   toggleLike() { this.isLiked = !this.isLiked; }

//   updateVolume() {
//     // Logic to update HTMLMediaElement volume
//     console.log('Volume set to:', this.volume);
//   }

//   onSeek(event: any) {
//     this.currentTime = event.target.value;
//   }

//   nextTrack() { /* Logic for next track */ }
//   prevTrack() { /* Logic for previous track */ }
// }
