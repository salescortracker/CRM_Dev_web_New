import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Autoassignmentconditions } from './autoassignmentconditions';

describe('Autoassignmentconditions', () => {
  let component: Autoassignmentconditions;
  let fixture: ComponentFixture<Autoassignmentconditions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Autoassignmentconditions],
    }).compileComponents();

    fixture = TestBed.createComponent(Autoassignmentconditions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
