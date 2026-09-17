import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationInvoice } from './communication-invoice';

describe('CommunicationInvoice', () => {
  let component: CommunicationInvoice;
  let fixture: ComponentFixture<CommunicationInvoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunicationInvoice],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunicationInvoice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
