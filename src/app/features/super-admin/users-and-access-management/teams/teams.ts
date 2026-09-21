import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { AuthService } from '../../../../core/authentication/services/auth.service';
import { ControlsystemService } from '../../services/controlsystem-service';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teams.html',
  styleUrl: './teams.css',
})
export class Teams implements OnInit {
  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef,

    private authService: AuthService,

    private controlService: ControlsystemService

  ) { }



  ngOnInit(): void {

    this.loadCompanies();

    this.loadRegions();

    this.loadDepartments();

    this.loadAdministrators();

    this.loadTeams();

  }



  showModal = false;

  isEdit = false;

  editId = 0;



  searchText = '';

  departmentFilter = '';

  statusFilter = '';




  // ==============================
  // Company / Region Dropdowns
  // ==============================

  companies: any[] = [];

  regions: any[] = [];


  loadCompanies(): void {

    this.authService
      .getCompanies()
      .subscribe({

        next: (response) => {

          this.companies = (response.data || []).filter(
            (x: any) => x.isActive !== false
          );

        },

        error: (err) => {

          console.error(err);

        }
      });

  }


  loadRegions(): void {

    this.authService
      .getRegions()
      .subscribe({

        next: (response) => {

          this.regions = (response.data || []).filter(
            (x: any) => x.isActive !== false
          );

        },

        error: (err) => {

          console.error(err);

        }
      });

  }


  get formRegions(): any[] {

    if (!this.model.companyId) {
      return [];
    }

    return this.regions.filter(
      r => r.companyId === Number(this.model.companyId)
    );

  }


  onFormCompanyChange(): void {

    this.model.regionId = '';

  }



  // ==============================
  // Department / Team Lead / Members
  // ==============================

  departments: any[] = [];

  administrators: any[] = [];


  loadDepartments(): void {

    this.controlService
      .getDepartments()
      .subscribe({

        next: (res: any) => {

          this.departments = (res?.data || []).filter(
            (x: any) => x.status === true || x.status === 'Active'
          );

          this.cd.detectChanges();

        },

        error: (err) => {

          console.error('Error loading departments:', err);

          this.departments = [];

        }

      });

  }


  loadAdministrators(): void {

    this.controlService
      .getCompanyAdministrators()
      .subscribe({

        next: (res: any) => {

          this.administrators = (res?.data || []).filter(
            (x: any) => x.status === true
          );

          this.cd.detectChanges();

        },

        error: (err) => {

          console.error('Error loading users:', err);

          this.administrators = [];

        }

      });

  }




  teams: any[] = [];


  loadTeams(): void {

    this.spinner.show();

    this.authService
      .getTeams()
      .subscribe({

        next: (response: any) => {

          this.spinner.hide();

          this.teams = this.mapTeams(response.data);

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error(err);

          this.alert.error(
            err?.error?.message || 'Failed to load teams.'
          );

        }
      });

  }


  private mapTeams(data: any[] | undefined): any[] {

    return (data || []).map((x: any) => ({

      id: x.teamId,
      teamName: x.teamName,
      teamCode: x.teamCode,
      companyId: x.companyId,
      regionId: x.regionId,
      departmentId: x.departmentId,
      department: x.departmentName || '',
      teamLeadId: x.teamLeadId,
      teamLead: x.teamLeadName || '',
      description: x.description || '',
      members: x.memberNames || [],
      memberIds: x.memberIds || [],
      createdDate: '-',
      status: x.status ? 'Active' : 'Inactive',
      isDefault: x.isDefault

    }));

  }




  model: any = this.emptyModel();


  emptyModel() {

    return {

      id: 0,
      teamName: '',
      teamCode: '',
      companyId: '',
      regionId: '',
      departmentId: '',
      teamLeadId: '',
      description: '',
      memberSelection: {} as { [id: number]: boolean },
      createdDate: '',
      status: 'Active',
      isDefault: false

    };

  }




  // STATISTICS


  get activeTeams() {

    return this.teams.filter(
      x => x.status === 'Active'
    ).length;

  }


  get inactiveTeams() {

    return this.teams.filter(
      x => x.status === 'Inactive'
    ).length;

  }


  get totalMembers() {

    return this.teams.reduce(
      (total, item) => total + item.members.length,
      0
    );

  }




  // FILTER


  get filteredTeams() {

    return this.teams.filter(item => {

      let search =

        item.teamName
          .toLowerCase()
          .includes(this.searchText.toLowerCase())

        ||

        (item.teamLead || '')
          .toLowerCase()
          .includes(this.searchText.toLowerCase());


      let department =

        this.departmentFilter == ''

        ||

        item.department === this.departmentFilter;


      let status =

        this.statusFilter == ''

        ||

        item.status === this.statusFilter;


      return search && department && status;

    });

  }




  refresh() {

    this.loadTeams();

  }




  openAddModal() {

    this.isEdit = false;

    this.editId = 0;

    this.model = this.emptyModel();

    this.showModal = true;

  }




  closeModal() {

    this.showModal = false;

    this.model = this.emptyModel();

    this.isEdit = false;

    this.editId = 0;

  }




  saveTeam() {

    if (!this.model.teamName.trim()) {

      this.alert.warning(
        'Team Name is required.'
      );

      return;

    }


    if (!this.model.companyId) {

      this.alert.warning(
        'Company is required.'
      );

      return;

    }


    this.spinner.show();


    const memberIds: number[] = Object.keys(this.model.memberSelection)
      .filter(key => this.model.memberSelection[+key])
      .map(key => +key);


    const payload = {

      teamId: this.isEdit ? this.editId : 0,

      companyId: +this.model.companyId,

      regionId: this.model.regionId ? +this.model.regionId : null,

      departmentId: this.model.departmentId ? +this.model.departmentId : null,

      teamLeadId: this.model.teamLeadId ? +this.model.teamLeadId : null,

      teamName: this.model.teamName.trim(),

      description: this.model.description,

      status: this.model.status === 'Active',

      isDefault: this.model.isDefault,

      memberIds: memberIds

    };


    const request$ = this.isEdit

      ? this.authService.updateTeam(payload)

      : this.authService.createTeam(payload);


    request$.subscribe({

      next: (res: any) => {

        this.spinner.hide();

        this.alert.success(res.message);

        this.loadTeams();

        this.closeModal();

        this.cd.detectChanges();

      },

      error: (err) => {

        this.spinner.hide();

        this.alert.error(err?.error?.message || 'Failed to save team.');

      }

    });

  }




  edit(item: any) {

    this.isEdit = true;

    this.editId = item.id;

    const memberSelection: { [id: number]: boolean } = {};

    (item.memberIds || []).forEach((id: number) => {
      memberSelection[id] = true;
    });

    this.model = {

      id: item.id,
      teamName: item.teamName,
      teamCode: item.teamCode,
      companyId: item.companyId || '',
      regionId: item.regionId || '',
      departmentId: item.departmentId || '',
      teamLeadId: item.teamLeadId || '',
      description: item.description,
      memberSelection: memberSelection,
      status: item.status,
      isDefault: item.isDefault

    };

    this.showModal = true;

  }




  delete(id: number) {

    this.alert.deleteConfirm()

      .then(result => {

        if (result.isConfirmed) {

          this.spinner.show();

          this.authService
            .deleteTeam(id)
            .subscribe({

              next: (res: any) => {

                this.spinner.hide();

                this.alert.success(res.message);

                this.loadTeams();

                this.cd.detectChanges();

              },

              error: (err) => {

                this.spinner.hide();

                this.alert.error(err?.error?.message || 'Failed to delete team.');

              }
            });

        }

      });

  }




  clearFilters() {

    this.searchText = '';

    this.departmentFilter = '';

    this.statusFilter = '';

  }
}
