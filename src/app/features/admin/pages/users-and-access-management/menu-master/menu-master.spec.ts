import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuMaster } from './menu-master';

describe('MenuMaster', () => {
  let component: MenuMaster;
  let fixture: ComponentFixture<MenuMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuMaster],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
