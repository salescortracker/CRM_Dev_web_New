import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { ControlsystemService } from '../../services/controlsystem-service';

@Component({
  selector: 'app-opportunity-stages',
   standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './opportunity-stages.html',
  styleUrl: './opportunity-stages.css',
})
export class OpportunityStages {
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
  // Static Opportunity Stages Data
  // ==============================


  stages:any[] = [];









  // ==============================
  // Form Model
  // ==============================


  model:any = this.emptyModel();

 emptyModel() {
    return {
      opportunityStageId: 0,

      stageName: '',

      stageCode: '',

      probability: 0,

      stageOrder: 1,

      forecastCategory: 'Pipeline',

      stageType: 'Open',

      status: 'Active',

      wonStage: false,

      lostStage: false
    };
  }


  // ==============================
  // Lifecycle
  // ==============================

  ngOnInit(): void {
    this.getStages();
  }


  // ==============================
  // GET ALL OPPORTUNITY STAGES
  // ==============================

  getStages(): void {

    this.spinner.show();

    this.controlSystemService.getOpportunityStages().subscribe({

      next: (response: any) => {

        this.spinner.hide();

        if (response?.success) {

          this.stages = response.data || [];

        } else {

          this.stages = [];

          this.alert.error(
            response?.message || 'Failed to load opportunity stages.'
          );

        }

        this.cd.detectChanges();
      },

      error: (error: any) => {

        this.spinner.hide();

        this.stages = [];

        this.alert.error(
          error?.error?.message ||
          'Failed to load opportunity stages.'
        );

        this.cd.detectChanges();
      }

    });
  }


  // ==============================
  // Statistics
  // ==============================

  get activeCount(): number {

    return this.stages.filter(
      x => x.status === 'Active'
    ).length;

  }


  get inactiveCount(): number {

    return this.stages.filter(
      x => x.status === 'Inactive'
    ).length;

  }


  // ==============================
  // Filtered Stages
  // ==============================

  get filteredStages(): any[] {

    const searchValue =
      this.searchText.trim().toLowerCase();

    return this.stages.filter(item => {

      const search =
        !searchValue ||

        (item.stageName || '')
          .toLowerCase()
          .includes(searchValue)

        ||

        (item.stageCode || '')
          .toLowerCase()
          .includes(searchValue)

        ||

        (item.forecastCategory || '')
          .toLowerCase()
          .includes(searchValue)

        ||

        (item.stageType || '')
          .toLowerCase()
          .includes(searchValue);


      const status =
        this.statusFilter === '' ||

        item.status === this.statusFilter;


      return search && status;

    });

  }


  // ==============================
  // Refresh
  // ==============================

  refresh(): void {

    this.getStages();

  }


  // ==============================
  // Open Add Modal
  // ==============================

  openAddModal(): void {

    this.isEdit = false;

    this.editId = 0;

    this.model = this.emptyModel();

    this.showModal = true;

  }


  // ==============================
  // Close Modal
  // ==============================

  closeModal(): void {

    this.showModal = false;

    this.model = this.emptyModel();

    this.isEdit = false;

    this.editId = 0;

  }


  // ==============================
  // Save / Update Opportunity Stage
  // ==============================

  saveStage(): void {

    // ==============================
    // Validation
    // ==============================

    if (!this.model.stageName?.trim()) {

      this.alert.warning(
        'Stage Name is required.'
      );

      return;

    }


    if (!this.model.stageCode?.trim()) {

      this.alert.warning(
        'Stage Code is required.'
      );

      return;

    }


    if (!this.model.forecastCategory?.trim()) {

      this.alert.warning(
        'Forecast Category is required.'
      );

      return;

    }


    if (!this.model.stageType?.trim()) {

      this.alert.warning(
        'Stage Type is required.'
      );

      return;

    }


    if (
      this.model.probability === null ||
      this.model.probability === undefined ||
      this.model.probability < 0 ||
      this.model.probability > 100
    ) {

      this.alert.warning(
        'Probability must be between 0 and 100.'
      );

      return;

    }


    if (
      this.model.stageOrder === null ||
      this.model.stageOrder === undefined ||
      this.model.stageOrder <= 0
    ) {

      this.alert.warning(
        'Stage Order must be greater than 0.'
      );

      return;

    }


    // ==============================
    // Won / Lost Validation
    // ==============================

    if (
      this.model.wonStage &&
      this.model.lostStage
    ) {

      this.alert.warning(
        'A stage cannot be both Won and Lost.'
      );

      return;

    }


    // ==============================
    // Prepare Request
    // ==============================

    const request = {

      opportunityStageId:
        this.isEdit
          ? this.editId
          : 0,

      stageName:
        this.model.stageName.trim(),

      stageCode:
        this.model.stageCode.trim(),

      probability:
        Number(this.model.probability),

      stageOrder:
        Number(this.model.stageOrder),

      forecastCategory:
        this.model.forecastCategory.trim(),

      stageType:
        this.model.stageType.trim(),

      status:
        this.model.status,

      wonStage:
        !!this.model.wonStage,

      lostStage:
        !!this.model.lostStage

    };


    // ==============================
    // Show Spinner
    // ==============================

    this.spinner.show();


    // ==============================
    // UPDATE
    // ==============================

    if (this.isEdit) {

      this.controlSystemService
        .updateOpportunityStage(request)
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Opportunity stage updated successfully.'
              );

              this.closeModal();

              this.getStages();

            } else {

              this.alert.error(
                response?.message ||
                'Failed to update opportunity stage.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error: any) => {

            this.spinner.hide();

            this.alert.error(
              error?.error?.message ||
              'Failed to update opportunity stage.'
            );

            this.cd.detectChanges();

          }

        });

    }

    // ==============================
    // CREATE
    // ==============================

    else {

      this.controlSystemService
        .createOpportunityStage(request)
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Opportunity stage created successfully.'
              );

              this.closeModal();

              this.getStages();

            } else {

              this.alert.error(
                response?.message ||
                'Failed to create opportunity stage.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error: any) => {

            this.spinner.hide();

            this.alert.error(
              error?.error?.message ||
              'Failed to create opportunity stage.'
            );

            this.cd.detectChanges();

          }

        });

    }

  }


  // ==============================
  // Edit Opportunity Stage
  // ==============================

  edit(item: any): void {

    this.isEdit = true;

    this.editId =
      item.opportunityStageId;


    this.model = {

      opportunityStageId:
        item.opportunityStageId,

      stageName:
        item.stageName || '',

      stageCode:
        item.stageCode || '',

      probability:
        item.probability ?? 0,

      stageOrder:
        item.stageOrder ?? 1,

      forecastCategory:
        item.forecastCategory || 'Pipeline',

      stageType:
        item.stageType || 'Open',

      status:
        item.status || 'Active',

      wonStage:
        item.wonStage ?? false,

      lostStage:
        item.lostStage ?? false

    };


    this.showModal = true;

  }


  // ==============================
  // Delete Opportunity Stage
  // ==============================

  delete(id: number): void {

    this.alert.deleteConfirm()

      .then(result => {

        if (result.isConfirmed) {

          this.spinner.show();


          this.controlSystemService
            .deleteOpportunityStage(id)
            .subscribe({

              next: (response: any) => {

                this.spinner.hide();

                if (response?.success) {

                  this.alert.success(
                    response.message ||
                    'Opportunity stage deleted successfully.'
                  );

                  this.getStages();

                } else {

                  this.alert.error(
                    response?.message ||
                    'Failed to delete opportunity stage.'
                  );

                }

                this.cd.detectChanges();

              },

              error: (error: any) => {

                this.spinner.hide();

                this.alert.error(
                  error?.error?.message ||
                  'Failed to delete opportunity stage.'
                );

                this.cd.detectChanges();

              }

            });

        }

      });

  }


  // ==============================
  // Clear Filters
  // ==============================

  clearFilters(): void {

    this.searchText = '';

    this.statusFilter = '';

  }
}
  