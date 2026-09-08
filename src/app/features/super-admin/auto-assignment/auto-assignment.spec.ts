import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoAssignment } from './auto-assignment';

describe('AutoAssignment', () => {
  let component: AutoAssignment;
  let fixture: ComponentFixture<AutoAssignment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoAssignment],
    }).compileComponents();

    fixture = TestBed.createComponent(AutoAssignment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
