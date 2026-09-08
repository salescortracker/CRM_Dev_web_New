import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-zoom',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './zoom.html',
  styleUrl: './zoom.css',
})
export class Zoom {
   submitted = false;

  isEdit = false;

  page = 1;

  pageSize = 5;

  totalRecords = 0;

  searchText = '';



  zoomIntegrations: any[] = [];



  zoom: any = {

    zoomIntegrationId: 0,

    integrationName: '',

    zoomAccount: '',

    clientId: '',

    clientSecret: '',

    accountId: '',

    redirectUri: '',

    meetingTemplate: '',

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

    this.loadZoomIntegrations();

  }



  loadZoomIntegrations() {

    this.spinner.show();

    setTimeout(() => {

      this.zoomIntegrations = [

        {

          zoomIntegrationId: 1,

          integrationName: 'Sales Zoom',

          zoomAccount: 'sales@company.com',

          clientId: 'ZOOM_CLIENT_001',

          clientSecret: 'ZOOM_SECRET_001',

          accountId: 'ACCOUNT001',

          redirectUri: 'https://crm.company.com/auth/zoom/callback',

          meetingTemplate: 'Sales Meeting',

          syncFrequency: 'Every 15 Minutes',

          lastSyncDate: '2026-08-06T09:30',

          status: 'Connected',

          description: 'Zoom integration for Sales department meetings.',

          isActive: true

        },



        {

          zoomIntegrationId: 2,

          integrationName: 'Support Zoom',

          zoomAccount: 'support@company.com',

          clientId: 'ZOOM_CLIENT_002',

          clientSecret: 'ZOOM_SECRET_002',

          accountId: 'ACCOUNT002',

          redirectUri: 'https://crm.company.com/auth/zoom/callback',

          meetingTemplate: 'Support Call',

          syncFrequency: 'Hourly',

          lastSyncDate: '2026-08-06T08:00',

          status: 'Connected',

          description: 'Zoom meetings for customer support.',

          isActive: true

        },



        {

          zoomIntegrationId: 3,

          integrationName: 'HR Zoom',

          zoomAccount: 'hr@company.com',

          clientId: 'ZOOM_CLIENT_003',

          clientSecret: 'ZOOM_SECRET_003',

          accountId: 'ACCOUNT003',

          redirectUri: 'https://crm.company.com/auth/zoom/callback',

          meetingTemplate: 'Interview Session',

          syncFrequency: 'Daily',

          lastSyncDate: '2026-08-05T18:00',

          status: 'Pending',

          description: 'HR Zoom integration for interviews and onboarding.',

          isActive: true

        },
                {

          zoomIntegrationId: 4,

          integrationName: 'Marketing Zoom',

          zoomAccount: 'marketing@company.com',

          clientId: 'ZOOM_CLIENT_004',

          clientSecret: 'ZOOM_SECRET_004',

          accountId: 'ACCOUNT004',

          redirectUri: 'https://crm.company.com/auth/zoom/callback',

          meetingTemplate: 'Campaign Review',

          syncFrequency: 'Every 30 Minutes',

          lastSyncDate: '2026-08-05T14:30',

          status: 'Error',

          description: 'Zoom integration for marketing campaign meetings.',

          isActive: false

        },



        {

          zoomIntegrationId: 5,

          integrationName: 'Accounts Zoom',

          zoomAccount: 'accounts@company.com',

          clientId: 'ZOOM_CLIENT_005',

          clientSecret: 'ZOOM_SECRET_005',

          accountId: 'ACCOUNT005',

          redirectUri: 'https://crm.company.com/auth/zoom/callback',

          meetingTemplate: 'Finance Review',

          syncFrequency: 'Every 5 Minutes',

          lastSyncDate: '2026-08-06T09:55',

          status: 'Disconnected',

          description: 'Zoom integration for finance and accounts meetings.',

          isActive: false

        }

      ];



      this.zoomIntegrations.sort(

        (a, b) => b.zoomIntegrationId - a.zoomIntegrationId

      );



      this.totalRecords = this.zoomIntegrations.length;



      this.spinner.hide();



      this.cd.detectChanges();



    }, 500);

  }
    saveZoomIntegration() {

    this.submitted = true;

    if (
      !this.zoom.integrationName ||
      !this.zoom.zoomAccount ||
      !this.zoom.clientId ||
      !this.zoom.clientSecret ||
      !this.zoom.accountId ||
      !this.zoom.redirectUri ||
      !this.zoom.syncFrequency ||
      !this.zoom.status
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newZoom = {

          ...this.zoom,

          zoomIntegrationId: this.zoomIntegrations.length
            ? Math.max(...this.zoomIntegrations.map(x => x.zoomIntegrationId)) + 1
            : 1

        };

        this.zoomIntegrations.unshift(newZoom);

      } else {

        const index = this.zoomIntegrations.findIndex(
          x => x.zoomIntegrationId === this.zoom.zoomIntegrationId
        );

        if (index !== -1) {

          this.zoomIntegrations[index] = {

            ...this.zoom

          };

        }

      }

      this.zoomIntegrations = [...this.zoomIntegrations];

      this.totalRecords = this.zoomIntegrations.length;

      this.page = 1;

      const isUpdate = this.isEdit;

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(

        isUpdate
          ? 'Zoom Integration updated successfully.'
          : 'Zoom Integration created successfully.'

      );

    }, 500);

  }







  edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.zoomIntegrations.find(
        x => x.zoomIntegrationId === id
      );

      if (selected) {

        this.zoom = {

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

          this.zoomIntegrations = this.zoomIntegrations.filter(
            x => x.zoomIntegrationId !== id
          );

          this.totalRecords = this.zoomIntegrations.length;

          if (
            this.page > 1 &&
            this.pagedZoomIntegrations.length === 0
          ) {

            this.page--;

          }

          this.zoomIntegrations = [...this.zoomIntegrations];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Zoom Integration deleted successfully.'
          );

        }, 500);

      }

    });

  }







  clear() {

    this.zoom = {

      zoomIntegrationId: 0,

      integrationName: '',

      zoomAccount: '',

      clientId: '',

      clientSecret: '',

      accountId: '',

      redirectUri: '',

      meetingTemplate: '',

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







  get filteredZoomIntegrations() {

    return this.zoomIntegrations.filter(x =>

      x.integrationName.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.zoomAccount.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.meetingTemplate.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.syncFrequency.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.status.toLowerCase().includes(this.searchText.toLowerCase())

    );

  }







  get pagedZoomIntegrations() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredZoomIntegrations.slice(

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
