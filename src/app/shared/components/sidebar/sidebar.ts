
// ============================================================
// SHARED SIDEBAR COMPONENT
// ============================================================

// 📁 shared/components/sidebar/sidebar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";
import { MatAnchor } from "@angular/material/button";
import { RadioService } from '../../../core/services/radio-service/radio.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, RouterLink, MatIconModule, MatAnchor],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
 constructor(
    private radioService: RadioService
  ){

  }
  startLiveRadio() {
    this.radioService.startLiveRadio();
  }
}
