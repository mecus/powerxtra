import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { catchError, throwError } from 'rxjs';



export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // 1. Grab your token (usually from localStorage or an AuthService)
   const platformId = inject(PLATFORM_ID);
   let authToken;
     if (isPlatformBrowser(platformId)){
      authToken = localStorage.getItem('auth_token') ?? 'no-token-found';
     }

  // 2. Clone the request to add headers and context
  // Note: Request objects are immutable, so we must clone them.
  const authReq = req.clone({
    setHeaders: {
      Authorization: authToken ? `Bearer ${authToken}` : '',
      // 'X-App-Context': 'PowerXtra', // Custom context header
    }
  });
  if (req.url.includes('firebasestorage.googleapis.com')) {
    return next(req);
  }

  // 3. Pass the cloned request and handle errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';

      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error (401, 404, 500, etc.)
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

        // Specific logic for Auth failure (Spotify-style logout)
        if (error.status === 401) {
          console.warn('Unauthorized! Redirecting to login...');
          // Optional: inject Router and navigate to /login
        }
      }

      console.error(errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};
