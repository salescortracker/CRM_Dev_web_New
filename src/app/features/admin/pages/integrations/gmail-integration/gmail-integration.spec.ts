import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmailIntegration } from './gmail-integration';

describe('GmailIntegration', () => {
  let component: GmailIntegration;
  let fixture: ComponentFixture<GmailIntegration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GmailIntegration],
    }).compileComponents();

    fixture = TestBed.createComponent(GmailIntegration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
