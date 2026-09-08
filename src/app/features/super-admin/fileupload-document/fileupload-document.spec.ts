import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileuploadDocument } from './fileupload-document';

describe('FileuploadDocument', () => {
  let component: FileuploadDocument;
  let fixture: ComponentFixture<FileuploadDocument>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileuploadDocument],
    }).compileComponents();

    fixture = TestBed.createComponent(FileuploadDocument);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
