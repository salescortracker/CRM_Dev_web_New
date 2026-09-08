import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelephonyConfiguration } from './telephony-configuration';

describe('TelephonyConfiguration', () => {
  let component: TelephonyConfiguration;
  let fixture: ComponentFixture<TelephonyConfiguration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelephonyConfiguration],
    }).compileComponents();

    fixture = TestBed.createComponent(TelephonyConfiguration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
