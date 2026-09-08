import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformReports } from './platform-reports';

describe('PlatformReports', () => {
  let component: PlatformReports;
  let fixture: ComponentFixture<PlatformReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformReports],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
