import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsConfiguration } from './sms-configuration';

describe('SmsConfiguration', () => {
  let component: SmsConfiguration;
  let fixture: ComponentFixture<SmsConfiguration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmsConfiguration],
    }).compileComponents();

    fixture = TestBed.createComponent(SmsConfiguration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
