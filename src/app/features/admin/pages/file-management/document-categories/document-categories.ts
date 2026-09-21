import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { ApiResponse } from '../../../../../core/authentication/services/auth.service';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-document-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './document-categories.html',
  styleUrl: './document-categories.css',
})
export class DocumentCategories implements OnInit {

  private baseUrl = environment.apiUrl;

  submitted = false;

  isEdit = false;

  page = 1;

  pageSize = 5;

  searchText = '';

  documentCategories: any[] = [];

  documentCategory: any = this.getEmptyModel();

  constructor(
    private http: HttpClient,
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  getEmptyModel() {

    return {

      documentCategoryId: 0,

      categoryName: '',

      categoryCode: '',

      parentCategoryId: null,

      allowedFileTypes: '',

      retentionPeriod: null,

      description: '',

      isActive: true

    };

  }

  ngOnInit(): void {

    this.loadDocumentCategories();

  }

  //====================================================
  // Parent Category options - every category except the one being edited
  //====================================================

  get parentCategoryOptions() {

    return this.documentCategories.filter(
      x => x.documentCategoryId !== this.documentCategory.documentCategoryId
    );

  }

  //====================================================
  // Load
  //====================================================

  loadDocumentCategories(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getalldocumentcategories`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.documentCategories = res.data || [];

          } else {

            this.documentCategories = [];

            this.alert.warning(
              res?.message || 'No Document Categories found.'
            );

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Load document categories error:', err);

          this.documentCategories = [];

          this.alert.error(
            err?.error?.message || 'Failed to load Document Categories.'
          );

          this.cd.detectChanges();

        }

      });

  }

  //====================================================
  // Save (Create / Update)
  //====================================================

  saveDocumentCategory(): void {

    this.submitted = true;

    if (
      !this.documentCategory.categoryName?.trim() ||
      !this.documentCategory.categoryCode?.trim() ||
      !this.documentCategory.allowedFileTypes?.trim()
    ) {
      return;
    }

    if (
      this.documentCategory.retentionPeriod !== null &&
      this.documentCategory.retentionPeriod !== '' &&
      Number(this.documentCategory.retentionPeriod) < 0
    ) {
      this.alert.warning('Retention Period cannot be negative.');
      return;
    }

    const payload = {

      documentCategoryId: this.documentCategory.documentCategoryId,

      categoryName: this.documentCategory.categoryName.trim(),

      categoryCode: this.documentCategory.categoryCode.trim(),

      parentCategoryId: this.documentCategory.parentCategoryId
        ? Number(this.documentCategory.parentCategoryId)
        : null,

      allowedFileTypes: this.documentCategory.allowedFileTypes.trim(),

      retentionPeriod:
        this.documentCategory.retentionPeriod !== null &&
        this.documentCategory.retentionPeriod !== ''
          ? Number(this.documentCategory.retentionPeriod)
          : null,

      description: this.documentCategory.description
        ? this.documentCategory.description.trim()
        : null,

      isActive: !!this.documentCategory.isActive

    };

    const url = this.isEdit
      ? `${this.baseUrl}/Admin/updatedocumentcategory`
      : `${this.baseUrl}/Admin/createdocumentcategory`;

    const failMessage = this.isEdit
      ? 'Failed to update Document Category.'
      : 'Failed to create Document Category.';

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

            this.loadDocumentCategories();

          } else {

            this.alert.warning(res?.message || failMessage);

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Save document category error:', err);

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
      .get<ApiResponse<any>>(`${this.baseUrl}/Admin/getbydocumentcategory/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.documentCategory = {

              documentCategoryId: data.documentCategoryId,

              categoryName: data.categoryName || '',

              categoryCode: data.categoryCode || '',

              parentCategoryId: data.parentCategoryId ?? null,

              allowedFileTypes: data.allowedFileTypes || '',

              retentionPeriod: data.retentionPeriod ?? null,

              description: data.description || '',

              isActive: !!data.isActive

            };

            this.isEdit = true;

            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(
              res?.message || 'Document Category not found.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get document category error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to load Document Category.'
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
          `${this.baseUrl}/Admin/deletedocumentcategory/${id}`,
          {}
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(res.message);

              // Editing the record that was just deleted - reset the form
              if (this.documentCategory.documentCategoryId === id) {
                this.clear();
              }

              if (this.page > 1 && this.pagedDocumentCategories.length === 1) {
                this.page = this.page - 1;
              }

              this.loadDocumentCategories();

            } else {

              this.alert.warning(
                res?.message || 'Failed to delete Document Category.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete document category error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete Document Category.'
            );

          }

        });

    });

  }

  //====================================================
  // Clear
  //====================================================

  clear(): void {

    this.documentCategory = this.getEmptyModel();

    this.submitted = false;

    this.isEdit = false;

    this.cd.detectChanges();

  }

  //====================================================
  // Search / Pagination
  //====================================================

  get filteredDocumentCategories() {

    const search = this.searchText.toLowerCase();

    return this.documentCategories.filter(x =>

      (x.categoryName || '').toLowerCase().includes(search) ||

      (x.categoryCode || '').toLowerCase().includes(search) ||

      (x.parentCategory || '').toLowerCase().includes(search) ||

      (x.allowedFileTypes || '').toLowerCase().includes(search)

    );

  }

  get pagedDocumentCategories() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredDocumentCategories.slice(
      start,
      start + this.pageSize
    );

  }

  changePage(page: number) {

    this.page = page;

  }

  changePageSize(size: number) {

    this.pageSize = size;

    this.page = 1;

  }

}
