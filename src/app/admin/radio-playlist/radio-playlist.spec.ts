import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioPlaylist } from './radio-playlist';

describe('RadioPlaylist', () => {
  let component: RadioPlaylist;
  let fixture: ComponentFixture<RadioPlaylist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioPlaylist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioPlaylist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
