import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSales } from './invoice-sales';

describe('InvoiceSales', () => {
  let component: InvoiceSales;
  let fixture: ComponentFixture<InvoiceSales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceSales],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceSales);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
