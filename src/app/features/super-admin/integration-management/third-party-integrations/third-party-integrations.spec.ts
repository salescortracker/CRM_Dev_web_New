import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyIntegrations } from './third-party-integrations';

describe('ThirdPartyIntegrations', () => {
  let component: ThirdPartyIntegrations;
  let fixture: ComponentFixture<ThirdPartyIntegrations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdPartyIntegrations],
    }).compileComponents();

    fixture = TestBed.createComponent(ThirdPartyIntegrations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
