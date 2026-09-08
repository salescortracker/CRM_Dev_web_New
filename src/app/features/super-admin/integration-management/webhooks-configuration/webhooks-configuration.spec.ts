import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebhooksConfiguration } from './webhooks-configuration';

describe('WebhooksConfiguration', () => {
  let component: WebhooksConfiguration;
  let fixture: ComponentFixture<WebhooksConfiguration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebhooksConfiguration],
    }).compileComponents();

    fixture = TestBed.createComponent(WebhooksConfiguration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
