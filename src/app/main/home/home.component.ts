import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SocketService } from '../../presenters/socket-service/socket.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule
  ]
})

export class HomeComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  public socketService = inject(SocketService);
  private mediaSource!: MediaSource;
  private sourceBuffer?: SourceBuffer;
  private audio; // = new Audio();
    // CONFIG: How many seconds of delay do we tolerate before jumping?
  private readonly MAX_LATENCY = 2.5;

  // lastChunk = toSignal(this.socketService.getAudioStream(), { initialValue: null });

  ngOnInit() {
    this.initAudioEngine();
    // The Magic: Whenever the socket reconnects, we restart the engine
    // this.socketService.reconnected$.subscribe(() => {
    //   console.log('Re-initializing audio engine after reconnection...');
    //   this.initAudioEngine();
    // });

    // Listen to the stream
    this.socketService.listen<ArrayBuffer>('streamAudio').subscribe(buffer => {
      if (this.sourceBuffer && !this.sourceBuffer.updating && this.mediaSource.readyState === 'open') {
        try {
          this.sourceBuffer.appendBuffer(buffer);
          this.syncAudio();
        } catch (e) {
          console.error('Buffer error, might need reset:', e);
        }
        this.cleanBuffer();
      }
    });
  }
  private cleanBuffer() {
    if (this.sourceBuffer && !this.sourceBuffer.updating && this.audio.currentTime > 60) {
      // Remove everything from 0 up to 30 seconds before current time
      this.sourceBuffer.remove(0, this.audio.currentTime - 30);
    }
  }

   /**
   * The Sync Logic:
   * Compares the end of the buffered range with current playback time.
   */
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


  private initAudioEngine() {
    if (isPlatformBrowser(this.platformId)){
      this.audio = new Audio();
      this.mediaSource = new MediaSource();
      this.audio.src = URL.createObjectURL(this.mediaSource);
      this.audio.autoplay = true;
      console.log("URL", this.audio.src)

      this.mediaSource.onsourceopen = () => {
        console.log("Source Opening...")
        // Use the same codec as your presenter's MediaRecorder
        this.sourceBuffer = this.mediaSource.addSourceBuffer('audio/webm;codecs=opus');
        this.audio.play().catch(() => console.log('User interaction needed for play'));
      };
    }
  }
  playRadio(){
    console.log(this.audio)
    this.audio.play();
    // if(this.audio) this.audio.play();
  }

  ngOnDestroy() {
     if(this.audio) {
      this.audio.pause();
      this.audio.src = '';
     }

  }
  // setupPlayback() {
  //   this.socketService.getAudioStream().subscribe((buffer: ArrayBuffer) => {
  //     if (this.sourceBuffer && !this.sourceBuffer.updating) {
  //       // Push the raw binary data into the audio engine
  //       this.sourceBuffer.appendBuffer(buffer);
  //       console.log(this.mediaSource)
  //     }
  //   });
  // }
}// Inside your component


// import { Component, inject, OnInit, signal, effect } from '@angular/core';
// import { SocketService } from './socket.service';

// @Component({
//   selector: 'app-radio-listener',
//   standalone: true,
//   template: `
//     <div class="status-indicator">
//       @if (!socketService.isConnected()) {
//         <span class="warning">⚠️ Reconnecting to Live Stream...</span>
//       } @else {
//         <span class="live">● LIVE</span>
//       }
//     </div>
//   `
// })
// export class RadioListenerComponent implements OnInit {
//   socketService = inject(SocketService);
//   private mediaSource!: MediaSource;
//   private sourceBuffer?: SourceBuffer;
//   private audio = new Audio();

//   ngOnInit() {
//     this.initAudioEngine();

//     // The Magic: Whenever the socket reconnects, we restart the engine
//     this.socketService.reconnected$.subscribe(() => {
//       console.log('Re-initializing audio engine after reconnection...');
//       this.initAudioEngine();
//     });

//     // Listen to the stream
//     this.socketService.listen<ArrayBuffer>('streamAudio').subscribe(buffer => {
//       if (this.sourceBuffer && !this.sourceBuffer.updating && this.mediaSource.readyState === 'open') {
//         try {
//           this.sourceBuffer.appendBuffer(buffer);
//         } catch (e) {
//           console.error('Buffer error, might need reset:', e);
//         }
//       }
//     });
//   }

//   private initAudioEngine() {
//     this.mediaSource = new MediaSource();
//     this.audio.src = URL.createObjectURL(this.mediaSource);

//     this.mediaSource.onsourceopen = () => {
//       // Use the same codec as your presenter's MediaRecorder
//       this.sourceBuffer = this.mediaSource.addSourceBuffer('audio/webm;codecs=opus');
//       this.audio.play().catch(() => console.log('User interaction needed for play'));
//     };
//   }
// }


