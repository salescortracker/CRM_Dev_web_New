import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Workflowrulecondition } from './workflowrulecondition';

describe('Workflowrulecondition', () => {
  let component: Workflowrulecondition;
  let fixture: ComponentFixture<Workflowrulecondition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Workflowrulecondition],
    }).compileComponents();

    fixture = TestBed.createComponent(Workflowrulecondition);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
