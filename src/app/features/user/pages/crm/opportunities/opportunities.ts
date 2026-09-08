import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
interface Opportunity {
  opportunityId: number;
  opportunityName: string;
  opportunityNumber: string;

  accountId: number;
  account: string;

  contactId: number;
  contact: string;

  leadId: number;
  lead: string;

  owner: string;

  stage: string;
  probability: number;

  amount: number;
  expectedRevenue: number;

  closeDate: string;
  followUpDate: string;

  leadSource: string;
  priority: string;

  status: string;

  description: string;

  isActive: boolean;

  createdDate: string;
}

interface OpportunityForm {
  opportunityName: string;
  opportunityNumber: string;

  accountId: number;
  account: string;

  contactId: number;
  contact: string;

  leadId: number;
  lead: string;

  owner: string;

  stage: string;
  probability: number;

  amount: number;
  expectedRevenue: number;

  closeDate: string;
  followUpDate: string;

  leadSource: string;
  priority: string;

  status: string;

  description: string;

  isActive: boolean;
}
@Component({
  selector: 'app-opportunities',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './opportunities.html',
  styleUrl: './opportunities.css',
})
export class Opportunities {
   // ============================================================
  // FORM
  // ============================================================

  opportunityForm: OpportunityForm = this.createEmptyForm();

  submitted = false;
  isEdit = false;

  editingOpportunityId = 0;

  // ============================================================
  // SEARCH / FILTER
  // ============================================================

  searchText = '';

  selectedStage = 'All';
  selectedStatus = 'All';
  selectedOwner = 'All';
  selectedPriority = 'All';

  // ============================================================
  // PAGINATION
  // ============================================================

  page = 1;
  pageSize = 10;

  // ============================================================
  // OPPORTUNITY DATA
  // ============================================================

  opportunities: Opportunity[] = [
    {
      opportunityId: 1,
      opportunityName: 'ERP Implementation',
      opportunityNumber: 'OPP-0001',

      accountId: 1,
      account: 'ABC Technologies',

      contactId: 1,
      contact: 'Rahul Sharma',

      leadId: 1,
      lead: 'Rahul Sharma',

      owner: 'Arun Kumar',

      stage: 'Proposal',
      probability: 70,

      amount: 1250000,
      expectedRevenue: 875000,

      closeDate: '2026-09-15',
      followUpDate: '2026-08-25',

      leadSource: 'Website',
      priority: 'High',

      status: 'Open',

      description: 'ERP implementation opportunity for enterprise customer.',

      isActive: true,

      createdDate: '2026-08-10'
    },

    {
      opportunityId: 2,
      opportunityName: 'CRM Subscription',
      opportunityNumber: 'OPP-0002',

      accountId: 2,
      account: 'XYZ Solutions',

      contactId: 2,
      contact: 'Priya Reddy',

      leadId: 2,
      lead: 'Priya Reddy',

      owner: 'Suresh Kumar',

      stage: 'Negotiation',
      probability: 85,

      amount: 750000,
      expectedRevenue: 637500,

      closeDate: '2026-09-05',
      followUpDate: '2026-08-23',

      leadSource: 'Referral',
      priority: 'High',

      status: 'Open',

      description: 'CRM SaaS annual subscription opportunity.',

      isActive: true,

      createdDate: '2026-08-11'
    },

    {
      opportunityId: 3,
      opportunityName: 'HRMS Implementation',
      opportunityNumber: 'OPP-0003',

      accountId: 3,
      account: 'Future Vision',

      contactId: 3,
      contact: 'Arjun Kumar',

      leadId: 3,
      lead: 'Arjun Kumar',

      owner: 'Arun Kumar',

      stage: 'Qualification',
      probability: 40,

      amount: 950000,
      expectedRevenue: 380000,

      closeDate: '2026-10-10',
      followUpDate: '2026-08-27',

      leadSource: 'LinkedIn',
      priority: 'Medium',

      status: 'Open',

      description: 'HRMS implementation and customization.',

      isActive: true,

      createdDate: '2026-08-12'
    },

    {
      opportunityId: 4,
      opportunityName: 'Mobile Application',
      opportunityNumber: 'OPP-0004',

      accountId: 4,
      account: 'Global InfoTech',

      contactId: 4,
      contact: 'Sneha Patel',

      leadId: 4,
      lead: 'Sneha Patel',

      owner: 'Mahesh Rao',

      stage: 'Closed Won',
      probability: 100,

      amount: 500000,
      expectedRevenue: 500000,

      closeDate: '2026-08-15',
      followUpDate: '',

      leadSource: 'Referral',
      priority: 'Medium',

      status: 'Won',

      description: 'Mobile application development project.',

      isActive: true,

      createdDate: '2026-07-20'
    },

    {
      opportunityId: 5,
      opportunityName: 'Website Development',
      opportunityNumber: 'OPP-0005',

      accountId: 5,
      account: 'NextGen Pvt Ltd',

      contactId: 5,
      contact: 'Kiran Verma',

      leadId: 5,
      lead: 'Kiran Verma',

      owner: 'Suresh Kumar',

      stage: 'Closed Lost',
      probability: 0,

      amount: 300000,
      expectedRevenue: 0,

      closeDate: '2026-08-12',
      followUpDate: '',

      leadSource: 'Website',
      priority: 'Low',

      status: 'Lost',

      description: 'Website development opportunity lost to competitor.',

      isActive: true,

      createdDate: '2026-07-15'
    }
  ];

  // ============================================================
  // MASTER DATA
  // ============================================================

  accounts: string[] = [
    'ABC Technologies',
    'XYZ Solutions',
    'Future Vision',
    'Global InfoTech',
    'NextGen Pvt Ltd'
  ];

  contacts: string[] = [
    'Rahul Sharma',
    'Priya Reddy',
    'Arjun Kumar',
    'Sneha Patel',
    'Kiran Verma'
  ];

  leads: string[] = [
    'Rahul Sharma',
    'Priya Reddy',
    'Arjun Kumar',
    'Sneha Patel',
    'Kiran Verma'
  ];

  owners: string[] = [
    'All',
    'Arun Kumar',
    'Suresh Kumar',
    'Mahesh Rao'
  ];

  stages: string[] = [
    'Prospecting',
    'Qualification',
    'Needs Analysis',
    'Proposal',
    'Negotiation',
    'Closed Won',
    'Closed Lost'
  ];

  sources: string[] = [
    'Website',
    'Referral',
    'LinkedIn',
    'Facebook',
    'Google',
    'Email Campaign',
    'Cold Call',
    'Partner'
  ];

  priorities: string[] = [
    'All',
    'High',
    'Medium',
    'Low'
  ];

  statuses: string[] = [
    'All',
    'Open',
    'Won',
    'Lost'
  ];

  // ============================================================
  // UI
  // ============================================================

  showForm = false;

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor() {}

  // ============================================================
  // EMPTY FORM
  // ============================================================

  createEmptyForm(): OpportunityForm {

    return {
      opportunityName: '',
      opportunityNumber: '',

      accountId: 0,
      account: '',

      contactId: 0,
      contact: '',

      leadId: 0,
      lead: '',

      owner: 'Arun Kumar',

      stage: 'Prospecting',
      probability: 10,

      amount: 0,
      expectedRevenue: 0,

      closeDate: '',
      followUpDate: '',

      leadSource: 'Website',
      priority: 'Medium',

      status: 'Open',

      description: '',

      isActive: true
    };
  }

  // ============================================================
  // FILTERED OPPORTUNITIES
  // ============================================================

  get filteredOpportunities(): Opportunity[] {

    const search = this.searchText
      .trim()
      .toLowerCase();

    return this.opportunities.filter(item => {

      const matchesSearch =
        !search ||
        item.opportunityName.toLowerCase().includes(search) ||
        item.opportunityNumber.toLowerCase().includes(search) ||
        item.account.toLowerCase().includes(search) ||
        item.contact.toLowerCase().includes(search) ||
        item.lead.toLowerCase().includes(search);

      const matchesStage =
        this.selectedStage === 'All' ||
        item.stage === this.selectedStage;

      const matchesStatus =
        this.selectedStatus === 'All' ||
        item.status === this.selectedStatus;

      const matchesOwner =
        this.selectedOwner === 'All' ||
        item.owner === this.selectedOwner;

      const matchesPriority =
        this.selectedPriority === 'All' ||
        item.priority === this.selectedPriority;

      return (
        matchesSearch &&
        matchesStage &&
        matchesStatus &&
        matchesOwner &&
        matchesPriority
      );
    });
  }

  // ============================================================
  // PAGED DATA
  // ============================================================

  get pagedOpportunities(): Opportunity[] {

    const start =
      (this.page - 1) * this.pageSize;

    return this.filteredOpportunities.slice(
      start,
      start + this.pageSize
    );
  }

  // ============================================================
  // SUMMARY
  // ============================================================

  get openOpportunityCount(): number {

    return this.opportunities.filter(
      x => x.status === 'Open'
    ).length;
  }

  get pipelineTotal(): number {

    return this.opportunities
      .filter(x => x.status === 'Open')
      .reduce(
        (total, item) => total + Number(item.amount || 0),
        0
      );
  }

  get weightedPipeline(): number {

    return this.opportunities
      .filter(x => x.status === 'Open')
      .reduce(
        (total, item) =>
          total +
          Number(item.amount || 0) *
          Number(item.probability || 0) /
          100,
        0
      );
  }

  get wonTotal(): number {

    return this.opportunities
      .filter(x => x.status === 'Won')
      .reduce(
        (total, item) => total + Number(item.amount || 0),
        0
      );
  }

  get lostTotal(): number {

    return this.opportunities
      .filter(x => x.status === 'Lost')
      .reduce(
        (total, item) => total + Number(item.amount || 0),
        0
      );
  }

  get wonOpportunityCount(): number {

    return this.opportunities.filter(
      x => x.status === 'Won'
    ).length;
  }

  get lostOpportunityCount(): number {

    return this.opportunities.filter(
      x => x.status === 'Lost'
    ).length;
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

  // ============================================================
  // FORM
  // ============================================================

  openCreateOpportunity(): void {

    this.isEdit = false;
    this.submitted = false;
    this.editingOpportunityId = 0;

    this.opportunityForm =
      this.createEmptyForm();

    this.opportunityForm.opportunityNumber =
      this.generateOpportunityNumber();

    this.showForm = true;
  }

  closeForm(): void {

    this.showForm = false;
    this.submitted = false;
  }

  // ============================================================
  // SAVE
  // ============================================================

  saveOpportunity(): void {

    this.submitted = true;

    if (
      !this.opportunityForm.opportunityName.trim() ||
      !this.opportunityForm.account ||
      !this.opportunityForm.contact ||
      !this.opportunityForm.stage ||
      !this.opportunityForm.amount ||
      !this.opportunityForm.closeDate
    ) {
      return;
    }

    this.calculateExpectedRevenue();

    if (this.isEdit) {

      const index =
        this.opportunities.findIndex(
          x => x.opportunityId === this.editingOpportunityId
        );

      if (index >= 0) {

        this.opportunities[index] = {
          ...this.opportunities[index],
          ...this.opportunityForm
        };
      }

    } else {

      const newId =
        this.opportunities.length > 0
          ? Math.max(
              ...this.opportunities.map(
                x => x.opportunityId
              )
            ) + 1
          : 1;

      this.opportunities.unshift({

        opportunityId: newId,

        ...this.opportunityForm,

        createdDate:
          new Date()
            .toISOString()
            .substring(0, 10)
      });
    }

    this.closeForm();
    this.resetPagination();
  }

  // ============================================================
  // EDIT
  // ============================================================

  editOpportunity(item: Opportunity): void {

    this.isEdit = true;

    this.editingOpportunityId =
      item.opportunityId;

    this.opportunityForm = {
      opportunityName: item.opportunityName,
      opportunityNumber: item.opportunityNumber,

      accountId: item.accountId,
      account: item.account,

      contactId: item.contactId,
      contact: item.contact,

      leadId: item.leadId,
      lead: item.lead,

      owner: item.owner,

      stage: item.stage,
      probability: item.probability,

      amount: item.amount,
      expectedRevenue: item.expectedRevenue,

      closeDate: item.closeDate,
      followUpDate: item.followUpDate,

      leadSource: item.leadSource,
      priority: item.priority,

      status: item.status,

      description: item.description,

      isActive: item.isActive
    };

    this.submitted = false;
    this.showForm = true;
  }

  // ============================================================
  // DELETE
  // ============================================================

  deleteOpportunity(id: number): void {

    const confirmed =
      window.confirm(
        'Are you sure you want to delete this opportunity?'
      );

    if (!confirmed) {
      return;
    }

    this.opportunities =
      this.opportunities.filter(
        x => x.opportunityId !== id
      );

    this.resetPagination();
  }

  // ============================================================
  // CLEAR
  // ============================================================

  clear(): void {

    this.opportunityForm =
      this.createEmptyForm();

    this.opportunityForm.opportunityNumber =
      this.generateOpportunityNumber();

    this.submitted = false;

    this.isEdit = false;

    this.editingOpportunityId = 0;
  }

  // ============================================================
  // CALCULATE EXPECTED REVENUE
  // ============================================================

  calculateExpectedRevenue(): void {

    const amount =
      Number(this.opportunityForm.amount || 0);

    const probability =
      Number(this.opportunityForm.probability || 0);

    this.opportunityForm.expectedRevenue =
      Math.round(
        amount * probability / 100
      );
  }

  // ============================================================
  // STAGE PROBABILITY
  // ============================================================

  stageChanged(): void {

    switch (this.opportunityForm.stage) {

      case 'Prospecting':
        this.opportunityForm.probability = 10;
        break;

      case 'Qualification':
        this.opportunityForm.probability = 25;
        break;

      case 'Needs Analysis':
        this.opportunityForm.probability = 40;
        break;

      case 'Proposal':
        this.opportunityForm.probability = 70;
        break;

      case 'Negotiation':
        this.opportunityForm.probability = 85;
        break;

      case 'Closed Won':
        this.opportunityForm.probability = 100;
        this.opportunityForm.status = 'Won';
        break;

      case 'Closed Lost':
        this.opportunityForm.probability = 0;
        this.opportunityForm.status = 'Lost';
        break;
    }

    this.calculateExpectedRevenue();
  }

  // ============================================================
  // FILTER RESET
  // ============================================================

  resetFilters(): void {

    this.searchText = '';

    this.selectedStage = 'All';

    this.selectedStatus = 'All';

    this.selectedOwner = 'All';

    this.selectedPriority = 'All';

    this.resetPagination();
  }

  // ============================================================
  // PAGINATION
  // ============================================================

  changePage(pageNumber: number): void {

    this.page = pageNumber;
  }

  changePageSize(size: number): void {

    this.pageSize = Number(size) || 10;

    this.page = 1;
  }

  resetPagination(): void {

    this.page = 1;
  }

  get totalPages(): number {

    return Math.max(
      1,
      Math.ceil(
        this.filteredOpportunities.length /
        this.pageSize
      )
    );
  }

  // ============================================================
  // PAGE NUMBERS
  // ============================================================

  get pageNumbers(): number[] {

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
  // GENERATE NUMBER
  // ============================================================

  generateOpportunityNumber(): string {

    const nextNumber =
      this.opportunities.length + 1;

    return 'OPP-' +
      String(nextNumber).padStart(4, '0');
  }

  // ============================================================
  // TRACK BY
  // ============================================================

  trackById(
    index: number,
    item: Opportunity
  ): number {

    return item.opportunityId;
  }

}
