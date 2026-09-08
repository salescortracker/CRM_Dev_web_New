import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketCategories } from './ticket-categories';

describe('TicketCategories', () => {
  let component: TicketCategories;
  let fixture: ComponentFixture<TicketCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketCategories],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketCategories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
