import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiscalYear } from './fiscal-year';

describe('FiscalYear', () => {
  let component: FiscalYear;
  let fixture: ComponentFixture<FiscalYear>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiscalYear],
    }).compileComponents();

    fixture = TestBed.createComponent(FiscalYear);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
