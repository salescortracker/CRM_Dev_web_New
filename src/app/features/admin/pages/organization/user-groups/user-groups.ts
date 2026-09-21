import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { ApiResponse } from '../../../../../core/authentication/services/auth.service';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-user-groups',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './user-groups.html',
  styleUrl: './user-groups.css',
})
export class UserGroups implements OnInit {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  //====================================================
  // Screen Variables
  //====================================================

  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  searchText = '';

  //====================================================
  // Static Options
  //====================================================

  groupTypes = [
    'Administration', 'Sales', 'Marketing', 'Human Resources',
    'Finance', 'Customer Support', 'IT', 'Operations'
  ];

  teams = [
    'Team Alpha', 'Team Bravo', 'Team Charlie', 'Team Delta', 'Team Omega'
  ];

  reportingManagers = [
    'Rahul Sharma', 'Priya Reddy', 'Arjun Kumar', 'Sneha Patel', 'Kiran Verma'
  ];

  defaultRoles = [
    'Administrator', 'Manager', 'Team Lead', 'Executive', 'Employee', 'Viewer'
  ];

  //====================================================
  // Dropdown Data (from backend)
  //====================================================

  departments: any[] = [];
  priorities: any[] = [];

  //====================================================
  // User Groups List
  //====================================================

  userGroups: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  userGroup: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      userGroupId: 0,

      groupName: '',
      groupCode: '',
      groupType: '',

      departmentId: null,
      team: '',
      reportingManager: '',

      defaultRole: '',

      userLimit: null,

      priorityId: null,

      status: null,

      description: ''

    };

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadDepartments();

    this.loadPriorities();

    this.loadUserGroups();

  }

  //====================================================
  // Load Dropdown Data
  //====================================================

  loadDepartments(): void {

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Master/getalldepartment`)
      .subscribe({

        next: (res: any) => {

          this.departments = (res?.data || []).filter(
            (x: any) => x.status !== false
          );

          this.cd.detectChanges();

        },

        error: (err) => {

          console.error('Error loading departments:', err);

          this.departments = [];

        }

      });

  }

  loadPriorities(): void {

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Master/getallpriority`)
      .subscribe({

        next: (res: any) => {

          this.priorities = (res?.data || []).filter(
            (x: any) => x.isActive !== false
          );

          this.cd.detectChanges();

        },

        error: (err) => {

          console.error('Error loading priorities:', err);

          this.priorities = [];

        }

      });

  }

  //====================================================
  // Load User Groups
  //====================================================

  loadUserGroups(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getallusergroup`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.userGroups = res.data || [];

          } else {

            this.userGroups = [];

            this.alert.warning(
              res?.message || 'No User Group records found.'
            );

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Error loading user groups:', err);

          this.userGroups = [];

          this.alert.error(
            err?.error?.message || 'Failed to load user groups.'
          );

          this.cd.detectChanges();

        }

      });

  }

  //====================================================
  // Lookup Helpers (Display Names)
  //====================================================

  getDepartmentName(id: any): string {

    if (id === null || id === undefined || id === '') return '-';

    const item = this.departments.find(
      x => x.departmentId === Number(id)
    );

    return item ? item.departmentName : '-';

  }

  getPriorityName(id: any): string {

    if (id === null || id === undefined || id === '') return '-';

    const item = this.priorities.find(
      x => x.priorityId === Number(id)
    );

    return item ? item.priorityName : '-';

  }

  //====================================================
  // Filtered User Groups
  //====================================================

  get filteredUserGroups() {

    const search = this.searchText.trim().toLowerCase();

    if (!search) return this.userGroups;

    return this.userGroups.filter(x =>

      (x.groupName || '').toLowerCase().includes(search) ||
      (x.groupCode || '').toLowerCase().includes(search) ||
      (x.groupType || '').toLowerCase().includes(search) ||
      (x.team || '').toLowerCase().includes(search) ||
      (x.reportingManager || '').toLowerCase().includes(search) ||
      (x.defaultRole || '').toLowerCase().includes(search) ||
      this.getDepartmentName(x.departmentId).toLowerCase().includes(search)

    );

  }

  get pagedUserGroups() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredUserGroups.slice(start, start + this.pageSize);

  }

  //====================================================
  // Save / Update
  //====================================================

  saveUserGroup(): void {

    this.submitted = true;

    if (
      !this.userGroup.groupName || !this.userGroup.groupName.trim() ||
      !this.userGroup.groupCode || !this.userGroup.groupCode.trim() ||
      !this.userGroup.groupType ||
      !this.userGroup.defaultRole ||
      this.userGroup.status === null
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    if (
      this.userGroup.userLimit !== null &&
      this.userGroup.userLimit !== '' &&
      Number(this.userGroup.userLimit) < 0
    ) {

      this.alert.warning('User Limit cannot be negative.');

      return;

    }

    const payload = {

      userGroupId: this.isEdit ? this.userGroup.userGroupId : 0,

      groupName: this.userGroup.groupName.trim(),
      groupCode: this.userGroup.groupCode.trim(),

      groupType: this.userGroup.groupType
        ? this.userGroup.groupType.trim()
        : null,

      departmentId: this.userGroup.departmentId
        ? Number(this.userGroup.departmentId)
        : null,

      team: this.userGroup.team
        ? this.userGroup.team.trim()
        : null,

      reportingManager: this.userGroup.reportingManager
        ? this.userGroup.reportingManager.trim()
        : null,

      defaultRole: this.userGroup.defaultRole
        ? this.userGroup.defaultRole.trim()
        : null,

      userLimit:
        this.userGroup.userLimit !== null &&
          this.userGroup.userLimit !== ''
          ? Number(this.userGroup.userLimit)
          : null,

      priorityId: this.userGroup.priorityId
        ? Number(this.userGroup.priorityId)
        : null,

      status: !!this.userGroup.status,

      description: this.userGroup.description
        ? this.userGroup.description.trim()
        : null

    };

    this.spinner.show();

    if (this.isEdit) {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/updateusergroup`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'User Group updated successfully.'
              );

              this.clear();

              this.loadUserGroups();

            } else {

              this.alert.warning(
                res?.message || 'Failed to update user group.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Update user group error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to update user group.'
            );

          }

        });

    } else {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/createusergroup`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'User Group created successfully.'
              );

              this.clear();

              this.loadUserGroups();

            } else {

              this.alert.warning(
                res?.message || 'Failed to create user group.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Create user group error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to create user group.'
            );

          }

        });

    }

  }

  //====================================================
  // Edit
  //====================================================

  edit(id: number): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any>>(`${this.baseUrl}/Admin/getbyusergroup/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.userGroup = {

              userGroupId: data.userGroupId,

              groupName: data.groupName || '',
              groupCode: data.groupCode || '',
              groupType: data.groupType || '',

              departmentId: data.departmentId ?? null,
              team: data.team || '',
              reportingManager: data.reportingManager || '',

              defaultRole: data.defaultRole || '',

              userLimit: data.userLimit ?? null,

              priorityId: data.priorityId ?? null,

              status: data.status === true,

              description: data.description || ''

            };

            this.isEdit = true;

            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'User Group not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get user group error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to load user group.'
          );

        }

      });

  }

  //====================================================
  // Delete
  //====================================================

  delete(id: number): void {

    this.alert.deleteConfirm().then(result => {

      if (!result.isConfirmed) return;

      this.spinner.show();

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/deleteusergroup/${id}`,
          {}
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'User Group deleted successfully.'
              );

              if (this.page > 1 && this.pagedUserGroups.length === 1) {
                this.page = this.page - 1;
              }

              this.loadUserGroups();

            } else {

              this.alert.warning(
                res?.message || 'Failed to delete user group.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete user group error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete user group.'
            );

          }

        });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.userGroup = this.getEmptyModel();

    this.isEdit = false;

    this.submitted = false;

  }

  //====================================================
  // Pagination
  //====================================================

  changePage(page: number): void {

    this.page = page;

  }

  changePageSize(size: number): void {

    this.pageSize = size;

    this.page = 1;

  }

}
