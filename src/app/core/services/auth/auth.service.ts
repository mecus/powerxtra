import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Auth,
  // createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  authState
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { backendApiUrl } from '../../../../environments/backend-api';
import { lastValueFrom } from 'rxjs';

interface Credential {
  email: string,
  password: string,
  displayName?: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  user$ = authState(this.auth);
//  user$;  //= authState(this.auth);
  constructor(
    private http: HttpClient,
    ){
      // this.user$ = authState(this.auth);
      console.log(this.user$)
    }


  // Email & Password Signup
  signUp(credential: Credential): Promise<any> {
    return lastValueFrom(this.http.post(`${backendApiUrl}/api/auth/create_user`, credential));
  }

  // Email & Password Login
  login(email: string, password: string): Promise<any>{
    return signInWithEmailAndPassword(this.auth, email, password);
    // console.log(promise)
    // return from(promise);
  }

  // Google Login
  loginWithGoogle(): Observable<any> {
    const provider = new GoogleAuthProvider();
    const promise = signInWithPopup(this.auth, provider);
    return from(promise);
  }

  // Logout
  logout(): Promise<any> {
    return signOut(this.auth);
  }
}
