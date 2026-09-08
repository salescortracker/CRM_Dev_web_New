import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActivities } from './user-activities';

describe('UserActivities', () => {
  let component: UserActivities;
  let fixture: ComponentFixture<UserActivities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserActivities],
    }).compileComponents();

    fixture = TestBed.createComponent(UserActivities);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
