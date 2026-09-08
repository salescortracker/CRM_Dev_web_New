import { TestBed } from '@angular/core/testing';

import { Spinnerservice } from './spinnerservice';

describe('Spinnerservice', () => {
  let service: Spinnerservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Spinnerservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
