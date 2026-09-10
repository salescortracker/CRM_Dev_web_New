import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { ControlsystemService } from '../../services/controlsystem-service';

@Component({
  selector: 'app-pipeline-settings',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './pipeline-settings.html',
  styleUrl: './pipeline-settings.css',
})
export class PipelineSettings {
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
  // Static Pipeline Data
  // ==============================


  pipelines:any[] = [];









  // ==============================
  // Form Model
  // ==============================


  model:any = this.emptyModel();

emptyModel() {
    return {
      pipelineSettingId: 0,
      pipelineName: '',
      pipelineCode: '',
      pipelineType: 'Sales',
      totalStages: 5,
      description: '',
      status: 'Active'
    };
  }


  // ==============================
  // On Init
  // ==============================

  ngOnInit(): void {
    this.getPipelines();
  }


  // ==============================
  // Get All Pipelines
  // ==============================

  getPipelines(): void {

    this.spinner.show();

    this.controlSystemService.getPipelineSettings().subscribe({

      next: (response: any) => {

        this.spinner.hide();

        if (response?.success) {

          this.pipelines = response.data || [];

        } else {

          this.pipelines = [];

          this.alert.warning(
            response?.message || 'Unable to load pipeline settings.'
          );

        }

        this.cd.detectChanges();
      },

      error: (error: any) => {

        this.spinner.hide();

        this.pipelines = [];

        this.alert.error(
          error?.error?.message ||
          'Failed to load pipeline settings.'
        );

        this.cd.detectChanges();
      }

    });

  }


  // ==============================
  // Statistics
  // ==============================

  get activeCount(): number {

    return this.pipelines.filter(
      x => x.status === 'Active'
    ).length;

  }


  get inactiveCount(): number {

    return this.pipelines.filter(
      x => x.status === 'Inactive'
    ).length;

  }


  // ==============================
  // Filter Pipelines
  // ==============================

  get filteredPipelines(): any[] {

    const search = this.searchText
      .trim()
      .toLowerCase();

    return this.pipelines.filter(item => {

      const pipelineName =
        (item.pipelineName || '').toLowerCase();

      const pipelineCode =
        (item.pipelineCode || '').toLowerCase();

      const pipelineType =
        (item.pipelineType || '').toLowerCase();

      const description =
        (item.description || '').toLowerCase();

      const status =
        (item.status || '').toLowerCase();


      const matchesSearch =
        !search ||
        pipelineName.includes(search) ||
        pipelineCode.includes(search) ||
        pipelineType.includes(search) ||
        description.includes(search);


      const matchesStatus =
        !this.statusFilter ||
        status === this.statusFilter.toLowerCase();


      return matchesSearch && matchesStatus;

    });

  }


  // ==============================
  // Refresh
  // ==============================

  refresh(): void {

    this.getPipelines();

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
  // Save / Update Pipeline
  // ==============================

  savePipeline(): void {

    // Pipeline Name validation
    if (!this.model.pipelineName?.trim()) {

      this.alert.warning(
        'Pipeline Name is required.'
      );

      return;

    }


    // Pipeline Code validation
    if (!this.model.pipelineCode?.trim()) {

      this.alert.warning(
        'Pipeline Code is required.'
      );

      return;

    }


    // Pipeline Type validation
    if (!this.model.pipelineType?.trim()) {

      this.alert.warning(
        'Pipeline Type is required.'
      );

      return;

    }


    // Total Stages validation
    if (
      this.model.totalStages === null ||
      this.model.totalStages === undefined ||
      this.model.totalStages < 0
    ) {

      this.alert.warning(
        'Total Stages cannot be negative.'
      );

      return;

    }


    // Prepare request
    const request = {

      pipelineSettingId:
        this.isEdit ? this.editId : 0,

      pipelineName:
        this.model.pipelineName.trim(),

      pipelineCode:
        this.model.pipelineCode.trim(),

      pipelineType:
        this.model.pipelineType.trim(),

      totalStages:
        Number(this.model.totalStages),

      description:
        this.model.description?.trim() || null,

      status:
        this.model.status || 'Active'

    };


    this.spinner.show();


    // ==============================
    // UPDATE
    // ==============================

    if (this.isEdit) {

      this.controlSystemService
        .updatePipelineSetting(request)
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Pipeline Setting Updated Successfully.'
              );

              this.closeModal();

              this.getPipelines();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to update pipeline setting.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error: any) => {

            this.spinner.hide();

            this.alert.error(
              error?.error?.message ||
              'Failed to update pipeline setting.'
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
        .createPipelineSetting(request)
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Pipeline Setting Created Successfully.'
              );

              this.closeModal();

              this.getPipelines();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to create pipeline setting.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error: any) => {

            this.spinner.hide();

            this.alert.error(
              error?.error?.message ||
              'Failed to create pipeline setting.'
            );

            this.cd.detectChanges();

          }

        });

    }

  }


  // ==============================
  // Edit Pipeline
  // ==============================

  edit(item: any): void {

    this.isEdit = true;

    this.editId = item.pipelineSettingId;


    this.model = {

      pipelineSettingId:
        item.pipelineSettingId,

      pipelineName:
        item.pipelineName || '',

      pipelineCode:
        item.pipelineCode || '',

      pipelineType:
        item.pipelineType || 'Sales',

      totalStages:
        item.totalStages ?? 0,

      description:
        item.description || '',

      status:
        item.status || 'Active'

    };


    this.showModal = true;

    this.cd.detectChanges();

  }


  // ==============================
  // Delete Pipeline
  // ==============================

  delete(id: number): void {

    this.alert.deleteConfirm()
      .then((result: any) => {

        if (!result.isConfirmed) {
          return;
        }


        this.spinner.show();


        this.controlSystemService
          .deletePipelineSetting(id)
          .subscribe({

            next: (response: any) => {

              this.spinner.hide();

              if (response?.success) {

                this.alert.success(
                  response.message ||
                  'Pipeline Setting Deleted Successfully.'
                );

                this.getPipelines();

              } else {

                this.alert.warning(
                  response?.message ||
                  'Unable to delete pipeline setting.'
                );

              }

              this.cd.detectChanges();

            },

            error: (error: any) => {

              this.spinner.hide();

              this.alert.error(
                error?.error?.message ||
                'Failed to delete pipeline setting.'
              );

              this.cd.detectChanges();

            }

          });

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
