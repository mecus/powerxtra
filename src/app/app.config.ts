import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { radioReducer } from './store/radio.reducer';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { authInterceptor } from './core/interceptors';
import { InitializeApp } from '../environments/firebase-config';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { libraryReducer, userReducer } from './store';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideStoreDevtools } from '@ngrx/store-devtools';
// import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    // provideAnimations(),
    provideNativeDateAdapter(),
    provideStore({ radio: radioReducer, user: userReducer, library: libraryReducer }),
     // Enable DevTools
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode in production
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true // Required for Angular to pick up changes correctly in v18/v19/v21
    }),
    provideFirebaseApp(() => initializeApp(InitializeApp)),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    // provideFirestore(() => getFirestore()),
  ]
};

