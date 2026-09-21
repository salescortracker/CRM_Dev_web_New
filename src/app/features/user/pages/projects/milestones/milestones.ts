import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { ApiResponse } from '../../../../../core/authentication/services/auth.service';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-milestones',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './milestones.html',
  styleUrl: './milestones.css',
})
export class Milestones implements OnInit {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  //====================================================
  // Screen Variables
  //====================================================

  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  searchText = '';

  //====================================================
  // Static Options
  //====================================================

  projectOptions = [
    'CRM Implementation', 'ERP Integration', 'Support Portal',
    'Data Migration', 'Internal HR Portal'
  ];

  statuses = ['Pending', 'In Progress', 'Completed', 'Delayed'];

  priorities = ['Low', 'Medium', 'High', 'Critical'];

  //====================================================
  // Milestones List
  //====================================================

  milestones: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  milestone: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      milestoneId: 0,

      milestoneName: '',
      project: '',
      owner: null,

      dueDate: '',

      status: '',
      completionPercentage: 0,

      estimatedHours: null,
      actualHours: null,

      priority: '',
      targetDate: '',

      description: ''

    };

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadMilestones();

  }

  //====================================================
  // Load Milestones
  //====================================================

  loadMilestones(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getallprojectmilestones`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.milestones = res.data || [];

          } else {

            this.milestones = [];

            this.alert.warning(
              res?.message || 'No Milestone records found.'
            );

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Error loading milestones:', err);

          this.milestones = [];

          this.alert.error(
            err?.error?.message || 'Failed to load milestones.'
          );

          this.cd.detectChanges();

        }

      });

  }

  //====================================================
  // Filtered Milestones
  //====================================================

  get filteredMilestones() {

    const search = this.searchText.trim().toLowerCase();

    if (!search) return this.milestones;

    return this.milestones.filter(x =>

      (x.milestoneName || '').toLowerCase().includes(search) ||
      (x.project || '').toLowerCase().includes(search) ||
      (x.priority || '').toLowerCase().includes(search) ||
      (x.status || '').toLowerCase().includes(search)

    );

  }

  get pagedMilestones() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredMilestones.slice(start, start + this.pageSize);

  }

  //====================================================
  // Save / Update
  //====================================================

  saveMilestone(): void {

    this.submitted = true;

    if (
      !this.milestone.milestoneName || !this.milestone.milestoneName.trim() ||
      !this.milestone.project ||
      !this.milestone.status ||
      !this.milestone.priority
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    if (
      Number(this.milestone.completionPercentage) < 0 ||
      Number(this.milestone.completionPercentage) > 100
    ) {

      this.alert.warning('Completion Percentage must be between 0 and 100.');

      return;

    }

    if (
      this.milestone.estimatedHours !== null &&
      this.milestone.estimatedHours !== '' &&
      Number(this.milestone.estimatedHours) < 0
    ) {

      this.alert.warning('Estimated Hours cannot be negative.');

      return;

    }

    if (
      this.milestone.actualHours !== null &&
      this.milestone.actualHours !== '' &&
      Number(this.milestone.actualHours) < 0
    ) {

      this.alert.warning('Actual Hours cannot be negative.');

      return;

    }

    if (
      this.milestone.estimatedHours !== null &&
      this.milestone.estimatedHours !== '' &&
      this.milestone.actualHours !== null &&
      this.milestone.actualHours !== '' &&
      Number(this.milestone.actualHours) > Number(this.milestone.estimatedHours)
    ) {

      this.alert.warning('Actual Hours cannot exceed Estimated Hours.');

      return;

    }

    if (
      this.milestone.dueDate &&
      this.milestone.targetDate &&
      this.milestone.dueDate > this.milestone.targetDate
    ) {

      this.alert.warning('Due Date cannot be after Target Date.');

      return;

    }

    const payload = {

      milestoneId: this.isEdit ? this.milestone.milestoneId : 0,

      milestoneName: this.milestone.milestoneName.trim(),
      project: this.milestone.project.trim(),

      owner: this.milestone.owner
        ? Number(this.milestone.owner)
        : null,

      dueDate: this.milestone.dueDate || null,

      status: this.milestone.status.trim(),
      completionPercentage: Number(this.milestone.completionPercentage) || 0,

      estimatedHours:
        this.milestone.estimatedHours !== null &&
          this.milestone.estimatedHours !== ''
          ? Number(this.milestone.estimatedHours)
          : null,

      actualHours:
        this.milestone.actualHours !== null &&
          this.milestone.actualHours !== ''
          ? Number(this.milestone.actualHours)
          : null,

      priority: this.milestone.priority.trim(),

      targetDate: this.milestone.targetDate || null,

      description: this.milestone.description
        ? this.milestone.description.trim()
        : null

    };

    this.spinner.show();

    if (this.isEdit) {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/updateprojectmilestone`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Milestone updated successfully.'
              );

              this.clear();

              this.loadMilestones();

            } else {

              this.alert.warning(
                res?.message || 'Failed to update milestone.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Update milestone error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to update milestone.'
            );

          }

        });

    } else {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/createprojectmilestone`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Milestone created successfully.'
              );

              this.clear();

              this.loadMilestones();

            } else {

              this.alert.warning(
                res?.message || 'Failed to create milestone.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Create milestone error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to create milestone.'
            );

          }

        });

    }

  }

  //====================================================
  // Edit
  //====================================================

  edit(id: number): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any>>(`${this.baseUrl}/Admin/getbyprojectmilestone/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.milestone = {

              milestoneId: data.milestoneId,

              milestoneName: data.milestoneName || '',
              project: data.project || '',
              owner: data.owner ?? null,

              dueDate: data.dueDate
                ? data.dueDate.substring(0, 10)
                : '',

              status: data.status || '',
              completionPercentage: data.completionPercentage ?? 0,

              estimatedHours: data.estimatedHours ?? null,
              actualHours: data.actualHours ?? null,

              priority: data.priority || '',

              targetDate: data.targetDate
                ? data.targetDate.substring(0, 10)
                : '',

              description: data.description || ''

            };

            this.isEdit = true;

            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'Milestone not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get milestone error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to load milestone.'
          );

        }

      });

  }

  //====================================================
  // Delete
  //====================================================

  delete(id: number): void {

    this.alert.deleteConfirm().then(result => {

      if (!result.isConfirmed) return;

      this.spinner.show();

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/deleteprojectmilestone/${id}`,
          {}
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Milestone deleted successfully.'
              );

              if (this.page > 1 && this.pagedMilestones.length === 1) {
                this.page = this.page - 1;
              }

              this.loadMilestones();

            } else {

              this.alert.warning(
                res?.message || 'Failed to delete milestone.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete milestone error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete milestone.'
            );

          }

        });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.milestone = this.getEmptyModel();

    this.isEdit = false;

    this.submitted = false;

  }

  //====================================================
  // Pagination
  //====================================================

  changePage(page: number): void {

    this.page = page;

  }

  changePageSize(size: number): void {

    this.pageSize = size;

    this.page = 1;

  }

}
