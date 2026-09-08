import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappCampaigns } from './whatsapp-campaigns';

describe('WhatsappCampaigns', () => {
  let component: WhatsappCampaigns;
  let fixture: ComponentFixture<WhatsappCampaigns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsappCampaigns],
    }).compileComponents();

    fixture = TestBed.createComponent(WhatsappCampaigns);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
