import { Component, signal, inject, OnInit, OnDestroy, ElementRef, ViewChild, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from "@angular/material/menu";
import { SocketService } from '../socket-service/socket.service';

@Component({
  selector: 'app-presenter-deck',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatSliderModule, MatTooltipModule, MatMenuModule],
  templateUrl: './presenter.html',
  styleUrl: './presenter.scss',
})
export class PresenterDeck implements OnInit, OnDestroy {
  private socket = inject(SocketService);
  private mediaRecorder?: MediaRecorder;
  private platformId = inject(PLATFORM_ID);
  // Live State Signals
  isMicOn = signal(false);
  isOnAir = signal(false);
  vuLevel = signal(0); // 0 to 100

  private audioContext?: AudioContext;
  private analyser?: AnalyserNode;
  private stream?: MediaStream;
  private animationId?: number;

  playlist = signal([
    { id: '1', title: 'Midnight City', artist: 'M83', duration: '4:03', status: 'played' },
    { id: '2', title: 'Starboy', artist: 'The Weeknd', duration: '3:50', status: 'playing' },
    { id: '3', title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:22', status: 'up-next' },
    { id: '4', title: 'Nightcall', artist: 'Kavinsky', duration: '4:18', status: 'queued' },
    { id: '5', title: 'After Hours', artist: 'The Weeknd', duration: '6:01', status: 'queued' },
  ]);

  // async toggleMic() {
  //   if (this.isMicOn()) {
  //     this.stopMic();
  //   } else {
  //     await this.startMic();
  //   }
  // }
   async toggleMic() {
    if (this.isMicOn()) {
      this.stopBroadcasting();
    } else {
      await this.startBroadcasting();
    }
  }


  private async startBroadcasting() {
    // 1. Get Mic Stream
    if (isPlatformBrowser(this.platformId)){

      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        this.audioContext = new AudioContext();
        const source = this.audioContext.createMediaStreamSource(this.stream);
        this.analyser = this.audioContext.createAnalyser();
        source.connect(this.analyser);
        this.monitorVolume();
      // 2. Setup MediaRecorder for streaming
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus' // High quality, low latency
      });

      // 3. Emit audio chunks every 200ms
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.socket.emitAudio(event.data);
        }
      };

      this.mediaRecorder.start(200); // Pulse every 200ms
      this.isMicOn.set(true);
      this.isOnAir.set(true);
    }
  }
  private stopBroadcasting() {
    this.mediaRecorder?.stop();
    this.stream?.getTracks().forEach(t => t.stop());
    this.isMicOn.set(false);
    this.isOnAir.set(false);
  }



  private async startMic() {
    try {
      if (isPlatformBrowser(this.platformId)){

        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.audioContext = new AudioContext();
        const source = this.audioContext.createMediaStreamSource(this.stream);
        this.analyser = this.audioContext.createAnalyser();
        source.connect(this.analyser);
        this.isMicOn.set(true);
        this.monitorVolume();
      }
    } catch (err) {
      console.error('Mic access denied', err);
    }

  }

  private monitorVolume() {
    const dataArray = new Uint8Array(this.analyser!.frequencyBinCount);
    const update = () => {
      this.analyser!.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      this.vuLevel.set(Math.min(average * 2, 100)); // Boost for visual effect
      if (isPlatformBrowser(this.platformId))
        this.animationId = requestAnimationFrame(update);
    };
    update();
  }

  private stopMic() {
    this.isMicOn.set(false);
    this.vuLevel.set(0);
    this.stream?.getTracks().forEach(t => t.stop());
    if (isPlatformBrowser(this.platformId)){
      cancelAnimationFrame(this.animationId!);
    }
  }

  ngOnDestroy() { this.stopMic(); }
  ngOnInit() {}
}






// import { inject } from '@angular/core';
// import { SocketService } from '../services/socket.service';

// export class PresenterDeckComponent {
//   private socket = inject(SocketService);
//   private mediaRecorder?: MediaRecorder;

//   async toggleMic() {
//     if (this.isMicOn()) {
//       this.stopBroadcasting();
//     } else {
//       await this.startBroadcasting();
//     }
//   }

//   private async startBroadcasting() {
//     // 1. Get Mic Stream
//     this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

//     // 2. Setup MediaRecorder for streaming
//     this.mediaRecorder = new MediaRecorder(this.stream, {
//       mimeType: 'audio/webm;codecs=opus' // High quality, low latency
//     });

//     // 3. Emit audio chunks every 200ms
//     this.mediaRecorder.ondataavailable = (event) => {
//       if (event.data.size > 0) {
//         this.socket.emitAudio(event.data);
//       }
//     };

//     this.mediaRecorder.start(200); // Pulse every 200ms
//     this.isMicOn.set(true);
//     this.isOnAir.set(true);
//   }

//   private stopBroadcasting() {
//     this.mediaRecorder?.stop();
//     this.stream?.getTracks().forEach(t => t.stop());
//     this.isMicOn.set(false);
//     this.isOnAir.set(false);
//   }
// }









// // presenter.component.ts
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { PresenterService } from '../../core/services/presenter/presenter.service';
// import { AudioUploadComponent } from '../../shared';
// import { PlaylistBuilder } from "../../shared/components/playlist-builder/playlist-builder";

// @Component({
//   selector: 'app-presenter',
//   imports: [CommonModule, FormsModule, AudioUploadComponent, PlaylistBuilder],
//   templateUrl: './presenter.html',
//   styleUrl: './presenter.scss',
// })
// export class Presenter {

//   track = '';
//   micStatus = 'OFF';

//   constructor(private presenter: PresenterService) {}

//   handleUpload(data:any){
//     console.log("Audio file:", data.file);
//     console.log("Metadata:", data.metadata);
//   }

//   updateTrack() {
//     this.presenter.updateNowPlaying(this.track).subscribe();
//   }

//   playJingle(id: string) {
//     this.presenter.triggerJingle(id).subscribe();
//   }

//   toggleMic() {
//     this.micStatus = this.micStatus === 'OFF' ? 'LIVE' : 'OFF';
//   }
// }
