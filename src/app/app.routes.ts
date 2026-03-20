import { Routes } from '@angular/router';
import { AdminRoutes } from './admin';
import { AdminIndexComponent } from './admin/admin-index-component/admin-index-component';
import { adminGuard } from './core/auth-guards/admin-guard';
import { PresenterIndex, PresenterRoutes } from './presenters';
import { LandingComponent, LiveAutodj } from './main';

// ============================================================
// app.routes.ts (Lazy Loaded Feature Architecture)
// ============================================================

export const routes: Routes  = [
  {
    path: '', component: LandingComponent
    // loadComponent: () => import('./main/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'admin',  component: AdminIndexComponent,
    canActivate: [ adminGuard ],
    children: AdminRoutes
  },
  {
    path: 'presenters', component: PresenterIndex,
    children: PresenterRoutes
  },
  {
    path: 'autodj',
    component: LiveAutodj
  },
  // {
  //   path: 'programmes',
  //   loadComponent: () => import('./main/programme-schedule/programme-schedule').then(c => c.ProgrammeSchedule)
  // },
  {
    path: 'podcasts',
    loadComponent: () => import('./main/podcasts/podcasts.component').then(m => m.PodcastsComponent)
  },
  {
    path: 'lifestyle',
    loadComponent: () => import('./main/lifestyle/lifestyle.component').then(m => m.LifestyleComponent)
  },
  // {
  //   path: 'presenter',
  //   loadComponent: () => import('./presenters/presenter/presenter').then(c => c.Presenter)
  // },
  {
    path: 'analytics',
    loadComponent: () => import('./main/analytics/analytics').then(c => c.Analytics)
  },
   {
    path: 'upload_studio',
    loadComponent: () => import('./main/upload-studio/upload-studio').then(c => c.UploadStudio)
  },
  {
    path: 'live',
    loadComponent: () => import('./main/live-radio/live-radio').then(c => c.LiveRadio)
  },

  // {
  //   path: 'auth',
  //   loadComponent: () => import('./auth/user-auth/sign-up').then(c => c.SignUp)
  // },


  // {
  //   path: 'audio_upload',
  //   loadComponent: () => import('./admin/components/audio-upload-component/audio-upload.component').then(c => c.AudioUploadComponent)
  // },
  // {
  //   path: 'library',
  //   loadComponent: () => import('./admin/components/music-library-component/music-library.component').then(c => c.MusicLibraryComponent)
  // },
  // {
  //   path: 'create_album',
  //   loadComponent: () => import('./admin/components/albums-component/album-create-component/album-create-component').then(c => c.AlbumCreateComponent)
  // }


];

