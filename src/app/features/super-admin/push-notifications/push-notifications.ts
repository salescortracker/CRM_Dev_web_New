import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';

@Component({
  selector: 'app-push-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './push-notifications.html',
  styleUrl: './push-notifications.css',
})
export class PushNotifications implements OnInit {

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

  notificationTypeFilter = '';

  statusFilter = '';


  //====================================================
  // Preview Modal
  //====================================================

  showPreview = false;

  previewTemplate: any = null;


  //====================================================
  // Dropdown Options
  //====================================================

  notificationTypeOptions = [
    'Browser Push',
    'Mobile Push',
    'Desktop Push',
    'Web Push'
  ];

  categoryOptions = [
    'General',
    'Alert',
    'Reminder',
    'Update',
    'Promotion'
  ];

  channelOptions = [
    'FCM',
    'APNs',
    'WebPush',
    'SignalR',
    'In-App'
  ];

  statusOptions = ['Draft', 'Active', 'Inactive', 'Archived'];

  languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'ar', label: 'Arabic' }
  ];


  //====================================================
  // Notification Template List
  //====================================================

  templates: any[] = [];


  //====================================================
  // Form Model
  //====================================================

  template: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      notificationTemplateId: 0,

      templateCode: '',
      templateName: '',
      notificationType: '',
      category: '',
      title: '',
      messageBody: '',
      channel: '',
      languageCode: 'en',
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
  // Load Notification Templates
  //====================================================

  loadTemplates(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/SuperAdmin/getallnotificationtemplate`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.templates = res.data || [];

          } else {

            this.templates = [];

            this.alert.warning(
              res?.message || 'No notification template records found.'
            );

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Error loading notification templates:', err);

          this.templates = [];

          this.alert.error(
            err?.error?.message || 'Failed to load notification templates.'
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
  // Filtered Templates
  //====================================================

  get filteredTemplates() {

    const search = this.searchText.trim().toLowerCase();

    return this.templates.filter(x => {

      const matchSearch =
        !search ||
        (x.templateName || '').toLowerCase().includes(search) ||
        (x.templateCode || '').toLowerCase().includes(search) ||
        (x.title || '').toLowerCase().includes(search) ||
        (x.messageBody || '').toLowerCase().includes(search);

      const matchNotificationType =
        !this.notificationTypeFilter ||
        x.notificationType === this.notificationTypeFilter;

      const matchStatus =
        !this.statusFilter ||
        x.status === this.statusFilter;

      return matchSearch && matchNotificationType && matchStatus;

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
    this.notificationTypeFilter = '';
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

      notificationTemplateId: this.isEdit ? this.template.notificationTemplateId : 0,

      templateCode: this.template.templateCode.trim(),
      templateName: this.template.templateName.trim(),

      notificationType: this.template.notificationType
        ? this.template.notificationType.trim()
        : null,

      category: this.template.category
        ? this.template.category.trim()
        : null,

      title: this.template.title
        ? this.template.title.trim()
        : null,

      messageBody: this.template.messageBody.trim(),

      channel: this.template.channel
        ? this.template.channel.trim()
        : null,

      languageCode: this.template.languageCode
        ? this.template.languageCode.trim()
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
          `${this.baseUrl}/SuperAdmin/updatenotificationtemplate`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Notification Template updated successfully.'
              );

              this.clear();

              this.loadTemplates();

            } else {

              this.alert.warning(
                res?.message || 'Failed to update notification template.'
              );

            }

            this.cd.detectChanges();

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Update notification template error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to update notification template.'
            );

            this.cd.detectChanges();

          }

        });

    } else {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/SuperAdmin/createnotificationtemplate`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Notification Template created successfully.'
              );

              this.clear();

              this.loadTemplates();

            } else {

              this.alert.warning(
                res?.message || 'Failed to create notification template.'
              );

            }

            this.cd.detectChanges();

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Create notification template error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to create notification template.'
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
      .get<ApiResponse<any>>(`${this.baseUrl}/SuperAdmin/getbynotificationtemplate/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.template = {

              notificationTemplateId: data.notificationTemplateId,

              templateCode: data.templateCode || '',
              templateName: data.templateName || '',
              notificationType: data.notificationType || '',
              category: data.category || '',
              title: data.title || '',
              messageBody: data.messageBody || '',
              channel: data.channel || '',
              languageCode: data.languageCode || 'en',
              version: data.version ?? 1,
              status: data.status || 'Draft',
              isActive: data.isActive === true

            };

            this.isEdit = true;
            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'Notification Template not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get notification template error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to load notification template.'
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
          `${this.baseUrl}/SuperAdmin/deletenotificationtemplate/${id}`,
          {}
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Notification Template deleted successfully.'
              );

              this.loadTemplates();

            } else {

              this.alert.warning(
                res?.message || 'Failed to delete notification template.'
              );

            }

            this.cd.detectChanges();

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete notification template error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete notification template.'
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
