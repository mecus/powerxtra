// ============================================================
// SHARED PLAYER COMPONENT (Advanced Player UI)
// ============================================================
import { Component, ElementRef, ViewChild, AfterViewInit, OnInit,
  PLATFORM_ID, Inject
 } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RadioService } from '../../../core/services/radio-service/radio.service';

@Component({
  selector: 'app-player',
  imports: [CommonModule],
  templateUrl: './player.html',
  styleUrl: './player.scss',
})

export class Player implements AfterViewInit, OnInit {
  @ViewChild('waveCanvas') canvas!: ElementRef<HTMLCanvasElement>;
  ctx: any;
  constructor(
    public radio: RadioService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // if (!isPlatformBrowser(this.platformId)) return;
    // this.ctx = this.canvas.nativeElement.getContext('2d');
    // if (!this.ctx) return;
  }
  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.ctx = this.canvas.nativeElement.getContext('2d');
    if (!this.ctx) return;

    setInterval(() => {
      this.ctx.clearRect(0, 0, 200, 40);
      for (let i = 0; i < 20; i++) {
        const height = Math.random() * 40;
        this.ctx.fillStyle = '#1DB954';
        this.ctx.fillRect(i * 10, 40 - height, 6, height);
      }
    }, 200);
  }
}
