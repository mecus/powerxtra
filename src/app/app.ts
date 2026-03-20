import { AfterViewInit, Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Sidebar } from './shared/components/sidebar/sidebar';
// import { Player } from './shared/components/player/player';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { RadioPlayer } from "./shared/components/radio-player/radio-player";
import { MatAnchor, MatIconButton } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { select, Store } from '@ngrx/store';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './core/services';
import { MatDialog } from '@angular/material/dialog';
import { SignUp } from './auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDrawerMode } from '@angular/material/sidenav';

const InitailState = {
  authTime: "",
  expirationTime: 0,
  token: "",
  email: "",
  displayName: "",
  accountTyle: "",
  uid: "",
}
const drawer = {open: true, mode: 'side'};
interface Drawer {
  mode?: MatDrawerMode | any,
  open?: boolean
}
interface IMedia {
  media: 'live' | 'autoDJ' | 'ondemand'
}
@Component({
  selector: 'app-root',
  imports: [MatSidenavModule, RouterOutlet,
    Sidebar, RadioPlayer,
    MatAnchor,
    MatIconModule, MatMenuModule, CommonModule,
    MatIconButton, MatDrawer
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, AfterViewInit {
  protected readonly title = signal('radio');
   private platformId = inject(PLATFORM_ID);
  currentUser;
  user = signal(InitailState);
  isLogin = signal(false);
  drawer = signal<Drawer>(drawer);
  mediaState = signal<IMedia>({media: 'autoDJ'});
  constructor(private store: Store<any>,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ){
    if (isPlatformBrowser(this.platformId)){
      const user = localStorage.getItem("auth");
      if(user) {
        this.currentUser = JSON.parse(user);
         this.isLogin.set(true);
        this.store.dispatch({type: '[USER] Init User', user: this.currentUser});
      }
     }

  }
  toggleMenu() {
    if(this.drawer().open){
      this.store.dispatch({type: '[ Drawer ] State', open: false});
      this.drawer.set({open: false, mode: 'side'})
      // this.store.dispatch({type: '[ Drawer ] Mode', mode: 'push'});
    }else{
      this.store.dispatch({type: '[ Drawer ] State', open: true});
       this.drawer.set({open: true, mode: 'side'})
      // this.store.dispatch({type: '[ Drawer ] Mode', mode: 'push'});
    }

  }
  login(){
    this.dialog.open(SignUp, {}).afterClosed().subscribe();
  }
  logOut(){
    this.authService.logout().then((res) => {
      if (isPlatformBrowser(this.platformId)){
        localStorage.removeItem("auth");
      }
      this.currentUser = null;
      this.isLogin.set(false);
      this.store.dispatch({type: '[USER] Sign Off'});
      this.snackBar.open('You have been sign off', 'X', {duration: 5000});
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
    this.store.pipe(select('drawer')).subscribe((data: any) => {
      console.log(data)
      this.drawer.set(data);
    });
     this.store.pipe(select('media')).subscribe((data: any) => {
      console.log(data)
      this.mediaState.set(data);
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

