

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';

// import { Firestore, collection, addDoc } from '@angular/fire/firestore';

import * as musicMetadata from 'music-metadata-browser';
import { ApiService, UploadService } from '../../../core/services';
import { Router } from '@angular/router';

interface TrackFile {

  file: File
  preview?: string
  artwork?: string

  title?: string
  artist?: string
  album?: string

  duration?: number
  bitrate?: number

  progress: number
  url?: string;
  blob?: Blob;
  size?: number;
  date?: string;
  year?: string | number;
  genre?: string;
}

interface UploadFile {
  file: File;
  progress: number;
  url?: string;
}

@Component({
  selector: 'app-audio-upload',
  templateUrl: './audio-upload.component.html',
  styleUrls: ['./audio-upload.component.scss'],
  imports: [ MatCardModule, MatIconModule,
    MatProgressBarModule, CommonModule,
    MatTooltipModule
   ]
})
export class AudioUploadComponent {
  private cd = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);
  files: TrackFile[] = []
  tracks = signal({
    name: "upload",
    songs: new Array<TrackFile>
  });
  dragging = false;
  currentUser;
  constructor(
    private storage: Storage,
    // private firestore: Firestore,
    private uploadService: UploadService,
    private cdr: ChangeDetectorRef,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)){
      const user = localStorage.getItem("auth");
      if(user){
        this.currentUser = JSON.parse(user);
      }
    }

  }
  disableButton = signal(false);
  async handleFiles(fileList: FileList) {

      // let fileList: FileList;
      for (const file of Array.from(fileList)) {

        if (!file.type.startsWith('audio/')) continue

        const track: TrackFile = {
          file,
          preview: URL.createObjectURL(file),
          progress: 0
        }
        console.log(track)

        this.files.push(track)
          this.tracks.set({
            name: "upload",
            songs: this.files
          });
        this.cdr.detectChanges();
        await this.extractMetadata(track)

        await this.detectDuration(track)

        await this.detectBPM(track)

      }

      this.snackBar.open(`${this.files.length} track(s) processed.`, 'X', {duration: 5000});
      this.cd.detectChanges();
      console.log(this.tracks())
  }

  async extractMetadata(track: TrackFile) {

    try {

      const metadata = await musicMetadata.parseBlob(track.file)

      track.title = metadata.common.title || track.file.name
      track.artist = metadata.common.artist || 'Unknown'
      track.album = metadata.common.album || '';
      track.size = track.file.size;
      track.date = metadata.common.date;
      track.year = metadata.common.year;
      track.genre = metadata.common.genre?.join(', ') || 'Unknown';

      if (metadata.common.picture?.length) {

        const pic: any = metadata.common.picture[0]

        const blob = new Blob([pic.data], { type: pic.format });
        track.blob = blob;
        track.artwork = URL.createObjectURL(blob)

      }

    } catch (err) {
      console.log("Metadata read error", err)
    }
  }

  async detectDuration(track: TrackFile) {

    const audio = new Audio(track.preview!)

    await new Promise(resolve => {

      audio.onloadedmetadata = () => {
        track.duration = audio.duration
        resolve(true)
      }

    })
  }

  async detectBPM(track: TrackFile) {

    const audioCtx = new AudioContext()

    const buffer = await track.file.arrayBuffer()

    const decoded = await audioCtx.decodeAudioData(buffer)

    const raw = decoded.getChannelData(0)

    // const peaks: number[] = []
    const peaks = [] as number[];

    const step = 10000

    for (let i = 0; i < raw.length; i += step) {

      let max = 0

      for (let j = i; j < i + step; j++) {
        max = Math.max(max, Math.abs(raw[j]))
      }

      if (max > 0.9) peaks.push(i)
    }

    if (peaks.length > 1) {

      const intervals: Array<number> = []

      for (let i = 1; i < peaks.length; i++) {
        let peak = peaks[i] - peaks[i-1];
        intervals.push(peak)
      }

      const avg = intervals.reduce((a,b)=>a+b,0) / intervals.length

      track.bitrate = Math.round((60 * decoded.sampleRate) / avg)
    }
  }

  uploadTrackCounter = signal(0);
  async uploadAll() {
    console.log("upload starting...")
    this.disableButton.update(v => true);
    for(let i = 0; i < this.files.length; i++) {

      let track = this.files[i];
      if (track.progress > 0) continue

      const filePath = `tracks/${Date.now()}_${track.file.name}`

      const storageRef = ref(this.storage, filePath)

      const task = uploadBytesResumable(storageRef, track.file)

      task.on(
        'state_changed',

        snap => {
          track.progress = Math.round(
            (snap.bytesTransferred / snap.totalBytes) * 100
          );
          console.log(track.progress)
          this.cd.detectChanges();
        },

        console.error,

        async () => {

          track.url = await getDownloadURL(task.snapshot.ref);
          console.log("File", track.url)
          const blob: Blob | any = track.blob;
          const fileName: string | any = track.title;
          if(track?.blob){
            track.artwork = await this.uploadService.uploadImageBlob(blob, fileName);
          }

          console.log(track)

          const trackData = {
              title: track.title,
              artist: track.artist,
              album: track.album,
              artwork: track.artwork,
              file: track.url,
              release_date: track.date,
              release_year: track.year,
              bitrate: track.bitrate, //128000
              size: track.size,
              duration: track.duration,
              // photos?: string;
              uploadedBy: this.currentUser.displayName,
              upload_date: new Date,
              status: "active",
              active: true,
              genre: track.genre, // Afrobeat
              tags: `${track.genre}, afrobeats`,
              category: "internation", // internation | local
              other_artist: "none"
          }
          const newTrack = await this.apiService.createTrack(trackData);
          console.log("New Track", newTrack);
           this.uploadTrackCounter.update(v => v + 1);
           console.log(this.uploadTrackCounter, this.files.length)
          if(this.uploadTrackCounter() >= this.files.length){
          this.disableButton.update(v => !v);
            this.snackBar.open(`${this.files.length} tracks successfully uploaded.`, 'X', {duration: 6000});
            this.apiService.loadTrackToStore();
            this.router.navigate(["/admin/library"]);
          }
        }
      )

    }

  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragging = true;
  }

  onDragLeave() {
    this.dragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragging = false;

    if (event.dataTransfer?.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onFileSelect(event: any) {
    this.handleFiles(event.target.files);
  }

}


























// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
// import { MatCardModule } from '@angular/material/card';
// import { MatIconModule } from '@angular/material/icon';
// import { MatProgressBarModule } from '@angular/material/progress-bar';

// interface UploadFile {
//   file: File;
//   progress: number;
//   url?: string;
// }

// @Component({
//   selector: 'app-audio-upload',
//   templateUrl: './audio-upload.component.html',
//   styleUrls: ['./audio-upload.component.scss'],
//   imports: [ MatCardModule, MatIconModule, MatProgressBarModule, CommonModule ]
// })
// export class AudioUploadComponent {

//   files: UploadFile[] = [];
//   dragging = false;

//   constructor(private storage: Storage) {}

//   onDragOver(event: DragEvent) {
//     event.preventDefault();
//     this.dragging = true;
//   }

//   onDragLeave() {
//     this.dragging = false;
//   }

//   onDrop(event: DragEvent) {
//     event.preventDefault();
//     this.dragging = false;

//     if (event.dataTransfer?.files) {
//       this.handleFiles(event.dataTransfer.files);
//     }
//   }

//   onFileSelect(event: any) {
//     this.handleFiles(event.target.files);
//   }

//   handleFiles(fileList: FileList) {

//     Array.from(fileList).forEach(file => {

//       if (!file.type.startsWith('audio/')) return;

//       this.files.push({
//         file,
//         progress: 0
//       });
//     });
//   }

//   uploadAll() {

//     this.files.forEach(upload => {

//       if (upload.progress > 0) return;

//       const filePath = `radio-tracks/${Date.now()}_${upload.file.name}`;
//       const storageRef = ref(this.storage, filePath);

//       const task = uploadBytesResumable(storageRef, upload.file);

//       task.on('state_changed',
//         snapshot => {
//           upload.progress = Math.round(
//             (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//           );
//         },
//         error => console.error(error),
//         async () => {
//           upload.url = await getDownloadURL(task.snapshot.ref);
//         }
//       );

//     });
//   }

// }


