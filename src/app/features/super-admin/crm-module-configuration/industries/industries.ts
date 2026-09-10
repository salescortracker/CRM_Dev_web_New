import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { ControlsystemService } from '../../services/controlsystem-service';

@Component({
  selector: 'app-industries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './industries.html',
  styleUrl: './industries.css',
})
export class Industries {
  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef,
    private controlSystemService: ControlsystemService

  ) { }







  // =================================
  // Modal Controls
  // =================================


  showModal = false;


  isEdit = false;


  editId = 0;







  // =================================
  // Search Filter
  // =================================


  searchText = '';

  statusFilter = '';







  // =================================
  // Static Industry Data
  // =================================


  industries: any[] = [];









  // =================================
  // Form Model
  // =================================


  model: any = this.emptyModel();






  emptyModel() {

    return {

      industryId: 0,

      industryName: '',

      industryCode: '',

      industryCategory: 'Technology',

      customerCount: 0,

      priority: 'Medium',

      status: 'Active',

      description: ''

    };

  }


  // =================================
  // Component Initialization
  // =================================

  ngOnInit(): void {

    this.getIndustries();

  }


  // =================================
  // Get All Industries
  // =================================

  getIndustries(): void {

    this.spinner.show();

    this.controlSystemService.getIndustries().subscribe({

      next: (response: any) => {

        this.spinner.hide();

        if (response?.success) {

          this.industries = response.data || [];

        }
        else {

          this.industries = [];

          this.alert.warning(
            response?.message || 'Unable to load industries.'
          );

        }

        this.cd.detectChanges();

      },

      error: (error) => {

        this.spinner.hide();

        console.error('Get Industries Error:', error);

        this.industries = [];

        this.alert.error(
          error?.error?.message ||
          'Failed to load industries.'
        );

        this.cd.detectChanges();

      }

    });

  }


  // =================================
  // Statistics
  // =================================

  get activeCount() {

    return this.industries.filter(

      x => x.status === 'Active'

    ).length;

  }


  get inactiveCount() {

    return this.industries.filter(

      x => x.status === 'Inactive'

    ).length;

  }


  // =================================
  // Filter Industries
  // =================================

  get filteredIndustries() {

    const search = this.searchText
      .toLowerCase()
      .trim();

    return this.industries.filter(item => {

      const industryName =
        (item.industryName || '').toLowerCase();

      const industryCode =
        (item.industryCode || '').toLowerCase();

      const industryCategory =
        (item.industryCategory || '').toLowerCase();

      const description =
        (item.description || '').toLowerCase();

      const searchMatch =

        !search ||

        industryName.includes(search) ||

        industryCode.includes(search) ||

        industryCategory.includes(search) ||

        description.includes(search);


      const statusMatch =

        this.statusFilter === '' ||

        item.status === this.statusFilter;


      return searchMatch && statusMatch;

    });

  }


  // =================================
  // Refresh
  // =================================

  refresh(): void {

    this.getIndustries();

  }


  // =================================
  // Add Industry Modal
  // =================================

  openAddModal(): void {

    this.isEdit = false;

    this.editId = 0;

    this.model = this.emptyModel();

    this.showModal = true;

  }


  // =================================
  // Close Modal
  // =================================

  closeModal(): void {

    this.showModal = false;

    this.model = this.emptyModel();

    this.isEdit = false;

    this.editId = 0;

  }


  // =================================
  // Save / Update Industry
  // =================================

  saveIndustry(): void {

    // ===============================
    // Validation
    // ===============================

    if (!this.model.industryName?.trim()) {

      this.alert.warning(
        'Industry Name is required.'
      );

      return;

    }


    if (!this.model.industryCode?.trim()) {

      this.alert.warning(
        'Industry Code is required.'
      );

      return;

    }


    if (!this.model.industryCategory?.trim()) {

      this.alert.warning(
        'Industry Category is required.'
      );

      return;

    }


    if (
      this.model.customerCount === null ||
      this.model.customerCount === undefined ||
      this.model.customerCount < 0
    ) {

      this.alert.warning(
        'Customer Count cannot be negative.'
      );

      return;

    }


    // ===============================
    // Prepare Request
    // ===============================

    const request = {

      industryId: this.isEdit
        ? this.editId
        : 0,

      industryName:
        this.model.industryName.trim(),

      industryCode:
        this.model.industryCode.trim(),

      industryCategory:
        this.model.industryCategory,

      customerCount:
        Number(this.model.customerCount) || 0,

      priority:
        this.model.priority,

      status:
        this.model.status,

      description:
        this.model.description?.trim() || null

    };


    // ===============================
    // Show Spinner
    // ===============================

    this.spinner.show();


    // ===============================
    // Update Industry
    // ===============================

    if (this.isEdit) {

      this.controlSystemService
        .updateIndustry(request)
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Industry updated successfully.'
              );

              this.closeModal();

              this.getIndustries();

            }
            else {

              this.alert.warning(
                response?.message ||
                'Unable to update industry.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error) => {

            this.spinner.hide();

            console.error(
              'Update Industry Error:',
              error
            );

            this.alert.error(
              error?.error?.message ||
              'Failed to update industry.'
            );

            this.cd.detectChanges();

          }

        });

    }


    // ===============================
    // Create Industry
    // ===============================

    else {

      this.controlSystemService
        .createIndustry(request)
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Industry created successfully.'
              );

              this.closeModal();

              this.getIndustries();

            }
            else {

              this.alert.warning(
                response?.message ||
                'Unable to create industry.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error) => {

            this.spinner.hide();

            console.error(
              'Create Industry Error:',
              error
            );

            this.alert.error(
              error?.error?.message ||
              'Failed to create industry.'
            );

            this.cd.detectChanges();

          }

        });

    }

  }


  // =================================
  // Edit Industry
  // =================================

  edit(item: any): void {

    this.isEdit = true;

    this.editId = item.industryId;


    this.model = {

      industryId:
        item.industryId,

      industryName:
        item.industryName || '',

      industryCode:
        item.industryCode || '',

      industryCategory:
        item.industryCategory || 'Technology',

      customerCount:
        item.customerCount ?? 0,

      priority:
        item.priority || 'Medium',

      status:
        item.status || 'Active',

      description:
        item.description || ''

    };


    this.showModal = true;

  }


  // =================================
  // Delete Industry
  // =================================

  delete(id: number): void {

    if (!id) {

      this.alert.warning(
        'Invalid Industry ID.'
      );

      return;

    }


    this.alert.deleteConfirm()

      .then(result => {

        if (result.isConfirmed) {

          this.spinner.show();


          this.controlSystemService
            .deleteIndustry(id)
            .subscribe({

              next: (response: any) => {

                this.spinner.hide();

                if (response?.success) {

                  this.alert.success(
                    response.message ||
                    'Industry deleted successfully.'
                  );

                  this.getIndustries();

                }
                else {

                  this.alert.warning(
                    response?.message ||
                    'Unable to delete industry.'
                  );

                }

                this.cd.detectChanges();

              },

              error: (error) => {

                this.spinner.hide();

                console.error(
                  'Delete Industry Error:',
                  error
                );

                this.alert.error(
                  error?.error?.message ||
                  'Failed to delete industry.'
                );

                this.cd.detectChanges();

              }

            });

        }

      });

  }


  // =================================
  // Clear Filters
  // =================================

  clearFilters(): void {

    this.searchText = '';

    this.statusFilter = '';

  }
}
