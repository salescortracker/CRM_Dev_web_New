import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappConfiguration } from './whatsapp-configuration';

describe('WhatsappConfiguration', () => {
  let component: WhatsappConfiguration;
  let fixture: ComponentFixture<WhatsappConfiguration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsappConfiguration],
    }).compileComponents();

    fixture = TestBed.createComponent(WhatsappConfiguration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
