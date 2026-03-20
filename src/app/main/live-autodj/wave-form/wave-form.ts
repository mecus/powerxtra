
import { Component, ElementRef, ViewChild, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AudioAnalyserService } from '../../../core/services/radio-service/radio.service';

@Component({
  selector: 'app-waveform',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #equalizer class="equalizer-canvas"></canvas>`,
  styles: [`.equalizer-canvas { width: 100%; height: 60px; background: rgba(0,0,0,0.2); border-radius: 8px; }`]
})
export class Waveform implements AfterViewInit {
  @ViewChild('equalizer') canvasRef!: ElementRef<HTMLCanvasElement>;
    private platformId = inject(PLATFORM_ID);

  // In a real app, inject your global AudioContext/AnalyserNode
   private analyserService = inject(AudioAnalyserService);
  private analyser = this.analyserService.getAnalyser();

  ngAfterViewInit() {
    this.draw();
  }

  draw() {
    if (isPlatformBrowser(this.platformId)){

      const canvas = this.canvasRef.nativeElement;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const bufferLength = this.analyser.frequencyBinCount;
      // Fix ts(2571): Ensure dataArray is typed as Uint8Array
      const dataArray = new Uint8Array(bufferLength);

      const renderFrame = () => {
        requestAnimationFrame(renderFrame);
        this.analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          // dataArray[i] is now safely accessible as a number
          const barHeight = (dataArray[i] / 255) * canvas.height;

          ctx.fillStyle = '#1DB954'; // Spotify Green
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

          x += barWidth + 1;
        }
      };

      renderFrame();
    }
  }
}
