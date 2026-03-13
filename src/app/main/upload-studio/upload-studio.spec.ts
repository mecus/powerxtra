import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadStudio } from './upload-studio';

describe('UploadStudio', () => {
  let component: UploadStudio;
  let fixture: ComponentFixture<UploadStudio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadStudio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadStudio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
