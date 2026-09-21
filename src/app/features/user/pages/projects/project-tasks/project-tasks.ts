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
  selector: 'app-project-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './project-tasks.html',
  styleUrl: './project-tasks.css',
})
export class ProjectTasks implements OnInit {

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

  statuses = ['Open', 'In Progress', 'Review', 'Completed', 'Cancelled'];

  //====================================================
  // Dropdown Data (from backend)
  //====================================================

  projects: any[] = [];
  milestones: any[] = [];
  priorities: any[] = [];

  //====================================================
  // Tasks List
  //====================================================

  tasks: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  task: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      taskId: 0,

      taskName: '',
      projectId: null,
      milestoneId: null,

      assignedTo: '',
      priorityId: null,

      status: '',

      startDate: '',
      dueDate: '',

      estimatedHours: null,
      actualHours: null,

      completionPercentage: 0,

      tags: '',
      description: ''

    };

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadProjects();

    this.loadMilestones();

    this.loadPriorities();

    this.loadTasks();

  }

  //====================================================
  // Load Dropdown Data
  //====================================================

  loadProjects(): void {

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getallprojects`)
      .subscribe({

        next: (res: any) => {

          this.projects = res?.data || [];

          this.cd.detectChanges();

        },

        error: (err) => {

          console.error('Error loading projects:', err);

          this.projects = [];

        }

      });

  }

  loadMilestones(): void {

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getallprojectmilestones`)
      .subscribe({

        next: (res: any) => {

          this.milestones = res?.data || [];

          this.cd.detectChanges();

        },

        error: (err) => {

          console.error('Error loading milestones:', err);

          this.milestones = [];

        }

      });

  }

  loadPriorities(): void {

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Master/getallpriority`)
      .subscribe({

        next: (res: any) => {

          this.priorities = (res?.data || []).filter(
            (x: any) => x.isActive !== false
          );

          this.cd.detectChanges();

        },

        error: (err) => {

          console.error('Error loading priorities:', err);

          this.priorities = [];

        }

      });

  }

  //====================================================
  // Load Tasks
  //====================================================

  loadTasks(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getallprojecttasks`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.tasks = res.data || [];

          } else {

            this.tasks = [];

            this.alert.warning(
              res?.message || 'No Task records found.'
            );

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Error loading tasks:', err);

          this.tasks = [];

          this.alert.error(
            err?.error?.message || 'Failed to load tasks.'
          );

          this.cd.detectChanges();

        }

      });

  }

  //====================================================
  // Lookup Helpers (Display Names)
  //====================================================

  getProjectName(id: any): string {

    if (id === null || id === undefined || id === '') return '-';

    const item = this.projects.find(x => x.projectId === Number(id));

    return item ? item.projectName : '-';

  }

  getMilestoneName(id: any): string {

    if (id === null || id === undefined || id === '') return '-';

    const item = this.milestones.find(x => x.milestoneId === Number(id));

    return item ? item.milestoneName : '-';

  }

  getPriorityName(id: any): string {

    if (id === null || id === undefined || id === '') return '-';

    const item = this.priorities.find(x => x.priorityId === Number(id));

    return item ? item.priorityName : '-';

  }

  //====================================================
  // Cascading Milestones (best-effort by matching Project name)
  //====================================================

  get formMilestones(): any[] {

    if (!this.task.projectId) return this.milestones;

    const projectName = this.getProjectName(this.task.projectId);

    return this.milestones.filter(
      x => x.project === projectName
    );

  }

  //====================================================
  // Filtered Tasks
  //====================================================

  get filteredTasks() {

    const search = this.searchText.trim().toLowerCase();

    if (!search) return this.tasks;

    return this.tasks.filter(x =>

      (x.taskName || '').toLowerCase().includes(search) ||
      (x.assignedTo || '').toLowerCase().includes(search) ||
      (x.status || '').toLowerCase().includes(search) ||
      (x.tags || '').toLowerCase().includes(search) ||
      this.getProjectName(x.projectId).toLowerCase().includes(search)

    );

  }

  get pagedTasks() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredTasks.slice(start, start + this.pageSize);

  }

  //====================================================
  // Save / Update
  //====================================================

  saveTask(): void {

    this.submitted = true;

    if (
      !this.task.taskName || !this.task.taskName.trim() ||
      !this.task.projectId ||
      !this.task.assignedTo || !this.task.assignedTo.trim() ||
      !this.task.priorityId ||
      !this.task.status
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    if (
      Number(this.task.completionPercentage) < 0 ||
      Number(this.task.completionPercentage) > 100
    ) {

      this.alert.warning('Completion Percentage must be between 0 and 100.');

      return;

    }

    if (
      this.task.estimatedHours !== null &&
      this.task.estimatedHours !== '' &&
      Number(this.task.estimatedHours) < 0
    ) {

      this.alert.warning('Estimated Hours cannot be negative.');

      return;

    }

    if (
      this.task.actualHours !== null &&
      this.task.actualHours !== '' &&
      Number(this.task.actualHours) < 0
    ) {

      this.alert.warning('Actual Hours cannot be negative.');

      return;

    }

    if (
      this.task.estimatedHours !== null &&
      this.task.estimatedHours !== '' &&
      this.task.actualHours !== null &&
      this.task.actualHours !== '' &&
      Number(this.task.actualHours) > Number(this.task.estimatedHours)
    ) {

      this.alert.warning('Actual Hours cannot exceed Estimated Hours.');

      return;

    }

    if (
      this.task.startDate &&
      this.task.dueDate &&
      this.task.startDate > this.task.dueDate
    ) {

      this.alert.warning('Start Date cannot be after Due Date.');

      return;

    }

    const payload = {

      taskId: this.isEdit ? this.task.taskId : 0,

      taskName: this.task.taskName.trim(),
      projectId: Number(this.task.projectId),

      milestoneId: this.task.milestoneId
        ? Number(this.task.milestoneId)
        : null,

      assignedTo: this.task.assignedTo.trim(),
      priorityId: Number(this.task.priorityId),

      status: this.task.status.trim(),

      startDate: this.task.startDate || null,
      dueDate: this.task.dueDate || null,

      estimatedHours:
        this.task.estimatedHours !== null && this.task.estimatedHours !== ''
          ? Number(this.task.estimatedHours)
          : null,

      actualHours:
        this.task.actualHours !== null && this.task.actualHours !== ''
          ? Number(this.task.actualHours)
          : null,

      completionPercentage: Number(this.task.completionPercentage) || 0,

      tags: this.task.tags ? this.task.tags.trim() : null,

      description: this.task.description
        ? this.task.description.trim()
        : null

    };

    this.spinner.show();

    if (this.isEdit) {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/updateprojecttask`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Project task updated successfully.'
              );

              this.clear();

              this.loadTasks();

            } else {

              this.alert.warning(
                res?.message || 'Failed to update project task.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Update project task error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to update project task.'
            );

          }

        });

    } else {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/createprojecttask`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Project task created successfully.'
              );

              this.clear();

              this.loadTasks();

            } else {

              this.alert.warning(
                res?.message || 'Failed to create project task.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Create project task error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to create project task.'
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
      .get<ApiResponse<any>>(`${this.baseUrl}/Admin/getbyprojecttask/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.task = {

              taskId: data.taskId,

              taskName: data.taskName || '',
              projectId: data.projectId ?? null,
              milestoneId: data.milestoneId ?? null,

              assignedTo: data.assignedTo || '',
              priorityId: data.priorityId ?? null,

              status: data.status || '',

              startDate: data.startDate
                ? data.startDate.substring(0, 10)
                : '',

              dueDate: data.dueDate
                ? data.dueDate.substring(0, 10)
                : '',

              estimatedHours: data.estimatedHours ?? null,
              actualHours: data.actualHours ?? null,

              completionPercentage: data.completionPercentage ?? 0,

              tags: data.tags || '',
              description: data.description || ''

            };

            this.isEdit = true;

            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'Project task not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get project task error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to load project task.'
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
          `${this.baseUrl}/Admin/deleteprojecttask/${id}`,
          {}
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Project task deleted successfully.'
              );

              if (this.page > 1 && this.pagedTasks.length === 1) {
                this.page = this.page - 1;
              }

              this.loadTasks();

            } else {

              this.alert.warning(
                res?.message || 'Failed to delete project task.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete project task error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete project task.'
            );

          }

        });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.task = this.getEmptyModel();

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
