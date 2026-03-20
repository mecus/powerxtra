
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { AddProgrammeDialog} from '../add-programme/add-programme';
import { interval, map } from 'rxjs';

@Component({
  selector: 'app-programme-details-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule,
    MatIconModule, MatDividerModule, MatChipsModule,
    DatePipe
  ],
  templateUrl: './programme-detail.html',
  styleUrl: './programme-detail.scss',
})
export class ProgrammeDetailsDialog {
  public data = inject(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef<ProgrammeDetailsDialog>);
  private dialog = inject(MatDialog);

  // Status signal for the "LIVE" indicator
  isLive = signal(this.data.active || false);


  // Real-time signals
  listenerCount = signal(1240); // Mock: This would normally come from your Socket.io service
  private timerId?: any;

  // Writable signal for current time (updates every second)
  now = signal(new Date());

  // Computed: Calculate the countdown string
  countdown = computed(() => {
    if (this.data.active) return 'NOW PLAYING';

    const target = new Date(); // Mock: Logic to find the next occurrence of this.data.startTime
    // For demo, we assume the next start is today at data.startTime
    const [hours, mins] = this.data.startTime.split(':').map(Number);
    target.setHours(hours, mins, 0, 0);

    const diff = target.getTime() - this.now().getTime();
    if (diff <= 0) return 'STARTING SOON';

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    return `${h}h ${m}m ${s}s`;
  });
  setInterval$ = interval(1000);
  subInterval;
  ngOnInit() {
    // Start the countdown timer
    this.subInterval = this.setInterval$.subscribe(() => this.now.set(new Date()));

    // Optional: Randomly fluctuate listener count for "live" feel
    setInterval(() => this.listenerCount.update(c => c + (Math.random() > 0.5 ? 1 : -1)), 3000);
  }

  ngOnDestroy() {
    if (this.subInterval) this.subInterval.unsubscribe();
  }

  switchToEdit() {
    this.dialogRef.close();
    this.dialog.open(AddProgrammeDialog, {
      data: { programme: this.data, type: "edit" },
      width: '600px',
      disableClose: true,
      panelClass: 'dark-radio-dialog'
    });
  }
}
