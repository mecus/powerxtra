
import { RadioService } from '../../core/services/radio-service/radio.service';
import { Component, inject, signal, computed, OnInit, OnDestroy, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SocketService } from '../../presenters/socket-service/socket.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'live-radio',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatInputModule, MatTooltipModule],
  templateUrl: './live-radio.html',
  styleUrl: './live-radio.scss',

})
export class LiveRadio implements OnInit, OnDestroy, AfterViewInit {
  socket = inject(SocketService);
  private platformId = inject(PLATFORM_ID);
  // Player State
  isPlaying = signal(false);
  latency = signal(0); // ms

  // Metadata (Usually from a 'metadata' socket event)
  showName = signal('Midnight Melodies');
  presenter = signal('DJ Neon');
  artwork = signal('https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/artworks%2FThank%20You%20Mr.%20D.J.%20%20%7C%7C%20NaijaGreen.Com.jpg?alt=media&token=d20edb11-6a23-4f95-afb3-e3963cac5ca0');

  // Chat State
  newMessage = '';
  messages = signal<{user: string, text: string}[]>([]);
  setInterval$ = interval(1000);
  subInterval: Subscription = new Subscription();

  private readonly MAX_LATENCY = 2.5;

  private audio!: HTMLAudioElement; //= new Audio();
  private mediaSource!: MediaSource;
  private sourceBuffer?: SourceBuffer;
  constructor(
    private radioService: RadioService
  ){
     if (isPlatformBrowser(this.platformId)){
      this.audio = new Audio();
     }
  }

  ngOnInit() {
    this.setupSocketListeners();
  }
  ngAfterViewInit(): void {
    // this.startRadio();
  }

  setupSocketListeners() {
    // Listen for audio chunks
    this.socket.listen<ArrayBuffer>('streamAudio').subscribe(buffer => {
      // console.log("Returns:", buffer)
      if (this.isPlaying()) this.handleBuffer(buffer);
    });

    // Listen for new chat messages
    this.socket.listen<any>('chatMessage').subscribe(msg => {
      this.messages.update(m => [...m, msg]);
    });

    // Latency Calculation Loop
    this.subInterval = this.setInterval$.subscribe(
      () => this.calculateLatency())

  }

  toggleRadio() {
    if (this.isPlaying()) {
      this.stopRadio();
    } else {
      this.startRadio();
    }
  }

  private startRadio() {
    if (isPlatformBrowser(this.platformId)){
      this.audio = new Audio();
      this.mediaSource = new MediaSource();
      this.audio.src = URL.createObjectURL(this.mediaSource);
      console.log(this.audio.src)
      this.mediaSource.onsourceopen = () => {
        console.log("Source is open...")
        this.sourceBuffer = this.mediaSource.addSourceBuffer('audio/webm;codecs=opus');
        this.audio.play();
        this.isPlaying.set(true);
      };
    }
  }

  private stopRadio() {
    if(this.audio) this.audio.pause();
    this.isPlaying.set(false);
    this.latency.set(0);
  }

  private handleBuffer(buffer: ArrayBuffer) {
    if (this.sourceBuffer && !this.sourceBuffer.updating) {
      this.sourceBuffer.appendBuffer(buffer);

      this.syncAudio();
    }
  }

  private calculateLatency() {
    if (this.isPlaying() && this.audio.buffered.length > 0) {
      const liveEdge = this.audio.buffered.end(this.audio.buffered.length - 1);
      const current = this.audio.currentTime;
      this.latency.set(Math.round((liveEdge - current) * 1000));

      // Auto-Sync if latency > 2s
      if (liveEdge - current > 2) this.audio.currentTime = liveEdge - 0.2;
    }
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;
    const msg = { user: 'Listener', text: this.newMessage };
    this.socket.emit('sendMessage', msg);
    this.newMessage = '';
  }
  startLiveRadio() {
    this.radioService.startLiveRadio();
  }
  ngOnDestroy() {
    if(this.subInterval){
      this.subInterval.unsubscribe();
    }
    this.stopRadio();
  }

  private syncAudio() {
    if (this.audio.buffered.length > 0) {
      const bufferedEnd = this.audio.buffered.end(this.audio.buffered.length - 1);
      const currentTime = this.audio.currentTime;
      const drift = bufferedEnd - currentTime;

      // If the drift (latency) exceeds our limit, jump to the live edge
      if (drift > this.MAX_LATENCY) {
        console.warn(`[AudioSync] Drift detected: ${drift.toFixed(2)}s. Syncing to live edge...`);

        // Jump to nearly the end of the buffer (leave 0.3s for safety/smoothness)
        this.audio.currentTime = bufferedEnd - 0.3;

        // Ensure we are playing at normal speed
        this.audio.playbackRate = 1.0;
      }
      // OPTIONAL: Subtle "Catch-up" mode
      // If drift is minor (e.g. 1s), slightly speed up playback to 1.05x
      // until we are synced, instead of a hard jump.
      else if (drift > 1.2) {
        this.audio.playbackRate = 1.05;
      } else {
        this.audio.playbackRate = 1.0;
      }
    }
  }
}
