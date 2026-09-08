import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushNotifications } from './push-notifications';

describe('PushNotifications', () => {
  let component: PushNotifications;
  let fixture: ComponentFixture<PushNotifications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PushNotifications],
    }).compileComponents();

    fixture = TestBed.createComponent(PushNotifications);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
