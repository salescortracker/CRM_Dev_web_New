import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationEmails } from './communication-emails';

describe('CommunicationEmails', () => {
  let component: CommunicationEmails;
  let fixture: ComponentFixture<CommunicationEmails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunicationEmails],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunicationEmails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
