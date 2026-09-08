import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberSeries } from './number-series';

describe('NumberSeries', () => {
  let component: NumberSeries;
  let fixture: ComponentFixture<NumberSeries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberSeries],
    }).compileComponents();

    fixture = TestBed.createComponent(NumberSeries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
