import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ControlsystemService } from '../services/controlsystem-service';
import { ChangeDetectorRef } from '@angular/core';

type OrgStatus = 'Active' | 'Trial' | 'Inactive' | 'Suspended';
export interface Plan {
  planId: number;
  planName: string;
  description: string;
  price: number;
  userLimit: number;
  storageLimit: number;
  apiLimit: number;
  accent: string;
  features: string;
  status: boolean;
}

interface OrgFeature {
  key: string;
  label: string;
  icon: string;
}

interface TenantOrganization {
  id: number;
  name: string;
  domain: string;
  adminEmail: string;
  plan: string;
  status: OrgStatus;
  users: number;
  maxUsers: number;
  storageUsedGB: number;
  maxStorageGB: number;
  monthlyRevenue: number;
  currency: string;
  renewalDate: string;
  createdDate: string;
  brandingColor: string;
  industry: string;
  country: string;
  features: Record<string, boolean>;
  organizationCode: string;
  phone: string;
  website: string;
  logo?: string;
  timeZone: string;
  contactPerson: string;
  contactEmail: string;
  contactMobile: string;
  subscriptionStartDate: string;
}

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './organizations.html',
  styleUrl: './organizations.css',
})
export class Organizations implements OnInit {
  readonly allFeatures: OrgFeature[] = [
    { key: 'leads', label: 'Leads', icon: 'fa-user-plus' },
    { key: 'contacts', label: 'Contacts', icon: 'fa-address-book' },
    { key: 'deals', label: 'Deals', icon: 'fa-handshake' },
    { key: 'campaigns', label: 'Campaigns', icon: 'fa-bullhorn' },
    { key: 'reports', label: 'Reports', icon: 'fa-chart-line' },
    { key: 'apiAccess', label: 'API Access', icon: 'fa-code' },
    { key: 'emailSync', label: 'Email Integration', icon: 'fa-envelope' },
    { key: 'automations', label: 'Automations', icon: 'fa-bolt' }
  ];

  plans: Plan[] = [];
  readonly statuses: OrgStatus[] = ['Active', 'Trial', 'Inactive', 'Suspended'];

  readonly planMeta: Record<string, { cls: string }> = {
    Free: { cls: 'plan-free' },
    Starter: { cls: 'plan-starter' },
    Professional: { cls: 'plan-pro' },
    Enterprise: { cls: 'plan-enterprise' }
  };

  readonly statusMeta: Record<OrgStatus, { cls: string; dot: string }> = {
    Active: { cls: 'status-active', dot: 'dot-emerald' },
    Trial: { cls: 'status-trial', dot: 'dot-blue' },
    Inactive: { cls: 'status-inactive', dot: 'dot-slate' },
    Suspended: { cls: 'status-suspended', dot: 'dot-red' }
  };

  organizations: TenantOrganization[] = [];
  selectedOrganization: TenantOrganization | null = null;
  showForm = false;
  isEditing = false;
  search = '';
  statusFilter: OrgStatus | 'All' = 'All';
  planFilter: string | 'All' = 'All';
  activityMessage = '';
  selectedLogo: File | null = null;

  logoPreview: any = null;
  form: Partial<TenantOrganization> & { features: Record<string, boolean> } = this.blankForm();

  private activityTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private router: Router, private controlService: ControlsystemService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadPlans();
    this.loadOrganizations();

    //this.selectedOrganization = this.organizations[0];
  }
  loadOrganizations() {

    this.controlService.getOrganizations().subscribe({

      next: (res: any) => {

        console.log("API Response", res);

        console.log("Data", res.data);

        console.log("Length", res.data.length);

        this.organizations = res.data.map((x: any) => ({

          id: x.organizationId,

          organizationCode: x.organizationCode,

          name: x.organizationName,

          domain: x.domain,

          adminEmail: x.email,

          plan: x.planName || 'Starter',

          status: (x.status || 'Trial') as OrgStatus,

          users: 0,

          maxUsers: x.maxUsers,

          storageUsedGB: x.storageUsedGB,

          maxStorageGB: x.maxStorageGB,

          monthlyRevenue: x.monthlyRevenue,

          currency: x.currencyCode || 'INR',

          renewalDate: x.renewalDate,

          createdDate: x.createdAt,

          brandingColor: x.brandColor || '#c9143f',

          industry: x.industry,

          country: x.country,

          phone: x.phone,

          website: x.website,

          timeZone: x.timeZone,

          subscriptionStartDate: x.subscriptionStartDate,

          contactPerson: x.contactPerson,

          contactEmail: x.contactEmail,

          contactMobile: x.contactMobile,

          features: this.parseFeatures(x.features)

        }));

        if (this.organizations.length > 0) {
          this.selectedOrganization = this.organizations[0];
          this.cdr.detectChanges();
        }

        console.log("Organizations", this.organizations);

      }

    });

  }

  private parseFeatures(value: any): Record<string, boolean> {

    if (!value) {
      return this.buildFeatureMap([]);
    }

    try {

      if (typeof value === 'string') {
        return JSON.parse(value);
      }

      return value;

    } catch (e) {

      console.log('Invalid Features JSON : ', value);

      return this.buildFeatureMap([]);
    }

  }
  loadPlans() {

    this.controlService.getPlans().subscribe({

      next: (res: any) => {

        this.plans = res.data.filter((x: any) => x.status);

      },

      error: err => {
        console.log(err);
      }

    });

  }
  onPlanChange() {

    const selectedPlan = this.plans.find(
      x => x.planName === this.form.plan
    );

    if (selectedPlan) {

      this.form.maxUsers = selectedPlan.userLimit;

      this.form.maxStorageGB = selectedPlan.storageLimit;

    }

  }

  get totalTenants(): number {
    return this.organizations.length;
  }

  get activeTenants(): number {
    return this.organizations.filter((organization) => organization.status === 'Active').length;
  }

  get trialTenants(): number {
    return this.organizations.filter((organization) => organization.status === 'Trial').length;
  }

  get monthlyRevenue(): number {
    return this.organizations.reduce((sum, organization) => sum + organization.monthlyRevenue, 0);
  }

  get filteredOrganizations(): TenantOrganization[] {
    const query = this.search.trim().toLowerCase();
    return this.organizations.filter((organization) => {
      const matchesSearch = !query ||
        organization.name.toLowerCase().includes(query) ||
        organization.domain.toLowerCase().includes(query) ||
        organization.adminEmail.toLowerCase().includes(query);
      const matchesStatus = this.statusFilter === 'All' || organization.status === this.statusFilter;
      const matchesPlan = this.planFilter === 'All' || organization.plan === this.planFilter;
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }

  get enabledFeatureCount(): number {
    if (!this.selectedOrganization) {
      return 0;
    }
    return Object.values(this.selectedOrganization.features).filter(Boolean).length;
  }

  get renewalDays(): number {
    if (!this.selectedOrganization) {
      return 0;
    }
    const renewalDate = new Date(`${this.selectedOrganization.renewalDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((renewalDate.getTime() - today.getTime()) / 86400000);
  }

  selectOrganization(organization: TenantOrganization): void {
    this.selectedOrganization = organization;
    this.showForm = false;
  }

  openAddForm(): void {
    this.form = this.blankForm();
    this.isEditing = false;
    this.showForm = true;
  }

  openEditForm(organization: any): void {

    this.form = {

      ...organization,

      features: { ...organization.features }


    };
    this.logoPreview = organization.logo;

    this.isEditing = true;

    this.showForm = true;

  }

  // saveOrganization(): void {
  //   if (!this.form.name?.trim() || !this.form.domain?.trim()) {
  //     this.showActivity('Name and domain are required.');
  //     return;
  //   }

  //   if (this.isEditing && this.form.id) {
  //     const index = this.organizations.findIndex((organization) => organization.id === this.form.id);
  //     if (index >= 0) {
  //       this.organizations[index] = { ...this.organizations[index], ...this.form } as TenantOrganization;
  //       this.selectedOrganization = this.organizations[index];
  //     }
  //     this.showActivity(`${this.form.name} updated.`);
  //   } else {
  //     const organization: TenantOrganization = {
  //       id: `org-${Date.now()}`,
  //       name: this.form.name,
  //       domain: this.form.domain,
  //       adminEmail: this.form.adminEmail || '',
  //       plan: this.form.plan || 'Starter',
  //       status: this.form.status || 'Trial',
  //       users: 0,
  //       maxUsers: this.form.maxUsers || 20,
  //       storageUsedGB: 0,
  //       maxStorageGB: this.form.maxStorageGB || 5,
  //       monthlyRevenue: 0,
  //       currency: 'INR',
  //       renewalDate: this.form.renewalDate || '2026-06-30',
  //       createdDate: new Date().toISOString().slice(0, 10),
  //       brandingColor: this.form.brandingColor || '#c9143f',
  //       industry: this.form.industry || '',
  //       country: this.form.country || '',
  //       organizationCode: 'ORG0001',
  //       phone: '+1 555 123456',
  //       website: 'https://cyberdyne.com',
  //       timeZone: 'America/New_York',
  //       subscriptionStartDate: '2026-01-01',
  //       contactPerson: 'John Smith',
  //       contactEmail: 'john.smith@cyberdyne.com',
  //       contactMobile: '+1 9876543210',
  //       features: { ...this.form.features }
  //     };
  //     this.organizations.unshift(organization);
  //     this.selectedOrganization = organization;
  //     this.showActivity(`${organization.name} created.`);
  //   }

  //   this.showForm = false;
  // }

  saveOrganization(): void {

    if (!this.form.organizationCode?.trim()) {
      this.showActivity('Organization Code is required.');
      return;
    }

    if (!this.form.name?.trim()) {
      this.showActivity('Organization Name is required.');
      return;
    }

    const selectedPlan = this.plans.find(
      x => x.planName === this.form.plan
    );

    const formData = new FormData();

    formData.append("OrganizationId", (this.form.id || 0).toString());

    formData.append("OrganizationCode", this.form.organizationCode || "");

    formData.append("OrganizationName", this.form.name || "");

    formData.append("LegalName", this.form.name || "");

    formData.append("Email", this.form.adminEmail || "");

    formData.append("Phone", this.form.phone || "");

    formData.append("Website", this.form.website || "");

    formData.append("GSTNumber", "");

    formData.append("PANNumber", "");

    formData.append("AddressLine1", "");

    formData.append("AddressLine2", "");

    formData.append("City", "");

    formData.append("State", "");

    formData.append("Country", this.form.country || "");

    formData.append("PostalCode", "");

    formData.append("Domain", this.form.domain || "");

    formData.append("ContactPerson", this.form.contactPerson || "");

    formData.append("ContactEmail", this.form.contactEmail || "");

    formData.append("ContactMobile", this.form.contactMobile || "");

    formData.append("TimeZone", this.form.timeZone || "");

    formData.append("CurrencyCode", this.form.currency || "");

    formData.append("SubscriptionStartDate", this.form.subscriptionStartDate || "");

    formData.append("RenewalDate", this.form.renewalDate || "");

    formData.append("PlanId", String(selectedPlan?.planId || 0));

    formData.append("MaxUsers", String(this.form.maxUsers || 0));

    formData.append("MaxStorageGB", String(this.form.maxStorageGB || 0));

    formData.append("StorageUsedGB", String(this.form.storageUsedGB || 0));

    formData.append("MonthlyRevenue", String(this.form.monthlyRevenue || 0));

    formData.append("BrandColor", this.form.brandingColor || "");

    formData.append("Industry", this.form.industry || "");

    formData.append("Features", JSON.stringify(this.form.features));

    if (this.selectedLogo) {

      formData.append("LogoFile", this.selectedLogo);

    }
    // ================= UPDATE =================

    if (this.isEditing) {

      this.controlService.updateOrganization(formData).subscribe({

        next: (res: any) => {

          this.showActivity(res.message);

          this.showForm = false;

          this.loadOrganizations();

        },

        error: (err) => {

          console.log(err);

          this.showActivity(err.error?.message || 'Update Failed');

        }

      });

    }

    // ================= CREATE =================

    else {

      this.controlService.createOrganization(formData).subscribe({

        next: (res: any) => {

          this.showActivity(res.message);

          this.showForm = false;

          this.loadOrganizations();

        },

        error: (err) => {

          console.log(err);

          this.showActivity(err.error?.message || 'Creation Failed');

        }

      });

    }

  }

  cancelForm(): void {
    this.showForm = false;
  }

  toggleTenant(organization: TenantOrganization): void {
    organization.status = organization.status === 'Active' ? 'Inactive' : 'Active';
    if (this.selectedOrganization?.id === organization.id) {
      this.selectedOrganization = organization;
    }
    this.showActivity(`${organization.name} is now ${organization.status}.`);
  }

  toggleFeature(key: string): void {
    if (!this.selectedOrganization) {
      return;
    }
    this.selectedOrganization.features = {
      ...this.selectedOrganization.features,
      [key]: !this.selectedOrganization.features[key]
    };
  }

  toggleFormFeature(key: string): void {
    this.form.features = {
      ...this.form.features,
      [key]: !this.form.features[key]
    };
  }

  openSubscriptions(): void {
    this.router.navigate(['/subscriptions']);
  }

  getStoragePercent(organization: TenantOrganization): number {
    return Math.min(100, Math.round((organization.storageUsedGB / organization.maxStorageGB) * 100));
  }

  getUserPercent(organization: TenantOrganization): number {
    return Math.min(100, Math.round((organization.users / organization.maxUsers) * 100));
  }

  getUsageClass(percent: number): string {
    if (percent >= 90) {
      return 'bar-red';
    }
    if (percent >= 70) {
      return 'bar-amber';
    }
    return 'bar-emerald';
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  formatMoney(value: number, currency = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(value);
  }

  formatDate(value: string): string {
    if (!value) {
      return '-';
    }
    return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  trackByOrganizationId(_: number, organization: TenantOrganization): number {
    return organization.id;
  }

  private blankForm(): Partial<TenantOrganization> & { features: Record<string, boolean> } {
    return {
      name: '',
      domain: '',
      adminEmail: '',
      plan: 'Starter',
      status: 'Trial',
      users: 0,
      maxUsers: 20,
      storageUsedGB: 0,
      maxStorageGB: 5,
      monthlyRevenue: 0,
      currency: 'INR',
      renewalDate: '2026-06-30',
      createdDate: '',
      brandingColor: '#c9143f',
      industry: '',
      country: '',
      organizationCode: '',
      phone: '',
      website: '',
      timeZone: 'Asia/Kolkata',
      contactPerson: '',
      contactEmail: '',
      contactMobile: '',
      subscriptionStartDate: new Date().toISOString().slice(0, 10),
      features: this.buildFeatureMap(['leads', 'contacts', 'deals'])

    };
  }

  private buildFeatureMap(enabledFeatures: string[]): Record<string, boolean> {
    return this.allFeatures.reduce<Record<string, boolean>>((features, feature) => {
      features[feature.key] = enabledFeatures.includes(feature.key);
      return features;
    }, {});
  }

  private showActivity(message: string): void {
    this.activityMessage = message;
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
    }
    this.activityTimer = setTimeout(() => this.activityMessage = '', 3000);
  }
  deleteOrganization(id: number) {

    this.controlService.deleteOrganization(id).subscribe({

      next: (res) => {

        this.showActivity(res.message);

        this.loadOrganizations();

      }

    });

  }
onLogoSelected(event: any) {

  if (event.target.files && event.target.files.length > 0) {

    this.selectedLogo = event.target.files[0];

    if (this.selectedLogo) {

      const reader = new FileReader();

      reader.onload = () => {
        this.logoPreview = reader.result;
      };

      reader.readAsDataURL(this.selectedLogo);
    }
  }

}
}
