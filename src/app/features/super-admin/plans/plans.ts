import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ControlsystemService } from '../services/controlsystem-service';
import { Spinnerservice } from '../../../core/services/spinnerservice';
import { Alertservice } from '../../../core/services/alertservice';
import { ChangeDetectorRef } from '@angular/core';

type PlanStatus = 'Active' | 'Draft';
type PlanAccent = 'slate' | 'blue' | 'purple' | 'rose';
type FeatureKey =
  | 'Leads'
  | 'Contacts'
  | 'Companies'
  | 'Deals'
  | 'Pipeline'
  | 'Campaigns'
  | 'Reports'
  | 'API Access'
  | 'Automation'
  | 'Integrations';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  status: PlanStatus;
  price: number;
  userLimit: number;
  storageLimit: number;
  apiLimit: number;
  accent: PlanAccent;
  features: Record<FeatureKey, boolean>;
}

@Component({
  selector: 'app-plans',
  imports: [CommonModule, FormsModule],
  templateUrl: './plans.html',
  styleUrl: './plans.css',
})
export class Plans {
  readonly allFeatures: FeatureKey[] = [
    'Leads',
    'Contacts',
    'Companies',
    'Deals',
    'Pipeline',
    'Campaigns',
    'Reports',
    'API Access',
    'Automation',
    'Integrations'
  ];

  readonly accentKeys: PlanAccent[] = ['slate', 'blue', 'purple', 'rose'];

  plans: SubscriptionPlan[] = [];
  formOpen = false;
  isEditing = false;
  activityMessage = '';
  form: SubscriptionPlan = this.blankPlan();

  private activityTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private router: Router, private controlService: ControlsystemService, private spinner: Spinnerservice,
  private alertService: Alertservice, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getPlans();
  }

getPlans(): void {

  this.spinner.show();

  this.controlService.getPlans().subscribe({

    next: (res: any) => {

      this.spinner.hide();

      if (res.success) {

        this.plans = res.data.map((x: any) => ({

          id: x.planId,

          name: x.planName,

          description: x.description ?? '',

          price: x.price,

          status: x.status ? 'Active' : 'Draft',

          userLimit: x.userLimit,

          storageLimit: x.storageLimit,

          apiLimit: x.apiLimit,

          accent: x.accent || 'blue',

          features: this.convertFeatures(x.features)

        }));
        this.cdr.detectChanges();

      }
      else {

        this.alertService.warning(res.message);

      }

    },

    error: (err) => {

      this.spinner.hide();

      console.error(err);

      this.alertService.error(
        err?.error?.message || 'Unable to load plans.'
      );

    }

  });

}
private convertFeatures(features: string | null): Record<FeatureKey, boolean> {

  const featureMap = this.buildFeatureMap([]);

  if (!features)
    return featureMap;

  const featureArray = features
    .split(',')
    .map((x: string) => x.trim());

  featureArray.forEach((feature: string) => {

    if (feature in featureMap) {

      featureMap[feature as FeatureKey] = true;

    }

  });

  return featureMap;

}
  get totalPlans(): number {
    return this.plans.length;
  }

  get activePlans(): number {
    return this.plans.filter((plan) => plan.status === 'Active').length;
  }

  get apiEnabledPlans(): number {
    return this.plans.filter((plan) => plan.features['API Access']).length;
  }

  get topStorage(): string {
    const topPlan = this.plans.reduce<SubscriptionPlan | null>((top, plan) => {
      return !top || plan.storageLimit > top.storageLimit ? plan : top;
    }, null);
    return topPlan ? `${topPlan.name} (${this.storageLabel(topPlan.storageLimit)})` : '-';
  }

  openAddForm(): void {
    console.log('Add Plan clicked');

    this.form = this.blankPlan();
    this.isEditing = false;
    this.formOpen = true;

    console.log('formOpen =', this.formOpen);
  }

  openEditForm(plan: SubscriptionPlan): void {
    this.form = {

  ...plan,

  id: plan.id,

  features: { ...plan.features }

};
    this.isEditing = true;
    this.formOpen = true;
  }

  closeForm(): void {
    this.formOpen = false;
  }

  // savePlan(): void {
  //   if (!this.form.name.trim()) {
  //     this.showActivity('Plan name is required.');
  //     return;
  //   }

  //   if (this.isEditing && this.form.id) {
  //     const index = this.plans.findIndex((plan) => plan.id === this.form.id);
  //     if (index >= 0) {
  //       this.plans[index] = { ...this.form, features: { ...this.form.features } };
  //     }
  //     this.showActivity(`${this.form.name} updated.`);
  //   } else {
  //     this.plans.push({
  //       ...this.form,
  //       id: `plan-${Date.now()}`,
  //       features: { ...this.form.features }
  //     });
  //     this.showActivity(`${this.form.name} created.`);
  //   }

  //   this.formOpen = false;
  // }
 savePlan(): void {

  if (!this.form.name.trim()) {

    this.alertService.warning('Plan Name is required');

    return;

  }

  const planDto = {

    planId: this.isEditing ? Number(this.form.id) : 0,

    planName: this.form.name,

    description: this.form.description,

    price: this.form.price,

    status: this.form.status === 'Active',

    userLimit: this.form.userLimit,

    storageLimit: this.form.storageLimit,

    apiLimit: this.form.apiLimit,

    accent: this.form.accent,

    features: this.getFeatureString(this.form.features)

  };

  this.spinner.show();

  const request = this.isEditing
    ? this.controlService.updatePlan(planDto)
    : this.controlService.createPlan(planDto);

  request.subscribe({

    next: (res: any) => {

      this.spinner.hide();

      if (res.success) {

        this.formOpen = false;

        this.getPlans();

        this.alertService.success(res.message);

      }
      else {

        this.alertService.warning(res.message);

      }

    },

    error: (err) => {

      this.spinner.hide();

      console.error(err);

      this.alertService.error(
        err?.error?.message || 'Something went wrong.'
      );

    }

  });

}
private getFeatureString(features: Record<FeatureKey, boolean>): string {

  return Object.keys(features)

    .filter(key => features[key as FeatureKey])

    .join(',');

}

  toggleStatus(plan: SubscriptionPlan): void {

  const dto = {

    planId: Number(plan.id),

    planName: plan.name,

    description: plan.description,

    price: plan.price,

    status: plan.status !== 'Active',

    userLimit: plan.userLimit,

    storageLimit: plan.storageLimit,

    apiLimit: plan.apiLimit,

    accent: plan.accent,

    features: this.getFeatureString(plan.features)

  };

  this.spinner.show();

  this.controlService.updatePlan(dto).subscribe({

    next: (res: any) => {

      this.spinner.hide();

      if (res.success) {

        this.alertService.success(res.message);

        this.getPlans();

      }

    },

    error: (err) => {

      this.spinner.hide();

      this.alertService.error(
        err?.error?.message || 'Unable to update status.'
      );

    }

  });

}

  toggleFeature(plan: SubscriptionPlan, feature: FeatureKey): void {
    plan.features[feature] = !plan.features[feature];
  }

  toggleFormFeature(feature: FeatureKey): void {
    this.form.features[feature] = !this.form.features[feature];
  }

  enabledFeatures(plan: SubscriptionPlan): FeatureKey[] {
    return this.allFeatures.filter((feature) => plan.features[feature]);
  }

  isPopular(plan: SubscriptionPlan): boolean {
    return plan.name === 'Premium';
  }

  goToSubscriptions(): void {
    this.router.navigate(['/subscriptions']);
  }

  formatMoney(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  }

  priceLabel(plan: SubscriptionPlan): string {
    return plan.price === 0 ? 'Free' : `${this.formatMoney(plan.price)}/mo`;
  }

  limitLabel(value: number): string {
    return value === -1 ? 'Unlimited' : value.toLocaleString('en-IN');
  }

  storageLabel(value: number): string {
    return value >= 1000 ? `${value / 1000} TB` : `${value} GB`;
  }

  trackByPlanId(_: number, plan: SubscriptionPlan): string {
    return plan.id;
  }

  trackByFeature(_: number, feature: FeatureKey): string {
    return feature;
  }

  private blankPlan(): SubscriptionPlan {
    return {
      id: '0',
      name: '',
      description: '',
      status: 'Draft',
      price: 0,
      userLimit: 10,
      storageLimit: 10,
      apiLimit: 10000,
      accent: 'blue',
      features: this.buildFeatureMap([])
    };
  }

  private buildFeatureMap(enabledFeatures: FeatureKey[]): Record<FeatureKey, boolean> {
    return this.allFeatures.reduce<Record<FeatureKey, boolean>>((features, feature) => {
      features[feature] = enabledFeatures.includes(feature);
      return features;
    }, {} as Record<FeatureKey, boolean>);
  }

  private showActivity(message: string): void {

  this.alertService.success(message);

}
}
