import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { AdminAdvertService } from '../services/advert.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminAdvertService } from '../../admin-services';
import { MatFormField, MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTimepickerModule } from '@angular/material/timepicker';

@Component({
  selector: 'app-adverts-create',
  imports:
    [MatSelectModule, MatDatepickerModule, CommonModule,
    MatIconModule, ReactiveFormsModule, FormsModule, MatChipsModule,
    MatButtonModule, MatDialogModule, MatFormField, MatFormFieldModule,
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatAutocompleteModule, MatTimepickerModule,
    MatButtonModule, MatSelectModule
  ],
  templateUrl: './advert-create.html',
  styleUrl: './advert-create.scss',
})
export class AdvertsCreateDialog implements OnInit {
  data = inject(MAT_DIALOG_DATA);
  advertForm!: FormGroup;
  types = ['Banner', 'Popup', 'Video', 'Audio'];
  categories = ['Entertainment', 'Music', 'Sports', 'Education'];
  action = signal('new');
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AdvertsCreateDialog>,
    private advertService: AdminAdvertService,
    private snackBar: MatSnackBar
  ) {
    this.action.set(this.data.type);

  }

  ngOnInit(): void {
    this.advertForm = this.fb.group({
      title: ['', Validators.required],
      business_name: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      type: ['', Validators.required],
      category: ['', Validators.required],
      tags: this.fb.array([]),
      description: [''],
      fileUrl: [''],
      imageUrl: [''],
      videoUrl: [''],
      createdBy: [''],
      status: ['pending'],
      active: [true],
    });
    if(this.data.type == "edit"){
    this.advertForm.patchValue({
      title: this.data.advert.title,
      business_name:this.data.advert.business_name,
      start_date: this.data.advert.start_date,
      end_date: this.data.advert.end_date,
      type: this.data.advert.type,
      category: this.data.advert.category,
      tags: this.data.advert.tags,
      description: this.data.advert.description,
      fileUrl: this.data.advert.fileUrl,
      imageUrl: this.data.advert.imageUrl,
      videoUrl: this.data.advert.videoUrl
    });
    // this.tags.push(this.data.advert.tags);
    }
  }

  get tags(): FormArray {
    return this.advertForm.get('tags') as FormArray;
  }

  addTag(tagInput: HTMLInputElement) {
    const value = tagInput.value.trim();
    if (value) {
      this.tags.push(this.fb.control(value));
      tagInput.value = '';
    }
  }

  removeTag(index: number) {
    this.tags.removeAt(index);
  }

  submit() {
    if (this.advertForm.invalid) {
      return;
    }
    this.dialogRef.close(this.advertForm.value);

    // this.advertService.createAdvert(this.advertForm.value).then((res) => {
    //     this.snackBar.open('Advert created successfully', 'Close', { duration: 3000 });
    //     this.dialogRef.close(true);
    // }).catch(err=> {
    //     console.error(err);
    //     this.snackBar.open('Failed to create advert', 'Close', { duration: 3000 });
    // });
  }

  close() {
    this.dialogRef.close();
  }
}
