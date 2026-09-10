import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { ControlsystemService } from '../../services/controlsystem-service';

@Component({
  selector: 'app-salestargets',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './salestargets.html',
  styleUrl: './salestargets.css',
})
export class Salestargets {
  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef,
    private controlSystemService: ControlsystemService

  ) {}





  // =====================================
  // Modal Controls
  // =====================================


  showModal = false;


  isEdit = false;


  editId = 0;








  // =====================================
  // Search
  // =====================================


  searchText = '';

  statusFilter = '';









  // =====================================
  // Static Sales Target Data
  // =====================================


  salesTargets:any[] = [];









  // =====================================
  // Form Model
  // =====================================


  model:any = this.emptyModel();
emptyModel() {
    return {
      salesTargetId: 0,
      targetName: '',
      targetCode: '',
      employeeName: '',
      department: 'Sales',
      targetAmount: 0,
      achievedAmount: 0,
      targetPeriod: 'Monthly',
      status: 'Active',
      description: ''
    };
  }

  // =====================================
  // Component Initialization
  // =====================================

  ngOnInit(): void {
    this.getSalesTargets();
  }

  // =====================================
  // Get All Sales Targets
  // =====================================

  getSalesTargets(): void {

    this.spinner.show();

    this.controlSystemService.getSalesTargets().subscribe({

      next: (response: any) => {

        this.spinner.hide();

        if (response?.success) {

          this.salesTargets = response.data || [];

        } else {

          this.salesTargets = [];

          this.alert.warning(
            response?.message || 'Unable to load sales targets.'
          );

        }

        this.cd.detectChanges();
      },

      error: (error) => {

        this.spinner.hide();

        console.error(
          'Get Sales Targets Error:',
          error
        );

        this.salesTargets = [];

        this.alert.error(
          error?.error?.message ||
          'Failed to load sales targets.'
        );

        this.cd.detectChanges();
      }

    });
  }

  // =====================================
  // Statistics
  // =====================================

  get activeCount() {

    return this.salesTargets.filter(
      x => x.status === 'Active'
    ).length;

  }

  get completedCount() {

    return this.salesTargets.filter(
      x => x.status === 'Completed'
    ).length;

  }

  // =====================================
  // Filter Sales Targets
  // =====================================

  get filteredTargets() {

    const search =
      this.searchText.toLowerCase().trim();

    return this.salesTargets.filter(item => {

      const targetName =
        (item.targetName || '').toLowerCase();

      const targetCode =
        (item.targetCode || '').toLowerCase();

      const employeeName =
        (item.employeeName || '').toLowerCase();

      const department =
        (item.department || '').toLowerCase();

      const targetPeriod =
        (item.targetPeriod || '').toLowerCase();

      const description =
        (item.description || '').toLowerCase();

      const searchMatch =
        !search ||
        targetName.includes(search) ||
        targetCode.includes(search) ||
        employeeName.includes(search) ||
        department.includes(search) ||
        targetPeriod.includes(search) ||
        description.includes(search);

      const statusMatch =
        this.statusFilter === '' ||
        item.status === this.statusFilter;

      return searchMatch && statusMatch;

    });

  }

  // =====================================
  // Refresh
  // =====================================

  refresh(): void {

    this.getSalesTargets();

  }

  // =====================================
  // Open Add Modal
  // =====================================

  openAddModal(): void {

    this.isEdit = false;

    this.editId = 0;

    this.model = this.emptyModel();

    this.showModal = true;

  }

  // =====================================
  // Close Modal
  // =====================================

  closeModal(): void {

    this.showModal = false;

    this.model = this.emptyModel();

    this.isEdit = false;

    this.editId = 0;

  }

  // =====================================
  // Save / Update Sales Target
  // =====================================

  saveTarget(): void {

    // Target Name validation
    if (!this.model.targetName?.trim()) {

      this.alert.warning(
        'Target Name is required.'
      );

      return;
    }

    // Target Code validation
    if (!this.model.targetCode?.trim()) {

      this.alert.warning(
        'Target Code is required.'
      );

      return;
    }

    // Employee validation
    if (!this.model.employeeName?.trim()) {

      this.alert.warning(
        'Employee Name is required.'
      );

      return;
    }

    // Department validation
    if (!this.model.department?.trim()) {

      this.alert.warning(
        'Department is required.'
      );

      return;
    }

    // Target Period validation
    if (!this.model.targetPeriod?.trim()) {

      this.alert.warning(
        'Target Period is required.'
      );

      return;
    }

    // Target Amount validation
    if (
      this.model.targetAmount === null ||
      this.model.targetAmount === undefined ||
      Number(this.model.targetAmount) < 0
    ) {

      this.alert.warning(
        'Target Amount cannot be negative.'
      );

      return;
    }

    // Achieved Amount validation
    if (
      this.model.achievedAmount === null ||
      this.model.achievedAmount === undefined ||
      Number(this.model.achievedAmount) < 0
    ) {

      this.alert.warning(
        'Achieved Amount cannot be negative.'
      );

      return;
    }

    const request = {

      salesTargetId:
        this.isEdit ? this.editId : 0,

      targetName:
        this.model.targetName.trim(),

      targetCode:
        this.model.targetCode.trim(),

      employeeName:
        this.model.employeeName.trim(),

      department:
        this.model.department,

      targetAmount:
        Number(this.model.targetAmount) || 0,

      achievedAmount:
        Number(this.model.achievedAmount) || 0,

      targetPeriod:
        this.model.targetPeriod,

      status:
        this.model.status,

      description:
        this.model.description?.trim() || null

    };

    this.spinner.show();

    // =====================================
    // Update
    // =====================================

    if (this.isEdit) {

      this.controlSystemService
        .updateSalesTarget(request)
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Sales Target updated successfully.'
              );

              this.closeModal();

              this.getSalesTargets();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to update sales target.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error) => {

            this.spinner.hide();

            console.error(
              'Update Sales Target Error:',
              error
            );

            this.alert.error(
              error?.error?.message ||
              'Failed to update sales target.'
            );

            this.cd.detectChanges();

          }

        });

    }

    // =====================================
    // Create
    // =====================================

    else {

      this.controlSystemService
        .createSalesTarget(request)
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Sales Target created successfully.'
              );

              this.closeModal();

              this.getSalesTargets();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to create sales target.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error) => {

            this.spinner.hide();

            console.error(
              'Create Sales Target Error:',
              error
            );

            this.alert.error(
              error?.error?.message ||
              'Failed to create sales target.'
            );

            this.cd.detectChanges();

          }

        });

    }

  }

  // =====================================
  // Edit Sales Target
  // =====================================

  edit(item: any): void {

    this.isEdit = true;

    this.editId = item.salesTargetId;

    this.model = {

      salesTargetId:
        item.salesTargetId,

      targetName:
        item.targetName || '',

      targetCode:
        item.targetCode || '',

      employeeName:
        item.employeeName || '',

      department:
        item.department || 'Sales',

      targetAmount:
        item.targetAmount ?? 0,

      achievedAmount:
        item.achievedAmount ?? 0,

      targetPeriod:
        item.targetPeriod || 'Monthly',

      status:
        item.status || 'Active',

      description:
        item.description || ''

    };

    this.showModal = true;

  }

  // =====================================
  // Delete Sales Target
  // =====================================

  delete(id: number): void {

    if (!id) {

      this.alert.warning(
        'Invalid Sales Target ID.'
      );

      return;

    }

    this.alert
      .deleteConfirm()
      .then(result => {

        if (result.isConfirmed) {

          this.spinner.show();

          this.controlSystemService
            .deleteSalesTarget(id)
            .subscribe({

              next: (response: any) => {

                this.spinner.hide();

                if (response?.success) {

                  this.alert.success(
                    response.message ||
                    'Sales Target deleted successfully.'
                  );

                  this.getSalesTargets();

                } else {

                  this.alert.warning(
                    response?.message ||
                    'Unable to delete sales target.'
                  );

                }

                this.cd.detectChanges();

              },

              error: (error) => {

                this.spinner.hide();

                console.error(
                  'Delete Sales Target Error:',
                  error
                );

                this.alert.error(
                  error?.error?.message ||
                  'Failed to delete sales target.'
                );

                this.cd.detectChanges();

              }

            });

        }

      });

  }

  // =====================================
  // Clear Filters
  // =====================================

  clearFilters(): void {

    this.searchText = '';

    this.statusFilter = '';

  }
}
