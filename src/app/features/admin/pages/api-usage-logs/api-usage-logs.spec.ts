import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiUsageLogs } from './api-usage-logs';

describe('ApiUsageLogs', () => {
  let component: ApiUsageLogs;
  let fixture: ComponentFixture<ApiUsageLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiUsageLogs],
    }).compileComponents();

    fixture = TestBed.createComponent(ApiUsageLogs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
