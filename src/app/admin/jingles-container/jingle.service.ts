import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class JingleService {

  private audio = new Audio();

  playJingle(url: string) {

    this.audio.src = url;
    this.audio.load();
    this.audio.play();

  }

}
