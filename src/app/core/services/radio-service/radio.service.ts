// ============================================================
// CORE SERVICE - radio.service.ts
// Centralized Audio Engine (Singleton)
// ============================================================
import { inject, Injectable, PLATFORM_ID, signal, OnDestroy } from '@angular/core';
import { StreamService } from '../stream-service/stream.service';
import { select, Store } from '@ngrx/store';
import { duration, updateNowPlaying, play } from '../../../store/radio.actions';
import { isPlatformBrowser } from '@angular/common';
import { interval, Subject, takeUntil } from 'rxjs';
import { extractAudioMetadata, getAudioMetadataFromUrl } from '../../utils/file-upload-metadate';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { backendApiUrl } from '../../../../environments/backend-api';


@Injectable({ providedIn: 'root' })
export class RadioService implements OnDestroy {
  playingNowInterval = interval(6000);
  intervalSub;
  private audio!: HTMLAudioElement;
  private platformId = inject(PLATFORM_ID);

  isPlaying = signal(false);
  volume = signal(0.8);
  currentVolume = 0;
  progress = signal(0);
  isLive = false;
  private destroy$ = new Subject<void>();
  index = 0;
  currentTrack = {
    name: 'Essence',
    artist: 'Wizkid ft. Tems',
    thumbnail: 'assets/wizkid.jpg',
    // url: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/audio%2FLouis%20Island%20-%20Somewhere%20New.mp3?alt=media&token=829d78ab-0ecd-48e5-9424-1b1aeea292b9', //'https://s2.radio.co' // Replace with your Afrobeats stream
    url: 'https://radioafricana.com'
  };

  async setCurrentTrack(currentTrack) {
     if (isPlatformBrowser(this.platformId)){
      this.audio = new Audio();
      this.audio.crossOrigin = "anonymous";
      this.audio.preload="none";
      this.audio.src = currentTrack.url, //'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/audio%2FLouis%20Island%20-%20Somewhere%20New.mp3?alt=media&token=829d78ab-0ecd-48e5-9424-1b1aeea292b9';
      this.audio.volume = this.volume();
      // this.audio.load();
        this.audio.ontimeupdate = () => {
        this.progress.set(this.audio.currentTime);
      };

      this.audio.addEventListener('loadedmetadata', () => {
    // If it's a live stream, duration will be Infinity
        const duration = Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
        this.store.dispatch({ type: '[Radio] Duration', duration: duration });
        const currentTime = this.audio.currentTime;
        this.store.dispatch({ type: '[Radio] Current Time', currentTime: currentTime });
        // console.log("Duration:", this.audio.duration);
        // console.log(duration)
        // if(duration == 0){
        //   this.store.dispatch({ type: '[Radio] Duration', duration: Infinity });
        // }
      });

      // 2. Update 'currentTime' as the track plays
      this.audio.addEventListener('timeupdate', () => {
        const currentTime = this.audio.currentTime;
        this.store.dispatch({ type: '[Radio] Current Time', currentTime: currentTime });
        // console.log("time", this.audio.currentTime)
      });

      // 3. Handle track end
      this.audio.addEventListener('ended', () => {
        // this.nextTrack();
        this.store.dispatch({ type: '[Radio] Pause' });
        this.store.dispatch({ type: '[Radio] Current Time', currentTime: 0 });
        this.pause();
        this.nextTrack();
      });

      this.audio.addEventListener('error', (e) => {
        console.error("Audio Source Error:", this.audio.error);
        // This will tell you if it's a 404, Network, or Decode error
      });
     }
     this.store.dispatch({ type: '[Radio] Off' });
     const meta = await this.getTrackMeta(currentTrack.url);
     console.log(meta)
    this.store.dispatch({ type: '[Radio] Update Now Playing', payload: { ...currentTrack } });
    if(this.intervalSub){
      this.intervalSub.unsubscribe();
    }
  }
  async getTrackMeta(url?) {
    // const currentTrack = playList[this.index];
    const meta = await getAudioMetadataFromUrl(url);
    console.log(meta)
    return meta;
  }

  constructor(
     private stream: StreamService,
     private store: Store<any>,
     private http: HttpClient
  ) {
    // Only initialize Audio if in browser
    if (isPlatformBrowser(this.platformId)) {
      this.setCurrentTrack(playList[this.index]);
      // this.audio = new Audio();
      // // this.audio.crossOrigin = "anonymous";
      // this.audio.src = this.currentTrack.url, //'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/audio%2FLouis%20Island%20-%20Somewhere%20New.mp3?alt=media&token=829d78ab-0ecd-48e5-9424-1b1aeea292b9';
      // this.audio.volume = this.volume();
      // this.audio.load();

      this.audio.ontimeupdate = () => {
        this.progress.set(this.audio.currentTime);
      };
        this.audio.addEventListener('loadedmetadata', () => {
      // If it's a live stream, duration will be Infinity
          const duration = isFinite(this.audio.duration) ? this.audio.duration : 0;
          this.store.dispatch({ type: '[Radio] Duration', duration: duration });
          const currentTime = this.audio.currentTime;
          this.store.dispatch({ type: '[Radio] Current Time', currentTime: currentTime });
          console.log("Duration:", this.audio.duration)
        });

        // 2. Update 'currentTime' as the track plays
        this.audio.addEventListener('timeupdate', () => {
          const currentTime = this.audio.currentTime;
          this.store.dispatch({ type: '[Radio] Current Time', currentTime: currentTime });
          // console.log("time", this.audio.currentTime)
        });

        // 3. Handle track end
        this.audio.addEventListener('ended', () => {
          // this.nextTrack();
          this.store.dispatch({ type: '[Radio] Pause' });
          this.store.dispatch({ type: '[Radio] Current Time', currentTime: 0 });
          this.pause();
          this.nextTrack();
        });

        this.audio.addEventListener('error', (e) => {
          console.error("Audio Source Error:", this.audio.error);
          // This will tell you if it's a 404, Network, or Decode error
        });
        this.store.dispatch({ type: '[Radio] Off' });
    }

     interval(10000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.stream.getNowPlaying().subscribe(data => {
          this.store.dispatch({ type: '[Radio] Update Now Playing', payload: data });
        });
      });


    //  setInterval(() => {
    //    this.stream.getNowPlaying().subscribe(data => {
    //      this.store.dispatch(updateNowPlaying({ payload: data }));
    //    });
    //  }, 10000); // refresh every 10s
  }
  startLiveRadio(){
     this.pause();
      this.audio.src = '';
      if(this.intervalSub){
        this.intervalSub.unsubscribe();
      }
     if (isPlatformBrowser(this.platformId)){
      this.audio = new Audio();
      this.audio.crossOrigin = "anonymous";
      this.audio.preload = "auto";
      this.audio.src = `${backendApiUrl}/stream`, //'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/audio%2FLouis%20Island%20-%20Somewhere%20New.mp3?alt=media&token=829d78ab-0ecd-48e5-9424-1b1aeea292b9';
      this.audio.volume = this.volume();
      this.play();
      this.isLive = true;
      this.getPlayingNowFromServer();
      // this.isPlaying.set(true);
      this.store.dispatch({ type: '[Radio] On' });
      this.intervalSub = this.playingNowInterval.subscribe((time) => {
        console.log(time)
        this.getPlayingNowFromServer();
      })
    }
  }
  async getPlayingNowFromServer(){
    // get now playing track from the streaming server
    // this is done every few seconds
    try{
      const playinNow = await lastValueFrom(this.http.get(`${backendApiUrl}/playing_now`));
      console.log("NOW", playinNow)
      this.store.dispatch({ type: '[Radio] Update Now Playing', payload: playinNow });
    }catch(err){
      console.log(err);
    }
  }
  getRadiosate() {
    return this.store.pipe(select('radio'));
  }


  play() {
    this.audio.play();
    this.isPlaying.set(true);
    this.store.dispatch({ type: '[Radio] Play' });
  }

  pause() {
    this.audio.pause();
    this.isPlaying.set(false);
    this.store.dispatch({ type: '[Radio] Pause' });
    this.store.dispatch({ type: '[Radio] Off' });
    this.isLive = false;
  }

  toggle() {
    this.isPlaying() ? this.pause() : this.play();
    if(this.isLive) {
      this.store.dispatch({ type: '[Radio] On' });
    }else{
      this.store.dispatch({ type: '[Radio] Off' });
    }
  }
  nextTrack(){
    this.pause();
    this.audio.src = '';
    this.index = this.index + 1;
    if(playList.length >= this.index + 1) {
      this.setCurrentTrack(playList[this.index]);
      this.play();
    }else{
      this.index = 0;
      this.setCurrentTrack(playList[this.index]);
      this.play();
    }
    if(this.intervalSub){
      this.intervalSub.unsubscribe();
    }
  }
  prevTrack() {

  }
  toggleValume(state: boolean) {

    if(state){
      this.currentVolume = this.audio.volume;
      this.audio.volume = 0;
      this.volume.set(0);
      this.store.dispatch({ type: '[Radio] Set Volume', volume: 0 });
    }else{
      this.audio.volume = this.currentVolume;
      this.volume.set(this.currentVolume);
      this.store.dispatch({ type: '[Radio] Set Volume', volume: this.currentVolume });
    }
    this.store.dispatch({ type: '[Radio] Toggle Volume', mute: state });
  }

  setVolume(value: number) {
    this.audio.volume = value;
    this.volume.set(value);
     this.store.dispatch({ type: '[Radio] Set Volume', volume: value });
  }
  setCurrentTime(value: number) {
    // console.log(value)
     this.audio.currentTime = value;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if(this.intervalSub){
      this.intervalSub.unsubscribe();
    }
  }
}


const playList = [
  {
    title: 'Live DJ Mix',
    artist: 'PowerXtra Radio',
    artwork: 'https://radioafricana.com/wp-content/uploads/2025/05/HSOTW-1536x1536.jpg',
    // url: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/audio%2FLouis%20Island%20-%20Somewhere%20New.mp3?alt=media&token=829d78ab-0ecd-48e5-9424-1b1aeea292b9', //'https://s2.radio.co' // Replace with your Afrobeats stream
    url: 'http://localhost:3000/stream' //`http://localhost:3000/stream?cb=${Date.now()}`
  },

  {
    title: 'Culture',
    artist: 'Umu-Obiligbo-ft.-Phyno-Flavour',
    artwork: 'assets/wizkid.jpg',
    url: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/audio%2FUmu-Obiligbo-ft.-Phyno-Flavour-%E2%80%93-Culture.mp3?alt=media&token=73273b11-ae64-4002-b889-16e4477df151'
  },
    {
    title: 'Asiwaju',
    artist: 'Rugar',
    artwork: 'assets/wizkid.jpg',
    url: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/audio%2FRuger_-_Asiwaju_Video_.mp3?alt=media&token=8f84fd34-b7b4-4532-b16a-a223c94e8f13'
  },
    {
    title: 'Skeletun',
    artist: 'Tekno',
    artwork: 'assets/wizkid.jpg',
    url: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/audio%2FTekno-Skeletun-Official-Audio.mp3?alt=media&token=5eb9f005-adc2-472a-bac2-6d64a45a3833'
  },
   {
    title: 'PuTTin',
    artist: 'Teckno',
    artwork: 'assets/wizkid.jpg',
    url: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/audio%2FTekno-PuTTin.mp3?alt=media&token=1dbbd927-a442-4ce3-874c-f5aed20be906'

  },
  {
    title: 'Umu-Obiligbo',
    artist: 'Enjoyment',
    artwork: 'assets/wizkid.jpg',
    url: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/audio%2FUmu-Obiligbo-Enjoyment.mp3?alt=media&token=3782f06c-5475-437b-b84d-b27444f66f71'

  },
    {
    title: 'Essence',
    artist: 'Wizkid ft. Tems',
    artwork: 'assets/wizkid.jpg',
    url: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/audio%2FLouis%20Island%20-%20Somewhere%20New.mp3?alt=media&token=829d78ab-0ecd-48e5-9424-1b1aeea292b9', //'https://s2.radio.co' // Replace with your Afrobeats stream

  },
  {
    title: 'PuTTin',
    artist: 'Teckno',
    artwork: 'assets/wizkid.jpg',
    url: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/audio%2FTekno-PuTTin.mp3?alt=media&token=1dbbd927-a442-4ce3-874c-f5aed20be906'

  },
  {
    title: 'Umu-Obiligbo',
    artist: 'Enjoyment',
    artwork: 'assets/wizkid.jpg',
    url: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/audio%2FUmu-Obiligbo-Enjoyment.mp3?alt=media&token=3782f06c-5475-437b-b84d-b27444f66f71'

  },
]

