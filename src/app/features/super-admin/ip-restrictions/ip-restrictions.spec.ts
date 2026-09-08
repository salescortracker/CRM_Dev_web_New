import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpRestrictions } from './ip-restrictions';

describe('IpRestrictions', () => {
  let component: IpRestrictions;
  let fixture: ComponentFixture<IpRestrictions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IpRestrictions],
    }).compileComponents();

    fixture = TestBed.createComponent(IpRestrictions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
