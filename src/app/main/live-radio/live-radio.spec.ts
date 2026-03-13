import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveRadio } from './live-radio';

describe('LiveRadio', () => {
  let component: LiveRadio;
  let fixture: ComponentFixture<LiveRadio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveRadio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveRadio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
