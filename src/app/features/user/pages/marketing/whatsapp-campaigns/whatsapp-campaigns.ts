import { ChangeDetectorRef, Component } from '@angular/core';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';

@Component({
  selector: 'app-whatsapp-campaigns',
  standalone:true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './whatsapp-campaigns.html',
  styleUrl: './whatsapp-campaigns.css',
})
export class WhatsappCampaigns {
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
    template: '',
    businessNumber: '',
    targetAudience: '',
    scheduledDate: '',
    totalRecipients: '',
    deliveredCount: '',
    readRate: '',
    mediaType: '',
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
          campaignName: 'Festival Wishes',
          template: 'Festival Wishes',
          businessNumber: '+91 9876543210',
          targetAudience: 'All Customers',
          scheduledDate: '2026-08-01',
          totalRecipients: 1000,
          deliveredCount: 985,
          readRate: 92,
          mediaType: 'Image',
          status: 'Delivered',
          message: 'Happy Festival! Enjoy our special offers.',
          isActive: true
        },

        {
          campaignId: 2,
          campaignName: 'Product Launch',
          template: 'Product Launch',
          businessNumber: '+91 9876543211',
          targetAudience: 'Existing Customers',
          scheduledDate: '2026-08-05',
          totalRecipients: 650,
          deliveredCount: 0,
          readRate: 0,
          mediaType: 'Video',
          status: 'Scheduled',
          message: 'Introducing our latest CRM features.',
          isActive: true
        },

        {
          campaignId: 3,
          campaignName: 'Payment Reminder',
          template: 'Payment Reminder',
          businessNumber: '+91 9876543212',
          targetAudience: 'Inactive Customers',
          scheduledDate: '2026-08-08',
          totalRecipients: 300,
          deliveredCount: 180,
          readRate: 60,
          mediaType: 'Text',
          status: 'Sending',
          message: 'Your payment is due. Kindly renew today.',
          isActive: true
        },

        {
          campaignId: 4,
          campaignName: 'Welcome Customers',
          template: 'Welcome Message',
          businessNumber: '+91 9876543213',
          targetAudience: 'New Leads',
          scheduledDate: '2026-08-10',
          totalRecipients: 400,
          deliveredCount: 0,
          readRate: 0,
          mediaType: 'Document',
          status: 'Draft',
          message: 'Welcome to our CRM family.',
          isActive: true
        },

        {
          campaignId: 5,
          campaignName: 'Subscription Renewal',
          template: 'Renewal Reminder',
          businessNumber: '+91 9876543214',
          targetAudience: 'VIP Customers',
          scheduledDate: '2026-08-15',
          totalRecipients: 220,
          deliveredCount: 220,
          readRate: 97,
          mediaType: 'PDF',
          status: 'Sent',
          message: 'Please renew your subscription before expiry.',
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
      !this.campaign.template ||
      !this.campaign.businessNumber ||
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

      // Refresh table

      this.campaigns = [...this.campaigns];

      this.totalRecords = this.campaigns.length;

      this.page = 1;

      const message = this.isEdit

        ? 'WhatsApp Campaign updated successfully.'

        : 'WhatsApp Campaign created successfully.';

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
            'WhatsApp Campaign deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.campaign = {

      campaignId: 0,
      campaignName: '',
      template: '',
      businessNumber: '',
      targetAudience: '',
      scheduledDate: '',
      totalRecipients: '',
      deliveredCount: '',
      readRate: '',
      mediaType: '',
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

      x.template
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.businessNumber
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.targetAudience
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.mediaType
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
