import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Territories } from './territories';

describe('Territories', () => {
  let component: Territories;
  let fixture: ComponentFixture<Territories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Territories],
    }).compileComponents();

    fixture = TestBed.createComponent(Territories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
