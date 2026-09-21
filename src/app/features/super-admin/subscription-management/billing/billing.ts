import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { ControlsystemService } from '../../services/controlsystem-service';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './billing.html',
  styleUrl: './billing.css',
})
export class Billing implements OnInit {
  // Search & Filters
searchText = '';
statusFilter = '';
companyFilter = '';
cycleFilter = '';
paymentMethodFilter = '';

fromDate = '';
toDate = '';

// Pagination
page = 1;
pageSize = 10;

// Form
submitted = false;
isEdit = false;
  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private controlService: ControlsystemService,
    private cdr: ChangeDetectorRef
  ) { }



  billing: any = {};

  billingList: any[] = [];

  companies: any[] = [];

  plans: any[] = [];

  ngOnInit(): void {

    this.resetForm();
    this.loadCompanies();
    this.loadPlans();
    this.loadBillings();

  }

  // ============================================
  // Load Dropdown Data
  // ============================================

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

  onCompanyChange(organizationId: any): void {

    const company = this.companies.find(c => c.organizationId === Number(organizationId));

    this.billing.organizationId = Number(organizationId);
    this.billing.companyName = company ? company.organizationName : '';

  }

  onPlanChange(planId: any): void {

    const plan = this.plans.find(p => p.planId === Number(planId));

    this.billing.planId = Number(planId);
    this.billing.planName = plan ? plan.planName : '';

  }

  // ============================================
  // Reset Form
  // ============================================

  resetForm(): void {

    this.billing = {

      billingId: 0,

      billNumber: 'BILL-' + Date.now(),

      organizationId: null,

      companyName: '',

      planId: null,

      planName: '',

      billingDate: new Date().toISOString().substring(0, 10),

      dueDate: new Date().toISOString().substring(0, 10),

      amount: 0,

      tax: 18,

      discount: 0,

      totalAmount: 0,

      paymentStatus: 'Pending',

      paymentMethod: 'UPI',

      billingAddress: '',

      notes: ''

    };

  }

  // ============================================
  // Load Records (API)
  // ============================================

  loadBillings(): void {

    this.spinner.show();

    this.controlService.getBillings().subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res.success) {

          this.billingList = (res.data || []).map((x: any) => ({
            billingId: x.billingId,
            billNumber: x.billNumber,
            organizationId: x.organizationId,
            companyName: x.organizationName,
            planId: x.planId,
            planName: x.planName,
            billingDate: (x.billingDate || '').slice(0, 10),
            dueDate: (x.dueDate || '').slice(0, 10),
            amount: x.amount,
            tax: x.tax,
            discount: x.discount,
            totalAmount: x.totalAmount,
            paymentStatus: x.paymentStatus,
            paymentMethod: x.paymentMethod,
            billingAddress: x.billingAddress,
            notes: x.notes
          }));

          this.cdr.detectChanges();

        } else {

          this.alert.warning(res.message);

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Error loading billings:', err);

        this.alert.error(err?.error?.message || 'Unable to load billing records.');

      }

    });

  }

  // ============================================
  // Save / Update
  // ============================================

  save(): void {

    this.saveBilling();

  }
  // ============================================
  // Clear
  // ============================================

  clear(): void {

    this.resetForm();

    this.isEdit = false;

    this.submitted = false;

  }

  // ============================================
  // Edit
  // ============================================

  edit(id: number): void {

    const data = this.billingList.find(x => x.billingId === id);

    if (!data) {
      return;
    }

    this.billing = {
      ...data
    };

    this.isEdit = true;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }

  // ============================================
  // View
  // ============================================

  view(id: number): void {

    const data = this.billingList.find(x => x.billingId === id);

    if (!data) {
      return;
    }

    this.alert.info(
      `Bill No : ${data.billNumber}
Company : ${data.companyName}
Plan : ${data.planName}
Total : ₹${data.totalAmount}
Status : ${data.paymentStatus}`
    );

  }

  // ============================================
  // Delete
  // ============================================

  delete(id: number): void {

    this.alert.deleteConfirm().then(result => {

      if (!result.isConfirmed) {
        return;
      }

      this.spinner.show();

      this.controlService.deleteBilling(id).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res.success) {

            this.loadBillings();

            this.alert.success(res.message);

          } else {

            this.alert.warning(res.message);

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error(err);

          this.alert.error(err?.error?.message || 'Unable to delete billing record.');

        }

      });

    });

  }

  // ============================================
  // Mark as Paid
  // ============================================

  markPaid(id: number): void {

    const data = this.billingList.find(x => x.billingId === id);

    if (!data) {
      return;
    }

    this.spinner.show();

    this.controlService.updateBilling({
      billingId: data.billingId,
      billNumber: data.billNumber,
      organizationId: data.organizationId,
      planId: data.planId,
      billingDate: data.billingDate,
      dueDate: data.dueDate,
      amount: data.amount,
      tax: data.tax,
      discount: data.discount,
      totalAmount: data.totalAmount,
      paymentStatus: 'Paid',
      paymentMethod: data.paymentMethod,
      billingAddress: data.billingAddress,
      notes: data.notes
    }).subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res.success) {

          this.loadBillings();

          this.alert.success('Payment marked as Paid.');

        } else {

          this.alert.warning(res.message);

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error(err);

        this.alert.error(err?.error?.message || 'Unable to update billing record.');

      }

    });

  }

  // ============================================
  // Refresh
  // ============================================

  refresh(): void {

    this.loadBillings();

    this.alert.success('Billing data refreshed.');

  }

  // ============================================
  // Export
  // ============================================

  exportExcel(): void {

    this.alert.info(
      'Excel export will be connected with backend.'
    );

  }

  exportPdf(): void {

    this.alert.info(
      'PDF export will be connected with backend.'
    );

  }

  // ============================================
  // Search
  // ============================================

get filteredBilling(): any[] {

  const search = this.searchText.toLowerCase().trim();

  return this.billingList.filter(x => {

    const matchesSearch =
      x.companyName?.toLowerCase().includes(search) ||
      x.billNumber?.toLowerCase().includes(search) ||
      x.planName?.toLowerCase().includes(search);

    const matchesStatus =
      !this.statusFilter || this.statusFilter === 'All' ||
      x.paymentStatus === this.statusFilter;

    const matchesCompany =
      !this.companyFilter ||
      x.companyName === this.companyFilter;

    const matchesCycle =
      !this.cycleFilter || this.cycleFilter === 'All' ||
      x.billingCycle === this.cycleFilter;

    const matchesMethod =
      !this.paymentMethodFilter || this.paymentMethodFilter === 'All' ||
      x.paymentMethod === this.paymentMethodFilter;

    return matchesSearch &&
           matchesStatus &&
           matchesCompany &&
           matchesCycle &&
           matchesMethod;

  });

}

  // ============================================
  // Pagination
  // ============================================

  get pagedBilling(): any[] {

    const start =
      (this.page - 1) * this.pageSize;

    return this.filteredBilling.slice(
      start,
      start + this.pageSize
    );

  }

  changePage(page: number): void {

    this.page = page;

  }

  changePageSize(size: number): void {

    this.pageSize = size;

    this.page = 1;

  }

  // ============================================
  // Statistics
  // ============================================

  get totalBills(): number {

    return this.billingList.length;

  }

  get paidBills(): number {

    return this.billingList.filter(
      x => x.paymentStatus === 'Paid'
    ).length;

  }

  get pendingBills(): number {

    return this.billingList.filter(
      x => x.paymentStatus === 'Pending'
    ).length;

  }

  get overdueBills(): number {

    return this.billingList.filter(
      x => x.paymentStatus === 'Overdue'
    ).length;

  }

  get totalRevenue(): number {

    return this.billingList
      .filter(x => x.paymentStatus === 'Paid')
      .reduce((sum, item) => sum + item.totalAmount, 0);

  }

  // ============================================
  // Search Clear
  // ============================================

  clearSearch(): void {

    this.searchText = '';
    this.statusFilter = '';
    this.companyFilter = '';
    this.page = 1;

  }
  get totalAmount(): number {

  return this.billingList.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );

}

get outstandingAmount(): number {

  return this.billingList
    .filter(x => x.paymentStatus !== 'Paid')
    .reduce((sum, item) => sum + item.totalAmount, 0);

}
saveBilling(): void {

  this.submitted = true;

  if (
    !this.billing.organizationId ||
    !this.billing.planId ||
    !this.billing.billNumber
  ) {

    this.alert.warning('Please fill all mandatory fields.');
    return;

  }

  const dto = {
    billingId: this.isEdit ? this.billing.billingId : 0,
    billNumber: this.billing.billNumber,
    organizationId: this.billing.organizationId,
    planId: this.billing.planId,
    billingDate: this.billing.billingDate,
    dueDate: this.billing.dueDate,
    amount: this.billing.amount,
    tax: this.billing.tax,
    discount: this.billing.discount,
    totalAmount: this.billing.totalAmount,
    paymentStatus: this.billing.paymentStatus,
    paymentMethod: this.billing.paymentMethod,
    billingAddress: this.billing.billingAddress,
    notes: this.billing.notes
  };

  this.spinner.show();

  const request = this.isEdit
    ? this.controlService.updateBilling(dto)
    : this.controlService.createBilling(dto);

  request.subscribe({

    next: (res: any) => {

      this.spinner.hide();

      if (res.success) {

        this.loadBillings();

        this.alert.success(res.message);

        this.clear();

      } else {

        this.alert.warning(res.message);

      }

    },

    error: (err) => {

      this.spinner.hide();

      console.error(err);

      this.alert.error(err?.error?.message || 'Unable to save billing record.');

    }

  });

}


}
