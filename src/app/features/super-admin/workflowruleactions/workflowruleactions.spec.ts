import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Workflowruleactions } from './workflowruleactions';

describe('Workflowruleactions', () => {
  let component: Workflowruleactions;
  let fixture: ComponentFixture<Workflowruleactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Workflowruleactions],
    }).compileComponents();

    fixture = TestBed.createComponent(Workflowruleactions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
