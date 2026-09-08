import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessPolicies } from './access-policies';

describe('AccessPolicies', () => {
  let component: AccessPolicies;
  let fixture: ComponentFixture<AccessPolicies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessPolicies],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessPolicies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
