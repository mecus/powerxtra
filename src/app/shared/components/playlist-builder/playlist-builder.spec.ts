import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistBuilder } from './playlist-builder';

describe('PlaylistBuilder', () => {
  let component: PlaylistBuilder;
  let fixture: ComponentFixture<PlaylistBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistBuilder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
