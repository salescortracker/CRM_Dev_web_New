import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-quotations',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './quotations.html',
  styleUrl: './quotations.css',
})
export class Quotations {
   submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = '';

  quotations: any[] = [];

  quotation: any = {

    quotationId: 0,
    quotationNumber: '',
    quotationName: '',
    account: '',
    contact: '',
    opportunity: '',
    salesExecutive: '',
    quoteDate: '',
    validUntil: '',
    currency: 'INR',
    paymentTerms: '',
    tax: 0,
    discount: 0,
    totalAmount: 0,
    description: '',
    status: '',
    isActive: true

  };

  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.loadQuotations();

  }

  loadQuotations() {

    this.spinner.show();

    setTimeout(() => {

      this.quotations = [

        {
          quotationId: 1,
          quotationNumber: 'QT1001',
          quotationName: 'CRM Software Proposal',
          account: 'ABC Technologies',
          contact: 'Rahul Sharma',
          opportunity: 'CRM Implementation',
          salesExecutive: 'Karishma',
          quoteDate: '2026-07-29',
          validUntil: '2026-08-15',
          currency: 'INR',
          paymentTerms: 'Net 30 Days',
          tax: 18,
          discount: 5,
          totalAmount: 250000,
          description: 'CRM implementation quotation.',
          status: 'Draft',
          isActive: true
        },

        {
          quotationId: 2,
          quotationNumber: 'QT1002',
          quotationName: 'HRMS Proposal',
          account: 'XYZ Solutions',
          contact: 'Priya Reddy',
          opportunity: 'HRMS Upgrade',
          salesExecutive: 'Rahul',
          quoteDate: '2026-07-28',
          validUntil: '2026-08-12',
          currency: 'INR',
          paymentTerms: 'Advance Payment',
          tax: 18,
          discount: 3,
          totalAmount: 180000,
          description: 'HRMS implementation quotation.',
          status: 'Sent',
          isActive: true
        },

        {
          quotationId: 3,
          quotationNumber: 'QT1003',
          quotationName: 'ERP Integration Proposal',
          account: 'Future Vision',
          contact: 'Arjun Kumar',
          opportunity: 'ERP Integration',
          salesExecutive: 'Sneha',
          quoteDate: '2026-07-26',
          validUntil: '2026-08-10',
          currency: 'INR',
          paymentTerms: 'Net 15 Days',
          tax: 18,
          discount: 10,
          totalAmount: 420000,
          description: 'ERP integration quotation.',
          status: 'Approved',
          isActive: true
        },

        {
          quotationId: 4,
          quotationNumber: 'QT1004',
          quotationName: 'Cloud Migration Proposal',
          account: 'Global InfoTech',
          contact: 'Sneha Patel',
          opportunity: 'Cloud Migration',
          salesExecutive: 'Arun',
          quoteDate: '2026-07-25',
          validUntil: '2026-08-08',
          currency: 'INR',
          paymentTerms: 'Net 45 Days',
          tax: 18,
          discount: 2,
          totalAmount: 520000,
          description: 'Cloud migration quotation.',
          status: 'Rejected',
          isActive: true
        },

        {
          quotationId: 5,
          quotationNumber: 'QT1005',
          quotationName: 'Digital Marketing Package',
          account: 'NextGen Pvt Ltd',
          contact: 'Kiran Verma',
          opportunity: 'Digital Marketing Package',
          salesExecutive: 'Durga',
          quoteDate: '2026-07-24',
          validUntil: '2026-08-05',
          currency: 'INR',
          paymentTerms: 'Advance Payment',
          tax: 18,
          discount: 8,
          totalAmount: 95000,
          description: 'Digital marketing quotation.',
          status: 'Expired',
          isActive: true
        }

      ];

      this.quotations.sort(
        (a, b) => b.quotationId - a.quotationId
      );

      this.totalRecords = this.quotations.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }

  saveQuotation() {

    this.submitted = true;

    if (
      !this.quotation.quotationNumber ||
      !this.quotation.quotationName ||
      !this.quotation.account ||
      !this.quotation.contact ||
      !this.quotation.opportunity ||
      !this.quotation.quoteDate ||
      !this.quotation.validUntil ||
      !this.quotation.status
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newQuotation = {

          ...this.quotation,

          quotationId: this.quotations.length
            ? Math.max(...this.quotations.map(x => x.quotationId)) + 1
            : 1

        };

        this.quotations.unshift(newQuotation);

      } else {

        const index = this.quotations.findIndex(
          x => x.quotationId === this.quotation.quotationId
        );

        if (index !== -1) {

          this.quotations[index] = {

            ...this.quotation

          };

        }

      }

      this.quotations = [...this.quotations];

      this.totalRecords = this.quotations.length;

      this.page = 1;

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(
        this.isEdit
          ? 'Quotation updated successfully.'
          : 'Quotation created successfully.'
      );

    }, 500);

  }
    edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.quotations.find(
        x => x.quotationId === id
      );

      if (selected) {

        this.quotation = {
          ...selected
        };

        this.isEdit = true;

        this.submitted = false;

        this.cd.detectChanges();

      }

      this.spinner.hide();

    }, 300);

  }

  delete(id: number) {

    this.alert.deleteConfirm().then(result => {

      if (result.isConfirmed) {

        this.spinner.show();

        setTimeout(() => {

          this.quotations = this.quotations.filter(
            x => x.quotationId !== id
          );

          this.totalRecords = this.quotations.length;

          if (
            this.page > 1 &&
            this.pagedQuotations.length === 0
          ) {

            this.page--;

          }

          this.quotations = [...this.quotations];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Quotation deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.quotation = {

      quotationId: 0,
      quotationNumber: '',
      quotationName: '',
      account: '',
      contact: '',
      opportunity: '',
      salesExecutive: '',
      quoteDate: '',
      validUntil: '',
      currency: 'INR',
      paymentTerms: '',
      tax: 0,
      discount: 0,
      totalAmount: 0,
      description: '',
      status: '',
      isActive: true

    };

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredQuotations() {

    return this.quotations.filter(x =>

      x.quotationNumber
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.quotationName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.account
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.contact
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.opportunity
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.salesExecutive
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.status
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

    );

  }

  get pagedQuotations() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredQuotations.slice(
      start,
      start + this.pageSize
    );

  }

  changePage(page: number) {

    this.page = page;

  }

  changePageSize(size: number) {

    this.pageSize = size;

    this.page = 1;

  }


}
