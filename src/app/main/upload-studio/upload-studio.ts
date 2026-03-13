import { Component } from '@angular/core';
import { AudioUploadComponent } from "../../shared";
import { PlaylistBuilder } from "../../shared/components/playlist-builder/playlist-builder";

@Component({
  selector: 'app-upload-studio',
  imports: [AudioUploadComponent, PlaylistBuilder],
  templateUrl: './upload-studio.html',
  styleUrl: './upload-studio.scss',
})
export class UploadStudio {

}
