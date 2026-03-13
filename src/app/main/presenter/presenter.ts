// presenter.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresenterService } from '../../core/services/presenter/presenter.service';
import { AudioUploadComponent } from '../../shared';
import { PlaylistBuilder } from "../../shared/components/playlist-builder/playlist-builder";

@Component({
  selector: 'app-presenter',
  imports: [CommonModule, FormsModule, AudioUploadComponent, PlaylistBuilder],
  templateUrl: './presenter.html',
  styleUrl: './presenter.scss',
})
export class Presenter {

  track = '';
  micStatus = 'OFF';

  constructor(private presenter: PresenterService) {}

  handleUpload(data:any){
    console.log("Audio file:", data.file);
    console.log("Metadata:", data.metadata);
  }

  updateTrack() {
    this.presenter.updateNowPlaying(this.track).subscribe();
  }

  playJingle(id: string) {
    this.presenter.triggerJingle(id).subscribe();
  }

  toggleMic() {
    this.micStatus = this.micStatus === 'OFF' ? 'LIVE' : 'OFF';
  }
}
