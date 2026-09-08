import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsNotification } from './sms-notification';

describe('SmsNotification', () => {
  let component: SmsNotification;
  let fixture: ComponentFixture<SmsNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmsNotification],
    }).compileComponents();

    fixture = TestBed.createComponent(SmsNotification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
