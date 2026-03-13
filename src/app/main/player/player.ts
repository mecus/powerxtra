
// ============================================================
// SHARED PLAYER COMPONENT (Advanced Player UI)
// ============================================================
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioService } from '../../core/services/radio-service/radio.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.html',
  styleUrl: './player.scss',
  imports: [CommonModule],
})

export class PlayerComponent implements AfterViewInit {
  @ViewChild('waveCanvas') canvas!: ElementRef<HTMLCanvasElement>;

  constructor(public radio: RadioService) {}

  ngAfterViewInit() {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    setInterval(() => {
      ctx.clearRect(0, 0, 200, 40);
      for (let i = 0; i < 20; i++) {
        const height = Math.random() * 40;
        ctx.fillStyle = '#1DB954';
        ctx.fillRect(i * 10, 40 - height, 6, height);
      }
    }, 200);
  }
}
