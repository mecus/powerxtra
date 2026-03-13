// ============================================================
// 1️⃣ ICECAST / SHOUTCAST METADATA INTEGRATION
// ============================================================

// core/services/stream.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class StreamService {
  constructor(private http: HttpClient) {}

  // Example Icecast JSON endpoint
  getNowPlaying() {
    return this.http
      // .get<any>('https://your-server.com/status-json.xsl')
      .get<any>('https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/audio%2FLouis%20Island%20-%20Somewhere%20New.mp3?alt=media&token=829d78ab-0ecd-48e5-9424-1b1aeea292b9')
      .pipe(
        map(res => {
          const source = res.icestats?.source;
          return {
            title: source?.title || 'Live Stream',
            listeners: source?.listeners || 0
          };
        })
      );
  }
}
