import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessUnits } from './business-units';

describe('BusinessUnits', () => {
  let component: BusinessUnits;
  let fixture: ComponentFixture<BusinessUnits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessUnits],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessUnits);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
