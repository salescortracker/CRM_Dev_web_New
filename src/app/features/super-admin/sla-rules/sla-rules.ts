import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../shared/pagination/pagination';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { ControlsystemService } from '../services/controlsystem-service';
import { AdminService } from '../../admin/services/admin-service';

@Component({
  selector: 'app-sla-rules',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './sla-rules.html',
  styleUrl: './sla-rules.css',
})
export class SlaRules implements OnInit {

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
  // Dropdown Data (from backend)
  //====================================================

  companies: any[] = [];
  regions: any[] = [];
  businessHours: any[] = [];
  holidayCalendars: any[] = [];
  escalationRules: any[] = [];

  //====================================================
  // Time Unit Helper (UI only — collapses into minutes)
  //====================================================

  timeUnits = [
    { label: 'Minutes', multiplier: 1 },
    { label: 'Hours', multiplier: 60 },
    { label: 'Days', multiplier: 1440 }
  ];

  //====================================================
  // SLA Rule List
  //====================================================

  slaRules: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  slaRule: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      slaruleId: 0,

      companyId: null,

      regionId: null,

      slaname: '',

      moduleName: '',

      description: '',

      priority: '',

      firstResponseValue: null,

      firstResponseUnit: 'Minutes',

      resolutionValue: null,

      resolutionUnit: 'Hours',

      warningMinutes: null,

      businessHoursId: null,

      holidayCalendarId: null,

      escalationEnabled: false,

      escalationRuleId: null,

      isActive: true

    };

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadCompanies();

    this.loadRegions();

    this.loadBusinessHours();

    this.loadHolidayCalendars();

    this.loadEscalationRules();

    this.loadSlaRules();

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

  loadBusinessHours(): void {

    this.adminService.getBusinessHours().subscribe({

      next: (res: any) => {

        this.businessHours = res?.data || [];

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading business hours:', err);

        this.businessHours = [];

      }

    });

  }

  loadHolidayCalendars(): void {

    this.adminService.getHolidayCalendars().subscribe({

      next: (res: any) => {

        this.holidayCalendars = res?.data || [];

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading holiday calendars:', err);

        this.holidayCalendars = [];

      }

    });

  }

  loadEscalationRules(): void {

    this.controlsystemService.getEscalationRules().subscribe({

      next: (res: any) => {

        this.escalationRules = res?.data || [];

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading escalation rules:', err);

        this.escalationRules = [];

      }

    });

  }

  //====================================================
  // Load SLA Rules
  //====================================================

  loadSlaRules(): void {

    this.spinner.show();

    this.controlsystemService.getSlarules().subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success) {

          this.slaRules = res.data || [];

        } else {

          this.slaRules = [];

          this.alert.warning(
            res?.message || 'No SLA rule records found.'
          );

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Error loading SLA rules:', err);

        this.slaRules = [];

        this.alert.error(
          err?.error?.message || 'Failed to load SLA rules.'
        );

        this.cd.detectChanges();

      }

    });

  }

  //====================================================
  // Lookup Helpers (Display Names)
  //====================================================

  getCompanyName(id: any): string {

    if (!id) return '-';

    const item = this.companies.find(x => x.companyId === Number(id));

    return item ? item.companyName : '-';

  }

  getRegionName(id: any): string {

    if (!id) return '-';

    const item = this.regions.find(x => x.regionId === Number(id));

    return item ? item.regionName : '-';

  }

  getBusinessHoursName(id: any): string {

    if (!id) return '-';

    const item = this.businessHours.find(
      x => x.businessHoursId === Number(id)
    );

    return item ? item.businessHoursName : '-';

  }

  getHolidayCalendarName(id: any): string {

    if (!id) return '-';

    const item = this.holidayCalendars.find(
      x => x.holidayCalendarId === Number(id)
    );

    return item ? item.holidayName : '-';

  }

  getEscalationRuleName(id: any): string {

    if (!id) return '-';

    const item = this.escalationRules.find(
      x => x.escalationRuleId === Number(id)
    );

    return item ? item.ruleName : '-';

  }

  private minutesToLabel(minutes: number): string {

    if (minutes > 0 && minutes % 1440 === 0) {
      return `${minutes / 1440} Day(s)`;
    }

    if (minutes > 0 && minutes % 60 === 0) {
      return `${minutes / 60} Hour(s)`;
    }

    return `${minutes} Minute(s)`;

  }

  getFirstResponseLabel(item: any): string {

    return this.minutesToLabel(Number(item.firstResponseMinutes || 0));

  }

  getResolutionLabel(item: any): string {

    return this.minutesToLabel(Number(item.resolutionMinutes || 0));

  }

  private minutesToValueUnit(minutes: number): { value: number, unit: string } {

    if (minutes > 0 && minutes % 1440 === 0) {
      return { value: minutes / 1440, unit: 'Days' };
    }

    if (minutes > 0 && minutes % 60 === 0) {
      return { value: minutes / 60, unit: 'Hours' };
    }

    return { value: minutes, unit: 'Minutes' };

  }

  //====================================================
  // Cascading Dropdown
  //====================================================

  get formRegions(): any[] {

    if (!this.slaRule.companyId) return this.regions;

    return this.regions.filter(
      x => x.companyId === Number(this.slaRule.companyId)
    );

  }

  onCompanyChange(): void {

    this.slaRule.regionId = null;

  }

  //====================================================
  // Filtered SLA Rules
  //====================================================

  get filteredSlaRules() {

    return this.slaRules.filter(x => {

      const search = this.searchText.trim().toLowerCase();

      const matchSearch =
        !search ||
        (x.slaname || '').toLowerCase().includes(search) ||
        (x.moduleName || '').toLowerCase().includes(search) ||
        (x.priority || '').toLowerCase().includes(search);

      const matchCompany =
        !this.companyFilter ||
        Number(x.companyId) === Number(this.companyFilter);

      const matchStatus =
        this.statusFilter === '' ||
        (this.statusFilter === 'Active' && x.isActive === true) ||
        (this.statusFilter === 'Inactive' && x.isActive === false);

      return matchSearch && matchCompany && matchStatus;

    });

  }

  //====================================================
  // Pagination
  //====================================================

  get pagedSlaRules() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredSlaRules.slice(start, start + this.pageSize);

  }

  //====================================================
  // Statistics
  //====================================================

  get totalRules(): number {

    return this.slaRules.length;

  }

  get activeRules(): number {

    return this.slaRules.filter(x => x.isActive === true).length;

  }

  get inactiveRules(): number {

    return this.slaRules.filter(x => x.isActive === false).length;

  }

  get escalationEnabledRules(): number {

    return this.slaRules.filter(x => x.escalationEnabled === true).length;

  }

  //====================================================
  // Save / Update
  //====================================================

  saveSlaRule(): void {

    this.submitted = true;

    if (
      !this.slaRule.companyId ||
      !this.slaRule.regionId ||
      !this.slaRule.slaname ||
      !this.slaRule.slaname.trim() ||
      !this.slaRule.moduleName ||
      !this.slaRule.priority ||
      !this.slaRule.firstResponseValue ||
      Number(this.slaRule.firstResponseValue) <= 0 ||
      !this.slaRule.resolutionValue ||
      Number(this.slaRule.resolutionValue) <= 0
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    if (
      this.slaRule.warningMinutes !== null &&
      this.slaRule.warningMinutes !== '' &&
      Number(this.slaRule.warningMinutes) <= 0
    ) {

      this.alert.warning('Warning Minutes must be greater than zero.');

      return;

    }

    if (this.slaRule.escalationEnabled && !this.slaRule.escalationRuleId) {

      this.alert.warning('Escalation Rule is required when escalation is enabled.');

      return;

    }

    const firstResponseUnit = this.timeUnits.find(
      u => u.label === this.slaRule.firstResponseUnit
    ) || this.timeUnits[0];

    const resolutionUnit = this.timeUnits.find(
      u => u.label === this.slaRule.resolutionUnit
    ) || this.timeUnits[0];

    const payload = {

      slaruleId: this.isEdit ? this.slaRule.slaruleId : 0,

      companyId: Number(this.slaRule.companyId),

      regionId: Number(this.slaRule.regionId),

      slaname: this.slaRule.slaname.trim(),

      moduleName: this.slaRule.moduleName,

      description: this.slaRule.description
        ? this.slaRule.description.trim()
        : null,

      priority: this.slaRule.priority,

      firstResponseMinutes:
        Number(this.slaRule.firstResponseValue) * firstResponseUnit.multiplier,

      resolutionMinutes:
        Number(this.slaRule.resolutionValue) * resolutionUnit.multiplier,

      warningMinutes:
        this.slaRule.warningMinutes !== null &&
          this.slaRule.warningMinutes !== ''
          ? Number(this.slaRule.warningMinutes)
          : null,

      businessHoursId: this.slaRule.businessHoursId
        ? Number(this.slaRule.businessHoursId)
        : null,

      holidayCalendarId: this.slaRule.holidayCalendarId
        ? Number(this.slaRule.holidayCalendarId)
        : null,

      escalationEnabled: !!this.slaRule.escalationEnabled,

      escalationRuleId: this.slaRule.escalationRuleId
        ? Number(this.slaRule.escalationRuleId)
        : null,

      isActive: !!this.slaRule.isActive

    };

    this.spinner.show();

    if (this.isEdit) {

      this.controlsystemService.updateSlarule(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'SLA Rule updated successfully.'
            );

            this.clear();

            this.loadSlaRules();

          } else {

            this.alert.warning(
              res?.message || 'Failed to update SLA rule.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Update SLA rule error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to update SLA rule.'
          );

        }

      });

    } else {

      this.controlsystemService.createSlarule(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'SLA Rule created successfully.'
            );

            this.clear();

            this.loadSlaRules();

          } else {

            this.alert.warning(
              res?.message || 'Failed to create SLA rule.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Create SLA rule error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to create SLA rule.'
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

    this.controlsystemService.getSlaruleById(id).subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success && res.data) {

          const data = res.data;

          const firstResponse = this.minutesToValueUnit(
            Number(data.firstResponseMinutes || 0)
          );

          const resolution = this.minutesToValueUnit(
            Number(data.resolutionMinutes || 0)
          );

          this.slaRule = {

            slaruleId: data.slaruleId,

            companyId: data.companyId,

            regionId: data.regionId,

            slaname: data.slaname || '',

            moduleName: data.moduleName || '',

            description: data.description || '',

            priority: data.priority || '',

            firstResponseValue: firstResponse.value,

            firstResponseUnit: firstResponse.unit,

            resolutionValue: resolution.value,

            resolutionUnit: resolution.unit,

            warningMinutes: data.warningMinutes ?? null,

            businessHoursId: data.businessHoursId,

            holidayCalendarId: data.holidayCalendarId,

            escalationEnabled: data.escalationEnabled === true,

            escalationRuleId: data.escalationRuleId,

            isActive: data.isActive === true

          };

          this.isEdit = true;

          this.submitted = false;

          this.cd.detectChanges();

        } else {

          this.alert.warning(res?.message || 'SLA Rule not found.');

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Get SLA rule error:', err);

        this.alert.error(
          err?.error?.message || 'Failed to load SLA rule.'
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

      this.controlsystemService.deleteSlarule(id).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'SLA Rule deleted successfully.'
            );

            if (this.page > 1 && this.pagedSlaRules.length === 1) {
              this.page = this.page - 1;
            }

            this.loadSlaRules();

          } else {

            this.alert.warning(
              res?.message || 'Failed to delete SLA rule.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Delete SLA rule error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to delete SLA rule.'
          );

        }

      });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.slaRule = this.getEmptyModel();

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

    this.loadSlaRules();

  }

}
