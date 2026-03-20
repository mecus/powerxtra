import { Injectable } from '@angular/core';
import { backendApiUrl } from '../../../../environments/backend-api';
import { HttpClient } from '@angular/common/http';
import { IAlbum, ITrack } from '../../interfaces';
import { lastValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private store: Store<any>){

  }
  // Track Section
  createTrack(trackData: ITrack | any) {
    return lastValueFrom(this.http.post(`${backendApiUrl}/api/tracks/create`, trackData));
  }
  listTracks(){
    return this.http.get(`${backendApiUrl}/api/tracks/list`);
  }
  getTrack(ID){
    return lastValueFrom(this.http.get(`${backendApiUrl}/api/tracks/get/${ID}`));
  }
  updateTrack(ID, patch) {
      return lastValueFrom(this.http.patch(`${backendApiUrl}/api/tracks/update/${ID}`, patch));
  }
  deleteTrack(ID){
    return lastValueFrom(this.http.delete(`${backendApiUrl}/api/tracks/delete/${ID}`));
  }

  // Album Section
  createAlbum(album: IAlbum | any) {
    return lastValueFrom(this.http.post(`${backendApiUrl}/api/albums/create`, album));
  }
  updateAlbum(ID, patch) {
    return lastValueFrom(this.http.patch(`${backendApiUrl}/api/albums/update/${ID}`, patch));
  }
  listAlbums(){
    return this.http.get(`${backendApiUrl}/api/albums/list`);
  }
  getAlbum(ID){
    return lastValueFrom(this.http.get(`${backendApiUrl}/api/albums/get/${ID}`));
  }
  deleteAlbum(ID) {
    return lastValueFrom(this.http.delete(`${backendApiUrl}/api/albums/delete/${ID}`));
  }
  addTracksToAlbum(trackListData: {list: []}) {
    return lastValueFrom(this.http.patch(`${backendApiUrl}/api/albums/add_track`, trackListData));
  }
  removeTracksToAlbum(trackListData: {list: [any]}) {
    return lastValueFrom(this.http.patch(`${backendApiUrl}/api/albums/remove_track`, trackListData));
  }

  async loadTrackToStore(){
    try{
      const tracks = await lastValueFrom(this.listTracks());
      console.log("LoadStore", tracks);
      this.store.dispatch({ type: '[ Library ] Load', tracks: tracks });
    }catch(err){
      console.log(err);
    }
  }
}
