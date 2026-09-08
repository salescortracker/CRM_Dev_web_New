import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeZones } from './time-zones';

describe('TimeZones', () => {
  let component: TimeZones;
  let fixture: ComponentFixture<TimeZones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeZones],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeZones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
