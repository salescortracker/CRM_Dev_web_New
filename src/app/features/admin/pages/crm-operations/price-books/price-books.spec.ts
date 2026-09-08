import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceBooks } from './price-books';

describe('PriceBooks', () => {
  let component: PriceBooks;
  let fixture: ComponentFixture<PriceBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceBooks],
    }).compileComponents();

    fixture = TestBed.createComponent(PriceBooks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
