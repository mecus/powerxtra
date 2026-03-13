import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ApiService } from '../../core/services';


interface AdminLink {
  title: string;
  description: string;
  icon: string;
  path: string;
  color: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})

export class AdminDashboard {
  currentUser;
  constructor(private store: Store<any>, private apiService: ApiService){
    this.store.pipe(select("user")).subscribe((auth) => {
      console.log(auth)
      this.currentUser = auth;
    })
    // this.apiService.loadTrackToStore();
  }
  adminLinks: AdminLink[] = [
    { title: 'User Management', description: 'Manage accounts, roles, and permissions.', icon: 'group', path: '/admin/users', color: '#1DB954' },
    { title: 'Audio Library', description: 'Upload and tag new tracks or podcasts.', icon: 'library_music', path: '/admin/library', color: '#1ed760' },
    { title: 'Albums', description: 'View and manage album.', icon: 'bar_chart', path: '/admin/albums', color: '#ffffff' },
    { title: 'Radio Playlist', description: 'Manage radio playlist.', icon: 'settings', path: '/admin/radio_playlist', color: '#b3b3b3' },

    { title: 'Analytics', description: 'View stream counts and user engagement.', icon: 'bar_chart', path: '/admin/stats', color: '#ffffff' },
    { title: 'System Settings', description: 'Configure API keys and global defaults.', icon: 'settings', path: '/admin/settings', color: '#b3b3b3' },
    { title: 'Push Notifications', description: 'Send alerts to active listeners.', icon: 'notifications_active', path: '/admin/alerts', color: '#1DB954' },
    { title: 'Storage Monitor', description: 'Check Firebase Storage and usage limits.', icon: 'cloud_queue', path: '/admin/storage', color: '#ffffff' },
  ];
}
