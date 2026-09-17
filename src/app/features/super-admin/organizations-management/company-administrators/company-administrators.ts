import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { Pagination } from '../../../../shared/pagination/pagination';
import { AuthService } from '../../../../core/authentication/services/auth.service';
import { ControlsystemService } from '../../services/controlsystem-service';

@Component({
  selector: 'app-company-administrators',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './company-administrators.html',
  styleUrl: './company-administrators.css',
})
export class CompanyAdministrators implements OnInit {
  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private controlsystemService: ControlsystemService
  ) { }

  // ============================================
  // Form / Screen State
  // ============================================

  submitted = false;
  isEdit = false;

  searchText = '';
  companyFilter = '';
  statusFilter = '';

  page = 1;
  pageSize = 10;

  // ============================================
  // Dropdown Data (from backend)
  // ============================================

  companies: any[] = [];
  regions: any[] = [];
  departments: any[] = [];
  designations: any[] = [];
  branches: any[] = [];

  // ============================================
  // Administrators List
  // ============================================

  administrators: any[] = [];

  // ============================================
  // Form Model
  // ============================================

  admin: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      administratorId: 0,

      companyId: null,

      departmentId: null,

      designationId: null,

      regionId: null,

      branchId: null,

      employeeCode: '',

      username: '',

      firstName: '',

      lastName: '',

      email: '',

      mobileNumber: '',

      roleName: '',

      reportingManager: '',

      profileImagePath: '',

      status: true,

      emailVerified: false,

      mobileVerified: false,

      twoFactorAuthentication: false,

      remarks: ''

    };

  }

  // ============================================
  // Lifecycle
  // ============================================

  ngOnInit(): void {

    this.loadCompanies();

    this.loadRegions();

    this.loadDepartments();

    this.loadDesignations();

    this.loadBranches();

    this.loadAdministrators();

  }

  // ============================================
  // Load Dropdown Data
  // ============================================

  loadCompanies(): void {

    this.authService.getCompanies().subscribe({

      next: (res: any) => {

        this.companies = (res?.data || []).filter(
          (x: any) => x.isActive !== false
        );

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading companies:', err);

        this.companies = [];

      }

    });

  }

  loadRegions(): void {

    this.authService.getRegions().subscribe({

      next: (res: any) => {

        this.regions = (res?.data || []).filter(
          (x: any) => x.isActive !== false
        );

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading regions:', err);

        this.regions = [];

      }

    });

  }

  loadDepartments(): void {

    this.controlsystemService.getDepartments().subscribe({

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

  loadDesignations(): void {

    this.controlsystemService.getDesignations().subscribe({

      next: (res: any) => {

        this.designations = (res?.data || []).filter(
          (x: any) => x.status === true || x.status === 'Active'
        );

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading designations:', err);

        this.designations = [];

      }

    });

  }

  loadBranches(): void {

    this.controlsystemService.getBranches().subscribe({

      next: (res: any) => {

        this.branches = (res?.data || []).filter(
          (x: any) => x.status === true || x.status === 'Active'
        );

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading branches:', err);

        this.branches = [];

      }

    });

  }

  // ============================================
  // Load Company Administrators
  // ============================================

  loadAdministrators(): void {

    this.spinner.show();

    this.controlsystemService.getCompanyAdministrators().subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success) {

          this.administrators = res.data || [];

        } else {

          this.administrators = [];

          this.alert.warning(
            res?.message || 'No company administrator records found.'
          );

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Error loading company administrators:', err);

        this.administrators = [];

        this.alert.error(
          err?.error?.message || 'Failed to load company administrators.'
        );

        this.cd.detectChanges();

      }

    });

  }

  // ============================================
  // Lookup Helpers (Display Names)
  // ============================================

  getCompanyName(id: any): string {

    const item = this.companies.find(x => x.companyId === Number(id));

    return item ? item.companyName : '-';

  }

  getDepartmentName(id: any): string {

    const item = this.departments.find(x => x.departmentId === Number(id));

    return item ? item.departmentName : '-';

  }

  getDesignationName(id: any): string {

    const item = this.designations.find(x => x.designationId === Number(id));

    return item ? item.designationName : '-';

  }

  getRegionName(id: any): string {

    const item = this.regions.find(x => x.regionId === Number(id));

    return item ? item.regionName : '-';

  }

  getBranchName(id: any): string {

    const item = this.branches.find(x => x.branchId === Number(id));

    return item ? item.branchName : '-';

  }

  // ============================================
  // Cascading Dropdown Filters
  // ============================================

  get formRegions(): any[] {

    if (!this.admin.companyId) return this.regions;

    return this.regions.filter(
      x => x.companyId === Number(this.admin.companyId)
    );

  }

  get formDesignations(): any[] {

    if (!this.admin.companyId) return this.designations;

    return this.designations.filter(
      x => x.companyId === Number(this.admin.companyId)
    );

  }

  get formBranches(): any[] {

    return this.branches.filter(x => {

      const matchesCompany =
        !this.admin.companyId ||
        x.companyId === Number(this.admin.companyId);

      const matchesRegion =
        !this.admin.regionId ||
        x.regionId === Number(this.admin.regionId);

      return matchesCompany && matchesRegion;

    });

  }

  onCompanyChange(): void {

    this.admin.regionId = null;
    this.admin.designationId = null;
    this.admin.branchId = null;

  }

  onRegionChange(): void {

    this.admin.branchId = null;

  }

  // ============================================
  // Filters
  // ============================================

  get filteredAdmins() {

    return this.administrators.filter(x => {

      const search = this.searchText.trim().toLowerCase();

      const matchSearch =
        !search ||
        (x.firstName || '').toLowerCase().includes(search) ||
        (x.lastName || '').toLowerCase().includes(search) ||
        (x.username || '').toLowerCase().includes(search) ||
        (x.employeeCode || '').toLowerCase().includes(search) ||
        (x.email || '').toLowerCase().includes(search);

      const matchCompany =
        !this.companyFilter ||
        Number(x.companyId) === Number(this.companyFilter);

      const matchStatus =
        this.statusFilter === '' ||
        (this.statusFilter === 'Active' && x.status === true) ||
        (this.statusFilter === 'Inactive' && x.status === false);

      return matchSearch && matchCompany && matchStatus;

    });

  }

  // ============================================
  // Pagination
  // ============================================

  get pagedAdmins() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredAdmins.slice(start, start + this.pageSize);

  }

  // ============================================
  // Statistics
  // ============================================

  get totalAdmins(): number {

    return this.administrators.length;

  }

  get activeAdmins(): number {

    return this.administrators.filter(x => x.status === true).length;

  }

  get inactiveAdmins(): number {

    return this.administrators.filter(x => x.status === false).length;

  }

  get totalCompanies(): number {

    return [...new Set(this.administrators.map(x => x.companyId))].length;

  }

  // ============================================
  // Save / Update
  // ============================================

  saveAdmin(): void {

    this.submitted = true;

    if (
      !this.admin.companyId ||
      !this.admin.employeeCode ||
      !this.admin.employeeCode.trim() ||
      !this.admin.username ||
      !this.admin.username.trim() ||
      !this.admin.firstName ||
      !this.admin.firstName.trim() ||
      !this.admin.email ||
      !this.admin.email.trim() ||
      !this.admin.mobileNumber ||
      !this.admin.mobileNumber.trim()
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    const payload = {

      administratorId: this.isEdit ? this.admin.administratorId : 0,

      companyId: Number(this.admin.companyId),

      departmentId: this.admin.departmentId ? Number(this.admin.departmentId) : null,

      designationId: this.admin.designationId ? Number(this.admin.designationId) : null,

      regionId: this.admin.regionId ? Number(this.admin.regionId) : null,

      branchId: this.admin.branchId ? Number(this.admin.branchId) : null,

      employeeCode: this.admin.employeeCode.trim(),

      username: this.admin.username.trim(),

      firstName: this.admin.firstName.trim(),

      lastName: this.admin.lastName ? this.admin.lastName.trim() : null,

      email: this.admin.email.trim(),

      mobileNumber: this.admin.mobileNumber.trim(),

      roleName: this.admin.roleName ? this.admin.roleName.trim() : null,

      reportingManager: this.admin.reportingManager
        ? this.admin.reportingManager.trim()
        : null,

      profileImagePath: this.admin.profileImagePath
        ? this.admin.profileImagePath.trim()
        : null,

      status: !!this.admin.status,

      emailVerified: !!this.admin.emailVerified,

      mobileVerified: !!this.admin.mobileVerified,

      twoFactorAuthentication: this.admin.twoFactorAuthentication ? 1 : 0,

      remarks: this.admin.remarks ? this.admin.remarks.trim() : null

    };

    this.spinner.show();

    if (this.isEdit) {

      this.controlsystemService.updateCompanyAdministrator(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Company Administrator updated successfully.'
            );

            this.clear();

            this.loadAdministrators();

          } else {

            this.alert.warning(
              res?.message || 'Failed to update company administrator.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Update company administrator error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to update company administrator.'
          );

        }

      });

    } else {

      this.controlsystemService.createCompanyAdministrator(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Company Administrator created successfully.'
            );

            this.clear();

            this.loadAdministrators();

          } else {

            this.alert.warning(
              res?.message || 'Failed to create company administrator.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Create company administrator error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to create company administrator.'
          );

        }

      });

    }

  }

  // ============================================
  // Edit
  // ============================================

  edit(id: number): void {

    this.spinner.show();

    this.controlsystemService.getCompanyAdministratorById(id).subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success && res.data) {

          const data = res.data;

          this.admin = {

            administratorId: data.administratorId,

            companyId: data.companyId,

            departmentId: data.departmentId,

            designationId: data.designationId,

            regionId: data.regionId,

            branchId: data.branchId,

            employeeCode: data.employeeCode || '',

            username: data.username || '',

            firstName: data.firstName || '',

            lastName: data.lastName || '',

            email: data.email || '',

            mobileNumber: data.mobileNumber || '',

            roleName: data.roleName || '',

            reportingManager: data.reportingManager || '',

            profileImagePath: data.profileImagePath || '',

            status: data.status === true,

            emailVerified: data.emailVerified === true,

            mobileVerified: data.mobileVerified === true,

            twoFactorAuthentication: Number(data.twoFactorAuthentication) === 1,

            remarks: data.remarks || ''

          };

          this.isEdit = true;

          this.submitted = false;

          this.cd.detectChanges();

        } else {

          this.alert.warning(
            res?.message || 'Company Administrator not found.'
          );

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Get company administrator error:', err);

        this.alert.error(
          err?.error?.message || 'Failed to load company administrator.'
        );

      }

    });

  }

  // ============================================
  // Delete
  // ============================================

  delete(id: number): void {

    this.alert.deleteConfirm().then(result => {

      if (!result.isConfirmed) return;

      this.spinner.show();

      this.controlsystemService.deleteCompanyAdministrator(id).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Company Administrator deleted successfully.'
            );

            if (this.page > 1 &&
              this.pagedAdmins.length === 1) {
              this.page = this.page - 1;
            }

            this.loadAdministrators();

          } else {

            this.alert.warning(
              res?.message || 'Failed to delete company administrator.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Delete company administrator error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to delete company administrator.'
          );

        }

      });

    });

  }

  // ============================================
  // Clear Form
  // ============================================

  clear(): void {

    this.admin = this.getEmptyModel();

    this.isEdit = false;

    this.submitted = false;

  }

  // ============================================
  // Filters / Pagination / Refresh
  // ============================================

  clearFilters(): void {

    this.searchText = '';

    this.companyFilter = '';

    this.statusFilter = '';

    this.page = 1;

  }

  changePage(page: number): void {

    this.page = page;

  }

  changePageSize(size: number): void {

    this.pageSize = size;

    this.page = 1;

  }

  refresh(): void {

    this.page = 1;

    this.loadAdministrators();

  }

}
