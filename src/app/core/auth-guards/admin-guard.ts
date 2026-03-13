
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
// import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { map, switchMap, of, take } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  // const firestore = inject(Firestore);
  const router = inject(Router);

  return true;
  // return authState(auth).pipe(
  //   take(1), // Take the current auth state
  //   switchMap((user) => {
  //     if (!user) {
  //       // Not logged in? Send to login page
  //       router.navigate(['/login']);
  //       return of(false);
  //     }

  //     // User exists, now check Firestore for the 'admin' role
  //     const userDocRef = doc(firestore, `users/${user.uid}`);
  //     return getDoc(userDocRef);
  //   }),
  //   map((docSnap) => {
  //     if (typeof docSnap === 'boolean') return docSnap; // Already handled by !user check

  //     const userData = docSnap.data();
  //     if (userData && userData['role'] === 'admin') {
  //       return true;
  //     }

  //     // Not an admin? Send to home or access-denied page
  //     router.navigate(['/']);
  //     return false;
  //   })
  // );
};
