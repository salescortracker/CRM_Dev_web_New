import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { ApiResponse } from '../../../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';
import { Pagination } from '../../../../../shared/pagination/pagination';

@Component({
  selector: 'app-file-upload-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './file-upload-settings.html',
  styleUrl: './file-upload-settings.css',
})
export class FileUploadSettings implements OnInit {

  private baseUrl = environment.apiUrl;

  submitted = false;

  isEdit = false;

  page = 1;

  pageSize = 5;

  searchText = '';

  fileUploadSettings: any[] = [];

  fileUpload: any = this.getEmptyModel();

  constructor(
    private http: HttpClient,
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  getEmptyModel() {

    return {

      fileUploadSettingId: 0,

      settingName: '',

      allowedFileTypes: '',

      maxFileSize: null,

      maxFiles: null,

      storageLocation: '',

      virusScanEnabled: false,

      autoRenameFiles: false,

      description: '',

      isActive: true

    };

  }

  ngOnInit(): void {

    this.loadFileUploadSettings();

  }

  //====================================================
  // Load
  //====================================================

  loadFileUploadSettings(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getallfileuploadsettings`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.fileUploadSettings = res.data || [];

          } else {

            this.fileUploadSettings = [];

            this.alert.warning(
              res?.message || 'No File Upload Settings found.'
            );

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Load file upload settings error:', err);

          this.fileUploadSettings = [];

          this.alert.error(
            err?.error?.message || 'Failed to load File Upload Settings.'
          );

          this.cd.detectChanges();

        }

      });

  }

  //====================================================
  // Save (Create / Update)
  //====================================================

  saveFileUploadSetting(): void {

    this.submitted = true;

    if (
      !this.fileUpload.settingName?.trim() ||
      !this.fileUpload.allowedFileTypes?.trim() ||
      !this.fileUpload.maxFileSize ||
      !this.fileUpload.maxFiles ||
      !this.fileUpload.storageLocation
    ) {
      return;
    }

    if (
      Number(this.fileUpload.maxFileSize) <= 0 ||
      Number(this.fileUpload.maxFiles) <= 0
    ) {
      this.alert.warning(
        'Maximum File Size and Maximum Files must be greater than 0.'
      );
      return;
    }

    const payload = {

      fileUploadSettingId: this.fileUpload.fileUploadSettingId,

      settingName: this.fileUpload.settingName.trim(),

      allowedFileTypes: this.fileUpload.allowedFileTypes.trim(),

      maxFileSize: Number(this.fileUpload.maxFileSize),

      maxFiles: Number(this.fileUpload.maxFiles),

      storageLocation: this.fileUpload.storageLocation,

      virusScanEnabled: !!this.fileUpload.virusScanEnabled,

      autoRenameFiles: !!this.fileUpload.autoRenameFiles,

      description: this.fileUpload.description
        ? this.fileUpload.description.trim()
        : null,

      isActive: !!this.fileUpload.isActive

    };

    const url = this.isEdit
      ? `${this.baseUrl}/Admin/updatefileuploadsetting`
      : `${this.baseUrl}/Admin/createfileuploadsetting`;

    const failMessage = this.isEdit
      ? 'Failed to update File Upload Setting.'
      : 'Failed to create File Upload Setting.';

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

            this.loadFileUploadSettings();

          } else {

            this.alert.warning(res?.message || failMessage);

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Save file upload setting error:', err);

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
      .get<ApiResponse<any>>(`${this.baseUrl}/Admin/getbyfileuploadsetting/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.fileUpload = {

              fileUploadSettingId: data.fileUploadSettingId,

              settingName: data.settingName || '',

              allowedFileTypes: data.allowedFileTypes || '',

              maxFileSize: data.maxFileSize ?? null,

              maxFiles: data.maxFiles ?? null,

              storageLocation: data.storageLocation || '',

              virusScanEnabled: !!data.virusScanEnabled,

              autoRenameFiles: !!data.autoRenameFiles,

              description: data.description || '',

              isActive: !!data.isActive

            };

            this.isEdit = true;

            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(
              res?.message || 'File Upload Setting not found.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get file upload setting error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to load File Upload Setting.'
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
          `${this.baseUrl}/Admin/deletefileuploadsetting/${id}`,
          {}
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(res.message);

              // Editing the record that was just deleted - reset the form
              if (this.fileUpload.fileUploadSettingId === id) {
                this.clear();
              }

              if (this.page > 1 && this.pagedFileUploadSettings.length === 1) {
                this.page = this.page - 1;
              }

              this.loadFileUploadSettings();

            } else {

              this.alert.warning(
                res?.message || 'Failed to delete File Upload Setting.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete file upload setting error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete File Upload Setting.'
            );

          }

        });

    });

  }

  //====================================================
  // Clear
  //====================================================

  clear(): void {

    this.fileUpload = this.getEmptyModel();

    this.submitted = false;

    this.isEdit = false;

    this.cd.detectChanges();

  }

  //====================================================
  // Search / Pagination
  //====================================================

  get filteredFileUploadSettings() {

    const search = this.searchText.toLowerCase();

    return this.fileUploadSettings.filter(x =>

      (x.settingName || '').toLowerCase().includes(search) ||

      (x.allowedFileTypes || '').toLowerCase().includes(search) ||

      (x.storageLocation || '').toLowerCase().includes(search)

    );

  }

  get pagedFileUploadSettings() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredFileUploadSettings.slice(
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
