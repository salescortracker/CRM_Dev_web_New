import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicrosoftTeams } from './microsoft-teams';

describe('MicrosoftTeams', () => {
  let component: MicrosoftTeams;
  let fixture: ComponentFixture<MicrosoftTeams>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MicrosoftTeams],
    }).compileComponents();

    fixture = TestBed.createComponent(MicrosoftTeams);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
