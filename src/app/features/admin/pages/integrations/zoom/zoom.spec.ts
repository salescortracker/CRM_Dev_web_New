import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Zoom } from './zoom';

describe('Zoom', () => {
  let component: Zoom;
  let fixture: ComponentFixture<Zoom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Zoom],
    }).compileComponents();

    fixture = TestBed.createComponent(Zoom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
