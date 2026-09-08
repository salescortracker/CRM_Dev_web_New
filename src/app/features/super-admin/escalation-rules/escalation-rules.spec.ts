import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalationRules } from './escalation-rules';

describe('EscalationRules', () => {
  let component: EscalationRules;
  let fixture: ComponentFixture<EscalationRules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscalationRules],
    }).compileComponents();

    fixture = TestBed.createComponent(EscalationRules);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
