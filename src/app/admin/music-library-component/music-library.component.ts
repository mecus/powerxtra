import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

// import { ITrack } from '../../models/track.model';

import { ApiService, AppService } from '../../core/services';
import { ITrack } from '../../core/interfaces';
import { Waveform } from '../components/waveform/waveform';
import { AddTrackComponent } from '../components/add-track-component/add-track-component';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { MatMenuModule } from "@angular/material/menu";
import { EditTrack } from './edit-track/edit-track';
import { TrackDetail } from './track-detail/track-detail';


@Component({
  selector: 'app-music-library',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    Waveform,
    MatMenuModule,
    RouterLink
],
  templateUrl: './music-library.component.html',
  styleUrl: './music-library.component.scss',
})
export class MusicLibraryComponent implements OnInit {
  librarySise = 0;
  tracks: ITrack[] = [];
  filteredTracks: ITrack[] = [];
  selectedTracks = new Set<string>();

  search = '';

  displayedColumns = [
    'select',
    'artwork',
    'title',
    'artist',
    'waveform',
    'duration',
    'actions'
  ];

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private appService: AppService,
    private router: Router,
    private store: Store<any>
  ) {}
  loadCount = 0;
  ngOnInit() {
    this.store.pipe(select('library')).subscribe((library: any) => {
      console.log(library)
      if(library?.tracks?.length){
        this.tracks = library.tracks;
        this.filteredTracks = library.tracks;
        this.librarySise = library?.tracks?.length;
        this.cdr.detectChanges();
      }else{
        if(this.loadCount < 3){
          this.loadCount++;
          this.apiService.loadTrackToStore();
        }
      }
      // this.apiService.loadTrackToStore();
    })

    // this.apiService.listTracks().subscribe((tracks: any) => {
    //   this.tracks = tracks;
    //   this.filteredTracks = tracks;
    //   this.cdr.detectChanges();
    // });

  }

  toggleTrack(track: ITrack | any) {

    if (this.selectedTracks.has(track._id)) {
      this.selectedTracks.delete(track._id);
    } else {
      this.selectedTracks.add(track._id);
    }

  }

  isSelected(track: ITrack | any) {
    return this.selectedTracks.has(track._id);
  }

  searchTracks() {

    const q = this.search.toLowerCase();

    this.filteredTracks = this.tracks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.album?.toLowerCase().includes(q)
    );

  }

  addToPlaylist() {

    const tracks = this.tracks.filter( (t: any) =>
      this.selectedTracks.has(t._id)
    );

    console.log("Add to playlist", tracks);

    this.dialog.open(AddTrackComponent, {
      data: tracks, // Array of tracks to add
      width: '500px',
      panelClass: 'dark-dialog-overlay', // Add global style to remove default padding
      disableClose: true
    }).afterClosed().subscribe((data: {list: [], album: any}) => {
      console.log(data)
      if(data.list.length){
        this.appService.startSpinner(`Adding ${data.list.length} Tracks to Album...`);
        this.apiService.addTracksToAlbum(data).then((res) => {
          console.log(res);
          this.appService.endSpinner();
          this.router.navigate(["/admin/albums/details/"+ data.album._id])
        }).catch(err => {
          console.log(err);
        })
      }
    });

  }
  formatTime(seconds: number): string {
    // console.log("DURAT:", seconds)
    if(seconds == 0) return '0';
    if (isNaN(seconds) || seconds === Infinity) return '0';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  editTrack(track) {
    this.dialog.open(EditTrack, {
      data: track,
      // width: '800px',
      disableClose: true,
      panelClass: 'custom-dark-dialog'
    }).afterClosed().subscribe((data) => {
      console.log(data)
      if(data){
        this.appService.startSpinner("updating track...");
        this.apiService.updateTrack(track._id, data).then((res) => {
          this.appService.endSpinner();
           this.apiService.loadTrackToStore();
        }).catch(err => console.log(err));
      }
    })
  }
  trackDetails(track){
    console.log(track)
    this.dialog.open(TrackDetail, {
      data: track,
      width: "600px",
      disableClose: true,
    })
    .afterClosed().subscribe((data) => {
      if(data.edit){
        this.editTrack(track);
      }
    });
  }
  deleteTrack(track){
    const yes = confirm("Are you sure?");
    if(yes) {
      this.apiService.deleteTrack(track._id).then((res) => {
          this.apiService.loadTrackToStore();
      }).catch(err => console.log(err));
    }
  }
  // const dialogRef = this.dialog.open(AddTracksDialogComponent, {
  //   data: mySelectedTracksArray, // Array of tracks to add
  //   width: '500px',
  //   panelClass: 'dark-dialog-overlay' // Add global style to remove default padding
  // });

  // dialogRef.afterClosed().subscribe(result => {
  //   if (result) {
  //     console.log('Adding tracks to:', result.album.name);
  //     // Call your Firebase/API service here
  //   }
  // });

}
