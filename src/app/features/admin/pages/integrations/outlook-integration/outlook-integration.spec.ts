import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlookIntegration } from './outlook-integration';

describe('OutlookIntegration', () => {
  let component: OutlookIntegration;
  let fixture: ComponentFixture<OutlookIntegration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutlookIntegration],
    }).compileComponents();

    fixture = TestBed.createComponent(OutlookIntegration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
