import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalWorkflow } from './approval-workflow';

describe('ApprovalWorkflow', () => {
  let component: ApprovalWorkflow;
  let fixture: ComponentFixture<ApprovalWorkflow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalWorkflow],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalWorkflow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
