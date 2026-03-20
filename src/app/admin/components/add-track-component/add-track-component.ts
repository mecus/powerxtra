import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { lastValueFrom, Observable, of } from 'rxjs';
import { debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../core/services';

@Component({
  selector: 'app-add-track-component',
  templateUrl: './add-track-component.html',
  styleUrl: './add-track-component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatListModule,
    MatIconModule
  ],
})
export class AddTrackComponent {

  public dialogRef = inject(MatDialogRef<AddTrackComponent>);
  public selectedTracks = inject(MAT_DIALOG_DATA); // Array of track objects

  albumControl = new FormControl('');
  filteredAlbums$: Observable<any[]>;
  selectedAlbum = signal<any>(null);

  // Mock Data - Replace with your actual Album Service call
  private mockAlbums;
  // = [
  //   { id: 1, name: 'Midnight City', artist: 'M83', cover: 'https://via.placeholder.com' },
  //   { id: 2, name: 'Random Access Memories', artist: 'Daft Punk', cover: 'https://via.placeholder.com' },
  //   { id: 3, name: 'After Hours', artist: 'The Weeknd', cover: 'https://via.placeholder.com' }
  // ];

  constructor(
    private apiService: ApiService
  ) {
    this.listAlbum();
    this.filteredAlbums$ = this.albumControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.mockAlbums.filter(album =>
      album.name.toLowerCase().includes(filterValue)
    );
  }
  listAlbum() {
    // const albums = await lastValueFrom(this.apiService.listAlbums());
    // console.log(albums);
    // return albums;
    this.apiService.listAlbums().subscribe((data) => {
      console.log(data);
      this.mockAlbums =  data;
    })
  }

  onOptionSelected(event: any) {
    this.selectedAlbum.set(event.option.value);
  }

  confirm() {
    if (this.selectedAlbum()) {
      this.dialogRef.close({
        // album: this.selectedAlbum(),
        // tracks: this.selectedTracks
        list: this.mapTracks(),
        album: this.selectedAlbum()
      });
    }
  }

  mapTracks(){
    // [ {track_id: string, album_id: string, album: string}
    const tracks: Array<any> = this.selectedTracks;
    const album = this.selectedAlbum();
    return tracks.map((track) => {
      return {
        track_id: track._id,
        album_id: album._id,
        album: album.name
      }
    })
  }
}
