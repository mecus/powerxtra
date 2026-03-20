import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAlbum } from './edit-album';

describe('EditAlbum', () => {
  let component: EditAlbum;
  let fixture: ComponentFixture<EditAlbum>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAlbum]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAlbum);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
