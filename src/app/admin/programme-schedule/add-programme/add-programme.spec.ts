import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProgramme } from './add-programme';

describe('AddProgramme', () => {
  let component: AddProgramme;
  let fixture: ComponentFixture<AddProgramme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProgramme]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProgramme);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
