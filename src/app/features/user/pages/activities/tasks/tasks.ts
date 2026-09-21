import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { ApiResponse } from '../../../../../core/authentication/services/auth.service';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';
import { nullIfEmpty } from '../activities.util';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {

  private baseUrl = environment.apiUrl;

  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  searchText = '';

  tasks: any[] = [];

  task: any = this.getEmptyModel();

  constructor(
    private http: HttpClient,
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  getEmptyModel() {

    return {

      taskId: 0,
      taskTitle: '',
      taskType: '',
      relatedTo: '',
      customer: '',
      contactPerson: '',
      assignedTo: '',
      startDate: '',
      dueDate: '',
      priority: '',
      progress: 0,
      reminder: '',
      status: '',
      description: '',
      isActive: true

    };

  }

  ngOnInit(): void {

    this.loadTasks();

  }

  //====================================================
  // Load
  //====================================================

  loadTasks(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getallactivitytasks`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.tasks = res.data || [];

          } else {

            this.tasks = [];

            this.alert.warning(res?.message || 'No Tasks found.');

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Load tasks error:', err);

          this.tasks = [];

          this.alert.error(err?.error?.message || 'Failed to load Tasks.');

          this.cd.detectChanges();

        }

      });

  }

  //====================================================
  // Save (Create / Update)
  //====================================================

  saveTask(): void {

    this.submitted = true;

    if (
      !this.task.taskTitle?.trim() ||
      !this.task.taskType ||
      !this.task.assignedTo?.trim() ||
      !this.task.startDate ||
      !this.task.dueDate ||
      !this.task.priority ||
      !this.task.status
    ) {
      return;
    }

    if (this.task.dueDate < this.task.startDate) {
      this.alert.warning('Due Date cannot be earlier than Start Date.');
      return;
    }

    const progress = Number(this.task.progress ?? 0);

    if (isNaN(progress) || progress < 0 || progress > 100) {
      this.alert.warning('Progress must be between 0 and 100.');
      return;
    }

    const payload = {

      taskId: this.task.taskId,
      taskTitle: this.task.taskTitle.trim(),
      taskType: this.task.taskType,
      relatedTo: nullIfEmpty(this.task.relatedTo),
      customer: nullIfEmpty(this.task.customer),
      contactPerson: nullIfEmpty(this.task.contactPerson),
      assignedTo: this.task.assignedTo.trim(),
      startDate: this.task.startDate,
      dueDate: this.task.dueDate,
      priority: this.task.priority,
      progress: progress,
      reminder: nullIfEmpty(this.task.reminder),
      status: this.task.status,
      description: nullIfEmpty(this.task.description),
      isActive: !!this.task.isActive

    };

    const url = this.isEdit
      ? `${this.baseUrl}/Admin/updateactivitytask`
      : `${this.baseUrl}/Admin/createactivitytask`;

    const failMessage = this.isEdit
      ? 'Failed to update Task.'
      : 'Failed to create Task.';

    this.spinner.show();

    this.http
      .post<ApiResponse>(url, payload)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(res.message);

            this.clear();

            this.page = 1;

            this.loadTasks();

          } else {

            this.alert.warning(res?.message || failMessage);

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Save task error:', err);

          this.alert.error(err?.error?.message || failMessage);

        }

      });

  }

  //====================================================
  // Edit
  //====================================================

  edit(id: number): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any>>(`${this.baseUrl}/Admin/getbyactivitytask/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.task = {

              taskId: data.taskId,
              taskTitle: data.taskTitle || '',
              taskType: data.taskType || '',
              relatedTo: data.relatedTo || '',
              customer: data.customer || '',
              contactPerson: data.contactPerson || '',
              assignedTo: data.assignedTo || '',
              startDate: data.startDate || '',
              dueDate: data.dueDate || '',
              priority: data.priority || '',
              progress: data.progress ?? 0,
              reminder: data.reminder || '',
              status: data.status || '',
              description: data.description || '',
              isActive: !!data.isActive

            };

            this.isEdit = true;

            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'Task not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get task error:', err);

          this.alert.error(err?.error?.message || 'Failed to load Task.');

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
        .post<ApiResponse>(`${this.baseUrl}/Admin/deleteactivitytask/${id}`, {})
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(res.message);

              // Editing the record that was just deleted - reset the form
              if (this.task.taskId === id) {
                this.clear();
              }

              if (this.page > 1 && this.pagedTasks.length === 1) {
                this.page = this.page - 1;
              }

              this.loadTasks();

            } else {

              this.alert.warning(res?.message || 'Failed to delete Task.');

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete task error:', err);

            this.alert.error(err?.error?.message || 'Failed to delete Task.');

          }

        });

    });

  }

  //====================================================
  // Clear
  //====================================================

  clear(): void {

    this.task = this.getEmptyModel();

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  //====================================================
  // Search / Pagination
  //====================================================

  get filteredTasks() {

    const search = this.searchText.toLowerCase();

    return this.tasks.filter(x =>

      (x.taskTitle || '').toLowerCase().includes(search) ||

      (x.taskType || '').toLowerCase().includes(search) ||

      (x.customer || '').toLowerCase().includes(search) ||

      (x.assignedTo || '').toLowerCase().includes(search) ||

      (x.priority || '').toLowerCase().includes(search) ||

      (x.status || '').toLowerCase().includes(search)

    );

  }

  get pagedTasks() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredTasks.slice(start, start + this.pageSize);

  }

  changePage(page: number) {

    this.page = page;

  }

  changePageSize(size: number) {

    this.pageSize = size;

    this.page = 1;

  }

}
