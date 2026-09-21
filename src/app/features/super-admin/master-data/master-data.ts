import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { MasterDataService } from './master-data.service';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';

interface MasterType {
  name: string;
  icon: string;
}

interface MasterDataItem {
  id: number;
  code: string;
  name: string;
  company: string;
  region: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-master-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './master-data.html',
  styleUrl: './master-data.css',
  
})
export class MasterData implements  OnInit {

  constructor(
    private authService: AuthService,
    private masterDataService: MasterDataService,
    private alert: Alertservice,
    private cd: ChangeDetectorRef
  ) { }

   // =========================================================
  // MASTER TYPES
  // =========================================================

  masterTypes: MasterType[] = [
    {
      name: 'Country',
      icon: 'fa-solid fa-globe'
    },
    {
      name: 'State',
      icon: 'fa-solid fa-map'
    },
    // {
    //   name: 'City',
    //   icon: 'fa-solid fa-city'
    // },
    {
      name: 'Currency',
      icon: 'fa-solid fa-circle-dollar-to-slot'
    },
    // {
    //   name: 'Departments',
    //   icon: 'fa-solid fa-sitemap'
    // },
    // {
    //   name: 'Designation',
    //   icon: 'fa-solid fa-user-tie'
    // },
    {
      name: 'Lead Source',
      icon: 'fa-solid fa-bolt'
    },
    {
      name: 'Lead Status',
      icon: 'fa-solid fa-square-check'
    },
    // {
    //   name: 'Call Type',
    //   icon: 'fa-solid fa-phone'
    // },
    {
      name: 'Call Purpose',
      icon: 'fa-solid fa-phone-volume'
    },
    {
      name: 'Call Outcome',
      icon: 'fa-solid fa-list-check'
    },
    // {
    //   name: 'Ticket Category',
    //   icon: 'fa-solid fa-ticket'
    // },
    {
      name: 'Priority',
      icon: 'fa-solid fa-shield-halved'
    },
    // {
    //   name: 'Customer Type',
    //   icon: 'fa-solid fa-user-group'
    // },
    {
      name: 'Industry',
      icon: 'fa-solid fa-building'
    },
    {
      name: 'Billing Cycle',
      icon: 'fa-solid fa-file-invoice-dollar'
    },
    {
      name: 'Contact Type',
      icon: 'fa-solid fa-address-book'
    },
    {
      name: 'Relationship',
      icon: 'fa-solid fa-people-arrows'
    },
    {
      name: 'Company Type',
      icon: 'fa-solid fa-building-columns'
    },
    {
      name: 'Lead Type',
      icon: 'fa-solid fa-tags'
    },
    {
      name: 'License',
      icon: 'fa-solid fa-certificate'
    },
    {
      name: 'Payment Method',
      icon: 'fa-solid fa-credit-card'
    },
    {
      name: 'Discount Type',
      icon: 'fa-solid fa-percent'
    },
    {
      name: 'Meeting Purpose',
      icon: 'fa-solid fa-handshake'
    }
  ];


  // =========================================================
  // SELECTED MASTER
  // =========================================================

  selectedMasterType: string = 'Country';


  // =========================================================
  // SEARCH / FILTER
  // =========================================================

  searchText: string = '';

  selectedStatus: string = 'All';


  // =========================================================
  // FORM
  // =========================================================

  showForm: boolean = false;

  isEditMode: boolean = false;

  formData: MasterDataItem = {
    id: 0,
    code: '',
    name: '',
    company: '',
    region: '',
    status: 'Active'
  };


  // =========================================================
  // COMPANY / REGION (DYNAMIC, FROM EXISTING MASTER APIs)
  // =========================================================

  companies: any[] = [];

  regions: any[] = [];

  countries: any[] = [];

  selectedCompanyId: number | null = null;

  selectedCountryId: number | null = null;

  // Maps a StateId to its CountryId/CountryName, since MasterDataItem
  // has no country field to carry this through the mapped listing rows.
  stateCountryLookup: { [stateId: number]: { countryId: number; countryName: string } } = {};

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


  // =========================================================
  // COUNTRY (DYNAMIC, FROM EXISTING MASTER APIs)
  // =========================================================

  // Raw country records (companyId/regionId/countryId) used to populate
  // the Country dropdown on the State form; kept separate from
  // allMasterData['Country'], which holds the mapped listing rows.
  loadCountriesForForm(): void {

    this.masterDataService.getAll('countries').subscribe({

      next: (res: any) => {

        this.countries = (res?.data || []).filter(
          (x: any) => x.isActive !== false
        );

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading countries for form:', err);

        this.countries = [];

      }

    });

  }

  loadCountries(): void {

    this.masterDataService.getAll('countries').subscribe({

      next: (res: any) => {

        const mapped: MasterDataItem[] = (res?.data || []).map((c: any) => ({
          id: c.countryId,
          code: c.countryCode,
          name: c.countryName,
          company: c.companyName,
          region: c.regionName,
          status: c.isActive ? 'Active' : 'Inactive'
        }));

        this.allMasterData['Country'] = mapped;

        if (this.selectedMasterType === 'Country') {

          this.masterData = mapped;

          this.filterData();

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading countries:', err);

      }

    });

  }

  private saveCountry(): void {

    const selectedRegion = this.regions.find(
      r => r.regionName === this.formData.region &&
        r.companyId === Number(this.selectedCompanyId)
    );

    const payload = {
      countryId: this.isEditMode ? this.formData.id : 0,
      companyId: Number(this.selectedCompanyId),
      regionId: selectedRegion ? selectedRegion.regionId : 0,
      countryName: this.formData.name.trim(),
      countryCode: this.formData.code.trim(),
      isActive: this.formData.status === 'Active'
    };

    const request = this.isEditMode
      ? this.masterDataService.update('countries', payload)
      : this.masterDataService.create('countries', payload);

    request.subscribe({

      next: () => {

        this.loadCountries();

        this.closeForm();

        this.alert.success('Country saved successfully.');

      },

      error: (err) => {

        console.error('Error saving country:', err);

        this.alert.error('Failed to save country.');

      }

    });

  }


  // =========================================================
  // STATE (DYNAMIC, FROM EXISTING MASTER APIs)
  // =========================================================

  loadStates(): void {

    this.masterDataService.getAll('states').subscribe({

      next: (res: any) => {

        const data = res?.data || [];

        const mapped: MasterDataItem[] = data.map((s: any) => ({
          id: s.stateId,
          code: s.stateCode,
          name: s.stateName,
          company: s.companyName,
          region: s.regionName,
          status: s.isActive ? 'Active' : 'Inactive'
        }));

        this.stateCountryLookup = {};

        data.forEach((s: any) => {
          this.stateCountryLookup[s.stateId] = {
            countryId: s.countryId,
            countryName: s.countryName
          };
        });

        this.allMasterData['State'] = mapped;

        if (this.selectedMasterType === 'State') {

          this.masterData = mapped;

          this.filterData();

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading states:', err);

      }

    });

  }

  private saveState(): void {

    const selectedRegion = this.regions.find(
      r => r.regionName === this.formData.region &&
        r.companyId === Number(this.selectedCompanyId)
    );

    const payload = {
      stateId: this.isEditMode ? this.formData.id : 0,
      companyId: Number(this.selectedCompanyId),
      regionId: selectedRegion ? selectedRegion.regionId : 0,
      countryId: this.selectedCountryId ? Number(this.selectedCountryId) : 0,
      stateName: this.formData.name.trim(),
      stateCode: this.formData.code.trim(),
      isActive: this.formData.status === 'Active'
    };

    const request = this.isEditMode
      ? this.masterDataService.update('states', payload)
      : this.masterDataService.create('states', payload);

    request.subscribe({

      next: () => {

        this.loadStates();

        this.closeForm();

        this.alert.success('State saved successfully.');

      },

      error: (err) => {

        console.error('Error saving state:', err);

        this.alert.error('Failed to save state.');

      }

    });

  }


  // =========================================================
  // INDUSTRY (DYNAMIC, FROM EXISTING MASTER APIs)
  // =========================================================

  loadIndustries(): void {

    this.masterDataService.getAll('industries').subscribe({

      next: (res: any) => {

        const mapped: MasterDataItem[] = (res?.data || []).map((i: any) => ({
          id: i.industryId,
          code: i.industryCode,
          name: i.industryName,
          company: i.companyName,
          region: i.regionName,
          status: i.isActive ? 'Active' : 'Inactive'
        }));

        this.allMasterData['Industry'] = mapped;

        if (this.selectedMasterType === 'Industry') {

          this.masterData = mapped;

          this.filterData();

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading industries:', err);

      }

    });

  }

  private saveIndustry(): void {

    const selectedRegion = this.regions.find(
      r => r.regionName === this.formData.region &&
        r.companyId === Number(this.selectedCompanyId)
    );

    const payload = {
      industryId: this.isEditMode ? this.formData.id : 0,
      companyId: Number(this.selectedCompanyId),
      regionId: selectedRegion ? selectedRegion.regionId : 0,
      industryName: this.formData.name.trim(),
      industryCode: this.formData.code.trim(),
      isActive: this.formData.status === 'Active'
    };

    const request = this.isEditMode
      ? this.masterDataService.update('industries', payload)
      : this.masterDataService.create('industries', payload);

    request.subscribe({

      next: () => {

        this.loadIndustries();

        this.closeForm();

        this.alert.success('Industry saved successfully.');

      },

      error: (err) => {

        console.error('Error saving industry:', err);

        this.alert.error('Failed to save industry.');

      }

    });

  }


  // =========================================================
  // CURRENCY (DYNAMIC, FROM EXISTING MASTER APIs)
  // =========================================================

  loadCurrencies(): void {

    this.masterDataService.getAll('currencies').subscribe({

      next: (res: any) => {

        const mapped: MasterDataItem[] = (res?.data || []).map((c: any) => ({
          id: c.currencyId,
          code: c.currencyCode,
          name: c.currencyName,
          company: c.companyName,
          region: c.regionName,
          status: c.isActive ? 'Active' : 'Inactive'
        }));

        this.allMasterData['Currency'] = mapped;

        if (this.selectedMasterType === 'Currency') {

          this.masterData = mapped;

          this.filterData();

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading currencies:', err);

      }

    });

  }

  private saveCurrency(): void {

    const selectedRegion = this.regions.find(
      r => r.regionName === this.formData.region &&
        r.companyId === Number(this.selectedCompanyId)
    );

    const payload = {
      currencyId: this.isEditMode ? this.formData.id : 0,
      companyId: Number(this.selectedCompanyId),
      regionId: selectedRegion ? selectedRegion.regionId : 0,
      currencyName: this.formData.name.trim(),
      currencyCode: this.formData.code.trim(),
      isActive: this.formData.status === 'Active'
    };

    const request = this.isEditMode
      ? this.masterDataService.update('currencies', payload)
      : this.masterDataService.create('currencies', payload);

    request.subscribe({

      next: () => {

        this.loadCurrencies();

        this.closeForm();

        this.alert.success('Currency saved successfully.');

      },

      error: (err) => {

        console.error('Error saving currency:', err);

        this.alert.error('Failed to save currency.');

      }

    });

  }


  // =========================================================
  // PRIORITY (DYNAMIC, FROM EXISTING MASTER APIs)
  // =========================================================

  loadPriorities(): void {

    this.masterDataService.getAll('priorities').subscribe({

      next: (res: any) => {

        const mapped: MasterDataItem[] = (res?.data || []).map((p: any) => ({
          id: p.priorityId,
          code: p.priorityCode,
          name: p.priorityName,
          company: p.companyName,
          region: p.regionName,
          status: p.isActive ? 'Active' : 'Inactive'
        }));

        this.allMasterData['Priority'] = mapped;

        if (this.selectedMasterType === 'Priority') {

          this.masterData = mapped;

          this.filterData();

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading priorities:', err);

      }

    });

  }

  private savePriority(): void {

    const selectedRegion = this.regions.find(
      r => r.regionName === this.formData.region &&
        r.companyId === Number(this.selectedCompanyId)
    );

    const payload = {
      priorityId: this.isEditMode ? this.formData.id : 0,
      companyId: Number(this.selectedCompanyId),
      regionId: selectedRegion ? selectedRegion.regionId : 0,
      priorityName: this.formData.name.trim(),
      priorityCode: this.formData.code.trim(),
      isActive: this.formData.status === 'Active'
    };

    const request = this.isEditMode
      ? this.masterDataService.update('priorities', payload)
      : this.masterDataService.create('priorities', payload);

    request.subscribe({

      next: () => {

        this.loadPriorities();

        this.closeForm();

        this.alert.success('Priority saved successfully.');

      },

      error: (err) => {

        console.error('Error saving priority:', err);

        this.alert.error('Failed to save priority.');

      }

    });

  }


  // =========================================================
  // LEAD STATUS (DYNAMIC, FROM EXISTING MASTER APIs)
  // =========================================================

  loadLeadStatuses(): void {

    this.masterDataService.getAll('leadStatuses').subscribe({

      next: (res: any) => {

        const mapped: MasterDataItem[] = (res?.data || []).map((l: any) => ({
          id: l.leadStatusId,
          code: l.leadStatusCode,
          name: l.leadStatusName,
          company: l.companyName,
          region: l.regionName,
          status: l.isActive ? 'Active' : 'Inactive'
        }));

        this.allMasterData['Lead Status'] = mapped;

        if (this.selectedMasterType === 'Lead Status') {

          this.masterData = mapped;

          this.filterData();

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading lead statuses:', err);

      }

    });

  }

  private saveLeadStatus(): void {

    const selectedRegion = this.regions.find(
      r => r.regionName === this.formData.region &&
        r.companyId === Number(this.selectedCompanyId)
    );

    const payload = {
      leadStatusId: this.isEditMode ? this.formData.id : 0,
      companyId: Number(this.selectedCompanyId),
      regionId: selectedRegion ? selectedRegion.regionId : 0,
      leadStatusName: this.formData.name.trim(),
      leadStatusCode: this.formData.code.trim(),
      isActive: this.formData.status === 'Active'
    };

    const request = this.isEditMode
      ? this.masterDataService.update('leadStatuses', payload)
      : this.masterDataService.create('leadStatuses', payload);

    request.subscribe({

      next: () => {

        this.loadLeadStatuses();

        this.closeForm();

        this.alert.success('Lead Status saved successfully.');

      },

      error: (err) => {

        console.error('Error saving lead status:', err);

        this.alert.error('Failed to save lead status.');

      }

    });

  }


  // =========================================================
  // LEAD SOURCE (DYNAMIC, FROM EXISTING MASTER APIs)
  // =========================================================

  loadLeadSources(): void {

    this.masterDataService.getAll('leadSources').subscribe({

      next: (res: any) => {

        const mapped: MasterDataItem[] = (res?.data || []).map((l: any) => ({
          id: l.leadSourceId,
          code: l.leadSourceCode,
          name: l.leadSourceName,
          company: l.companyName,
          region: l.regionName,
          status: l.isActive ? 'Active' : 'Inactive'
        }));

        this.allMasterData['Lead Source'] = mapped;

        if (this.selectedMasterType === 'Lead Source') {

          this.masterData = mapped;

          this.filterData();

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading lead sources:', err);

      }

    });

  }

  private saveLeadSource(): void {

    const selectedRegion = this.regions.find(
      r => r.regionName === this.formData.region &&
        r.companyId === Number(this.selectedCompanyId)
    );

    const payload = {
      leadSourceId: this.isEditMode ? this.formData.id : 0,
      companyId: Number(this.selectedCompanyId),
      regionId: selectedRegion ? selectedRegion.regionId : 0,
      leadSourceName: this.formData.name.trim(),
      leadSourceCode: this.formData.code.trim(),
      isActive: this.formData.status === 'Active'
    };

    const request = this.isEditMode
      ? this.masterDataService.update('leadSources', payload)
      : this.masterDataService.create('leadSources', payload);

    request.subscribe({

      next: () => {

        this.loadLeadSources();

        this.closeForm();

        this.alert.success('Lead Source saved successfully.');

      },

      error: (err) => {

        console.error('Error saving lead source:', err);

        this.alert.error('Failed to save lead source.');

      }

    });

  }


  // =========================================================
  // BILLING CYCLE (DYNAMIC, FROM EXISTING MASTER APIs)
  // =========================================================

  loadBillingCycles(): void {

    this.masterDataService.getAll('billingCycles').subscribe({

      next: (res: any) => {

        const mapped: MasterDataItem[] = (res?.data || []).map((b: any) => ({
          id: b.billingCycleId,
          code: b.billingCycleCode,
          name: b.billingCycleName,
          company: b.companyName,
          region: b.regionName,
          status: b.isActive ? 'Active' : 'Inactive'
        }));

        this.allMasterData['Billing Cycle'] = mapped;

        if (this.selectedMasterType === 'Billing Cycle') {

          this.masterData = mapped;

          this.filterData();

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading billing cycles:', err);

      }

    });

  }

  private saveBillingCycle(): void {

    const selectedRegion = this.regions.find(
      r => r.regionName === this.formData.region &&
        r.companyId === Number(this.selectedCompanyId)
    );

    const payload = {
      billingCycleId: this.isEditMode ? this.formData.id : 0,
      companyId: Number(this.selectedCompanyId),
      regionId: selectedRegion ? selectedRegion.regionId : 0,
      billingCycleName: this.formData.name.trim(),
      billingCycleCode: this.formData.code.trim(),
      isActive: this.formData.status === 'Active'
    };

    const request = this.isEditMode
      ? this.masterDataService.update('billingCycles', payload)
      : this.masterDataService.create('billingCycles', payload);

    request.subscribe({

      next: () => {

        this.loadBillingCycles();

        this.closeForm();

        this.alert.success('Billing Cycle saved successfully.');

      },

      error: (err) => {

        console.error('Error saving billing cycle:', err);

        this.alert.error('Failed to save billing cycle.');

      }

    });

  }


  // =========================================================
  // CONTACT TYPE (DYNAMIC, FROM EXISTING MASTER APIs)
  // =========================================================

  loadContactTypes(): void {

    this.masterDataService.getAll('contactTypes').subscribe({

      next: (res: any) => {

        const mapped: MasterDataItem[] = (res?.data || []).map((c: any) => ({
          id: c.contactTypeId,
          code: c.contactTypeCode,
          name: c.contactTypeName,
          company: c.companyName,
          region: c.regionName,
          status: c.isActive ? 'Active' : 'Inactive'
        }));

        this.allMasterData['Contact Type'] = mapped;

        if (this.selectedMasterType === 'Contact Type') {

          this.masterData = mapped;

          this.filterData();

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading contact types:', err);

      }

    });

  }

  private saveContactType(): void {

    const selectedRegion = this.regions.find(
      r => r.regionName === this.formData.region &&
        r.companyId === Number(this.selectedCompanyId)
    );

    const payload = {
      contactTypeId: this.isEditMode ? this.formData.id : 0,
      companyId: Number(this.selectedCompanyId),
      regionId: selectedRegion ? selectedRegion.regionId : 0,
      contactTypeName: this.formData.name.trim(),
      contactTypeCode: this.formData.code.trim(),
      isActive: this.formData.status === 'Active'
    };

    const request = this.isEditMode
      ? this.masterDataService.update('contactTypes', payload)
      : this.masterDataService.create('contactTypes', payload);

    request.subscribe({

      next: () => {

        this.loadContactTypes();

        this.closeForm();

        this.alert.success('Contact Type saved successfully.');

      },

      error: (err) => {

        console.error('Error saving contact type:', err);

        this.alert.error('Failed to save contact type.');

      }

    });

  }


  // =========================================================
  // RELATIONSHIP (DYNAMIC, FROM EXISTING MASTER APIs)
  // =========================================================

  loadRelationships(): void {

    this.masterDataService.getAll('relationships').subscribe({

      next: (res: any) => {

        const mapped: MasterDataItem[] = (res?.data || []).map((r: any) => ({
          id: r.relationshipId,
          code: r.relationshipCode,
          name: r.relationshipName,
          company: r.companyName,
          region: r.regionName,
          status: r.isActive ? 'Active' : 'Inactive'
        }));

        this.allMasterData['Relationship'] = mapped;

        if (this.selectedMasterType === 'Relationship') {

          this.masterData = mapped;

          this.filterData();

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading relationships:', err);

      }

    });

  }

  private saveRelationship(): void {

    const selectedRegion = this.regions.find(
      r => r.regionName === this.formData.region &&
        r.companyId === Number(this.selectedCompanyId)
    );

    const payload = {
      relationshipId: this.isEditMode ? this.formData.id : 0,
      companyId: Number(this.selectedCompanyId),
      regionId: selectedRegion ? selectedRegion.regionId : 0,
      relationshipName: this.formData.name.trim(),
      relationshipCode: this.formData.code.trim(),
      isActive: this.formData.status === 'Active'
    };

    const request = this.isEditMode
      ? this.masterDataService.update('relationships', payload)
      : this.masterDataService.create('relationships', payload);

    request.subscribe({

      next: () => {

        this.loadRelationships();

        this.closeForm();

        this.alert.success('Relationship saved successfully.');

      },

      error: (err) => {

        console.error('Error saving relationship:', err);

        this.alert.error('Failed to save relationship.');

      }

    });

  }


  // =========================================================
  // COMPANY TYPE (DYNAMIC, FROM EXISTING MASTER APIs)
  // =========================================================

  loadCompanyTypes(): void {

    this.masterDataService.getAll('companyTypes').subscribe({

      next: (res: any) => {

        const mapped: MasterDataItem[] = (res?.data || []).map((c: any) => ({
          id: c.companyTypeId,
          code: c.companyTypeCode,
          name: c.companyTypeName,
          company: c.companyName,
          region: c.regionName,
          status: c.isActive ? 'Active' : 'Inactive'
        }));

        this.allMasterData['Company Type'] = mapped;

        if (this.selectedMasterType === 'Company Type') {

          this.masterData = mapped;

          this.filterData();

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading company types:', err);

      }

    });

  }

  private saveCompanyType(): void {

    const selectedRegion = this.regions.find(
      r => r.regionName === this.formData.region &&
        r.companyId === Number(this.selectedCompanyId)
    );

    const payload = {
      companyTypeId: this.isEditMode ? this.formData.id : 0,
      companyId: Number(this.selectedCompanyId),
      regionId: selectedRegion ? selectedRegion.regionId : 0,
      companyTypeName: this.formData.name.trim(),
      companyTypeCode: this.formData.code.trim(),
      isActive: this.formData.status === 'Active'
    };

    const request = this.isEditMode
      ? this.masterDataService.update('companyTypes', payload)
      : this.masterDataService.create('companyTypes', payload);

    request.subscribe({

      next: () => {

        this.loadCompanyTypes();

        this.closeForm();

        this.alert.success('Company Type saved successfully.');

      },

      error: (err) => {

        console.error('Error saving company type:', err);

        this.alert.error('Failed to save company type.');

      }

    });

  }


  // =========================================================
  // LEAD TYPE (DYNAMIC, FROM EXISTING MASTER APIs)
  // =========================================================

  loadLeadTypes(): void {

    this.masterDataService.getAll('leadTypes').subscribe({

      next: (res: any) => {

        const mapped: MasterDataItem[] = (res?.data || []).map((l: any) => ({
          id: l.leadTypeId,
          code: l.leadTypeCode,
          name: l.leadTypeName,
          company: l.companyName,
          region: l.regionName,
          status: l.isActive ? 'Active' : 'Inactive'
        }));

        this.allMasterData['Lead Type'] = mapped;

        if (this.selectedMasterType === 'Lead Type') {

          this.masterData = mapped;

          this.filterData();

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading lead types:', err);

      }

    });

  }

  private saveLeadType(): void {

    const selectedRegion = this.regions.find(
      r => r.regionName === this.formData.region &&
        r.companyId === Number(this.selectedCompanyId)
    );

    const payload = {
      leadTypeId: this.isEditMode ? this.formData.id : 0,
      companyId: Number(this.selectedCompanyId),
      regionId: selectedRegion ? selectedRegion.regionId : 0,
      leadTypeName: this.formData.name.trim(),
      leadTypeCode: this.formData.code.trim(),
      isActive: this.formData.status === 'Active'
    };

    const request = this.isEditMode
      ? this.masterDataService.update('leadTypes', payload)
      : this.masterDataService.create('leadTypes', payload);

    request.subscribe({

      next: () => {

        this.loadLeadTypes();

        this.closeForm();

        this.alert.success('Lead Type saved successfully.');

      },

      error: (err) => {

        console.error('Error saving lead type:', err);

        this.alert.error('Failed to save lead type.');

      }

    });

  }


  // =========================================================
  // LICENSE (DYNAMIC, FROM EXISTING MASTER APIs)
  // =========================================================

  loadLicenses(): void {

    this.masterDataService.getAll('licenses').subscribe({

      next: (res: any) => {

        const mapped: MasterDataItem[] = (res?.data || []).map((l: any) => ({
          id: l.licenseId,
          code: l.licenseCode,
          name: l.licenseName,
          company: l.companyName,
          region: l.regionName,
          status: l.isActive ? 'Active' : 'Inactive'
        }));

        this.allMasterData['License'] = mapped;

        if (this.selectedMasterType === 'License') {

          this.masterData = mapped;

          this.filterData();

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading licenses:', err);

      }

    });

  }

  private saveLicense(): void {

    const selectedRegion = this.regions.find(
      r => r.regionName === this.formData.region &&
        r.companyId === Number(this.selectedCompanyId)
    );

    const payload = {
      licenseId: this.isEditMode ? this.formData.id : 0,
      companyId: Number(this.selectedCompanyId),
      regionId: selectedRegion ? selectedRegion.regionId : 0,
      licenseName: this.formData.name.trim(),
      licenseCode: this.formData.code.trim(),
      isActive: this.formData.status === 'Active'
    };

    const request = this.isEditMode
      ? this.masterDataService.update('licenses', payload)
      : this.masterDataService.create('licenses', payload);

    request.subscribe({

      next: () => {

        this.loadLicenses();

        this.closeForm();

        this.alert.success('License saved successfully.');

      },

      error: (err) => {

        console.error('Error saving license:', err);

        this.alert.error('Failed to save license.');

      }

    });

  }


  // =========================================================
  // PAYMENT METHOD (DYNAMIC, FROM EXISTING MASTER APIs)
  // =========================================================

  loadPaymentMethods(): void {

    this.masterDataService.getAll('paymentMethods').subscribe({

      next: (res: any) => {

        const mapped: MasterDataItem[] = (res?.data || []).map((p: any) => ({
          id: p.paymentMethodId,
          code: p.paymentMethodCode,
          name: p.paymentMethodName,
          company: p.companyName,
          region: p.regionName,
          status: p.isActive ? 'Active' : 'Inactive'
        }));

        this.allMasterData['Payment Method'] = mapped;

        if (this.selectedMasterType === 'Payment Method') {

          this.masterData = mapped;

          this.filterData();

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading payment methods:', err);

      }

    });

  }

  private savePaymentMethod(): void {

    const selectedRegion = this.regions.find(
      r => r.regionName === this.formData.region &&
        r.companyId === Number(this.selectedCompanyId)
    );

    const payload = {
      paymentMethodId: this.isEditMode ? this.formData.id : 0,
      companyId: Number(this.selectedCompanyId),
      regionId: selectedRegion ? selectedRegion.regionId : 0,
      paymentMethodName: this.formData.name.trim(),
      paymentMethodCode: this.formData.code.trim(),
      isActive: this.formData.status === 'Active'
    };

    const request = this.isEditMode
      ? this.masterDataService.update('paymentMethods', payload)
      : this.masterDataService.create('paymentMethods', payload);

    request.subscribe({

      next: () => {

        this.loadPaymentMethods();

        this.closeForm();

        this.alert.success('Payment Method saved successfully.');

      },

      error: (err) => {

        console.error('Error saving payment method:', err);

        this.alert.error('Failed to save payment method.');

      }

    });

  }


  // =========================================================
  // DISCOUNT TYPE (DYNAMIC, FROM EXISTING MASTER APIs)
  // =========================================================

  loadDiscountTypes(): void {

    this.masterDataService.getAll('discountTypes').subscribe({

      next: (res: any) => {

        const mapped: MasterDataItem[] = (res?.data || []).map((d: any) => ({
          id: d.discountTypeId,
          code: d.discountTypeCode,
          name: d.discountTypeName,
          company: d.companyName,
          region: d.regionName,
          status: d.isActive ? 'Active' : 'Inactive'
        }));

        this.allMasterData['Discount Type'] = mapped;

        if (this.selectedMasterType === 'Discount Type') {

          this.masterData = mapped;

          this.filterData();

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading discount types:', err);

      }

    });

  }

  private saveDiscountType(): void {

    const selectedRegion = this.regions.find(
      r => r.regionName === this.formData.region &&
        r.companyId === Number(this.selectedCompanyId)
    );

    const payload = {
      discountTypeId: this.isEditMode ? this.formData.id : 0,
      companyId: Number(this.selectedCompanyId),
      regionId: selectedRegion ? selectedRegion.regionId : 0,
      discountTypeName: this.formData.name.trim(),
      discountTypeCode: this.formData.code.trim(),
      isActive: this.formData.status === 'Active'
    };

    const request = this.isEditMode
      ? this.masterDataService.update('discountTypes', payload)
      : this.masterDataService.create('discountTypes', payload);

    request.subscribe({

      next: () => {

        this.loadDiscountTypes();

        this.closeForm();

        this.alert.success('Discount Type saved successfully.');

      },

      error: (err) => {

        console.error('Error saving discount type:', err);

        this.alert.error('Failed to save discount type.');

      }

    });

  }


  // =========================================================
  // MEETING PURPOSE (DYNAMIC, FROM EXISTING MASTER APIs)
  // =========================================================

  loadMeetingPurposes(): void {

    this.masterDataService.getAll('meetingPurposes').subscribe({

      next: (res: any) => {

        const mapped: MasterDataItem[] = (res?.data || []).map((m: any) => ({
          id: m.meetingPurposeId,
          code: m.meetingPurposeCode,
          name: m.meetingPurposeName,
          company: m.companyName,
          region: m.regionName,
          status: m.isActive ? 'Active' : 'Inactive'
        }));

        this.allMasterData['Meeting Purpose'] = mapped;

        if (this.selectedMasterType === 'Meeting Purpose') {

          this.masterData = mapped;

          this.filterData();

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading meeting purposes:', err);

      }

    });

  }

  private saveMeetingPurpose(): void {

    const selectedRegion = this.regions.find(
      r => r.regionName === this.formData.region &&
        r.companyId === Number(this.selectedCompanyId)
    );

    const payload = {
      meetingPurposeId: this.isEditMode ? this.formData.id : 0,
      companyId: Number(this.selectedCompanyId),
      regionId: selectedRegion ? selectedRegion.regionId : 0,
      meetingPurposeName: this.formData.name.trim(),
      meetingPurposeCode: this.formData.code.trim(),
      isActive: this.formData.status === 'Active'
    };

    const request = this.isEditMode
      ? this.masterDataService.update('meetingPurposes', payload)
      : this.masterDataService.create('meetingPurposes', payload);

    request.subscribe({

      next: () => {

        this.loadMeetingPurposes();

        this.closeForm();

        this.alert.success('Meeting Purpose saved successfully.');

      },

      error: (err) => {

        console.error('Error saving meeting purpose:', err);

        this.alert.error('Failed to save meeting purpose.');

      }

    });

  }


  // =========================================================
  // CALL PURPOSE (DYNAMIC, FROM EXISTING MASTER APIs)
  // =========================================================

  loadCallPurposes(): void {

    this.masterDataService.getAll('callPurposes').subscribe({

      next: (res: any) => {

        const mapped: MasterDataItem[] = (res?.data || []).map((c: any) => ({
          id: c.callPurposesId,
          code: c.callPurposesCode,
          name: c.callPurposesName,
          company: c.companyName,
          region: c.regionName,
          status: c.isActive ? 'Active' : 'Inactive'
        }));

        this.allMasterData['Call Purpose'] = mapped;

        if (this.selectedMasterType === 'Call Purpose') {

          this.masterData = mapped;

          this.filterData();

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading call purposes:', err);

      }

    });

  }

  private saveCallPurpose(): void {

    const selectedRegion = this.regions.find(
      r => r.regionName === this.formData.region &&
        r.companyId === Number(this.selectedCompanyId)
    );

    const payload = {
      callPurposesId: this.isEditMode ? this.formData.id : 0,
      companyId: Number(this.selectedCompanyId),
      regionId: selectedRegion ? selectedRegion.regionId : 0,
      callPurposesName: this.formData.name.trim(),
      callPurposesCode: this.formData.code.trim(),
      isActive: this.formData.status === 'Active'
    };

    const request = this.isEditMode
      ? this.masterDataService.update('callPurposes', payload)
      : this.masterDataService.create('callPurposes', payload);

    request.subscribe({

      next: () => {

        this.loadCallPurposes();

        this.closeForm();

        this.alert.success('Call Purpose saved successfully.');

      },

      error: (err) => {

        console.error('Error saving call purpose:', err);

        this.alert.error('Failed to save call purpose.');

      }

    });

  }


  // =========================================================
  // CALL OUTCOME (DYNAMIC, FROM EXISTING MASTER APIs)
  // =========================================================

  loadCallOutcomes(): void {

    this.masterDataService.getAll('callOutcomes').subscribe({

      next: (res: any) => {

        const mapped: MasterDataItem[] = (res?.data || []).map((c: any) => ({
          id: c.callOutcomesId,
          code: c.callOutcomesCode,
          name: c.callOutcomesName,
          company: c.companyName,
          region: c.regionName,
          status: c.isActive ? 'Active' : 'Inactive'
        }));

        this.allMasterData['Call Outcome'] = mapped;

        if (this.selectedMasterType === 'Call Outcome') {

          this.masterData = mapped;

          this.filterData();

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading call outcomes:', err);

      }

    });

  }

  private saveCallOutcome(): void {

    const selectedRegion = this.regions.find(
      r => r.regionName === this.formData.region &&
        r.companyId === Number(this.selectedCompanyId)
    );

    const payload = {
      callOutcomesId: this.isEditMode ? this.formData.id : 0,
      companyId: Number(this.selectedCompanyId),
      regionId: selectedRegion ? selectedRegion.regionId : 0,
      callOutcomesName: this.formData.name.trim(),
      callOutcomesCode: this.formData.code.trim(),
      isActive: this.formData.status === 'Active'
    };

    const request = this.isEditMode
      ? this.masterDataService.update('callOutcomes', payload)
      : this.masterDataService.create('callOutcomes', payload);

    request.subscribe({

      next: () => {

        this.loadCallOutcomes();

        this.closeForm();

        this.alert.success('Call Outcome saved successfully.');

      },

      error: (err) => {

        console.error('Error saving call outcome:', err);

        this.alert.error('Failed to save call outcome.');

      }

    });

  }


  // =========================================================
  // SAMPLE DATA (STATIC, PER MASTER TYPE)
  // =========================================================

  allMasterData: { [masterType: string]: MasterDataItem[] } = {

    Country: [],

    State: [],

    Industry: [],

    Currency: [],

    Priority: [],

    'Lead Status': [],

    'Lead Source': [],

    'Billing Cycle': [],

    'Contact Type': [],

    Relationship: [],

    'Company Type': [],

    'Lead Type': [],

    License: [],

    'Payment Method': [],

    'Discount Type': [],

    'Meeting Purpose': [],

    'Call Purpose': [],

    'Call Outcome': [],

    // City: [
    //   { id: 1, code: 'HYD', name: 'Hyderabad', company: 'ABC Technologies', region: 'North', status: 'Active' },
    //   { id: 2, code: 'BLR', name: 'Bengaluru', company: 'Global InfoTech', region: 'East', status: 'Active' },
    //   { id: 3, code: 'CHE', name: 'Chennai', company: 'Future Vision', region: 'Central', status: 'Active' },
    //   { id: 4, code: 'MUM', name: 'Mumbai', company: 'NextGen', region: 'South', status: 'Active' },
    //   { id: 5, code: 'DEL', name: 'Delhi', company: 'Bright Solutions', region: 'West', status: 'Active' },
    //   { id: 6, code: 'PUN', name: 'Pune', company: 'ABC Technologies', region: 'South', status: 'Active' },
    //   { id: 7, code: 'KOL', name: 'Kolkata', company: 'Global InfoTech', region: 'West', status: 'Inactive' },
    //   { id: 8, code: 'AHM', name: 'Ahmedabad', company: 'Future Vision', region: 'North', status: 'Active' }
    // ],

    // Departments: [
    //   { id: 1, code: 'HR', name: 'Human Resources', company: 'ABC Technologies', region: 'North', status: 'Active' },
    //   { id: 2, code: 'FIN', name: 'Finance', company: 'Global InfoTech', region: 'East', status: 'Active' },
    //   { id: 3, code: 'SAL', name: 'Sales', company: 'Future Vision', region: 'Central', status: 'Active' },
    //   { id: 4, code: 'MKT', name: 'Marketing', company: 'NextGen', region: 'South', status: 'Active' },
    //   { id: 5, code: 'IT', name: 'Information Technology', company: 'Bright Solutions', region: 'West', status: 'Active' },
    //   { id: 6, code: 'OPS', name: 'Operations', company: 'ABC Technologies', region: 'South', status: 'Active' },
    //   { id: 7, code: 'SUP', name: 'Support', company: 'Global InfoTech', region: 'West', status: 'Active' },
    //   { id: 8, code: 'ADM', name: 'Administration', company: 'Future Vision', region: 'North', status: 'Inactive' }
    // ],

    // Designation: [
    //   { id: 1, code: 'CEO', name: 'Chief Executive Officer', company: 'ABC Technologies', region: 'North', status: 'Active' },
    //   { id: 2, code: 'MGR', name: 'Manager', company: 'Global InfoTech', region: 'East', status: 'Active' },
    //   { id: 3, code: 'SREXEC', name: 'Senior Executive', company: 'Future Vision', region: 'Central', status: 'Active' },
    //   { id: 4, code: 'EXEC', name: 'Executive', company: 'NextGen', region: 'South', status: 'Active' },
    //   { id: 5, code: 'TL', name: 'Team Lead', company: 'Bright Solutions', region: 'West', status: 'Active' },
    //   { id: 6, code: 'ASSOC', name: 'Associate', company: 'ABC Technologies', region: 'South', status: 'Active' },
    //   { id: 7, code: 'INTRN', name: 'Intern', company: 'Global InfoTech', region: 'West', status: 'Inactive' }
    // ],

    // 'Call Type': [
    //   { id: 1, code: 'IN', name: 'Inbound', company: 'ABC Technologies', region: 'North', status: 'Active' },
    //   { id: 2, code: 'OUT', name: 'Outbound', company: 'Global InfoTech', region: 'East', status: 'Active' },
    //   { id: 3, code: 'MISS', name: 'Missed', company: 'Future Vision', region: 'Central', status: 'Active' },
    //   { id: 4, code: 'SCH', name: 'Scheduled', company: 'NextGen', region: 'South', status: 'Active' }
    // ],


    // 'Ticket Category': [
    //   { id: 1, code: 'TECH', name: 'Technical Issue', company: 'ABC Technologies', region: 'North', status: 'Active' },
    //   { id: 2, code: 'BILL', name: 'Billing', company: 'Global InfoTech', region: 'East', status: 'Active' },
    //   { id: 3, code: 'GEN', name: 'General Inquiry', company: 'Future Vision', region: 'Central', status: 'Active' },
    //   { id: 4, code: 'FEAT', name: 'Feature Request', company: 'NextGen', region: 'South', status: 'Active' },
    //   { id: 5, code: 'BUG', name: 'Bug Report', company: 'Bright Solutions', region: 'West', status: 'Inactive' }
    // ],

    // 'Customer Type': [
    //   { id: 1, code: 'IND', name: 'Individual', company: 'ABC Technologies', region: 'North', status: 'Active' },
    //   { id: 2, code: 'CORP', name: 'Corporate', company: 'Global InfoTech', region: 'East', status: 'Active' },
    //   { id: 3, code: 'GOV', name: 'Government', company: 'Future Vision', region: 'Central', status: 'Active' },
    //   { id: 4, code: 'NGO', name: 'Non-Profit', company: 'NextGen', region: 'South', status: 'Active' },
    //   { id: 5, code: 'SMB', name: 'Small Business', company: 'Bright Solutions', region: 'West', status: 'Inactive' }
    // ],


  };


  masterData: MasterDataItem[] = [];


  filteredData: MasterDataItem[] = [];


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.masterData = this.allMasterData[this.selectedMasterType];

    this.filteredData = [...this.masterData];

    this.loadCompanies();

    this.loadRegions();

    this.loadCountries();

    this.loadCountriesForForm();

    this.loadStates();

    this.loadIndustries();

    this.loadCurrencies();

    this.loadPriorities();

    this.loadLeadStatuses();

    this.loadLeadSources();

    this.loadBillingCycles();

    this.loadContactTypes();

    this.loadRelationships();

    this.loadCompanyTypes();

    this.loadLeadTypes();

    this.loadLicenses();

    this.loadPaymentMethods();

    this.loadDiscountTypes();

    this.loadMeetingPurposes();

    this.loadCallPurposes();

    this.loadCallOutcomes();

  }


  // =========================================================
  // SELECT MASTER TYPE
  // =========================================================

  selectMasterType(masterType: string): void {

    this.selectedMasterType = masterType;

    this.searchText = '';

    this.selectedStatus = 'All';

    this.closeForm();

    if (masterType === 'Country') {

      this.loadCountries();

    } else if (masterType === 'State') {

      this.loadStates();

    } else if (masterType === 'Industry') {

      this.loadIndustries();

    } else if (masterType === 'Currency') {

      this.loadCurrencies();

    } else if (masterType === 'Priority') {

      this.loadPriorities();

    } else if (masterType === 'Lead Status') {

      this.loadLeadStatuses();

    } else if (masterType === 'Lead Source') {

      this.loadLeadSources();

    } else if (masterType === 'Billing Cycle') {

      this.loadBillingCycles();

    } else if (masterType === 'Contact Type') {

      this.loadContactTypes();

    } else if (masterType === 'Relationship') {

      this.loadRelationships();

    } else if (masterType === 'Company Type') {

      this.loadCompanyTypes();

    } else if (masterType === 'Lead Type') {

      this.loadLeadTypes();

    } else if (masterType === 'License') {

      this.loadLicenses();

    } else if (masterType === 'Payment Method') {

      this.loadPaymentMethods();

    } else if (masterType === 'Discount Type') {

      this.loadDiscountTypes();

    } else if (masterType === 'Meeting Purpose') {

      this.loadMeetingPurposes();

    } else if (masterType === 'Call Purpose') {

      this.loadCallPurposes();

    } else if (masterType === 'Call Outcome') {

      this.loadCallOutcomes();

    }

    this.masterData = this.allMasterData[this.selectedMasterType] || [];

    this.filteredData = [...this.masterData];

  }


  // =========================================================
  // DROPDOWN CHANGE
  // =========================================================

  onMasterTypeChange(): void {

    this.selectMasterType(this.selectedMasterType);

  }


  // =========================================================
  // SEARCH + FILTER
  // =========================================================

  filterData(): void {

    const search = this.searchText
      .trim()
      .toLowerCase();

    this.filteredData = this.masterData.filter(item => {

      const matchesSearch =
        !search ||
        item.code.toLowerCase().includes(search) ||
        item.name.toLowerCase().includes(search) ||
        item.company.toLowerCase().includes(search) ||
        item.region.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedStatus === 'All' ||
        item.status === this.selectedStatus;

      return matchesSearch && matchesStatus;

    });

  }


  // =========================================================
  // RESET
  // =========================================================

  resetFilters(): void {

    this.searchText = '';

    this.selectedStatus = 'All';

    this.filteredData = [...this.masterData];

  }


  // =========================================================
  // ADD
  // =========================================================

  openAddForm(): void {

    this.isEditMode = false;

    this.selectedCompanyId = null;

    this.selectedCountryId = null;

    this.formData = {
      id: 0,
      code: '',
      name: '',
      company: '',
      region: '',
      status: 'Active'
    };

    this.showForm = true;

  }


  // =========================================================
  // EDIT
  // =========================================================

  editItem(item: MasterDataItem): void {

    this.isEditMode = true;

    this.formData = {
      id: item.id,
      code: item.code,
      name: item.name,
      company: item.company,
      region: item.region,
      status: item.status
    };

    const matchedCompany = this.companies.find(
      c => c.companyName === item.company
    );

    this.selectedCompanyId = matchedCompany
      ? matchedCompany.companyId
      : null;

    if (this.selectedMasterType === 'State') {

      const countryInfo = this.stateCountryLookup[item.id];

      this.selectedCountryId = countryInfo ? countryInfo.countryId : null;

    } else {

      this.selectedCountryId = null;

    }

    this.showForm = true;

  }


  // =========================================================
  // FORM: COMPANY -> REGION CASCADE
  // =========================================================

  get formRegions(): any[] {

    if (!this.selectedCompanyId) {
      return [];
    }

    return this.regions.filter(
      r => r.companyId === Number(this.selectedCompanyId)
    );

  }

  onFormCompanyChange(): void {

    const company = this.companies.find(
      c => c.companyId === Number(this.selectedCompanyId)
    );

    this.formData.company = company ? company.companyName : '';

    this.formData.region = '';

    this.selectedCountryId = null;

  }


  // =========================================================
  // FORM: COMPANY + REGION -> COUNTRY CASCADE (STATE ONLY)
  // =========================================================

  get formCountries(): any[] {

    if (!this.selectedCompanyId) {
      return [];
    }

    const region = this.regions.find(
      r => r.regionName === this.formData.region &&
        r.companyId === Number(this.selectedCompanyId)
    );

    if (!region) {
      return [];
    }

    return this.countries.filter(
      c => c.companyId === Number(this.selectedCompanyId) &&
        c.regionId === region.regionId
    );

  }


  // =========================================================
  // DELETE
  // =========================================================

  deleteItem(item: MasterDataItem): void {

    this.alert.deleteConfirm().then((result) => {

      if (!result.isConfirmed) {
        return;
      }

      if (this.selectedMasterType === 'Country') {

        this.masterDataService.delete('countries', item.id).subscribe({

          next: () => {

            this.loadCountries();

            this.alert.success('Country deleted successfully.');

          },

          error: (err) => {

            console.error('Error deleting country:', err);

            this.alert.error('Failed to delete country.');

          }

        });

        return;

      }

      if (this.selectedMasterType === 'State') {

        this.masterDataService.delete('states', item.id).subscribe({

          next: () => {

            this.loadStates();

            this.alert.success('State deleted successfully.');

          },

          error: (err) => {

            console.error('Error deleting state:', err);

            this.alert.error('Failed to delete state.');

          }

        });

        return;

      }

      if (this.selectedMasterType === 'Industry') {

        this.masterDataService.delete('industries', item.id).subscribe({

          next: () => {

            this.loadIndustries();

            this.alert.success('Industry deleted successfully.');

          },

          error: (err) => {

            console.error('Error deleting industry:', err);

            this.alert.error('Failed to delete industry.');

          }

        });

        return;

      }

      if (this.selectedMasterType === 'Currency') {

        this.masterDataService.delete('currencies', item.id).subscribe({

          next: () => {

            this.loadCurrencies();

            this.alert.success('Currency deleted successfully.');

          },

          error: (err) => {

            console.error('Error deleting currency:', err);

            this.alert.error('Failed to delete currency.');

          }

        });

        return;

      }

      if (this.selectedMasterType === 'Priority') {

        this.masterDataService.delete('priorities', item.id).subscribe({

          next: () => {

            this.loadPriorities();

            this.alert.success('Priority deleted successfully.');

          },

          error: (err) => {

            console.error('Error deleting priority:', err);

            this.alert.error('Failed to delete priority.');

          }

        });

        return;

      }

      if (this.selectedMasterType === 'Lead Status') {

        this.masterDataService.delete('leadStatuses', item.id).subscribe({

          next: () => {

            this.loadLeadStatuses();

            this.alert.success('Lead Status deleted successfully.');

          },

          error: (err) => {

            console.error('Error deleting lead status:', err);

            this.alert.error('Failed to delete lead status.');

          }

        });

        return;

      }

      if (this.selectedMasterType === 'Lead Source') {

        this.masterDataService.delete('leadSources', item.id).subscribe({

          next: () => {

            this.loadLeadSources();

            this.alert.success('Lead Source deleted successfully.');

          },

          error: (err) => {

            console.error('Error deleting lead source:', err);

            this.alert.error('Failed to delete lead source.');

          }

        });

        return;

      }

      if (this.selectedMasterType === 'Billing Cycle') {

        this.masterDataService.delete('billingCycles', item.id).subscribe({

          next: () => {

            this.loadBillingCycles();

            this.alert.success('Billing Cycle deleted successfully.');

          },

          error: (err) => {

            console.error('Error deleting billing cycle:', err);

            this.alert.error('Failed to delete billing cycle.');

          }

        });

        return;

      }

      if (this.selectedMasterType === 'Contact Type') {

        this.masterDataService.delete('contactTypes', item.id).subscribe({

          next: () => {

            this.loadContactTypes();

            this.alert.success('Contact Type deleted successfully.');

          },

          error: (err) => {

            console.error('Error deleting contact type:', err);

            this.alert.error('Failed to delete contact type.');

          }

        });

        return;

      }

      if (this.selectedMasterType === 'Relationship') {

        this.masterDataService.delete('relationships', item.id).subscribe({

          next: () => {

            this.loadRelationships();

            this.alert.success('Relationship deleted successfully.');

          },

          error: (err) => {

            console.error('Error deleting relationship:', err);

            this.alert.error('Failed to delete relationship.');

          }

        });

        return;

      }

      if (this.selectedMasterType === 'Company Type') {

        this.masterDataService.delete('companyTypes', item.id).subscribe({

          next: () => {

            this.loadCompanyTypes();

            this.alert.success('Company Type deleted successfully.');

          },

          error: (err) => {

            console.error('Error deleting company type:', err);

            this.alert.error('Failed to delete company type.');

          }

        });

        return;

      }

      if (this.selectedMasterType === 'Lead Type') {

        this.masterDataService.delete('leadTypes', item.id).subscribe({

          next: () => {

            this.loadLeadTypes();

            this.alert.success('Lead Type deleted successfully.');

          },

          error: (err) => {

            console.error('Error deleting lead type:', err);

            this.alert.error('Failed to delete lead type.');

          }

        });

        return;

      }

      if (this.selectedMasterType === 'License') {

        this.masterDataService.delete('licenses', item.id).subscribe({

          next: () => {

            this.loadLicenses();

            this.alert.success('License deleted successfully.');

          },

          error: (err) => {

            console.error('Error deleting license:', err);

            this.alert.error('Failed to delete license.');

          }

        });

        return;

      }

      if (this.selectedMasterType === 'Payment Method') {

        this.masterDataService.delete('paymentMethods', item.id).subscribe({

          next: () => {

            this.loadPaymentMethods();

            this.alert.success('Payment Method deleted successfully.');

          },

          error: (err) => {

            console.error('Error deleting payment method:', err);

            this.alert.error('Failed to delete payment method.');

          }

        });

        return;

      }

      if (this.selectedMasterType === 'Discount Type') {

        this.masterDataService.delete('discountTypes', item.id).subscribe({

          next: () => {

            this.loadDiscountTypes();

            this.alert.success('Discount Type deleted successfully.');

          },

          error: (err) => {

            console.error('Error deleting discount type:', err);

            this.alert.error('Failed to delete discount type.');

          }

        });

        return;

      }

      if (this.selectedMasterType === 'Meeting Purpose') {

        this.masterDataService.delete('meetingPurposes', item.id).subscribe({

          next: () => {

            this.loadMeetingPurposes();

            this.alert.success('Meeting Purpose deleted successfully.');

          },

          error: (err) => {

            console.error('Error deleting meeting purpose:', err);

            this.alert.error('Failed to delete meeting purpose.');

          }

        });

        return;

      }

      if (this.selectedMasterType === 'Call Purpose') {

        this.masterDataService.delete('callPurposes', item.id).subscribe({

          next: () => {

            this.loadCallPurposes();

            this.alert.success('Call Purpose deleted successfully.');

          },

          error: (err) => {

            console.error('Error deleting call purpose:', err);

            this.alert.error('Failed to delete call purpose.');

          }

        });

        return;

      }

      if (this.selectedMasterType === 'Call Outcome') {

        this.masterDataService.delete('callOutcomes', item.id).subscribe({

          next: () => {

            this.loadCallOutcomes();

            this.alert.success('Call Outcome deleted successfully.');

          },

          error: (err) => {

            console.error('Error deleting call outcome:', err);

            this.alert.error('Failed to delete call outcome.');

          }

        });

        return;

      }

      this.masterData = this.masterData.filter(
        x => x.id !== item.id
      );

      this.allMasterData[this.selectedMasterType] = this.masterData;

      this.filterData();

    });

  }


  // =========================================================
  // SAVE / UPDATE
  // =========================================================

  saveItem(): void {

    // if (!this.formData.code.trim()) {

    //   window.alert(
    //     `${this.selectedMasterType} code is required.`
    //   );

    //   return;

    // }

    if (!this.formData.name.trim()) {

      this.alert.warning(
        `${this.selectedMasterType} name is required.`
      );

      return;

    }

    if (!this.formData.company) {

      this.alert.warning('Company is required.');

      return;

    }

    if (!this.formData.region) {

      this.alert.warning('Region is required.');

      return;

    }

    if (this.selectedMasterType === 'Country') {

      this.saveCountry();

      return;

    }

    if (this.selectedMasterType === 'State') {

      if (!this.selectedCountryId) {

        this.alert.warning('Country is required.');

        return;

      }

      this.saveState();

      return;

    }

    if (this.selectedMasterType === 'Industry') {

      this.saveIndustry();

      return;

    }

    if (this.selectedMasterType === 'Currency') {

      this.saveCurrency();

      return;

    }

    if (this.selectedMasterType === 'Priority') {

      this.savePriority();

      return;

    }

    if (this.selectedMasterType === 'Lead Status') {

      this.saveLeadStatus();

      return;

    }

    if (this.selectedMasterType === 'Lead Source') {

      this.saveLeadSource();

      return;

    }

    if (this.selectedMasterType === 'Billing Cycle') {

      this.saveBillingCycle();

      return;

    }

    if (this.selectedMasterType === 'Contact Type') {

      this.saveContactType();

      return;

    }

    if (this.selectedMasterType === 'Relationship') {

      this.saveRelationship();

      return;

    }

    if (this.selectedMasterType === 'Company Type') {

      this.saveCompanyType();

      return;

    }

    if (this.selectedMasterType === 'Lead Type') {

      this.saveLeadType();

      return;

    }

    if (this.selectedMasterType === 'License') {

      this.saveLicense();

      return;

    }

    if (this.selectedMasterType === 'Payment Method') {

      this.savePaymentMethod();

      return;

    }

    if (this.selectedMasterType === 'Discount Type') {

      this.saveDiscountType();

      return;

    }

    if (this.selectedMasterType === 'Meeting Purpose') {

      this.saveMeetingPurpose();

      return;

    }

    if (this.selectedMasterType === 'Call Purpose') {

      this.saveCallPurpose();

      return;

    }

    if (this.selectedMasterType === 'Call Outcome') {

      this.saveCallOutcome();

      return;

    }


    // UPDATE

    if (this.isEditMode) {

      const index = this.masterData.findIndex(
        x => x.id === this.formData.id
      );

      if (index !== -1) {

        this.masterData[index] = {
          ...this.formData
        };

      }

    }

    // ADD

    else {

      const newId =
        this.masterData.length > 0
          ? Math.max(
              ...this.masterData.map(x => x.id)
            ) + 1
          : 1;

      this.masterData.push({

        id: newId,

        code: this.formData.code.trim(),

        name: this.formData.name.trim(),

        company: this.formData.company,

        region: this.formData.region,

        status: this.formData.status

      });

    }

    this.allMasterData[this.selectedMasterType] = this.masterData;

    this.filterData();

    this.closeForm();

  }


  // =========================================================
  // CLOSE FORM
  // =========================================================

  closeForm(): void {

    this.showForm = false;

  }
}
