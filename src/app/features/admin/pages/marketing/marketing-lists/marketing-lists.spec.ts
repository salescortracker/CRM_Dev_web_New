import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingLists } from './marketing-lists';

describe('MarketingLists', () => {
  let component: MarketingLists;
  let fixture: ComponentFixture<MarketingLists>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketingLists],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketingLists);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
