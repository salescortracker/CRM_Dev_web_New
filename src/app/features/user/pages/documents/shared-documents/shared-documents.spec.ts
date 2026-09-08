import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDocuments } from './shared-documents';

describe('SharedDocuments', () => {
  let component: SharedDocuments;
  let fixture: ComponentFixture<SharedDocuments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedDocuments],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedDocuments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
