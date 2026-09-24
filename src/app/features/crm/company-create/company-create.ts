import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyInformationDto, CompanyService } from '../services/company.service';
import { LeadService } from '../services/lead.service';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';

@Component({
  selector: 'app-company-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './company-create.html',
  styleUrl: './company-create.css',
})
export class CompanyCreate implements OnInit {

  /* =========================================================
     FORM MODEL (flat CompanyInformationDto)
  ========================================================= */

  company: Partial<CompanyInformationDto> = this.emptyCompany();

  /* =========================================================
     DROPDOWN DATA (from the API)
  ========================================================= */

  industries: { industryId: number; industryName: string }[] = [];
  companyTypes: { companyTypeId: number; companyTypeName: string }[] = [];
  countries: { countryId: number; countryName: string }[] = [];
  states: { stateId: number; countryId: number; stateName: string }[] = [];

  companyStatuses: string[] = ['Active', 'Inactive'];

  // Stored as free text by the API.
  employeeRanges: string[] = [
    '1 - 10',
    '11 - 50',
    '51 - 200',
    '201 - 500',
    '501 - 1000',
    '1001 - 5000',
    '5000+'
  ];

  /* =========================================================
     UI STATE
  ========================================================= */

  isEdit = false;

  companyInformationId = 0;

  submitted = false;

  isSaving = false;

  currentSection = 'basic';

  // Organisation of the logged-in user (tenant CompanyId / RegionId on create).
  private orgCompanyId: number | null = null;
  private orgRegionId: number | null = null;

  private currentUserName = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private leadService: LeadService,
    private authService: AuthService,
    private alert: Alertservice,
    private cd: ChangeDetectorRef
  ) {}

  /* =========================================================
     INIT
  ========================================================= */

  ngOnInit(): void {

    const user = this.authService.getCurrentUser();

    this.currentUserName = user?.fullName || user?.userName || '';

    const id = Number(this.route.snapshot.queryParamMap.get('id'));

    if (id > 0) {
      this.isEdit = true;
      this.companyInformationId = id;
    } else {
      this.company.companyOwner = this.currentUserName;
    }

    this.loadDropdowns();
    this.loadOrganisation();

    if (this.isEdit) {
      this.loadCompany();
    }
  }

  private emptyCompany(): Partial<CompanyInformationDto> {
    return {
      companyInformationId: 0,
      companyName: '',
      legalCompanyName: '',
      industryId: 0,
      companyTypeId: 0,
      companyOwner: '',
      companyStatus: 'Active',
      website: '',
      companyPhone: '',
      companyEmail: '',
      companyDescription: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      stateId: 0,
      countryId: 0,
      postalCode: '',
      numberOfEmployees: null,
      annualRevenue: null,
      gstnumber: '',
      pannumber: '',
      cinregistrationNumber: '',
      linkedInCompanyUrl: '',
      primaryContactName: '',
      primaryContactDesignation: '',
      primaryContactEmail: '',
      primaryContactPhone: '',
      isActive: true
    };
  }

  /* =========================================================
     LOOKUPS
  ========================================================= */

  private loadDropdowns(): void {

    this.leadService.getIndustries().subscribe({
      next: res => { this.industries = res?.data || []; this.cd.detectChanges(); },
      error: () => this.alert.error('Failed to load industries.')
    });

    this.companyService.getCompanyTypes().subscribe({
      next: res => { this.companyTypes = res?.data || []; this.cd.detectChanges(); },
      error: () => this.alert.error('Failed to load company types.')
    });

    this.leadService.getCountries().subscribe({
      next: res => { this.countries = res?.data || []; this.cd.detectChanges(); },
      error: () => this.alert.error('Failed to load countries.')
    });
  }

  private loadStates(countryId: number | null | undefined): void {

    if (!countryId) {
      this.states = [];
      return;
    }

    this.leadService.getStates(countryId).subscribe({
      next: res => { this.states = res?.data || []; this.cd.detectChanges(); },
      error: () => this.alert.error('Failed to load states.')
    });
  }

  onCountryChange(): void {

    this.company.stateId = 0;

    this.loadStates(this.company.countryId);
  }

  private loadOrganisation(): void {

    const userId = this.leadService.getCurrentUserId();

    if (!userId) {
      return;
    }

    this.leadService.getUserById(userId).subscribe({

      next: res => {

        if (res?.success && res.data) {
          this.orgCompanyId = res.data.companyId ?? null;
          this.orgRegionId = res.data.regionId ?? null;
        }
      },

      error: err => console.error('Error loading logged-in user org details:', err)
    });
  }

  /* =========================================================
     GET COMPANY BY ID (edit)
  ========================================================= */

  private loadCompany(): void {

    this.companyService.getCompanyById(this.companyInformationId).subscribe({

      next: res => {

        if (!res?.success || !res.data) {
          this.alert.error(res?.message || 'Company not found.');
          this.router.navigate(['/company-list']);
          return;
        }

        this.company = { ...res.data };

        this.loadStates(this.company.countryId);

        this.cd.detectChanges();
      },

      error: err => {
        this.alert.error(err?.error?.message || 'Failed to load company.');
        this.router.navigate(['/company-list']);
      }
    });
  }

  /* =========================================================
     SECTION NAVIGATION
  ========================================================= */

  setSection(section: string): void {

    this.currentSection = section;

    setTimeout(() => {

      const element = document.getElementById(section);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

    }, 50);
  }

  /* =========================================================
     VALIDATION
  ========================================================= */

  isFormValid(): boolean {

    return !!(
      this.company.companyName?.trim() &&
      this.company.industryId &&
      this.company.companyTypeId &&
      this.company.companyOwner?.trim() &&
      this.company.companyStatus &&
      this.company.city?.trim() &&
      this.company.countryId &&
      this.company.stateId &&
      this.isValidEmail(this.company.companyEmail || '') &&
      this.isValidEmail(this.company.primaryContactEmail || '')
    );
  }

  isRequiredInvalid(value: string | null | undefined): boolean {
    return this.submitted && !value?.trim();
  }

  isValidEmail(email: string): boolean {

    if (!email) {
      return true;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  normalizeWebsite(): void {

    const site = this.company.website;

    if (site && !site.startsWith('http://') && !site.startsWith('https://')) {
      this.company.website = 'https://' + site;
    }
  }

  /* =========================================================
     SAVE (create / update)
  ========================================================= */

  // createAnother: stay on the page with a blank form (create mode only).
  saveCompany(createAnother = false): void {

    if (this.isSaving) {
      return;
    }

    this.submitted = true;

    if (!this.isFormValid()) {
      this.currentSection = 'basic';
      this.alert.warning('Please fill all required fields correctly.');
      return;
    }

    // Create uses the logged-in user's organisation; edit keeps the record's own.
    if (!this.isEdit && (!this.orgCompanyId || !this.orgRegionId)) {
      this.alert.error('Could not determine your company/region. Please try again.');
      return;
    }

    const payload: Partial<CompanyInformationDto> = {
      ...this.company,
      companyInformationId: this.isEdit ? this.companyInformationId : 0,
      companyId: this.isEdit ? this.company.companyId : this.orgCompanyId!,
      regionId: this.isEdit ? this.company.regionId : this.orgRegionId!,
      isActive: this.company.companyStatus === 'Active'
    };

    this.isSaving = true;

    const request = this.isEdit
      ? this.companyService.updateCompany(payload)
      : this.companyService.createCompany(payload);

    request.subscribe({

      next: res => {

        this.isSaving = false;

        if (!res?.success) {
          this.alert.error(res?.message || 'Failed to save company.');
          this.cd.detectChanges();
          return;
        }

        this.alert.success(res.message || 'Company saved successfully.').then(() => {

          if (createAnother && !this.isEdit) {
            this.resetForm();
            this.cd.detectChanges();
          } else {
            this.router.navigate(['/company-list']);
          }
        });
      },

      error: err => {

        this.isSaving = false;

        this.alert.error(err?.error?.message || 'Failed to save company.');

        this.cd.detectChanges();
      }
    });
  }

  saveAndCreateAnother(): void {
    this.saveCompany(true);
  }

  /* =========================================================
     NAVIGATION / RESET
  ========================================================= */

  cancel(): void {
    this.router.navigate(['/company-list']);
  }

  resetForm(): void {

    this.company = this.emptyCompany();
    this.company.companyOwner = this.currentUserName;

    this.states = [];
    this.submitted = false;
    this.currentSection = 'basic';
  }
}
