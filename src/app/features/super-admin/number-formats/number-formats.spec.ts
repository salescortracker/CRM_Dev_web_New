import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberFormats } from './number-formats';

describe('NumberFormats', () => {
  let component: NumberFormats;
  let fixture: ComponentFixture<NumberFormats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberFormats],
    }).compileComponents();

    fixture = TestBed.createComponent(NumberFormats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
