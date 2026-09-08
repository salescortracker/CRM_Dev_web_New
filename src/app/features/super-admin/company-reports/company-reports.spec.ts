import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyReports } from './company-reports';

describe('CompanyReports', () => {
  let component: CompanyReports;
  let fixture: ComponentFixture<CompanyReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyReports],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
