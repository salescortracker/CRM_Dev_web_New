import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../shared/pagination/pagination';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { ControlsystemService } from '../services/controlsystem-service';

@Component({
  selector: 'app-auto-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './auto-assignment.html',
  styleUrl: './auto-assignment.css',
})
export class AutoAssignment implements OnInit {

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
  // Auto Assignment Rule List
  //====================================================

  autoAssignmentRules: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  autoAssignmentRule: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      autoAssignmentRuleId: 0,

      companyId: null,

      regionId: null,

      ruleName: '',

      moduleName: '',

      description: '',

      assignmentMethod: '',

      teamId: null,

      userId: null,

      executionOrder: null,

      isActive: true

    };

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadCompanies();

    this.loadRegions();

    this.loadAutoAssignmentRules();

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
  // Load Auto Assignment Rules
  //====================================================

  loadAutoAssignmentRules(): void {

    this.spinner.show();

    this.controlsystemService.getAutoAssignmentRules().subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success) {

          this.autoAssignmentRules = res.data || [];

        } else {

          this.autoAssignmentRules = [];

          this.alert.warning(
            res?.message || 'No auto assignment rule records found.'
          );

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Error loading auto assignment rules:', err);

        this.autoAssignmentRules = [];

        this.alert.error(
          err?.error?.message || 'Failed to load auto assignment rules.'
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

  //====================================================
  // Cascading Dropdown
  //====================================================

  get formRegions(): any[] {

    if (!this.autoAssignmentRule.companyId) return this.regions;

    return this.regions.filter(
      x => x.companyId === Number(this.autoAssignmentRule.companyId)
    );

  }

  onCompanyChange(): void {

    this.autoAssignmentRule.regionId = null;

  }

  //====================================================
  // Filtered Auto Assignment Rules
  //====================================================

  get filteredAutoAssignmentRules() {

    return this.autoAssignmentRules.filter(x => {

      const search = this.searchText.trim().toLowerCase();

      const matchSearch =
        !search ||
        (x.ruleName || '').toLowerCase().includes(search) ||
        (x.moduleName || '').toLowerCase().includes(search) ||
        (x.assignmentMethod || '').toLowerCase().includes(search);

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

  get pagedAutoAssignmentRules() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredAutoAssignmentRules.slice(start, start + this.pageSize);

  }

  //====================================================
  // Statistics
  //====================================================

  get totalRules(): number {

    return this.autoAssignmentRules.length;

  }

  get activeRules(): number {

    return this.autoAssignmentRules.filter(x => x.isActive === true).length;

  }

  get inactiveRules(): number {

    return this.autoAssignmentRules.filter(x => x.isActive === false).length;

  }

  get teamBasedRules(): number {

    return this.autoAssignmentRules.filter(x => !!x.teamId).length;

  }

  //====================================================
  // Save / Update
  //====================================================

  saveAutoAssignmentRule(): void {

    this.submitted = true;

    if (
      !this.autoAssignmentRule.companyId ||
      !this.autoAssignmentRule.regionId ||
      !this.autoAssignmentRule.ruleName ||
      !this.autoAssignmentRule.ruleName.trim() ||
      !this.autoAssignmentRule.moduleName ||
      !this.autoAssignmentRule.assignmentMethod
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    if (!this.autoAssignmentRule.teamId && !this.autoAssignmentRule.userId) {

      this.alert.warning('Either Team ID or User ID must be provided.');

      return;

    }

    const payload = {

      autoAssignmentRuleId: this.isEdit ? this.autoAssignmentRule.autoAssignmentRuleId : 0,

      companyId: Number(this.autoAssignmentRule.companyId),

      regionId: Number(this.autoAssignmentRule.regionId),

      ruleName: this.autoAssignmentRule.ruleName.trim(),

      moduleName: this.autoAssignmentRule.moduleName,

      description: this.autoAssignmentRule.description
        ? this.autoAssignmentRule.description.trim()
        : null,

      assignmentMethod: this.autoAssignmentRule.assignmentMethod,

      teamId: this.autoAssignmentRule.teamId
        ? Number(this.autoAssignmentRule.teamId)
        : null,

      userId: this.autoAssignmentRule.userId
        ? Number(this.autoAssignmentRule.userId)
        : null,

      executionOrder:
        this.autoAssignmentRule.executionOrder !== null &&
          this.autoAssignmentRule.executionOrder !== ''
          ? Number(this.autoAssignmentRule.executionOrder)
          : null,

      isActive: !!this.autoAssignmentRule.isActive

    };

    this.spinner.show();

    if (this.isEdit) {

      this.controlsystemService.updateAutoAssignmentRule(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Auto Assignment Rule updated successfully.'
            );

            this.clear();

            this.loadAutoAssignmentRules();

          } else {

            this.alert.warning(
              res?.message || 'Failed to update auto assignment rule.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Update auto assignment rule error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to update auto assignment rule.'
          );

        }

      });

    } else {

      this.controlsystemService.createAutoAssignmentRule(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Auto Assignment Rule created successfully.'
            );

            this.clear();

            this.loadAutoAssignmentRules();

          } else {

            this.alert.warning(
              res?.message || 'Failed to create auto assignment rule.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Create auto assignment rule error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to create auto assignment rule.'
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

    this.controlsystemService.getAutoAssignmentRuleById(id).subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success && res.data) {

          const data = res.data;

          this.autoAssignmentRule = {

            autoAssignmentRuleId: data.autoAssignmentRuleId,

            companyId: data.companyId,

            regionId: data.regionId,

            ruleName: data.ruleName || '',

            moduleName: data.moduleName || '',

            description: data.description || '',

            assignmentMethod: data.assignmentMethod || '',

            teamId: data.teamId ?? null,

            userId: data.userId ?? null,

            executionOrder: data.executionOrder ?? null,

            isActive: data.isActive === true

          };

          this.isEdit = true;

          this.submitted = false;

          this.cd.detectChanges();

        } else {

          this.alert.warning(res?.message || 'Auto Assignment Rule not found.');

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Get auto assignment rule error:', err);

        this.alert.error(
          err?.error?.message || 'Failed to load auto assignment rule.'
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

      this.controlsystemService.deleteAutoAssignmentRule(id).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Auto Assignment Rule deleted successfully.'
            );

            if (this.page > 1 && this.pagedAutoAssignmentRules.length === 1) {
              this.page = this.page - 1;
            }

            this.loadAutoAssignmentRules();

          } else {

            this.alert.warning(
              res?.message || 'Failed to delete auto assignment rule.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Delete auto assignment rule error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to delete auto assignment rule.'
          );

        }

      });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.autoAssignmentRule = this.getEmptyModel();

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

    this.loadAutoAssignmentRules();

  }

}
