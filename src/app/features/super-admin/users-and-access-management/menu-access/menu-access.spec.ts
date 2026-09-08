import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAccess } from './menu-access';

describe('MenuAccess', () => {
  let component: MenuAccess;
  let fixture: ComponentFixture<MenuAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuAccess],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuAccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
