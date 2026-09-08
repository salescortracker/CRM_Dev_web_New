import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorLogs } from './error-logs';

describe('ErrorLogs', () => {
  let component: ErrorLogs;
  let fixture: ComponentFixture<ErrorLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorLogs],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorLogs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
