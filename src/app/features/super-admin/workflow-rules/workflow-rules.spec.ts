import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowRules } from './workflow-rules';

describe('WorkflowRules', () => {
  let component: WorkflowRules;
  let fixture: ComponentFixture<WorkflowRules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowRules],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkflowRules);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
