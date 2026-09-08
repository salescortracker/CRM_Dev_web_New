import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsCampaigns } from './sms-campaigns';

describe('SmsCampaigns', () => {
  let component: SmsCampaigns;
  let fixture: ComponentFixture<SmsCampaigns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmsCampaigns],
    }).compileComponents();

    fixture = TestBed.createComponent(SmsCampaigns);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
