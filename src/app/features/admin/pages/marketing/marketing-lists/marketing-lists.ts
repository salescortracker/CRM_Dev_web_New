import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';
import { AuthService } from '../../../../../core/authentication/services/auth.service';
import { ControlsystemService } from '../../../../super-admin/services/controlsystem-service';

@Component({
  selector: 'app-marketing-lists',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './marketing-lists.html',
  styleUrl: './marketing-lists.css',
})
export class MarketingLists implements OnInit {

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

  //====================================================
  // Marketing List Records
  //====================================================

  marketingLists: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  marketingList: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      marketingListId: 0,

      companyId: null,

      regionId: null,

      listName: '',

      description: '',

      listType: '',

      source: '',

      totalContacts: 0,

      activeContacts: 0,

      status: 'Active'

    };

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadCompanies();

    this.loadRegions();

    this.loadMarketingLists();

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

  //====================================================
  // Load Marketing Lists
  //====================================================

  loadMarketingLists(): void {

    this.spinner.show();

    this.controlsystemService.getMarketingLists().subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success) {

          this.marketingLists = res.data || [];

        } else {

          this.marketingLists = [];

          this.alert.warning(
            res?.message || 'No marketing list records found.'
          );

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Error loading marketing lists:', err);

        this.marketingLists = [];

        this.alert.error(
          err?.error?.message || 'Failed to load marketing lists.'
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

  //====================================================
  // Cascading Dropdown
  //====================================================

  get formRegions(): any[] {

    if (!this.marketingList.companyId) return this.regions;

    return this.regions.filter(
      x => x.companyId === Number(this.marketingList.companyId)
    );

  }

  onCompanyChange(): void {

    this.marketingList.regionId = null;

  }

  //====================================================
  // Filtered Marketing Lists
  //====================================================

  get filteredMarketingLists() {

    return this.marketingLists.filter(x => {

      const search = this.searchText.trim().toLowerCase();

      const matchSearch =
        !search ||
        (x.listName || '').toLowerCase().includes(search) ||
        (x.listType || '').toLowerCase().includes(search) ||
        (x.source || '').toLowerCase().includes(search) ||
        (x.description || '').toLowerCase().includes(search);

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

  get pagedMarketingLists() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredMarketingLists.slice(start, start + this.pageSize);

  }

  //====================================================
  // Statistics
  //====================================================

  get totalLists(): number {

    return this.marketingLists.length;

  }

  get activeLists(): number {

    return this.marketingLists.filter(x => x.status === 'Active').length;

  }

  get archivedLists(): number {

    return this.marketingLists.filter(x => x.status === 'Archived').length;

  }

  get totalContactsCount(): number {

    return this.marketingLists.reduce(
      (total, item) => total + Number(item.totalContacts || 0),
      0
    );

  }

  //====================================================
  // Save / Update
  //====================================================

  saveMarketingList(): void {

    this.submitted = true;

    if (
      !this.marketingList.listName ||
      !this.marketingList.listName.trim()
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    const payload = {

      marketingListId: this.isEdit ? this.marketingList.marketingListId : 0,

      companyId: this.marketingList.companyId
        ? Number(this.marketingList.companyId)
        : null,

      regionId: this.marketingList.regionId
        ? Number(this.marketingList.regionId)
        : null,

      listName: this.marketingList.listName.trim(),

      description: this.marketingList.description
        ? this.marketingList.description.trim()
        : null,

      listType: this.marketingList.listType
        ? this.marketingList.listType.trim()
        : '',

      source: this.marketingList.source
        ? this.marketingList.source.trim()
        : null,

      totalContacts: Number(this.marketingList.totalContacts) || 0,

      activeContacts: Number(this.marketingList.activeContacts) || 0,

      status: this.marketingList.status
        ? this.marketingList.status.trim()
        : ''

    };

    this.spinner.show();

    if (this.isEdit) {

      this.controlsystemService.updateMarketingList(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Marketing List updated successfully.'
            );

            this.clear();

            this.loadMarketingLists();

          } else {

            this.alert.warning(
              res?.message || 'Failed to update marketing list.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Update marketing list error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to update marketing list.'
          );

        }

      });

    } else {

      this.controlsystemService.createMarketingList(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Marketing List created successfully.'
            );

            this.clear();

            this.loadMarketingLists();

          } else {

            this.alert.warning(
              res?.message || 'Failed to create marketing list.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Create marketing list error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to create marketing list.'
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

    this.controlsystemService.getMarketingListById(id).subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success && res.data) {

          const data = res.data;

          this.marketingList = {

            marketingListId: data.marketingListId,

            companyId: data.companyId,

            regionId: data.regionId,

            listName: data.listName || '',

            description: data.description || '',

            listType: data.listType || '',

            source: data.source || '',

            totalContacts: data.totalContacts ?? 0,

            activeContacts: data.activeContacts ?? 0,

            status: data.status || 'Active'

          };

          this.isEdit = true;

          this.submitted = false;

          this.cd.detectChanges();

        } else {

          this.alert.warning(res?.message || 'Marketing List not found.');

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Get marketing list error:', err);

        this.alert.error(
          err?.error?.message || 'Failed to load marketing list.'
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

      this.controlsystemService.deleteMarketingList(id).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Marketing List deleted successfully.'
            );

            if (this.page > 1 && this.pagedMarketingLists.length === 1) {
              this.page = this.page - 1;
            }

            this.loadMarketingLists();

          } else {

            this.alert.warning(
              res?.message || 'Failed to delete marketing list.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Delete marketing list error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to delete marketing list.'
          );

        }

      });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.marketingList = this.getEmptyModel();

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

    this.loadMarketingLists();

  }

}
