import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-spinner.component',
  imports: [MatProgressSpinnerModule, MatDialogModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {
  text = inject(MAT_DIALOG_DATA);
  loadinText = this.text ??  "Loading ...";
  constructor(
    private dialogRef: MatDialogRef<SpinnerComponent>
  ){

  }
}
