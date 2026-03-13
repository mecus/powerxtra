import { Component, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppService, AuthService } from '../../core/services';
import { Auth, authState } from '@angular/fire/auth';
// import { lastValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  private platformId = inject(PLATFORM_ID);
  authForm: FormGroup;
  isLogin = true;
  hidePassword = true;
  currentUser;
  private auth = inject(Auth);
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private appService: AppService,
    private store: Store<any>,
    private router: Router
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      displayName: ['']
    });
    this.updateValidators();
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.updateValidators();
  }
// async getAuthState(){
//       // this.currentUser = await lastValueFrom(authState(this.auth));
//       // console.log(this.currentUser)
//   }

  private updateValidators() {
    const usernameControl = this.authForm.get('username');
    if (this.isLogin) {
      usernameControl?.clearValidators();
    } else {
      usernameControl?.setValidators([Validators.required]);
    }
    usernameControl?.updateValueAndValidity();
  }
  login(data){
    this.authService.login(data.email, data.password).then(async(auth) => {
      console.log(auth);
       const auth2: any = await this.auth.currentUser?.getIdTokenResult(true);
       console.log("Auth", auth2)
      this.currentUser = {
        authTime: auth2?.authTime,
        expirationTime: auth2?.claims.exp,
        token: auth2?.token,
        email: auth2?.claims.email,
        displayName: auth2.claims.name,
        accountTyle: auth2.claims.accountType,
        uid: auth2.claims.user_id,
      }
       if (isPlatformBrowser(this.platformId)){
        localStorage.setItem("auth", JSON.stringify(this.currentUser));
       }
      this.store.dispatch({type: '[USER] Init User', user: this.currentUser});
      this.appService.endSpinner();
       this.router.navigate(["/"]);
    }).catch(err => {
      console.log(err);
      this.appService.endSpinner();
    });
  }
  createUser(data){
    this.authService.signUp(data).then((user) => {
        if(user) this.login(data);
    }).catch(err => {
      console.log(err);
      this.appService.endSpinner();
    })
  }

  onSubmit() {

    if (this.authForm.valid) {
      const data = this.authForm.value;
      this.appService.startSpinner('login in ..');
      // console.log(this.isLogin ? 'Logging in...' : 'Signing up...', this.authForm.value);
      if(this.isLogin){
        this.login(data);
      }else{
        // create user
        this.createUser(data);
      }
    }
  }
  // auth.component.ts
  // onSubmit() {
  //   if (this.authForm.valid) {
  //     const { email, password } = this.authForm.value;

  //     if (this.isLogin) {
  //       this.authService.login(email, password).subscribe({
  //         next: () => console.log('Login successful'),
  //         error: (err) => console.error('Login failed:', err)
  //       });
  //     } else {
  //       this.authService.signUp(email, password).subscribe({
  //         next: () => console.log('Signup successful'),
  //         error: (err) => console.error('Signup failed:', err)
  //       });
  //     }
  //   }
  // }

  googleLogin() {
    this.authService.loginWithGoogle().subscribe({
      next: () => console.log('Google login successful'),
      error: (err) => console.error('Google login failed:', err)
    });
  }

}
