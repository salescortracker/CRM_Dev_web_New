import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityTypes } from './activity-types';

describe('ActivityTypes', () => {
  let component: ActivityTypes;
  let fixture: ComponentFixture<ActivityTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityTypes],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityTypes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
