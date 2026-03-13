import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CrossfadeService {

  private currentAudio!: HTMLAudioElement;
  private nextAudio!: HTMLAudioElement;

  crossfade(nextUrl: string, duration = 5) {

    this.nextAudio = new Audio(nextUrl);
    this.nextAudio.volume = 0;

    this.nextAudio.play();

    const step = 0.05;
    const interval = (duration * 1000) / (1 / step);

    const fade = setInterval(() => {

      if (this.currentAudio.volume > 0) {
        this.currentAudio.volume -= step;
      }

      if (this.nextAudio.volume < 1) {
        this.nextAudio.volume += step;
      }

      if (this.nextAudio.volume >= 1) {
        clearInterval(fade);
        this.currentAudio.pause();
        this.currentAudio = this.nextAudio;
      }

    }, interval);
  }

  setCurrent(audio: HTMLAudioElement) {
    this.currentAudio = audio;
  }

}
