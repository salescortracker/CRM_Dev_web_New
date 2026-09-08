import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineSettings } from './pipeline-settings';

describe('PipelineSettings', () => {
  let component: PipelineSettings;
  let fixture: ComponentFixture<PipelineSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipelineSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(PipelineSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
