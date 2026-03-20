import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { backendApiUrl } from '../../../../environments/backend-api';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RadioAdminService {
  constructor(
    private http: HttpClient
  ){}

  getStreamingStatus() {
    return lastValueFrom(this.http.get(`${backendApiUrl}/status`));
  }
  startRadio(){
    return lastValueFrom(this.http.get(`${backendApiUrl}/start_auto_dj`));
  }
  stopRadio(){
    return lastValueFrom(this.http.get(`${backendApiUrl}/stop_auto_dj`));
  }
  getPlaylist(){
    return lastValueFrom(this.http.get(`${backendApiUrl}/playlist`));
  }
    /**
   * Syncs the local queue state with the backend.
   * We only send the IDs to keep the payload small.
   */
  async syncQueue(tracks: any[]): Promise<any> {
    const payload = {
      tracks: tracks.map(t => ({
        trackId: t._id,
        type: t.object // Distinguish between 'track' and 'jingle'
      })),
      updatedAt: new Date()
    };

    return lastValueFrom(this.http.patch(`${backendApiUrl}/update_radio_queue`, payload));
  }
   getRadioQueue(){
    return lastValueFrom(this.http.get(`${backendApiUrl}/radio_queue`));
  }
}
