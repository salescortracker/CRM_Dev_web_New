import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Salestargets } from './salestargets';

describe('Salestargets', () => {
  let component: Salestargets;
  let fixture: ComponentFixture<Salestargets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Salestargets],
    }).compileComponents();

    fixture = TestBed.createComponent(Salestargets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
