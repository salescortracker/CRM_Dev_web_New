import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-company-webhooks',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './company-webhooks.html',
  styleUrl: './company-webhooks.css',
})
export class CompanyWebhooks {
   submitted = false;

  isEdit = false;

  page = 1;

  pageSize = 5;

  totalRecords = 0;

  searchText = '';



  companyWebhooks: any[] = [];



  webhook: any = {

    webhookId: 0,

    webhookName: '',

    webhookCode: '',

    eventType: '',

    httpMethod: '',

    endpointUrl: '',

    secretToken: '',

    retryCount: 0,

    timeoutSeconds: 30,

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

    this.loadCompanyWebhooks();

  }



  loadCompanyWebhooks() {

    this.spinner.show();

    setTimeout(() => {

      this.companyWebhooks = [

        {

          webhookId: 1,

          webhookName: 'Lead Creation Webhook',

          webhookCode: 'WEB001',

          eventType: 'Lead Created',

          httpMethod: 'POST',

          endpointUrl: 'https://crm.company.com/api/webhooks/leads',

          secretToken: 'lead_secret_001',

          retryCount: 3,

          timeoutSeconds: 30,

          status: 'Active',

          description: 'Triggers whenever a new lead is created.',

          isActive: true

        },

        {

          webhookId: 2,

          webhookName: 'Deal Update Webhook',

          webhookCode: 'WEB002',

          eventType: 'Deal Won',

          httpMethod: 'POST',

          endpointUrl: 'https://crm.company.com/api/webhooks/deals',

          secretToken: 'deal_secret_002',

          retryCount: 5,

          timeoutSeconds: 60,

          status: 'Active',

          description: 'Sends notifications when a deal is marked as won.',

          isActive: true

        },

        {

          webhookId: 3,

          webhookName: 'Ticket Notification',

          webhookCode: 'WEB003',

          eventType: 'Ticket Created',

          httpMethod: 'POST',

          endpointUrl: 'https://crm.company.com/api/webhooks/tickets',

          secretToken: 'ticket_secret_003',

          retryCount: 2,

          timeoutSeconds: 45,

          status: 'Active',

          description: 'Creates external notifications for new support tickets.',

          isActive: true

        },
                {

          webhookId: 4,

          webhookName: 'Invoice Payment Hook',

          webhookCode: 'WEB004',

          eventType: 'Invoice Paid',

          httpMethod: 'PUT',

          endpointUrl: 'https://crm.company.com/api/webhooks/invoices',

          secretToken: 'invoice_secret_004',

          retryCount: 3,

          timeoutSeconds: 60,

          status: 'Failed',

          description: 'Invoked after successful invoice payment.',

          isActive: false

        },



        {

          webhookId: 5,

          webhookName: 'Contact Sync Hook',

          webhookCode: 'WEB005',

          eventType: 'Contact Created',

          httpMethod: 'PATCH',

          endpointUrl: 'https://crm.company.com/api/webhooks/contacts',

          secretToken: 'contact_secret_005',

          retryCount: 5,

          timeoutSeconds: 90,

          status: 'Disabled',

          description: 'Synchronizes newly created contacts with external systems.',

          isActive: false

        }

      ];



      this.companyWebhooks.sort(

        (a, b) => b.webhookId - a.webhookId

      );



      this.totalRecords = this.companyWebhooks.length;



      this.spinner.hide();



      this.cd.detectChanges();



    }, 500);

  }
    saveCompanyWebhook() {

    this.submitted = true;

    if (
      !this.webhook.webhookName ||
      !this.webhook.webhookCode ||
      !this.webhook.eventType ||
      !this.webhook.httpMethod ||
      !this.webhook.endpointUrl ||
      !this.webhook.status
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newWebhook = {

          ...this.webhook,

          webhookId: this.companyWebhooks.length
            ? Math.max(...this.companyWebhooks.map(x => x.webhookId)) + 1
            : 1

        };

        this.companyWebhooks.unshift(newWebhook);

      }
      else {

        const index = this.companyWebhooks.findIndex(
          x => x.webhookId === this.webhook.webhookId
        );

        if (index !== -1) {

          this.companyWebhooks[index] = {
            ...this.webhook
          };

        }

      }

      this.companyWebhooks = [...this.companyWebhooks];

      this.totalRecords = this.companyWebhooks.length;

      this.page = 1;

      const isUpdate = this.isEdit;

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(
        isUpdate
          ? 'Company Webhook updated successfully.'
          : 'Company Webhook created successfully.'
      );

    }, 500);

  }







  edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.companyWebhooks.find(
        x => x.webhookId === id
      );

      if (selected) {

        this.webhook = {

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

          this.companyWebhooks = this.companyWebhooks.filter(
            x => x.webhookId !== id
          );

          this.totalRecords = this.companyWebhooks.length;

          if (
            this.page > 1 &&
            this.pagedCompanyWebhooks.length === 0
          ) {
            this.page--;
          }

          this.companyWebhooks = [...this.companyWebhooks];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Company Webhook deleted successfully.'
          );

        }, 500);

      }

    });

  }







  clear() {

    this.webhook = {

      webhookId: 0,

      webhookName: '',

      webhookCode: '',

      eventType: '',

      httpMethod: '',

      endpointUrl: '',

      secretToken: '',

      retryCount: 0,

      timeoutSeconds: 30,

      status: '',

      description: '',

      isActive: true

    };

    this.submitted = false;

    this.isEdit = false;

    this.cd.detectChanges();

  }







  get filteredCompanyWebhooks() {

    return this.companyWebhooks.filter(x =>

      x.webhookName.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.webhookCode.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.eventType.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.httpMethod.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.endpointUrl.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.status.toLowerCase().includes(this.searchText.toLowerCase())

    );

  }







  get pagedCompanyWebhooks() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredCompanyWebhooks.slice(
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
