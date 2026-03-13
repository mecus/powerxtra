import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { extractAudioMetadata, AudioMetadata } from '../../../core/utils/file-upload-metadate';


@Component({
  selector: 'app-audio-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-upload-component.html',
  styleUrl: './audio-upload-component.scss',
})

export class AudioUploadComponent {

  metadata?: AudioMetadata;
  file?: File;
  loading = false;

  @Output() uploaded = new EventEmitter<{file: File, metadata: AudioMetadata}>();

  async handleFile(file: File) {
    if (!file) return;

    this.loading = true;
    this.file = file;

    this.metadata = await extractAudioMetadata(file);

    this.loading = false;

    this.uploaded.emit({
      file,
      metadata: this.metadata
    });
  }

  onFileInput(event: any) {
    const file = event.target.files[0];
    this.handleFile(file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();

    const file = event.dataTransfer?.files[0];
    if (file) this.handleFile(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
}
