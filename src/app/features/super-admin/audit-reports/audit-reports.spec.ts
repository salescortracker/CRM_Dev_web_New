import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditReports } from './audit-reports';

describe('AuditReports', () => {
  let component: AuditReports;
  let fixture: ComponentFixture<AuditReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditReports],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
