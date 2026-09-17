import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';

@Component({
  selector: 'app-communication-sms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './communication-sms.html',
  styleUrl: './communication-sms.css',
})
export class CommunicationSms implements OnInit {

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

  smsConfigurations: any[] = [];


  // ==============================
  // Dropdown Options
  // ==============================

  providerOptions = [
    'Twilio',
    'Nexmo',
    'Plivo',
    'MSG91',
    'AWS SNS',
    'Custom'
  ];


  // ==============================
  // Form Model
  // ==============================

  model: any = this.emptyModel();

  emptyModel() {
    return {
      communicationSmsid: 0,
      configurationName: '',
      providerName: 'Twilio',
      accountSid: '',
      authToken: '',
      fromNumber: '',
      messagingServiceSid: '',
      webhookUrl: '',
      isActive: true,
      connectionStatus: '',
      lastTestedOn: null
    };
  }


  // ==============================
  // On Init
  // ==============================

  ngOnInit(): void {
    this.getSmsConfigurations();
  }


  // ==============================
  // Get All SMS Configurations
  // ==============================

  getSmsConfigurations(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(
        `${this.baseUrl}/SuperAdmin/getallcommunicationsms`
      )
      .subscribe({

        next: (response: any) => {

          this.spinner.hide();

          if (response?.success) {

            this.smsConfigurations = response.data || [];

          } else {

            this.smsConfigurations = [];

            this.alert.warning(
              response?.message ||
              'Unable to load SMS configurations.'
            );

          }

          this.cd.detectChanges();
        },

        error: (error: any) => {

          this.spinner.hide();

          this.smsConfigurations = [];

          this.alert.error(
            error?.error?.message ||
            'Failed to load SMS configurations.'
          );

          this.cd.detectChanges();
        }

      });

  }


  // ==============================
  // Statistics
  // ==============================

  get totalCount(): number {
    return this.smsConfigurations.length;
  }

  get activeCount(): number {
    return this.smsConfigurations.filter(x => x.isActive).length;
  }

  get inactiveCount(): number {
    return this.smsConfigurations.filter(x => !x.isActive).length;
  }


  // ==============================
  // Filtered Configurations
  // ==============================

  get filteredConfigurations(): any[] {

    const search = this.searchText
      .trim()
      .toLowerCase();

    return this.smsConfigurations.filter(item => {

      const configurationName =
        (item.configurationName || '').toLowerCase();

      const providerName =
        (item.providerName || '').toLowerCase();

      const accountSid =
        (item.accountSid || '').toLowerCase();

      const fromNumber =
        (item.fromNumber || '').toLowerCase();


      const matchesSearch =
        !search ||
        configurationName.includes(search) ||
        providerName.includes(search) ||
        accountSid.includes(search) ||
        fromNumber.includes(search);


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
    this.getSmsConfigurations();
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


    // Account SID validation
    if (!this.model.accountSid?.trim()) {

      this.alert.warning(
        'Account SID is required.'
      );

      return;

    }


    // From Number validation
    if (!this.model.fromNumber?.trim()) {

      this.alert.warning(
        'From Number is required.'
      );

      return;

    }


    // Prepare request
    const request: any = {

      communicationSmsid:
        this.isEdit ? this.editId : 0,

      configurationName:
        this.model.configurationName.trim(),

      providerName:
        this.model.providerName?.trim() || 'Twilio',

      accountSid:
        this.model.accountSid.trim(),

      authToken:
        this.model.authToken?.trim() || null,

      fromNumber:
        this.model.fromNumber.trim(),

      messagingServiceSid:
        this.model.messagingServiceSid?.trim() || null,

      webhookUrl:
        this.model.webhookUrl?.trim() || null,

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
          `${this.baseUrl}/SuperAdmin/updatecommunicationsms`,
          request
        )
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'SMS Configuration Updated Successfully.'
              );

              this.closeModal();

              this.getSmsConfigurations();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to update SMS configuration.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error: any) => {

            this.spinner.hide();

            this.alert.error(
              error?.error?.message ||
              'Failed to update SMS configuration.'
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
          `${this.baseUrl}/SuperAdmin/createcommunicationsms`,
          request
        )
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'SMS Configuration Created Successfully.'
              );

              this.closeModal();

              this.getSmsConfigurations();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to create SMS configuration.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error: any) => {

            this.spinner.hide();

            this.alert.error(
              error?.error?.message ||
              'Failed to create SMS configuration.'
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

    this.editId = item.communicationSmsid;


    this.model = {

      communicationSmsid:
        item.communicationSmsid,

      configurationName:
        item.configurationName || '',

      providerName:
        item.providerName || 'Twilio',

      accountSid:
        item.accountSid || '',

      // Auth Token is never returned by the backend; leave blank
      // so the existing token stays unchanged unless the user
      // types a new one (matches UpdateCommunicationSMS logic).
      authToken:
        '',

      fromNumber:
        item.fromNumber || '',

      messagingServiceSid:
        item.messagingServiceSid || '',

      webhookUrl:
        item.webhookUrl || '',

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
            `${this.baseUrl}/SuperAdmin/deletecommunicationsms/${id}`,
            {}
          )
          .subscribe({

            next: (response: any) => {

              this.spinner.hide();

              if (response?.success) {

                this.alert.success(
                  response.message ||
                  'SMS Configuration Deleted Successfully.'
                );

                this.getSmsConfigurations();

              } else {

                this.alert.warning(
                  response?.message ||
                  'Unable to delete SMS configuration.'
                );

              }

              this.cd.detectChanges();

            },

            error: (error: any) => {

              this.spinner.hide();

              this.alert.error(
                error?.error?.message ||
                'Failed to delete SMS configuration.'
              );

              this.cd.detectChanges();

            }

          });

      });

  }

}
