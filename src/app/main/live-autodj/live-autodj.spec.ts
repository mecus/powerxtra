import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveAutodj } from './live-autodj';

describe('LiveAutodj', () => {
  let component: LiveAutodj;
  let fixture: ComponentFixture<LiveAutodj>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveAutodj]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveAutodj);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
