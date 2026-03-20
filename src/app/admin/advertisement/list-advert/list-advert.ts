import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { AdvertService } from '../services/advert.service';
// import { IAdvert } from '../models/advert.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { IAdvert } from '../../../core/interfaces';
import { AdminAdvertService } from '../../admin-services';
import { AdvertsCreateDialog } from '../advert-create/advert-create';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatMenuModule } from "@angular/material/menu";

@Component({
  selector: 'app-adverts-list',
  templateUrl: './list-advert.html',
  styleUrl: './list-advert.scss',
  imports: [MatProgressBarModule,
    MatListModule, MatIconModule,
    MatButtonModule, CommonModule, MatCardModule, MatMenuModule],
})
export class ListAdvert implements OnInit {
  adverts = signal<IAdvert[]>([]);
  loading = signal(true);

  constructor(
    private advertService: AdminAdvertService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAdverts();
  }

  loadAdverts() {
    this.loading.set(true);
    this.advertService.listAdverts().then((res: Array<IAdvert>) => {
      console.log(res)
        this.adverts.set(res);
        this.loading.set(false);
    }).catch(err => {
        console.error(err);
        this.snackBar.open('Failed to load adverts', 'Close', { duration: 3000 });
        this.loading.set(false);
    });
  }

  createAdvert() {
    // Open a dialog or navigate to a create page
    console.log('Create advert');
    this.dialog.open(AdvertsCreateDialog, {
      data: { type: "new" },
      disableClose: true,
      width: '600px',
      panelClass: 'dark-dialog-panel'
    }).afterClosed().subscribe((data) => {
      console.log(data)
      if(data){
        this.advertService.createAdvert(data).then((res) => {
          this.loadAdverts();
        this.snackBar.open('Advert created successfully', 'Close', { duration: 3000 });
        }).catch(err=> {
          console.error(err);
          this.snackBar.open('Failed to create advert', 'Close', { duration: 3000 });
        });
      }
    });
  }

  viewAdvert(advert: IAdvert) {
    // Open dialog or navigate to detail page
    console.log('View advert', advert);

  }
  async updateStatus(status, advert) {
    try{
      if(status == 'active'){
        await this.advertService.updateAdvert(advert._id, {active: true, status: "active", published: true});
      }else{
        await this.advertService.updateAdvert(advert._id, {active: false, status: "suspended", published: false});
      }
      this.loadAdverts();
    }catch(err){
      console.log(err);
    }

  }

  updateAdvert(advert: IAdvert) {
    // Open dialog or navigate to edit page
    console.log('Update advert', advert);
     this.dialog.open(AdvertsCreateDialog, {
      data: { type: "edit", advert },
      disableClose: true,
      width: '600px',
      panelClass: 'dark-dialog-panel'
    }).afterClosed().subscribe((data) => {
      console.log(data)
      if(data){
        this.advertService.updateAdvert(advert._id, data).then((res) => {
          this.loadAdverts();
        this.snackBar.open('Advert updated successfully', 'X', { duration: 3000 });
        }).catch(err=> {
          console.error(err);
          this.snackBar.open('Failed to create advert', 'X', { duration: 3000 });
        });
      }
    });
  }

  deleteAdvert(advert: IAdvert | any) {
    if (confirm('Are you sure you want to delete this advert?')) {
      this.advertService.deleteAdvert(advert._id).then((res) => {
          this.snackBar.open('Advert deleted', 'X', { duration: 2000 });
          this.loadAdverts();
      }).catch(err => {
          console.error(err);
          this.snackBar.open('Failed to delete advert', 'X', { duration: 3000 });
      });
    }
  }
}

