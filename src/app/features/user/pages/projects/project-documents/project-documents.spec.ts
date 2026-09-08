import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDocuments } from './project-documents';

describe('ProjectDocuments', () => {
  let component: ProjectDocuments;
  let fixture: ComponentFixture<ProjectDocuments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDocuments],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDocuments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
