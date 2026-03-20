import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { AddProgrammeDialog } from './add-programme/add-programme';
import { ProgrammeService } from '../admin-services';
import { select, Store } from '@ngrx/store';
import { ApiService, AppService } from '../../core/services';
import { ProgrammeDetailsDialog } from './programme-detail/programme-detail';

export interface Programme {
  // id: string;
  title: string;
  presenter: string;
  startTime: string; // e.g., "08:00"
  endTime: string;
  category: 'Live' | 'AutoDJ' | 'Podcast';
  active: boolean;
  artworkUrl?: string; // New field for the show image
  _id?: string;
  artwork?: string;
}

@Component({
  selector: 'app-programme-schedule',
  standalone: true,
  imports: [CommonModule, MatButtonModule,
    MatIconModule, MatCardModule, MatDialogModule,
    MatChipsModule, DatePipe
  ],
  templateUrl: './programme-schedule.html',
  styleUrl: './programme-schedule.scss',
})
export class ProgrammeSchedule implements OnInit {
  private dialog = inject(MatDialog);
  private programmeService = inject(ProgrammeService);
  private currentUser;
  // Signal for the schedule list
  schedule = signal<Programme[]>([
    // { _id: '1', title: 'Breakfast Beats', presenter: 'DJ Sunrise', startTime: '06:00', endTime: '09:00', category: 'Live', active: false },
    // { _id: '2', title: 'The Midday Mix', presenter: 'AutoDJ', startTime: '09:00', endTime: '12:00', category: 'AutoDJ', active: true },
    // { _id: '3', title: 'Deep House Session', presenter: 'DJ Neon', startTime: '12:00', endTime: '15:00', category: 'Live', active: false }
  ]);

  // Computed signal to keep the list sorted by time
  sortedSchedule = computed(() => {
    return [...this.schedule()].sort((a, b) => a.startTime.localeCompare(b.startTime));
  });


  constructor(private store: Store<any>,
    private apiService: ApiService,
    private appService: AppService,
  ){
    this.store.pipe(select("user")).subscribe((auth) => {
      console.log(auth)
      this.currentUser = auth;
    });
  }

  ngOnInit(): void {
    this.programmeService.listProgrammes({}).then((res: any) => {
      console.log(res)
      this.schedule.update(v => [...res]);
    }).catch(err => console.log(err));
  }

  addNewProgramme() {
    // Logic to open a dialog (we can build the Add form next)
    console.log('Opening Add Programme Dialog...');
    this.dialog.open(AddProgrammeDialog, {
      data: {type: "new"},
      disableClose: true
    }).afterClosed().subscribe((data) => {
      console.log(data)
      if(data){
        this.programmeService.createProgramme({...data, createdBy: this.currentUser.displayName}).then((res) => {
          this.ngOnInit();
          this.appService.endSpinner();
        }).catch(err => console.log(err));
      }
    });
  }
  editProgramme(programme){
    this.dialog.open(AddProgrammeDialog, {
        data:{ programme, type: "edit"}
      }).afterClosed().subscribe((data) => {
        console.log(data)
        if(data){
          this.programmeService.updateProgramme( programme._id, data).then((res) => {
            this.ngOnInit();
            this.appService.endSpinner();
          }).catch(err => console.log(err));
        }
    });
  }
  programmeDetails(programme) {
    this.dialog.open(ProgrammeDetailsDialog, {
      data: programme,
      width: "600px"
    }).afterClosed().subscribe((data) => {
      console.log(data)
    })
  }

  deleteProgramme(programme) {
    const yes = confirm("Are you sure?");
    if(yes){
       this.appService.startSpinner();
      // this.schedule.update(list => list.filter(p => p._id !== id));
      this.programmeService.deleteProgramme(programme._id).then((res) => {
        this.ngOnInit();
        this.appService.endSpinner();
      }).catch(err => console.log(err));
    }
  }
}
