
import { Injectable, signal, OnDestroy } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdvertService implements OnDestroy {
  private ads = [
    {  image: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/artworks%2FAll-and-Everything-African-e1722151468328.webp?alt=media&token=5ea9330a-87a4-4eb0-aaeb-595afc8c168e', link: 'https://sponsor1.com' },
    { image: 'https://radioafricana.com/wp-content/uploads/2020/06/Music_-Gossip_-News-e1722151331460.webp', link: 'https://sponsor2.com' },
    { image: 'https://radioafricana.com/wp-content/uploads/2020/06/Looking-for-Hits-2-e1722151347615.webp', link: 'https://sponsor3.com' }
  ];

  currentAd = signal(this.ads[0]);
  private intervalId?: any;

  constructor() {
    this.startRotation();
  }

  private startRotation() {
    let index = 0;
    this.intervalId = setInterval(() => {
      index = (index + 1) % this.ads.length;
      this.currentAd.set(this.ads[index]);
    }, 30000); // 30 seconds
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
