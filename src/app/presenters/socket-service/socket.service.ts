import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  // Signal to show "Reconnecting..." in your Radio Skin UI
  isConnected = signal(false);
  reconnected$ = new Subject<void>(); // Tells components to reset their buffers
  private socket: Socket = io('http://localhost:3001', {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });
  constructor() {
    this.socket.on('connect', () => {
      this.isConnected.set(true);
      this.reconnected$.next(); // Trigger a "refresh" for the audio engine
    });

    this.socket.on('disconnect', () => {
      this.isConnected.set(false);
    });

    this.socket.on('reconnect_attempt', () => {
      console.warn('Radio Station signal lost. Retrying...');
    });
  }

  emitAudio(audioBlob: Blob) {
    // Convert Blob to ArrayBuffer for efficient binary transport
    audioBlob.arrayBuffer().then(buffer => {
      // console.log(buffer)
      this.socket.emit('liveAudioChunk', buffer);
    });
  }
    // Add this method to resolve the TS(2339) error
  emit(eventName: string, data: {user: string, text: string}) {
    this.socket.emit(eventName, data);
  }

   /**
   * Generic method to listen to any event from the server
   * @param eventName The name of the socket event (e.g., 'streamAudio')
   */
  listen<T>(eventName: string): Observable<T> {
    return new Observable<T>((subscriber) => {
      this.socket.on(eventName, (data: T) => {
        // console.log("Returned", data)
        subscriber.next(data);
      });

      // Cleanup when the observable is unsubscribed
      return () => {
        this.socket.off(eventName);
      };
    });
  }

  /**
   * Helper specifically for the Audio ArrayBuffer stream
   */
  getAudioStream(): Observable<ArrayBuffer> {
    return this.listen<ArrayBuffer>('streamAudio');
  }
}



// @Injectable({ providedIn: 'root' })
// export class SocketService {
//   // Signal to show "Reconnecting..." in your Radio Skin UI
//   isConnected = signal(false);
//   reconnected$ = new Subject<void>(); // Tells components to reset their buffers

//   private socket: Socket = io('http://localhost:3000', {
//     reconnection: true,
//     reconnectionAttempts: Infinity,
//     reconnectionDelay: 1000,
//     reconnectionDelayMax: 5000,
//     timeout: 20000,
//   });

//   constructor() {
//     this.socket.on('connect', () => {
//       this.isConnected.set(true);
//       this.reconnected$.next(); // Trigger a "refresh" for the audio engine
//     });

//     this.socket.on('disconnect', () => {
//       this.isConnected.set(false);
//     });

//     this.socket.on('reconnect_attempt', () => {
//       console.warn('Radio Station signal lost. Retrying...');
//     });
//   }

//   listen<T>(eventName: string): Observable<T> {
//     return new Observable<T>((sub) => {
//       this.socket.on(eventName, (data: T) => sub.next(data));
//       return () => this.socket.off(eventName);
//     });
//   }
// }
