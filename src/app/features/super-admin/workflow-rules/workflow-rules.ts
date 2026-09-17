import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../shared/pagination/pagination';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { ControlsystemService } from '../services/controlsystem-service';

@Component({
  selector: 'app-workflow-rules',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './workflow-rules.html',
  styleUrl: './workflow-rules.css',
})
export class WorkflowRules implements OnInit {

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
  // Workflow Rule List
  //====================================================

  workflowRules: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  workflowRule: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      workflowRuleId: 0,

      companyId: null,

      regionId: null,

      workflowRuleName: '',

      workflowRuleCode: '',

      description: '',

      moduleName: '',

      triggerEvent: '',

      executionType: 'Immediate',

      priority: 'Medium',

      executionOrder: null,

      stopProcessing: false,

      isActive: true

    };

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadCompanies();

    this.loadRegions();

    this.loadWorkflowRules();

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
  // Load Workflow Rules
  //====================================================

  loadWorkflowRules(): void {

    this.spinner.show();

    this.controlsystemService.getWorkflowRules().subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success) {

          this.workflowRules = res.data || [];

        } else {

          this.workflowRules = [];

          this.alert.warning(
            res?.message || 'No workflow rule records found.'
          );

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Error loading workflow rules:', err);

        this.workflowRules = [];

        this.alert.error(
          err?.error?.message || 'Failed to load workflow rules.'
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

    if (!this.workflowRule.companyId) return this.regions;

    return this.regions.filter(
      x => x.companyId === Number(this.workflowRule.companyId)
    );

  }

  onCompanyChange(): void {

    this.workflowRule.regionId = null;

  }

  //====================================================
  // Filtered Workflow Rules
  //====================================================

  get filteredWorkflowRules() {

    return this.workflowRules.filter(x => {

      const search = this.searchText.trim().toLowerCase();

      const matchSearch =
        !search ||
        (x.workflowRuleName || '').toLowerCase().includes(search) ||
        (x.workflowRuleCode || '').toLowerCase().includes(search) ||
        (x.moduleName || '').toLowerCase().includes(search) ||
        (x.triggerEvent || '').toLowerCase().includes(search);

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

  get pagedWorkflowRules() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredWorkflowRules.slice(start, start + this.pageSize);

  }

  //====================================================
  // Statistics
  //====================================================

  get totalWorkflowRules(): number {

    return this.workflowRules.length;

  }

  get activeWorkflowRules(): number {

    return this.workflowRules.filter(x => x.isActive === true).length;

  }

  get inactiveWorkflowRules(): number {

    return this.workflowRules.filter(x => x.isActive === false).length;

  }

  get highPriorityRules(): number {

    return this.workflowRules.filter(x => x.priority === 'High').length;

  }

  //====================================================
  // Save / Update
  //====================================================

  saveWorkflowRule(): void {

    this.submitted = true;

    if (
      !this.workflowRule.companyId ||
      !this.workflowRule.regionId ||
      !this.workflowRule.workflowRuleName ||
      !this.workflowRule.workflowRuleName.trim() ||
      !this.workflowRule.workflowRuleCode ||
      !this.workflowRule.workflowRuleCode.trim() ||
      !this.workflowRule.moduleName ||
      !this.workflowRule.triggerEvent
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    const payload = {

      workflowRuleId: this.isEdit ? this.workflowRule.workflowRuleId : 0,

      companyId: Number(this.workflowRule.companyId),

      regionId: Number(this.workflowRule.regionId),

      workflowRuleName: this.workflowRule.workflowRuleName.trim(),

      workflowRuleCode: this.workflowRule.workflowRuleCode.trim(),

      description: this.workflowRule.description
        ? this.workflowRule.description.trim()
        : null,

      moduleName: this.workflowRule.moduleName,

      triggerEvent: this.workflowRule.triggerEvent,

      executionType: this.workflowRule.executionType || 'Immediate',

      priority: this.workflowRule.priority || 'Medium',

      executionOrder:
        this.workflowRule.executionOrder !== null &&
          this.workflowRule.executionOrder !== ''
          ? Number(this.workflowRule.executionOrder)
          : null,

      stopProcessing: !!this.workflowRule.stopProcessing,

      isActive: !!this.workflowRule.isActive

    };

    this.spinner.show();

    if (this.isEdit) {

      this.controlsystemService.updateWorkflowRule(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Workflow Rule updated successfully.'
            );

            this.clear();

            this.loadWorkflowRules();

          } else {

            this.alert.warning(
              res?.message || 'Failed to update workflow rule.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Update workflow rule error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to update workflow rule.'
          );

        }

      });

    } else {

      this.controlsystemService.createWorkflowRule(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Workflow Rule created successfully.'
            );

            this.clear();

            this.loadWorkflowRules();

          } else {

            this.alert.warning(
              res?.message || 'Failed to create workflow rule.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Create workflow rule error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to create workflow rule.'
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

    this.controlsystemService.getWorkflowRuleById(id).subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success && res.data) {

          const data = res.data;

          this.workflowRule = {

            workflowRuleId: data.workflowRuleId,

            companyId: data.companyId,

            regionId: data.regionId,

            workflowRuleName: data.workflowRuleName || '',

            workflowRuleCode: data.workflowRuleCode || '',

            description: data.description || '',

            moduleName: data.moduleName || '',

            triggerEvent: data.triggerEvent || '',

            executionType: data.executionType || 'Immediate',

            priority: data.priority || 'Medium',

            executionOrder: data.executionOrder ?? null,

            stopProcessing: data.stopProcessing === true,

            isActive: data.isActive === true

          };

          this.isEdit = true;

          this.submitted = false;

          this.cd.detectChanges();

        } else {

          this.alert.warning(res?.message || 'Workflow Rule not found.');

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Get workflow rule error:', err);

        this.alert.error(
          err?.error?.message || 'Failed to load workflow rule.'
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

      this.controlsystemService.deleteWorkflowRule(id).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Workflow Rule deleted successfully.'
            );

            if (this.page > 1 && this.pagedWorkflowRules.length === 1) {
              this.page = this.page - 1;
            }

            this.loadWorkflowRules();

          } else {

            this.alert.warning(
              res?.message || 'Failed to delete workflow rule.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Delete workflow rule error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to delete workflow rule.'
          );

        }

      });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.workflowRule = this.getEmptyModel();

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

    this.loadWorkflowRules();

  }

}
