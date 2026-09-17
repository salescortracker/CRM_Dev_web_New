import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';

@Component({
  selector: 'app-emailautomationrecipients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './emailautomationrecipients.html',
  styleUrl: './emailautomationrecipients.css',
})
export class Emailautomationrecipients implements OnInit {

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

  automationFilter: number | '' = '';

  statusFilter = '';


  // ==============================
  // Data
  // ==============================

  recipients: any[] = [];

  emailAutomations: any[] = [];


  // ==============================
  // Dropdown Options
  // ==============================

  recipientTypeOptions = [
    'Email',
    'User',
    'Role',
    'Team',
    'Owner',
    'Manager'
  ];


  // ==============================
  // Form Model
  // ==============================

  model: any = this.emptyModel();

  emptyModel() {
    return {
      emailAutomationRecipientId: 0,
      emailAutomationId: 0,
      recipientType: '',
      recipientValue: '',
      companyId: 0,
      regionId: 0,
      isActive: true
    };
  }


  // ==============================
  // On Init
  // ==============================

  ngOnInit(): void {
    this.getEmailAutomations();
    this.getRecipients();
  }


  // ==============================
  // Get All Email Automations (for dropdown)
  // ==============================

  getEmailAutomations(): void {

    this.http
      .get<ApiResponse<any[]>>(
        `${this.baseUrl}/SuperAdmin/getallemailautomations`
      )
      .subscribe({

        next: (response: any) => {

          if (response?.success) {
            this.emailAutomations = response.data || [];
          } else {
            this.emailAutomations = [];
          }

          this.cd.detectChanges();
        },

        error: () => {
          this.emailAutomations = [];
          this.cd.detectChanges();
        }

      });

  }


  // ==============================
  // Get All Email Automation Recipients
  // ==============================

  getRecipients(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(
        `${this.baseUrl}/SuperAdmin/getallemailautomationrecipients`
      )
      .subscribe({

        next: (response: any) => {

          this.spinner.hide();

          if (response?.success) {

            this.recipients = response.data || [];

          } else {

            this.recipients = [];

            this.alert.warning(
              response?.message ||
              'Unable to load email automation recipients.'
            );

          }

          this.cd.detectChanges();
        },

        error: (error: any) => {

          this.spinner.hide();

          this.recipients = [];

          this.alert.error(
            error?.error?.message ||
            'Failed to load email automation recipients.'
          );

          this.cd.detectChanges();
        }

      });

  }


  // ==============================
  // Resolve Automation Name
  // (EmailAutomationRecipientDto has no AutomationName field
  //  from the backend, so resolve it from the automations list)
  // ==============================

  getAutomationName(automationId: number): string {

    const automation = this.emailAutomations.find(
      x => x.emailAutomationId === automationId
    );

    return automation ? automation.automationName : '—';

  }


  // ==============================
  // Statistics
  // ==============================

  get totalCount(): number {
    return this.recipients.length;
  }

  get activeCount(): number {
    return this.recipients.filter(x => x.isActive).length;
  }

  get inactiveCount(): number {
    return this.recipients.filter(x => !x.isActive).length;
  }


  // ==============================
  // Filtered Recipients
  // ==============================

  get filteredRecipients(): any[] {

    const search = this.searchText
      .trim()
      .toLowerCase();

    return this.recipients.filter(item => {

      const recipientType =
        (item.recipientType || '').toLowerCase();

      const recipientValue =
        (item.recipientValue || '').toLowerCase();

      const automationName =
        this.getAutomationName(item.emailAutomationId).toLowerCase();


      const matchesSearch =
        !search ||
        recipientType.includes(search) ||
        recipientValue.includes(search) ||
        automationName.includes(search);


      const matchesAutomation =
        this.automationFilter === '' ||
        item.emailAutomationId === this.automationFilter;


      const matchesStatus =
        !this.statusFilter ||
        (this.statusFilter === 'Active' && item.isActive) ||
        (this.statusFilter === 'Inactive' && !item.isActive);


      return matchesSearch && matchesAutomation && matchesStatus;

    });

  }


  // ==============================
  // Refresh
  // ==============================

  refresh(): void {
    this.getEmailAutomations();
    this.getRecipients();
  }


  // ==============================
  // Clear Filters
  // ==============================

  clearFilters(): void {
    this.searchText = '';
    this.automationFilter = '';
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
  // On Automation Change
  // (auto-fill Company / Region from the selected automation)
  // ==============================

  onAutomationChange(): void {

    const automation = this.emailAutomations.find(
      x => x.emailAutomationId === Number(this.model.emailAutomationId)
    );

    this.model.companyId = automation ? automation.companyId : 0;

    this.model.regionId = automation ? automation.regionId : 0;

  }


  // ==============================
  // Save / Update Recipient
  // ==============================

  saveRecipient(): void {

    // Email Automation validation
    if (
      !this.model.emailAutomationId ||
      Number(this.model.emailAutomationId) <= 0
    ) {

      this.alert.warning(
        'Email Automation is required.'
      );

      return;

    }


    // Recipient Type validation
    if (!this.model.recipientType?.trim()) {

      this.alert.warning(
        'Recipient Type is required.'
      );

      return;

    }


    // Recipient Value validation
    if (!this.model.recipientValue?.trim()) {

      this.alert.warning(
        'Recipient Value is required.'
      );

      return;

    }


    // Company / Region validation
    if (!this.model.companyId || !this.model.regionId) {

      this.alert.warning(
        'Selected Email Automation is missing Company / Region details.'
      );

      return;

    }


    // Prepare request
    const request: any = {

      emailAutomationRecipientId:
        this.isEdit ? this.editId : 0,

      emailAutomationId:
        Number(this.model.emailAutomationId),

      recipientType:
        this.model.recipientType.trim(),

      recipientValue:
        this.model.recipientValue.trim(),

      companyId:
        Number(this.model.companyId),

      regionId:
        Number(this.model.regionId),

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
          `${this.baseUrl}/SuperAdmin/updateemailautomationrecipient`,
          request
        )
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Email Automation Recipient Updated Successfully.'
              );

              this.closeModal();

              this.getRecipients();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to update email automation recipient.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error: any) => {

            this.spinner.hide();

            this.alert.error(
              error?.error?.message ||
              'Failed to update email automation recipient.'
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
          `${this.baseUrl}/SuperAdmin/createemailautomationrecipient`,
          request
        )
        .subscribe({

          next: (response: any) => {

            this.spinner.hide();

            if (response?.success) {

              this.alert.success(
                response.message ||
                'Email Automation Recipient Created Successfully.'
              );

              this.closeModal();

              this.getRecipients();

            } else {

              this.alert.warning(
                response?.message ||
                'Unable to create email automation recipient.'
              );

            }

            this.cd.detectChanges();

          },

          error: (error: any) => {

            this.spinner.hide();

            this.alert.error(
              error?.error?.message ||
              'Failed to create email automation recipient.'
            );

            this.cd.detectChanges();

          }

        });

    }

  }


  // ==============================
  // Edit Recipient
  // ==============================

  edit(item: any): void {

    this.isEdit = true;

    this.editId = item.emailAutomationRecipientId;


    this.model = {

      emailAutomationRecipientId:
        item.emailAutomationRecipientId,

      emailAutomationId:
        item.emailAutomationId,

      recipientType:
        item.recipientType || '',

      recipientValue:
        item.recipientValue || '',

      companyId:
        item.companyId,

      regionId:
        item.regionId,

      isActive:
        item.isActive

    };


    this.showModal = true;

    this.cd.detectChanges();

  }


  // ==============================
  // Delete Recipient
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
            `${this.baseUrl}/SuperAdmin/deleteemailautomationrecipient/${id}`,
            {}
          )
          .subscribe({

            next: (response: any) => {

              this.spinner.hide();

              if (response?.success) {

                this.alert.success(
                  response.message ||
                  'Email Automation Recipient Deleted Successfully.'
                );

                this.getRecipients();

              } else {

                this.alert.warning(
                  response?.message ||
                  'Unable to delete email automation recipient.'
                );

              }

              this.cd.detectChanges();

            },

            error: (error: any) => {

              this.spinner.hide();

              this.alert.error(
                error?.error?.message ||
                'Failed to delete email automation recipient.'
              );

              this.cd.detectChanges();

            }

          });

      });

  }

}
