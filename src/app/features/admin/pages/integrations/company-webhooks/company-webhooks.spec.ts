import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyWebhooks } from './company-webhooks';

describe('CompanyWebhooks', () => {
  let component: CompanyWebhooks;
  let fixture: ComponentFixture<CompanyWebhooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyWebhooks],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyWebhooks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
