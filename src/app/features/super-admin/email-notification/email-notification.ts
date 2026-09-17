import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';

@Component({
  selector: 'app-email-notification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './email-notification.html',
  styleUrl: './email-notification.css',
})
export class EmailNotification implements OnInit {

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
    'Registration',
    'Authentication',
    'Sales',
    'Billing',
    'Marketing',
    'Reminder',
    'Support'
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
    'SMTP',
    'Gmail',
    'Outlook',
    'SendGrid',
    'Amazon SES',
    'Mailgun',
    'Custom'
  ];


  //====================================================
  // Email Template List
  //====================================================

  templates: any[] = [];


  //====================================================
  // Form Model
  //====================================================

  template: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      emailTemplateId: 0,

      templateCode: '',
      templateName: '',
      category: '',
      subject: '',
      body: '',
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
  // Load Email Templates
  //====================================================

  loadTemplates(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/SuperAdmin/getallemailtemplate`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.templates = res.data || [];

          } else {

            this.templates = [];

            this.alert.warning(
              res?.message || 'No email template records found.'
            );

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Error loading email templates:', err);

          this.templates = [];

          this.alert.error(
            err?.error?.message || 'Failed to load email templates.'
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
        (x.subject || '').toLowerCase().includes(search);

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
      !this.template.body ||
      !this.template.body.trim()
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    const payload = {

      emailTemplateId: this.isEdit ? this.template.emailTemplateId : 0,

      templateCode: this.template.templateCode.trim(),
      templateName: this.template.templateName.trim(),

      category: this.template.category
        ? this.template.category.trim()
        : null,

      subject: this.template.subject
        ? this.template.subject.trim()
        : null,

      body: this.template.body.trim(),

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
          `${this.baseUrl}/SuperAdmin/updateemailtemplate`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Email Template updated successfully.'
              );

              this.clear();

              this.loadTemplates();

            } else {

              this.alert.warning(
                res?.message || 'Failed to update email template.'
              );

            }

            this.cd.detectChanges();

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Update email template error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to update email template.'
            );

            this.cd.detectChanges();

          }

        });

    } else {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/SuperAdmin/createemailtemplate`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Email Template created successfully.'
              );

              this.clear();

              this.loadTemplates();

            } else {

              this.alert.warning(
                res?.message || 'Failed to create email template.'
              );

            }

            this.cd.detectChanges();

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Create email template error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to create email template.'
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
      .get<ApiResponse<any>>(`${this.baseUrl}/SuperAdmin/getbyidemailtemplate/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.template = {

              emailTemplateId: data.emailTemplateId,

              templateCode: data.templateCode || '',
              templateName: data.templateName || '',
              category: data.category || '',
              subject: data.subject || '',
              body: data.body || '',
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

            this.alert.warning(res?.message || 'Email Template not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get email template error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to load email template.'
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
          `${this.baseUrl}/SuperAdmin/deleteemailtemplate/${id}`,
          {}
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Email Template deleted successfully.'
              );

              this.loadTemplates();

            } else {

              this.alert.warning(
                res?.message || 'Failed to delete email template.'
              );

            }

            this.cd.detectChanges();

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete email template error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete email template.'
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
