import { CommonModule } from '@angular/common';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { ApiResponse } from '../../../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-timesheet',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './timesheet.html',
  styleUrl: './timesheet.css',
})
export class Timesheet implements OnInit {

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

  billingTypes = ['Billable', 'Non Billable'];

  statuses = ['Draft', 'Submitted', 'Approved', 'Rejected'];

  //====================================================
  // Dropdown Data (from backend)
  //====================================================

  projects: any[] = [];
  tasks: any[] = [];

  //====================================================
  // Timesheets List
  //====================================================

  timesheets: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  timesheet: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      timesheetId: 0,

      employeeId: null,
      projectId: null,
      taskId: null,

      timesheetDate: '',

      startTime: '',
      endTime: '',

      totalHours: 0,

      billingType: '',
      status: '',

      approvedBy: null,

      workDescription: ''

    };

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadProjects();

    this.loadTasks();

    this.loadTimesheets();

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

  loadTasks(): void {

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getallprojecttasks`)
      .subscribe({

        next: (res: any) => {

          this.tasks = res?.data || [];

          this.cd.detectChanges();

        },

        error: (err) => {

          console.error('Error loading tasks:', err);

          this.tasks = [];

        }

      });

  }

  //====================================================
  // Cascading Tasks (by selected Project)
  //====================================================

  get formTasks(): any[] {

    if (!this.timesheet.projectId) return [];

    return this.tasks.filter(
      x => Number(x.projectId) === Number(this.timesheet.projectId)
    );

  }

  onProjectChange(): void {

    this.timesheet.taskId = null;

  }

  //====================================================
  // Total Hours Calculation
  //====================================================

  computeTotalHours(): void {

    if (this.timesheet.startTime && this.timesheet.endTime) {

      const [startHour, startMin] = this.timesheet.startTime.split(':').map(Number);
      const [endHour, endMin] = this.timesheet.endTime.split(':').map(Number);

      const startMinutes = (startHour * 60) + startMin;
      const endMinutes = (endHour * 60) + endMin;

      const diffMinutes = endMinutes - startMinutes;

      this.timesheet.totalHours = diffMinutes > 0
        ? Math.round((diffMinutes / 60) * 100) / 100
        : 0;

    }

  }

  //====================================================
  // Load Timesheets
  //====================================================

  loadTimesheets(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getalltimesheets`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.timesheets = res.data || [];

          } else {

            this.timesheets = [];

            this.alert.warning(
              res?.message || 'No Timesheet records found.'
            );

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Error loading timesheets:', err);

          this.timesheets = [];

          this.alert.error(
            err?.error?.message || 'Failed to load timesheets.'
          );

          this.cd.detectChanges();

        }

      });

  }

  //====================================================
  // Lookup Helpers
  //====================================================

  getProjectName(id: any): string {

    if (id === null || id === undefined || id === '') return '-';

    const item = this.projects.find(x => x.projectId === Number(id));

    return item ? item.projectName : '-';

  }

  getTaskName(id: any): string {

    if (id === null || id === undefined || id === '') return '-';

    const item = this.tasks.find(x => x.taskId === Number(id));

    return item ? item.taskName : '-';

  }

  //====================================================
  // Filtered Timesheets
  //====================================================

  get filteredTimesheets() {

    const search = this.searchText.trim().toLowerCase();

    if (!search) return this.timesheets;

    return this.timesheets.filter(x =>

      (x.billingType || '').toLowerCase().includes(search) ||
      (x.status || '').toLowerCase().includes(search) ||
      this.getProjectName(x.projectId).toLowerCase().includes(search) ||
      this.getTaskName(x.taskId).toLowerCase().includes(search)

    );

  }

  get pagedTimesheets() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredTimesheets.slice(start, start + this.pageSize);

  }

  //====================================================
  // Save / Update
  //====================================================

  saveTimesheet(): void {

    this.submitted = true;

    if (
      !this.timesheet.employeeId ||
      !this.timesheet.projectId ||
      !this.timesheet.timesheetDate ||
      !this.timesheet.billingType ||
      !this.timesheet.status
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    if (Number(this.timesheet.totalHours) < 0) {

      this.alert.warning('Total Hours cannot be negative.');

      return;

    }

    if (
      this.timesheet.startTime &&
      this.timesheet.endTime &&
      this.timesheet.startTime >= this.timesheet.endTime
    ) {

      this.alert.warning('Start Time must be earlier than End Time.');

      return;

    }

    if (this.timesheet.startTime && this.timesheet.endTime) {
      this.computeTotalHours();
    }

    const payload = {

      timesheetId: this.isEdit ? this.timesheet.timesheetId : 0,

      employeeId: Number(this.timesheet.employeeId),
      projectId: Number(this.timesheet.projectId),

      taskId: this.timesheet.taskId
        ? Number(this.timesheet.taskId)
        : null,

      timesheetDate: this.timesheet.timesheetDate,

      startTime: this.timesheet.startTime
        ? this.timesheet.startTime + ':00'
        : null,

      endTime: this.timesheet.endTime
        ? this.timesheet.endTime + ':00'
        : null,

      totalHours: Number(this.timesheet.totalHours) || 0,

      billingType: this.timesheet.billingType.trim(),
      status: this.timesheet.status.trim(),

      approvedBy: this.timesheet.approvedBy
        ? Number(this.timesheet.approvedBy)
        : null,

      workDescription: this.timesheet.workDescription
        ? this.timesheet.workDescription.trim()
        : null

    };

    this.spinner.show();

    if (this.isEdit) {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/updatetimesheet`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Timesheet updated successfully.'
              );

              this.clear();

              this.loadTimesheets();

            } else {

              this.alert.warning(
                res?.message || 'Failed to update timesheet.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Update timesheet error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to update timesheet.'
            );

          }

        });

    } else {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/createtimesheet`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Timesheet created successfully.'
              );

              this.clear();

              this.loadTimesheets();

            } else {

              this.alert.warning(
                res?.message || 'Failed to create timesheet.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Create timesheet error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to create timesheet.'
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
      .get<ApiResponse<any>>(`${this.baseUrl}/Admin/getbytimesheet/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.timesheet = {

              timesheetId: data.timesheetId,

              employeeId: data.employeeId ?? null,
              projectId: data.projectId ?? null,
              taskId: data.taskId ?? null,

              timesheetDate: data.timesheetDate
                ? data.timesheetDate.substring(0, 10)
                : '',

              startTime: data.startTime
                ? data.startTime.substring(0, 5)
                : '',

              endTime: data.endTime
                ? data.endTime.substring(0, 5)
                : '',

              totalHours: data.totalHours ?? 0,

              billingType: data.billingType || '',
              status: data.status || '',

              approvedBy: data.approvedBy ?? null,

              workDescription: data.workDescription || ''

            };

            this.isEdit = true;

            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'Timesheet not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get timesheet error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to load timesheet.'
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
          `${this.baseUrl}/Admin/deletetimesheet/${id}`,
          {}
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Timesheet deleted successfully.'
              );

              if (this.page > 1 && this.pagedTimesheets.length === 1) {
                this.page = this.page - 1;
              }

              this.loadTimesheets();

            } else {

              this.alert.warning(
                res?.message || 'Failed to delete timesheet.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete timesheet error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete timesheet.'
            );

          }

        });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.timesheet = this.getEmptyModel();

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
