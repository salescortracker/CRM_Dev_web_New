import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponsDiscounts } from './coupons-discounts';

describe('CouponsDiscounts', () => {
  let component: CouponsDiscounts;
  let fixture: ComponentFixture<CouponsDiscounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponsDiscounts],
    }).compileComponents();

    fixture = TestBed.createComponent(CouponsDiscounts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
