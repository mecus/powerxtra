import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammeSchedule } from './programme-schedule';

describe('ProgrammeSchedule', () => {
  let component: ProgrammeSchedule;
  let fixture: ComponentFixture<ProgrammeSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgrammeSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgrammeSchedule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
