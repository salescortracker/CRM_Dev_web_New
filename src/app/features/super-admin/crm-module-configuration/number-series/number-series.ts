import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { ControlsystemService } from '../../services/controlsystem-service';

@Component({
  selector: 'app-number-series',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './number-series.html',
  styleUrl: './number-series.css',
})
export class NumberSeries {
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
  // Static Number Series Data
  // =====================================


  numberSeries:any[] = [];









  // =====================================
  // Form Model
  // =====================================


  model:any = this.emptyModel();
emptyModel() {
    return {
      numberSeriesId: 0,
      seriesName: '',
      moduleName: 'Lead',
      prefix: '',
      startingNumber: 1000,
      currentNumber: 1000,
      numberFormat: '',
      description: '',
      status: 'Active'
    };
  }

  // =====================================
  // Lifecycle
  // =====================================

  ngOnInit(): void {
    this.getNumberSeries();
  }

  // =====================================
  // Get Number Series
  // =====================================

  getNumberSeries(): void {

    this.spinner.show();

    this.controlSystemService.getNumberSeries().subscribe({

      next: (response: any) => {

        this.spinner.hide();

        if (response?.success) {

          this.numberSeries = response.data || [];

        } else {

          this.numberSeries = [];

          this.alert.warning(
            response?.message || 'Unable to load number series.'
          );

        }

        this.cd.detectChanges();
      },

      error: (error) => {

        this.spinner.hide();

        console.error('Get Number Series Error:', error);

        this.numberSeries = [];

        this.alert.error(
          error?.error?.message ||
          'Failed to load number series.'
        );

        this.cd.detectChanges();
      }

    });
  }

  // =====================================
  // Statistics
  // =====================================

  get activeCount() {

    return this.numberSeries.filter(
      x => x.status === 'Active'
    ).length;

  }

  get inactiveCount() {

    return this.numberSeries.filter(
      x => x.status === 'Inactive'
    ).length;

  }

  // =====================================
  // Filter Number Series
  // =====================================

  get filteredSeries() {

    const search = this.searchText
      .toLowerCase()
      .trim();

    return this.numberSeries.filter(item => {

      const seriesName =
        (item.seriesName || '')
          .toLowerCase();

      const moduleName =
        (item.moduleName || '')
          .toLowerCase();

      const prefix =
        (item.prefix || '')
          .toLowerCase();

      const numberFormat =
        (item.numberFormat || '')
          .toLowerCase();

      const description =
        (item.description || '')
          .toLowerCase();

      const searchMatch =
        !search ||
        seriesName.includes(search) ||
        moduleName.includes(search) ||
        prefix.includes(search) ||
        numberFormat.includes(search) ||
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

    this.getNumberSeries();

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
  // Save / Update Number Series
  // =====================================

  saveSeries(): void {

    // Series Name validation
    if (!this.model.seriesName?.trim()) {

      this.alert.warning(
        'Series Name is required.'
      );

      return;
    }

    // Module Name validation
    if (!this.model.moduleName?.trim()) {

      this.alert.warning(
        'Module Name is required.'
      );

      return;
    }

    // Starting Number validation
    if (
      this.model.startingNumber === null ||
      this.model.startingNumber === undefined ||
      this.model.startingNumber < 0
    ) {

      this.alert.warning(
        'Starting Number cannot be negative.'
      );

      return;
    }

    // Current Number validation
    if (
      this.model.currentNumber === null ||
      this.model.currentNumber === undefined ||
      this.model.currentNumber < 0
    ) {

      this.alert.warning(
        'Current Number cannot be negative.'
      );

      return;
    }

    // Current Number should not be less than Starting Number
    if (
      Number(this.model.currentNumber) <
      Number(this.model.startingNumber)
    ) {

      this.alert.warning(
        'Current Number cannot be less than Starting Number.'
      );

      return;
    }

    // =====================================
    // API Request
    // =====================================

    const request = {

      numberSeriesId:
        this.isEdit
          ? this.editId
          : 0,

      seriesName:
        this.model.seriesName.trim(),

      moduleName:
        this.model.moduleName,

      prefix:
        this.model.prefix?.trim() || null,

      startingNumber:
        Number(this.model.startingNumber) || 0,

      currentNumber:
        Number(this.model.currentNumber) || 0,

      numberFormat:
        this.model.numberFormat?.trim() || null,

      status:
        this.model.status || 'Active',

      description:
        this.model.description?.trim() || null

    };

    // =====================================
    // Show Spinner
    // =====================================

    this.spinner.show();

    // =====================================
    // Update
    // =====================================

    if (this.isEdit) {

      this.controlSystemService
        .updateNumberSeries(request)
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Number Series updated successfully.'
              );

              this.closeModal();

              this.getNumberSeries();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to update number series.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error) => {

            this.spinner.hide();

            console.error(
              'Update Number Series Error:',
              error
            );

            this.alert.error(
              error?.error?.message ||
              'Failed to update number series.'
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
        .createNumberSeries(request)
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Number Series created successfully.'
              );

              this.closeModal();

              this.getNumberSeries();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to create number series.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error) => {

            this.spinner.hide();

            console.error(
              'Create Number Series Error:',
              error
            );

            this.alert.error(
              error?.error?.message ||
              'Failed to create number series.'
            );

            this.cd.detectChanges();

          }

        });

    }

  }

  // =====================================
  // Edit Number Series
  // =====================================

  edit(item: any): void {

    this.isEdit = true;

    this.editId = item.numberSeriesId;

    this.model = {

      numberSeriesId:
        item.numberSeriesId,

      seriesName:
        item.seriesName || '',

      moduleName:
        item.moduleName || 'Lead',

      prefix:
        item.prefix || '',

      startingNumber:
        item.startingNumber ?? 0,

      currentNumber:
        item.currentNumber ?? 0,

      numberFormat:
        item.numberFormat || '',

      description:
        item.description || '',

      status:
        item.status || 'Active'

    };

    this.showModal = true;

  }

  // =====================================
  // Delete Number Series
  // =====================================

  delete(id: number): void {

    if (!id) {

      this.alert.warning(
        'Invalid Number Series ID.'
      );

      return;
    }

    this.alert
      .deleteConfirm()
      .then(result => {

        if (result.isConfirmed) {

          this.spinner.show();

          this.controlSystemService
            .deleteNumberSeries(id)
            .subscribe({

              next: (response: any) => {

                this.spinner.hide();

                if (response?.success) {

                  this.alert.success(
                    response.message ||
                    'Number Series deleted successfully.'
                  );

                  this.getNumberSeries();

                } else {

                  this.alert.warning(
                    response?.message ||
                    'Unable to delete number series.'
                  );

                }

                this.cd.detectChanges();

              },

              error: (error) => {

                this.spinner.hide();

                console.error(
                  'Delete Number Series Error:',
                  error
                );

                this.alert.error(
                  error?.error?.message ||
                  'Failed to delete number series.'
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
