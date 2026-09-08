import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiConfiguration } from './api-configuration';

describe('ApiConfiguration', () => {
  let component: ApiConfiguration;
  let fixture: ComponentFixture<ApiConfiguration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiConfiguration],
    }).compileComponents();

    fixture = TestBed.createComponent(ApiConfiguration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
