import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesMaster } from './roles-master';

describe('RolesMaster', () => {
  let component: RolesMaster;
  let fixture: ComponentFixture<RolesMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesMaster],
    }).compileComponents();

    fixture = TestBed.createComponent(RolesMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
