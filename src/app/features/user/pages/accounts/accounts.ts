import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../shared/pagination/pagination';

interface Account {
  accountId: number;
  accountName: string;
  accountNumber: string;
  accountType: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  owner: string;
  employees: number;
  revenue: number;
  rating: string;
  status: string;
  isActive: boolean;

  billingAddress: string;
  shippingAddress: string;

  city: string;
  state: string;
  country: string;

  totalOpportunity: number;
  openOpportunity: number;
  wonOpportunity: number;

  quotationValue: number;
  orderValue: number;
  invoiceValue: number;
  paidValue: number;
  outstandingValue: number;

  costValue: number;
  grossProfit: number;
  grossMargin: number;

  contactCount: number;
  opportunityCount: number;
  quotationCount: number;
  orderCount: number;
  invoiceCount: number;

  lastActivity: string;
  createdDate: string;
}

interface AccountForm {
  accountName: string;
  accountNumber: string;
  accountType: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  owner: string;
  employees: number;
  revenue: number;
  rating: string;
  status: string;

  billingAddress: string;
  shippingAddress: string;

  city: string;
  state: string;
  country: string;

  isActive: boolean;
}


@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class Accounts {
   // ============================================================
  // FORM
  // ============================================================

  account: AccountForm = this.createEmptyForm();

  submitted = false;
  isEdit = false;

  searchText = '';

  // ============================================================
  // FILTERS
  // ============================================================

  selectedType = 'All';
  selectedIndustry = 'All';
  selectedOwner = 'All';
  selectedStatus = 'All';

  accountTypes: string[] = [
    'All',
    'Customer',
    'Partner',
    'Vendor',
    'Prospect'
  ];

  industries: string[] = [
    'All',
    'IT Services',
    'Manufacturing',
    'Finance',
    'Healthcare',
    'Retail',
    'Real Estate',
    'Education'
  ];

  owners: string[] = [
    'All',
    'Admin',
    'John Smith',
    'Sarah Wilson',
    'David Kumar'
  ];

  statuses: string[] = [
    'All',
    'Active',
    'Inactive'
  ];

  // ============================================================
  // VIEW
  // ============================================================

  activeTab:
    | 'overview'
    | 'accounts'
    | 'profit-loss'
    | 'opportunities'
    | 'invoices'
    | 'payments'
    | 'activities' = 'overview';

  showAccountDrawer = false;
  selectedAccount: Account | null = null;

  showAccountForm = false;

  // ============================================================
  // PAGINATION
  // ============================================================

  page = 1;
  pageSize = 10;

  // ============================================================
  // SAMPLE ACCOUNTS
  // ============================================================

  accounts: Account[] = [

    {
      accountId: 1,
      accountName: 'ABC Technologies Pvt Ltd',
      accountNumber: 'ACC-0001',
      accountType: 'Customer',
      industry: 'IT Services',
      website: 'https://abctech.com',
      email: 'info@abctech.com',
      phone: '9876543210',
      owner: 'John Smith',
      employees: 250,
      revenue: 25000000,
      rating: 'Hot',
      status: 'Active',
      isActive: true,

      billingAddress: 'Hitech City',
      shippingAddress: 'Hitech City',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',

      totalOpportunity: 2500000,
      openOpportunity: 1200000,
      wonOpportunity: 1300000,

      quotationValue: 1800000,
      orderValue: 1500000,
      invoiceValue: 1400000,
      paidValue: 1100000,
      outstandingValue: 300000,

      costValue: 800000,
      grossProfit: 600000,
      grossMargin: 42.86,

      contactCount: 8,
      opportunityCount: 6,
      quotationCount: 5,
      orderCount: 4,
      invoiceCount: 7,

      lastActivity: '2026-08-20',
      createdDate: '2026-01-10'
    },

    {
      accountId: 2,
      accountName: 'Global Manufacturing Ltd',
      accountNumber: 'ACC-0002',
      accountType: 'Customer',
      industry: 'Manufacturing',
      website: 'https://globalmfg.com',
      email: 'contact@globalmfg.com',
      phone: '9988776655',
      owner: 'Sarah Wilson',
      employees: 800,
      revenue: 75000000,
      rating: 'Hot',
      status: 'Active',
      isActive: true,

      billingAddress: 'Industrial Area',
      shippingAddress: 'Industrial Area',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',

      totalOpportunity: 5000000,
      openOpportunity: 2800000,
      wonOpportunity: 2200000,

      quotationValue: 3500000,
      orderValue: 2800000,
      invoiceValue: 2500000,
      paidValue: 1900000,
      outstandingValue: 600000,

      costValue: 1400000,
      grossProfit: 1100000,
      grossMargin: 44,

      contactCount: 12,
      opportunityCount: 9,
      quotationCount: 8,
      orderCount: 6,
      invoiceCount: 10,

      lastActivity: '2026-08-19',
      createdDate: '2026-02-15'
    },

    {
      accountId: 3,
      accountName: 'Prime Healthcare',
      accountNumber: 'ACC-0003',
      accountType: 'Customer',
      industry: 'Healthcare',
      website: 'https://primehealth.com',
      email: 'admin@primehealth.com',
      phone: '9123456780',
      owner: 'David Kumar',
      employees: 500,
      revenue: 45000000,
      rating: 'Warm',
      status: 'Active',
      isActive: true,

      billingAddress: 'Banjara Hills',
      shippingAddress: 'Banjara Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',

      totalOpportunity: 3200000,
      openOpportunity: 1700000,
      wonOpportunity: 1500000,

      quotationValue: 2200000,
      orderValue: 1900000,
      invoiceValue: 1700000,
      paidValue: 1500000,
      outstandingValue: 200000,

      costValue: 900000,
      grossProfit: 800000,
      grossMargin: 47.06,

      contactCount: 6,
      opportunityCount: 5,
      quotationCount: 4,
      orderCount: 3,
      invoiceCount: 5,

      lastActivity: '2026-08-18',
      createdDate: '2026-03-05'
    },

    {
      accountId: 4,
      accountName: 'Retail Mart India',
      accountNumber: 'ACC-0004',
      accountType: 'Prospect',
      industry: 'Retail',
      website: '',
      email: 'admin@retailmart.com',
      phone: '9000011111',
      owner: 'John Smith',
      employees: 120,
      revenue: 18000000,
      rating: 'Warm',
      status: 'Active',
      isActive: true,

      billingAddress: 'Kukatpally',
      shippingAddress: 'Kukatpally',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',

      totalOpportunity: 1800000,
      openOpportunity: 1800000,
      wonOpportunity: 0,

      quotationValue: 700000,
      orderValue: 0,
      invoiceValue: 0,
      paidValue: 0,
      outstandingValue: 0,

      costValue: 0,
      grossProfit: 0,
      grossMargin: 0,

      contactCount: 4,
      opportunityCount: 3,
      quotationCount: 2,
      orderCount: 0,
      invoiceCount: 0,

      lastActivity: '2026-08-17',
      createdDate: '2026-04-10'
    },

    {
      accountId: 5,
      accountName: 'EduSmart Solutions',
      accountNumber: 'ACC-0005',
      accountType: 'Customer',
      industry: 'Education',
      website: '',
      email: 'info@edusmart.com',
      phone: '9555555555',
      owner: 'Sarah Wilson',
      employees: 90,
      revenue: 12000000,
      rating: 'Cold',
      status: 'Inactive',
      isActive: false,

      billingAddress: 'Madhapur',
      shippingAddress: 'Madhapur',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',

      totalOpportunity: 500000,
      openOpportunity: 0,
      wonOpportunity: 500000,

      quotationValue: 600000,
      orderValue: 500000,
      invoiceValue: 500000,
      paidValue: 500000,
      outstandingValue: 0,

      costValue: 250000,
      grossProfit: 250000,
      grossMargin: 50,

      contactCount: 3,
      opportunityCount: 2,
      quotationCount: 2,
      orderCount: 1,
      invoiceCount: 2,

      lastActivity: '2026-07-30',
      createdDate: '2026-05-01'
    }
  ];

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor() {
    // Intentionally empty.
  }

  // ============================================================
  // FORM
  // ============================================================

  createEmptyForm(): AccountForm {

    return {
      accountName: '',
      accountNumber: '',
      accountType: 'Customer',
      industry: '',
      website: '',
      email: '',
      phone: '',
      owner: 'Admin',
      employees: 0,
      revenue: 0,
      rating: 'Warm',
      status: 'Active',

      billingAddress: '',
      shippingAddress: '',

      city: '',
      state: '',
      country: 'India',

      isActive: true
    };
  }

  // ============================================================
  // FILTERED ACCOUNTS
  // ============================================================

  get filteredAccounts(): Account[] {

    const search = this.searchText
      .trim()
      .toLowerCase();

    return this.accounts.filter(account => {

      const matchesSearch =
        !search ||
        account.accountName.toLowerCase().includes(search) ||
        account.accountNumber.toLowerCase().includes(search) ||
        account.industry.toLowerCase().includes(search) ||
        account.email.toLowerCase().includes(search) ||
        account.phone.includes(search);

      const matchesType =
        this.selectedType === 'All' ||
        account.accountType === this.selectedType;

      const matchesIndustry =
        this.selectedIndustry === 'All' ||
        account.industry === this.selectedIndustry;

      const matchesOwner =
        this.selectedOwner === 'All' ||
        account.owner === this.selectedOwner;

      const matchesStatus =
        this.selectedStatus === 'All' ||
        account.status === this.selectedStatus;

      return (
        matchesSearch &&
        matchesType &&
        matchesIndustry &&
        matchesOwner &&
        matchesStatus
      );
    });
  }

  // ============================================================
  // PAGED ACCOUNTS
  // ============================================================

  get pagedAccounts(): Account[] {

    const start =
      (this.page - 1) * this.pageSize;

    return this.filteredAccounts.slice(
      start,
      start + this.pageSize
    );
  }

  // ============================================================
  // FINANCIAL SUMMARY
  // ============================================================

  get totalAccounts(): number {
    return this.accounts.length;
  }

  get activeAccounts(): number {
    return this.accounts.filter(
      x => x.isActive
    ).length;
  }

  get customerCount(): number {
    return this.accounts.filter(
      x => x.accountType === 'Customer'
    ).length;
  }

  get prospectCount(): number {
    return this.accounts.filter(
      x => x.accountType === 'Prospect'
    ).length;
  }

  get totalRevenue(): number {
    return this.accounts.reduce(
      (sum, x) => sum + x.invoiceValue,
      0
    );
  }

  get totalPaid(): number {
    return this.accounts.reduce(
      (sum, x) => sum + x.paidValue,
      0
    );
  }

  get totalOutstanding(): number {
    return this.accounts.reduce(
      (sum, x) => sum + x.outstandingValue,
      0
    );
  }

  get totalCost(): number {
    return this.accounts.reduce(
      (sum, x) => sum + x.costValue,
      0
    );
  }

  get totalGrossProfit(): number {
    return this.accounts.reduce(
      (sum, x) => sum + x.grossProfit,
      0
    );
  }

  get overallGrossMargin(): number {

    if (this.totalRevenue === 0) {
      return 0;
    }

    return (
      this.totalGrossProfit /
      this.totalRevenue
    ) * 100;
  }

  get totalOpenPipeline(): number {
    return this.accounts.reduce(
      (sum, x) => sum + x.openOpportunity,
      0
    );
  }

  get totalWonValue(): number {
    return this.accounts.reduce(
      (sum, x) => sum + x.wonOpportunity,
      0
    );
  }

  get totalOpportunityValue(): number {
    return this.accounts.reduce(
      (sum, x) => sum + x.totalOpportunity,
      0
    );
  }

  // ============================================================
  // ACCOUNT ACTIONS
  // ============================================================

  openNewAccount(): void {

    this.isEdit = false;
    this.submitted = false;

    this.account = this.createEmptyForm();

    this.showAccountForm = true;
  }

  editAccount(accountId: number): void {

    const item = this.accounts.find(
      x => x.accountId === accountId
    );

    if (!item) {
      return;
    }

    this.isEdit = true;
    this.submitted = false;

    this.account = {
      accountName: item.accountName,
      accountNumber: item.accountNumber,
      accountType: item.accountType,
      industry: item.industry,
      website: item.website,
      email: item.email,
      phone: item.phone,
      owner: item.owner,
      employees: item.employees,
      revenue: item.revenue,
      rating: item.rating,
      status: item.status,

      billingAddress: item.billingAddress,
      shippingAddress: item.shippingAddress,

      city: item.city,
      state: item.state,
      country: item.country,

      isActive: item.isActive
    };

    this.showAccountForm = true;
  }

  saveAccount(): void {

    this.submitted = true;

    if (
      !this.account.accountName.trim() ||
      !this.account.accountNumber.trim() ||
      !this.account.accountType ||
      !this.account.status
    ) {
      return;
    }

    if (this.isEdit) {

      const existing =
        this.accounts.find(
          x =>
            x.accountNumber ===
            this.account.accountNumber
        );

      if (existing) {

        Object.assign(
          existing,
          this.account
        );
      }

    } else {

      const nextId =
        this.accounts.length > 0
          ? Math.max(
              ...this.accounts.map(
                x => x.accountId
              )
            ) + 1
          : 1;

      const newAccount: Account = {

        accountId: nextId,

        accountName:
          this.account.accountName,

        accountNumber:
          this.account.accountNumber,

        accountType:
          this.account.accountType,

        industry:
          this.account.industry,

        website:
          this.account.website,

        email:
          this.account.email,

        phone:
          this.account.phone,

        owner:
          this.account.owner,

        employees:
          this.account.employees,

        revenue:
          this.account.revenue,

        rating:
          this.account.rating,

        status:
          this.account.status,

        isActive:
          this.account.isActive,

        billingAddress:
          this.account.billingAddress,

        shippingAddress:
          this.account.shippingAddress,

        city:
          this.account.city,

        state:
          this.account.state,

        country:
          this.account.country,

        totalOpportunity: 0,
        openOpportunity: 0,
        wonOpportunity: 0,

        quotationValue: 0,
        orderValue: 0,
        invoiceValue: 0,
        paidValue: 0,
        outstandingValue: 0,

        costValue: 0,
        grossProfit: 0,
        grossMargin: 0,

        contactCount: 0,
        opportunityCount: 0,
        quotationCount: 0,
        orderCount: 0,
        invoiceCount: 0,

        lastActivity:
          this.today(),

        createdDate:
          this.today()
      };

      this.accounts.unshift(
        newAccount
      );
    }

    this.closeAccountForm();
    this.resetPagination();
  }

  deleteAccount(accountId: number): void {

    this.accounts =
      this.accounts.filter(
        x => x.accountId !== accountId
      );

    if (
      this.selectedAccount &&
      this.selectedAccount.accountId === accountId
    ) {
      this.closeAccountDrawer();
    }

    this.resetPagination();
  }

  clearForm(): void {

    this.submitted = false;
    this.isEdit = false;

    this.account =
      this.createEmptyForm();
  }

  closeAccountForm(): void {

    this.showAccountForm = false;

    this.submitted = false;
  }

  // ============================================================
  // ACCOUNT DRAWER
  // ============================================================

  viewAccount(account: Account): void {

    this.selectedAccount = account;

    this.activeTab = 'overview';

    this.showAccountDrawer = true;
  }

  closeAccountDrawer(): void {

    this.showAccountDrawer = false;

    this.selectedAccount = null;
  }

  // ============================================================
  // ACCOUNT TABS
  // ============================================================

  setAccountTab(
    tab:
      | 'overview'
      | 'accounts'
      | 'profit-loss'
      | 'opportunities'
      | 'invoices'
      | 'payments'
      | 'activities'
  ): void {

    this.activeTab = tab;
  }

  // ============================================================
  // PROFIT / LOSS
  // ============================================================

  getAccountRevenue(account: Account): number {
    return account.invoiceValue;
  }

  getAccountCost(account: Account): number {
    return account.costValue;
  }

  getAccountProfit(account: Account): number {
    return account.grossProfit;
  }

  getAccountMargin(account: Account): number {

    if (account.invoiceValue === 0) {
      return 0;
    }

    return (
      account.grossProfit /
      account.invoiceValue
    ) * 100;
  }

  // ============================================================
  // CURRENCY
  // ============================================================

  formatCurrency(value: number): string {

    return new Intl.NumberFormat(
      'en-IN',
      {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }
    ).format(value || 0);
  }

  formatNumber(value: number): string {

    return new Intl.NumberFormat(
      'en-IN'
    ).format(value || 0);
  }

  // ============================================================
  // STATUS / RATING
  // ============================================================

  getStatusClass(status: string): string {

    switch (status) {

      case 'Active':
        return 'status-active';

      case 'Inactive':
        return 'status-inactive';

      default:
        return '';
    }
  }

  getRatingClass(rating: string): string {

    switch (rating) {

      case 'Hot':
        return 'rating-hot';

      case 'Warm':
        return 'rating-warm';

      case 'Cold':
        return 'rating-cold';

      default:
        return '';
    }
  }

  // ============================================================
  // PAGINATION
  // ============================================================

  changePage(page: number): void {

    this.page = page;
  }

  changePageSize(size: number): void {

    this.pageSize = Number(size) || 10;

    this.page = 1;
  }

  get totalPages(): number {

    return Math.max(
      1,
      Math.ceil(
        this.filteredAccounts.length /
        this.pageSize
      )
    );
  }

  get paginationPages(): number[] {

    const pages: number[] = [];

    for (
      let i = 1;
      i <= this.totalPages;
      i++
    ) {
      pages.push(i);
    }

    return pages;
  }

  // ============================================================
  // FILTER RESET
  // ============================================================

  resetFilters(): void {

    this.searchText = '';

    this.selectedType = 'All';

    this.selectedIndustry = 'All';

    this.selectedOwner = 'All';

    this.selectedStatus = 'All';

    this.page = 1;
  }

  resetPagination(): void {

    this.page = 1;
  }

  // ============================================================
  // TRACK BY
  // ============================================================

  trackByAccountId(
    index: number,
    account: Account
  ): number {

    return account.accountId;
  }

  // ============================================================
  // DATE
  // ============================================================

  today(): string {

    return new Date()
      .toISOString()
      .substring(0, 10);
  }

  // ============================================================
  // QUICK ACTIONS
  // ============================================================

  createOpportunity(account: Account): void {

    console.log(
      'Create opportunity for:',
      account.accountName
    );
  }

  createQuotation(account: Account): void {

    console.log(
      'Create quotation for:',
      account.accountName
    );
  }

  createInvoice(account: Account): void {

    console.log(
      'Create invoice for:',
      account.accountName
    );
  }

  recordPayment(account: Account): void {

    console.log(
      'Record payment for:',
      account.accountName
    );
  }

}
