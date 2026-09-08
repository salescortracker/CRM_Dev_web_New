import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Localization } from './localization';

describe('Localization', () => {
  let component: Localization;
  let fixture: ComponentFixture<Localization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Localization],
    }).compileComponents();

    fixture = TestBed.createComponent(Localization);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
