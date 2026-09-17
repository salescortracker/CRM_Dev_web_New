import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { AuthService } from '../../../../../core/authentication/services/auth.service';
import { ControlsystemService } from '../../../../super-admin/services/controlsystem-service';

@Component({
  selector: 'app-whatsapp-campaigns',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './whatsapp-campaigns.html',
  styleUrl: './whatsapp-campaigns.css',
})
export class WhatsappCampaigns implements OnInit {

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
  whatsAppTemplates: any[] = [];

  //====================================================
  // WhatsApp Campaign List
  //====================================================

  campaigns: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  campaign: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      whatsAppCampaignId: 0,

      companyId: null,

      regionId: null,

      campaignName: '',

      marketingListId: null,

      whatsAppTemplateId: null,

      language: '',

      message: '',

      mediaUrl: '',

      mediaType: '',

      totalRecipients: 0,

      sentCount: 0,

      deliveredCount: 0,

      readCount: 0,

      repliedCount: 0,

      failedCount: 0,

      scheduledDate: '',

      status: 'Draft'

    };

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadCompanies();

    this.loadRegions();

    this.loadMarketingLists();

    this.loadWhatsAppTemplates();

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

  loadWhatsAppTemplates(): void {

    this.controlsystemService.getWhatsAppTemplates().subscribe({

      next: (res: any) => {

        this.whatsAppTemplates = res?.data || [];

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading WhatsApp templates:', err);

        this.whatsAppTemplates = [];

      }

    });

  }

  //====================================================
  // Load WhatsApp Campaigns
  //====================================================

  loadCampaigns(): void {

    this.spinner.show();

    this.controlsystemService.getWhatsAppCampaigns().subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success) {

          this.campaigns = res.data || [];

        } else {

          this.campaigns = [];

          this.alert.warning(
            res?.message || 'No WhatsApp campaign records found.'
          );

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Error loading WhatsApp campaigns:', err);

        this.campaigns = [];

        this.alert.error(
          err?.error?.message || 'Failed to load WhatsApp campaigns.'
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

  getWhatsAppTemplateName(id: any): string {

    if (!id) return '-';

    const item = this.whatsAppTemplates.find(
      x => x.whatsAppTemplateId === Number(id)
    );

    return item ? item.templateName : '-';

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
  // Read Rate Helper
  //====================================================

  getReadRate(item: any): number {

    const delivered = Number(item.deliveredCount || 0);

    if (!delivered) return 0;

    return Math.round((Number(item.readCount || 0) / delivered) * 100);

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
        (x.message || '').toLowerCase().includes(search) ||
        (x.mediaType || '').toLowerCase().includes(search) ||
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

  get sentCampaigns(): number {

    return this.campaigns.filter(
      x => x.status === 'Sent' || x.status === 'Delivered'
    ).length;

  }

  get scheduledCampaigns(): number {

    return this.campaigns.filter(x => x.status === 'Scheduled').length;

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

      whatsAppCampaignId: this.isEdit ? this.campaign.whatsAppCampaignId : 0,

      companyId: this.campaign.companyId ? Number(this.campaign.companyId) : null,

      regionId: this.campaign.regionId ? Number(this.campaign.regionId) : null,

      campaignName: this.campaign.campaignName.trim(),

      marketingListId: this.campaign.marketingListId
        ? Number(this.campaign.marketingListId)
        : null,

      whatsAppTemplateId: this.campaign.whatsAppTemplateId
        ? Number(this.campaign.whatsAppTemplateId)
        : null,

      language: this.campaign.language ? this.campaign.language.trim() : null,

      message: this.campaign.message ? this.campaign.message.trim() : null,

      mediaUrl: this.campaign.mediaUrl ? this.campaign.mediaUrl.trim() : null,

      mediaType: this.campaign.mediaType ? this.campaign.mediaType.trim() : null,

      totalRecipients: Number(this.campaign.totalRecipients) || 0,

      sentCount: Number(this.campaign.sentCount) || 0,

      deliveredCount: Number(this.campaign.deliveredCount) || 0,

      readCount: Number(this.campaign.readCount) || 0,

      repliedCount: Number(this.campaign.repliedCount) || 0,

      failedCount: Number(this.campaign.failedCount) || 0,

      scheduledDate: this.campaign.scheduledDate || null,

      status: this.campaign.status ? this.campaign.status.trim() : ''

    };

    this.spinner.show();

    if (this.isEdit) {

      this.controlsystemService.updateWhatsAppCampaign(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'WhatsApp Campaign updated successfully.'
            );

            this.clear();

            this.loadCampaigns();

          } else {

            this.alert.warning(
              res?.message || 'Failed to update WhatsApp campaign.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Update WhatsApp campaign error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to update WhatsApp campaign.'
          );

        }

      });

    } else {

      this.controlsystemService.createWhatsAppCampaign(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'WhatsApp Campaign created successfully.'
            );

            this.clear();

            this.loadCampaigns();

          } else {

            this.alert.warning(
              res?.message || 'Failed to create WhatsApp campaign.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Create WhatsApp campaign error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to create WhatsApp campaign.'
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

    this.controlsystemService.getWhatsAppCampaignById(id).subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success && res.data) {

          const data = res.data;

          this.campaign = {

            whatsAppCampaignId: data.whatsAppCampaignId,

            companyId: data.companyId,

            regionId: data.regionId,

            campaignName: data.campaignName || '',

            marketingListId: data.marketingListId,

            whatsAppTemplateId: data.whatsAppTemplateId,

            language: data.language || '',

            message: data.message || '',

            mediaUrl: data.mediaUrl || '',

            mediaType: data.mediaType || '',

            totalRecipients: data.totalRecipients ?? 0,

            sentCount: data.sentCount ?? 0,

            deliveredCount: data.deliveredCount ?? 0,

            readCount: data.readCount ?? 0,

            repliedCount: data.repliedCount ?? 0,

            failedCount: data.failedCount ?? 0,

            scheduledDate: data.scheduledDate
              ? data.scheduledDate.substring(0, 10)
              : '',

            status: data.status || 'Draft'

          };

          this.isEdit = true;

          this.submitted = false;

          this.cd.detectChanges();

        } else {

          this.alert.warning(res?.message || 'WhatsApp Campaign not found.');

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Get WhatsApp campaign error:', err);

        this.alert.error(
          err?.error?.message || 'Failed to load WhatsApp campaign.'
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

      this.controlsystemService.deleteWhatsAppCampaign(id).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'WhatsApp Campaign deleted successfully.'
            );

            if (this.page > 1 && this.pagedCampaigns.length === 1) {
              this.page = this.page - 1;
            }

            this.loadCampaigns();

          } else {

            this.alert.warning(
              res?.message || 'Failed to delete WhatsApp campaign.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Delete WhatsApp campaign error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to delete WhatsApp campaign.'
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
