import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-invoice-sales',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './invoice-sales.html',
  styleUrl: './invoice-sales.css',
})
export class InvoiceSales {
   submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = '';

  invoices: any[] = [];

  invoice: any = {

    invoiceId: 0,
    invoiceNumber: '',
    invoiceName: '',
    order: '',
    account: '',
    contact: '',
    invoiceDate: '',
    dueDate: '',
    paymentTerms: '',
    tax: 0,
    discount: 0,
    totalAmount: 0,
    amountPaid: 0,
    balanceAmount: 0,
    paymentStatus: '',
    description: '',
    isActive: true

  };

  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.loadInvoices();

  }

  loadInvoices() {

    this.spinner.show();

    setTimeout(() => {

      this.invoices = [

        {
          invoiceId: 1,
          invoiceNumber: 'INV1001',
          invoiceName: 'CRM Software Invoice',
          order: 'CRM Software Order',
          account: 'ABC Technologies',
          contact: 'Rahul Sharma',
          invoiceDate: '2026-07-29',
          dueDate: '2026-08-15',
          paymentTerms: 'Net 30 Days',
          tax: 18,
          discount: 5,
          totalAmount: 250000,
          amountPaid: 0,
          balanceAmount: 250000,
          paymentStatus: 'Unpaid',
          description: 'CRM Software implementation invoice.',
          isActive: true
        },

        {
          invoiceId: 2,
          invoiceNumber: 'INV1002',
          invoiceName: 'HRMS Invoice',
          order: 'HRMS Implementation',
          account: 'XYZ Solutions',
          contact: 'Priya Reddy',
          invoiceDate: '2026-07-28',
          dueDate: '2026-08-12',
          paymentTerms: 'Advance Payment',
          tax: 18,
          discount: 3,
          totalAmount: 180000,
          amountPaid: 180000,
          balanceAmount: 0,
          paymentStatus: 'Paid',
          description: 'HRMS implementation invoice.',
          isActive: true
        },

        {
          invoiceId: 3,
          invoiceNumber: 'INV1003',
          invoiceName: 'ERP Integration Invoice',
          order: 'ERP Integration',
          account: 'Future Vision',
          contact: 'Arjun Kumar',
          invoiceDate: '2026-07-27',
          dueDate: '2026-08-11',
          paymentTerms: 'Net 15 Days',
          tax: 18,
          discount: 10,
          totalAmount: 420000,
          amountPaid: 250000,
          balanceAmount: 170000,
          paymentStatus: 'Partially Paid',
          description: 'ERP integration invoice.',
          isActive: true
        },

        {
          invoiceId: 4,
          invoiceNumber: 'INV1004',
          invoiceName: 'Cloud Migration Invoice',
          order: 'Cloud Migration',
          account: 'Global InfoTech',
          contact: 'Sneha Patel',
          invoiceDate: '2026-07-25',
          dueDate: '2026-08-09',
          paymentTerms: 'Net 45 Days',
          tax: 18,
          discount: 2,
          totalAmount: 520000,
          amountPaid: 520000,
          balanceAmount: 0,
          paymentStatus: 'Paid',
          description: 'Cloud migration invoice.',
          isActive: true
        },

        {
          invoiceId: 5,
          invoiceNumber: 'INV1005',
          invoiceName: 'Digital Marketing Invoice',
          order: 'Digital Marketing Package',
          account: 'NextGen Pvt Ltd',
          contact: 'Kiran Verma',
          invoiceDate: '2026-07-23',
          dueDate: '2026-08-05',
          paymentTerms: 'Advance Payment',
          tax: 18,
          discount: 8,
          totalAmount: 95000,
          amountPaid: 0,
          balanceAmount: 95000,
          paymentStatus: 'Overdue',
          description: 'Digital marketing invoice.',
          isActive: true
        }

      ];

      this.invoices.sort(
        (a, b) => b.invoiceId - a.invoiceId
      );

      this.totalRecords = this.invoices.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }

  saveInvoice() {

    this.submitted = true;

    if (
      !this.invoice.invoiceNumber ||
      !this.invoice.invoiceName ||
      !this.invoice.order ||
      !this.invoice.account ||
      !this.invoice.contact ||
      !this.invoice.invoiceDate ||
      !this.invoice.dueDate ||
      !this.invoice.paymentStatus
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newInvoice = {

          ...this.invoice,

          invoiceId: this.invoices.length
            ? Math.max(...this.invoices.map(x => x.invoiceId)) + 1
            : 1

        };

        this.invoices.unshift(newInvoice);

      } else {

        const index = this.invoices.findIndex(
          x => x.invoiceId === this.invoice.invoiceId
        );

        if (index !== -1) {

          this.invoices[index] = {

            ...this.invoice

          };

        }

      }

      this.invoices = [...this.invoices];

      this.totalRecords = this.invoices.length;

      this.page = 1;

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(
        this.isEdit
          ? 'Invoice updated successfully.'
          : 'Invoice created successfully.'
      );

    }, 500);

  }
    edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.invoices.find(
        x => x.invoiceId === id
      );

      if (selected) {

        this.invoice = {
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

          this.invoices = this.invoices.filter(
            x => x.invoiceId !== id
          );

          this.totalRecords = this.invoices.length;

          if (
            this.page > 1 &&
            this.pagedInvoices.length === 0
          ) {

            this.page--;

          }

          this.invoices = [...this.invoices];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Invoice deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.invoice = {

      invoiceId: 0,
      invoiceNumber: '',
      invoiceName: '',
      order: '',
      account: '',
      contact: '',
      invoiceDate: '',
      dueDate: '',
      paymentTerms: '',
      tax: 0,
      discount: 0,
      totalAmount: 0,
      amountPaid: 0,
      balanceAmount: 0,
      paymentStatus: '',
      description: '',
      isActive: true

    };

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredInvoices() {

    return this.invoices.filter(x =>

      x.invoiceNumber
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.invoiceName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.order
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

      x.paymentStatus
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

    );

  }

  get pagedInvoices() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredInvoices.slice(
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
