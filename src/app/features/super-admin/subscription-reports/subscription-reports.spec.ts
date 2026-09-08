import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionReports } from './subscription-reports';

describe('SubscriptionReports', () => {
  let component: SubscriptionReports;
  let fixture: ComponentFixture<SubscriptionReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionReports],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
