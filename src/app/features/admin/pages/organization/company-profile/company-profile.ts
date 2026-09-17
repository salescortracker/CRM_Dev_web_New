import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { ApiResponse, AuthService } from '../../../../../core/authentication/services/auth.service';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './company-profile.html',
  styleUrl: './company-profile.css',
})
export class CompanyProfile implements OnInit {

  private baseUrl = environment.apiUrl;

  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  searchText = '';

  //====================================================
  // Dropdown Data (from backend)
  //====================================================

  companies: any[] = [];
  regions: any[] = [];
  industries: any[] = [];
  companyTypes: any[] = [];
  countries: any[] = [];
  states: any[] = [];
  currencies: any[] = [];

  //====================================================
  // Company Profile List
  //====================================================

  companyProfiles: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  company: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      companyProfileId: 0,

      companyId: null,
      regionId: null,

      companyName: '',
      companyCode: '',
      legalName: '',
      registrationNumber: '',
      gstnumber: '',
      pannumber: '',

      industryId: null,
      companyTypeId: null,
      establishedDate: '',

      email: '',
      phone: '',
      mobile: '',
      website: '',

      addressLine1: '',
      addressLine2: '',

      countryId: null,
      stateId: null,
      city: '',
      pincode: '',

      currencyId: null,
      financialYear: '',

      companyLogoPath: '',

      description: '',

      active: true

    };

  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.loadCompanies();
    this.loadRegions();
    this.loadIndustries();
    this.loadCompanyTypes();
    this.loadCountries();
    this.loadStates();
    this.loadCurrencies();
    this.loadCompanyProfiles();

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

  loadIndustries(): void {

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Master/getallindustry`)
      .subscribe({

        next: (res: any) => {

          this.industries = (res?.data || []).filter(
            (x: any) => x.isActive !== false
          );

          this.cd.detectChanges();

        },

        error: (err) => {

          console.error('Error loading industries:', err);

          this.industries = [];

        }

      });

  }

  loadCompanyTypes(): void {

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Master/getallcompanytype`)
      .subscribe({

        next: (res: any) => {

          this.companyTypes = (res?.data || []).filter(
            (x: any) => x.isActive !== false
          );

          this.cd.detectChanges();

        },

        error: (err) => {

          console.error('Error loading company types:', err);

          this.companyTypes = [];

        }

      });

  }

  loadCountries(): void {

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Master/getallcountry`)
      .subscribe({

        next: (res: any) => {

          this.countries = (res?.data || []).filter(
            (x: any) => x.isActive !== false
          );

          this.cd.detectChanges();

        },

        error: (err) => {

          console.error('Error loading countries:', err);

          this.countries = [];

        }

      });

  }

  loadStates(): void {

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Master/getallstate`)
      .subscribe({

        next: (res: any) => {

          this.states = (res?.data || []).filter(
            (x: any) => x.isActive !== false
          );

          this.cd.detectChanges();

        },

        error: (err) => {

          console.error('Error loading states:', err);

          this.states = [];

        }

      });

  }

  loadCurrencies(): void {

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Master/getallcurrency`)
      .subscribe({

        next: (res: any) => {

          this.currencies = (res?.data || []).filter(
            (x: any) => x.isActive !== false
          );

          this.cd.detectChanges();

        },

        error: (err) => {

          console.error('Error loading currencies:', err);

          this.currencies = [];

        }

      });

  }

  //====================================================
  // Load Company Profiles
  //====================================================

  loadCompanyProfiles(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getallcompanyprofile`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.companyProfiles = res.data || [];

          } else {

            this.companyProfiles = [];

            this.alert.warning(
              res?.message || 'No company profile records found.'
            );

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Error loading company profiles:', err);

          this.companyProfiles = [];

          this.alert.error(
            err?.error?.message || 'Failed to load company profiles.'
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

  getIndustryName(id: any): string {

    if (!id) return '-';

    const item = this.industries.find(x => x.industryId === Number(id));

    return item ? item.industryName : '-';

  }

  getCompanyTypeName(id: any): string {

    if (!id) return '-';

    const item = this.companyTypes.find(x => x.companyTypeId === Number(id));

    return item ? item.companyTypeName : '-';

  }

  getCountryName(id: any): string {

    if (!id) return '-';

    const item = this.countries.find(x => x.countryId === Number(id));

    return item ? item.countryName : '-';

  }

  getStateName(id: any): string {

    if (!id) return '-';

    const item = this.states.find(x => x.stateId === Number(id));

    return item ? item.stateName : '-';

  }

  getCurrencyName(id: any): string {

    if (!id) return '-';

    const item = this.currencies.find(x => x.currencyId === Number(id));

    return item ? item.currencyName : '-';

  }

  //====================================================
  // Cascading Dropdowns
  //====================================================

  get formRegions(): any[] {

    if (!this.company.companyId) return this.regions;

    return this.regions.filter(
      x => x.companyId === Number(this.company.companyId)
    );

  }

  onCompanyChange(): void {

    this.company.regionId = null;

  }

  get formStates(): any[] {

    if (!this.company.countryId) return this.states;

    return this.states.filter(
      x => x.countryId === Number(this.company.countryId)
    );

  }

  onCountryChange(): void {

    this.company.stateId = null;

  }

  //====================================================
  // Filtered Company Profiles
  //====================================================

  get filteredCompanies() {

    const search = this.searchText.trim().toLowerCase();

    return this.companyProfiles.filter(x => {

      return (
        !search ||
        (x.companyName || '').toLowerCase().includes(search) ||
        (x.companyCode || '').toLowerCase().includes(search) ||
        (x.legalName || '').toLowerCase().includes(search) ||
        (x.email || '').toLowerCase().includes(search) ||
        (x.phone || '').toLowerCase().includes(search) ||
        (x.city || '').toLowerCase().includes(search)
      );

    });

  }

  get pagedCompanies() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredCompanies.slice(start, start + this.pageSize);

  }

  changePage(page: number): void {

    this.page = page;

  }

  changePageSize(size: number): void {

    this.pageSize = size;

    this.page = 1;

  }

  //====================================================
  // Save / Update
  //====================================================

  saveCompany(): void {

    this.submitted = true;

    if (
      !this.company.companyId ||
      !this.company.regionId ||
      !this.company.companyName ||
      !this.company.companyName.trim() ||
      !this.company.companyCode ||
      !this.company.companyCode.trim()
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    const payload = {

      companyProfileId: this.isEdit ? this.company.companyProfileId : 0,

      companyId: Number(this.company.companyId),
      regionId: Number(this.company.regionId),

      companyName: this.company.companyName.trim(),
      companyCode: this.company.companyCode.trim(),

      legalName: this.company.legalName
        ? this.company.legalName.trim()
        : null,

      registrationNumber: this.company.registrationNumber
        ? this.company.registrationNumber.trim()
        : null,

      gstnumber: this.company.gstnumber
        ? this.company.gstnumber.trim()
        : null,

      pannumber: this.company.pannumber
        ? this.company.pannumber.trim()
        : null,

      industryId: this.company.industryId
        ? Number(this.company.industryId)
        : null,

      companyTypeId: this.company.companyTypeId
        ? Number(this.company.companyTypeId)
        : null,

      establishedDate: this.company.establishedDate || null,

      email: this.company.email ? this.company.email.trim() : null,

      phone: this.company.phone ? this.company.phone.trim() : null,

      mobile: this.company.mobile ? this.company.mobile.trim() : null,

      website: this.company.website ? this.company.website.trim() : null,

      addressLine1: this.company.addressLine1
        ? this.company.addressLine1.trim()
        : null,

      addressLine2: this.company.addressLine2
        ? this.company.addressLine2.trim()
        : null,

      countryId: this.company.countryId
        ? Number(this.company.countryId)
        : null,

      stateId: this.company.stateId
        ? Number(this.company.stateId)
        : null,

      city: this.company.city ? this.company.city.trim() : null,

      pincode: this.company.pincode ? this.company.pincode.trim() : null,

      currencyId: this.company.currencyId
        ? Number(this.company.currencyId)
        : null,

      financialYear: this.company.financialYear
        ? this.company.financialYear.trim()
        : null,

      companyLogoPath: this.company.companyLogoPath
        ? this.company.companyLogoPath.trim()
        : null,

      description: this.company.description
        ? this.company.description.trim()
        : null,

      active: !!this.company.active

    };

    this.spinner.show();

    if (this.isEdit) {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/updatecompanyprofile`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Company Profile updated successfully.'
              );

              this.clear();

              this.loadCompanyProfiles();

            } else {

              this.alert.warning(
                res?.message || 'Failed to update company profile.'
              );

            }

            this.cd.detectChanges();

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Update company profile error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to update company profile.'
            );

            this.cd.detectChanges();

          }

        });

    } else {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/createcompanyprofile`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Company Profile created successfully.'
              );

              this.clear();

              this.loadCompanyProfiles();

            } else {

              this.alert.warning(
                res?.message || 'Failed to create company profile.'
              );

            }

            this.cd.detectChanges();

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Create company profile error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to create company profile.'
            );

            this.cd.detectChanges();

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
      .get<ApiResponse<any>>(`${this.baseUrl}/Admin/getbycompanyprofile/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.company = {

              companyProfileId: data.companyProfileId,

              companyId: data.companyId,
              regionId: data.regionId,

              companyName: data.companyName || '',
              companyCode: data.companyCode || '',
              legalName: data.legalName || '',
              registrationNumber: data.registrationNumber || '',
              gstnumber: data.gstnumber || '',
              pannumber: data.pannumber || '',

              industryId: data.industryId ?? null,
              companyTypeId: data.companyTypeId ?? null,
              establishedDate: data.establishedDate || '',

              email: data.email || '',
              phone: data.phone || '',
              mobile: data.mobile || '',
              website: data.website || '',

              addressLine1: data.addressLine1 || '',
              addressLine2: data.addressLine2 || '',

              countryId: data.countryId ?? null,
              stateId: data.stateId ?? null,
              city: data.city || '',
              pincode: data.pincode || '',

              currencyId: data.currencyId ?? null,
              financialYear: data.financialYear || '',

              companyLogoPath: data.companyLogoPath || '',

              description: data.description || '',

              active: data.active === true

            };

            this.isEdit = true;
            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'Company Profile not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get company profile error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to load company profile.'
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
          `${this.baseUrl}/Admin/deletecompanyprofile/${id}`,
          {}
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Company Profile deleted successfully.'
              );

              if (this.page > 1 && this.pagedCompanies.length === 1) {
                this.page = this.page - 1;
              }

              this.loadCompanyProfiles();

            } else {

              this.alert.warning(
                res?.message || 'Failed to delete company profile.'
              );

            }

            this.cd.detectChanges();

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete company profile error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete company profile.'
            );

            this.cd.detectChanges();

          }

        });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.company = this.getEmptyModel();

    this.isEdit = false;
    this.submitted = false;

    this.cd.detectChanges();

  }

}
