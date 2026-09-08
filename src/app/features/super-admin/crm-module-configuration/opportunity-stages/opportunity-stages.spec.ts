import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityStages } from './opportunity-stages';

describe('OpportunityStages', () => {
  let component: OpportunityStages;
  let fixture: ComponentFixture<OpportunityStages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunityStages],
    }).compileComponents();

    fixture = TestBed.createComponent(OpportunityStages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
