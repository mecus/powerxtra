import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupLibrary } from './popup-library';

describe('PopupLibrary', () => {
  let component: PopupLibrary;
  let fixture: ComponentFixture<PopupLibrary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupLibrary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupLibrary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
