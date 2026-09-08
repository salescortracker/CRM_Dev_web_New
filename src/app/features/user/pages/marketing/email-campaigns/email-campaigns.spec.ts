import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailCampaigns } from './email-campaigns';

describe('EmailCampaigns', () => {
  let component: EmailCampaigns;
  let fixture: ComponentFixture<EmailCampaigns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailCampaigns],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailCampaigns);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
