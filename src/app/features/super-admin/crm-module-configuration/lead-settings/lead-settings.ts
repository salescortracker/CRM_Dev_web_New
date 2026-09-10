import { ChangeDetectorRef, Component } from '@angular/core';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlsystemService } from '../../services/controlsystem-service';

@Component({
  selector: 'app-lead-settings',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './lead-settings.html',
  styleUrl: './lead-settings.css',
})
export class LeadSettings {
  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef,
     private controlSystemService: ControlsystemService

  ) { }





  // ==============================
  // Modal Controls
  // ==============================


  showModal = false;


  isEdit = false;


  editId = 0;






  // ==============================
  // Search
  // ==============================


  searchText = '';

  statusFilter = '';







  // ==============================
  // Static Lead Settings Data
  // ==============================


  leadSettings:any[] = [];









  // ==============================
  // Form Model
  // ==============================


  model:any = this.emptyModel();
 emptyModel() {
    return {

      leadSettingId: 0,

      settingName: '',

      leadStatus: 'New',

      leadPriority: 'Medium',

      assignmentRule: 'Round Robin',

      followUpDays: 3,

      enableAutoAssignment: true,

      emailNotification: true,

      status: 'Active'

    };
  }


  // =========================================================
  // Lifecycle
  // =========================================================

  ngOnInit(): void {

    this.getLeadSettings();

  }


  // =========================================================
  // Get All Lead Settings
  // =========================================================

  getLeadSettings(): void {

    this.spinner.show();

    this.controlSystemService
      .getLeadSettings()
      .subscribe({

        next: (response: any) => {

          this.spinner.hide();

          if (response?.success) {

            this.leadSettings = response.data || [];

          }
          else {

            this.leadSettings = [];

            this.alert.warning(
              response?.message ||
              'Unable to load lead settings.'
            );

          }

          this.cd.detectChanges();

        },

        error: (error) => {

          this.spinner.hide();

          console.error(
            'Get Lead Settings Error:',
            error
          );

          this.leadSettings = [];

          this.alert.error(
            error?.error?.message ||
            'Failed to load lead settings.'
          );

          this.cd.detectChanges();

        }

      });

  }


  // =========================================================
  // Statistics
  // =========================================================

  get activeCount(): number {

    return this.leadSettings.filter(
      x => x.status === 'Active'
    ).length;

  }


  get inactiveCount(): number {

    return this.leadSettings.filter(
      x => x.status === 'Inactive'
    ).length;

  }


  // =========================================================
  // Filtered Lead Settings
  // =========================================================

  get filteredLeadSettings(): any[] {

    const search =
      this.searchText
        .toLowerCase()
        .trim();

    return this.leadSettings.filter(item => {

      const settingName =
        (item.settingName || '')
          .toLowerCase();

      const leadStatus =
        (item.leadStatus || '')
          .toLowerCase();

      const assignmentRule =
        (item.assignmentRule || '')
          .toLowerCase();

      const leadPriority =
        (item.leadPriority || '')
          .toLowerCase();

      const searchMatch =
        !search ||
        settingName.includes(search) ||
        leadStatus.includes(search) ||
        assignmentRule.includes(search) ||
        leadPriority.includes(search);

      const statusMatch =
        this.statusFilter === '' ||
        item.status === this.statusFilter;

      return searchMatch && statusMatch;

    });

  }


  // =========================================================
  // Refresh
  // =========================================================

  refresh(): void {

    this.getLeadSettings();

  }


  // =========================================================
  // Open Add Modal
  // =========================================================

  openAddModal(): void {

    this.isEdit = false;

    this.editId = 0;

    this.model = this.emptyModel();

    this.showModal = true;

  }


  // =========================================================
  // Close Modal
  // =========================================================

  closeModal(): void {

    this.showModal = false;

    this.model = this.emptyModel();

    this.isEdit = false;

    this.editId = 0;

  }


  // =========================================================
  // Save / Update Lead Setting
  // =========================================================

  saveLeadSetting(): void {

    // =======================================================
    // Setting Name Validation
    // =======================================================

    if (!this.model.settingName?.trim()) {

      this.alert.warning(
        'Setting Name is required.'
      );

      return;

    }


    // =======================================================
    // Lead Status Validation
    // =======================================================

    if (!this.model.leadStatus?.trim()) {

      this.alert.warning(
        'Lead Status is required.'
      );

      return;

    }


    // =======================================================
    // Lead Priority Validation
    // =======================================================

    if (!this.model.leadPriority?.trim()) {

      this.alert.warning(
        'Lead Priority is required.'
      );

      return;

    }


    // =======================================================
    // Assignment Rule Validation
    // =======================================================

    if (!this.model.assignmentRule?.trim()) {

      this.alert.warning(
        'Assignment Rule is required.'
      );

      return;

    }


    // =======================================================
    // Follow-up Days Validation
    // =======================================================

    if (
      this.model.followUpDays === null ||
      this.model.followUpDays === undefined ||
      Number(this.model.followUpDays) < 0
    ) {

      this.alert.warning(
        'Follow-up Days cannot be negative.'
      );

      return;

    }


    // =======================================================
    // Request Object
    // =======================================================

    const request = {

      leadSettingId:
        this.isEdit
          ? this.editId
          : 0,

      settingName:
        this.model.settingName.trim(),

      leadStatus:
        this.model.leadStatus,

      leadPriority:
        this.model.leadPriority,

      assignmentRule:
        this.model.assignmentRule,

      followUpDays:
        Number(this.model.followUpDays) || 0,

      status:
        this.model.status || 'Active',

      enableAutoAssignment:
        this.model.enableAutoAssignment === true,

      emailNotification:
        this.model.emailNotification === true

    };


    // =======================================================
    // Show Spinner
    // =======================================================

    this.spinner.show();


    // =======================================================
    // UPDATE
    // =======================================================

    if (this.isEdit) {

      this.controlSystemService
        .updateLeadSetting(request)
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Lead setting updated successfully.'
              );

              this.closeModal();

              this.getLeadSettings();

            }
            else {

              this.alert.warning(
                response?.message ||
                'Unable to update lead setting.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error) => {

            this.spinner.hide();

            console.error(
              'Update Lead Setting Error:',
              error
            );

            this.alert.error(
              error?.error?.message ||
              'Failed to update lead setting.'
            );

            this.cd.detectChanges();

          }

        });

    }


    // =======================================================
    // CREATE
    // =======================================================

    else {

      this.controlSystemService
        .createLeadSetting(request)
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Lead setting created successfully.'
              );

              this.closeModal();

              this.getLeadSettings();

            }
            else {

              this.alert.warning(
                response?.message ||
                'Unable to create lead setting.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error) => {

            this.spinner.hide();

            console.error(
              'Create Lead Setting Error:',
              error
            );

            this.alert.error(
              error?.error?.message ||
              'Failed to create lead setting.'
            );

            this.cd.detectChanges();

          }

        });

    }

  }


  // =========================================================
  // Edit Lead Setting
  // =========================================================

  edit(item: any): void {

    this.isEdit = true;

    this.editId = item.leadSettingId;

    this.model = {

      leadSettingId:
        item.leadSettingId,

      settingName:
        item.settingName || '',

      leadStatus:
        item.leadStatus || 'New',

      leadPriority:
        item.leadPriority || 'Medium',

      assignmentRule:
        item.assignmentRule || 'Round Robin',

      followUpDays:
        item.followUpDays ?? 3,

      enableAutoAssignment:
        item.enableAutoAssignment === true,

      emailNotification:
        item.emailNotification === true,

      status:
        item.status || 'Active'

    };

    this.showModal = true;

  }


  // =========================================================
  // Delete Lead Setting
  // =========================================================

  delete(id: number): void {

    if (!id) {

      this.alert.warning(
        'Invalid Lead Setting ID.'
      );

      return;

    }


    this.alert
      .deleteConfirm()
      .then(result => {

        if (result.isConfirmed) {

          this.spinner.show();

          this.controlSystemService
            .deleteLeadSetting(id)
            .subscribe({

              next: (response: any) => {

                this.spinner.hide();

                if (response?.success) {

                  this.alert.success(
                    response.message ||
                    'Lead setting deleted successfully.'
                  );

                  this.getLeadSettings();

                }
                else {

                  this.alert.warning(
                    response?.message ||
                    'Unable to delete lead setting.'
                  );

                }

                this.cd.detectChanges();

              },

              error: (error) => {

                this.spinner.hide();

                console.error(
                  'Delete Lead Setting Error:',
                  error
                );

                this.alert.error(
                  error?.error?.message ||
                  'Failed to delete lead setting.'
                );

                this.cd.detectChanges();

              }

            });

        }

      });

  }


  // =========================================================
  // Clear Filters
  // =========================================================

  clearFilters(): void {

    this.searchText = '';

    this.statusFilter = '';

  }
}
