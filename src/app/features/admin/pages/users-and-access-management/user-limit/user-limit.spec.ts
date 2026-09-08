import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLimit } from './user-limit';

describe('UserLimit', () => {
  let component: UserLimit;
  let fixture: ComponentFixture<UserLimit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLimit],
    }).compileComponents();

    fixture = TestBed.createComponent(UserLimit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
