import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNews } from './list-news';

describe('ListNews', () => {
  let component: ListNews;
  let fixture: ComponentFixture<ListNews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListNews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListNews);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
