import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadSources } from './lead-sources';

describe('LeadSources', () => {
  let component: LeadSources;
  let fixture: ComponentFixture<LeadSources>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadSources],
    }).compileComponents();

    fixture = TestBed.createComponent(LeadSources);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
