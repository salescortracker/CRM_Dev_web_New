import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailConfiguration } from './email-configuration';

describe('EmailConfiguration', () => {
  let component: EmailConfiguration;
  let fixture: ComponentFixture<EmailConfiguration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailConfiguration],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailConfiguration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
