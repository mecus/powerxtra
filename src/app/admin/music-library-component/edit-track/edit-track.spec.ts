import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTrack } from './edit-track';

describe('EditTrack', () => {
  let component: EditTrack;
  let fixture: ComponentFixture<EditTrack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTrack]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTrack);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
