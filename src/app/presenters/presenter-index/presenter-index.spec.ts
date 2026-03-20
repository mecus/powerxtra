import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenterIndex } from './presenter-index';

describe('PresenterIndex', () => {
  let component: PresenterIndex;
  let fixture: ComponentFixture<PresenterIndex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresenterIndex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresenterIndex);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
