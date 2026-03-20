import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertDetail } from './advert-detail';

describe('AdvertDetail', () => {
  let component: AdvertDetail;
  let fixture: ComponentFixture<AdvertDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvertDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
