import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';

@Component({
  selector: 'app-whatsapp-notification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './whatsapp-notification.html',
  styleUrl: './whatsapp-notification.css',
})
export class WhatsappNotification implements OnInit {

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

  approvalStatusFilter = '';


  //====================================================
  // Preview Modal
  //====================================================

  showPreview = false;

  previewTemplate: any = null;


  //====================================================
  // Dropdown Options
  //====================================================

  categoryOptions = ['Authentication', 'Utility', 'Marketing'];

  approvalStatusOptions = ['Pending', 'Approved', 'Rejected'];

  statusOptions = ['Draft', 'Active', 'Inactive', 'Archived'];

  languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'te', label: 'Telugu' },
    { value: 'ta', label: 'Tamil' },
    { value: 'es', label: 'Spanish' },
    { value: 'ar', label: 'Arabic' }
  ];

  providerOptions = [
    'Twilio',
    'Meta Cloud API',
    'Gupshup',
    'MSG91',
    '360Dialog',
    'Custom'
  ];


  //====================================================
  // WhatsApp Template List
  //====================================================

  templates: any[] = [];


  //====================================================
  // Form Model
  //====================================================

  template: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      whatsAppTemplateId: 0,

      templateCode: '',
      templateName: '',
      category: '',
      languageCode: 'en',
      providerName: 'Twilio',
      templateSid: '',
      headerText: '',
      bodyText: '',
      footerText: '',
      approvalStatus: 'Pending',
      rejectionReason: '',
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
  // Load WhatsApp Templates
  //====================================================

  loadTemplates(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/SuperAdmin/getallwhatsapptemplate`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.templates = res.data || [];

          } else {

            this.templates = [];

            this.alert.warning(
              res?.message || 'No WhatsApp template records found.'
            );

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Error loading WhatsApp templates:', err);

          this.templates = [];

          this.alert.error(
            err?.error?.message || 'Failed to load WhatsApp templates.'
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

  get approvedTemplates(): number {

    return this.templates.filter(x => x.approvalStatus === 'Approved').length;

  }

  get pendingTemplates(): number {

    return this.templates.filter(x => x.approvalStatus === 'Pending').length;

  }

  get rejectedTemplates(): number {

    return this.templates.filter(x => x.approvalStatus === 'Rejected').length;

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
        (x.bodyText || '').toLowerCase().includes(search);

      const matchCategory =
        !this.categoryFilter ||
        x.category === this.categoryFilter;

      const matchApprovalStatus =
        !this.approvalStatusFilter ||
        x.approvalStatus === this.approvalStatusFilter;

      return matchSearch && matchCategory && matchApprovalStatus;

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
    this.approvalStatusFilter = '';

  }


  //====================================================
  // On Approval Status Change
  //====================================================

  onApprovalStatusChange(): void {

    if (this.template.approvalStatus !== 'Rejected') {
      this.template.rejectionReason = '';
    }

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
      !this.template.bodyText ||
      !this.template.bodyText.trim()
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    const payload = {

      whatsAppTemplateId: this.isEdit ? this.template.whatsAppTemplateId : 0,

      templateCode: this.template.templateCode.trim(),
      templateName: this.template.templateName.trim(),

      category: this.template.category
        ? this.template.category.trim()
        : null,

      languageCode: this.template.languageCode
        ? this.template.languageCode.trim()
        : null,

      providerName: this.template.providerName || 'Twilio',

      templateSid: this.template.templateSid
        ? this.template.templateSid.trim()
        : null,

      headerText: this.template.headerText
        ? this.template.headerText.trim()
        : null,

      bodyText: this.template.bodyText.trim(),

      footerText: this.template.footerText
        ? this.template.footerText.trim()
        : null,

      approvalStatus: this.template.approvalStatus || 'Pending',

      rejectionReason: this.template.approvalStatus === 'Rejected'
        ? (this.template.rejectionReason
          ? this.template.rejectionReason.trim()
          : null)
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
          `${this.baseUrl}/SuperAdmin/updatewhatsapptemplate`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'WhatsApp Template updated successfully.'
              );

              this.clear();

              this.loadTemplates();

            } else {

              this.alert.warning(
                res?.message || 'Failed to update WhatsApp template.'
              );

            }

            this.cd.detectChanges();

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Update WhatsApp template error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to update WhatsApp template.'
            );

            this.cd.detectChanges();

          }

        });

    } else {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/SuperAdmin/createwhatsapptemplate`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'WhatsApp Template created successfully.'
              );

              this.clear();

              this.loadTemplates();

            } else {

              this.alert.warning(
                res?.message || 'Failed to create WhatsApp template.'
              );

            }

            this.cd.detectChanges();

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Create WhatsApp template error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to create WhatsApp template.'
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
      .get<ApiResponse<any>>(`${this.baseUrl}/SuperAdmin/getbywhatsapptemplate/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.template = {

              whatsAppTemplateId: data.whatsAppTemplateId,

              templateCode: data.templateCode || '',
              templateName: data.templateName || '',
              category: data.category || '',
              languageCode: data.languageCode || 'en',
              providerName: data.providerName || 'Twilio',
              templateSid: data.templateSid || '',
              headerText: data.headerText || '',
              bodyText: data.bodyText || '',
              footerText: data.footerText || '',
              approvalStatus: data.approvalStatus || 'Pending',
              rejectionReason: data.rejectionReason || '',
              version: data.version ?? 1,
              status: data.status || 'Draft',
              isActive: data.isActive === true

            };

            this.isEdit = true;
            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'WhatsApp Template not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get WhatsApp template error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to load WhatsApp template.'
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
          `${this.baseUrl}/SuperAdmin/deletewhatsapptemplate/${id}`,
          {}
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'WhatsApp Template deleted successfully.'
              );

              this.loadTemplates();

            } else {

              this.alert.warning(
                res?.message || 'Failed to delete WhatsApp template.'
              );

            }

            this.cd.detectChanges();

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete WhatsApp template error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete WhatsApp template.'
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
