import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamReports } from './team-reports';

describe('TeamReports', () => {
  let component: TeamReports;
  let fixture: ComponentFixture<TeamReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamReports],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
