import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-sms-campaigns',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './sms-campaigns.html',
  styleUrl: './sms-campaigns.css',
})
export class SmsCampaigns {
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
    smsTitle: '',
    senderId: '',
    template: '',
    targetAudience: '',
    scheduledDate: '',
    totalRecipients: '',
    deliveredCount: '',
    deliveryRate: '',
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
          campaignName: 'Festival Offer',
          smsTitle: 'Happy Diwali',
          senderId: 'CRM001',
          template: 'Festival Wishes',
          targetAudience: 'All Customers',
          scheduledDate: '2026-08-01',
          totalRecipients: 1000,
          deliveredCount: 980,
          deliveryRate: 98,
          status: 'Sent',
          message: 'Happy Diwali! Enjoy exclusive festive offers.',
          isActive: true
        },

        {
          campaignId: 2,
          campaignName: 'Payment Reminder',
          smsTitle: 'Invoice Due',
          senderId: 'CRM002',
          template: 'Payment Reminder',
          targetAudience: 'Existing Customers',
          scheduledDate: '2026-08-05',
          totalRecipients: 250,
          deliveredCount: 0,
          deliveryRate: 0,
          status: 'Scheduled',
          message: 'Your invoice is due. Please make payment before the due date.',
          isActive: true
        },

        {
          campaignId: 3,
          campaignName: 'Welcome Campaign',
          smsTitle: 'Welcome Customer',
          senderId: 'CRM003',
          template: 'Thank You Message',
          targetAudience: 'New Leads',
          scheduledDate: '2026-08-08',
          totalRecipients: 350,
          deliveredCount: 345,
          deliveryRate: 99,
          status: 'Completed',
          message: 'Welcome to our CRM family. Thank you for joining us.',
          isActive: true
        },

        {
          campaignId: 4,
          campaignName: 'CRM Webinar',
          smsTitle: 'Event Invitation',
          senderId: 'CRM004',
          template: 'Event Invitation',
          targetAudience: 'Prospects',
          scheduledDate: '2026-08-12',
          totalRecipients: 500,
          deliveredCount: 0,
          deliveryRate: 0,
          status: 'Draft',
          message: 'Join our live CRM webinar and discover new features.',
          isActive: true
        },

        {
          campaignId: 5,
          campaignName: 'Subscription Renewal',
          smsTitle: 'Renewal Reminder',
          senderId: 'CRM005',
          template: 'Renewal Reminder',
          targetAudience: 'Inactive Customers',
          scheduledDate: '2026-08-15',
          totalRecipients: 150,
          deliveredCount: 120,
          deliveryRate: 80,
          status: 'Sending',
          message: 'Renew your subscription today to continue enjoying our services.',
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
      !this.campaign.smsTitle ||
      !this.campaign.senderId ||
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
        ? 'SMS Campaign updated successfully.'
        : 'SMS Campaign created successfully.';

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
            'SMS Campaign deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.campaign = {

      campaignId: 0,
      campaignName: '',
      smsTitle: '',
      senderId: '',
      template: '',
      targetAudience: '',
      scheduledDate: '',
      totalRecipients: '',
      deliveredCount: '',
      deliveryRate: '',
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

      x.smsTitle
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.senderId
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
