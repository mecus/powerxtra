
// analytics.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  getListenerStats() {
    return this.http.get('/api/analytics/listeners');
  }
}
