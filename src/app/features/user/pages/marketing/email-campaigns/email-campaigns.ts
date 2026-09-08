import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-email-campaigns',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './email-campaigns.html',
  styleUrl: './email-campaigns.css',
})
export class EmailCampaigns {
   submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = '';

  campaigns: any[] = [];

  campaign: any = {

    campaignId: 0,
    campaignName: '',
    emailSubject: '',
    senderEmail: '',
    template: '',
    targetAudience: '',
    scheduledDate: '',
    totalRecipients: '',
    deliveredCount: '',
    openRate: '',
    status: '',
    message: '',
    isActive: true

  };

  constructor(

    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef

  ) { }

  ngOnInit(): void {

    this.loadCampaigns();

  }

  loadCampaigns() {

    this.spinner.show();

    setTimeout(() => {

      this.campaigns = [

        {
          campaignId: 1,
          campaignName: 'Summer Sale',
          emailSubject: 'Flat 30% Discount on CRM Plans',
          senderEmail: 'marketing@crm.com',
          template: 'Promotional Offer',
          targetAudience: 'Existing Customers',
          scheduledDate: '2026-08-01',
          totalRecipients: 500,
          deliveredCount: 495,
          openRate: 82,
          status: 'Sent',
          message: 'Enjoy our exclusive summer offer.',
          isActive: true
        },

        {
          campaignId: 2,
          campaignName: 'CRM Launch',
          emailSubject: 'Welcome to Our CRM',
          senderEmail: 'sales@crm.com',
          template: 'Product Launch',
          targetAudience: 'New Leads',
          scheduledDate: '2026-08-05',
          totalRecipients: 300,
          deliveredCount: 0,
          openRate: 0,
          status: 'Scheduled',
          message: 'Introducing our new CRM platform.',
          isActive: true
        },

        {
          campaignId: 3,
          campaignName: 'August Newsletter',
          emailSubject: 'Monthly Product Updates',
          senderEmail: 'newsletter@crm.com',
          template: 'Newsletter',
          targetAudience: 'All Customers',
          scheduledDate: '2026-08-10',
          totalRecipients: 850,
          deliveredCount: 845,
          openRate: 76,
          status: 'Completed',
          message: 'Latest updates and feature releases.',
          isActive: true
        },

        {
          campaignId: 4,
          campaignName: 'Subscription Renewal',
          emailSubject: 'Renew Your Subscription',
          senderEmail: 'support@crm.com',
          template: 'Renewal Reminder',
          targetAudience: 'Inactive Customers',
          scheduledDate: '2026-08-12',
          totalRecipients: 150,
          deliveredCount: 120,
          openRate: 63,
          status: 'Sending',
          message: 'Renew today to continue enjoying CRM services.',
          isActive: true
        },

        {
          campaignId: 5,
          campaignName: 'Welcome Campaign',
          emailSubject: 'Welcome to Our Family',
          senderEmail: 'welcome@crm.com',
          template: 'Welcome Email',
          targetAudience: 'Prospects',
          scheduledDate: '2026-08-15',
          totalRecipients: 250,
          deliveredCount: 0,
          openRate: 0,
          status: 'Draft',
          message: 'Warm welcome email for new prospects.',
          isActive: true
        }

      ];

      this.campaigns.sort((a, b) => b.campaignId - a.campaignId);

      this.totalRecords = this.campaigns.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }

  saveCampaign() {

    this.submitted = true;

    if (

      !this.campaign.campaignName ||
      !this.campaign.emailSubject ||
      !this.campaign.senderEmail ||
      !this.campaign.scheduledDate ||
      !this.campaign.status

    ) {

      return;

    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newCampaign = {

          ...this.campaign,

          campaignId: this.campaigns.length
            ? Math.max(...this.campaigns.map(x => x.campaignId)) + 1
            : 1

        };

        this.campaigns.unshift(newCampaign);

      }

      else {

        const index = this.campaigns.findIndex(

          x => x.campaignId === this.campaign.campaignId

        );

        if (index !== -1) {

          this.campaigns[index] = {

            ...this.campaign

          };

        }

      }

      // Refresh table immediately

      this.campaigns = [...this.campaigns];

      this.totalRecords = this.campaigns.length;

      this.page = 1;

      const message = this.isEdit
        ? 'Email Campaign updated successfully.'
        : 'Email Campaign created successfully.';

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(message);

    }, 500);

  }
    edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.campaigns.find(
        x => x.campaignId === id
      );

      if (selected) {

        this.campaign = {
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

          this.campaigns = this.campaigns.filter(
            x => x.campaignId !== id
          );

          this.totalRecords = this.campaigns.length;

          if (
            this.page > 1 &&
            this.pagedCampaigns.length === 0
          ) {

            this.page--;

          }

          // Refresh table immediately

          this.campaigns = [...this.campaigns];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Email Campaign deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.campaign = {

      campaignId: 0,
      campaignName: '',
      emailSubject: '',
      senderEmail: '',
      template: '',
      targetAudience: '',
      scheduledDate: '',
      totalRecipients: '',
      deliveredCount: '',
      openRate: '',
      status: '',
      message: '',
      isActive: true

    };

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredCampaigns() {

    return this.campaigns.filter(x =>

      x.campaignName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.emailSubject
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.senderEmail
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.template
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.targetAudience
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.status
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

    );

  }

  get pagedCampaigns() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredCampaigns.slice(

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
