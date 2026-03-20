
// ============================================================
// SHARED SIDEBAR COMPONENT
// ============================================================

// 📁 shared/components/sidebar/sidebar.component.ts
import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";
import { MatAnchor } from "@angular/material/button";
import { RadioService } from '../../../core/services/radio-service/radio.service';
import { Media, StoreService } from '../../../store';
import { MatRipple } from '@angular/material/core';


@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule,
    RouterLink, MatIconModule,
    // MatAnchor,
    MatRipple
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {

 public mediaState = signal<Media>({
    media: 'autoDJ'
  });
  isPlaying = signal(false);
  isAdmin = signal(false);
 constructor(
    private radioService: RadioService,
    private media: StoreService,
    private storeService: StoreService,
  ){
    this.storeService.getAuthUser().subscribe((user) => {
      console.log(user)
      if(user.accountType == "admin" || user.accountType == "presenter" || user.accountType == "super"){
        console.log("Is Admin")
        this.isAdmin.set(true);
      }else{
         console.log("Is a General account")
         this.isAdmin.set(false);
      }
    });

    this.storeService.getRadioState().subscribe((data) => {
      console.log("AutoDJ", data)
      const nowplaying = data.nowPlaying;
      // this.nowPlaying.set(nowplaying);
      this.isPlaying.set(data.playing);
      // this.isActive.set(data.playing);
    });

  this.media.getMediaState().subscribe((data: Media) => {
      console.log("SideNav", data)
      this.mediaState.set(data);
    });
  }
  startLiveRadio() {
    this.radioService.startLiveRadio();
  }
}
