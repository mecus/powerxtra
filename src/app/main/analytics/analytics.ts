// analytics.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../core/services/analytics/analytics.service';

@Component({
  selector: 'app-analytics',
  imports: [CommonModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class Analytics implements OnInit {
  stats: any;

  constructor(private analytics: AnalyticsService) {}

  ngOnInit() {
    this.analytics.getListenerStats().subscribe(data => {
      this.stats = data;
    });
  }
}
