import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadSettings } from './file-upload-settings';

describe('FileUploadSettings', () => {
  let component: FileUploadSettings;
  let fixture: ComponentFixture<FileUploadSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
