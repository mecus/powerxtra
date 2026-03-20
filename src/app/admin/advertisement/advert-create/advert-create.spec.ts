import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertCreate } from './advert-create';

describe('AdvertCreate', () => {
  let component: AdvertCreate;
  let fixture: ComponentFixture<AdvertCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvertCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
