import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { ControlsystemService } from '../../services/controlsystem-service';

@Component({
  selector: 'app-custom-fields',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './custom-fields.html',
  styleUrl: './custom-fields.css',
})
export class CustomFields {
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
  // Static Custom Fields Data
  // =====================================


  customFields:any[] = [];









  // =====================================
  // Form Model
  // =====================================


  model:any = this.emptyModel();
emptyModel() {
    return {
      customFieldId: 0,
      fieldName: '',
      displayLabel: '',
      moduleName: 'Lead',
      fieldType: 'Text',
      defaultValue: '',
      placeholder: '',
      status: 'Active',
      fieldOrder: 1,
      description: '',
      requiredField: false,
      uniqueField: false
    };
  }

  // =====================================
  // Lifecycle
  // =====================================

  ngOnInit(): void {
    this.getCustomFields();
  }

  // =====================================
  // Get All Custom Fields
  // =====================================

  getCustomFields(): void {

    this.spinner.show();

    this.controlSystemService.getCustomFields().subscribe({

      next: (response: any) => {

        this.spinner.hide();

        if (response?.success) {

          this.customFields = response.data || [];

        } else {

          this.customFields = [];

          this.alert.warning(
            response?.message || 'Unable to load custom fields.'
          );

        }

        this.cd.detectChanges();
      },

      error: (error) => {

        this.spinner.hide();

        console.error(
          'Get Custom Fields Error:',
          error
        );

        this.customFields = [];

        this.alert.error(
          error?.error?.message ||
          'Failed to load custom fields.'
        );

        this.cd.detectChanges();
      }

    });

  }

  // =====================================
  // Statistics
  // =====================================

  get activeCount() {

    return this.customFields.filter(
      x => x.status === 'Active'
    ).length;

  }

  get inactiveCount() {

    return this.customFields.filter(
      x => x.status === 'Inactive'
    ).length;

  }

  get mandatoryCount() {

    return this.customFields.filter(
      x => x.requiredField === true
    ).length;

  }

  // =====================================
  // Filter Custom Fields
  // =====================================

  get filteredFields() {

    const search =
      this.searchText
        .toLowerCase()
        .trim();

    return this.customFields.filter(item => {

      const fieldName =
        (item.fieldName || '')
          .toLowerCase();

      const displayLabel =
        (item.displayLabel || '')
          .toLowerCase();

      const moduleName =
        (item.moduleName || '')
          .toLowerCase();

      const fieldType =
        (item.fieldType || '')
          .toLowerCase();

      const placeholder =
        (item.placeholder || '')
          .toLowerCase();

      const description =
        (item.description || '')
          .toLowerCase();

      const searchMatch =
        !search ||
        fieldName.includes(search) ||
        displayLabel.includes(search) ||
        moduleName.includes(search) ||
        fieldType.includes(search) ||
        placeholder.includes(search) ||
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

    this.getCustomFields();

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
  // Save / Update Custom Field
  // =====================================

  saveField(): void {

    // =====================================
    // Field Name Validation
    // =====================================

    if (!this.model.fieldName?.trim()) {

      this.alert.warning(
        'Field Name is required.'
      );

      return;

    }

    // =====================================
    // Display Label Validation
    // =====================================

    if (!this.model.displayLabel?.trim()) {

      this.alert.warning(
        'Display Label is required.'
      );

      return;

    }

    // =====================================
    // Module Name Validation
    // =====================================

    if (!this.model.moduleName?.trim()) {

      this.alert.warning(
        'Module Name is required.'
      );

      return;

    }

    // =====================================
    // Field Type Validation
    // =====================================

    if (!this.model.fieldType?.trim()) {

      this.alert.warning(
        'Field Type is required.'
      );

      return;

    }

    // =====================================
    // Field Order Validation
    // =====================================

    if (
      this.model.fieldOrder === null ||
      this.model.fieldOrder === undefined ||
      this.model.fieldOrder < 0
    ) {

      this.alert.warning(
        'Field Order cannot be negative.'
      );

      return;

    }

    // =====================================
    // API Request
    // =====================================

    const request = {

      customFieldId:
        this.isEdit
          ? this.editId
          : 0,

      fieldName:
        this.model.fieldName.trim(),

      displayLabel:
        this.model.displayLabel.trim(),

      moduleName:
        this.model.moduleName,

      fieldType:
        this.model.fieldType,

      defaultValue:
        this.model.defaultValue?.trim() || null,

      placeholder:
        this.model.placeholder?.trim() || null,

      status:
        this.model.status || 'Active',

      fieldOrder:
        Number(this.model.fieldOrder) || 0,

      description:
        this.model.description?.trim() || null,

      requiredField:
        this.model.requiredField === true,

      uniqueField:
        this.model.uniqueField === true

    };

    // =====================================
    // Show Spinner
    // =====================================

    this.spinner.show();

    // =====================================
    // UPDATE
    // =====================================

    if (this.isEdit) {

      this.controlSystemService
        .updateCustomField(request)
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Custom field updated successfully.'
              );

              this.closeModal();

              this.getCustomFields();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to update custom field.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error) => {

            this.spinner.hide();

            console.error(
              'Update Custom Field Error:',
              error
            );

            this.alert.error(
              error?.error?.message ||
              'Failed to update custom field.'
            );

            this.cd.detectChanges();

          }

        });

    }

    // =====================================
    // CREATE
    // =====================================

    else {

      this.controlSystemService
        .createCustomField(request)
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Custom field created successfully.'
              );

              this.closeModal();

              this.getCustomFields();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to create custom field.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error) => {

            this.spinner.hide();

            console.error(
              'Create Custom Field Error:',
              error
            );

            this.alert.error(
              error?.error?.message ||
              'Failed to create custom field.'
            );

            this.cd.detectChanges();

          }

        });

    }

  }

  // =====================================
  // Edit Custom Field
  // =====================================

  edit(item: any): void {

    this.isEdit = true;

    this.editId = item.customFieldId;

    this.model = {

      customFieldId:
        item.customFieldId,

      fieldName:
        item.fieldName || '',

      displayLabel:
        item.displayLabel || '',

      moduleName:
        item.moduleName || 'Lead',

      fieldType:
        item.fieldType || 'Text',

      defaultValue:
        item.defaultValue || '',

      placeholder:
        item.placeholder || '',

      status:
        item.status || 'Active',

      fieldOrder:
        item.fieldOrder ?? 1,

      description:
        item.description || '',

      requiredField:
        item.requiredField === true,

      uniqueField:
        item.uniqueField === true

    };

    this.showModal = true;

  }

  // =====================================
  // Delete Custom Field
  // =====================================

  delete(id: number): void {

    if (!id) {

      this.alert.warning(
        'Invalid Custom Field ID.'
      );

      return;

    }

    this.alert
      .deleteConfirm()
      .then(result => {

        if (result.isConfirmed) {

          this.spinner.show();

          this.controlSystemService
            .deleteCustomField(id)
            .subscribe({

              next: (response: any) => {

                this.spinner.hide();

                if (response?.success) {

                  this.alert.success(
                    response.message ||
                    'Custom field deleted successfully.'
                  );

                  this.getCustomFields();

                } else {

                  this.alert.warning(
                    response?.message ||
                    'Unable to delete custom field.'
                  );

                }

                this.cd.detectChanges();

              },

              error: (error) => {

                this.spinner.hide();

                console.error(
                  'Delete Custom Field Error:',
                  error
                );

                this.alert.error(
                  error?.error?.message ||
                  'Failed to delete custom field.'
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
