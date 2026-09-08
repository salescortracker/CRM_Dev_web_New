import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './payments.html',
  styleUrl: './payments.css',
})
export class Payments {
   submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = '';

  payments: any[] = [];

  payment: any = {

    paymentId: 0,
    paymentNumber: '',
    paymentReference: '',
    invoice: '',
    account: '',
    contact: '',
    paymentDate: '',
    paymentMethod: '',
    transactionId: '',
    amount: 0,
    taxDeducted: 0,
    paymentStatus: '',
    receivedBy: '',
    notes: '',
    isActive: true

  };

  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.loadPayments();

  }

  loadPayments() {

    this.spinner.show();

    setTimeout(() => {

      this.payments = [

        {
          paymentId: 1,
          paymentNumber: 'PAY1001',
          paymentReference: 'TXN458921',
          invoice: 'INV1001 - CRM Software Invoice',
          account: 'ABC Technologies',
          contact: 'Rahul Sharma',
          paymentDate: '2026-07-29',
          paymentMethod: 'Bank Transfer',
          transactionId: 'BT2026001',
          amount: 250000,
          taxDeducted: 45000,
          paymentStatus: 'Successful',
          receivedBy: 'Karishma',
          notes: 'Full payment received successfully.',
          isActive: true
        },

        {
          paymentId: 2,
          paymentNumber: 'PAY1002',
          paymentReference: 'TXN458922',
          invoice: 'INV1002 - HRMS Invoice',
          account: 'XYZ Solutions',
          contact: 'Priya Reddy',
          paymentDate: '2026-07-28',
          paymentMethod: 'UPI',
          transactionId: 'UPI568745',
          amount: 180000,
          taxDeducted: 32400,
          paymentStatus: 'Successful',
          receivedBy: 'Rahul',
          notes: 'Received through UPI.',
          isActive: true
        },

        {
          paymentId: 3,
          paymentNumber: 'PAY1003',
          paymentReference: 'TXN458923',
          invoice: 'INV1003 - ERP Integration Invoice',
          account: 'Future Vision',
          contact: 'Arjun Kumar',
          paymentDate: '2026-07-27',
          paymentMethod: 'Cheque',
          transactionId: 'CHQ900456',
          amount: 170000,
          taxDeducted: 30600,
          paymentStatus: 'Pending',
          receivedBy: 'Sneha',
          notes: 'Cheque under clearance.',
          isActive: true
        },

        {
          paymentId: 4,
          paymentNumber: 'PAY1004',
          paymentReference: 'TXN458924',
          invoice: 'INV1004 - Cloud Migration Invoice',
          account: 'Global InfoTech',
          contact: 'Sneha Patel',
          paymentDate: '2026-07-26',
          paymentMethod: 'Credit Card',
          transactionId: 'CC879654',
          amount: 520000,
          taxDeducted: 93600,
          paymentStatus: 'Successful',
          receivedBy: 'Arun',
          notes: 'Paid using corporate credit card.',
          isActive: true
        },

        {
          paymentId: 5,
          paymentNumber: 'PAY1005',
          paymentReference: 'TXN458925',
          invoice: 'INV1005 - Digital Marketing Invoice',
          account: 'NextGen Pvt Ltd',
          contact: 'Kiran Verma',
          paymentDate: '2026-07-25',
          paymentMethod: 'Bank Transfer',
          transactionId: 'BT2026005',
          amount: 95000,
          taxDeducted: 17100,
          paymentStatus: 'Failed',
          receivedBy: 'Durga',
          notes: 'Bank transaction failed.',
          isActive: true
        }

      ];

      this.payments.sort(
        (a, b) => b.paymentId - a.paymentId
      );

      this.totalRecords = this.payments.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }

  savePayment() {

    this.submitted = true;

    if (
      !this.payment.paymentNumber ||
      !this.payment.paymentReference ||
      !this.payment.invoice ||
      !this.payment.account ||
      !this.payment.contact ||
      !this.payment.paymentDate ||
      !this.payment.paymentMethod ||
      !this.payment.amount ||
      !this.payment.paymentStatus
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newPayment = {

          ...this.payment,

          paymentId: this.payments.length
            ? Math.max(...this.payments.map(x => x.paymentId)) + 1
            : 1

        };

        this.payments.unshift(newPayment);

      } else {

        const index = this.payments.findIndex(
          x => x.paymentId === this.payment.paymentId
        );

        if (index !== -1) {

          this.payments[index] = {

            ...this.payment

          };

        }

      }

      this.payments = [...this.payments];

      this.totalRecords = this.payments.length;

      this.page = 1;

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(
        this.isEdit
          ? 'Payment updated successfully.'
          : 'Payment created successfully.'
      );

    }, 500);

  }
    edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.payments.find(
        x => x.paymentId === id
      );

      if (selected) {

        this.payment = {
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

          this.payments = this.payments.filter(
            x => x.paymentId !== id
          );

          this.totalRecords = this.payments.length;

          if (
            this.page > 1 &&
            this.pagedPayments.length === 0
          ) {

            this.page--;

          }

          this.payments = [...this.payments];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Payment deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.payment = {

      paymentId: 0,
      paymentNumber: '',
      paymentReference: '',
      invoice: '',
      account: '',
      contact: '',
      paymentDate: '',
      paymentMethod: '',
      transactionId: '',
      amount: 0,
      taxDeducted: 0,
      paymentStatus: '',
      receivedBy: '',
      notes: '',
      isActive: true

    };

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredPayments() {

    return this.payments.filter(x =>

      x.paymentNumber
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.paymentReference
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.invoice
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

      x.paymentMethod
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.paymentStatus
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

    );

  }

  get pagedPayments() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredPayments.slice(
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
