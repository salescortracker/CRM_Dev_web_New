import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';

@Component({
  selector: 'app-workflowruleactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workflowruleactions.html',
  styleUrl: './workflowruleactions.css',
})
export class Workflowruleactions implements OnInit {

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

  workflowRuleFilter: number | '' = '';

  statusFilter = '';


  // ==============================
  // Data
  // ==============================

  actions: any[] = [];

  workflowRules: any[] = [];


  // ==============================
  // Dropdown Options
  // ==============================

  actionTypeOptions = [
    { value: 'SendEmail', label: 'Send Email' },
    { value: 'SendNotification', label: 'Send Notification' },
    { value: 'SendSms', label: 'Send SMS' },
    { value: 'UpdateField', label: 'Update Field' },
    { value: 'ChangeStatus', label: 'Change Status' },
    { value: 'AssignOwner', label: 'Assign Owner' },
    { value: 'CreateTask', label: 'Create Task' },
    { value: 'CreateActivity', label: 'Create Activity' },
    { value: 'AddTag', label: 'Add Tag' },
    { value: 'TriggerWebhook', label: 'Trigger Webhook' },
    { value: 'EscalateTo', label: 'Escalate To' }
  ];


  // ==============================
  // Form Model
  // ==============================

  model: any = this.emptyModel();

  emptyModel() {
    return {
      workflowRuleActionId: 0,
      workflowRuleId: 0,
      actionType: '',
      actionName: '',
      actionConfiguration: '',
      actionOrder: 1,
      companyId: 0,
      regionId: 0,
      isActive: true
    };
  }


  // ==============================
  // On Init
  // ==============================

  ngOnInit(): void {
    this.getWorkflowRules();
    this.getActions();
  }


  // ==============================
  // Get All Workflow Rules (for dropdown)
  // ==============================

  getWorkflowRules(): void {

    this.http
      .get<ApiResponse<any[]>>(
        `${this.baseUrl}/SuperAdmin/getallworkflowrules`
      )
      .subscribe({

        next: (response: any) => {

          if (response?.success) {
            this.workflowRules = response.data || [];
          } else {
            this.workflowRules = [];
          }

          this.cd.detectChanges();
        },

        error: () => {
          this.workflowRules = [];
          this.cd.detectChanges();
        }

      });

  }


  // ==============================
  // Get All Workflow Rule Actions
  // ==============================

  getActions(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(
        `${this.baseUrl}/SuperAdmin/getallworkflowruleactions`
      )
      .subscribe({

        next: (response: any) => {

          this.spinner.hide();

          if (response?.success) {

            this.actions = response.data || [];

          } else {

            this.actions = [];

            this.alert.warning(
              response?.message ||
              'Unable to load workflow rule actions.'
            );

          }

          this.cd.detectChanges();
        },

        error: (error: any) => {

          this.spinner.hide();

          this.actions = [];

          this.alert.error(
            error?.error?.message ||
            'Failed to load workflow rule actions.'
          );

          this.cd.detectChanges();
        }

      });

  }


  // ==============================
  // Statistics
  // ==============================

  get totalCount(): number {
    return this.actions.length;
  }

  get activeCount(): number {
    return this.actions.filter(x => x.isActive).length;
  }

  get inactiveCount(): number {
    return this.actions.filter(x => !x.isActive).length;
  }


  // ==============================
  // Filtered Actions
  // ==============================

  get filteredActions(): any[] {

    const search = this.searchText
      .trim()
      .toLowerCase();

    return this.actions.filter(item => {

      const actionType =
        (item.actionType || '').toLowerCase();

      const actionName =
        (item.actionName || '').toLowerCase();

      const workflowRuleName =
        (item.workflowRuleName || '').toLowerCase();


      const matchesSearch =
        !search ||
        actionType.includes(search) ||
        actionName.includes(search) ||
        workflowRuleName.includes(search);


      const matchesWorkflowRule =
        this.workflowRuleFilter === '' ||
        item.workflowRuleId === this.workflowRuleFilter;


      const matchesStatus =
        !this.statusFilter ||
        (this.statusFilter === 'Active' && item.isActive) ||
        (this.statusFilter === 'Inactive' && !item.isActive);


      return matchesSearch && matchesWorkflowRule && matchesStatus;

    });

  }


  // ==============================
  // Refresh
  // ==============================

  refresh(): void {
    this.getWorkflowRules();
    this.getActions();
  }


  // ==============================
  // Clear Filters
  // ==============================

  clearFilters(): void {
    this.searchText = '';
    this.workflowRuleFilter = '';
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
  // On Workflow Rule Change
  // (auto-fill Company / Region from the selected rule)
  // ==============================

  onWorkflowRuleChange(): void {

    const rule = this.workflowRules.find(
      x => x.workflowRuleId === Number(this.model.workflowRuleId)
    );

    this.model.companyId = rule ? rule.companyId : 0;

    this.model.regionId = rule ? rule.regionId : 0;

  }


  // ==============================
  // Save / Update Action
  // ==============================

  saveAction(): void {

    // Workflow Rule validation
    if (
      !this.model.workflowRuleId ||
      Number(this.model.workflowRuleId) <= 0
    ) {

      this.alert.warning(
        'Workflow Rule is required.'
      );

      return;

    }


    // Action Type validation
    if (!this.model.actionType?.trim()) {

      this.alert.warning(
        'Action Type is required.'
      );

      return;

    }


    // Action Order validation
    if (
      this.model.actionOrder === null ||
      this.model.actionOrder === undefined ||
      Number(this.model.actionOrder) < 0
    ) {

      this.alert.warning(
        'Action Order cannot be negative.'
      );

      return;

    }


    // Prepare request
    const request: any = {

      workflowRuleActionId:
        this.isEdit ? this.editId : 0,

      workflowRuleId:
        Number(this.model.workflowRuleId),

      actionType:
        this.model.actionType.trim(),

      actionName:
        this.model.actionName?.trim() || null,

      actionConfiguration:
        this.model.actionConfiguration?.trim() || null,

      actionOrder:
        Number(this.model.actionOrder),

      companyId:
        Number(this.model.companyId) || 0,

      regionId:
        Number(this.model.regionId) || 0,

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
          `${this.baseUrl}/SuperAdmin/updateworkflowruleaction`,
          request
        )
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Workflow Rule Action Updated Successfully.'
              );

              this.closeModal();

              this.getActions();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to update workflow rule action.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error: any) => {

            this.spinner.hide();

            this.alert.error(
              error?.error?.message ||
              'Failed to update workflow rule action.'
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
          `${this.baseUrl}/SuperAdmin/createworkflowruleaction`,
          request
        )
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Workflow Rule Action Created Successfully.'
              );

              this.closeModal();

              this.getActions();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to create workflow rule action.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error: any) => {

            this.spinner.hide();

            this.alert.error(
              error?.error?.message ||
              'Failed to create workflow rule action.'
            );

            this.cd.detectChanges();

          }

        });

    }

  }


  // ==============================
  // Edit Action
  // ==============================

  edit(item: any): void {

    this.isEdit = true;

    this.editId = item.workflowRuleActionId;


    this.model = {

      workflowRuleActionId:
        item.workflowRuleActionId,

      workflowRuleId:
        item.workflowRuleId,

      actionType:
        item.actionType || '',

      actionName:
        item.actionName || '',

      actionConfiguration:
        item.actionConfiguration || '',

      actionOrder:
        item.actionOrder ?? 1,

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
  // Delete Action
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
            `${this.baseUrl}/SuperAdmin/deleteworkflowruleaction/${id}`,
            {}
          )
          .subscribe({

            next: (response: any) => {

              this.spinner.hide();

              if (response?.success) {

                this.alert.success(
                  response.message ||
                  'Workflow Rule Action Deleted Successfully.'
                );

                this.getActions();

              } else {

                this.alert.warning(
                  response?.message ||
                  'Unable to delete workflow rule action.'
                );

              }

              this.cd.detectChanges();

            },

            error: (error: any) => {

              this.spinner.hide();

              this.alert.error(
                error?.error?.message ||
                'Failed to delete workflow rule action.'
              );

              this.cd.detectChanges();

            }

          });

      });

  }

}
