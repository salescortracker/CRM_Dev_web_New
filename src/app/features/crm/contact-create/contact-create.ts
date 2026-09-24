import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactDto, ContactService } from '../services/contact.service';
import { CompanyService } from '../services/company.service';
import { LeadService } from '../services/lead.service';
import { Alertservice } from '../../../core/services/alertservice';

@Component({
  selector: 'app-contact-create',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './contact-create.html',
  styleUrl: './contact-create.css',
})
export class ContactCreate implements OnInit {

  contact: Partial<ContactDto> = this.emptyContact();

  /* =========================================================
     DROPDOWNS (from the API)
  ========================================================= */

  companies: { companyInformationId: number; companyName: string }[] = [];
  contactTypes: { contactTypeId: number; contactTypeName: string }[] = [];
  relationships: { relationshipId: number; relationshipName: string }[] = [];
  countries: { countryId: number; countryName: string }[] = [];
  states: { stateId: number; countryId: number; stateName: string }[] = [];

  salutations = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.'];

  /* =========================================================
     UI STATE
  ========================================================= */

  isEdit = false;

  contactInformationId = 0;

  submitted = false;

  isSaving = false;

  // Organisation of the logged-in user (tenant CompanyId / RegionId on create).
  private orgCompanyId: number | null = null;
  private orgRegionId: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private contactService: ContactService,
    private companyService: CompanyService,
    private leadService: LeadService,
    private alert: Alertservice,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const id = Number(this.route.snapshot.queryParamMap.get('id'));

    if (id > 0) {
      this.isEdit = true;
      this.contactInformationId = id;
    }

    this.loadDropdowns();
    this.loadOrganisation();

    if (this.isEdit) {
      this.loadContact();
    }
  }

  private emptyContact(): Partial<ContactDto> {
    return {
      contactInformationId: 0,
      salutation: 'Mr.',
      firstName: '',
      lastName: '',
      designation: '',
      department: '',
      companyInformationId: 0,
      contactTypeId: null,
      relationshipId: null,
      businessEmail: '',
      phone: '',
      alternatePhone: '',
      website: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      stateId: null,
      countryId: null,
      postalCode: '',
      notes: '',
      isActive: true
    };
  }

  /* =========================================================
     LOOKUPS
  ========================================================= */

  private loadDropdowns(): void {

    this.companyService.getCompanies().subscribe({
      next: res => {
        this.companies = (res?.data || []).filter(x => x.isActive);
        this.cd.detectChanges();
      },
      error: () => this.alert.error('Failed to load companies.')
    });

    this.contactService.getContactTypes().subscribe({
      next: res => {
        this.contactTypes = (res?.data || []).filter(x => x.isActive);
        this.cd.detectChanges();
      },
      error: () => this.alert.error('Failed to load contact types.')
    });

    this.contactService.getRelationships().subscribe({
      next: res => {
        this.relationships = (res?.data || []).filter(x => x.isActive);
        this.cd.detectChanges();
      },
      error: () => this.alert.error('Failed to load relationships.')
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

    this.contact.stateId = null;

    this.loadStates(this.contact.countryId);
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
     GET CONTACT BY ID (edit)
  ========================================================= */

  private loadContact(): void {

    this.contactService.getContactById(this.contactInformationId).subscribe({

      next: res => {

        if (!res?.success || !res.data) {
          this.alert.error(res?.message || 'Contact not found.');
          this.router.navigate(['/contact-list']);
          return;
        }

        this.contact = { ...res.data };

        this.loadStates(this.contact.countryId);

        this.cd.detectChanges();
      },

      error: err => {
        this.alert.error(err?.error?.message || 'Failed to load contact.');
        this.router.navigate(['/contact-list']);
      }
    });
  }

  /* =========================================================
     VALIDATION
  ========================================================= */

  isValidEmail(email: string): boolean {

    if (!email) {
      return true;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isRequiredInvalid(value: string | null | undefined): boolean {
    return this.submitted && !value?.trim();
  }

  private isFormValid(): boolean {

    return !!(
      this.contact.salutation?.trim() &&
      this.contact.firstName?.trim() &&
      this.contact.businessEmail?.trim() &&
      this.isValidEmail(this.contact.businessEmail.trim()) &&
      this.contact.phone?.trim() &&
      this.contact.companyInformationId
    );
  }

  /* =========================================================
     SAVE (create / update)
  ========================================================= */

  saveContact(): void {

    if (this.isSaving) {
      return;
    }

    this.submitted = true;

    if (!this.isFormValid()) {
      this.alert.warning('Please fill all required fields correctly.');
      return;
    }

    // Create uses the logged-in user's organisation; edit keeps the record's own.
    if (!this.isEdit && (!this.orgCompanyId || !this.orgRegionId)) {
      this.alert.error('Could not determine your company/region. Please try again.');
      return;
    }

    const payload: Partial<ContactDto> = {
      ...this.contact,
      contactInformationId: this.isEdit ? this.contactInformationId : 0,
      companyId: this.isEdit ? this.contact.companyId : this.orgCompanyId!,
      regionId: this.isEdit ? this.contact.regionId : this.orgRegionId!
    };

    this.isSaving = true;

    const request = this.isEdit
      ? this.contactService.updateContact(payload)
      : this.contactService.createContact(payload);

    request.subscribe({

      next: res => {

        this.isSaving = false;

        if (res?.success) {
          this.alert.success(res.message || 'Contact saved successfully.').then(() => {
            this.router.navigate(['/contact-list']);
          });
        } else {
          this.alert.error(res?.message || 'Failed to save contact.');
        }

        this.cd.detectChanges();
      },

      error: err => {

        this.isSaving = false;

        this.alert.error(err?.error?.message || 'Failed to save contact.');

        this.cd.detectChanges();
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/contact-list']);
  }
}
