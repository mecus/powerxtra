import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammeDetail } from './programme-detail';

describe('ProgrammeDetail', () => {
  let component: ProgrammeDetail;
  let fixture: ComponentFixture<ProgrammeDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgrammeDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgrammeDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
