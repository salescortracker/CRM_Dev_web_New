import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Inherited } from './inherited';

describe('Inherited', () => {
  let component: Inherited;
  let fixture: ComponentFixture<Inherited>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inherited],
    }).compileComponents();

    fixture = TestBed.createComponent(Inherited);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
