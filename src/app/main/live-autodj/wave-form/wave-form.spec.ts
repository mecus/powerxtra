import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveForm } from './wave-form';

describe('WaveForm', () => {
  let component: WaveForm;
  let fixture: ComponentFixture<WaveForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaveForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaveForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
