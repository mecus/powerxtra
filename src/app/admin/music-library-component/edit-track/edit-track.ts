import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';


@Component({
  selector: 'app-edit-track',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatSelectModule,
     ReactiveFormsModule, MatDialogModule, MatDatepickerModule,
  ],
  templateUrl: './edit-track.html',
  styleUrl: './edit-track.scss',

})



export class EditTrack {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<EditTrack>);
  public data = inject(MAT_DIALOG_DATA);

  trackForm: FormGroup;
  previewUrl = signal<string>(this.data.artwork || 'assets/placeholder-art.png');
  categorys = signal([
    "international", "commercial", "jingle", "advert", "home grown", "upcoming"
  ]);
  genres = signal([
    "afrobeats", "amapiano", "hip pop", "high life", 'soul', "jazz"
  ]);
  objectType = signal([
    "track", "jingle", "advert", "voiceover", "sfx"
  ])
  constructor() {
    this.trackForm = this.fb.group({
      title: [this.data.title, Validators.required],
      artist: [this.data.artist, Validators.required],
      album: [this.data.album],
      artwork: [this.data.artwork],
      object: [this.data.object || 'track', Validators.required], // New field
      release_date: [this.data.release_date ? new Date(this.data.release_date) : null], // New field
      bitrate: [{ value: this.data.bitrate, disabled: true }], // Read-only metadata
      category: [this.data.category],
      genre: [this.data.genre],
      release_year: [this.data.release_year, [Validators.min(1900), Validators.max(2100)]],
      tags: [this.data.tags]
      // tags: [this.data.tags?.join(', ') || '']
    });
  }

  onSave() {
    if (this.trackForm.valid) {
      const formValue = this.trackForm.getRawValue();
      // Convert tags back to array
      // formValue.tags = formValue.tags.split(',').map((t: string) => t.trim());
      this.dialogRef.close(formValue);
    }
  }
}
