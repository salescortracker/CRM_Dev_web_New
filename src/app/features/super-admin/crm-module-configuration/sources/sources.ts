import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { ControlsystemService } from '../../services/controlsystem-service';

@Component({
  selector: 'app-sources',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sources.html',
  styleUrl: './sources.css',
})
export class Sources {
  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef,
    private controlsystemService: ControlsystemService

  ) { }







  // =================================
  // Modal Controls
  // =================================


  showModal = false;


  isEdit = false;


  editId = 0;







  // =================================
  // Search
  // =================================


  searchText = '';

  statusFilter = '';







  // =================================
  // Static Source Data
  // =================================


  sources: any[] = [];









  // =================================
  // Form Model
  // =================================


  model: any = this.emptyModel();

ngOnInit(): void {

    this.getSources();

  }

// =================================
  // EMPTY MODEL
  // =================================

  emptyModel(): any {

    return {

      sourceId: 0,

      sourceName: '',

      sourceCode: '',

      category: 'Digital Marketing',

      conversionRate: 0,

      priority: 'Medium',

      status: 'Active',

      description: ''

    };

  }


  // =================================
  // GET ALL SOURCES
  // =================================

  getSources(): void {

    this.spinner.show();

    this.controlsystemService
      .getSources()
      .subscribe({

        next: (response: any) => {

          this.spinner.hide();

          if (response && response.success) {

            this.sources = response.data || [];

          }
          else {

            this.sources = [];

            this.alert.warning(
              response?.message ||
              'Unable to load sources.'
            );

          }

          this.cd.detectChanges();

        },

        error: (error) => {

          this.spinner.hide();

          console.error(
            'Error loading sources:',
            error
          );

          this.sources = [];

          this.alert.error(
            error?.error?.message ||
            'Failed to load sources.'
          );

          this.cd.detectChanges();

        }

      });

  }


  // =================================
  // STATISTICS
  // =================================

  get activeCount(): number {

    return this.sources.filter(
      x => x.status === 'Active'
    ).length;

  }


  get inactiveCount(): number {

    return this.sources.filter(
      x => x.status === 'Inactive'
    ).length;

  }


  /*
   * Backend model does not contain IsDefault.
   *
   * Kept for compatibility with existing HTML.
   */

  get defaultSource(): string {

    return '-';

  }


  // =================================
  // FILTER SOURCES
  // =================================

  get filteredSources(): any[] {

    const searchValue =
      this.searchText.trim().toLowerCase();

    return this.sources.filter(item => {

      const search =

        !searchValue ||

        (item.sourceName || '')
          .toLowerCase()
          .includes(searchValue) ||

        (item.sourceCode || '')
          .toLowerCase()
          .includes(searchValue) ||

        (item.category || '')
          .toLowerCase()
          .includes(searchValue) ||

        (item.description || '')
          .toLowerCase()
          .includes(searchValue);


      const status =

        this.statusFilter === '' ||

        item.status === this.statusFilter;


      return search && status;

    });

  }


  // =================================
  // REFRESH
  // =================================

  refresh(): void {

    this.getSources();

  }


  // =================================
  // OPEN ADD MODAL
  // =================================

  openAddModal(): void {

    this.isEdit = false;

    this.editId = 0;

    this.model = this.emptyModel();

    this.showModal = true;

  }


  // =================================
  // CLOSE MODAL
  // =================================

  closeModal(): void {

    this.showModal = false;

    this.model = this.emptyModel();

    this.isEdit = false;

    this.editId = 0;

  }


  // =================================
  // SAVE / UPDATE SOURCE
  // =================================

  saveSource(): void {

    // ---------------------------------
    // Source Name Validation
    // ---------------------------------

    if (
      !this.model.sourceName ||
      !this.model.sourceName.trim()
    ) {

      this.alert.warning(
        'Source Name is required.'
      );

      return;

    }


    // ---------------------------------
    // Source Code Validation
    // ---------------------------------

    if (
      !this.model.sourceCode ||
      !this.model.sourceCode.trim()
    ) {

      this.alert.warning(
        'Source Code is required.'
      );

      return;

    }


    // ---------------------------------
    // Category Validation
    // ---------------------------------

    if (
      !this.model.category ||
      !this.model.category.trim()
    ) {

      this.alert.warning(
        'Category is required.'
      );

      return;

    }


    // ---------------------------------
    // Conversion Rate Validation
    // ---------------------------------

    if (
      this.model.conversionRate === null ||
      this.model.conversionRate === undefined ||
      this.model.conversionRate < 0 ||
      this.model.conversionRate > 100
    ) {

      this.alert.warning(
        'Conversion Rate must be between 0 and 100.'
      );

      return;

    }


    // ---------------------------------
    // Priority
    // ---------------------------------

    if (!this.model.priority) {

      this.model.priority = 'Medium';

    }


    // ---------------------------------
    // Status
    // ---------------------------------

    if (!this.model.status) {

      this.model.status = 'Active';

    }


    // ---------------------------------
    // API PAYLOAD
    // ---------------------------------

    const payload = {

      sourceId:
        this.isEdit ? this.editId : 0,

      sourceName:
        this.model.sourceName.trim(),

      sourceCode:
        this.model.sourceCode.trim(),

      category:
        this.model.category.trim(),

      conversionRate:
        Number(this.model.conversionRate),

      priority:
        this.model.priority,

      status:
        this.model.status,

      description:
        this.model.description
          ? this.model.description.trim()
          : null

    };


    // ---------------------------------
    // SHOW SPINNER
    // ---------------------------------

    this.spinner.show();


    // =================================
    // UPDATE
    // =================================

    if (this.isEdit) {

      this.controlsystemService
        .updateSource(payload)
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response && response.success) {

              this.alert.success(
                response.message ||
                'Source updated successfully.'
              );

              this.closeModal();

              this.getSources();

            }
            else {

              this.alert.warning(
                response?.message ||
                'Unable to update source.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error) => {

            this.spinner.hide();

            console.error(
              'Update Source Error:',
              error
            );

            this.alert.error(
              error?.error?.message ||
              'Failed to update source.'
            );

            this.cd.detectChanges();

          }

        });

    }


    // =================================
    // CREATE
    // =================================

    else {

      this.controlsystemService
        .createSource(payload)
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response && response.success) {

              this.alert.success(
                response.message ||
                'Source created successfully.'
              );

              this.closeModal();

              this.getSources();

            }
            else {

              this.alert.warning(
                response?.message ||
                'Unable to create source.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error) => {

            this.spinner.hide();

            console.error(
              'Create Source Error:',
              error
            );

            this.alert.error(
              error?.error?.message ||
              'Failed to create source.'
            );

            this.cd.detectChanges();

          }

        });

    }

  }


  // =================================
  // EDIT SOURCE
  // =================================

  edit(item: any): void {

    this.isEdit = true;

    this.editId = item.sourceId;


    this.model = {

      sourceId:
        item.sourceId,

      sourceName:
        item.sourceName || '',

      sourceCode:
        item.sourceCode || '',

      category:
        item.category || 'Digital Marketing',

      conversionRate:
        item.conversionRate ?? 0,

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
  // DELETE SOURCE
  // =================================

  delete(id: number): void {

    if (!id) {

      this.alert.warning(
        'Invalid source.'
      );

      return;

    }


    this.alert.deleteConfirm()
      .then(result => {

        if (!result.isConfirmed) {

          return;

        }


        this.spinner.show();


        this.controlsystemService
          .deleteSource(id)
          .subscribe({

            next: (response: any) => {

              this.spinner.hide();

              if (response && response.success) {

                this.alert.success(
                  response.message ||
                  'Source deleted successfully.'
                );

                this.getSources();

              }
              else {

                this.alert.warning(
                  response?.message ||
                  'Unable to delete source.'
                );

              }

              this.cd.detectChanges();

            },

            error: (error) => {

              this.spinner.hide();

              console.error(
                'Delete Source Error:',
                error
              );

              this.alert.error(
                error?.error?.message ||
                'Failed to delete source.'
              );

              this.cd.detectChanges();

            }

          });

      });

  }


  // =================================
  // CLEAR FILTERS
  // =================================

  clearFilters(): void {

    this.searchText = '';

    this.statusFilter = '';

  }
}
