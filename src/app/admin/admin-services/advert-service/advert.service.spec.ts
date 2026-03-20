import { TestBed } from '@angular/core/testing';

import { AdminAdvertService } from './advert.service';

describe('AdvertService', () => {
  let service: AdminAdvertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminAdvertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
