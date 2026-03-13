import { Component } from '@angular/core';
import { JingleService } from '../jingle.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jingle-panel',
  imports: [CommonModule],
  templateUrl: './jingle-panel.html',
  styleUrl: './jingle-panel.scss',
})
export class JinglePanel {

  jingles = [
    {name:'Station ID', file:'/assets/jingles/id.mp3'},
    {name:'Sponsor Ad', file:'/assets/jingles/ad.mp3'},
    {name:'Airhorn', file:'/assets/jingles/airhorn.mp3'}
  ];

  constructor(private jingle: JingleService) {}

  trigger(file:string) {
    this.jingle.playJingle(file);
  }

}
