
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../analytics.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics-dashboard',
  imports: [CommonModule],
  templateUrl: './analytics-dashboard.html',
  styleUrl: './analytics-dashboard.scss',
})

export class AnalyticsDashboard implements OnInit {

  stats: any;
  geo: Array<any> = [];

  constructor(private analytics: AnalyticsService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.analytics.getStats().subscribe(data => {
      this.stats = data;
    });

    this.analytics.getGeoStats().subscribe(data => {
      this.geo = data;
    });
  }
}
