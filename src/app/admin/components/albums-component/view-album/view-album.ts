
// declare var ColorThief: any; // Add this above the @Component

import { Component, signal, inject, effect, ElementRef, ViewChild, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// import * as ColorThief from 'colorthief';
import { ApiService, AppService } from '../../../../core/services';
import { ActivatedRoute } from '@angular/router';
import { ITrack } from '../../../../core/interfaces';
import { MatTooltip } from "@angular/material/tooltip";
import { MatDialog } from '@angular/material/dialog';
import { PopupLibrary } from '../popup-library/popup-library';

// import ColorThief from 'colorthief/dist/color-thief.mjs';
// import ColorThief from 'colorthief';
// import { ColorThiefService } from '@soarlin/angular-color-thief';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule, MatTableModule,
    MatButtonModule, MatIconModule, MatTooltip],
  templateUrl: './view-album.html',
  styleUrl: './view-album.scss',
})
export class ViewAlbum {
  isLoading = signal(true);
  albumId;
  @ViewChild('albumArt') albumArt!: ElementRef<HTMLImageElement>;
  // private colorThief = inject(ColorThiefService);
  private platformId = inject(PLATFORM_ID);
  constructor(
    private apiService: ApiService,
    private activeRoute: ActivatedRoute,
    private appService: AppService,
    private dislog: MatDialog
  ){}


  album = signal({
    name: 'Midnight City',
    artist: 'M83',
    artwork: 'assets/midnight-city.jpg',
    object: "EP",
    _id: '',
    tracks: [
      // { id: '1', title: 'Intro', duration: '3:22' },
      // { id: '2', title: 'Midnight City', duration: '4:03' },
      // { id: '3', title: 'Reunion', duration: '3:55'}
    ]
  });
  albumDuration = signal(0);
  currentTrackIndex = 0;
  currentAudio?: HTMLAudioElement;
  activeTrackId = signal<string | null>(null);
  isPlaying = signal(false);
  dominantColor = signal('rgba(18, 18, 18, 1)'); // Default Spotify dark
  playList = [];
   ngOnInit(): void {
    this.albumId = this.activeRoute.snapshot.paramMap.get('id');
    console.log(this.albumId)
    if(this.albumId){
      this.getAlbum();
    }
  }
  calculateDuration(tracks: Array<any>){
    const duration = tracks.map(t => t.duration).reduce((pv, cv) => pv + cv, 0);
    this.albumDuration.set(duration);
  }

  getAlbum() {
    this.apiService.getAlbum(this.albumId).then((res: any) => {
      console.log(res)
      this.album.set(res);
      this.playList = res.tracks;
      this.calculateDuration(res.tracks);
      this.isLoading.set(false);
    }).catch(err => {
      console.log(err);
    })
  }
  addTracks(album) {
    console.log(album)
    this.dislog.open(PopupLibrary, {
      data: album,
      disableClose: true,
    }).afterClosed().subscribe((data: any) => {
      console.log(data);
      if(data?.done){
        this.getAlbum();
      }
    });
  }
  removeTrack(track){
    console.log(track)
    this.appService.startSpinner("Removing track from album");
    this.apiService.removeTracksToAlbum({
      list: [ {album_id: this.albumId, track_id: track._id, album: this.album().name } ]
    }).then((res) => {
      console.log(res)
      this.getAlbum();
      this.appService.endSpinner();
    }).catch(err => {
      console.log(err);
      this.appService.endSpinner();
    })
  }
  // Color blending logic
  updateBackground() {
    // const colorThief = new (ColorThief as any).default();
    if (isPlatformBrowser(this.platformId)){
      // const colorThief = this.colorThief;
      const img = this.albumArt.nativeElement;
      this.extractDominantColor(img);
      // if (img.complete) {
      //   const [r, g, b] = colorThief.getColor(img);
      //   this.dominantColor.set(`rgba(${r}, ${g}, ${b}, 0.6)`);
      // }
    }

  }

  togglePlay(track: ITrack | any) {
    const index = this.playList.findIndex((x: any) => x._id === track._id);
    // console.log("CurrenIdx", this.currentTrackIndex)
    //  console.log("TrackIdx", index)
    this.currentTrackIndex = index;
    if (this.activeTrackId() === track._id) {
      this.pauseTrack();
      this.isPlaying.update(v => !v);
      this.activeTrackId.set(null);
    } else {
      this.activeTrackId.set(track._id);
      this.isPlaying.set(true);
      this.playTrack(track)
    }
  }
  playAll(){
    const track = this.playList[0];
    this.togglePlay(track);
  }
  // HTML alternative
  // extractDominantColor(imgElement: HTMLImageElement) {
  //   const canvas = document.createElement('canvas');
  //   const context = canvas.getContext('2d');

  //   // Resize to 1x1 pixel to force the browser to average the colors
  //   canvas.width = 1;
  //   canvas.height = 1;

  //   if (context) {
  //     context.drawImage(imgElement, 0, 0, 1, 1);
  //     const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
  //     this.dominantColor.set(`rgba(${r}, ${g}, ${b}, 0.6)`);
  //   }
  // }
  extractDominantColor(imgElement: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Use a slightly larger sample to capture more "vibrant" areas
    canvas.width = 50;
    canvas.height = 50;

    if (context) {
      context.drawImage(imgElement, 0, 0, 50, 50);
      const data = context.getImageData(0, 0, 50, 50).data;

      let r = 0, g = 0, b = 0;

      // Simple averaging (for speed)
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }

      r = Math.floor(r / (data.length / 4));
      g = Math.floor(g / (data.length / 4));
      b = Math.floor(b / (data.length / 4));

      // --- SPOTIFY VIBRANCY BOOST ---
      // Convert to HSL to easily manipulate saturation and lightness
      let [h, s, l] = rgbToHsl(r, g, b);

      // Boost Saturation: If it's dull, make it 70% saturated
      s = Math.max(s, 0.7);

      // Adjust Lightness: Keep it between 30% and 50% for a "dark radio" feel
      l = Math.min(Math.max(l, 0.3), 0.5);

      this.dominantColor.set(`hsla(${h}, ${s * 100}%, ${l * 100}%, 0.6)`);
    }
  }
  playTrack(track: ITrack) {
    if (this.currentAudio) {
      this.currentAudio.pause()
    }
    this.currentAudio = new Audio(track.file)
    this.currentAudio.play();
    this.addEventListener();
  }
  pauseTrack(track?: ITrack) {
    if (this.currentAudio) {
      this.currentAudio.pause()
    }
    // this.currentAudio = new Audio(track.file)
    // this.currentAudio.play()
  }
  nextTrack(track?: ITrack) {
    // const index = this.playList.findIndex((x: any) => x._id === track._id);
    this.currentTrackIndex++;
    if((this.playList.length - 1 ) >= this.currentTrackIndex){
      const platTrack: any = this.playList[this.currentTrackIndex]
      this.playTrack(platTrack);
      this.activeTrackId.set(platTrack._id);
      this.isPlaying.set(true);
    }else{
      this.activeTrackId.set('');
      this.isPlaying.set(true);
      this.currentTrackIndex = 0;
    }

  }
  addEventListener() {
    this.currentAudio?.addEventListener('ended', (e) => {
      console.log("ended..");
      this.nextTrack();
    });
     this.currentAudio?.addEventListener('durationchange', (e) => {
      console.log("Time", e)
     })
  }
  ngOnDestroy(): void {
    if (this.currentAudio) {
      this.currentAudio.pause()
    }
  }
   formatTime(seconds: number): string {
    // console.log("DURAT:", seconds)
    if(seconds == 0) return '0';
    if (isNaN(seconds) || seconds === Infinity) return '0';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

}




// Helper to convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.floor(h * 360), s, l];
}
















// import {
//   Component,
//   ElementRef,
//   ViewChild,
//   AfterViewInit,
//   OnInit,
//   signal,
//   OnDestroy
// } from '@angular/core'

// import { CommonModule } from '@angular/common';
// // import ColorThief from 'colorthief';
// // Need to come back and fix the color grabber
// // import * as ColorThief from 'colorthief';


// import { MatIconModule } from '@angular/material/icon'
// import { MatButtonModule } from '@angular/material/button'
// import { MatTableModule } from '@angular/material/table'
// import { ApiService } from '../../../../core/services';
// import { ActivatedRoute } from '@angular/router';
// import { ITrack } from '../../../../core/interfaces';

// interface Track {

//   title: string
//   duration: string
//   url: string

// }

// @Component({
//   selector: 'app-view-album',
//   templateUrl: './view-album.html',
//   styleUrl: './view-album.scss',
//    imports: [
//     CommonModule,
//     MatIconModule,
//     MatButtonModule,
//     MatTableModule
//   ]
// })

// export class ViewAlbum implements AfterViewInit, OnInit, OnDestroy {

//   @ViewChild('albumImage') albumImage!: ElementRef

//   dominantColor = 'rgb(30,30,30)'

//   album = signal({
//     name: "",
//     artwork: "",
//     release_year: "",
//     artist: "", track_counts: 0

//   });
//   albumId;
//   tracks: ITrack[] = [];
//   // Track[] = [

//   //   { title: 'Intro Beat', duration: '02:12', url: '' },
//   //   { title: 'Afro Vibes', duration: '03:45', url: '' },
//   //   { title: 'Sunset Groove', duration: '04:01', url: '' }

//   // ]

//   displayedColumns = [
//     'index',
//     'title',
//     'duration',
//     'play'
//   ]
//   constructor(
//     private apiService: ApiService,
//     private activeRoute: ActivatedRoute
//   ) {

//   }

//   currentAudio?: HTMLAudioElement
//   ngOnInit(): void {
//     this.albumId = this.activeRoute.snapshot.paramMap.get('id');
//     console.log(this.albumId)
//     if(this.albumId){
//       this.apiService.getAlbum(this.albumId).then((res: any) => {
//         console.log(res)
//         this.album.set(res.album);
//         this.tracks = res.tracks;
//       }).catch(err => {
//         console.log(err);
//       })
//     }
//   }

//   ngAfterViewInit() {

//     // const colorThief = new (ColorThief as any).default();

//     // const img = this.albumImage.nativeElement

//     // if (img.complete) {

//     //   const color = colorThief.getColor(img)

//     //   this.dominantColor = `rgb(${color[0]},${color[1]},${color[2]})`

//     // } else {

//     //   img.addEventListener('load', () => {

//     //     const color = colorThief.getColor(img)

//     //     this.dominantColor = `rgb(${color[0]},${color[1]},${color[2]})`

//     //   })

//     // }

//   }
// // async getCatchyColor(imageUrl: string) {
// //   const colorThief = new (ColorThief as any).default();
// //   const img = new Image();
// //   img.crossOrigin = 'Anonymous'; // Crucial for Firebase/External URLs
// //   img.src = imageUrl;

// //   img.onload = () => {
// //     const dominantColor = colorThief.getColor(img);
// //     console.log('RGB:', dominantColor); // [R, G, B]
// //   };
// // }

//   playTrack(track: ITrack) {
//     if (this.currentAudio) {
//       this.currentAudio.pause()
//     }
//     this.currentAudio = new Audio(track.file)
//     this.currentAudio.play()
//   }
//   ngOnDestroy(): void {
//     if (this.currentAudio) {
//       this.currentAudio.pause()
//     }
//   }

// }
