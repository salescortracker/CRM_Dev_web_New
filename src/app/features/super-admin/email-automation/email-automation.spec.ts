import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAutomation } from './email-automation';

describe('EmailAutomation', () => {
  let component: EmailAutomation;
  let fixture: ComponentFixture<EmailAutomation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailAutomation],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailAutomation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
