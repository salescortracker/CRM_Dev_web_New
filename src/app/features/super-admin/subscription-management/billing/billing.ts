import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './billing.html',
  styleUrl: './billing.css',
})
export class Billing {
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
    private spinner: Spinnerservice
  ) { }



  billing: any = {};

  billingList: any[] = [];

  ngOnInit(): void {

    this.resetForm();
    this.loadStaticData();

  }

  // ============================================
  // Reset Form
  // ============================================

  resetForm(): void {

    this.billing = {

      billingId: 0,

      billNumber: 'BILL-1001',

      companyName: '',

      planName: 'Professional',

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
  // Load Static Records
  // ============================================

  loadStaticData(): void {

    this.billingList = [

      {
        billingId: 1,
        billNumber: 'BILL-1001',
        companyName: 'ABC Technologies',
        planName: 'Professional',
        billingDate: '2026-07-01',
        dueDate: '2026-07-10',
        amount: 12000,
        tax: 18,
        discount: 500,
        totalAmount: 13660,
        paymentStatus: 'Paid',
        paymentMethod: 'UPI',
        billingAddress: 'Hyderabad',
        notes: 'Monthly Subscription'
      },

      {
        billingId: 2,
        billNumber: 'BILL-1002',
        companyName: 'XYZ Solutions',
        planName: 'Enterprise',
        billingDate: '2026-07-05',
        dueDate: '2026-07-15',
        amount: 25000,
        tax: 18,
        discount: 1000,
        totalAmount: 28500,
        paymentStatus: 'Pending',
        paymentMethod: 'Credit Card',
        billingAddress: 'Bangalore',
        notes: 'Yearly Subscription'
      },

      {
        billingId: 3,
        billNumber: 'BILL-1003',
        companyName: 'Nova Tech',
        planName: 'Starter',
        billingDate: '2026-07-08',
        dueDate: '2026-07-20',
        amount: 6000,
        tax: 18,
        discount: 0,
        totalAmount: 7080,
        paymentStatus: 'Overdue',
        paymentMethod: 'Bank Transfer',
        billingAddress: 'Chennai',
        notes: 'Renewal'
      }

    ];

  }

  // ============================================
  // Save / Update
  // ============================================

  save(): void {

    this.submitted = true;

    if (
      !this.billing.companyName ||
      !this.billing.billNumber
    ) {

      this.alert.warning('Please fill mandatory fields.');
      return;

    }

    this.spinner.show();

    setTimeout(() => {

      if (this.isEdit) {

        const index = this.billingList.findIndex(
          x => x.billingId === this.billing.billingId
        );

        if (index > -1) {

          this.billingList[index] = {
            ...this.billing
          };

        }

        this.alert.success('Billing updated successfully.');

      }
      else {

        this.billing.billingId = new Date().getTime();

        this.billingList.unshift({
          ...this.billing
        });

        this.alert.success('Billing created successfully.');

      }

      this.spinner.hide();

      this.clear();

    }, 500);

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

      setTimeout(() => {

        this.billingList =
          this.billingList.filter(x => x.billingId !== id);

        this.spinner.hide();

        this.alert.success('Billing deleted successfully.');

      }, 500);

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

    data.paymentStatus = 'Paid';

    this.alert.success('Payment marked as Paid.');

  }

  // ============================================
  // Refresh
  // ============================================

  refresh(): void {

    this.spinner.show();

    setTimeout(() => {

      this.spinner.hide();

      this.alert.success('Billing data refreshed.');

    }, 500);

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
      !this.statusFilter ||
      x.paymentStatus === this.statusFilter;

    const matchesCompany =
      !this.companyFilter ||
      x.companyName === this.companyFilter;

    const matchesCycle =
      !this.cycleFilter ||
      x.billingCycle === this.cycleFilter;

    const matchesMethod =
      !this.paymentMethodFilter ||
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
    !this.billing.companyName ||
    !this.billing.planName ||
    !this.billing.billNumber
  ) {

    this.alert.warning('Please fill all mandatory fields.');
    return;

  }

  this.spinner.show();

  setTimeout(() => {

    if (this.isEdit) {

      const index = this.billingList.findIndex(
        x => x.billingId === this.billing.billingId
      );

      if (index > -1) {

        this.billingList[index] = {
          ...this.billing
        };

      }

      this.alert.success('Billing updated successfully.');

    }
    else {

      this.billing.billingId = new Date().getTime();

      this.billingList.unshift({
        ...this.billing
      });

      this.alert.success('Billing added successfully.');

    }

    this.spinner.hide();

    this.clear();

  }, 500);

}


}
