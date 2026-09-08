import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-outlook-integration',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './outlook-integration.html',
  styleUrl: './outlook-integration.css',
})
export class OutlookIntegration {
  submitted = false;

  isEdit = false;

  page = 1;

  pageSize = 5;

  totalRecords = 0;

  searchText = '';



  outlookIntegrations: any[] = [];



  outlook: any = {

    outlookIntegrationId: 0,

    integrationName: '',

    outlookAccount: '',

    clientId: '',

    clientSecret: '',

    tenantId: '',

    redirectUri: '',

    syncFrequency: '',

    lastSyncDate: '',

    status: '',

    description: '',

    isActive: true

  };



  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef

  ) { }



  ngOnInit(): void {

    this.loadOutlookIntegrations();

  }



  loadOutlookIntegrations() {

    this.spinner.show();

    setTimeout(() => {

      this.outlookIntegrations = [

        {

          outlookIntegrationId: 1,

          integrationName: 'Sales Outlook',

          outlookAccount: 'sales@company.com',

          clientId: 'azure-client-id-sales',

          clientSecret: 'azure-secret-sales',

          tenantId: 'tenant-sales-001',

          redirectUri: 'https://crm.company.com/auth/outlook/callback',

          syncFrequency: 'Every 15 Minutes',

          lastSyncDate: '2026-08-06T09:15',

          status: 'Connected',

          description: 'Sales team Outlook mailbox integration.',

          isActive: true

        },



        {

          outlookIntegrationId: 2,

          integrationName: 'Support Outlook',

          outlookAccount: 'support@company.com',

          clientId: 'azure-client-id-support',

          clientSecret: 'azure-secret-support',

          tenantId: 'tenant-support-002',

          redirectUri: 'https://crm.company.com/auth/outlook/callback',

          syncFrequency: 'Hourly',

          lastSyncDate: '2026-08-06T08:00',

          status: 'Connected',

          description: 'Customer support Outlook integration.',

          isActive: true

        },



        {

          outlookIntegrationId: 3,

          integrationName: 'HR Outlook',

          outlookAccount: 'hr@company.com',

          clientId: 'azure-client-id-hr',

          clientSecret: 'azure-secret-hr',

          tenantId: 'tenant-hr-003',

          redirectUri: 'https://crm.company.com/auth/outlook/callback',

          syncFrequency: 'Daily',

          lastSyncDate: '2026-08-05T18:00',

          status: 'Pending',

          description: 'HR Outlook account used for recruitment and employee communication.',

          isActive: true

        },
                {

          outlookIntegrationId: 4,

          integrationName: 'Marketing Outlook',

          outlookAccount: 'marketing@company.com',

          clientId: 'azure-client-id-marketing',

          clientSecret: 'azure-secret-marketing',

          tenantId: 'tenant-marketing-004',

          redirectUri: 'https://crm.company.com/auth/outlook/callback',

          syncFrequency: 'Every 30 Minutes',

          lastSyncDate: '2026-08-05T14:30',

          status: 'Error',

          description: 'Marketing team Outlook integration for campaign communications.',

          isActive: false

        },



        {

          outlookIntegrationId: 5,

          integrationName: 'Accounts Outlook',

          outlookAccount: 'accounts@company.com',

          clientId: 'azure-client-id-accounts',

          clientSecret: 'azure-secret-accounts',

          tenantId: 'tenant-accounts-005',

          redirectUri: 'https://crm.company.com/auth/outlook/callback',

          syncFrequency: 'Every 5 Minutes',

          lastSyncDate: '2026-08-06T09:55',

          status: 'Disconnected',

          description: 'Accounts Outlook integration for invoices and billing.',

          isActive: false

        }

      ];



      this.outlookIntegrations.sort(

        (a, b) => b.outlookIntegrationId - a.outlookIntegrationId

      );



      this.totalRecords = this.outlookIntegrations.length;



      this.spinner.hide();



      this.cd.detectChanges();



    }, 500);

  }
    saveOutlookIntegration() {

    this.submitted = true;

    if (
      !this.outlook.integrationName ||
      !this.outlook.outlookAccount ||
      !this.outlook.clientId ||
      !this.outlook.clientSecret ||
      !this.outlook.tenantId ||
      !this.outlook.redirectUri ||
      !this.outlook.syncFrequency ||
      !this.outlook.status
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newIntegration = {

          ...this.outlook,

          outlookIntegrationId: this.outlookIntegrations.length
            ? Math.max(...this.outlookIntegrations.map(x => x.outlookIntegrationId)) + 1
            : 1

        };

        this.outlookIntegrations.unshift(newIntegration);

      } else {

        const index = this.outlookIntegrations.findIndex(
          x => x.outlookIntegrationId === this.outlook.outlookIntegrationId
        );

        if (index !== -1) {

          this.outlookIntegrations[index] = {

            ...this.outlook

          };

        }

      }

      this.outlookIntegrations = [...this.outlookIntegrations];

      this.totalRecords = this.outlookIntegrations.length;

      this.page = 1;

      const isUpdate = this.isEdit;

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(

        isUpdate
          ? 'Outlook Integration updated successfully.'
          : 'Outlook Integration created successfully.'

      );

    }, 500);

  }







  edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.outlookIntegrations.find(
        x => x.outlookIntegrationId === id
      );

      if (selected) {

        this.outlook = {

          ...selected

        };

        this.isEdit = true;

        this.submitted = false;

        this.cd.detectChanges();

      }

      this.spinner.hide();

    }, 300);

  }







  delete(id: number) {

    this.alert.deleteConfirm().then(result => {

      if (result.isConfirmed) {

        this.spinner.show();

        setTimeout(() => {

          this.outlookIntegrations = this.outlookIntegrations.filter(
            x => x.outlookIntegrationId !== id
          );

          this.totalRecords = this.outlookIntegrations.length;

          if (
            this.page > 1 &&
            this.pagedOutlookIntegrations.length === 0
          ) {

            this.page--;

          }

          this.outlookIntegrations = [...this.outlookIntegrations];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Outlook Integration deleted successfully.'
          );

        }, 500);

      }

    });

  }







  clear() {

    this.outlook = {

      outlookIntegrationId: 0,

      integrationName: '',

      outlookAccount: '',

      clientId: '',

      clientSecret: '',

      tenantId: '',

      redirectUri: '',

      syncFrequency: '',

      lastSyncDate: '',

      status: '',

      description: '',

      isActive: true

    };

    this.submitted = false;

    this.isEdit = false;

    this.cd.detectChanges();

  }







  get filteredOutlookIntegrations() {

    return this.outlookIntegrations.filter(x =>

      x.integrationName.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.outlookAccount.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.syncFrequency.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.status.toLowerCase().includes(this.searchText.toLowerCase())

    );

  }







  get pagedOutlookIntegrations() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredOutlookIntegrations.slice(

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
