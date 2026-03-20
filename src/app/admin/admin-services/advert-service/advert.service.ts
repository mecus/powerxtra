
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { IAdvert } from '../../../core/interfaces';
import { backendApiUrl } from '../../../../environments/backend-api';

// import { IAdvert } from '../models/advert.model';

@Injectable({
  providedIn: 'root'
})
export class AdminAdvertService {
  private baseUrl = '/api/adverts';

  constructor(private http: HttpClient) {}

  createAdvert(data): Promise<IAdvert> | any {
    return lastValueFrom(this.http.post<IAdvert>(`${backendApiUrl}/api/adverts/create`, data));
  }

  listAdverts(): Promise<IAdvert[]> {
    return lastValueFrom(this.http.get<IAdvert[]>(`${backendApiUrl}/api/adverts/list`));
  }
  updateAdvert(ID, patch) {
     return lastValueFrom(this.http.patch<IAdvert>(`${backendApiUrl}/api/adverts/update/${ID}`, patch));
  }

  deleteAdvert(ID: string) {
    return lastValueFrom(this.http.delete(`${backendApiUrl}/api/adverts/delete/${ID}`));
  }
}
