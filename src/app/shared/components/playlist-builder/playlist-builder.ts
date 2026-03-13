import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DragDropModule,
  CdkDragDrop,
  transferArrayItem,
  moveItemInArray
} from '@angular/cdk/drag-drop';

// import { PlaylistTrack } from './playlist-track.model';
export interface PlaylistTrack {
  title?: string;
  artist?: string;
  duration?: number;
  thumbnail?: string;
  file?: File;
  artwork?: string;
}

@Component({
  selector: 'app-playlist-builder',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './playlist-builder.html',
  styleUrl: './playlist-builder.scss',
})

export class PlaylistBuilder {

  trackLibrary: PlaylistTrack[] = [];

  showSchedule: PlaylistTrack[] = [];

  addTrack(track: PlaylistTrack) {
    this.trackLibrary.push(track);
  }

  drop(event: CdkDragDrop<PlaylistTrack[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

  }

  removeTrack(index: number) {
    this.showSchedule.splice(index, 1);
  }

  getTotalDuration(): number {
    return this.showSchedule.reduce(
      (total, track) => total + (track.duration || 0),
      0
    );
  }
}
