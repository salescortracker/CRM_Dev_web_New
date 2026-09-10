import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { ControlsystemService } from '../../services/controlsystem-service';

@Component({
  selector: 'app-territories',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './territories.html',
  styleUrl: './territories.css',
})
export class Territories {
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
  // Static Territory Data
  // =====================================


  territories:any[] = [];









  // =====================================
  // Form Model
  // =====================================


  model:any = this.emptyModel();

emptyModel() {
    return {
      territoryId: 0,
      territoryName: '',
      territoryCode: '',
      region: 'South Region',
      territoryManager: '',
      customerCount: 0,
      priority: 'Medium',
      status: 'Active',
      description: ''
    };
  }


  // =====================================
  // Lifecycle
  // =====================================

  ngOnInit(): void {
    this.getTerritories();
  }


  // =====================================
  // Get All Territories
  // =====================================

  getTerritories(): void {

    this.spinner.show();

    this.controlSystemService.getTerritories().subscribe({

      next: (response: any) => {

        this.spinner.hide();

        if (response?.success) {

          this.territories = response.data || [];

        } else {

          this.territories = [];

          this.alert.warning(
            response?.message || 'Unable to load territories.'
          );

        }

        this.cd.detectChanges();
      },

      error: (error) => {

        this.spinner.hide();

        console.error(
          'Get Territories Error:',
          error
        );

        this.territories = [];

        this.alert.error(
          error?.error?.message ||
          'Failed to load territories.'
        );

        this.cd.detectChanges();
      }

    });

  }


  // =====================================
  // Statistics
  // =====================================

  get activeCount() {

    return this.territories.filter(
      x => x.status === 'Active'
    ).length;

  }


  get inactiveCount() {

    return this.territories.filter(
      x => x.status === 'Inactive'
    ).length;

  }


  // =====================================
  // Filter Territories
  // =====================================

  get filteredTerritories() {

    const search =
      this.searchText
        .toLowerCase()
        .trim();

    return this.territories.filter(item => {

      const territoryName =
        (item.territoryName || '')
          .toLowerCase();

      const territoryCode =
        (item.territoryCode || '')
          .toLowerCase();

      const region =
        (item.region || '')
          .toLowerCase();

      const territoryManager =
        (item.territoryManager || '')
          .toLowerCase();

      const description =
        (item.description || '')
          .toLowerCase();

      const searchMatch =
        !search ||
        territoryName.includes(search) ||
        territoryCode.includes(search) ||
        region.includes(search) ||
        territoryManager.includes(search) ||
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

    this.getTerritories();

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
  // Save / Update Territory
  // =====================================

  saveTerritory(): void {

    // -------------------------------------
    // Territory Name Validation
    // -------------------------------------

    if (!this.model.territoryName?.trim()) {

      this.alert.warning(
        'Territory Name is required.'
      );

      return;
    }


    // -------------------------------------
    // Territory Code Validation
    // -------------------------------------

    if (!this.model.territoryCode?.trim()) {

      this.alert.warning(
        'Territory Code is required.'
      );

      return;
    }


    // -------------------------------------
    // Region Validation
    // -------------------------------------

    if (!this.model.region?.trim()) {

      this.alert.warning(
        'Region is required.'
      );

      return;
    }


    // -------------------------------------
    // Customer Count Validation
    // -------------------------------------

    if (
      this.model.customerCount === null ||
      this.model.customerCount === undefined ||
      Number(this.model.customerCount) < 0
    ) {

      this.alert.warning(
        'Customer Count cannot be negative.'
      );

      return;
    }


    // -------------------------------------
    // Prepare Request
    // -------------------------------------

    const request = {

      territoryId:
        this.isEdit
          ? this.editId
          : 0,

      territoryName:
        this.model.territoryName.trim(),

      territoryCode:
        this.model.territoryCode.trim(),

      region:
        this.model.region,

      territoryManager:
        this.model.territoryManager?.trim() || null,

      customerCount:
        Number(this.model.customerCount) || 0,

      priority:
        this.model.priority,

      status:
        this.model.status,

      description:
        this.model.description?.trim() || null

    };


    // -------------------------------------
    // Show Spinner
    // -------------------------------------

    this.spinner.show();


    // =====================================
    // UPDATE
    // =====================================

    if (this.isEdit) {

      this.controlSystemService
        .updateTerritory(request)
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Territory updated successfully.'
              );

              this.closeModal();

              this.getTerritories();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to update territory.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error) => {

            this.spinner.hide();

            console.error(
              'Update Territory Error:',
              error
            );

            this.alert.error(
              error?.error?.message ||
              'Failed to update territory.'
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
        .createTerritory(request)
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Territory created successfully.'
              );

              this.closeModal();

              this.getTerritories();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to create territory.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error) => {

            this.spinner.hide();

            console.error(
              'Create Territory Error:',
              error
            );

            this.alert.error(
              error?.error?.message ||
              'Failed to create territory.'
            );

            this.cd.detectChanges();

          }

        });

    }

  }


  // =====================================
  // Edit Territory
  // =====================================

  edit(item: any): void {

    this.isEdit = true;

    this.editId = item.territoryId;

    this.model = {

      territoryId:
        item.territoryId,

      territoryName:
        item.territoryName || '',

      territoryCode:
        item.territoryCode || '',

      region:
        item.region || 'South Region',

      territoryManager:
        item.territoryManager || '',

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


  // =====================================
  // Delete Territory
  // =====================================

  delete(id: number): void {

    if (!id) {

      this.alert.warning(
        'Invalid Territory ID.'
      );

      return;

    }


    this.alert.deleteConfirm()
      .then(result => {

        if (result.isConfirmed) {

          this.spinner.show();

          this.controlSystemService
            .deleteTerritory(id)
            .subscribe({

              next: (response: any) => {

                this.spinner.hide();

                if (response?.success) {

                  this.alert.success(
                    response.message ||
                    'Territory deleted successfully.'
                  );

                  this.getTerritories();

                } else {

                  this.alert.warning(
                    response?.message ||
                    'Unable to delete territory.'
                  );

                }

                this.cd.detectChanges();

              },

              error: (error) => {

                this.spinner.hide();

                console.error(
                  'Delete Territory Error:',
                  error
                );

                this.alert.error(
                  error?.error?.message ||
                  'Failed to delete territory.'
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
