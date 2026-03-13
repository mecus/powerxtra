
// presenter.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PresenterService {
  constructor(private http: HttpClient) {}

  updateNowPlaying(track: string): Observable<any> {
    return this.http.post('/api/now-playing', { track });
  }

  triggerJingle(jingleId: string) {
    return this.http.post('/api/play-jingle', { jingleId });
  }
}
