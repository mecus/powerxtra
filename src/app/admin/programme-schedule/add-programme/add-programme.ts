import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProgrammeService, UserService } from '../../admin-services';
import { AppService, UploadService } from '../../../core/services';

@Component({
  selector: 'app-add-programme',
  standalone: true,
  providers: [provideNativeDateAdapter()], // Required for timepicker logic
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatAutocompleteModule, MatTimepickerModule,
    MatButtonModule, MatIconModule, MatSelectModule
  ],
  templateUrl: './add-programme.html',
  styleUrl: './add-programme.scss',
})
export class AddProgrammeDialog implements OnInit {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<AddProgrammeDialog>);
  public data = inject(MAT_DIALOG_DATA);
  private programmeService = inject(ProgrammeService);
  private uploadService = inject(UploadService);
  private userService = inject(UserService);
  file!: File;

  // Image Sizing: Standardise programme art to 500x500 pixels or similar for consistency across the list.
  // Signal for the image preview
  artworkPreview = signal<string | null>(null);

  // Mock list of registered presenters
  private presenters = signal<string[]>([]) //signal(['DJ Neon', 'DJ Sunrise', 'RadioSkin Bot', 'Alex Rivera']);

  constructor(
     private appService: AppService,
  ){
    console.log(this.data)
    if(this.data.type == "edit"){
      const programme = this.data.programme;
      this.programmeForm.patchValue({
        title: programme.title,
        presenter: programme.presenter,
        category: programme.category,
        startTime: programme.startTime,
        endTime: programme.endTime,
        artwork: programme.artwork,// Stores the File or UR
        description:  programme?.description,
      });
      this.artworkPreview.set(programme.artwork);
    }

  }

  programmeForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    presenter: ['', Validators.required],
    category: ['Live', Validators.required],
    startTime: [null, Validators.required],
    endTime: [null, Validators.required],
    artwork: [null], // Stores the File or URL
    description: ['']
  });

  ngOnInit(): void {
    this.userService.getPresenters({accountType: 'presenter'}).then((res: any) => {
      console.log(res);
      const ps = res?.length? res.map(p => p.displayName) : [];
      console.log(ps)
      this.presenters.update(p => [...p, ...ps]);

    }).catch(err => console.log(err));
  }

  // Reactive signal for filtered presenters
  filteredPresenters = toSignal(
    this.programmeForm.get('presenter')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    ),
    { initialValue: this.presenters() }
  );

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.presenters().filter((p: any) => p.toLowerCase().includes(filterValue));
  }

  async save() {
    if (this.programmeForm.valid) {
      let value = this.programmeForm.value;
      this.appService.startSpinner();
      if(this.file){
        const url = await this.uploadService.uploadImageBlob(this.file, value.title);
        value.artwork = url;
      }
      this.dialogRef.close(value);
    }
  }
   // Handle file selection
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.file = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.artworkPreview.set(reader.result as string);
        this.programmeForm.patchValue({ artwork: file });
      };
      reader.readAsDataURL(file);
    }
  }
}
