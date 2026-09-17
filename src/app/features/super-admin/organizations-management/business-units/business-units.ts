import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { Pagination } from '../../../../shared/pagination/pagination';
import { AuthService } from '../../../../core/authentication/services/auth.service';
import { ControlsystemService } from '../../services/controlsystem-service';

@Component({
  selector: 'app-business-units',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './business-units.html',
  styleUrl: './business-units.css',
})
export class BusinessUnits implements OnInit {
  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private controlsystemService: ControlsystemService
  ) { }

  //====================================================
  // Screen Variables
  //====================================================

  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 10;

  searchText = '';
  companyFilter = '';
  statusFilter = '';

  //====================================================
  // Dropdown Data (from backend)
  //====================================================

  organizations: any[] = [];
  companies: any[] = [];
  regions: any[] = [];
  branches: any[] = [];

  //====================================================
  // Business Unit List
  //====================================================

  businessUnits: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  businessUnit: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      businessUnitId: 0,

      organizationId: null,

      companyId: null,

      regionId: null,

      branchId: null,

      businessUnitName: '',

      businessUnitCode: '',

      parentBusinessUnit: '',

      businessUnitHead: '',

      unitHead: '',

      email: '',

      mobileNumber: '',

      contactNumber: '',

      extensionNumber: '',

      employeeStrength: null,

      costCenterCode: '',

      annualBudget: null,

      description: '',

      remarks: '',

      status: true,

      defaultBusinessUnit: false,

      billableUnit: false

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

    this.loadBusinessUnits();

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

  loadBranches(): void {

    this.controlsystemService.getBranches().subscribe({

      next: (res: any) => {

        this.branches = (res?.data || []).filter(
          (x: any) => x.status === true
        );

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading branches:', err);

        this.branches = [];

      }

    });

  }

  //====================================================
  // Load Business Units
  //====================================================

  loadBusinessUnits(): void {

    this.spinner.show();

    this.controlsystemService.getBusinessUnits().subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success) {

          this.businessUnits = res.data || [];

        } else {

          this.businessUnits = [];

          this.alert.warning(
            res?.message || 'No business unit records found.'
          );

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Error loading business units:', err);

        this.businessUnits = [];

        this.alert.error(
          err?.error?.message || 'Failed to load business units.'
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

    if (!id) return '-';

    const item = this.regions.find(x => x.regionId === Number(id));

    return item ? item.regionName : '-';

  }

  getBranchName(id: any): string {

    if (!id) return '-';

    const item = this.branches.find(x => x.branchId === Number(id));

    return item ? item.branchName : '-';

  }

  //====================================================
  // Cascading Dropdowns
  //====================================================

  get formRegions(): any[] {

    if (!this.businessUnit.companyId) return this.regions;

    return this.regions.filter(
      x => x.companyId === Number(this.businessUnit.companyId)
    );

  }

  get formBranches(): any[] {

    return this.branches.filter(x => {

      const matchesCompany =
        !this.businessUnit.companyId ||
        x.companyId === Number(this.businessUnit.companyId);

      const matchesRegion =
        !this.businessUnit.regionId ||
        x.regionId === Number(this.businessUnit.regionId);

      return matchesCompany && matchesRegion;

    });

  }

  onCompanyChange(): void {

    this.businessUnit.regionId = null;
    this.businessUnit.branchId = null;

  }

  onRegionChange(): void {

    this.businessUnit.branchId = null;

  }

  //====================================================
  // Filtered Business Units
  //====================================================

  get filteredBusinessUnits() {

    return this.businessUnits.filter(x => {

      const search = this.searchText.trim().toLowerCase();

      const matchSearch =
        !search ||
        (x.businessUnitName || '').toLowerCase().includes(search) ||
        (x.businessUnitCode || '').toLowerCase().includes(search) ||
        (x.unitHead || '').toLowerCase().includes(search) ||
        (x.businessUnitHead || '').toLowerCase().includes(search) ||
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

  //====================================================
  // Pagination
  //====================================================

  get pagedBusinessUnits() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredBusinessUnits.slice(start, start + this.pageSize);

  }

  //====================================================
  // Dashboard Statistics
  //====================================================

  get totalBusinessUnits(): number {

    return this.businessUnits.length;

  }

  get activeBusinessUnits(): number {

    return this.businessUnits.filter(x => x.status === true).length;

  }

  get inactiveBusinessUnits(): number {

    return this.businessUnits.filter(x => x.status === false).length;

  }

  get totalCompanies(): number {

    return [...new Set(this.businessUnits.map(x => x.companyId))].length;

  }

  get totalEmployees(): number {

    return this.businessUnits.reduce(
      (total, item) => total + Number(item.employeeStrength || 0),
      0
    );

  }

  get totalBudget(): number {

    return this.businessUnits.reduce(
      (total, item) => total + Number(item.annualBudget || 0),
      0
    );

  }

  //====================================================
  // Save / Update
  //====================================================

  saveBusinessUnit(): void {

    this.submitted = true;

    if (
      !this.businessUnit.organizationId ||
      !this.businessUnit.companyId ||
      !this.businessUnit.businessUnitName ||
      !this.businessUnit.businessUnitName.trim() ||
      !this.businessUnit.businessUnitCode ||
      !this.businessUnit.businessUnitCode.trim()
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    if (
      this.businessUnit.employeeStrength !== null &&
      this.businessUnit.employeeStrength !== '' &&
      Number(this.businessUnit.employeeStrength) < 0
    ) {

      this.alert.warning('Employee Strength cannot be negative.');

      return;

    }

    if (
      this.businessUnit.annualBudget !== null &&
      this.businessUnit.annualBudget !== '' &&
      Number(this.businessUnit.annualBudget) < 0
    ) {

      this.alert.warning('Annual Budget cannot be negative.');

      return;

    }

    const payload = {

      businessUnitId: this.isEdit ? this.businessUnit.businessUnitId : 0,

      organizationId: Number(this.businessUnit.organizationId),

      companyId: Number(this.businessUnit.companyId),

      regionId: this.businessUnit.regionId ? Number(this.businessUnit.regionId) : null,

      branchId: this.businessUnit.branchId ? Number(this.businessUnit.branchId) : null,

      businessUnitName: this.businessUnit.businessUnitName.trim(),

      businessUnitCode: this.businessUnit.businessUnitCode.trim(),

      parentBusinessUnit: this.businessUnit.parentBusinessUnit
        ? this.businessUnit.parentBusinessUnit.trim()
        : null,

      businessUnitHead: this.businessUnit.businessUnitHead
        ? this.businessUnit.businessUnitHead.trim()
        : null,

      unitHead: this.businessUnit.unitHead
        ? this.businessUnit.unitHead.trim()
        : null,

      email: this.businessUnit.email ? this.businessUnit.email.trim() : null,

      mobileNumber: this.businessUnit.mobileNumber
        ? this.businessUnit.mobileNumber.trim()
        : null,

      contactNumber: this.businessUnit.contactNumber
        ? this.businessUnit.contactNumber.trim()
        : null,

      extensionNumber: this.businessUnit.extensionNumber
        ? this.businessUnit.extensionNumber.trim()
        : null,

      description: this.businessUnit.description
        ? this.businessUnit.description.trim()
        : null,

      remarks: this.businessUnit.remarks
        ? this.businessUnit.remarks.trim()
        : null,

      status: !!this.businessUnit.status,

      defaultBusinessUnit: !!this.businessUnit.defaultBusinessUnit,

      billableUnit: !!this.businessUnit.billableUnit,

      employeeStrength:
        this.businessUnit.employeeStrength !== null &&
          this.businessUnit.employeeStrength !== ''
          ? Number(this.businessUnit.employeeStrength)
          : null,

      costCenterCode: this.businessUnit.costCenterCode
        ? this.businessUnit.costCenterCode.trim()
        : null,

      annualBudget:
        this.businessUnit.annualBudget !== null &&
          this.businessUnit.annualBudget !== ''
          ? Number(this.businessUnit.annualBudget)
          : null

    };

    this.spinner.show();

    if (this.isEdit) {

      this.controlsystemService.updateBusinessUnit(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Business Unit updated successfully.'
            );

            this.clear();

            this.loadBusinessUnits();

          } else {

            this.alert.warning(
              res?.message || 'Failed to update business unit.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Update business unit error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to update business unit.'
          );

        }

      });

    } else {

      this.controlsystemService.createBusinessUnit(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Business Unit created successfully.'
            );

            this.clear();

            this.loadBusinessUnits();

          } else {

            this.alert.warning(
              res?.message || 'Failed to create business unit.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Create business unit error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to create business unit.'
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

    this.controlsystemService.getBusinessUnitById(id).subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success && res.data) {

          const data = res.data;

          this.businessUnit = {

            businessUnitId: data.businessUnitId,

            organizationId: data.organizationId,

            companyId: data.companyId,

            regionId: data.regionId,

            branchId: data.branchId,

            businessUnitName: data.businessUnitName || '',

            businessUnitCode: data.businessUnitCode || '',

            parentBusinessUnit: data.parentBusinessUnit || '',

            businessUnitHead: data.businessUnitHead || '',

            unitHead: data.unitHead || '',

            email: data.email || '',

            mobileNumber: data.mobileNumber || '',

            contactNumber: data.contactNumber || '',

            extensionNumber: data.extensionNumber || '',

            employeeStrength: data.employeeStrength ?? null,

            costCenterCode: data.costCenterCode || '',

            annualBudget: data.annualBudget ?? null,

            description: data.description || '',

            remarks: data.remarks || '',

            status: data.status === true,

            defaultBusinessUnit: data.defaultBusinessUnit === true,

            billableUnit: data.billableUnit === true

          };

          this.isEdit = true;

          this.submitted = false;

          this.cd.detectChanges();

        } else {

          this.alert.warning(res?.message || 'Business Unit not found.');

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Get business unit error:', err);

        this.alert.error(
          err?.error?.message || 'Failed to load business unit.'
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

      this.controlsystemService.deleteBusinessUnit(id).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Business Unit deleted successfully.'
            );

            if (this.page > 1 && this.pagedBusinessUnits.length === 1) {
              this.page = this.page - 1;
            }

            this.loadBusinessUnits();

          } else {

            this.alert.warning(
              res?.message || 'Failed to delete business unit.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Delete business unit error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to delete business unit.'
          );

        }

      });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.businessUnit = this.getEmptyModel();

    this.submitted = false;

    this.isEdit = false;

  }

  //====================================================
  // Clear Search Filters
  //====================================================

  clearFilters(): void {

    this.searchText = '';

    this.companyFilter = '';

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

    this.loadBusinessUnits();

  }

}
