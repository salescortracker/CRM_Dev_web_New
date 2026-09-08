import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsCreate } from './leads-create';

describe('LeadsCreate', () => {
  let component: LeadsCreate;
  let fixture: ComponentFixture<LeadsCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(LeadsCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
