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
  selector: 'app-storage-usage',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './storage-usage.html',
  styleUrl: './storage-usage.css',
})
export class StorageUsage implements OnInit {

  private baseUrl = environment.apiUrl;

  submitted = false;

  isEdit = false;

  page = 1;

  pageSize = 5;

  searchText = '';

  storageUsages: any[] = [];

  storageUsage: any = this.getEmptyModel();

  constructor(
    private http: HttpClient,
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  getEmptyModel() {

    return {

      storageUsageId: 0,

      storageName: '',

      storageType: '',

      totalCapacity: null,

      usedCapacity: null,

      availableCapacity: null,

      usagePercentage: null,

      providerName: '',

      description: '',

      isActive: true

    };

  }

  ngOnInit(): void {

    this.loadStorageUsage();

  }

  //====================================================
  // Available capacity and usage % are derived from total / used
  // (the server recalculates them on save as well)
  //====================================================

  calculateUsage(): void {

    const total = Number(this.storageUsage.totalCapacity);

    const used = Number(this.storageUsage.usedCapacity);

    if (
      this.storageUsage.totalCapacity === null ||
      this.storageUsage.usedCapacity === null ||
      !(total > 0) ||
      isNaN(used)
    ) {

      this.storageUsage.availableCapacity = null;

      this.storageUsage.usagePercentage = null;

      return;

    }

    this.storageUsage.availableCapacity = Math.round((total - used) * 100) / 100;

    this.storageUsage.usagePercentage = Math.round((used / total) * 10000) / 100;

  }

  get isUsedExceedingTotal(): boolean {

    return (
      this.storageUsage.totalCapacity !== null &&
      this.storageUsage.usedCapacity !== null &&
      Number(this.storageUsage.usedCapacity) > Number(this.storageUsage.totalCapacity)
    );

  }

  //====================================================
  // Load
  //====================================================

  loadStorageUsage(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getallstorageusages`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.storageUsages = res.data || [];

          } else {

            this.storageUsages = [];

            this.alert.warning(
              res?.message || 'No Storage Usage records found.'
            );

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Load storage usage error:', err);

          this.storageUsages = [];

          this.alert.error(
            err?.error?.message || 'Failed to load Storage Usage records.'
          );

          this.cd.detectChanges();

        }

      });

  }

  //====================================================
  // Save (Create / Update)
  //====================================================

  saveStorageUsage(): void {

    this.submitted = true;

    if (
      !this.storageUsage.storageName?.trim() ||
      !this.storageUsage.storageType ||
      !this.storageUsage.totalCapacity ||
      this.storageUsage.usedCapacity === null ||
      this.storageUsage.usedCapacity === ''
    ) {
      return;
    }

    if (Number(this.storageUsage.totalCapacity) <= 0) {
      this.alert.warning('Total Capacity must be greater than 0.');
      return;
    }

    if (Number(this.storageUsage.usedCapacity) < 0) {
      this.alert.warning('Used Capacity cannot be negative.');
      return;
    }

    if (this.isUsedExceedingTotal) {
      return;
    }

    const payload = {

      storageUsageId: this.storageUsage.storageUsageId,

      storageName: this.storageUsage.storageName.trim(),

      storageType: this.storageUsage.storageType,

      providerName: this.storageUsage.providerName
        ? this.storageUsage.providerName.trim()
        : null,

      totalCapacity: Number(this.storageUsage.totalCapacity),

      usedCapacity: Number(this.storageUsage.usedCapacity),

      availableCapacity: Number(this.storageUsage.availableCapacity) || 0,

      usagePercentage: Number(this.storageUsage.usagePercentage) || 0,

      description: this.storageUsage.description
        ? this.storageUsage.description.trim()
        : null,

      isActive: !!this.storageUsage.isActive

    };

    const url = this.isEdit
      ? `${this.baseUrl}/Admin/updatestorageusage`
      : `${this.baseUrl}/Admin/createstorageusage`;

    const failMessage = this.isEdit
      ? 'Failed to update Storage Usage.'
      : 'Failed to create Storage Usage.';

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

            this.loadStorageUsage();

          } else {

            this.alert.warning(res?.message || failMessage);

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Save storage usage error:', err);

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
      .get<ApiResponse<any>>(`${this.baseUrl}/Admin/getbystorageusage/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.storageUsage = {

              storageUsageId: data.storageUsageId,

              storageName: data.storageName || '',

              storageType: data.storageType || '',

              totalCapacity: data.totalCapacity ?? null,

              usedCapacity: data.usedCapacity ?? null,

              availableCapacity: data.availableCapacity ?? null,

              usagePercentage: data.usagePercentage ?? null,

              providerName: data.providerName || '',

              description: data.description || '',

              isActive: !!data.isActive

            };

            this.isEdit = true;

            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(
              res?.message || 'Storage Usage not found.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get storage usage error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to load Storage Usage.'
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
          `${this.baseUrl}/Admin/deletestorageusage/${id}`,
          {}
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(res.message);

              // Editing the record that was just deleted - reset the form
              if (this.storageUsage.storageUsageId === id) {
                this.clear();
              }

              if (this.page > 1 && this.pagedStorageUsages.length === 1) {
                this.page = this.page - 1;
              }

              this.loadStorageUsage();

            } else {

              this.alert.warning(
                res?.message || 'Failed to delete Storage Usage.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete storage usage error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete Storage Usage.'
            );

          }

        });

    });

  }

  //====================================================
  // Clear
  //====================================================

  clear(): void {

    this.storageUsage = this.getEmptyModel();

    this.submitted = false;

    this.isEdit = false;

    this.cd.detectChanges();

  }

  //====================================================
  // Search / Pagination
  //====================================================

  get filteredStorageUsages() {

    const search = this.searchText.toLowerCase();

    return this.storageUsages.filter(x =>

      (x.storageName || '').toLowerCase().includes(search) ||

      (x.storageType || '').toLowerCase().includes(search) ||

      (x.providerName || '').toLowerCase().includes(search)

    );

  }

  get pagedStorageUsages() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredStorageUsages.slice(
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
