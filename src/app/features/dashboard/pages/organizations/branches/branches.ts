import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';
import { AuthService } from '../../../../../core/authentication/services/auth.service';
import { ControlsystemService } from '../../../../super-admin/services/controlsystem-service';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './branches.html',
  styleUrl: './branches.css',
})
export class Branches implements OnInit {
  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private controlsystemService: ControlsystemService
  ) { }

  //====================================================
  // Form Variables
  //====================================================

  submitted = false;
  isEdit = false;

  searchText = '';
  companyFilter = '';
  regionFilter = '';
  statusFilter = '';

  page = 1;
  pageSize = 10;

  //====================================================
  // Dropdown Data (from backend)
  //====================================================

  organizations: any[] = [];
  companies: any[] = [];
  regions: any[] = [];

  //====================================================
  // Branch List
  //====================================================

  branches: any[] = [];

  //====================================================
  // Branch Model
  //====================================================

  branch: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      branchId: 0,

      organizationId: null,

      companyId: null,

      regionId: null,

      branchName: '',

      branchCode: '',

      branchManager: '',

      email: '',

      phoneNumber: '',

      address: '',

      city: '',

      state: '',

      country: '',

      zipCode: '',

      openingTime: '09:00',

      closingTime: '18:00',

      status: true,

      headOffice: false,

      remarks: ''

    };

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadOrganizations();

    this.loadCompanies();

    this.loadRegions();

    this.loadBranches();

  }

  //====================================================
  // Load Dropdown Data
  //====================================================

  loadOrganizations(): void {

    this.controlsystemService.getOrganizations().subscribe({

      next: (res: any) => {

        this.organizations = res?.data || [];

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading organizations:', err);

        this.organizations = [];

      }

    });

  }

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

  //====================================================
  // Load Branches
  //====================================================

  loadBranches(): void {

    this.spinner.show();

    this.controlsystemService.getBranches().subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success) {

          this.branches = res.data || [];

        } else {

          this.branches = [];

          this.alert.warning(
            res?.message || 'No branch records found.'
          );

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Error loading branches:', err);

        this.branches = [];

        this.alert.error(
          err?.error?.message || 'Failed to load branches.'
        );

        this.cd.detectChanges();

      }

    });

  }

  //====================================================
  // Lookup Helpers (Display Names)
  //====================================================

  getOrganizationName(id: any): string {

    const item = this.organizations.find(
      x => x.organizationId === Number(id)
    );

    return item ? item.organizationName : '-';

  }

  getCompanyName(id: any): string {

    const item = this.companies.find(x => x.companyId === Number(id));

    return item ? item.companyName : '-';

  }

  getRegionName(id: any): string {

    const item = this.regions.find(x => x.regionId === Number(id));

    return item ? item.regionName : '-';

  }

  //====================================================
  // Cascading Dropdown
  //====================================================

  get formRegions(): any[] {

    if (!this.branch.companyId) return this.regions;

    return this.regions.filter(
      x => x.companyId === Number(this.branch.companyId)
    );

  }

  onCompanyChange(): void {

    this.branch.regionId = null;

  }

  //====================================================
  // Time Helpers
  //====================================================

  private toTimeOnly(value: string | null | undefined): string | null {

    if (!value) return null;

    return value.length === 5 ? `${value}:00` : value;

  }

  private fromTimeOnly(value: string | null | undefined): string {

    if (!value) return '';

    return value.length >= 5 ? value.substring(0, 5) : value;

  }

  //====================================================
  // Filtered Branches
  //====================================================

  get filteredBranches() {

    return this.branches.filter(x => {

      const search = this.searchText.trim().toLowerCase();

      const matchSearch =
        !search ||
        (x.branchName || '').toLowerCase().includes(search) ||
        (x.branchCode || '').toLowerCase().includes(search) ||
        (x.branchManager || '').toLowerCase().includes(search) ||
        (x.city || '').toLowerCase().includes(search);

      const matchCompany =
        !this.companyFilter ||
        Number(x.companyId) === Number(this.companyFilter);

      const matchRegion =
        !this.regionFilter ||
        Number(x.regionId) === Number(this.regionFilter);

      const matchStatus =
        this.statusFilter === '' ||
        (this.statusFilter === 'Active' && x.status === true) ||
        (this.statusFilter === 'Inactive' && x.status === false);

      return matchSearch && matchCompany && matchRegion && matchStatus;

    });

  }

  //====================================================
  // Pagination
  //====================================================

  get pagedBranches() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredBranches.slice(start, start + this.pageSize);

  }

  //====================================================
  // Save Branch
  //====================================================

  saveBranch(): void {

    this.submitted = true;

    if (
      !this.branch.organizationId ||
      !this.branch.companyId ||
      !this.branch.regionId ||
      !this.branch.branchName ||
      !this.branch.branchName.trim() ||
      !this.branch.branchCode ||
      !this.branch.branchCode.trim()
    ) {
      this.alert.warning('Please fill all required fields.');
      return;
    }

    if (
      this.branch.openingTime &&
      this.branch.closingTime &&
      this.branch.openingTime >= this.branch.closingTime
    ) {
      this.alert.warning('Opening Time must be earlier than Closing Time.');
      return;
    }

    const payload = {

      branchId: this.isEdit ? this.branch.branchId : 0,

      organizationId: Number(this.branch.organizationId),

      companyId: Number(this.branch.companyId),

      regionId: Number(this.branch.regionId),

      branchName: this.branch.branchName.trim(),

      branchCode: this.branch.branchCode.trim(),

      branchManager: this.branch.branchManager
        ? this.branch.branchManager.trim()
        : null,

      email: this.branch.email ? this.branch.email.trim() : null,

      phoneNumber: this.branch.phoneNumber
        ? this.branch.phoneNumber.trim()
        : null,

      address: this.branch.address ? this.branch.address.trim() : null,

      city: this.branch.city ? this.branch.city.trim() : null,

      state: this.branch.state ? this.branch.state.trim() : null,

      country: this.branch.country ? this.branch.country.trim() : null,

      zipCode: this.branch.zipCode ? this.branch.zipCode.trim() : null,

      openingTime: this.toTimeOnly(this.branch.openingTime),

      closingTime: this.toTimeOnly(this.branch.closingTime),

      status: !!this.branch.status,

      headOffice: !!this.branch.headOffice,

      remarks: this.branch.remarks ? this.branch.remarks.trim() : null

    };

    this.spinner.show();

    if (this.isEdit) {

      this.controlsystemService.updateBranch(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Branch updated successfully.'
            );

            this.clear();

            this.loadBranches();

          } else {

            this.alert.warning(
              res?.message || 'Failed to update branch.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Update branch error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to update branch.'
          );

        }

      });

    } else {

      this.controlsystemService.createBranch(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Branch created successfully.'
            );

            this.clear();

            this.loadBranches();

          } else {

            this.alert.warning(
              res?.message || 'Failed to create branch.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Create branch error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to create branch.'
          );

        }

      });

    }

  }

  //====================================================
  // Edit Branch
  //====================================================

  edit(id: number): void {

    this.spinner.show();

    this.controlsystemService.getBranchById(id).subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success && res.data) {

          const data = res.data;

          this.branch = {

            branchId: data.branchId,

            organizationId: data.organizationId,

            companyId: data.companyId,

            regionId: data.regionId,

            branchName: data.branchName || '',

            branchCode: data.branchCode || '',

            branchManager: data.branchManager || '',

            email: data.email || '',

            phoneNumber: data.phoneNumber || '',

            address: data.address || '',

            city: data.city || '',

            state: data.state || '',

            country: data.country || '',

            zipCode: data.zipCode || '',

            openingTime: this.fromTimeOnly(data.openingTime),

            closingTime: this.fromTimeOnly(data.closingTime),

            status: data.status === true,

            headOffice: data.headOffice === true,

            remarks: data.remarks || ''

          };

          this.isEdit = true;

          this.submitted = false;

          this.cd.detectChanges();

        } else {

          this.alert.warning(res?.message || 'Branch not found.');

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Get branch error:', err);

        this.alert.error(
          err?.error?.message || 'Failed to load branch.'
        );

      }

    });

  }

  //====================================================
  // Delete Branch
  //====================================================

  delete(id: number): void {

    this.alert.deleteConfirm().then(result => {

      if (!result.isConfirmed) {
        return;
      }

      this.spinner.show();

      this.controlsystemService.deleteBranch(id).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Branch deleted successfully.'
            );

            if (this.page > 1 && this.pagedBranches.length === 1) {
              this.page = this.page - 1;
            }

            this.loadBranches();

          } else {

            this.alert.warning(
              res?.message || 'Failed to delete branch.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Delete branch error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to delete branch.'
          );

        }

      });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.branch = this.getEmptyModel();

    this.submitted = false;

    this.isEdit = false;

  }

  //====================================================
  // Clear Filters
  //====================================================

  clearFilters(): void {

    this.searchText = '';

    this.companyFilter = '';

    this.regionFilter = '';

    this.statusFilter = '';

    this.page = 1;

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

  //====================================================
  // Refresh
  //====================================================

  refresh(): void {

    this.page = 1;

    this.loadBranches();

  }

  //====================================================
  // Dashboard Statistics
  //====================================================

  get totalBranches(): number {

    return this.branches.length;

  }

  get activeBranches(): number {

    return this.branches.filter(x => x.status === true).length;

  }

  get inactiveBranches(): number {

    return this.branches.filter(x => x.status === false).length;

  }

  get headOfficeBranches(): number {

    return this.branches.filter(x => x.headOffice === true).length;

  }

}
