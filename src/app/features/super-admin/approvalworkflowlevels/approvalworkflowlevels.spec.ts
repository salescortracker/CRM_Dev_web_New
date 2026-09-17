import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Approvalworkflowlevels } from './approvalworkflowlevels';

describe('Approvalworkflowlevels', () => {
  let component: Approvalworkflowlevels;
  let fixture: ComponentFixture<Approvalworkflowlevels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Approvalworkflowlevels],
    }).compileComponents();

    fixture = TestBed.createComponent(Approvalworkflowlevels);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
