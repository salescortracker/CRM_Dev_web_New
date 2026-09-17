import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';

@Component({
  selector: 'app-autoassignmentconditions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './autoassignmentconditions.html',
  styleUrl: './autoassignmentconditions.css',
})
export class Autoassignmentconditions implements OnInit {

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

  ruleFilter: number | '' = '';

  statusFilter = '';


  // ==============================
  // Data
  // ==============================

  conditions: any[] = [];

  autoAssignmentRules: any[] = [];


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
      autoAssignmentConditionId: 0,
      autoAssignmentRuleId: 0,
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
    this.getAutoAssignmentRules();
    this.getConditions();
  }


  // ==============================
  // Get All Auto Assignment Rules (for dropdown)
  // ==============================

  getAutoAssignmentRules(): void {

    this.http
      .get<ApiResponse<any[]>>(
        `${this.baseUrl}/SuperAdmin/getallautoassignmentrules`
      )
      .subscribe({

        next: (response: any) => {

          if (response?.success) {
            this.autoAssignmentRules = response.data || [];
          } else {
            this.autoAssignmentRules = [];
          }

          this.cd.detectChanges();
        },

        error: () => {
          this.autoAssignmentRules = [];
          this.cd.detectChanges();
        }

      });

  }


  // ==============================
  // Get All Auto Assignment Conditions
  // ==============================

  getConditions(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(
        `${this.baseUrl}/SuperAdmin/getallautoassignmentconditions`
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
              'Unable to load auto assignment conditions.'
            );

          }

          this.cd.detectChanges();
        },

        error: (error: any) => {

          this.spinner.hide();

          this.conditions = [];

          this.alert.error(
            error?.error?.message ||
            'Failed to load auto assignment conditions.'
          );

          this.cd.detectChanges();
        }

      });

  }


  // ==============================
  // Resolve Rule Name
  // (AutoAssignmentConditionDto has no RuleName field
  //  from the backend, so resolve it from the rules list)
  // ==============================

  getRuleName(ruleId: number): string {

    const rule = this.autoAssignmentRules.find(
      x => x.autoAssignmentRuleId === ruleId
    );

    return rule ? rule.ruleName : '—';

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

      const fieldValue =
        (item.fieldValue || '').toLowerCase();

      const ruleName =
        this.getRuleName(item.autoAssignmentRuleId).toLowerCase();


      const matchesSearch =
        !search ||
        fieldName.includes(search) ||
        operatorText.includes(search) ||
        fieldValue.includes(search) ||
        ruleName.includes(search);


      const matchesRule =
        this.ruleFilter === '' ||
        item.autoAssignmentRuleId === this.ruleFilter;


      const matchesStatus =
        !this.statusFilter ||
        (this.statusFilter === 'Active' && item.isActive) ||
        (this.statusFilter === 'Inactive' && !item.isActive);


      return matchesSearch && matchesRule && matchesStatus;

    });

  }


  // ==============================
  // Refresh
  // ==============================

  refresh(): void {
    this.getAutoAssignmentRules();
    this.getConditions();
  }


  // ==============================
  // Clear Filters
  // ==============================

  clearFilters(): void {
    this.searchText = '';
    this.ruleFilter = '';
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
  // On Rule Change
  // (auto-fill Company / Region from the selected rule)
  // ==============================

  onRuleChange(): void {

    const rule = this.autoAssignmentRules.find(
      x => x.autoAssignmentRuleId === Number(this.model.autoAssignmentRuleId)
    );

    this.model.companyId = rule ? rule.companyId : 0;

    this.model.regionId = rule ? rule.regionId : 0;

  }


  // ==============================
  // Save / Update Condition
  // ==============================

  saveCondition(): void {

    // Auto Assignment Rule validation
    if (
      !this.model.autoAssignmentRuleId ||
      Number(this.model.autoAssignmentRuleId) <= 0
    ) {

      this.alert.warning(
        'Auto Assignment Rule is required.'
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
        'Selected Auto Assignment Rule is missing Company / Region details.'
      );

      return;

    }


    // Prepare request
    const request: any = {

      autoAssignmentConditionId:
        this.isEdit ? this.editId : 0,

      autoAssignmentRuleId:
        Number(this.model.autoAssignmentRuleId),

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
          `${this.baseUrl}/SuperAdmin/updateautoassignmentcondition`,
          request
        )
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Auto Assignment Condition Updated Successfully.'
              );

              this.closeModal();

              this.getConditions();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to update auto assignment condition.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error: any) => {

            this.spinner.hide();

            this.alert.error(
              error?.error?.message ||
              'Failed to update auto assignment condition.'
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
          `${this.baseUrl}/SuperAdmin/createautoassignmentcondition`,
          request
        )
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Auto Assignment Condition Created Successfully.'
              );

              this.closeModal();

              this.getConditions();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to create auto assignment condition.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error: any) => {

            this.spinner.hide();

            this.alert.error(
              error?.error?.message ||
              'Failed to create auto assignment condition.'
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

    this.editId = item.autoAssignmentConditionId;


    this.model = {

      autoAssignmentConditionId:
        item.autoAssignmentConditionId,

      autoAssignmentRuleId:
        item.autoAssignmentRuleId,

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
            `${this.baseUrl}/SuperAdmin/deleteautoassignmentcondition/${id}`,
            {}
          )
          .subscribe({

            next: (response: any) => {

              this.spinner.hide();

              if (response?.success) {

                this.alert.success(
                  response.message ||
                  'Auto Assignment Condition Deleted Successfully.'
                );

                this.getConditions();

              } else {

                this.alert.warning(
                  response?.message ||
                  'Unable to delete auto assignment condition.'
                );

              }

              this.cd.detectChanges();

            },

            error: (error: any) => {

              this.spinner.hide();

              this.alert.error(
                error?.error?.message ||
                'Failed to delete auto assignment condition.'
              );

              this.cd.detectChanges();

            }

          });

      });

  }

}
