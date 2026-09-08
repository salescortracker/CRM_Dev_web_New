import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappNotification } from './whatsapp-notification';

describe('WhatsappNotification', () => {
  let component: WhatsappNotification;
  let fixture: ComponentFixture<WhatsappNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsappNotification],
    }).compileComponents();

    fixture = TestBed.createComponent(WhatsappNotification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
