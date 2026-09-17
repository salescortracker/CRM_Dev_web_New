import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';

@Component({
  selector: 'app-workflowrulecondition',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workflowrulecondition.html',
  styleUrl: './workflowrulecondition.css',
})
export class Workflowrulecondition implements OnInit {

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

  conditions: any[] = [];

  workflowRules: any[] = [];


  // ==============================
  // Dropdown Options
  // ==============================

  operatorOptions = [
    { value: 'Equals', label: 'Equals' },
    { value: 'NotEquals', label: 'Not Equals' },
    { value: 'GreaterThan', label: 'Greater Than' },
    { value: 'LessThan', label: 'Less Than' },
    { value: 'GreaterThanOrEqual', label: 'Greater Than Or Equal' },
    { value: 'LessThanOrEqual', label: 'Less Than Or Equal' },
    { value: 'Contains', label: 'Contains' },
    { value: 'NotContains', label: 'Not Contains' },
    { value: 'StartsWith', label: 'Starts With' },
    { value: 'EndsWith', label: 'Ends With' },
    { value: 'IsNull', label: 'Is Null' },
    { value: 'IsNotNull', label: 'Is Not Null' }
  ];

  logicalOperatorOptions = ['AND', 'OR'];


  // ==============================
  // Form Model
  // ==============================

  model: any = this.emptyModel();

  emptyModel() {
    return {
      workflowRuleConditionId: 0,
      workflowRuleId: 0,
      fieldName: '',
      operator: '',
      fieldValue: '',
      logicalOperator: '',
      conditionOrder: 1,
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
    this.getConditions();
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
  // Get All Workflow Rule Conditions
  // ==============================

  getConditions(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(
        `${this.baseUrl}/SuperAdmin/getallworkflowruleconditions`
      )
      .subscribe({

        next: (response: any) => {

          this.spinner.hide();

          if (response?.success) {

            this.conditions = response.data || [];

          } else {

            this.conditions = [];

            this.alert.warning(
              response?.message ||
              'Unable to load workflow rule conditions.'
            );

          }

          this.cd.detectChanges();
        },

        error: (error: any) => {

          this.spinner.hide();

          this.conditions = [];

          this.alert.error(
            error?.error?.message ||
            'Failed to load workflow rule conditions.'
          );

          this.cd.detectChanges();
        }

      });

  }


  // ==============================
  // Statistics
  // ==============================

  get totalCount(): number {
    return this.conditions.length;
  }

  get activeCount(): number {
    return this.conditions.filter(x => x.isActive).length;
  }

  get inactiveCount(): number {
    return this.conditions.filter(x => !x.isActive).length;
  }


  // ==============================
  // Filtered Conditions
  // ==============================

  get filteredConditions(): any[] {

    const search = this.searchText
      .trim()
      .toLowerCase();

    return this.conditions.filter(item => {

      const fieldName =
        (item.fieldName || '').toLowerCase();

      const operatorText =
        (item.operator || '').toLowerCase();

      const workflowRuleName =
        (item.workflowRuleName || '').toLowerCase();

      const fieldValue =
        (item.fieldValue || '').toLowerCase();


      const matchesSearch =
        !search ||
        fieldName.includes(search) ||
        operatorText.includes(search) ||
        workflowRuleName.includes(search) ||
        fieldValue.includes(search);


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
    this.getConditions();
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
  // Save / Update Condition
  // ==============================

  saveCondition(): void {

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


    // Field Name validation
    if (!this.model.fieldName?.trim()) {

      this.alert.warning(
        'Field Name is required.'
      );

      return;

    }


    // Operator validation
    if (!this.model.operator?.trim()) {

      this.alert.warning(
        'Operator is required.'
      );

      return;

    }


    // Condition Order validation
    if (
      this.model.conditionOrder === null ||
      this.model.conditionOrder === undefined ||
      Number(this.model.conditionOrder) <= 0
    ) {

      this.alert.warning(
        'Condition Order must be greater than zero.'
      );

      return;

    }


    // Company / Region validation
    if (!this.model.companyId || !this.model.regionId) {

      this.alert.warning(
        'Selected Workflow Rule is missing Company / Region details.'
      );

      return;

    }


    // Prepare request
    const request: any = {

      workflowRuleConditionId:
        this.isEdit ? this.editId : 0,

      workflowRuleId:
        Number(this.model.workflowRuleId),

      fieldName:
        this.model.fieldName.trim(),

      operator:
        this.model.operator.trim(),

      fieldValue:
        this.model.fieldValue?.trim() || null,

      logicalOperator:
        this.model.logicalOperator?.trim() || null,

      conditionOrder:
        Number(this.model.conditionOrder),

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
          `${this.baseUrl}/SuperAdmin/updateworkflowrulecondition`,
          request
        )
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Workflow Rule Condition Updated Successfully.'
              );

              this.closeModal();

              this.getConditions();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to update workflow rule condition.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error: any) => {

            this.spinner.hide();

            this.alert.error(
              error?.error?.message ||
              'Failed to update workflow rule condition.'
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
          `${this.baseUrl}/SuperAdmin/createworkflowrulecondition`,
          request
        )
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Workflow Rule Condition Created Successfully.'
              );

              this.closeModal();

              this.getConditions();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to create workflow rule condition.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error: any) => {

            this.spinner.hide();

            this.alert.error(
              error?.error?.message ||
              'Failed to create workflow rule condition.'
            );

            this.cd.detectChanges();

          }

        });

    }

  }


  // ==============================
  // Edit Condition
  // ==============================

  edit(item: any): void {

    this.isEdit = true;

    this.editId = item.workflowRuleConditionId;


    this.model = {

      workflowRuleConditionId:
        item.workflowRuleConditionId,

      workflowRuleId:
        item.workflowRuleId,

      fieldName:
        item.fieldName || '',

      operator:
        item.operator || '',

      fieldValue:
        item.fieldValue || '',

      logicalOperator:
        item.logicalOperator || '',

      conditionOrder:
        item.conditionOrder ?? 1,

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
  // Delete Condition
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
            `${this.baseUrl}/SuperAdmin/deleteworkflowrulecondition/${id}`,
            {}
          )
          .subscribe({

            next: (response: any) => {

              this.spinner.hide();

              if (response?.success) {

                this.alert.success(
                  response.message ||
                  'Workflow Rule Condition Deleted Successfully.'
                );

                this.getConditions();

              } else {

                this.alert.warning(
                  response?.message ||
                  'Unable to delete workflow rule condition.'
                );

              }

              this.cd.detectChanges();

            },

            error: (error: any) => {

              this.spinner.hide();

              this.alert.error(
                error?.error?.message ||
                'Failed to delete workflow rule condition.'
              );

              this.cd.detectChanges();

            }

          });

      });

  }

}
