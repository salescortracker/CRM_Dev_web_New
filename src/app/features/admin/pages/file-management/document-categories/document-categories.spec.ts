import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentCategories } from './document-categories';

describe('DocumentCategories', () => {
  let component: DocumentCategories;
  let fixture: ComponentFixture<DocumentCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentCategories],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentCategories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
