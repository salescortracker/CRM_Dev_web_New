import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse, AuthService } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';
import { Pagination } from '../../../shared/pagination/pagination';

@Component({
  selector: 'app-license',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './license.html',
  styleUrl: './license.css',
})
export class License implements OnInit {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  //====================================================
  // Screen Variables
  //====================================================

  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 10;

  searchText = '';
  licenseTypeFilter: number | null = null;

  //====================================================
  // Static Options
  //====================================================

  supportLevels = ['Standard', 'Priority', 'Premium'];

  //====================================================
  // Dropdown Data (from backend)
  //====================================================

  companies: any[] = [];
  licenseTypes: any[] = [];

  //====================================================
  // License Management List
  //====================================================

  licenses: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  license: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      licenseManagementId: 0,

      licenseName: '',
      licenseCode: '',

      companyId: null,
      licenseTypeId: null,

      maximumUsers: null,
      storageLimitGb: null,

      licenseStartDate: '',
      licenseExpiryDate: '',

      apicallsPerMonth: null,

      supportLevel: '',

      crmmodule: true,
      salesModule: true,
      marketingModule: true,
      supportModule: true,
      apiaccess: true,
      mobileApp: true,

      activeLicense: true

    };

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadCompanies();

    this.loadLicenseTypes();

    this.loadLicenses();

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

  loadLicenseTypes(): void {

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Master/getalllicense`)
      .subscribe({

        next: (res: any) => {

          this.licenseTypes = (res?.data || []).filter(
            (x: any) => x.isActive !== false
          );

          this.cd.detectChanges();

        },

        error: (err) => {

          console.error('Error loading license types:', err);

          this.licenseTypes = [];

        }

      });

  }

  //====================================================
  // Load License Management Records
  //====================================================

  loadLicenses(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getalllicenseManagement`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.licenses = res.data || [];

          } else {

            this.licenses = [];

            this.alert.warning(
              res?.message || 'No License records found.'
            );

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Error loading licenses:', err);

          this.licenses = [];

          this.alert.error(
            err?.error?.message || 'Failed to load licenses.'
          );

          this.cd.detectChanges();

        }

      });

  }

  //====================================================
  // Lookup Helpers (Display Names)
  //====================================================

  getCompanyName(id: any): string {

    if (id === null || id === undefined || id === '') return '-';

    const item = this.companies.find(x => x.companyId === Number(id));

    return item ? item.companyName : '-';

  }

  getLicenseTypeName(id: any): string {

    if (id === null || id === undefined || id === '') return '-';

    const item = this.licenseTypes.find(x => x.licenseId === Number(id));

    return item ? item.licenseName : '-';

  }

  //====================================================
  // Status Helper
  //====================================================

  getLicenseStatus(item: any): { label: string; badgeClass: string } {

    if (!item.activeLicense) {

      return { label: 'Inactive', badgeClass: 'bg-danger' };

    }

    if (item.licenseExpiryDate) {

      const expiry = new Date(item.licenseExpiryDate);

      const today = new Date();

      today.setHours(0, 0, 0, 0);

      const diffDays = Math.ceil(
        (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays < 0) {

        return { label: 'Expired', badgeClass: 'bg-secondary' };

      }

      if (diffDays <= 30) {

        return { label: 'Expiring Soon', badgeClass: 'bg-warning text-dark' };

      }

    }

    return { label: 'Active', badgeClass: 'bg-success' };

  }

  //====================================================
  // Filtered Licenses
  //====================================================

  get filteredLicenses() {

    const search = this.searchText.trim().toLowerCase();

    return this.licenses.filter(x => {

      const matchSearch =
        !search ||
        (x.licenseName || '').toLowerCase().includes(search) ||
        (x.licenseCode || '').toLowerCase().includes(search) ||
        this.getCompanyName(x.companyId).toLowerCase().includes(search);

      const matchType =
        !this.licenseTypeFilter ||
        Number(x.licenseTypeId) === Number(this.licenseTypeFilter);

      return matchSearch && matchType;

    });

  }

  get pagedLicenses() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredLicenses.slice(start, start + this.pageSize);

  }

  //====================================================
  // Save / Update
  //====================================================

  saveLicense(): void {

    this.submitted = true;

    if (
      !this.license.licenseName || !this.license.licenseName.trim() ||
      !this.license.licenseCode || !this.license.licenseCode.trim() ||
      !this.license.companyId ||
      !this.license.licenseTypeId
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    if (
      this.license.maximumUsers !== null &&
      this.license.maximumUsers !== '' &&
      Number(this.license.maximumUsers) < 0
    ) {

      this.alert.warning('Maximum Users cannot be negative.');

      return;

    }

    if (
      this.license.storageLimitGb !== null &&
      this.license.storageLimitGb !== '' &&
      Number(this.license.storageLimitGb) < 0
    ) {

      this.alert.warning('Storage Limit cannot be negative.');

      return;

    }

    if (
      this.license.apicallsPerMonth !== null &&
      this.license.apicallsPerMonth !== '' &&
      Number(this.license.apicallsPerMonth) < 0
    ) {

      this.alert.warning('API Calls Per Month cannot be negative.');

      return;

    }

    if (
      this.license.licenseStartDate &&
      this.license.licenseExpiryDate &&
      this.license.licenseExpiryDate < this.license.licenseStartDate
    ) {

      this.alert.warning(
        'License Expiry Date cannot be earlier than License Start Date.'
      );

      return;

    }

    const payload = {

      licenseManagementId: this.isEdit ? this.license.licenseManagementId : 0,

      licenseName: this.license.licenseName.trim(),
      licenseCode: this.license.licenseCode.trim(),

      companyId: Number(this.license.companyId),
      licenseTypeId: Number(this.license.licenseTypeId),

      maximumUsers:
        this.license.maximumUsers !== null &&
          this.license.maximumUsers !== ''
          ? Number(this.license.maximumUsers)
          : null,

      storageLimitGb:
        this.license.storageLimitGb !== null &&
          this.license.storageLimitGb !== ''
          ? Number(this.license.storageLimitGb)
          : null,

      licenseStartDate: this.license.licenseStartDate || null,
      licenseExpiryDate: this.license.licenseExpiryDate || null,

      apicallsPerMonth:
        this.license.apicallsPerMonth !== null &&
          this.license.apicallsPerMonth !== ''
          ? Number(this.license.apicallsPerMonth)
          : null,

      supportLevel: this.license.supportLevel
        ? this.license.supportLevel.trim()
        : null,

      crmmodule: !!this.license.crmmodule,
      salesModule: !!this.license.salesModule,
      marketingModule: !!this.license.marketingModule,
      supportModule: !!this.license.supportModule,
      apiaccess: !!this.license.apiaccess,
      mobileApp: !!this.license.mobileApp,

      activeLicense: !!this.license.activeLicense

    };

    this.spinner.show();

    if (this.isEdit) {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/updatelicenseManagement`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'License updated successfully.'
              );

              this.clear();

              this.loadLicenses();

            } else {

              this.alert.warning(
                res?.message || 'Failed to update license.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Update license error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to update license.'
            );

          }

        });

    } else {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/createlicensmanagement`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'License created successfully.'
              );

              this.clear();

              this.loadLicenses();

            } else {

              this.alert.warning(
                res?.message || 'Failed to create license.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Create license error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to create license.'
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

    this.http
      .get<ApiResponse<any>>(`${this.baseUrl}/Admin/getbylicenseManagement/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.license = {

              licenseManagementId: data.licenseManagementId,

              licenseName: data.licenseName || '',
              licenseCode: data.licenseCode || '',

              companyId: data.companyId ?? null,
              licenseTypeId: data.licenseTypeId ?? null,

              maximumUsers: data.maximumUsers ?? null,
              storageLimitGb: data.storageLimitGb ?? null,

              licenseStartDate: data.licenseStartDate
                ? data.licenseStartDate.substring(0, 10)
                : '',

              licenseExpiryDate: data.licenseExpiryDate
                ? data.licenseExpiryDate.substring(0, 10)
                : '',

              apicallsPerMonth: data.apicallsPerMonth ?? null,

              supportLevel: data.supportLevel || '',

              crmmodule: data.crmmodule === true,
              salesModule: data.salesModule === true,
              marketingModule: data.marketingModule === true,
              supportModule: data.supportModule === true,
              apiaccess: data.apiaccess === true,
              mobileApp: data.mobileApp === true,

              activeLicense: data.activeLicense === true

            };

            this.isEdit = true;

            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'License not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get license error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to load license.'
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

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/deletelicenseManagement/${id}`,
          {}
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'License deleted successfully.'
              );

              if (this.page > 1 && this.pagedLicenses.length === 1) {
                this.page = this.page - 1;
              }

              this.loadLicenses();

            } else {

              this.alert.warning(
                res?.message || 'Failed to delete license.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete license error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete license.'
            );

          }

        });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.license = this.getEmptyModel();

    this.isEdit = false;

    this.submitted = false;

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

}
