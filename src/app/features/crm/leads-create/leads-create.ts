import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadDto, LeadService } from '../services/lead.service';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';

@Component({
  selector: 'app-leads-create',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './leads-create.html',
  styleUrl: './leads-create.css',
})
export class LeadsCreate implements OnInit {

  /* =========================================================
     STATE
     ========================================================= */

  isEdit: boolean = false;

  isSaving: boolean = false;

  leadId: number = 0;

  // Organisation of the logged-in user (CrmcompanyId / RegionId on save).
  private orgCompanyId: number | null = null;
  private orgRegionId: number | null = null;

  currentUserId: number | null = null;
  currentUserName: string = '';

  lead: Partial<LeadDto> = this.emptyLead();

  /* =========================================================
     DROPDOWNS (loaded from the API)
     ========================================================= */

  leadTypes: { leadTypeId: number; leadTypeName: string }[] = [];
  leadSources: { leadSourceId: number; leadSourceName: string }[] = [];
  industries: { industryId: number; industryName: string }[] = [];
  countries: { countryId: number; countryName: string }[] = [];
  states: { stateId: number; countryId: number; stateName: string }[] = [];

  // Static values - the API stores these as free text.
  salutations = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.'];

  leadStatuses = [
    'New',
    'Contacted',
    'Qualified',
    'Nurturing',
    'Unqualified',
    'Lost'
  ];

  leadRatings = ['Hot', 'Warm', 'Cold'];

  contactMethods = ['Email', 'Phone', 'Mobile', 'SMS', 'WhatsApp'];

  companySizes = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+'
  ];

  constructor(
    private leadService: LeadService,
    private authService: AuthService,
    private alert: Alertservice,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  /* =========================================================
     INIT
     ========================================================= */

  ngOnInit(): void {

    this.currentUserId = this.leadService.getCurrentUserId();

    this.currentUserName =
      this.authService.getCurrentUser()?.fullName ||
      this.authService.getCurrentUser()?.userName ||
      '';

    const id = Number(this.route.snapshot.queryParamMap.get('id'));

    if (id > 0) {
      this.isEdit = true;
      this.leadId = id;
    } else {
      this.lead.leadOwnerId = this.currentUserId;
    }

    this.loadDropdowns();
    this.loadOrganisation();

    if (this.isEdit) {
      this.loadLead();
    }
  }

  private emptyLead(): Partial<LeadDto> {
    return {
      leadId: 0,
      salutation: null,
      firstName: '',
      lastName: '',
      jobTitle: '',
      email: '',
      phone: '',
      mobile: '',
      leadTypeId: 0,
      leadOwnerId: null,
      leadSourceId: 0,
      leadStatus: 'New',
      leadRating: null,
      leadScore: null,
      preferredContactMethod: null,
      companyName: '',
      website: '',
      industryId: null,
      companySize: null,
      annualRevenue: null,
      streetAddress: '',
      city: '',
      stateId: null,
      postalCode: '',
      countryId: null,
      estimatedDealValue: null,
      expectedCloseDate: null,
      description: '',
      isActive: true
    };
  }

  /* =========================================================
     LOAD LOOKUPS
     ========================================================= */

  private loadDropdowns(): void {

    this.leadService.getLeadTypes().subscribe({
      next: res => { this.leadTypes = res?.data || []; this.cd.detectChanges(); },
      error: () => this.alert.error('Failed to load lead types.')
    });

    this.leadService.getLeadSources().subscribe({
      next: res => { this.leadSources = res?.data || []; this.cd.detectChanges(); },
      error: () => this.alert.error('Failed to load lead sources.')
    });

    this.leadService.getIndustries().subscribe({
      next: res => { this.industries = res?.data || []; this.cd.detectChanges(); },
      error: () => this.alert.error('Failed to load industries.')
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

    this.lead.stateId = null;

    this.loadStates(this.lead.countryId);
  }

  private loadOrganisation(): void {

    if (!this.currentUserId) {
      return;
    }

    this.leadService.getUserById(this.currentUserId).subscribe({

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
     GET LEAD BY ID (edit)
     ========================================================= */

  private loadLead(): void {

    this.leadService.getLeadById(this.leadId).subscribe({

      next: res => {

        if (!res?.success || !res.data) {
          this.alert.error(res?.message || 'Lead not found.');
          this.router.navigate(['/leads-list']);
          return;
        }

        this.lead = { ...res.data };

        this.loadStates(this.lead.countryId);

        this.cd.detectChanges();
      },

      error: err => {
        this.alert.error(err?.error?.message || 'Failed to load lead.');
        this.router.navigate(['/leads-list']);
      }
    });
  }

  /* =========================================================
     SAVE (create / update)
     ========================================================= */

  private validate(): string | null {

    if (!this.lead.firstName?.trim()) return 'First Name is required.';
    if (!this.lead.lastName?.trim()) return 'Last Name is required.';

    if (!this.lead.email?.trim()) return 'Email is required.';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.lead.email.trim())) {
      return 'Enter a valid email address.';
    }

    if (!this.lead.companyName?.trim()) return 'Company Name is required.';

    if (!this.lead.leadTypeId) return 'Lead Type is required.';
    if (!this.lead.leadSourceId) return 'Lead Source is required.';

    if (
      this.lead.leadScore != null &&
      (this.lead.leadScore < 0 || this.lead.leadScore > 100)
    ) {
      return 'Lead Score must be between 0 and 100.';
    }

    return null;
  }

  saveLead(): void {

    if (this.isSaving) {
      return;
    }

    const error = this.validate();

    if (error) {
      this.alert.warning(error);
      return;
    }

    // Create uses the logged-in user's organisation; edit keeps the lead's own.
    if (!this.isEdit && (!this.orgCompanyId || !this.orgRegionId)) {
      this.alert.error('Could not determine your company/region. Please try again.');
      return;
    }

    const payload: Partial<LeadDto> = {
      ...this.lead,
      leadId: this.isEdit ? this.leadId : 0,
      crmcompanyId: this.isEdit ? this.lead.crmcompanyId : this.orgCompanyId!,
      regionId: this.isEdit ? this.lead.regionId : this.orgRegionId!,
      expectedCloseDate: this.lead.expectedCloseDate || null
    };

    this.isSaving = true;

    const request = this.isEdit
      ? this.leadService.updateLead(payload)
      : this.leadService.createLead(payload);

    request.subscribe({

      next: res => {

        this.isSaving = false;

        if (res?.success) {
          this.alert.success(res.message || 'Lead saved successfully.').then(() => {
            this.router.navigate(['/leads-list']);
          });
        } else {
          this.alert.error(res?.message || 'Failed to save lead.');
        }

        this.cd.detectChanges();
      },

      error: err => {

        this.isSaving = false;

        this.alert.error(err?.error?.message || 'Failed to save lead.');

        this.cd.detectChanges();
      }
    });
  }

  /* =========================================================
     CANCEL
     ========================================================= */

  cancel(): void {
    this.router.navigate(['/leads-list']);
  }

  /* =========================================================
     PREVIEW HELPERS
     ========================================================= */

  getInitials(): string {

    const first = this.lead.firstName ? this.lead.firstName.charAt(0) : 'L';

    const last = this.lead.lastName ? this.lead.lastName.charAt(0) : 'D';

    return (first + last).toUpperCase();
  }

  get countryName(): string {
    return (
      this.countries.find(x => x.countryId === this.lead.countryId)?.countryName ||
      ''
    );
  }
}
