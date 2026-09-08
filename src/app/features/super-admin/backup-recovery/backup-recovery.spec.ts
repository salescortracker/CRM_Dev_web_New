import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupRecovery } from './backup-recovery';

describe('BackupRecovery', () => {
  let component: BackupRecovery;
  let fixture: ComponentFixture<BackupRecovery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackupRecovery],
    }).compileComponents();

    fixture = TestBed.createComponent(BackupRecovery);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
