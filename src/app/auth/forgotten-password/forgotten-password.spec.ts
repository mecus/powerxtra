import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgottenPassword } from './forgotten-password';

describe('ForgottenPassword', () => {
  let component: ForgottenPassword;
  let fixture: ComponentFixture<ForgottenPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgottenPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgottenPassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
