import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { ControlsystemService } from '../../services/controlsystem-service';

@Component({
  selector: 'app-activity-types',
    standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './activity-types.html',
  styleUrl: './activity-types.css',
})
export class ActivityTypes {
   constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef,
    private controlsystemService: ControlsystemService

  ) { }
// =====================================================
  // MODAL CONTROLS
  // =====================================================

  showModal = false;

  isEdit = false;

  editId = 0;


  // =====================================================
  // SEARCH FILTER
  // =====================================================

  searchText = '';

  statusFilter = '';


  // =====================================================
  // ACTIVITY TYPE DATA
  // =====================================================

  activityTypes: any[] = [];


  // =====================================================
  // FORM MODEL
  // =====================================================

  model: any = this.emptyModel();


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  ngOnInit(): void {

    this.getActivityTypes();

  }


  // =====================================================
  // EMPTY MODEL
  // =====================================================

  emptyModel(): any {

    return {

      activityTypeId: 0,

      activityName: '',

      activityCode: '',

      category: 'Call',

      durationMinutes: 30,

      description: '',

      reminderBeforeMinutes: 10,

      status: 'Active',

      reminderRequired: false

    };

  }


  // =====================================================
  // GET ALL ACTIVITY TYPES
  // =====================================================

  getActivityTypes(): void {

    this.spinner.show();

    this.controlsystemService.getActivityTypes()
      .subscribe({

        next: (response: any) => {

          this.spinner.hide();

          if (response && response.success) {

            this.activityTypes = response.data || [];

          }
          else {

            this.activityTypes = [];

            this.alert.warning(
              response?.message || 'Unable to load activity types.'
            );

          }

          this.cd.detectChanges();

        },

        error: (error) => {

          this.spinner.hide();

          console.error(
            'Error loading activity types:',
            error
          );

          this.activityTypes = [];

          this.alert.error(
            error?.error?.message ||
            'Failed to load activity types.'
          );

          this.cd.detectChanges();

        }

      });

  }


  // =====================================================
  // STATISTICS
  // =====================================================

  get activeCount(): number {

    return this.activityTypes.filter(
      x => x.status === 'Active'
    ).length;

  }


  get inactiveCount(): number {

    return this.activityTypes.filter(
      x => x.status === 'Inactive'
    ).length;

  }


  /*
   * Your backend model does not contain IsDefault.
   *
   * Therefore this value is kept only for compatibility
   * with the existing HTML.
   */

  get defaultActivity(): string {

    return '-';

  }


  // =====================================================
  // FILTER ACTIVITY TYPES
  // =====================================================

  get filteredActivityTypes(): any[] {

    return this.activityTypes.filter(item => {

      const searchValue =
        this.searchText.trim().toLowerCase();

      const search =
        !searchValue ||

        (item.activityName || '')
          .toLowerCase()
          .includes(searchValue) ||

        (item.activityCode || '')
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


  // =====================================================
  // REFRESH
  // =====================================================

  refresh(): void {

    this.getActivityTypes();

  }


  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  openAddModal(): void {

    this.isEdit = false;

    this.editId = 0;

    this.model = this.emptyModel();

    this.showModal = true;

  }


  // =====================================================
  // CLOSE MODAL
  // =====================================================

  closeModal(): void {

    this.showModal = false;

    this.model = this.emptyModel();

    this.isEdit = false;

    this.editId = 0;

  }


  // =====================================================
  // SAVE / UPDATE ACTIVITY TYPE
  // =====================================================

  saveActivityType(): void {

    // ---------------------------------------------
    // Activity Name Validation
    // ---------------------------------------------

    if (
      !this.model.activityName ||
      !this.model.activityName.trim()
    ) {

      this.alert.warning(
        'Activity Name is required.'
      );

      return;

    }


    // ---------------------------------------------
    // Activity Code Validation
    // ---------------------------------------------

    if (
      !this.model.activityCode ||
      !this.model.activityCode.trim()
    ) {

      this.alert.warning(
        'Activity Code is required.'
      );

      return;

    }


    // ---------------------------------------------
    // Category Validation
    // ---------------------------------------------

    if (
      !this.model.category ||
      !this.model.category.trim()
    ) {

      this.alert.warning(
        'Category is required.'
      );

      return;

    }


    // ---------------------------------------------
    // Duration Validation
    // ---------------------------------------------

    if (
      this.model.durationMinutes === null ||
      this.model.durationMinutes === undefined ||
      this.model.durationMinutes < 0
    ) {

      this.alert.warning(
        'Duration must be 0 or greater.'
      );

      return;

    }


    // ---------------------------------------------
    // Reminder Validation
    // ---------------------------------------------

    if (
      this.model.reminderBeforeMinutes === null ||
      this.model.reminderBeforeMinutes === undefined ||
      this.model.reminderBeforeMinutes < 0
    ) {

      this.alert.warning(
        'Reminder Before Minutes must be 0 or greater.'
      );

      return;

    }


    // ---------------------------------------------
    // Status
    // ---------------------------------------------

    if (!this.model.status) {

      this.model.status = 'Active';

    }


    // ---------------------------------------------
    // Prepare API Payload
    // ---------------------------------------------

    const payload = {

      activityTypeId:
        this.isEdit ? this.editId : 0,

      activityName:
        this.model.activityName.trim(),

      activityCode:
        this.model.activityCode.trim(),

      category:
        this.model.category.trim(),

      durationMinutes:
        Number(this.model.durationMinutes),

      description:
        this.model.description
          ? this.model.description.trim()
          : null,

      reminderBeforeMinutes:
        Number(this.model.reminderBeforeMinutes),

      status:
        this.model.status,

      reminderRequired:
        !!this.model.reminderRequired

    };


    // ---------------------------------------------
    // Show Spinner
    // ---------------------------------------------

    this.spinner.show();


    // =================================================
    // UPDATE
    // =================================================

    if (this.isEdit) {

      this.controlsystemService
        .updateActivityType(payload)
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response && response.success) {

              this.alert.success(
                response.message ||
                'Activity type updated successfully.'
              );

              this.closeModal();

              this.getActivityTypes();

            }
            else {

              this.alert.warning(
                response?.message ||
                'Unable to update activity type.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error) => {

            this.spinner.hide();

            console.error(
              'Update Activity Type Error:',
              error
            );

            this.alert.error(
              error?.error?.message ||
              'Failed to update activity type.'
            );

            this.cd.detectChanges();

          }

        });

    }


    // =================================================
    // CREATE
    // =================================================

    else {

      this.controlsystemService
        .createActivityType(payload)
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response && response.success) {

              this.alert.success(
                response.message ||
                'Activity type created successfully.'
              );

              this.closeModal();

              this.getActivityTypes();

            }
            else {

              this.alert.warning(
                response?.message ||
                'Unable to create activity type.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error) => {

            this.spinner.hide();

            console.error(
              'Create Activity Type Error:',
              error
            );

            this.alert.error(
              error?.error?.message ||
              'Failed to create activity type.'
            );

            this.cd.detectChanges();

          }

        });

    }

  }


  // =====================================================
  // EDIT ACTIVITY TYPE
  // =====================================================

  edit(item: any): void {

    this.isEdit = true;

    this.editId = item.activityTypeId;


    this.model = {

      activityTypeId:
        item.activityTypeId,

      activityName:
        item.activityName || '',

      activityCode:
        item.activityCode || '',

      category:
        item.category || 'Call',

      durationMinutes:
        item.durationMinutes ?? 30,

      description:
        item.description || '',

      reminderBeforeMinutes:
        item.reminderBeforeMinutes ?? 0,

      status:
        item.status || 'Active',

      reminderRequired:
        !!item.reminderRequired

    };


    this.showModal = true;

  }


  // =====================================================
  // DELETE ACTIVITY TYPE
  // =====================================================

  delete(id: number): void {

    if (!id) {

      this.alert.warning(
        'Invalid activity type.'
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
          .deleteActivityType(id)
          .subscribe({

            next: (response: any) => {

              this.spinner.hide();

              if (response && response.success) {

                this.alert.success(
                  response.message ||
                  'Activity type deleted successfully.'
                );

                this.getActivityTypes();

              }
              else {

                this.alert.warning(
                  response?.message ||
                  'Unable to delete activity type.'
                );

              }

              this.cd.detectChanges();

            },

            error: (error) => {

              this.spinner.hide();

              console.error(
                'Delete Activity Type Error:',
                error
              );

              this.alert.error(
                error?.error?.message ||
                'Failed to delete activity type.'
              );

              this.cd.detectChanges();

            }

          });

      });

  }


  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  clearFilters(): void {

    this.searchText = '';

    this.statusFilter = '';

  }
}
