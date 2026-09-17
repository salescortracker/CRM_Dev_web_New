import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationSms } from './communication-sms';

describe('CommunicationSms', () => {
  let component: CommunicationSms;
  let fixture: ComponentFixture<CommunicationSms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunicationSms],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunicationSms);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
