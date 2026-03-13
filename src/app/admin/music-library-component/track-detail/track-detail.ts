
import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-track-details-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule,
    MatIconModule, MatDividerModule, MatChipsModule,
    MatSliderModule
  ],
  providers: [DatePipe],
  templateUrl: './track-detail.html',
  styleUrl: './track-detail.scss',
})
export class TrackDetail {
  public data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<TrackDetail>);

   // Audio State Signals
  audio = new Audio();
  isPlaying = signal(false);
  currentTime = signal(0);
  duration = signal(0);
  constructor() {
    this.audio.src = this.data.file;

    // Listeners for audio events
    this.audio.ontimeupdate = () => this.currentTime.set(this.audio.currentTime);
    this.audio.onloadedmetadata = () => this.duration.set(this.audio.duration);
    this.audio.onended = () => this.isPlaying.set(false);
  }
  // Signal for status badge styling
  statusClass = signal(this.data?.status?.toLowerCase() || 'pending');

  getTags(tags: string) : Array<string>{
    const tagz = tags.split(',');
    return tagz;
  }

  close() {
    this.dialogRef.close();
  }
  editTrack(){
    this.dialogRef.close({edit: true});
  }

  togglePreview() {
    if (this.isPlaying()) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.isPlaying.set(!this.isPlaying());
  }

  onSeek(event: any) {
    const value = event.target.value;
    this.audio.currentTime = value;
    this.currentTime.set(value);
  }

  formatTime(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

  ngOnDestroy() {
    this.audio.pause();
    this.audio.src = '';
    this.audio.load();
  }
}
