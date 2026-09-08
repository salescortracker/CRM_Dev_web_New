import { TestBed } from '@angular/core/testing';

import { ControlsystemService } from './controlsystem-service';

describe('ControlsystemService', () => {
  let service: ControlsystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlsystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
