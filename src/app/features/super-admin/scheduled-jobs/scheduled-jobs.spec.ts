import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledJobs } from './scheduled-jobs';

describe('ScheduledJobs', () => {
  let component: ScheduledJobs;
  let fixture: ComponentFixture<ScheduledJobs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduledJobs],
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduledJobs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
