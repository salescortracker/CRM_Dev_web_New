import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';
import { AuthService } from '../../../../../core/authentication/services/auth.service';
import { ControlsystemService } from '../../../../super-admin/services/controlsystem-service';
import { AdminService } from '../../../services/admin-service';

@Component({
  selector: 'app-business-hours',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './business-hours.html',
  styleUrl: './business-hours.css',
})
export class BusinessHours implements OnInit {

  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private controlsystemService: ControlsystemService,
    private adminService: AdminService
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
  // Days
  //====================================================

  days = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday', 'Sunday'
  ];

  //====================================================
  // Dropdown Data (from backend)
  //====================================================

  companies: any[] = [];
  regions: any[] = [];
  branches: any[] = [];

  //====================================================
  // Business Hours List
  //====================================================

  businessHours: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  businessHour: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      businessHoursId: 0,

      companyId: null,

      regionId: null,

      branchId: null,

      businessHoursName: '',

      startTime: '09:00',

      endTime: '18:00',

      breakStart: '',

      breakEnd: '',

      workingDaysMap: {
        Monday: true,
        Tuesday: true,
        Wednesday: true,
        Thursday: true,
        Friday: true,
        Saturday: false,
        Sunday: false
      } as { [key: string]: boolean },

      weekend: '',

      totalWorkingHours: null,

      lateMarkGraceTimeMinutes: null,

      halfDayThresholdHours: null,

      flexibleHours: false,

      overtimeAllowed: false,

      description: '',

      active: true

    };

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadCompanies();

    this.loadRegions();

    this.loadBranches();

    this.loadBusinessHours();

  }

  //====================================================
  // Load Dropdown Data
  //====================================================

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
  // Load Business Hours
  //====================================================

  loadBusinessHours(): void {

    this.spinner.show();

    this.adminService.getBusinessHours().subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success) {

          this.businessHours = res.data || [];

        } else {

          this.businessHours = [];

          this.alert.warning(
            res?.message || 'No business hours records found.'
          );

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Error loading business hours:', err);

        this.businessHours = [];

        this.alert.error(
          err?.error?.message || 'Failed to load business hours.'
        );

        this.cd.detectChanges();

      }

    });

  }

  //====================================================
  // Lookup Helpers (Display Names)
  //====================================================

  getCompanyName(id: any): string {

    const item = this.companies.find(x => x.companyId === Number(id));

    return item ? item.companyName : '-';

  }

  getRegionName(id: any): string {

    const item = this.regions.find(x => x.regionId === Number(id));

    return item ? item.regionName : '-';

  }

  getBranchName(id: any): string {

    const item = this.branches.find(x => x.branchId === Number(id));

    return item ? item.branchName : '-';

  }

  //====================================================
  // Cascading Dropdowns
  //====================================================

  get formRegions(): any[] {

    if (!this.businessHour.companyId) return this.regions;

    return this.regions.filter(
      x => x.companyId === Number(this.businessHour.companyId)
    );

  }

  get formBranches(): any[] {

    return this.branches.filter(x => {

      const matchesCompany =
        !this.businessHour.companyId ||
        x.companyId === Number(this.businessHour.companyId);

      const matchesRegion =
        !this.businessHour.regionId ||
        x.regionId === Number(this.businessHour.regionId);

      return matchesCompany && matchesRegion;

    });

  }

  onCompanyChange(): void {

    this.businessHour.regionId = null;
    this.businessHour.branchId = null;

  }

  onRegionChange(): void {

    this.businessHour.branchId = null;

  }

  //====================================================
  // Working Days Helpers
  //====================================================

  getWorkingDaysString(): string {

    return this.days
      .filter(d => this.businessHour.workingDaysMap[d])
      .join(', ');

  }

  private parseWorkingDays(value: string): { [key: string]: boolean } {

    const map: { [key: string]: boolean } = {};

    const selected = (value || '')
      .split(',')
      .map(d => d.trim().toLowerCase());

    this.days.forEach(d => {
      map[d] = selected.includes(d.toLowerCase());
    });

    return map;

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
  // Filtered Business Hours
  //====================================================

  get filteredBusinessHours() {

    return this.businessHours.filter(x => {

      const search = this.searchText.trim().toLowerCase();

      const matchSearch =
        !search ||
        (x.businessHoursName || '').toLowerCase().includes(search) ||
        (x.workingDays || '').toLowerCase().includes(search) ||
        (x.description || '').toLowerCase().includes(search);

      const matchCompany =
        !this.companyFilter ||
        Number(x.companyId) === Number(this.companyFilter);

      const matchStatus =
        this.statusFilter === '' ||
        (this.statusFilter === 'Active' && x.active === true) ||
        (this.statusFilter === 'Inactive' && x.active === false);

      return matchSearch && matchCompany && matchStatus;

    });

  }

  //====================================================
  // Pagination
  //====================================================

  get pagedBusinessHours() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredBusinessHours.slice(start, start + this.pageSize);

  }

  //====================================================
  // Statistics
  //====================================================

  get totalBusinessHours(): number {

    return this.businessHours.length;

  }

  get activeBusinessHours(): number {

    return this.businessHours.filter(x => x.active === true).length;

  }

  get inactiveBusinessHours(): number {

    return this.businessHours.filter(x => x.active === false).length;

  }

  get flexibleBusinessHours(): number {

    return this.businessHours.filter(x => x.flexibleHours === true).length;

  }

  //====================================================
  // Save / Update
  //====================================================

  saveBusinessHours(): void {

    this.submitted = true;

    const workingDays = this.getWorkingDaysString();

    if (
      !this.businessHour.companyId ||
      !this.businessHour.regionId ||
      !this.businessHour.branchId ||
      !this.businessHour.businessHoursName ||
      !this.businessHour.businessHoursName.trim() ||
      !this.businessHour.startTime ||
      !this.businessHour.endTime ||
      !workingDays
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    if (this.businessHour.startTime >= this.businessHour.endTime) {

      this.alert.warning('Start Time must be earlier than End Time.');

      return;

    }

    if (this.businessHour.breakStart && this.businessHour.breakEnd) {

      if (this.businessHour.breakStart >= this.businessHour.breakEnd) {

        this.alert.warning('Break Start Time must be earlier than Break End Time.');

        return;

      }

      if (
        this.businessHour.breakStart < this.businessHour.startTime ||
        this.businessHour.breakEnd > this.businessHour.endTime
      ) {

        this.alert.warning('Break Time must be within Business Hours.');

        return;

      }

    }

    const payload = {

      businessHoursId: this.isEdit ? this.businessHour.businessHoursId : 0,

      companyId: Number(this.businessHour.companyId),

      regionId: Number(this.businessHour.regionId),

      branchId: Number(this.businessHour.branchId),

      businessHoursName: this.businessHour.businessHoursName.trim(),

      startTime: this.toTimeOnly(this.businessHour.startTime),

      endTime: this.toTimeOnly(this.businessHour.endTime),

      breakStart: this.toTimeOnly(this.businessHour.breakStart),

      breakEnd: this.toTimeOnly(this.businessHour.breakEnd),

      workingDays: workingDays,

      weekend: this.businessHour.weekend ? this.businessHour.weekend.trim() : null,

      totalWorkingHours:
        this.businessHour.totalWorkingHours !== null &&
          this.businessHour.totalWorkingHours !== ''
          ? Number(this.businessHour.totalWorkingHours)
          : null,

      lateMarkGraceTimeMinutes:
        this.businessHour.lateMarkGraceTimeMinutes !== null &&
          this.businessHour.lateMarkGraceTimeMinutes !== ''
          ? Number(this.businessHour.lateMarkGraceTimeMinutes)
          : null,

      halfDayThresholdHours:
        this.businessHour.halfDayThresholdHours !== null &&
          this.businessHour.halfDayThresholdHours !== ''
          ? Number(this.businessHour.halfDayThresholdHours)
          : null,

      flexibleHours: !!this.businessHour.flexibleHours,

      overtimeAllowed: !!this.businessHour.overtimeAllowed,

      description: this.businessHour.description
        ? this.businessHour.description.trim()
        : null,

      active: !!this.businessHour.active

    };

    this.spinner.show();

    if (this.isEdit) {

      this.adminService.updateBusinessHour(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Business Hours updated successfully.'
            );

            this.clear();

            this.loadBusinessHours();

          } else {

            this.alert.warning(
              res?.message || 'Failed to update business hours.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Update business hours error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to update business hours.'
          );

        }

      });

    } else {

      this.adminService.createBusinessHour(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Business Hours created successfully.'
            );

            this.clear();

            this.loadBusinessHours();

          } else {

            this.alert.warning(
              res?.message || 'Failed to create business hours.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Create business hours error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to create business hours.'
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

    this.adminService.getBusinessHourById(id).subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success && res.data) {

          const data = res.data;

          this.businessHour = {

            businessHoursId: data.businessHoursId,

            companyId: data.companyId,

            regionId: data.regionId,

            branchId: data.branchId,

            businessHoursName: data.businessHoursName || '',

            startTime: this.fromTimeOnly(data.startTime),

            endTime: this.fromTimeOnly(data.endTime),

            breakStart: this.fromTimeOnly(data.breakStart),

            breakEnd: this.fromTimeOnly(data.breakEnd),

            workingDaysMap: this.parseWorkingDays(data.workingDays),

            weekend: data.weekend || '',

            totalWorkingHours: data.totalWorkingHours ?? null,

            lateMarkGraceTimeMinutes: data.lateMarkGraceTimeMinutes ?? null,

            halfDayThresholdHours: data.halfDayThresholdHours ?? null,

            flexibleHours: data.flexibleHours === true,

            overtimeAllowed: data.overtimeAllowed === true,

            description: data.description || '',

            active: data.active === true

          };

          this.isEdit = true;

          this.submitted = false;

          this.cd.detectChanges();

        } else {

          this.alert.warning(res?.message || 'Business Hours not found.');

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Get business hours error:', err);

        this.alert.error(
          err?.error?.message || 'Failed to load business hours.'
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

      this.adminService.deleteBusinessHour(id).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Business Hours deleted successfully.'
            );

            if (this.page > 1 && this.pagedBusinessHours.length === 1) {
              this.page = this.page - 1;
            }

            this.loadBusinessHours();

          } else {

            this.alert.warning(
              res?.message || 'Failed to delete business hours.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Delete business hours error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to delete business hours.'
          );

        }

      });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.businessHour = this.getEmptyModel();

    this.submitted = false;

    this.isEdit = false;

  }

  //====================================================
  // Clear Filters
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

    this.loadBusinessHours();

  }

}
