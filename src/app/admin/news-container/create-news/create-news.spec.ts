import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNews } from './create-news';

describe('CreateNews', () => {
  let component: CreateNews;
  let fixture: ComponentFixture<CreateNews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNews);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
