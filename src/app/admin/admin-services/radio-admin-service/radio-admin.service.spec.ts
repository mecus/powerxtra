import { TestBed } from '@angular/core/testing';

import { RadioAdminService } from './radio-admin.service';

describe('RadioAdminService', () => {
  let service: RadioAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadioAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
