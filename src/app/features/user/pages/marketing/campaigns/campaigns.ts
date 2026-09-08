import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './campaigns.html',
  styleUrl: './campaigns.css',
})
export class Campaigns {
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
    campaignType: '',
    channel: '',
    targetAudience: '',
    budget: '',
    owner: '',
    startDate: '',
    endDate: '',
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

    this.loadCampaigns();

  }

  loadCampaigns() {

    this.spinner.show();

    setTimeout(() => {

      this.campaigns = [

        {
          campaignId: 1,
          campaignName: 'Summer Sale Campaign',
          campaignType: 'Promotional',
          channel: 'Email',
          targetAudience: 'Existing Customers',
          budget: 5000,
          owner: 'Rahul Sharma',
          startDate: '2026-08-01',
          endDate: '2026-08-15',
          status: 'Active',
          description: 'Special summer discount campaign.',
          isActive: true
        },

        {
          campaignId: 2,
          campaignName: 'CRM Product Launch',
          campaignType: 'Product Launch',
          channel: 'LinkedIn',
          targetAudience: 'New Leads',
          budget: 12000,
          owner: 'Priya Reddy',
          startDate: '2026-08-05',
          endDate: '2026-08-25',
          status: 'Planned',
          description: 'Launch campaign for CRM platform.',
          isActive: true
        },

        {
          campaignId: 3,
          campaignName: 'Festival Offer',
          campaignType: 'Seasonal Offer',
          channel: 'WhatsApp',
          targetAudience: 'All Customers',
          budget: 8000,
          owner: 'Arjun Kumar',
          startDate: '2026-09-01',
          endDate: '2026-09-10',
          status: 'Completed',
          description: 'Festival promotional campaign.',
          isActive: true
        },

        {
          campaignId: 4,
          campaignName: 'Lead Generation Drive',
          campaignType: 'Lead Generation',
          channel: 'Google Ads',
          targetAudience: 'Prospects',
          budget: 15000,
          owner: 'Sneha Patel',
          startDate: '2026-08-12',
          endDate: '2026-09-05',
          status: 'Active',
          description: 'Generate quality CRM leads.',
          isActive: true
        },

        {
          campaignId: 5,
          campaignName: 'Brand Awareness',
          campaignType: 'Brand Awareness',
          channel: 'Facebook',
          targetAudience: 'All Customers',
          budget: 10000,
          owner: 'Kiran Verma',
          startDate: '2026-08-20',
          endDate: '2026-09-20',
          status: 'Cancelled',
          description: 'Increase CRM brand visibility.',
          isActive: false
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
      !this.campaign.campaignType ||
      !this.campaign.channel ||
      !this.campaign.owner ||
      !this.campaign.startDate ||
      !this.campaign.endDate ||
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
        ? 'Campaign updated successfully.'
        : 'Campaign created successfully.';

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
            'Campaign deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.campaign = {

      campaignId: 0,
      campaignName: '',
      campaignType: '',
      channel: '',
      targetAudience: '',
      budget: '',
      owner: '',
      startDate: '',
      endDate: '',
      status: '',
      description: '',
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

      x.campaignType
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.channel
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.owner
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
