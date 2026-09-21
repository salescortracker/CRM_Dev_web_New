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
  selector: 'app-project-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './project-documents.html',
  styleUrl: './project-documents.css',
})
export class ProjectDocuments implements OnInit {

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

  selectedFileName = '';

  //====================================================
  // Static Options
  //====================================================

  categories = [
    'Proposal', 'Requirement Document', 'Design', 'Contract',
    'Invoice', 'User Manual', 'Testing', 'Deployment'
  ];

  statuses = ['Draft', 'Active', 'Archived'];

  //====================================================
  // Dropdown Data (from backend)
  //====================================================

  projects: any[] = [];

  //====================================================
  // Documents List
  //====================================================

  documents: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  document: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      documentId: 0,

      documentName: '',
      projectId: null,

      category: '',
      version: '',

      uploadedBy: null,
      uploadDate: '',

      uploadFile: '',
      fileSizeKb: null,
      fileType: '',

      description: '',
      status: ''

    };

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadProjects();

    this.loadDocuments();

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

  //====================================================
  // File Selection (metadata only — no upload endpoint)
  //====================================================

  onFileSelected(event: any): void {

    if (event.target.files.length > 0) {

      const file = event.target.files[0];

      this.selectedFileName = file.name;

      this.document.uploadFile = file.name;

      this.document.fileSizeKb = Math.round(file.size / 1024);

      const extension = file.name.split('.').pop();

      this.document.fileType = extension ? extension.toUpperCase() : '';

    }

  }

  //====================================================
  // Load Documents
  //====================================================

  loadDocuments(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getallprojectdocuments`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.documents = res.data || [];

          } else {

            this.documents = [];

            this.alert.warning(
              res?.message || 'No Document records found.'
            );

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Error loading documents:', err);

          this.documents = [];

          this.alert.error(
            err?.error?.message || 'Failed to load documents.'
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

  //====================================================
  // Filtered Documents
  //====================================================

  get filteredDocuments() {

    const search = this.searchText.trim().toLowerCase();

    if (!search) return this.documents;

    return this.documents.filter(x =>

      (x.documentName || '').toLowerCase().includes(search) ||
      (x.category || '').toLowerCase().includes(search) ||
      (x.version || '').toLowerCase().includes(search) ||
      (x.uploadFile || '').toLowerCase().includes(search) ||
      this.getProjectName(x.projectId).toLowerCase().includes(search)

    );

  }

  get pagedDocuments() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredDocuments.slice(start, start + this.pageSize);

  }

  //====================================================
  // Save / Update
  //====================================================

  saveDocument(): void {

    this.submitted = true;

    if (
      !this.document.documentName || !this.document.documentName.trim() ||
      !this.document.projectId ||
      !this.document.status
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    if (
      this.document.fileSizeKb !== null &&
      this.document.fileSizeKb !== '' &&
      Number(this.document.fileSizeKb) < 0
    ) {

      this.alert.warning('File Size cannot be negative.');

      return;

    }

    const payload = {

      documentId: this.isEdit ? this.document.documentId : 0,

      documentName: this.document.documentName.trim(),
      projectId: Number(this.document.projectId),

      category: this.document.category
        ? this.document.category.trim()
        : null,

      version: this.document.version
        ? this.document.version.trim()
        : null,

      uploadedBy: this.document.uploadedBy
        ? Number(this.document.uploadedBy)
        : null,

      uploadDate: this.document.uploadDate || new Date().toISOString(),

      uploadFile: this.document.uploadFile
        ? this.document.uploadFile.trim()
        : null,

      fileSizeKb:
        this.document.fileSizeKb !== null && this.document.fileSizeKb !== ''
          ? Number(this.document.fileSizeKb)
          : null,

      fileType: this.document.fileType
        ? this.document.fileType.trim()
        : null,

      description: this.document.description
        ? this.document.description.trim()
        : null,

      status: this.document.status.trim()

    };

    this.spinner.show();

    if (this.isEdit) {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/updateprojectdocument`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Project document updated successfully.'
              );

              this.clear();

              this.loadDocuments();

            } else {

              this.alert.warning(
                res?.message || 'Failed to update project document.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Update project document error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to update project document.'
            );

          }

        });

    } else {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/createprojectdocument`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Project document created successfully.'
              );

              this.clear();

              this.loadDocuments();

            } else {

              this.alert.warning(
                res?.message || 'Failed to create project document.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Create project document error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to create project document.'
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
      .get<ApiResponse<any>>(`${this.baseUrl}/Admin/getbyprojectdocument/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.document = {

              documentId: data.documentId,

              documentName: data.documentName || '',
              projectId: data.projectId ?? null,

              category: data.category || '',
              version: data.version || '',

              uploadedBy: data.uploadedBy ?? null,

              uploadDate: data.uploadDate
                ? data.uploadDate.substring(0, 10)
                : '',

              uploadFile: data.uploadFile || '',
              fileSizeKb: data.fileSizeKb ?? null,
              fileType: data.fileType || '',

              description: data.description || '',
              status: data.status || ''

            };

            this.selectedFileName = data.uploadFile || '';

            this.isEdit = true;

            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'Project document not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get project document error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to load project document.'
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
          `${this.baseUrl}/Admin/deleteprojectdocument/${id}`,
          {}
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Project document deleted successfully.'
              );

              if (this.page > 1 && this.pagedDocuments.length === 1) {
                this.page = this.page - 1;
              }

              this.loadDocuments();

            } else {

              this.alert.warning(
                res?.message || 'Failed to delete project document.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete project document error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete project document.'
            );

          }

        });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.document = this.getEmptyModel();

    this.selectedFileName = '';

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
