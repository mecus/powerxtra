import { Buffer } from 'buffer';
(window as any).Buffer = (window as any).Buffer || Buffer;
(window as any).global = window; // Some libraries also expect 'global'

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));


// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideRouter } from '@angular/router';
// import { provideAnimations } from '@angular/platform-browser/animations';
// import { routes } from './app/app.routes';
// import { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, {
//   providers: [provideRouter(routes), provideAnimations()]
// });


