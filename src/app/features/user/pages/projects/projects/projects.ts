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
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {

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

  customers = [
    'ABC Technologies', 'XYZ Solutions', 'Global Systems',
    'TechNova Pvt Ltd', 'Sunrise Industries'
  ];

  projectTypes = [
    'CRM Implementation', 'Product Development', 'Internal Project',
    'Support Project', 'Migration', 'Integration'
  ];

  priorities = ['Low', 'Medium', 'High', 'Critical'];

  statuses = ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];

  //====================================================
  // Projects List
  //====================================================

  projects: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  project: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      projectId: 0,

      projectCode: this.generateNextProjectCode(),

      projectName: '',
      customer: '',
      projectManager: null,
      projectType: '',

      priority: '',
      status: '',

      startDate: '',
      endDate: '',

      budget: null,
      completionPercentage: 0,

      teamMembers: '',
      projectDescription: ''

    };

  }

  //====================================================
  // Project Code Helper
  //====================================================

  generateNextProjectCode(): string {

    const maxNumber = this.projects.reduce((max, x) => {

      const match = /PRJ-(\d+)/.exec(x.projectCode || '');

      const num = match ? Number(match[1]) : 0;

      return num > max ? num : max;

    }, 1000);

    return 'PRJ-' + (maxNumber + 1);

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadProjects();

  }

  //====================================================
  // Load Projects
  //====================================================

  loadProjects(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getallprojects`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.projects = res.data || [];

          } else {

            this.projects = [];

            this.alert.warning(
              res?.message || 'No Project records found.'
            );

          }

          this.project.projectCode = this.generateNextProjectCode();

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Error loading projects:', err);

          this.projects = [];

          this.alert.error(
            err?.error?.message || 'Failed to load projects.'
          );

          this.cd.detectChanges();

        }

      });

  }

  //====================================================
  // Filtered Projects
  //====================================================

  get filteredProjects() {

    const search = this.searchText.trim().toLowerCase();

    if (!search) return this.projects;

    return this.projects.filter(x =>

      (x.projectCode || '').toLowerCase().includes(search) ||
      (x.projectName || '').toLowerCase().includes(search) ||
      (x.customer || '').toLowerCase().includes(search) ||
      (x.projectType || '').toLowerCase().includes(search) ||
      (x.priority || '').toLowerCase().includes(search) ||
      (x.status || '').toLowerCase().includes(search)

    );

  }

  get pagedProjects() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredProjects.slice(start, start + this.pageSize);

  }

  //====================================================
  // Save / Update
  //====================================================

  saveProject(): void {

    this.submitted = true;

    if (
      !this.project.projectCode || !this.project.projectCode.trim() ||
      !this.project.projectName || !this.project.projectName.trim() ||
      !this.project.customer ||
      !this.project.projectManager ||
      !this.project.projectType ||
      !this.project.priority ||
      !this.project.status ||
      !this.project.startDate ||
      !this.project.endDate
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    if (this.project.endDate < this.project.startDate) {

      this.alert.warning('End Date cannot be earlier than Start Date.');

      return;

    }

    if (
      this.project.budget !== null &&
      this.project.budget !== '' &&
      Number(this.project.budget) < 0
    ) {

      this.alert.warning('Budget cannot be negative.');

      return;

    }

    if (
      Number(this.project.completionPercentage) < 0 ||
      Number(this.project.completionPercentage) > 100
    ) {

      this.alert.warning('Completion Percentage must be between 0 and 100.');

      return;

    }

    const payload = {

      projectId: this.isEdit ? this.project.projectId : 0,

      projectCode: this.project.projectCode.trim(),
      projectName: this.project.projectName.trim(),

      customer: this.project.customer
        ? this.project.customer.trim()
        : null,

      projectManager: this.project.projectManager
        ? Number(this.project.projectManager)
        : null,

      projectType: this.project.projectType
        ? this.project.projectType.trim()
        : null,

      priority: this.project.priority.trim(),
      status: this.project.status.trim(),

      startDate: this.project.startDate || null,
      endDate: this.project.endDate || null,

      budget:
        this.project.budget !== null && this.project.budget !== ''
          ? Number(this.project.budget)
          : null,

      completionPercentage: Number(this.project.completionPercentage) || 0,

      teamMembers: this.project.teamMembers
        ? this.project.teamMembers.trim()
        : null,

      projectDescription: this.project.projectDescription
        ? this.project.projectDescription.trim()
        : null

    };

    this.spinner.show();

    if (this.isEdit) {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/updateproject`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Project updated successfully.'
              );

              this.clear();

              this.loadProjects();

            } else {

              this.alert.warning(
                res?.message || 'Failed to update project.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Update project error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to update project.'
            );

          }

        });

    } else {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/createproject`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Project created successfully.'
              );

              this.clear();

              this.loadProjects();

            } else {

              this.alert.warning(
                res?.message || 'Failed to create project.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Create project error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to create project.'
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
      .get<ApiResponse<any>>(`${this.baseUrl}/Admin/getbyproject/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.project = {

              projectId: data.projectId,

              projectCode: data.projectCode || '',
              projectName: data.projectName || '',
              customer: data.customer || '',
              projectManager: data.projectManager ?? null,
              projectType: data.projectType || '',

              priority: data.priority || '',
              status: data.status || '',

              startDate: data.startDate
                ? data.startDate.substring(0, 10)
                : '',

              endDate: data.endDate
                ? data.endDate.substring(0, 10)
                : '',

              budget: data.budget ?? null,
              completionPercentage: data.completionPercentage ?? 0,

              teamMembers: data.teamMembers || '',
              projectDescription: data.projectDescription || ''

            };

            this.isEdit = true;

            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'Project not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get project error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to load project.'
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
          `${this.baseUrl}/Admin/deleteproject/${id}`,
          {}
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Project deleted successfully.'
              );

              if (this.page > 1 && this.pagedProjects.length === 1) {
                this.page = this.page - 1;
              }

              this.loadProjects();

            } else {

              this.alert.warning(
                res?.message || 'Failed to delete project.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete project error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete project.'
            );

          }

        });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.project = this.getEmptyModel();

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
