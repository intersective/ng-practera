import { TestBed } from '@angular/core/testing';

import { NgPracteraService } from './ng-practera.service';

describe('NgPracteraService', () => {
  let service: NgPracteraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgPracteraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
