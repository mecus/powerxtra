import { Component, Inject, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatButtonModule } from '@angular/material/button'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatIconModule } from '@angular/material/icon'
import { MatChipRemove, MatChipsModule } from '@angular/material/chips'
import { MatCardModule } from '@angular/material/card'
import { ApiService, AppService, UploadService } from '../../../../core/services'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router'
import { select, Store } from '@ngrx/store'
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'




@Component({
  selector: 'app-album-create-component',

  templateUrl: './album-create-component.html',
  styleUrl: './album-create-component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatDialogModule
]
})

export class AlbumCreateComponent {

  albumForm: FormGroup
  artworkPreview: string | null = null
  genres = [
    'Afrobeats',
    'Amapiano',
    'Hip Hop',
    'R&B',
    'Dancehall',
    'Gospel'
  ]

  categories = [
    'Album',
    'EP',
    'Single',
    'Compilation'
  ]

  tags: string[] = []
  file!: File;
  currentUser;
  objectType = "album"; // album | playlist | EP | selection
  constructor(
    private fb: FormBuilder,
    private uploadService : UploadService,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router,
    private appService: AppService,
    private store: Store<any>,
    public dialogRef: MatDialogRef<AlbumCreateComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
   ) {
    this.objectType = data.objectType;
     this.store.pipe(select("user")).subscribe((auth) => {
      console.log(auth)
      this.currentUser = auth;
     });

    this.albumForm = this.fb.group({
      name: [''],
      artist: [''],
      artwork: [''],
      release_date: [''],
      release_year: [''],
      track_counts: [''],
      genre: [''],
      tags: [''],
      category: [''],
      description: ['']
    })
  }
  addTag(event: any) {
    const value = event.value?.trim()
    if (value) {
      this.tags.push(value)
      this.albumForm.patchValue({ tags: this.tags })
    }
    event.chipInput!.clear()
  }
  removeTag(tag: string) {
    this.tags = this.tags.filter(t => t !== tag)
    this.albumForm.patchValue({ tags: this.tags })
  }

  onArtworkSelected(event: any) {
    // console.log(event)
    this.file = event.target.files[0]
    if (!this.file) return
    const reader = new FileReader()
    reader.onload = () => {
      this.artworkPreview = reader.result as string
      this.albumForm.patchValue({ artwork: reader.result })
    }
    reader.readAsDataURL(this.file)
  }

  async submit() {
    if(!this.currentUser) {
      this.snackBar.open("No user present..., Please login to continue",'X');
      return null
    };
    if (this.albumForm.valid) {
      this.appService.startSpinner(`Creating ${this.objectType}...`);
      try{
      const data = this.albumForm.value;
      const filename = data.name;
      const photoUrl = await this.uploadService.uploadImageBlob(this.file, filename);
      data.artwork = photoUrl;

      data.active = true;
      data.status = "active";
      data.createdBy = this.currentUser.displayName;
      data.dateCreated = new Date();
      data.object = this.objectType;
      // console.log('Album Created:', this.albumForm.value)
      const newAlbum: any = await this.apiService.createAlbum(data);
      // console.log(newAlbum);
      if(newAlbum?.status == "error"){
        console.log(newAlbum);
        return this.appService.endSpinner();
      }
      this.snackBar.open('Album was successfully created', 'X', {duration: 5000});
      // this.router.navigate(["/admin/albums"]);
      this.dialogRef.close({
        done: true
      });
      this.appService.endSpinner();
      }catch(err){
        console.log(err);
      }

    }
  }

}
