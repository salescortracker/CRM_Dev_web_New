import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';

@Component({
  selector: 'app-sms-notification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sms-notification.html',
  styleUrl: './sms-notification.css',
})
export class SmsNotification implements OnInit {

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


  //====================================================
  // Search / Filters
  //====================================================

  searchText = '';

  categoryFilter = '';

  statusFilter = '';


  //====================================================
  // Preview Modal
  //====================================================

  showPreview = false;

  previewTemplate: any = null;


  //====================================================
  // Dropdown Options
  //====================================================

  categoryOptions = [
    'OTP',
    'Reminder',
    'Notification',
    'Promotion',
    'Alert'
  ];

  statusOptions = ['Draft', 'Active', 'Inactive', 'Archived'];

  languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'ar', label: 'Arabic' }
  ];

  providerOptions = [
    'Twilio',
    'Nexmo',
    'Plivo',
    'MSG91',
    'AWS SNS',
    'Custom'
  ];


  //====================================================
  // SMS Template List
  //====================================================

  templates: any[] = [];


  //====================================================
  // Form Model
  //====================================================

  template: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      smstemplateId: 0,

      templateCode: '',
      templateName: '',
      category: '',
      messageBody: '',
      characterCount: 0,
      languageCode: 'en',
      providerName: '',
      version: 1,
      status: 'Draft',
      isActive: true

    };

  }


  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadTemplates();

  }


  //====================================================
  // Load SMS Templates
  //====================================================

  loadTemplates(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/SuperAdmin/getallsmsTemplate`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.templates = res.data || [];

          } else {

            this.templates = [];

            this.alert.warning(
              res?.message || 'No SMS template records found.'
            );

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Error loading SMS templates:', err);

          this.templates = [];

          this.alert.error(
            err?.error?.message || 'Failed to load SMS templates.'
          );

          this.cd.detectChanges();

        }

      });

  }


  //====================================================
  // Statistics
  //====================================================

  get totalTemplates(): number {

    return this.templates.length;

  }

  get activeTemplates(): number {

    return this.templates.filter(x => x.isActive === true).length;

  }

  get inactiveTemplates(): number {

    return this.templates.filter(x => x.isActive === false).length;

  }


  //====================================================
  // Live Character Count
  // (backend recalculates this from MessageBody length on
  //  every create/update, this is just for live UX feedback)
  //====================================================

  get liveCharacterCount(): number {

    return (this.template.messageBody || '').length;

  }


  //====================================================
  // Filtered Templates
  //====================================================

  get filteredTemplates() {

    const search = this.searchText.trim().toLowerCase();

    return this.templates.filter(x => {

      const matchSearch =
        !search ||
        (x.templateName || '').toLowerCase().includes(search) ||
        (x.templateCode || '').toLowerCase().includes(search) ||
        (x.messageBody || '').toLowerCase().includes(search);

      const matchCategory =
        !this.categoryFilter ||
        x.category === this.categoryFilter;

      const matchStatus =
        !this.statusFilter ||
        x.status === this.statusFilter;

      return matchSearch && matchCategory && matchStatus;

    });

  }


  //====================================================
  // Refresh
  //====================================================

  refresh(): void {

    this.loadTemplates();

  }


  //====================================================
  // Clear Filters
  //====================================================

  clearFilters(): void {

    this.searchText = '';
    this.categoryFilter = '';
    this.statusFilter = '';

  }


  //====================================================
  // Save / Update
  //====================================================

  saveTemplate(): void {

    this.submitted = true;

    if (
      !this.template.templateCode ||
      !this.template.templateCode.trim() ||
      !this.template.templateName ||
      !this.template.templateName.trim() ||
      !this.template.messageBody ||
      !this.template.messageBody.trim()
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    const payload = {

      smstemplateId: this.isEdit ? this.template.smstemplateId : 0,

      templateCode: this.template.templateCode.trim(),
      templateName: this.template.templateName.trim(),

      category: this.template.category
        ? this.template.category.trim()
        : null,

      messageBody: this.template.messageBody.trim(),

      languageCode: this.template.languageCode
        ? this.template.languageCode.trim()
        : null,

      providerName: this.template.providerName
        ? this.template.providerName.trim()
        : null,

      version: this.template.version
        ? Number(this.template.version)
        : 1,

      status: this.template.status || 'Draft',

      isActive: !!this.template.isActive

    };

    this.spinner.show();

    if (this.isEdit) {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/SuperAdmin/updatesmstemplate`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'SMS Template updated successfully.'
              );

              this.clear();

              this.loadTemplates();

            } else {

              this.alert.warning(
                res?.message || 'Failed to update SMS template.'
              );

            }

            this.cd.detectChanges();

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Update SMS template error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to update SMS template.'
            );

            this.cd.detectChanges();

          }

        });

    } else {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/SuperAdmin/createsmstemplate`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'SMS Template created successfully.'
              );

              this.clear();

              this.loadTemplates();

            } else {

              this.alert.warning(
                res?.message || 'Failed to create SMS template.'
              );

            }

            this.cd.detectChanges();

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Create SMS template error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to create SMS template.'
            );

            this.cd.detectChanges();

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
      .get<ApiResponse<any>>(`${this.baseUrl}/SuperAdmin/getbysmstemplate/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.template = {

              smstemplateId: data.smstemplateId,

              templateCode: data.templateCode || '',
              templateName: data.templateName || '',
              category: data.category || '',
              messageBody: data.messageBody || '',
              characterCount: data.characterCount ?? 0,
              languageCode: data.languageCode || 'en',
              providerName: data.providerName || '',
              version: data.version ?? 1,
              status: data.status || 'Draft',
              isActive: data.isActive === true

            };

            this.isEdit = true;
            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'SMS Template not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get SMS template error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to load SMS template.'
          );

        }

      });

  }


  //====================================================
  // Preview
  //====================================================

  preview(item: any): void {

    this.previewTemplate = item;

    this.showPreview = true;

  }

  closePreview(): void {

    this.showPreview = false;

    this.previewTemplate = null;

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
          `${this.baseUrl}/SuperAdmin/deletesmstemplate/${id}`,
          {}
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'SMS Template deleted successfully.'
              );

              this.loadTemplates();

            } else {

              this.alert.warning(
                res?.message || 'Failed to delete SMS template.'
              );

            }

            this.cd.detectChanges();

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete SMS template error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete SMS template.'
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

    this.template = this.getEmptyModel();

    this.isEdit = false;
    this.submitted = false;

    this.cd.detectChanges();

  }

}
