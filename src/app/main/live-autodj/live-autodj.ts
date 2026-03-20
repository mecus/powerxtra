import { Component, signal, computed, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { StoreService } from '../../store';
import { AdvertService } from '../../core/services';
import { AudioAnalyserService, RadioService } from '../../core/services/radio-service/radio.service';
import { Waveform } from './wave-form/wave-form';

@Component({
  selector: 'app-autodj',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressBarModule,
    //  Waveform
    ],
  templateUrl: './live-autodj.html',
  styleUrl: './live-autodj.scss',
})
export class LiveAutodj implements AfterViewInit {
  // System State
  bgColor = signal('#121212');
  isActive = signal(false);
  progress = signal(65); // Track percentage
  isPlaying = signal(false);
  constructor(
    private storeService: StoreService,
    public advertService: AdvertService,
    private radioService: RadioService,
    private audioAnalyserService: AudioAnalyserService
  ){
    this.storeService.getRadioState().subscribe((data) => {
      console.log("AutoDJ", data)
      const nowplaying = data.nowPlaying;
      this.nowPlaying.set(nowplaying);
      this.isPlaying.set(data.playing);
      this.isActive.set(data.playing);
    });
  }

  ngAfterViewInit(): void {
    if(!this.isActive()){
      // this.startRadio();
    }
  }
  // Current Track Data
  nowPlaying = signal({
    title: 'Starboy',
    artist: 'The Weeknd',
    artwork: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/artworks%2FBash%20Hall%20Dance.jpg?alt=media&token=c0a053ea-a6c0-4ba7-b829-615f8ac210ad',
    duration: '3:50'
  });

  // Recent History
  history = signal([
    { title: 'Blinding Lights', artist: 'The Weeknd', time: '14:20' },
    { title: 'Nightcall', artist: 'Kavinsky', time: '14:15' },
    { title: 'Midnight City', artist: 'M83', time: '14:10' }
  ]);

  // Advert Slot
  currentAd = signal({
    image: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/artworks%2FAll-and-Everything-African-e1722151468328.webp?alt=media&token=5ea9330a-87a4-4eb0-aaeb-595afc8c168e',
    link: '#'
  });

  // startRadio() {
  //   this.radioService.startLiveRadio();
  //   this.isActive.set(true);

  // }
  async startRadio() {
    this.radioService.startLiveRadio();
    this.isActive.set(true);
  if (this.audioAnalyserService.getAudioContext().state === 'suspended') {
    await this.audioAnalyserService.getAudioContext().resume(); //
  }
  // ... rest of your startup logic
}
  stopRadio() {
    this.radioService.stopLiveRatio();
    this.isActive.set(false);
  }
}
