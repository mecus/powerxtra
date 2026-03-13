
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterLink, RouterModule } from '@angular/router'

import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatCardModule } from '@angular/material/card'

// import { AlbumService } from '../services/album.service'
// import { Album } from '../models/album.model'
import { ApiService } from '../../../core/services'
import { Album } from './album-model'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { AlbumCreateComponent } from '../..'
import { MatMenuModule } from "@angular/material/menu";

@Component({
  selector: 'app-album-list',
  standalone: true,
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    RouterLink,
    MatMenuModule
]
})
export class AlbumsComponent implements OnInit {
  private cdx = inject(ChangeDetectorRef);
  albums: Album[] = []
  filteredAlbums: Album[] = []

  search = ''
  id = "56478392000";
  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {

    this.apiService.listAlbums().subscribe((data: any) => {
      console.log(data)
      this.albums = data
      this.filteredAlbums = data
      this.cdx.detectChanges();
    })

  }

  searchAlbums() {

    const q = this.search.toLowerCase()

    this.filteredAlbums = this.albums.filter(a =>

      a.name.toLowerCase().includes(q) ||
      a.artist.toLowerCase().includes(q) ||
      a.genre?.toLowerCase().includes(q)

    )

  }
  createAlbum(object: string) {
    this.dialog.open(AlbumCreateComponent, {
      data: {objectType: object},
      disableClose: true
    }).afterClosed().subscribe((data: any) => {
      console.log(data)
      if(data.done){
        this.ngOnInit();
      }
    })
  }

  deleteAlbum(album: Album) {

    if (confirm(`Delete album "${album.name}"?`)) {

      // this.apiService.deleteAlbum(album.name)

    }

  }

}
