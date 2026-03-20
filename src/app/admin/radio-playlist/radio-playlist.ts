import { Component, signal, computed, inject, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { select, Store } from '@ngrx/store';
import { ApiService } from '../../core/services';
import { RadioAdminService } from '../admin-services/radio-admin-service/radio-admin.service';
import { interval } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

interface RadioState {
  on: boolean;
  station: string;
  listeners: number;
  status: string;
}
@Component({
  selector: 'app-radio-playlist',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatButtonModule, MatIconModule, MatCardModule, MatTooltipModule],
  templateUrl: './radio-playlist.html',
  styleUrl: './radio-playlist.scss',
})
export class RadioPlaylist implements AfterViewInit, OnDestroy  {
  private store = inject(Store);
  radioState = signal({
     on: false,
    station: "powerx",
    listeners: 0,
    status: "streaming"
  });
  statusInterval = interval(6000);
  intervalSub;
  tracks = [];
  currentAudio: HTMLAudioElement = new Audio();
  saveButtonAlert = signal(false);
  isRefresh = signal(false);
  constructor(
    private apiService: ApiService,
    private radioAdminService: RadioAdminService,
    private snackBar: MatSnackBar
  ){
    this.store.pipe(select('library')).subscribe((library: any) => {
      console.log(library)
      if(library.tracks.length){
        this.tracks = library.tracks;
        this.library.set(this.tracks);
      }else{
        this.apiService.loadTrackToStore();
      }
    });

  }
  ngAfterViewInit(): void {
   this.intervalSub = this.statusInterval.subscribe((time) => {
      this.getRadioStreamingStatus()
    });
    this.getRadioQueue();
  }
  // check or get streamin status
  getRadioStreamingStatus() {
    this.radioAdminService?.getStreamingStatus().then((status: RadioState | any) => {
      console.log(status)
      this.radioState.set(status);
      this.isAutoDjActive.set(status.on)
    }).catch(err => console.log(err));
  }
  // Signals for AutoDJ State
  isAutoDjActive = signal(false);
  currentTrack = signal<any>(null);

  // start auto dj
  async startAutoDJ(){
   try{
     const on = await this.radioAdminService.startRadio();
     console.log(on)
    this.getRadioStreamingStatus();
   }catch(err){
    console.log(err);
   }
  }
  async stopAutoDJ(){
  try{
     const on = await this.radioAdminService.stopRadio();
     console.log(on)
    this.getRadioStreamingStatus();
      if(this.intervalSub){
      this.intervalSub.unsubscribe();
    }
   }catch(err){
    console.log(err);
   }
  }
  // Playlist Data
  searchQuery = signal('');

  // Your original library data
  library = signal([
    { _id: '1', title: 'Neon Lights', artist: 'Synthwave Pro', duration: '3:45', object: 'track' },
    { _id: '2', title: 'Station ID 01', artist: 'RadioSkin', duration: '0:15', object: 'jingle' },
    { _id: '3', title: 'Midnight Drive', artist: 'Retro Wave', duration: '4:10', object: 'track' },
    { _id: '4', title: 'Urban Jungle', artist: 'Beat Master', duration: '2:55', object: 'track' }
  ]);

   // 2. Create a computed signal that reacts to searchQuery changes
  filteredLibrary = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.library();

    return this.library().filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.artist.toLowerCase().includes(query)
    );
  });

  // 3. Update the search value
  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }


  queue = signal<any[]>([]);

  toggleAutoDj() {
    // this.isAutoDjActive.update(val => !val);
    if(this.isAutoDjActive()){
      this.stopAutoDJ();
    }else{
       this.startAutoDJ()
    }
  }

  addJingle() {
    const jingle = { id: Date.now().toString(), title: 'Jingle Blast', artist: 'System', duration: '0:05', type: 'jingle' };
    this.queue.update(q => [jingle, ...q]); // Push jingle to top of queue
  }

  drop(event: CdkDragDrop<any[]>) {
  // 1. Create mutable copies of the source and target arrays
  const previousContainerData = [...event.previousContainer.data];
  const currentContainerData = [...event.container.data];

  if (event.previousContainer === event.container) {
    // Reordering within the same list
    moveItemInArray(
      currentContainerData,
      event.previousIndex,
      event.currentIndex
    );

    // 2. Update the specific signal (Library or Queue)
    if (event.container.id === 'libraryList') {
      this.library.set(currentContainerData);
    } else {
      this.queue.set(currentContainerData);
    }
  } else {
    // Moving from one list to another
    this.saveButtonAlert.set(true);
    transferArrayItem(
      previousContainerData,
      currentContainerData,
      event.previousIndex,
      event.currentIndex
    );

    // 3. Update both signals with the new arrays
    this.library.set(previousContainerData);
    this.queue.set(currentContainerData);
  }
  }


  async saveQueue() {
    // ... previous logic to update the 'queue' signal ...
    // After updating the signal, sync with backend
    if(this.queue().length){
      try {
        await this.radioAdminService.syncQueue(this.queue());
        this.saveButtonAlert.set(false);
        console.log('Queue synced to AutoDJ backend');
        this.snackBar.open('Queue synced to AutoDJ backend', 'X', {duration: 6000});
      } catch (err) {
        console.error('Failed to sync queue:', err);
        this.snackBar.open(`Failed to sync queue: ${err} `, 'X', {duration: 5000});
      }
    }

  }
  trackQueue: any[] = [];
  getRadioQueue() {
    this.radioAdminService.getRadioQueue().then((res: any) => {
      console.log("Radio Queue:", res)
      const tracks: Array<any> = res.data.tracks;
      if(res.data.tracks.length){
        this.trackQueue = tracks.map(t => t.trackId);
        this.queue.update(v => [...this.trackQueue]);
      }else{
        this.queue.update(v => []);
      }
      console.log(tracks)
      this.isRefresh.set(false);
    }).catch(err => console.log(err));
  }
  refreshQueue(){
    this.isRefresh.set(true);
    this.getRadioQueue();
  }

  formatTime(seconds: number): string {
    // console.log("DURAT:", seconds)
    if(seconds == 0) return '0';
    if (isNaN(seconds) || seconds === Infinity) return '0';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  // drop(event: CdkDragDrop<any[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }
  // }

  previewTrack(track: any) {
    console.log('Previewing:', track.title);
    if(this.currentAudio){
      this.currentAudio.pause();
    }
    if(track?.title == this.currentTrack()?.title){
      this.currentAudio.pause();
      this.currentTrack.set(null);
    }else{
      this.currentAudio = new Audio()
      this.currentAudio.src = track.file;
      this.currentAudio.play();
      this.currentTrack.set(track);
    }

    // Logic for mini-player preview
  }
  ngOnDestroy(): void {
    if(this.currentAudio){
      this.currentAudio.pause();
      this.currentTrack.set(null);
    }
    if(this.intervalSub){
      this.intervalSub.unsubscribe();
    }
  }
}


// import { Component, signal, computed, inject } from '@angular/core';
// // ... previous imports

// export class RadioPlaylistComponent {
//   // 1. Create a signal for the search input
//   searchQuery = signal('');

//   // Your original library data
//   library = signal([
//     { id: '1', title: 'Neon Lights', artist: 'Synthwave Pro', duration: '3:45', type: 'track' },
//     { id: '2', title: 'Station ID 01', artist: 'RadioSkin', duration: '0:15', type: 'jingle' },
//     { id: '3', title: 'Midnight Drive', artist: 'Retro Wave', duration: '4:10', type: 'track' },
//     { id: '4', title: 'Urban Jungle', artist: 'Beat Master', duration: '2:55', type: 'track' }
//   ]);

//   // 2. Create a computed signal that reacts to searchQuery changes
//   filteredLibrary = computed(() => {
//     const query = this.searchQuery().toLowerCase();
//     if (!query) return this.library();

//     return this.library().filter(item =>
//       item.title.toLowerCase().includes(query) ||
//       item.artist.toLowerCase().includes(query)
//     );
//   });

//   // 3. Update the search value
//   onSearch(event: Event) {
//     const input = event.target as HTMLInputElement;
//     this.searchQuery.set(input.value);
//   }

//   // ... rest of your drop and toggle methods
// }
