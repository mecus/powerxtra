import { AfterViewInit, Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, Router } from '@angular/router';
import { Sidebar } from './shared/components/sidebar/sidebar';
// import { Player } from './shared/components/player/player';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RadioPlayer } from "./shared/components/radio-player/radio-player";
import { MatAnchor, MatIconButton } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { select, Store } from '@ngrx/store';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './core/services';

const InitailState = {
  authTime: "",
  expirationTime: 0,
  token: "",
  email: "",
  displayName: "",
  accountTyle: "",
  uid: "",
}
@Component({
  selector: 'app-root',
  imports: [MatSidenavModule, RouterOutlet,
    Sidebar, RadioPlayer, MatAnchor,
    RouterLinkWithHref, MatIconModule,
    MatMenuModule, CommonModule, MatIconButton],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, AfterViewInit {
  protected readonly title = signal('radio');
   private platformId = inject(PLATFORM_ID);
  currentUser;
  user = signal(InitailState);
  isLogin = signal(false);
  constructor(private store: Store<any>, private authService: AuthService, private router: Router){
    if (isPlatformBrowser(this.platformId)){
      const user = localStorage.getItem("auth");
      if(user) {
        this.currentUser = JSON.parse(user);
         this.isLogin.set(true);
        this.store.dispatch({type: '[USER] Init User', user: this.currentUser});
      }
     }

  }
  logOut(){
    this.authService.logout().then((res) => {
      if (isPlatformBrowser(this.platformId)){
        localStorage.removeItem("auth");
      }
      this.currentUser = null;
      this.isLogin.set(false);
      this.store.dispatch({type: '[USER] Init User', user: null});
      this.router.navigate(["/"]);
    }).catch(err => console.log(err));
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)){
      const user = localStorage.getItem("auth");
      console.log(user)
      if(user) {
        this.currentUser = JSON.parse(user);
        this.store.dispatch({type: '[USER] Init User', user: this.currentUser});
      }
     }
    this.store.pipe(select('user')).subscribe((data: any) => {
      console.log(data)
      if(data?.token){
        this.isLogin.set(true);
        this.user.set(data);
      }

    });
  }
  ngAfterViewInit(): void {
     if (isPlatformBrowser(this.platformId)){
      const user = localStorage.getItem("auth");
      if(user) {
        this.currentUser = JSON.parse(user);
        this.store.dispatch({type: '[USER] Init User', user: this.currentUser});
      }
     }
    this.store.pipe(select('user')).subscribe((data: any) => {
      console.log(data)
       if(data?.token){
        this.isLogin.set(true);
        this.user.set(data);
      }
    });
  }
  navigateBack(){
    if (isPlatformBrowser(this.platformId)){
      window.history.back();
    }
  }
}

