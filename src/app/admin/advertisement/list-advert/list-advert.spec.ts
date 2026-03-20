import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAdvert } from './list-advert';

describe('ListAdvert', () => {
  let component: ListAdvert;
  let fixture: ComponentFixture<ListAdvert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAdvert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAdvert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
