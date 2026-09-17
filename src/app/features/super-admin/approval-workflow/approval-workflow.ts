import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../shared/pagination/pagination';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { ControlsystemService } from '../services/controlsystem-service';

@Component({
  selector: 'app-approval-workflow',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './approval-workflow.html',
  styleUrl: './approval-workflow.css',
})
export class ApprovalWorkflow implements OnInit {

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
  // Approval Workflow List
  //====================================================

  approvalWorkflows: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  approvalWorkflow: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      approvalWorkflowId: 0,

      companyId: null,

      regionId: null,

      workflowName: '',

      moduleName: '',

      description: '',

      approvalType: '',

      approvalLevels: 1,

      finalApprovalAction: '',

      finalRejectionAction: '',

      isActive: true

    };

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadCompanies();

    this.loadRegions();

    this.loadApprovalWorkflows();

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
  // Load Approval Workflows
  //====================================================

  loadApprovalWorkflows(): void {

    this.spinner.show();

    this.controlsystemService.getApprovalWorkflows().subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success) {

          this.approvalWorkflows = res.data || [];

        } else {

          this.approvalWorkflows = [];

          this.alert.warning(
            res?.message || 'No approval workflow records found.'
          );

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Error loading approval workflows:', err);

        this.approvalWorkflows = [];

        this.alert.error(
          err?.error?.message || 'Failed to load approval workflows.'
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

    if (!this.approvalWorkflow.companyId) return this.regions;

    return this.regions.filter(
      x => x.companyId === Number(this.approvalWorkflow.companyId)
    );

  }

  onCompanyChange(): void {

    this.approvalWorkflow.regionId = null;

  }

  //====================================================
  // Filtered Approval Workflows
  //====================================================

  get filteredApprovalWorkflows() {

    return this.approvalWorkflows.filter(x => {

      const search = this.searchText.trim().toLowerCase();

      const matchSearch =
        !search ||
        (x.workflowName || '').toLowerCase().includes(search) ||
        (x.moduleName || '').toLowerCase().includes(search) ||
        (x.approvalType || '').toLowerCase().includes(search);

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

  get pagedApprovalWorkflows() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredApprovalWorkflows.slice(start, start + this.pageSize);

  }

  //====================================================
  // Statistics
  //====================================================

  get totalApprovalWorkflows(): number {

    return this.approvalWorkflows.length;

  }

  get activeApprovalWorkflows(): number {

    return this.approvalWorkflows.filter(x => x.isActive === true).length;

  }

  get inactiveApprovalWorkflows(): number {

    return this.approvalWorkflows.filter(x => x.isActive === false).length;

  }

  get multiLevelWorkflows(): number {

    return this.approvalWorkflows.filter(
      x => Number(x.approvalLevels) > 1
    ).length;

  }

  //====================================================
  // Save / Update
  //====================================================

  saveApprovalWorkflow(): void {

    this.submitted = true;

    if (
      !this.approvalWorkflow.companyId ||
      !this.approvalWorkflow.regionId ||
      !this.approvalWorkflow.workflowName ||
      !this.approvalWorkflow.workflowName.trim() ||
      !this.approvalWorkflow.moduleName ||
      !this.approvalWorkflow.approvalType ||
      !this.approvalWorkflow.approvalLevels ||
      Number(this.approvalWorkflow.approvalLevels) <= 0
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    const payload = {

      approvalWorkflowId: this.isEdit ? this.approvalWorkflow.approvalWorkflowId : 0,

      companyId: Number(this.approvalWorkflow.companyId),

      regionId: Number(this.approvalWorkflow.regionId),

      workflowName: this.approvalWorkflow.workflowName.trim(),

      moduleName: this.approvalWorkflow.moduleName,

      description: this.approvalWorkflow.description
        ? this.approvalWorkflow.description.trim()
        : null,

      approvalType: this.approvalWorkflow.approvalType,

      approvalLevels: Number(this.approvalWorkflow.approvalLevels),

      finalApprovalAction: this.approvalWorkflow.finalApprovalAction
        ? this.approvalWorkflow.finalApprovalAction.trim()
        : null,

      finalRejectionAction: this.approvalWorkflow.finalRejectionAction
        ? this.approvalWorkflow.finalRejectionAction.trim()
        : null,

      isActive: !!this.approvalWorkflow.isActive

    };

    this.spinner.show();

    if (this.isEdit) {

      this.controlsystemService.updateApprovalWorkflow(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Approval Workflow updated successfully.'
            );

            this.clear();

            this.loadApprovalWorkflows();

          } else {

            this.alert.warning(
              res?.message || 'Failed to update approval workflow.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Update approval workflow error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to update approval workflow.'
          );

        }

      });

    } else {

      this.controlsystemService.createApprovalWorkflow(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Approval Workflow created successfully.'
            );

            this.clear();

            this.loadApprovalWorkflows();

          } else {

            this.alert.warning(
              res?.message || 'Failed to create approval workflow.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Create approval workflow error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to create approval workflow.'
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

    this.controlsystemService.getApprovalWorkflowById(id).subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success && res.data) {

          const data = res.data;

          this.approvalWorkflow = {

            approvalWorkflowId: data.approvalWorkflowId,

            companyId: data.companyId,

            regionId: data.regionId,

            workflowName: data.workflowName || '',

            moduleName: data.moduleName || '',

            description: data.description || '',

            approvalType: data.approvalType || '',

            approvalLevels: data.approvalLevels ?? 1,

            finalApprovalAction: data.finalApprovalAction || '',

            finalRejectionAction: data.finalRejectionAction || '',

            isActive: data.isActive === true

          };

          this.isEdit = true;

          this.submitted = false;

          this.cd.detectChanges();

        } else {

          this.alert.warning(res?.message || 'Approval Workflow not found.');

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Get approval workflow error:', err);

        this.alert.error(
          err?.error?.message || 'Failed to load approval workflow.'
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

      this.controlsystemService.deleteApprovalWorkflow(id).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Approval Workflow deleted successfully.'
            );

            if (this.page > 1 && this.pagedApprovalWorkflows.length === 1) {
              this.page = this.page - 1;
            }

            this.loadApprovalWorkflows();

          } else {

            this.alert.warning(
              res?.message || 'Failed to delete approval workflow.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Delete approval workflow error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to delete approval workflow.'
          );

        }

      });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.approvalWorkflow = this.getEmptyModel();

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

    this.loadApprovalWorkflows();

  }

}
