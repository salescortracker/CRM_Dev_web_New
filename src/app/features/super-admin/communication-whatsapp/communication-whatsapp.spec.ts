import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationWhatsapp } from './communication-whatsapp';

describe('CommunicationWhatsapp', () => {
  let component: CommunicationWhatsapp;
  let fixture: ComponentFixture<CommunicationWhatsapp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunicationWhatsapp],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunicationWhatsapp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
