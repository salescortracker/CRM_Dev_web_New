import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSessions } from './login-sessions';

describe('LoginSessions', () => {
  let component: LoginSessions;
  let fixture: ComponentFixture<LoginSessions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginSessions],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginSessions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
