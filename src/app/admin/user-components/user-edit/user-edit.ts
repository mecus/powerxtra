import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-edit-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatSelectModule, MatIconModule
  ],
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.scss',
})
export class UserEdit {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<UserEdit>);
  public data = inject(MAT_DIALOG_DATA);

  userForm: FormGroup;
  avatarPreview = signal<string>(this.data.avatar || '../../../../assets/avatar.jpg');
  roles = signal([
    "admin", "presenter", "super", "delete", "edit", "none"
  ]);
  uid = signal("");
  constructor() {
    this.userForm = this.fb.group({
      displayName: [this.data.displayName, Validators.required],
      email: [this.data.email, [Validators.required, Validators.email]],
      accountType: [this.data.accountType, Validators.required],
      status: [this.data.status, Validators.required],
      avatar: [this.data.avatar],
      roles: [this.setRoles(this.data.roles)]
    });
    this.uid.set(this.data.uid);
  }
  setRoles(roles: string){
    if(roles){
      const rolez = roles.split(',');
      return rolez;
    }
    return [];
  }

  onSave() {
    if (this.userForm.valid) {
      const value = {
        ...this.userForm.value,
        roles: (this.userForm.value.roles).toString()
      }
      this.dialogRef.close(value);
    }
  }
}
