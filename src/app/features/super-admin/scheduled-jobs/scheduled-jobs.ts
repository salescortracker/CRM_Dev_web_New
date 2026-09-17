import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/authentication/services/auth.service';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';
import { Pagination } from '../../../shared/pagination/pagination';

@Component({
  selector: 'app-scheduled-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './scheduled-jobs.html',
  styleUrl: './scheduled-jobs.css',
})
export class ScheduledJobs implements OnInit {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
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

  pageSize = 10;

  searchText = '';

  companyFilter = '';

  statusFilter = '';


  //====================================================
  // Dropdown Data (from backend)
  //====================================================

  companies: any[] = [];

  regions: any[] = [];

  jobTypeOptions = [
    'Backup',
    'Email',
    'Notifications',
    'Reports',
    'Data Synchronization',
    'Cleanup',
    'Subscription'
  ];

  frequencyOptions = [
    'Hourly',
    'Daily',
    'Weekly',
    'Monthly',
    'Custom Cron'
  ];

  dayOfWeekOptions = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];


  //====================================================
  // Scheduled Job List
  //====================================================

  scheduledJobs: any[] = [];


  //====================================================
  // Form Model
  //====================================================

  job: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      scheduledJobId: 0,

      companyId: null,

      regionId: null,

      jobName: '',

      jobType: '',

      description: '',

      frequency: '',

      startDate: '',

      startTime: '',

      repeatEvery: null,

      dayOfWeek: null,

      dayOfMonth: null,

      actionType: '',

      parameters: '',

      retryCount: 3,

      timeoutMinutes: null,

      isActive: true

    };

  }


  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadCompanies();

    this.loadRegions();

    this.loadScheduledJobs();

  }


  //====================================================
  // Load Dropdown Data
  //====================================================

  loadCompanies(): void {

    this.authService.getCompanies().subscribe({

      next: (res: any) => {

        this.companies = (res?.data || []).filter(
          (x: any) => x.isActive !== false
        );

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading companies:', err);

        this.companies = [];

      }

    });

  }

  loadRegions(): void {

    this.authService.getRegions().subscribe({

      next: (res: any) => {

        this.regions = (res?.data || []).filter(
          (x: any) => x.isActive !== false
        );

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading regions:', err);

        this.regions = [];

      }

    });

  }


  //====================================================
  // Load Scheduled Jobs
  //====================================================

  loadScheduledJobs(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(
        `${this.baseUrl}/SuperAdmin/getallscheduledjobs`
      )
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.scheduledJobs = res.data || [];

          } else {

            this.scheduledJobs = [];

            this.alert.warning(
              res?.message || 'No scheduled job records found.'
            );

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Error loading scheduled jobs:', err);

          this.scheduledJobs = [];

          this.alert.error(
            err?.error?.message || 'Failed to load scheduled jobs.'
          );

          this.cd.detectChanges();

        }

      });

  }


  //====================================================
  // Lookup Helpers (Display Names)
  //====================================================

  getCompanyName(id: any): string {

    if (!id) return '-';

    const item = this.companies.find(x => x.companyId === Number(id));

    return item ? item.companyName : '-';

  }

  getRegionName(id: any): string {

    if (!id) return '-';

    const item = this.regions.find(x => x.regionId === Number(id));

    return item ? item.regionName : '-';

  }


  //====================================================
  // Cascading Dropdown
  //====================================================

  get formRegions(): any[] {

    if (!this.job.companyId) return this.regions;

    return this.regions.filter(
      x => x.companyId === Number(this.job.companyId)
    );

  }

  onCompanyChange(): void {

    this.job.regionId = null;

  }


  //====================================================
  // Filtered Scheduled Jobs
  //====================================================

  get filteredScheduledJobs() {

    return this.scheduledJobs.filter(x => {

      const search = this.searchText.trim().toLowerCase();

      const matchSearch =
        !search ||
        (x.jobName || '').toLowerCase().includes(search) ||
        (x.jobType || '').toLowerCase().includes(search) ||
        (x.actionType || '').toLowerCase().includes(search);

      const matchCompany =
        !this.companyFilter ||
        Number(x.companyId) === Number(this.companyFilter);

      const matchStatus =
        this.statusFilter === '' ||
        (this.statusFilter === 'Active' && x.isActive === true) ||
        (this.statusFilter === 'Inactive' && x.isActive === false);

      return matchSearch && matchCompany && matchStatus;

    });

  }


  //====================================================
  // Pagination
  //====================================================

  get pagedScheduledJobs() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredScheduledJobs.slice(start, start + this.pageSize);

  }


  //====================================================
  // Statistics
  //====================================================

  get totalScheduledJobs(): number {

    return this.scheduledJobs.length;

  }

  get activeScheduledJobs(): number {

    return this.scheduledJobs.filter(x => x.isActive === true).length;

  }

  get inactiveScheduledJobs(): number {

    return this.scheduledJobs.filter(x => x.isActive === false).length;

  }


  //====================================================
  // Save / Update
  //====================================================

  saveScheduledJob(): void {

    this.submitted = true;

    if (
      !this.job.companyId ||
      !this.job.regionId ||
      !this.job.jobName ||
      !this.job.jobName.trim() ||
      !this.job.jobType ||
      !this.job.frequency ||
      !this.job.startDate ||
      !this.job.startTime ||
      !this.job.actionType ||
      !this.job.actionType.trim()
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    if (
      this.job.repeatEvery !== null &&
      this.job.repeatEvery !== '' &&
      Number(this.job.repeatEvery) <= 0
    ) {

      this.alert.warning('Repeat Every must be greater than zero.');

      return;

    }

    if (
      this.job.dayOfMonth !== null &&
      this.job.dayOfMonth !== '' &&
      (Number(this.job.dayOfMonth) < 1 || Number(this.job.dayOfMonth) > 31)
    ) {

      this.alert.warning('Day Of Month must be between 1 and 31.');

      return;

    }

    if (
      this.job.retryCount !== null &&
      this.job.retryCount !== '' &&
      Number(this.job.retryCount) < 0
    ) {

      this.alert.warning('Retry Count cannot be negative.');

      return;

    }

    if (
      this.job.timeoutMinutes !== null &&
      this.job.timeoutMinutes !== '' &&
      Number(this.job.timeoutMinutes) <= 0
    ) {

      this.alert.warning('Timeout Minutes must be greater than zero.');

      return;

    }

    const payload = {

      scheduledJobId: this.isEdit ? this.job.scheduledJobId : 0,

      jobName: this.job.jobName.trim(),

      jobType: this.job.jobType,

      description: this.job.description
        ? this.job.description.trim()
        : null,

      frequency: this.job.frequency,

      startDate: this.job.startDate,

      startTime: this.normalizeTime(this.job.startTime),

      repeatEvery:
        this.job.repeatEvery !== null && this.job.repeatEvery !== ''
          ? Number(this.job.repeatEvery)
          : null,

      dayOfWeek: this.job.frequency === 'Weekly' &&
        this.job.dayOfWeek !== null && this.job.dayOfWeek !== ''
        ? Number(this.job.dayOfWeek)
        : null,

      dayOfMonth: this.job.frequency === 'Monthly' &&
        this.job.dayOfMonth !== null && this.job.dayOfMonth !== ''
        ? Number(this.job.dayOfMonth)
        : null,

      actionType: this.job.actionType.trim(),

      parameters: this.job.parameters
        ? this.job.parameters.trim()
        : null,

      retryCount:
        this.job.retryCount !== null && this.job.retryCount !== ''
          ? Number(this.job.retryCount)
          : null,

      timeoutMinutes:
        this.job.timeoutMinutes !== null && this.job.timeoutMinutes !== ''
          ? Number(this.job.timeoutMinutes)
          : null,

      lastRunAt: this.job.lastRunAt || null,

      nextRunAt: this.job.nextRunAt || null,

      lastRunStatus: this.job.lastRunStatus || null,

      companyId: Number(this.job.companyId),

      regionId: Number(this.job.regionId),

      isActive: !!this.job.isActive

    };

    this.spinner.show();

    if (this.isEdit) {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/SuperAdmin/updatescheduledjob`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Scheduled Job updated successfully.'
              );

              this.clear();

              this.loadScheduledJobs();

            } else {

              this.alert.warning(
                res?.message || 'Failed to update scheduled job.'
              );

            }

            this.cd.detectChanges();

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Update scheduled job error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to update scheduled job.'
            );

            this.cd.detectChanges();

          }

        });

    } else {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/SuperAdmin/createscheduledjob`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Scheduled Job created successfully.'
              );

              this.clear();

              this.loadScheduledJobs();

            } else {

              this.alert.warning(
                res?.message || 'Failed to create scheduled job.'
              );

            }

            this.cd.detectChanges();

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Create scheduled job error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to create scheduled job.'
            );

            this.cd.detectChanges();

          }

        });

    }

  }


  //====================================================
  // Time Helper
  // (<input type="time"> gives "HH:mm"; backend TimeOnly
  //  expects "HH:mm:ss")
  //====================================================

  private normalizeTime(value: string): string {

    if (!value) return value;

    return value.length === 5 ? `${value}:00` : value;

  }


  //====================================================
  // Edit
  //====================================================

  edit(id: number): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any>>(
        `${this.baseUrl}/SuperAdmin/getscheduledjobbyid/${id}`
      )
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.job = {

              scheduledJobId: data.scheduledJobId,

              companyId: data.companyId,

              regionId: data.regionId,

              jobName: data.jobName || '',

              jobType: data.jobType || '',

              description: data.description || '',

              frequency: data.frequency || '',

              startDate: data.startDate || '',

              startTime: (data.startTime || '').substring(0, 5),

              repeatEvery: data.repeatEvery ?? null,

              dayOfWeek: data.dayOfWeek ?? null,

              dayOfMonth: data.dayOfMonth ?? null,

              actionType: data.actionType || '',

              parameters: data.parameters || '',

              retryCount: data.retryCount ?? null,

              timeoutMinutes: data.timeoutMinutes ?? null,

              lastRunAt: data.lastRunAt || null,

              nextRunAt: data.nextRunAt || null,

              lastRunStatus: data.lastRunStatus || null,

              isActive: data.isActive === true

            };

            this.isEdit = true;

            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'Scheduled Job not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get scheduled job error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to load scheduled job.'
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
          `${this.baseUrl}/SuperAdmin/deletescheduledjob/${id}`,
          {}
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Scheduled Job deleted successfully.'
              );

              if (this.page > 1 && this.pagedScheduledJobs.length === 1) {
                this.page = this.page - 1;
              }

              this.loadScheduledJobs();

            } else {

              this.alert.warning(
                res?.message || 'Failed to delete scheduled job.'
              );

            }

            this.cd.detectChanges();

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete scheduled job error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete scheduled job.'
            );

            this.cd.detectChanges();

          }

        });

    });

  }


  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.job = this.getEmptyModel();

    this.submitted = false;

    this.isEdit = false;

  }


  //====================================================
  // Clear Filters
  //====================================================

  clearFilters(): void {

    this.searchText = '';

    this.companyFilter = '';

    this.statusFilter = '';

    this.page = 1;

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


  //====================================================
  // Refresh
  //====================================================

  refresh(): void {

    this.page = 1;

    this.loadScheduledJobs();

  }

}
