import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Emailautomationrecipients } from './emailautomationrecipients';

describe('Emailautomationrecipients', () => {
  let component: Emailautomationrecipients;
  let fixture: ComponentFixture<Emailautomationrecipients>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Emailautomationrecipients],
    }).compileComponents();

    fixture = TestBed.createComponent(Emailautomationrecipients);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
