
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingComponent {
    isLoading = signal(true);

  news = signal([
    {
      headline: 'Summer Festival 2026 Lineup',
      date: '2h ago',
      image: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/blog%20image%2Fgas-pipe.webp?alt=media&token=3732b879-ed43-411e-95c3-2ab670e534ef'
    },
    {
      headline: 'New Studio Launch in London',
      date: 'Yesterday',
      image: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/blog%20image%2Fgas-pipe.webp?alt=media&token=3732b879-ed43-411e-95c3-2ab670e534ef'
    }
  ]);

  ngOnInit() {
    // Simulate API fetch delay
    setTimeout(() => this.isLoading.set(false), 1000);
  }
  // Programme Schedule Data
  schedule = signal([
    { time: '08:00', title: 'Breakfast Beats', host: 'DJ Sunrise', live: true, art: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/artworks%2FThank%20You%20Mr.%20D.J.%20%20%7C%7C%20NaijaGreen.Com.jpg?alt=media&token=d20edb11-6a23-4f95-afb3-e3963cac5ca0' },
    { time: '12:00', title: 'Midday Mix', host: 'Sarah J', live: false, art: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/artworks%2FLunch%20Express.jpg?alt=media&token=02d74402-9c43-4667-8a11-0a95c92a228f' },
    { time: '16:00', title: 'Sunset Drive', host: 'Alex Rivera', live: false, art: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/artworks%2FThank%20You%20Mr.%20D.J.%20%20%7C%7C%20NaijaGreen.Com.jpg?alt=media&token=d20edb11-6a23-4f95-afb3-e3963cac5ca0' },
  ]);

  topArtists = signal([
    { name: 'The Weeknd', type: 'artist', genre: 'R&B', image: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/artworks%2FJinja%20.jpg?alt=media&token=7196de43-173e-4af4-aeee-d1734be4e96b' },
    { name: 'Daft Punk', type: 'artist', genre: 'Electronic', image: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/artworks%2FCho%20Cho%20ft.%20Davido%20%26%20Mayorkun%20.jpg?alt=media&token=fb4959e5-ffa5-4be8-aff6-588104457163' },
    { name: 'M83', type: 'artist', genre: 'Synthwave', image: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/artworks%2FWelcome%20to%20lagos.jpg?alt=media&token=b5fac159-15ed-4d32-88d3-68711243756e' },
  ]);

  // Podcasts Section
  // podcasts = signal([
  //   { title: 'Tech Talk Daily', episodes: 42, image: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/artworks%2FLa%20La.jpg?alt=media&token=a3324315-50a6-4ee7-bfa8-dd580438f6cc' },
  //   { title: 'The Music Lab', episodes: 15, image: 'https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/artworks%2FLunch%20Express.jpg?alt=media&token=02d74402-9c43-4667-8a11-0a95c92a228f' },
  // ]);
  podcasts = signal([
    { title: 'The Daily Pulse', host: 'Alex Rivera', episodes: 124, art: 'https://images.unsplash.com' },
    { title: 'Tech Frontiers', host: 'Sarah Chen', episodes: 45, art: 'https://images.unsplash.com' },
    { title: 'Unfiltered Bass', host: 'DJ Neon', episodes: 89, art: 'https://images.unsplash.com' },
    { title: 'The Morning Brew', host: 'Sunrise Crew', episodes: 210, art: 'https://images.unsplash.com' }
  ]);

  seeAllPodcasts() {
    console.log('Navigating to full podcast library...');
  }

  // News Section
  // news = signal([
  //   { headline: 'Summer Festival Lineup Announced', date: '2 hours ago' },
  //   { headline: 'New Studio Opening in London', date: 'Yesterday' }
  // ]);
}
