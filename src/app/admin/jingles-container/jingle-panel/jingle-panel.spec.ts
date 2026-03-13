import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JinglePanel } from './jingle-panel';

describe('JinglePanel', () => {
  let component: JinglePanel;
  let fixture: ComponentFixture<JinglePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JinglePanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JinglePanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
