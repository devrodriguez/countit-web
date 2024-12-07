import { TestBed } from '@angular/core/testing';

import { WorkpointService } from './workpoint.service';

describe('WorkpointService', () => {
  let service: WorkpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
