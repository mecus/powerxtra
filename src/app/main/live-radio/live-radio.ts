import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RadioService } from '../../core/services/radio-service/radio.service';

@Component({
  selector: 'app-live-radio',
  imports: [MatButtonModule ],
  templateUrl: './live-radio.html',
  styleUrl: './live-radio.scss',
})
export class LiveRadio {
  constructor(
    private radioService: RadioService
  ){

  }
  startLiveRadio() {
    this.radioService.startLiveRadio();
  }
}
