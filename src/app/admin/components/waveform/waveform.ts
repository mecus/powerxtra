import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  AfterViewInit,
  ViewChild,
  inject,
  PLATFORM_ID
} from '@angular/core';

import WaveSurfer from 'wavesurfer.js';

@Component({
  selector: 'app-waveform',
  standalone: true,
  templateUrl: './waveform.html',
  styleUrl: './waveform.scss',

})
export class Waveform implements AfterViewInit {
 private platformId = inject(PLATFORM_ID);
  @Input() url!: string;

  @ViewChild('wave') waveRef!: ElementRef;

  wavesurfer!: WaveSurfer;

  ngAfterViewInit() {

    if (isPlatformBrowser(this.platformId)){

      this.wavesurfer = WaveSurfer.create({

        container: this.waveRef.nativeElement,

        waveColor: '#555',
        progressColor: '#1db954',
        cursorColor: '#1db954',

        height: 40,
        barWidth: 2,
        barRadius: 2,
        interact: false

      });

      this.wavesurfer.load(this.url);
    }

  }
//   this.wavesurfer = WaveSurfer.create({

//   container: this.waveRef.nativeElement,

//   waveColor: '#555',
//   progressColor: '#1db954',
//   cursorColor: '#1db954',

//   height: 40,
//   barWidth: 2,
//   barRadius: 2,

//   interact: false

// });

  playPreview() {

    this.wavesurfer.play();

  }

  stopPreview() {

    this.wavesurfer.stop();

  }

}
