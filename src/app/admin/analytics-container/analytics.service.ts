
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get('/api/radio/stats');
  }

  getGeoStats(): Observable<any> {
    return this.http.get('/api/radio/geo');
  }

}
