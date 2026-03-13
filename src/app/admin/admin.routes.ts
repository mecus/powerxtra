import { Routes } from '@angular/router';
// import { AdminIndexComponent } from './admin-index-component/admin-index-component';
import { AudioUploadComponent } from './components/audio-upload-component/audio-upload.component';
import { MusicLibraryComponent } from './music-library-component/music-library.component';
import { AlbumsComponent } from './components/albums-component/albums.component';
// import { AlbumCreateComponent } from './components/albums-component/album-create-component/album-create-component';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { ViewAlbum } from './components/albums-component/view-album/view-album';
import { RadioPlaylist } from './radio-playlist/radio-playlist';

export const AdminRoutes: Routes = [
  {
    path: '',
    component: AdminDashboard
  },
  { path: 'library', component: MusicLibraryComponent },
  { path: 'upload_studio', component: AudioUploadComponent },
  { path: 'albums', component: AlbumsComponent },
  // { path: 'create_album', component: AlbumCreateComponent },
  { path: 'albums/details/:id', component: ViewAlbum },
  { path: 'radio_playlist', component: RadioPlaylist }

]
