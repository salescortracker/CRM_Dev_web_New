import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAdministrators } from './company-administrators';

describe('CompanyAdministrators', () => {
  let component: CompanyAdministrators;
  let fixture: ComponentFixture<CompanyAdministrators>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyAdministrators],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyAdministrators);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
