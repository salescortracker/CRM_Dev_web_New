import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';
import { AuthService } from '../../../../../core/authentication/services/auth.service';
import { ControlsystemService } from '../../../../super-admin/services/controlsystem-service';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './campaigns.html',
  styleUrl: './campaigns.css',
})
export class Campaigns implements OnInit {

  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private controlsystemService: ControlsystemService
  ) { }

  //====================================================
  // Screen Variables
  //====================================================

  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 10;

  searchText = '';
  companyFilter = '';
  statusFilter = '';

  //====================================================
  // Dropdown Data (from backend)
  //====================================================

  companies: any[] = [];
  regions: any[] = [];
  marketingLists: any[] = [];

  //====================================================
  // Campaign List
  //====================================================

  campaigns: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  campaign: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      campaignId: 0,

      companyId: null,

      regionId: null,

      campaignName: '',

      campaignType: '',

      marketingListId: null,

      totalRecipients: 0,

      startDate: '',

      endDate: '',

      status: 'Planned'

    };

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadCompanies();

    this.loadRegions();

    this.loadMarketingLists();

    this.loadCampaigns();

  }

  //====================================================
  // Load Dropdown Data
  //====================================================

  loadCompanies(): void {

    this.authService.getCompanies().subscribe({

      next: (res: any) => {

        this.companies = (res?.data || []).filter(
          (x: any) => x.isActive !== false
        );

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading companies:', err);

        this.companies = [];

      }

    });

  }

  loadRegions(): void {

    this.authService.getRegions().subscribe({

      next: (res: any) => {

        this.regions = (res?.data || []).filter(
          (x: any) => x.isActive !== false
        );

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading regions:', err);

        this.regions = [];

      }

    });

  }

  loadMarketingLists(): void {

    this.controlsystemService.getMarketingLists().subscribe({

      next: (res: any) => {

        this.marketingLists = res?.data || [];

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading marketing lists:', err);

        this.marketingLists = [];

      }

    });

  }

  //====================================================
  // Load Campaigns
  //====================================================

  loadCampaigns(): void {

    this.spinner.show();

    this.controlsystemService.getCampaigns().subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success) {

          this.campaigns = res.data || [];

        } else {

          this.campaigns = [];

          this.alert.warning(
            res?.message || 'No campaign records found.'
          );

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Error loading campaigns:', err);

        this.campaigns = [];

        this.alert.error(
          err?.error?.message || 'Failed to load campaigns.'
        );

        this.cd.detectChanges();

      }

    });

  }

  //====================================================
  // Lookup Helpers (Display Names)
  //====================================================

  getCompanyName(id: any): string {

    if (!id) return '-';

    const item = this.companies.find(x => x.companyId === Number(id));

    return item ? item.companyName : '-';

  }

  getRegionName(id: any): string {

    if (!id) return '-';

    const item = this.regions.find(x => x.regionId === Number(id));

    return item ? item.regionName : '-';

  }

  getMarketingListName(id: any): string {

    if (!id) return '-';

    const item = this.marketingLists.find(
      x => x.marketingListId === Number(id)
    );

    return item ? item.listName : '-';

  }

  //====================================================
  // Cascading Dropdown
  //====================================================

  get formRegions(): any[] {

    if (!this.campaign.companyId) return this.regions;

    return this.regions.filter(
      x => x.companyId === Number(this.campaign.companyId)
    );

  }

  onCompanyChange(): void {

    this.campaign.regionId = null;

  }

  //====================================================
  // Filtered Campaigns
  //====================================================

  get filteredCampaigns() {

    return this.campaigns.filter(x => {

      const search = this.searchText.trim().toLowerCase();

      const matchSearch =
        !search ||
        (x.campaignName || '').toLowerCase().includes(search) ||
        (x.campaignType || '').toLowerCase().includes(search) ||
        (x.status || '').toLowerCase().includes(search);

      const matchCompany =
        !this.companyFilter ||
        Number(x.companyId) === Number(this.companyFilter);

      const matchStatus =
        !this.statusFilter ||
        x.status === this.statusFilter;

      return matchSearch && matchCompany && matchStatus;

    });

  }

  //====================================================
  // Pagination
  //====================================================

  get pagedCampaigns() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredCampaigns.slice(start, start + this.pageSize);

  }

  //====================================================
  // Statistics
  //====================================================

  get totalCampaigns(): number {

    return this.campaigns.length;

  }

  get activeCampaigns(): number {

    return this.campaigns.filter(x => x.status === 'Active').length;

  }

  get completedCampaigns(): number {

    return this.campaigns.filter(x => x.status === 'Completed').length;

  }

  get totalRecipientsCount(): number {

    return this.campaigns.reduce(
      (total, item) => total + Number(item.totalRecipients || 0),
      0
    );

  }

  //====================================================
  // Save / Update
  //====================================================

  saveCampaign(): void {

    this.submitted = true;

    if (
      !this.campaign.campaignName ||
      !this.campaign.campaignName.trim()
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    const payload = {

      campaignId: this.isEdit ? this.campaign.campaignId : 0,

      companyId: this.campaign.companyId ? Number(this.campaign.companyId) : null,

      regionId: this.campaign.regionId ? Number(this.campaign.regionId) : null,

      campaignName: this.campaign.campaignName.trim(),

      campaignType: this.campaign.campaignType
        ? this.campaign.campaignType.trim()
        : '',

      marketingListId: this.campaign.marketingListId
        ? Number(this.campaign.marketingListId)
        : null,

      totalRecipients: this.campaign.totalRecipients
        ? Number(this.campaign.totalRecipients)
        : 0,

      startDate: this.campaign.startDate || null,

      endDate: this.campaign.endDate || null,

      status: this.campaign.status ? this.campaign.status.trim() : ''

    };

    this.spinner.show();

    if (this.isEdit) {

      this.controlsystemService.updateCampaign(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Campaign updated successfully.'
            );

            this.clear();

            this.loadCampaigns();

          } else {

            this.alert.warning(
              res?.message || 'Failed to update campaign.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Update campaign error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to update campaign.'
          );

        }

      });

    } else {

      this.controlsystemService.createCampaign(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Campaign created successfully.'
            );

            this.clear();

            this.loadCampaigns();

          } else {

            this.alert.warning(
              res?.message || 'Failed to create campaign.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Create campaign error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to create campaign.'
          );

        }

      });

    }

  }

  //====================================================
  // Edit
  //====================================================

  edit(id: number): void {

    this.spinner.show();

    this.controlsystemService.getCampaignById(id).subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success && res.data) {

          const data = res.data;

          this.campaign = {

            campaignId: data.campaignId,

            companyId: data.companyId,

            regionId: data.regionId,

            campaignName: data.campaignName || '',

            campaignType: data.campaignType || '',

            marketingListId: data.marketingListId,

            totalRecipients: data.totalRecipients ?? 0,

            startDate: data.startDate ? data.startDate.substring(0, 10) : '',

            endDate: data.endDate ? data.endDate.substring(0, 10) : '',

            status: data.status || 'Planned'

          };

          this.isEdit = true;

          this.submitted = false;

          this.cd.detectChanges();

        } else {

          this.alert.warning(res?.message || 'Campaign not found.');

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Get campaign error:', err);

        this.alert.error(
          err?.error?.message || 'Failed to load campaign.'
        );

      }

    });

  }

  //====================================================
  // Delete
  //====================================================

  delete(id: number): void {

    this.alert.deleteConfirm().then(result => {

      if (!result.isConfirmed) return;

      this.spinner.show();

      this.controlsystemService.deleteCampaign(id).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Campaign deleted successfully.'
            );

            if (this.page > 1 && this.pagedCampaigns.length === 1) {
              this.page = this.page - 1;
            }

            this.loadCampaigns();

          } else {

            this.alert.warning(
              res?.message || 'Failed to delete campaign.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Delete campaign error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to delete campaign.'
          );

        }

      });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.campaign = this.getEmptyModel();

    this.submitted = false;

    this.isEdit = false;

  }

  //====================================================
  // Clear Filters
  //====================================================

  clearFilters(): void {

    this.searchText = '';

    this.companyFilter = '';

    this.statusFilter = '';

    this.page = 1;

  }

  //====================================================
  // Pagination
  //====================================================

  changePage(page: number): void {

    this.page = page;

  }

  changePageSize(size: number): void {

    this.pageSize = size;

    this.page = 1;

  }

  //====================================================
  // Refresh
  //====================================================

  refresh(): void {

    this.page = 1;

    this.loadCampaigns();

  }

}
