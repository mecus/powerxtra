import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-index-component',
  imports: [
    RouterOutlet,
    CommonModule
  ],
  templateUrl: './admin-index-component.html',
  styleUrl: './admin-index-component.scss',
})
export class AdminIndexComponent {

}
