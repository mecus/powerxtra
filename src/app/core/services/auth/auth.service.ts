import { Injectable, PLATFORM_ID, inject } from '@angular/core';
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
import { isPlatformBrowser } from '@angular/common';
import { Store } from '@ngrx/store';
import { IUser } from '../../interfaces';

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
  private platformId = inject(PLATFORM_ID);
  user$ = authState(this.auth);
  store = inject(Store<any>);
  currentUser;
//  user$;  //= authState(this.auth);
  constructor(
    private http: HttpClient,
    ){
      // this.user$ = authState(this.auth);
      console.log(this.user$)
    }
  getUser(uid) {
    return lastValueFrom(this.http.get(`${backendApiUrl}/api/auth/get_user/${uid}`));
  }

  craeteUserWithoutAuth(user) {
     return lastValueFrom(this.http.post(`${backendApiUrl}/api/auth/create_user_without_auth`, user));
  }

  // Email & Password Signup
  signUp(credential: Credential): Promise<any> {
    return lastValueFrom(this.http.post(`${backendApiUrl}/api/auth/create_user`, credential));
  }

  // Email & Password Login
  login(email: string, password: string): Promise<any>{
    return new Promise(async(resolve, reject) => {
      try{
        const auth = await signInWithEmailAndPassword(this.auth, email, password);

        const auth2: any = await this.auth.currentUser?.getIdTokenResult(true);
        const user: IUser | any = await this.getUser(auth2.claims.user_id);
        console.log(user)
        console.log("Auth", auth2)
        this.currentUser = {
          authTime: auth2?.authTime,
          expirationTime: auth2?.claims.exp,
          token: auth2?.token,
          email: auth2?.claims.email,
          displayName: auth2.claims.name,
          accountType: user?.accountType || auth2.claims.accountType,
          uid: auth2.claims.user_id,
          roles: user? user.roles : null,
          _id: user?._id
        }
        if (isPlatformBrowser(this.platformId)){
          localStorage.setItem("auth", JSON.stringify(this.currentUser));
        }
        this.store.dispatch({type: '[USER] Init User', user: this.currentUser});
        console.log(this.currentUser)
        resolve(this.currentUser);
      }catch(err){
        resolve(null);
      }
    });
    // console.log(promise)
    // return from(promise);
  }

  // Google Login
  loginWithGoogle(): Promise<any>{
    return new Promise(async(resolve, reject) => {
      try{
        const provider = new GoogleAuthProvider();
        const promise = signInWithPopup(this.auth, provider);
        const auth2: any = await this.auth.currentUser?.getIdTokenResult(true);
        let user: IUser | any = await this.getUser(auth2.claims.user_id);
        console.log(user)
        if(!user){
          const data = {
            email: auth2?.claims.email,
            displayName: auth2.claims.name,
            accountType: auth2.claims.accountType,
            uid: auth2.claims.user_id,
            active: true,
            status: 'active',
            start_date: new Date(),
            date_created: new Date(),
            createdBy: auth2.claims.name
          }
          user = await this.craeteUserWithoutAuth(data);
        }
        console.log("Auth", auth2)
        this.currentUser = {
          authTime: auth2?.authTime,
          expirationTime: auth2?.claims.exp,
          token: auth2?.token,
          email: auth2?.claims.email,
          displayName: auth2.claims.name,
          accountType: user?.accountType || auth2.claims.accountType,
          uid: auth2.claims.user_id,
          roles: user? user.roles : null,
          _id: user?._id
        }
        if (isPlatformBrowser(this.platformId)){
          localStorage.setItem("auth", JSON.stringify(this.currentUser));
        }
        this.store.dispatch({type: '[USER] Init User', user: this.currentUser});
        console.log(this.currentUser)
        resolve(this.currentUser);
      }catch(err){
        resolve(null);
      }
    });
  }

  // Logout
  logout(): Promise<any> {
    return signOut(this.auth);
  }
}
