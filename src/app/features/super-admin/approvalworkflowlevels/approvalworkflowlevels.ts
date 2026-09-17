import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';

@Component({
  selector: 'app-approvalworkflowlevels',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './approvalworkflowlevels.html',
  styleUrl: './approvalworkflowlevels.css',
})
export class Approvalworkflowlevels implements OnInit {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }


  // ==============================
  // Modal Controls
  // ==============================

  showModal = false;

  isEdit = false;

  editId = 0;


  // ==============================
  // Search / Filters
  // ==============================

  searchText = '';

  workflowFilter: number | '' = '';

  statusFilter = '';


  // ==============================
  // Data
  // ==============================

  levels: any[] = [];

  approvalWorkflows: any[] = [];


  // ==============================
  // Dropdown Options
  // ==============================

  approverTypeOptions = ['User', 'Role'];


  // ==============================
  // Form Model
  // ==============================

  model: any = this.emptyModel();

  emptyModel() {
    return {
      approvalWorkflowLevelId: 0,
      approvalWorkflowId: 0,
      levelNumber: 1,
      approverType: '',
      approverUserId: null,
      approverRoleId: null,
      approvalCondition: '',
      onApprovalAction: '',
      onRejectionAction: '',
      companyId: 0,
      regionId: 0,
      isActive: true
    };
  }


  // ==============================
  // On Init
  // ==============================

  ngOnInit(): void {
    this.getApprovalWorkflows();
    this.getLevels();
  }


  // ==============================
  // Get All Approval Workflows (for dropdown)
  // ==============================

  getApprovalWorkflows(): void {

    this.http
      .get<ApiResponse<any[]>>(
        `${this.baseUrl}/SuperAdmin/getallapprovalworkflows`
      )
      .subscribe({

        next: (response: any) => {

          if (response?.success) {
            this.approvalWorkflows = response.data || [];
          } else {
            this.approvalWorkflows = [];
          }

          this.cd.detectChanges();
        },

        error: () => {
          this.approvalWorkflows = [];
          this.cd.detectChanges();
        }

      });

  }


  // ==============================
  // Get All Approval Workflow Levels
  // ==============================

  getLevels(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(
        `${this.baseUrl}/SuperAdmin/getallapprovalworkflowlevels`
      )
      .subscribe({

        next: (response: any) => {

          this.spinner.hide();

          if (response?.success) {

            this.levels = response.data || [];

          } else {

            this.levels = [];

            this.alert.warning(
              response?.message ||
              'Unable to load approval workflow levels.'
            );

          }

          this.cd.detectChanges();
        },

        error: (error: any) => {

          this.spinner.hide();

          this.levels = [];

          this.alert.error(
            error?.error?.message ||
            'Failed to load approval workflow levels.'
          );

          this.cd.detectChanges();
        }

      });

  }


  // ==============================
  // Statistics
  // ==============================

  get totalCount(): number {
    return this.levels.length;
  }

  get activeCount(): number {
    return this.levels.filter(x => x.isActive).length;
  }

  get inactiveCount(): number {
    return this.levels.filter(x => !x.isActive).length;
  }


  // ==============================
  // Filtered Levels
  // ==============================

  get filteredLevels(): any[] {

    const search = this.searchText
      .trim()
      .toLowerCase();

    return this.levels.filter(item => {

      const workflowName =
        (item.workflowName || '').toLowerCase();

      const approverType =
        (item.approverType || '').toLowerCase();


      const matchesSearch =
        !search ||
        workflowName.includes(search) ||
        approverType.includes(search);


      const matchesWorkflow =
        this.workflowFilter === '' ||
        item.approvalWorkflowId === this.workflowFilter;


      const matchesStatus =
        !this.statusFilter ||
        (this.statusFilter === 'Active' && item.isActive) ||
        (this.statusFilter === 'Inactive' && !item.isActive);


      return matchesSearch && matchesWorkflow && matchesStatus;

    });

  }


  // ==============================
  // Refresh
  // ==============================

  refresh(): void {
    this.getApprovalWorkflows();
    this.getLevels();
  }


  // ==============================
  // Clear Filters
  // ==============================

  clearFilters(): void {
    this.searchText = '';
    this.workflowFilter = '';
    this.statusFilter = '';
  }


  // ==============================
  // Add Modal
  // ==============================

  openAddModal(): void {

    this.isEdit = false;

    this.editId = 0;

    this.model = this.emptyModel();

    this.showModal = true;

    this.cd.detectChanges();

  }


  // ==============================
  // Close Modal
  // ==============================

  closeModal(): void {

    this.showModal = false;

    this.isEdit = false;

    this.editId = 0;

    this.model = this.emptyModel();

    this.cd.detectChanges();

  }


  // ==============================
  // On Workflow Change
  // (auto-fill Company / Region from the selected workflow)
  // ==============================

  onWorkflowChange(): void {

    const workflow = this.approvalWorkflows.find(
      x => x.approvalWorkflowId === Number(this.model.approvalWorkflowId)
    );

    this.model.companyId = workflow ? workflow.companyId : 0;

    this.model.regionId = workflow ? workflow.regionId : 0;

  }


  // ==============================
  // On Approver Type Change
  // ==============================

  onApproverTypeChange(): void {

    if (this.model.approverType === 'User') {
      this.model.approverRoleId = null;
    } else if (this.model.approverType === 'Role') {
      this.model.approverUserId = null;
    }

  }


  // ==============================
  // Save / Update Level
  // ==============================

  saveLevel(): void {

    // Approval Workflow validation
    if (
      !this.model.approvalWorkflowId ||
      Number(this.model.approvalWorkflowId) <= 0
    ) {

      this.alert.warning(
        'Approval Workflow is required.'
      );

      return;

    }


    // Level Number validation
    if (
      this.model.levelNumber === null ||
      this.model.levelNumber === undefined ||
      Number(this.model.levelNumber) <= 0
    ) {

      this.alert.warning(
        'Level Number must be greater than zero.'
      );

      return;

    }


    // Approver Type validation
    if (!this.model.approverType?.trim()) {

      this.alert.warning(
        'Approver Type is required.'
      );

      return;

    }


    // Approver User validation
    if (
      this.model.approverType === 'User' &&
      (!this.model.approverUserId ||
        Number(this.model.approverUserId) <= 0)
    ) {

      this.alert.warning(
        'Approver User is required.'
      );

      return;

    }


    // Approver Role validation
    if (
      this.model.approverType === 'Role' &&
      (!this.model.approverRoleId ||
        Number(this.model.approverRoleId) <= 0)
    ) {

      this.alert.warning(
        'Approver Role is required.'
      );

      return;

    }


    // Company / Region validation
    if (!this.model.companyId || !this.model.regionId) {

      this.alert.warning(
        'Selected Approval Workflow is missing Company / Region details.'
      );

      return;

    }


    // Prepare request
    const request: any = {

      approvalWorkflowLevelId:
        this.isEdit ? this.editId : 0,

      approvalWorkflowId:
        Number(this.model.approvalWorkflowId),

      levelNumber:
        Number(this.model.levelNumber),

      approverType:
        this.model.approverType.trim(),

      approverUserId:
        this.model.approverType === 'User'
          ? Number(this.model.approverUserId)
          : null,

      approverRoleId:
        this.model.approverType === 'Role'
          ? Number(this.model.approverRoleId)
          : null,

      approvalCondition:
        this.model.approvalCondition?.trim() || null,

      onApprovalAction:
        this.model.onApprovalAction?.trim() || null,

      onRejectionAction:
        this.model.onRejectionAction?.trim() || null,

      companyId:
        Number(this.model.companyId),

      regionId:
        Number(this.model.regionId),

      isActive:
        this.model.isActive

    };


    this.spinner.show();


    // ==============================
    // UPDATE
    // ==============================

    if (this.isEdit) {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/SuperAdmin/updateapprovalworkflowlevel`,
          request
        )
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Approval Workflow Level Updated Successfully.'
              );

              this.closeModal();

              this.getLevels();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to update approval workflow level.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error: any) => {

            this.spinner.hide();

            this.alert.error(
              error?.error?.message ||
              'Failed to update approval workflow level.'
            );

            this.cd.detectChanges();

          }

        });

    }

    // ==============================
    // CREATE
    // ==============================

    else {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/SuperAdmin/createapprovalworkflowlevel`,
          request
        )
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Approval Workflow Level Created Successfully.'
              );

              this.closeModal();

              this.getLevels();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to create approval workflow level.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error: any) => {

            this.spinner.hide();

            this.alert.error(
              error?.error?.message ||
              'Failed to create approval workflow level.'
            );

            this.cd.detectChanges();

          }

        });

    }

  }


  // ==============================
  // Edit Level
  // ==============================

  edit(item: any): void {

    this.isEdit = true;

    this.editId = item.approvalWorkflowLevelId;


    this.model = {

      approvalWorkflowLevelId:
        item.approvalWorkflowLevelId,

      approvalWorkflowId:
        item.approvalWorkflowId,

      levelNumber:
        item.levelNumber ?? 1,

      approverType:
        item.approverType || '',

      approverUserId:
        item.approverUserId ?? null,

      approverRoleId:
        item.approverRoleId ?? null,

      approvalCondition:
        item.approvalCondition || '',

      onApprovalAction:
        item.onApprovalAction || '',

      onRejectionAction:
        item.onRejectionAction || '',

      companyId:
        item.companyId,

      regionId:
        item.regionId,

      isActive:
        item.isActive

    };


    this.showModal = true;

    this.cd.detectChanges();

  }


  // ==============================
  // Delete Level
  // ==============================

  delete(id: number): void {

    this.alert.deleteConfirm()
      .then((result: any) => {

        if (!result.isConfirmed) {
          return;
        }


        this.spinner.show();


        this.http
          .post<ApiResponse>(
            `${this.baseUrl}/SuperAdmin/deleteapprovalworkflowlevel/${id}`,
            {}
          )
          .subscribe({

            next: (response: any) => {

              this.spinner.hide();

              if (response?.success) {

                this.alert.success(
                  response.message ||
                  'Approval Workflow Level Deleted Successfully.'
                );

                this.getLevels();

              } else {

                this.alert.warning(
                  response?.message ||
                  'Unable to delete approval workflow level.'
                );

              }

              this.cd.detectChanges();

            },

            error: (error: any) => {

              this.spinner.hide();

              this.alert.error(
                error?.error?.message ||
                'Failed to delete approval workflow level.'
              );

              this.cd.detectChanges();

            }

          });

      });

  }

}
