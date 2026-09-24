import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../../core/authentication/services/auth.service';
import { ControlsystemService } from '../../../../super-admin/services/controlsystem-service';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

// UI-only screen: all data below is local mock data for layout/design
// purposes. The only real backend call is fetching the logged-in user's
// own Company/Region/Branch names for display.

@Component({
  selector: 'app-user-managemnt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-managemnt.html',
  styleUrl: './user-managemnt.css',
})
export class UserManagemnt implements OnInit {

  constructor(
    private authService: AuthService,
    private controlService: ControlsystemService,
    private cd: ChangeDetectorRef,
    private alert: Alertservice,
    private spinner: Spinnerservice
  ) {}


  ngOnInit(): void {

    this.loadLoggedInUserOrgDetails();

    this.loadRoles();

    this.loadUsers();

  }


  // ==============================
  // Logged-in user's Company / Region / Branch (fetched from the API)
  // ==============================

  currentUserCompany = '';

  currentUserRegion = '';

  currentUserBranch = '';

  currentUserCompanyId: number | null = null;

  currentUserRegionId: number | null = null;

  currentUserBranchId: number | null = null;

  currentUserOrgLoaded = false;


  // Decodes the JWT payload to read the "UserId" claim the backend embeds
  // at login (see JwtHelper.GenerateToken), without needing a dedicated
  // "current user" endpoint.
  private getCurrentUserId(): number | null {

    const token = this.authService.getToken();

    if (!token) {
      return null;
    }

    try {

      const payload = token.split('.')[1];

      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');

      const decoded = JSON.parse(atob(normalized));

      const id = decoded['UserId'] ?? decoded['userId'] ?? decoded['sub'];

      return id ? Number(id) : null;

    } catch {

      return null;

    }

  }


  private loadLoggedInUserOrgDetails(): void {

    const userId = this.getCurrentUserId();

    if (!userId) {
      return;
    }

    this.controlService
      .getUserById(userId)
      .subscribe({

        next: (res: any) => {

          if (res?.success && res.data) {

            this.currentUserCompany = res.data.companyName || '-';

            this.currentUserRegion = res.data.regionName || '-';

            this.currentUserBranch = res.data.branchName || '-';

            this.currentUserCompanyId = res.data.companyId ?? null;

            this.currentUserRegionId = res.data.regionId ?? null;

            this.currentUserBranchId = res.data.branchId ?? null;

          }

          this.currentUserOrgLoaded = true;

          this.loadDepartments();

          this.cd.detectChanges();
        },

        error: (err) => {

          console.error('Error loading logged-in user org details:', err);

          this.currentUserOrgLoaded = true;

          this.cd.detectChanges();

        }

      });

  }

  // ==============================
  // Lookup data (mock, for dropdowns)
  // ==============================

  companies = [
    { companyId: 1, companyName: 'Cortracker Technologies' },
    { companyId: 2, companyName: 'Acme Corporation' },
  ];

  regions = [
    { regionId: 1, companyId: 1, regionName: 'North' },
    { regionId: 2, companyId: 1, regionName: 'South' },
    { regionId: 3, companyId: 2, regionName: 'East' },
  ];

  branches = [
    { branchId: 1, companyId: 1, regionId: 1, branchName: 'Delhi HQ' },
    { branchId: 2, companyId: 1, regionId: 2, branchName: 'Bengaluru Branch' },
    { branchId: 3, companyId: 2, regionId: 3, branchName: 'Kolkata Branch' },
  ];

  // Active role names from Roles Master (loaded from the API).
  roles: string[] = [];

  roleTypes = ['User'];


  private loadRoles(): void {

    this.controlService
      .getUserRoles()
      .subscribe({

        next: (res: any) => {

          this.roles = (res?.data || [])
            .filter((x: any) => x.status === true)
            .map((x: any) => x.roleName);

          this.cd.detectChanges();

        },

        error: (err) => {

          console.error('Error loading roles:', err);

          this.roles = [];

        }

      });

  }


  // ==============================
  // Departments / Designations (fetched from the API)
  // Flow: Company + Region -> active Departments -> selected Department
  //       -> active Designations
  // ==============================

  // Full lists (used for name lookups in the users table).
  departments: any[] = [];

  designations: any[] = [];


  // Active designations of the currently selected department.
  formDesignations: any[] = [];


  // The backend resolves the logged-in user's Company + Region itself and
  // returns only the active departments for that scope.
  private loadDepartments(): void {

    this.controlService
      .getDepartmentsByScope()
      .subscribe({

        next: (res: any) => {

          this.departments = res?.data || [];

          this.cd.detectChanges();

        },

        error: (err) => {

          console.error('Error loading departments:', err);

          this.departments = [];

        }

      });

  }


  // Active departments of the logged-in user's Company + Region.
  get formDepartments(): any[] {

    return this.departments;

  }


  // Loads the active designations of the given department and keeps them
  // in `designations` for name lookups in the users table.
  private loadDesignationsForDepartment(departmentId: any): void {

    if (!departmentId) {

      this.formDesignations = [];

      return;

    }

    this.controlService
      .getDesignationsByScope(Number(departmentId))
      .subscribe({

        next: (res: any) => {

          this.formDesignations = res?.data || [];

          const known = new Set(
            this.designations.map(d => d.designationId)
          );

          this.designations = [
            ...this.designations,
            ...this.formDesignations.filter(d => !known.has(d.designationId))
          ];

          this.cd.detectChanges();

        },

        error: (err) => {

          console.error('Error loading designations:', err);

          this.formDesignations = [];

        }

      });

  }


  onFormDepartmentChange(): void {

    this.model.designationId = '';

    this.loadDesignationsForDepartment(this.model.departmentId);

  }


  // Users available in the "Reporting To" dropdown - everyone except the
  // user currently being edited.
  get reportingToOptions(): any[] {

    return this.users.filter(u => u.id !== this.editId);

  }


  reportingToName(userId: number | null): string {

    const manager = this.users.find(u => u.id === userId);

    return manager
      ? `${manager.firstName} ${manager.lastName}`.trim()
      : '-';

  }


  lookupName(list: any[], idKey: string, nameKey: string, id: any): string {

    const match = list.find(x => x[idKey] === Number(id));

    return match ? match[nameKey] : '-';

  }


  // ==============================
  // Users data (loaded from the API)
  // ==============================

  users: any[] = [];


  // Get All Users - the users created by the logged-in user.
  loadUsers(): void {

    this.controlService
      .getAdminUsers()
      .subscribe({

        next: (res: any) => {

          this.users = (res?.data || []).map((x: any) => ({
            id: x.userId,
            firstName: x.firstName,
            lastName: x.lastName || '',
            email: x.email,
            mobile: x.mobileNumber || '',
            employeeCode: x.employeeCode || '',
            companyId: x.companyId,
            companyName: x.companyName,
            regionId: x.regionId,
            regionName: x.regionName,
            branchId: x.branchId,
            branchName: x.branchName,
            departmentId: x.departmentId,
            departmentName: x.departmentName,
            designationId: x.designationId,
            designationName: x.designationName,
            role: x.role,
            reportingTo: x.reportingTo ?? null,
            joiningDate: x.joiningDate ? String(x.joiningDate).substring(0, 10) : '',
            status: x.isActive ? 'Active' : 'Inactive',
          }));

          this.cd.detectChanges();

        },

        error: (err) => {

          console.error('Error loading users:', err);

          this.users = [];

        }

      });

  }



  // ==============================
  // Modal / form state
  // ==============================

  showModal = false;

  isEdit = false;

  editId = 0;

  showPassword = false;


  emptyModel() {

    return {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      employeeCode: '',
      companyId: '',
      regionId: '',
      branchId: '',
      password: '',
      departmentId: '',
      designationId: '',
      role: '',
      roleType: '',
      reportingTo: '',
      joiningDate: '',
      status: 'Active',
    };

  }


  model: any = this.emptyModel();


  // ==============================
  // Search / filters
  // ==============================

  searchText = '';

  roleFilter = '';

  statusFilter = '';


  get filteredUsers() {

    return this.users.filter(item => {

      const search =

        item.firstName.toLowerCase().includes(this.searchText.toLowerCase())

        ||

        item.lastName.toLowerCase().includes(this.searchText.toLowerCase())

        ||

        item.email.toLowerCase().includes(this.searchText.toLowerCase())

        ||

        item.employeeCode.toLowerCase().includes(this.searchText.toLowerCase());


      const role =

        this.roleFilter === '' || item.role === this.roleFilter;


      const status =

        this.statusFilter === '' || item.status === this.statusFilter;


      return search && role && status;

    });

  }


  // ==============================
  // Statistics
  // ==============================

  get activeUsers() {

    return this.users.filter(x => x.status === 'Active').length;

  }


  get inactiveUsers() {

    return this.users.filter(x => x.status === 'Inactive').length;

  }


  get adminUsers() {

    return this.users.filter(x => x.role === 'Admin').length;

  }


  // ==============================
  // Modal open / close
  // ==============================

  openAddModal() {

    this.isEdit = false;

    this.editId = 0;

    this.model = this.emptyModel();

    this.formDesignations = [];

    this.showPassword = false;

    this.showModal = true;

  }


  closeModal() {

    this.showModal = false;

    this.model = this.emptyModel();

    this.isEdit = false;

    this.editId = 0;

    this.showPassword = false;

  }


  // Get User By ID - loads the latest data of the user into the form.
  edit(item: any) {

    this.spinner.show();

    this.controlService
      .getAdminUserById(item.id)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          const u = res?.data;

          if (!res?.success || !u) {

            this.alert.warning(res?.message || 'Unable to load user.');

            return;

          }

          this.isEdit = true;

          this.editId = u.userId;

          this.model = {
            ...this.emptyModel(),
            id: u.userId,
            firstName: u.firstName || '',
            lastName: u.lastName || '',
            email: u.email || '',
            mobile: u.mobileNumber || '',
            employeeCode: u.employeeCode || '',
            companyId: u.companyId ?? '',
            regionId: u.regionId ?? '',
            branchId: u.branchId ?? '',
            departmentId: u.departmentId ?? '',
            designationId: u.designationId ?? '',
            role: u.role || '',
            reportingTo: u.reportingTo ?? '',
            // The date input needs yyyy-MM-dd; the API returns an ISO date-time.
            joiningDate: u.joiningDate ? String(u.joiningDate).substring(0, 10) : '',
            status: u.isActive ? 'Active' : 'Inactive',
            // Leave blank to keep the current password.
            password: '',
          };

          this.loadDesignationsForDepartment(this.model.departmentId);

          this.showPassword = false;

          this.showModal = true;

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          this.alert.error(err?.error?.message || 'Failed to load user.');

        }

      });

  }


  // ==============================
  // Save (Create / Update through the API)
  // ==============================

  saveUser() {

    if (!this.model.firstName.trim()) {

      this.alert.warning('First Name is required.');

      return;
    }

    if (!this.model.email.trim()) {

      this.alert.warning('Email is required.');

      return;
    }

    if (!this.model.mobile || !this.model.mobile.trim()) {

      this.alert.warning('Mobile Number is required.');

      return;
    }

    if (!this.model.employeeCode || !this.model.employeeCode.trim()) {

      this.alert.warning('Employee Code is required.');

      return;
    }

    if (!this.model.role || !this.model.role.trim()) {

      this.alert.warning('Role is required.');

      return;
    }

    const data = {
      userId: this.isEdit ? this.editId : 0,
      // Create: the logged-in user's Company / Region / Branch.
      // Update: keep the user's own Company / Region / Branch.
      companyId: this.isEdit ? Number(this.model.companyId) || null : this.currentUserCompanyId,
      regionId: this.isEdit ? Number(this.model.regionId) || null : this.currentUserRegionId,
      branchId: this.isEdit ? Number(this.model.branchId) || null : this.currentUserBranchId,
      departmentId: this.model.departmentId ? Number(this.model.departmentId) : null,
      designationId: this.model.designationId ? Number(this.model.designationId) : null,
      employeeCode: this.model.employeeCode.trim(),
      firstName: this.model.firstName.trim(),
      lastName: this.model.lastName ? this.model.lastName.trim() : '',
      email: this.model.email.trim(),
      mobileNumber: this.model.mobile.trim(),
      role: this.model.role.trim(),
      reportingTo: this.model.reportingTo ? Number(this.model.reportingTo) : null,
      joiningDate: this.model.joiningDate || null,
      // Create: blank lets the backend assign the default password.
      // Update: blank keeps the current password.
      password: this.model.password ? this.model.password.trim() : null,
      isActive: this.model.status === 'Active',
    };

    this.spinner.show();

    const request$ = this.isEdit
      ? this.controlService.updateAdminUser(data)
      : this.controlService.createAdminUser(data);

    request$.subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success) {

          this.alert.success(
            res.message ||
            (this.isEdit ? 'User updated successfully.' : 'User created successfully.')
          );

          this.closeModal();

          this.loadUsers();

        } else {

          this.alert.warning(res?.message || 'Unable to save user.');

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Save user error:', err);

        this.alert.error(err?.error?.message || 'Failed to save user.');

      }

    });

  }


  // ==============================
  // Delete
  // ==============================

  delete(id: number) {

    this.alert.deleteConfirm()
      .then(result => {

        if (!result.isConfirmed) {
          return;
        }

        this.spinner.show();

        this.controlService
          .deleteAdminUser(id)
          .subscribe({

            next: (res: any) => {

              this.spinner.hide();

              this.alert.success(res?.message || 'User deleted successfully.');

              this.loadUsers();

            },

            error: (err) => {

              this.spinner.hide();

              this.alert.error(err?.error?.message || 'Failed to delete user.');

            }

          });

      });

  }


  clearFilters() {

    this.searchText = '';

    this.roleFilter = '';

    this.statusFilter = '';

  }

}
