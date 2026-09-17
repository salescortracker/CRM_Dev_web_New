import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../shared/pagination/pagination';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { ControlsystemService } from '../services/controlsystem-service';

@Component({
  selector: 'app-escalation-rules',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './escalation-rules.html',
  styleUrl: './escalation-rules.css',
})
export class EscalationRules implements OnInit {

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

  companies: any[] = [];
  regions: any[] = [];

  //====================================================
  // Escalation Rule List
  //====================================================

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
  // Form Model
  //====================================================

  escalationRule: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      escalationRuleId: 0,

      companyId: null,

      regionId: null,

      ruleName: '',

      moduleName: '',

      description: '',

      escalateAfterValue: null,

      escalateAfterUnit: 'Minutes',

      escalationLevel: 1,

      escalateToType: '',

      escalateToUserId: null,

      notificationMethod: '',

      repeatEscalation: false,

      maximumEscalationLevel: null,

      isActive: true

    };

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadCompanies();

    this.loadRegions();

    this.loadEscalationRules();

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

  //====================================================
  // Load Escalation Rules
  //====================================================

  loadEscalationRules(): void {

    this.spinner.show();

    this.controlsystemService.getEscalationRules().subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success) {

          this.escalationRules = res.data || [];

        } else {

          this.escalationRules = [];

          this.alert.warning(
            res?.message || 'No escalation rule records found.'
          );

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Error loading escalation rules:', err);

        this.escalationRules = [];

        this.alert.error(
          err?.error?.message || 'Failed to load escalation rules.'
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

  getEscalateAfterLabel(item: any): string {

    const minutes = Number(item.escalateAfterMinutes || 0);

    if (minutes % 1440 === 0 && minutes > 0) {
      return `${minutes / 1440} Day(s)`;
    }

    if (minutes % 60 === 0 && minutes > 0) {
      return `${minutes / 60} Hour(s)`;
    }

    return `${minutes} Minute(s)`;

  }

  //====================================================
  // Cascading Dropdown
  //====================================================

  get formRegions(): any[] {

    if (!this.escalationRule.companyId) return this.regions;

    return this.regions.filter(
      x => x.companyId === Number(this.escalationRule.companyId)
    );

  }

  onCompanyChange(): void {

    this.escalationRule.regionId = null;

  }

  //====================================================
  // Filtered Escalation Rules
  //====================================================

  get filteredEscalationRules() {

    return this.escalationRules.filter(x => {

      const search = this.searchText.trim().toLowerCase();

      const matchSearch =
        !search ||
        (x.ruleName || '').toLowerCase().includes(search) ||
        (x.moduleName || '').toLowerCase().includes(search) ||
        (x.escalateToType || '').toLowerCase().includes(search);

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

  get pagedEscalationRules() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredEscalationRules.slice(start, start + this.pageSize);

  }

  //====================================================
  // Statistics
  //====================================================

  get totalRules(): number {

    return this.escalationRules.length;

  }

  get activeRules(): number {

    return this.escalationRules.filter(x => x.isActive === true).length;

  }

  get inactiveRules(): number {

    return this.escalationRules.filter(x => x.isActive === false).length;

  }

  get repeatingRules(): number {

    return this.escalationRules.filter(x => x.repeatEscalation === true).length;

  }

  //====================================================
  // Save / Update
  //====================================================

  saveEscalationRule(): void {

    this.submitted = true;

    if (
      !this.escalationRule.companyId ||
      !this.escalationRule.regionId ||
      !this.escalationRule.ruleName ||
      !this.escalationRule.ruleName.trim() ||
      !this.escalationRule.moduleName ||
      !this.escalationRule.escalateAfterValue ||
      Number(this.escalationRule.escalateAfterValue) <= 0 ||
      !this.escalationRule.escalationLevel ||
      Number(this.escalationRule.escalationLevel) <= 0 ||
      !this.escalationRule.escalateToType ||
      !this.escalationRule.notificationMethod
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    const unit = this.timeUnits.find(
      u => u.label === this.escalationRule.escalateAfterUnit
    ) || this.timeUnits[0];

    const escalateAfterMinutes =
      Number(this.escalationRule.escalateAfterValue) * unit.multiplier;

    const payload = {

      escalationRuleId: this.isEdit ? this.escalationRule.escalationRuleId : 0,

      companyId: Number(this.escalationRule.companyId),

      regionId: Number(this.escalationRule.regionId),

      ruleName: this.escalationRule.ruleName.trim(),

      moduleName: this.escalationRule.moduleName,

      description: this.escalationRule.description
        ? this.escalationRule.description.trim()
        : null,

      escalateAfterMinutes: escalateAfterMinutes,

      escalationLevel: Number(this.escalationRule.escalationLevel),

      escalateToType: this.escalationRule.escalateToType,

      escalateToUserId: this.escalationRule.escalateToUserId
        ? Number(this.escalationRule.escalateToUserId)
        : null,

      notificationMethod: this.escalationRule.notificationMethod,

      repeatEscalation: !!this.escalationRule.repeatEscalation,

      maximumEscalationLevel:
        this.escalationRule.maximumEscalationLevel !== null &&
          this.escalationRule.maximumEscalationLevel !== ''
          ? Number(this.escalationRule.maximumEscalationLevel)
          : null,

      isActive: !!this.escalationRule.isActive

    };

    this.spinner.show();

    if (this.isEdit) {

      this.controlsystemService.updateEscalationRule(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Escalation Rule updated successfully.'
            );

            this.clear();

            this.loadEscalationRules();

          } else {

            this.alert.warning(
              res?.message || 'Failed to update escalation rule.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Update escalation rule error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to update escalation rule.'
          );

        }

      });

    } else {

      this.controlsystemService.createEscalationRule(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Escalation Rule created successfully.'
            );

            this.clear();

            this.loadEscalationRules();

          } else {

            this.alert.warning(
              res?.message || 'Failed to create escalation rule.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Create escalation rule error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to create escalation rule.'
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

    this.controlsystemService.getEscalationRuleById(id).subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success && res.data) {

          const data = res.data;

          const minutes = Number(data.escalateAfterMinutes || 0);

          let unit = 'Minutes';
          let value = minutes;

          if (minutes > 0 && minutes % 1440 === 0) {
            unit = 'Days';
            value = minutes / 1440;
          } else if (minutes > 0 && minutes % 60 === 0) {
            unit = 'Hours';
            value = minutes / 60;
          }

          this.escalationRule = {

            escalationRuleId: data.escalationRuleId,

            companyId: data.companyId,

            regionId: data.regionId,

            ruleName: data.ruleName || '',

            moduleName: data.moduleName || '',

            description: data.description || '',

            escalateAfterValue: value,

            escalateAfterUnit: unit,

            escalationLevel: data.escalationLevel ?? 1,

            escalateToType: data.escalateToType || '',

            escalateToUserId: data.escalateToUserId ?? null,

            notificationMethod: data.notificationMethod || '',

            repeatEscalation: data.repeatEscalation === true,

            maximumEscalationLevel: data.maximumEscalationLevel ?? null,

            isActive: data.isActive === true

          };

          this.isEdit = true;

          this.submitted = false;

          this.cd.detectChanges();

        } else {

          this.alert.warning(res?.message || 'Escalation Rule not found.');

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Get escalation rule error:', err);

        this.alert.error(
          err?.error?.message || 'Failed to load escalation rule.'
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

      this.controlsystemService.deleteEscalationRule(id).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Escalation Rule deleted successfully.'
            );

            if (this.page > 1 && this.pagedEscalationRules.length === 1) {
              this.page = this.page - 1;
            }

            this.loadEscalationRules();

          } else {

            this.alert.warning(
              res?.message || 'Failed to delete escalation rule.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Delete escalation rule error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to delete escalation rule.'
          );

        }

      });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.escalationRule = this.getEmptyModel();

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

    this.loadEscalationRules();

  }

}
