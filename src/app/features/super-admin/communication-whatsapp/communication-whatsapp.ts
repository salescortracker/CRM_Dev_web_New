import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';

@Component({
  selector: 'app-communication-whatsapp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './communication-whatsapp.html',
  styleUrl: './communication-whatsapp.css',
})
export class CommunicationWhatsapp implements OnInit {

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

  whatsappConfigurations: any[] = [];


  // ==============================
  // Dropdown Options
  // ==============================

  providerOptions = [
    'Twilio',
    'Meta Cloud API',
    'Gupshup',
    'MSG91',
    '360Dialog',
    'Custom'
  ];


  // ==============================
  // Form Model
  // ==============================

  model: any = this.emptyModel();

  emptyModel() {
    return {
      communicationWhatsAppId: 0,
      configurationName: '',
      providerName: 'Twilio',
      accountSid: '',
      authToken: '',
      whatsAppNumber: '',
      messagingServiceSid: '',
      webhookUrl: '',
      businessAccountId: '',
      isActive: true,
      connectionStatus: '',
      lastTestedOn: null
    };
  }


  // ==============================
  // On Init
  // ==============================

  ngOnInit(): void {
    this.getWhatsappConfigurations();
  }


  // ==============================
  // Get All WhatsApp Configurations
  // ==============================

  getWhatsappConfigurations(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(
        `${this.baseUrl}/SuperAdmin/getallcommunicationwhatsapp`
      )
      .subscribe({

        next: (response: any) => {

          this.spinner.hide();

          if (response?.success) {

            this.whatsappConfigurations = response.data || [];

          } else {

            this.whatsappConfigurations = [];

            this.alert.warning(
              response?.message ||
              'Unable to load WhatsApp configurations.'
            );

          }

          this.cd.detectChanges();
        },

        error: (error: any) => {

          this.spinner.hide();

          this.whatsappConfigurations = [];

          this.alert.error(
            error?.error?.message ||
            'Failed to load WhatsApp configurations.'
          );

          this.cd.detectChanges();
        }

      });

  }


  // ==============================
  // Statistics
  // ==============================

  get totalCount(): number {
    return this.whatsappConfigurations.length;
  }

  get activeCount(): number {
    return this.whatsappConfigurations.filter(x => x.isActive).length;
  }

  get inactiveCount(): number {
    return this.whatsappConfigurations.filter(x => !x.isActive).length;
  }


  // ==============================
  // Filtered Configurations
  // ==============================

  get filteredConfigurations(): any[] {

    const search = this.searchText
      .trim()
      .toLowerCase();

    return this.whatsappConfigurations.filter(item => {

      const configurationName =
        (item.configurationName || '').toLowerCase();

      const providerName =
        (item.providerName || '').toLowerCase();

      const accountSid =
        (item.accountSid || '').toLowerCase();

      const whatsAppNumber =
        (item.whatsAppNumber || '').toLowerCase();


      const matchesSearch =
        !search ||
        configurationName.includes(search) ||
        providerName.includes(search) ||
        accountSid.includes(search) ||
        whatsAppNumber.includes(search);


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
    this.getWhatsappConfigurations();
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


    // WhatsApp Number validation
    if (!this.model.whatsAppNumber?.trim()) {

      this.alert.warning(
        'WhatsApp Number is required.'
      );

      return;

    }


    // Prepare request
    const request: any = {

      communicationWhatsAppId:
        this.isEdit ? this.editId : 0,

      configurationName:
        this.model.configurationName.trim(),

      providerName:
        this.model.providerName?.trim() || 'Twilio',

      accountSid:
        this.model.accountSid.trim(),

      authToken:
        this.model.authToken?.trim() || null,

      whatsAppNumber:
        this.model.whatsAppNumber.trim(),

      messagingServiceSid:
        this.model.messagingServiceSid?.trim() || null,

      webhookUrl:
        this.model.webhookUrl?.trim() || null,

      businessAccountId:
        this.model.businessAccountId?.trim() || null,

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
          `${this.baseUrl}/SuperAdmin/updatecommunicationwhatsapp`,
          request
        )
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'WhatsApp Configuration Updated Successfully.'
              );

              this.closeModal();

              this.getWhatsappConfigurations();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to update WhatsApp configuration.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error: any) => {

            this.spinner.hide();

            this.alert.error(
              error?.error?.message ||
              'Failed to update WhatsApp configuration.'
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
          `${this.baseUrl}/SuperAdmin/createcommunicationwhatsapp`,
          request
        )
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'WhatsApp Configuration Created Successfully.'
              );

              this.closeModal();

              this.getWhatsappConfigurations();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to create WhatsApp configuration.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error: any) => {

            this.spinner.hide();

            this.alert.error(
              error?.error?.message ||
              'Failed to create WhatsApp configuration.'
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

    this.editId = item.communicationWhatsAppId;


    this.model = {

      communicationWhatsAppId:
        item.communicationWhatsAppId,

      configurationName:
        item.configurationName || '',

      providerName:
        item.providerName || 'Twilio',

      accountSid:
        item.accountSid || '',

      // Auth Token is never returned by the backend; leave blank
      // so the existing token stays unchanged unless the user
      // types a new one (matches UpdateCommunicationWhatsApp logic).
      authToken:
        '',

      whatsAppNumber:
        item.whatsAppNumber || '',

      messagingServiceSid:
        item.messagingServiceSid || '',

      webhookUrl:
        item.webhookUrl || '',

      businessAccountId:
        item.businessAccountId || '',

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
            `${this.baseUrl}/SuperAdmin/deletecommunicationwhatsapp/${id}`,
            {}
          )
          .subscribe({

            next: (response: any) => {

              this.spinner.hide();

              if (response?.success) {

                this.alert.success(
                  response.message ||
                  'WhatsApp Configuration Deleted Successfully.'
                );

                this.getWhatsappConfigurations();

              } else {

                this.alert.warning(
                  response?.message ||
                  'Unable to delete WhatsApp configuration.'
                );

              }

              this.cd.detectChanges();

            },

            error: (error: any) => {

              this.spinner.hide();

              this.alert.error(
                error?.error?.message ||
                'Failed to delete WhatsApp configuration.'
              );

              this.cd.detectChanges();

            }

          });

      });

  }

}
