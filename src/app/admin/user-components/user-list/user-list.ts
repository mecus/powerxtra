import { Component, signal, computed, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatListModule } from "@angular/material/list";
import { MatDialog } from '@angular/material/dialog';
import { UserEdit } from '../user-edit/user-edit';
import { UserService } from '../../admin-services';
import { AppService } from '../../../core/services';

export interface User {
  id: string;
  displayName: string;
  email: string;
  accountType: 'admin' | 'user' | 'presenter';
  status: 'active' | 'suspended';
  avatar: string;
  _id?: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatButtonModule, MatIconModule,
    MatMenuModule, MatInputModule, MatFormFieldModule, FormsModule,
    MatListModule
],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements AfterViewInit {
  // Mock Data Signal
  users = signal<User[]>([
    { id: '1', displayName: 'Alex Rivera', email: 'alex@radioskin.com', accountType: 'admin', status: 'active', avatar: 'https://i.pravatar.cc' },
    { id: '2', displayName: 'Sarah Chen', email: 'sarah@beats.io', accountType: 'presenter', status: 'active', avatar: 'https://i.pravatar.cc' },
    { id: '3', displayName: 'Jordan Smyth', email: 'j.smyth@web.com', accountType: 'user', status: 'suspended', avatar: 'https://i.pravatar.cc' },
  ]);

  searchQuery = signal('');
  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private appService: AppService
  ){}
  ngAfterViewInit(): void {
    this.userService.listUser().then((res: any) => {
      console.log(res);
      this.users.set(res);
    }).catch(err => console.log(err));
  }

  // Computed signal for instant filtering
  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.users().filter(u =>
      u.displayName?.toLowerCase().includes(query) || u.email?.toLowerCase().includes(query)
    );
  });

  // Action Handlers
  onView(user: User) { console.log('View:', user.displayName); }

  onDelete(user: User) {
    // this.users.update(list => list.filter(u => u.id !== user.id));
    const yes = confirm("Are you sure?");
    if(yes){
      this.appService.startSpinner();
      this.userService.deleteUser(user._id).then((res) => {
        this.appService.endSpinner();
        this.ngAfterViewInit();
      }).catch(err => console.log(err));
    }

  }
  // user-list.component.ts
  onEdit(user: User) {
    const dialogRef = this.dialog.open(UserEdit, {
      data: user,
      width: '600px',
      panelClass: 'dark-radio-dialog',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Update Firebase/Backend with:', result);
        this.appService.startSpinner()
        // Logic to sync with Node.js backend
        this.userService.updateUser(user._id, result).then((res) => {
          console.log(res)
          this.ngAfterViewInit();
          this.appService.endSpinner();
        }).catch(err => console.log(err));
      }
    });
  }

}
