import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ControlsystemService } from '../services/controlsystem-service';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';

type SubStatus = 'Active' | 'Trial' | 'Suspended' | 'Cancelled' | 'Past Due';
type PayStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';

interface SubscriptionRecord {
  id: number;
  organizationId: number | null;
  company: string;
  planId: number | null;
  plan: string;
  accent: string;
  status: SubStatus;
  paymentStatus: PayStatus;
  expiryDate: string;
  amount: number;
  seats: number;
  autoRenew: boolean;
  billing: 'Monthly' | 'Annual';
  startedDate: string;
}

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscriptions.html',
  styleUrl: './subscriptions.css',
})
export class Subscriptions implements OnInit {
  readonly statuses: Array<SubStatus | 'All'> = ['All', 'Active', 'Trial', 'Suspended', 'Cancelled', 'Past Due'];
  readonly paymentStatuses: PayStatus[] = ['Paid', 'Pending', 'Failed', 'Refunded'];
  readonly billings: Array<'Monthly' | 'Annual'> = ['Monthly', 'Annual'];

  readonly statusDot: Record<SubStatus, string> = {
    Active: 'dot-emerald',
    Trial: 'dot-blue',
    Suspended: 'dot-amber',
    Cancelled: 'dot-slate',
    'Past Due': 'dot-red'
  };

  readonly statusRing: Record<SubStatus, string> = {
    Active: 'ring-emerald',
    Trial: 'ring-blue',
    Suspended: 'ring-amber',
    Cancelled: 'ring-slate',
    'Past Due': 'ring-red'
  };

  readonly paymentRing: Record<PayStatus, string> = {
    Paid: 'ring-emerald',
    Pending: 'ring-amber',
    Failed: 'ring-red',
    Refunded: 'ring-slate'
  };

  subscriptions: SubscriptionRecord[] = [];
  companies: any[] = [];
  plans: any[] = [];

  selectedId: number | null = null;
  showForm = false;
  isEditing = false;
  search = '';
  statusFilter: SubStatus | 'All' = 'All';
  form: Partial<SubscriptionRecord> = this.blankForm();

  constructor(
    private router: Router,
    private controlService: ControlsystemService,
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
    this.loadPlans();
    this.loadSubscriptions();
  }

  loadCompanies(): void {
    this.controlService.getOrganizations().subscribe({
      next: (res: any) => {
        this.companies = res?.data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading companies:', err);
        this.companies = [];
      }
    });
  }

  loadPlans(): void {
    this.controlService.getPlans().subscribe({
      next: (res: any) => {
        this.plans = res?.data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading plans:', err);
        this.plans = [];
      }
    });
  }

  loadSubscriptions(): void {
    this.spinner.show();
    this.controlService.getCompanySubscriptions().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.success) {
          this.subscriptions = (res.data || []).map((x: any) => ({
            id: x.subscriptionId,
            organizationId: x.organizationId,
            company: x.organizationName,
            planId: x.planId,
            plan: x.planName,
            accent: x.planAccent || 'blue',
            status: x.status,
            paymentStatus: x.paymentStatus,
            expiryDate: (x.expiryDate || '').slice(0, 10),
            amount: x.amount,
            seats: x.seats,
            autoRenew: x.autoRenew,
            billing: x.billingCycle,
            startedDate: (x.startedDate || '').slice(0, 10)
          }));
          this.selectedId = this.subscriptions[0]?.id ?? null;
          this.cdr.detectChanges();
        } else {
          this.alert.warning(res.message);
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
        this.alert.error(err?.error?.message || 'Unable to load subscriptions.');
      }
    });
  }

  get selectedSubscription(): SubscriptionRecord | null {
    return this.subscriptions.find((subscription) => subscription.id === this.selectedId) || null;
  }

  get activeCount(): number {
    return this.subscriptions.filter((subscription) => subscription.status === 'Active').length;
  }

  get trialCount(): number {
    return this.subscriptions.filter((subscription) => subscription.status === 'Trial').length;
  }

  get failedPayments(): number {
    return this.subscriptions.filter((subscription) => subscription.paymentStatus === 'Failed').length;
  }

  get recurringRevenue(): number {
    return this.subscriptions
      .filter((subscription) => subscription.status === 'Active')
      .reduce((sum, subscription) => sum + (subscription.billing === 'Annual' ? subscription.amount / 12 : subscription.amount), 0);
  }

  get filteredSubscriptions(): SubscriptionRecord[] {
    const query = this.search.trim().toLowerCase();
    return this.subscriptions.filter((subscription) => {
      const matchesSearch = !query || subscription.company.toLowerCase().includes(query);
      const matchesStatus = this.statusFilter === 'All' || subscription.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  get cycleProgress(): number {
    const selected = this.selectedSubscription;
    if (!selected) {
      return 0;
    }

    const start = new Date(`${selected.startedDate}T00:00:00`).getTime();
    const end = new Date(`${selected.expiryDate}T00:00:00`).getTime();
    const now = Date.now();

    if (now <= start) {
      return 0;
    }
    if (now >= end) {
      return 100;
    }
    return Math.round(((now - start) / (end - start)) * 100);
  }

  get expiryDays(): number {
    const selected = this.selectedSubscription;
    if (!selected) {
      return 0;
    }
    const expiry = new Date(`${selected.expiryDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((expiry.getTime() - today.getTime()) / 86400000);
  }

  selectSubscription(subscription: SubscriptionRecord): void {
    this.selectedId = subscription.id;
    this.showForm = false;
  }

  openAddForm(): void {
    this.form = this.blankForm();
    this.isEditing = false;
    this.showForm = true;
  }

  openEditForm(subscription: SubscriptionRecord): void {
    this.form = { ...subscription };
    this.isEditing = true;
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
  }

  onCompanyChange(organizationId: any): void {
    const company = this.companies.find((c) => c.organizationId === Number(organizationId));
    this.form.organizationId = Number(organizationId);
    this.form.company = company ? company.organizationName : '';
  }

  onPlanChange(planId: any): void {
    const plan = this.plans.find((p) => p.planId === Number(planId));
    this.form.planId = Number(planId);
    this.form.plan = plan ? plan.planName : '';
    this.form.accent = plan ? plan.accent : 'blue';
    this.form.amount = plan ? plan.price : 0;
  }

  saveSubscription(): void {
    if (!this.form.organizationId) {
      this.alert.warning('Company is required.');
      return;
    }

    if (!this.form.planId) {
      this.alert.warning('Plan is required.');
      return;
    }

    const dto = {
      subscriptionId: this.isEditing ? this.form.id : 0,
      organizationId: this.form.organizationId,
      planId: this.form.planId,
      status: this.form.status || 'Trial',
      paymentStatus: this.form.paymentStatus || 'Pending',
      startedDate: this.form.startedDate || new Date().toISOString().slice(0, 10),
      expiryDate: this.form.expiryDate || new Date().toISOString().slice(0, 10),
      amount: this.form.amount || 0,
      seats: this.form.seats || 0,
      autoRenew: !!this.form.autoRenew,
      billingCycle: this.form.billing || 'Monthly'
    };

    this.spinner.show();

    const request = this.isEditing
      ? this.controlService.updateCompanySubscription(dto)
      : this.controlService.createCompanySubscription(dto);

    request.subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.success) {
          this.showForm = false;
          this.loadSubscriptions();
          this.alert.success(res.message);
        } else {
          this.alert.warning(res.message);
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
        this.alert.error(err?.error?.message || 'Unable to save subscription.');
      }
    });
  }

  private updateSubscription(subscription: SubscriptionRecord, changes: Partial<SubscriptionRecord>, successMessage: string): void {
    const merged = { ...subscription, ...changes };

    const dto = {
      subscriptionId: merged.id,
      organizationId: merged.organizationId,
      planId: merged.planId,
      status: merged.status,
      paymentStatus: merged.paymentStatus,
      startedDate: merged.startedDate,
      expiryDate: merged.expiryDate,
      amount: merged.amount,
      seats: merged.seats,
      autoRenew: merged.autoRenew,
      billingCycle: merged.billing
    };

    this.spinner.show();

    this.controlService.updateCompanySubscription(dto).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.success) {
          this.loadSubscriptions();
          this.alert.success(successMessage);
        } else {
          this.alert.warning(res.message);
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
        this.alert.error(err?.error?.message || 'Unable to update subscription.');
      }
    });
  }

  renew(subscription: SubscriptionRecord): void {
    const nextExpiry = new Date();
    nextExpiry.setFullYear(nextExpiry.getFullYear() + 1);

    this.updateSubscription(
      subscription,
      {
        status: 'Active',
        paymentStatus: 'Paid',
        autoRenew: true,
        expiryDate: nextExpiry.toISOString().slice(0, 10)
      },
      `${subscription.company} renewed until ${nextExpiry.toDateString()}.`
    );
  }

  upgrade(subscription: SubscriptionRecord): void {
    const sortedPlans = [...this.plans].sort((a, b) => a.price - b.price);
    const currentIndex = sortedPlans.findIndex((p) => p.planId === subscription.planId);
    const nextPlan = sortedPlans[Math.min(currentIndex + 1, sortedPlans.length - 1)];

    if (!nextPlan || nextPlan.planId === subscription.planId) {
      this.alert.info(`${subscription.company} is already on the top plan.`);
      return;
    }

    this.updateSubscription(
      subscription,
      { planId: nextPlan.planId, amount: nextPlan.price },
      `${subscription.company} upgraded to ${nextPlan.planName}.`
    );
  }

  downgrade(subscription: SubscriptionRecord): void {
    const sortedPlans = [...this.plans].sort((a, b) => a.price - b.price);
    const currentIndex = sortedPlans.findIndex((p) => p.planId === subscription.planId);
    const previousPlan = sortedPlans[Math.max(currentIndex - 1, 0)];

    if (!previousPlan || previousPlan.planId === subscription.planId) {
      this.alert.info(`${subscription.company} is already on the lowest plan.`);
      return;
    }

    this.updateSubscription(
      subscription,
      { planId: previousPlan.planId, amount: previousPlan.price },
      `${subscription.company} downgraded to ${previousPlan.planName}.`
    );
  }

  toggleAutoRenew(subscription: SubscriptionRecord): void {
    this.updateSubscription(
      subscription,
      { autoRenew: !subscription.autoRenew },
      `Auto-renew ${!subscription.autoRenew ? 'enabled' : 'disabled'} for ${subscription.company}.`
    );
  }

  suspend(subscription: SubscriptionRecord): void {
    this.updateSubscription(
      subscription,
      { status: 'Suspended', autoRenew: false },
      `${subscription.company} suspended.`
    );
  }

  deleteSubscription(subscription: SubscriptionRecord): void {
    this.alert.deleteConfirm().then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.spinner.show();

      this.controlService.deleteCompanySubscription(subscription.id).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res.success) {
            if (this.selectedId === subscription.id) {
              this.selectedId = null;
            }
            this.loadSubscriptions();
            this.alert.success(res.message);
          } else {
            this.alert.warning(res.message);
          }
        },
        error: (err) => {
          this.spinner.hide();
          console.error(err);
          this.alert.error(err?.error?.message || 'Unable to delete subscription.');
        }
      });
    });
  }

  goToOrganizations(): void {
    this.router.navigate(['/organizations']);
  }

  goToPlans(): void {
    this.router.navigate(['/plans']);
  }

  formatMoney(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
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

  priceLabel(subscription: SubscriptionRecord): string {
    if (subscription.amount === 0) {
      return 'Trial';
    }
    return `${this.formatMoney(subscription.amount)}/${subscription.billing === 'Annual' ? 'yr' : 'mo'}`;
  }

  trackBySubscriptionId(_: number, subscription: SubscriptionRecord): number {
    return subscription.id;
  }

  private blankForm(): Partial<SubscriptionRecord> {
    const defaultDate = new Date().toISOString().slice(0, 10);
    return {
      organizationId: null,
      company: '',
      planId: null,
      plan: '',
      accent: 'blue',
      status: 'Trial',
      paymentStatus: 'Pending',
      startedDate: defaultDate,
      expiryDate: defaultDate,
      amount: 0,
      seats: 20,
      autoRenew: false,
      billing: 'Monthly'
    };
  }
}
