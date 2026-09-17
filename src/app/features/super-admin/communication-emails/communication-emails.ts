import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';

@Component({
  selector: 'app-communication-emails',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './communication-emails.html',
  styleUrl: './communication-emails.css',
})
export class CommunicationEmails implements OnInit {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }


  // ==============================
  // Modal Controls
  // ==============================

  showModal = false;

  isEdit = false;

  editId = 0;


  // ==============================
  // Search / Filters
  // ==============================

  searchText = '';

  statusFilter = '';


  // ==============================
  // Data
  // ==============================

  emailConfigurations: any[] = [];


  // ==============================
  // Dropdown Options
  // ==============================

  providerOptions = [
    'SMTP',
    'Gmail',
    'Outlook',
    'SendGrid',
    'Amazon SES',
    'Mailgun',
    'Custom'
  ];

  encryptionOptions = ['None', 'SSL', 'TLS', 'STARTTLS'];


  // ==============================
  // Form Model
  // ==============================

  model: any = this.emptyModel();

  emptyModel() {
    return {
      communicationEmailId: 0,
      configurationName: '',
      providerName: '',
      smtphost: '',
      smtpport: 587,
      smtpusername: '',
      smtppassword: '',
      fromEmail: '',
      fromName: '',
      encryptionType: '',
      enableAuthentication: true,
      isActive: true,
      connectionStatus: '',
      lastTestedOn: null
    };
  }


  // ==============================
  // On Init
  // ==============================

  ngOnInit(): void {
    this.getEmailConfigurations();
  }


  // ==============================
  // Get All Email Configurations
  // ==============================

  getEmailConfigurations(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(
        `${this.baseUrl}/SuperAdmin/getallcommunicationemail`
      )
      .subscribe({

        next: (response: any) => {

          this.spinner.hide();

          if (response?.success) {

            this.emailConfigurations = response.data || [];

          } else {

            this.emailConfigurations = [];

            this.alert.warning(
              response?.message ||
              'Unable to load email configurations.'
            );

          }

          this.cd.detectChanges();
        },

        error: (error: any) => {

          this.spinner.hide();

          this.emailConfigurations = [];

          this.alert.error(
            error?.error?.message ||
            'Failed to load email configurations.'
          );

          this.cd.detectChanges();
        }

      });

  }


  // ==============================
  // Statistics
  // ==============================

  get totalCount(): number {
    return this.emailConfigurations.length;
  }

  get activeCount(): number {
    return this.emailConfigurations.filter(x => x.isActive).length;
  }

  get inactiveCount(): number {
    return this.emailConfigurations.filter(x => !x.isActive).length;
  }


  // ==============================
  // Filtered Configurations
  // ==============================

  get filteredConfigurations(): any[] {

    const search = this.searchText
      .trim()
      .toLowerCase();

    return this.emailConfigurations.filter(item => {

      const configurationName =
        (item.configurationName || '').toLowerCase();

      const providerName =
        (item.providerName || '').toLowerCase();

      const smtphost =
        (item.smtphost || '').toLowerCase();

      const fromEmail =
        (item.fromEmail || '').toLowerCase();


      const matchesSearch =
        !search ||
        configurationName.includes(search) ||
        providerName.includes(search) ||
        smtphost.includes(search) ||
        fromEmail.includes(search);


      const matchesStatus =
        !this.statusFilter ||
        (this.statusFilter === 'Active' && item.isActive) ||
        (this.statusFilter === 'Inactive' && !item.isActive);


      return matchesSearch && matchesStatus;

    });

  }


  // ==============================
  // Refresh
  // ==============================

  refresh(): void {
    this.getEmailConfigurations();
  }


  // ==============================
  // Clear Filters
  // ==============================

  clearFilters(): void {
    this.searchText = '';
    this.statusFilter = '';
  }


  // ==============================
  // Add Modal
  // ==============================

  openAddModal(): void {

    this.isEdit = false;

    this.editId = 0;

    this.model = this.emptyModel();

    this.showModal = true;

    this.cd.detectChanges();

  }


  // ==============================
  // Close Modal
  // ==============================

  closeModal(): void {

    this.showModal = false;

    this.isEdit = false;

    this.editId = 0;

    this.model = this.emptyModel();

    this.cd.detectChanges();

  }


  // ==============================
  // Save / Update Configuration
  // ==============================

  saveConfiguration(): void {

    // Configuration Name validation
    if (!this.model.configurationName?.trim()) {

      this.alert.warning(
        'Configuration Name is required.'
      );

      return;

    }


    // SMTP Host validation
    if (!this.model.smtphost?.trim()) {

      this.alert.warning(
        'SMTP Host is required.'
      );

      return;

    }


    // SMTP Port validation
    if (
      this.model.smtpport === null ||
      this.model.smtpport === undefined ||
      Number(this.model.smtpport) <= 0
    ) {

      this.alert.warning(
        'SMTP Port is required.'
      );

      return;

    }


    // From Email validation
    if (!this.model.fromEmail?.trim()) {

      this.alert.warning(
        'From Email is required.'
      );

      return;

    }


    // Prepare request
    const request: any = {

      communicationEmailId:
        this.isEdit ? this.editId : 0,

      configurationName:
        this.model.configurationName.trim(),

      providerName:
        this.model.providerName?.trim() || '',

      smtphost:
        this.model.smtphost.trim(),

      smtpport:
        Number(this.model.smtpport),

      smtpusername:
        this.model.smtpusername?.trim() || null,

      smtppassword:
        this.model.smtppassword?.trim() || null,

      fromEmail:
        this.model.fromEmail.trim(),

      fromName:
        this.model.fromName?.trim() || null,

      encryptionType:
        this.model.encryptionType?.trim() || null,

      enableAuthentication:
        this.model.enableAuthentication,

      isActive:
        this.model.isActive

    };


    this.spinner.show();


    // ==============================
    // UPDATE
    // ==============================

    if (this.isEdit) {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/SuperAdmin/updatecommunicationemail`,
          request
        )
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Email Configuration Updated Successfully.'
              );

              this.closeModal();

              this.getEmailConfigurations();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to update email configuration.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error: any) => {

            this.spinner.hide();

            this.alert.error(
              error?.error?.message ||
              'Failed to update email configuration.'
            );

            this.cd.detectChanges();

          }

        });

    }

    // ==============================
    // CREATE
    // ==============================

    else {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/SuperAdmin/createcommunicationemail`,
          request
        )
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Email Configuration Created Successfully.'
              );

              this.closeModal();

              this.getEmailConfigurations();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to create email configuration.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error: any) => {

            this.spinner.hide();

            this.alert.error(
              error?.error?.message ||
              'Failed to create email configuration.'
            );

            this.cd.detectChanges();

          }

        });

    }

  }


  // ==============================
  // Edit Configuration
  // ==============================

  edit(item: any): void {

    this.isEdit = true;

    this.editId = item.communicationEmailId;


    this.model = {

      communicationEmailId:
        item.communicationEmailId,

      configurationName:
        item.configurationName || '',

      providerName:
        item.providerName || '',

      smtphost:
        item.smtphost || '',

      smtpport:
        item.smtpport ?? 587,

      smtpusername:
        item.smtpusername || '',

      // Password is never returned by the backend; leave blank
      // so the existing password stays unchanged unless the user
      // types a new one (matches UpdateCommunicationEmail logic).
      smtppassword:
        '',

      fromEmail:
        item.fromEmail || '',

      fromName:
        item.fromName || '',

      encryptionType:
        item.encryptionType || '',

      enableAuthentication:
        item.enableAuthentication,

      isActive:
        item.isActive,

      connectionStatus:
        item.connectionStatus || '',

      lastTestedOn:
        item.lastTestedOn || null

    };


    this.showModal = true;

    this.cd.detectChanges();

  }


  // ==============================
  // Delete Configuration
  // ==============================

  delete(id: number): void {

    this.alert.deleteConfirm()
      .then((result: any) => {

        if (!result.isConfirmed) {
          return;
        }


        this.spinner.show();


        this.http
          .post<ApiResponse>(
            `${this.baseUrl}/SuperAdmin/deletecommunicationemail/${id}`,
            {}
          )
          .subscribe({

            next: (response: any) => {

              this.spinner.hide();

              if (response?.success) {

                this.alert.success(
                  response.message ||
                  'Email Configuration Deleted Successfully.'
                );

                this.getEmailConfigurations();

              } else {

                this.alert.warning(
                  response?.message ||
                  'Unable to delete email configuration.'
                );

              }

              this.cd.detectChanges();

            },

            error: (error: any) => {

              this.spinner.hide();

              this.alert.error(
                error?.error?.message ||
                'Failed to delete email configuration.'
              );

              this.cd.detectChanges();

            }

          });

      });

  }

}
