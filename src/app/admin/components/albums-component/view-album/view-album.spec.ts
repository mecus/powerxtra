import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAlbum } from './view-album';

describe('ViewAlbum', () => {
  let component: ViewAlbum;
  let fixture: ComponentFixture<ViewAlbum>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAlbum]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAlbum);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
