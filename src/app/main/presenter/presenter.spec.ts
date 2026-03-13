import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Presenter } from './presenter';

describe('Presenter', () => {
  let component: Presenter;
  let fixture: ComponentFixture<Presenter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Presenter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Presenter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
