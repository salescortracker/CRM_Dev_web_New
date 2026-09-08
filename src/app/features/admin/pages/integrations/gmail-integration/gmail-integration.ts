import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-gmail-integration',
  standalone: true,
  imports: [CommonModule, FormsModule,Pagination],
  templateUrl: './gmail-integration.html',
  styleUrl: './gmail-integration.css',
})
export class GmailIntegration {
   submitted = false;

  isEdit = false;

  page = 1;

  pageSize = 5;

  totalRecords = 0;

  searchText = '';



  gmailIntegrations: any[] = [];



  gmail: any = {

    gmailIntegrationId: 0,

    integrationName: '',

    gmailAccount: '',

    clientId: '',

    clientSecret: '',

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

    this.loadGmailIntegrations();

  }



  loadGmailIntegrations() {

    this.spinner.show();

    setTimeout(() => {

      this.gmailIntegrations = [

        {

          gmailIntegrationId: 1,

          integrationName: 'Sales Gmail',

          gmailAccount: 'sales@company.com',

          clientId: 'google-client-id-sales',

          clientSecret: 'google-client-secret-sales',

          redirectUri: 'https://crm.company.com/auth/google/callback',

          syncFrequency: 'Every 15 Minutes',

          lastSyncDate: '2026-08-06T09:30',

          status: 'Connected',

          description: 'Primary Gmail integration for the Sales department.',

          isActive: true

        },



        {

          gmailIntegrationId: 2,

          integrationName: 'Support Gmail',

          gmailAccount: 'support@company.com',

          clientId: 'google-client-id-support',

          clientSecret: 'google-client-secret-support',

          redirectUri: 'https://crm.company.com/auth/google/callback',

          syncFrequency: 'Hourly',

          lastSyncDate: '2026-08-06T08:00',

          status: 'Connected',

          description: 'Handles customer support email synchronization.',

          isActive: true

        },



        {

          gmailIntegrationId: 3,

          integrationName: 'HR Gmail',

          gmailAccount: 'hr@company.com',

          clientId: 'google-client-id-hr',

          clientSecret: 'google-client-secret-hr',

          redirectUri: 'https://crm.company.com/auth/google/callback',

          syncFrequency: 'Daily',

          lastSyncDate: '2026-08-05T18:00',

          status: 'Pending',

          description: 'Gmail account used for HR recruitment and employee communication.',

          isActive: true

        },
                {

          gmailIntegrationId: 4,

          integrationName: 'Marketing Gmail',

          gmailAccount: 'marketing@company.com',

          clientId: 'google-client-id-marketing',

          clientSecret: 'google-client-secret-marketing',

          redirectUri: 'https://crm.company.com/auth/google/callback',

          syncFrequency: 'Every 30 Minutes',

          lastSyncDate: '2026-08-05T14:30',

          status: 'Error',

          description: 'Marketing team Gmail integration for campaign communications.',

          isActive: false

        },



        {

          gmailIntegrationId: 5,

          integrationName: 'Accounts Gmail',

          gmailAccount: 'accounts@company.com',

          clientId: 'google-client-id-accounts',

          clientSecret: 'google-client-secret-accounts',

          redirectUri: 'https://crm.company.com/auth/google/callback',

          syncFrequency: 'Every 5 Minutes',

          lastSyncDate: '2026-08-06T09:55',

          status: 'Disconnected',

          description: 'Accounts department Gmail integration for invoices and billing.',

          isActive: false

        }

      ];



      this.gmailIntegrations.sort(

        (a, b) => b.gmailIntegrationId - a.gmailIntegrationId

      );



      this.totalRecords = this.gmailIntegrations.length;



      this.spinner.hide();



      this.cd.detectChanges();



    }, 500);

  }
    saveGmailIntegration() {

    this.submitted = true;

    if (
      !this.gmail.integrationName ||
      !this.gmail.gmailAccount ||
      !this.gmail.clientId ||
      !this.gmail.clientSecret ||
      !this.gmail.redirectUri ||
      !this.gmail.syncFrequency ||
      !this.gmail.status
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newIntegration = {

          ...this.gmail,

          gmailIntegrationId: this.gmailIntegrations.length
            ? Math.max(...this.gmailIntegrations.map(x => x.gmailIntegrationId)) + 1
            : 1

        };

        this.gmailIntegrations.unshift(newIntegration);

      } else {

        const index = this.gmailIntegrations.findIndex(
          x => x.gmailIntegrationId === this.gmail.gmailIntegrationId
        );

        if (index !== -1) {

          this.gmailIntegrations[index] = {

            ...this.gmail

          };

        }

      }

      this.gmailIntegrations = [...this.gmailIntegrations];

      this.totalRecords = this.gmailIntegrations.length;

      this.page = 1;

      const isUpdate = this.isEdit;

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(

        isUpdate
          ? 'Gmail Integration updated successfully.'
          : 'Gmail Integration created successfully.'

      );

    }, 500);

  }







  edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.gmailIntegrations.find(
        x => x.gmailIntegrationId === id
      );

      if (selected) {

        this.gmail = {

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

          this.gmailIntegrations = this.gmailIntegrations.filter(
            x => x.gmailIntegrationId !== id
          );

          this.totalRecords = this.gmailIntegrations.length;

          if (
            this.page > 1 &&
            this.pagedGmailIntegrations.length === 0
          ) {

            this.page--;

          }

          this.gmailIntegrations = [...this.gmailIntegrations];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Gmail Integration deleted successfully.'
          );

        }, 500);

      }

    });

  }







  clear() {

    this.gmail = {

      gmailIntegrationId: 0,

      integrationName: '',

      gmailAccount: '',

      clientId: '',

      clientSecret: '',

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







  get filteredGmailIntegrations() {

    return this.gmailIntegrations.filter(x =>

      x.integrationName.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.gmailAccount.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.syncFrequency.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.status.toLowerCase().includes(this.searchText.toLowerCase())

    );

  }







  get pagedGmailIntegrations() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredGmailIntegrations.slice(

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
