import { Injectable } from '@angular/core';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from './spinner.component/spinner.component';

@Injectable({
  providedIn: 'root',
})
export class AppService {

  constructor(private dialog: MatDialog){}
  dialogRef;
  startSpinner(text: string = "loading..."){
    this.dialogRef = this.dialog.open(SpinnerComponent, {
      data: text
    });
  }
  endSpinner(){
    if(this.dialogRef){
      this.dialogRef.close();
    }
  }
}
