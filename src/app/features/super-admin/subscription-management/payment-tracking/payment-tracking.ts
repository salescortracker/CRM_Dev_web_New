import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';

declare var bootstrap: any;

@Component({
  selector: 'app-payment-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './payment-tracking.html',
  styleUrl: './payment-tracking.css',
})
export class PaymentTracking {
  // Statistics
  totalRevenue = 0;
  refundPayments = 0;

  // Filters
  methodFilter = 'All';
  fromDate = '';
  toDate = '';
  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice
  ) { }

  //==========================================
  // Pagination
  //==========================================

  page = 1;
  pageSize = 10;

  //==========================================
  // Search & Filter
  //==========================================

  searchText = '';
  statusFilter = 'All';
  paymentMethodFilter = 'All';

  //==========================================
  // Collections
  //==========================================

  payments: any[] = [];

  selectedPayment: any = {};

  //==========================================
  // Refund
  //==========================================

  refundAmountValue = 0;
  refundReason = '';

  //==========================================
  // Statistics
  //==========================================

  totalPayments = 0;
  successfulPayments = 0;
  pendingPayments = 0;
  failedPayments = 0;

  todayCollection = 0;
  monthlyCollection = 0;
  pendingAmount = 0;
  refundAmount = 0;

  //==========================================
  // Init
  //==========================================

  ngOnInit(): void {

    this.loadPayments();

    this.calculateStatistics();

  }

  //==========================================
  // Load Static Data
  //==========================================

  loadPayments(): void {

    this.payments = [

      {
        paymentId: 1,
        companyName: 'ABC Technologies',
        plan: 'Professional',
        invoiceNo: 'INV-1001',
        transactionId: 'TXN875421',
        amount: 12000,
        paymentMethod: 'UPI',
        gateway: 'Razorpay',
        status: 'Success',
        paymentDate: '20-Jul-2026',
        nextRenewal: '20-Jul-2027'
      },

      {
        paymentId: 2,
        companyName: 'Sky Solutions',
        plan: 'Enterprise',
        invoiceNo: 'INV-1002',
        transactionId: 'TXN875422',
        amount: 45000,
        paymentMethod: 'Credit Card',
        gateway: 'Stripe',
        status: 'Pending',
        paymentDate: '22-Jul-2026',
        nextRenewal: '22-Jul-2027'
      },

      {
        paymentId: 3,
        companyName: 'NextGen Pvt Ltd',
        plan: 'Starter',
        invoiceNo: 'INV-1003',
        transactionId: 'TXN875423',
        amount: 5000,
        paymentMethod: 'Net Banking',
        gateway: 'PayU',
        status: 'Failed',
        paymentDate: '23-Jul-2026',
        nextRenewal: '-'
      },

      {
        paymentId: 4,
        companyName: 'Global Soft',
        plan: 'Professional',
        invoiceNo: 'INV-1004',
        transactionId: 'TXN875424',
        amount: 18000,
        paymentMethod: 'Debit Card',
        gateway: 'Stripe',
        status: 'Success',
        paymentDate: '24-Jul-2026',
        nextRenewal: '24-Jul-2027'
      },

      {
        paymentId: 5,
        companyName: 'Cloud Vision',
        plan: 'Enterprise',
        invoiceNo: 'INV-1005',
        transactionId: 'TXN875425',
        amount: 60000,
        paymentMethod: 'UPI',
        gateway: 'Razorpay',
        status: 'Success',
        paymentDate: '24-Jul-2026',
        nextRenewal: '24-Jul-2027'
      },

      {
        paymentId: 6,
        companyName: 'Bright Tech',
        plan: 'Starter',
        invoiceNo: 'INV-1006',
        transactionId: 'TXN875426',
        amount: 8000,
        paymentMethod: 'Cash',
        gateway: 'Offline',
        status: 'Pending',
        paymentDate: '25-Jul-2026',
        nextRenewal: '-'
      },

      {
        paymentId: 7,
        companyName: 'Vertex Systems',
        plan: 'Professional',
        invoiceNo: 'INV-1007',
        transactionId: 'TXN875427',
        amount: 22000,
        paymentMethod: 'Credit Card',
        gateway: 'Stripe',
        status: 'Success',
        paymentDate: '25-Jul-2026',
        nextRenewal: '25-Jul-2027'
      },

      {
        paymentId: 8,
        companyName: 'Fusion IT',
        plan: 'Enterprise',
        invoiceNo: 'INV-1008',
        transactionId: 'TXN875428',
        amount: 55000,
        paymentMethod: 'UPI',
        gateway: 'Razorpay',
        status: 'Success',
        paymentDate: '26-Jul-2026',
        nextRenewal: '26-Jul-2027'
      },

      {
        paymentId: 9,
        companyName: 'Code Matrix',
        plan: 'Professional',
        invoiceNo: 'INV-1009',
        transactionId: 'TXN875429',
        amount: 16000,
        paymentMethod: 'Debit Card',
        gateway: 'PayU',
        status: 'Failed',
        paymentDate: '27-Jul-2026',
        nextRenewal: '-'
      },

      {
        paymentId: 10,
        companyName: 'Prime Software',
        plan: 'Starter',
        invoiceNo: 'INV-1010',
        transactionId: 'TXN875430',
        amount: 9000,
        paymentMethod: 'Net Banking',
        gateway: 'PayU',
        status: 'Success',
        paymentDate: '28-Jul-2026',
        nextRenewal: '28-Jul-2027'
      }

    ];

  }
  //==========================================
  // Calculate Statistics
  //==========================================

  calculateStatistics(): void {

    this.totalPayments = this.payments.length;

    this.successfulPayments =
      this.payments.filter(x => x.status === 'Success').length;

    this.pendingPayments =
      this.payments.filter(x => x.status === 'Pending').length;

    this.failedPayments =
      this.payments.filter(x => x.status === 'Failed').length;

    this.todayCollection =
      this.payments
        .filter(x => x.status === 'Success')
        .reduce((sum, item) => sum + item.amount, 0);

    this.totalRevenue =
  this.payments
      .filter(x => x.status === 'Success')
      .reduce((sum, x) => sum + x.amount, 0);

this.monthlyCollection = this.totalRevenue;

this.refundPayments =
  this.payments.filter(x => x.status === 'Refunded').length;

    this.pendingAmount =
      this.payments
        .filter(x => x.status === 'Pending')
        .reduce((sum, item) => sum + item.amount, 0);

    this.refundAmount = 0;

  }

  //==========================================
  // Filtered Records
  //==========================================

  get filteredPayments(): any[] {

    let data = [...this.payments];

    // Search

    if (this.searchText.trim() !== '') {

      const search = this.searchText.toLowerCase();

      data = data.filter(x =>

        x.companyName.toLowerCase().includes(search) ||

        x.invoiceNo.toLowerCase().includes(search) ||

        x.transactionId.toLowerCase().includes(search) ||

        x.plan.toLowerCase().includes(search)

      );

    }

    // Status Filter

    if (this.statusFilter !== 'All') {

      data = data.filter(
        x => x.status === this.statusFilter
      );

    }

    // Payment Method Filter

    if (this.methodFilter  !== 'All') {

      data = data.filter(
        x => x.paymentMethod === this.methodFilter
      );

    }
    if (this.fromDate) {
  data = data.filter(x => x.paymentDate >= this.fromDate);
}

if (this.toDate) {
  data = data.filter(x => x.paymentDate <= this.toDate);
}

    return data;

  }

  //==========================================
  // Pagination
  //==========================================

  get pagedPayments(): any[] {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredPayments.slice(
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

  //==========================================
  // Search
  //==========================================

  clearSearch(): void {

    this.searchText = '';

    this.statusFilter = 'All';

    this.paymentMethodFilter = 'All';

    this.page = 1;

  }

  refresh(): void {

    this.spinner.show();

    setTimeout(() => {

      this.calculateStatistics();

      this.spinner.hide();

      this.alert.success(
        'Payment data refreshed successfully.'
      );

    }, 500);

  }

  //==========================================
  // View Payment
  //==========================================

view(payment: any): void {

  this.selectedPayment = payment;

  const modal = new bootstrap.Modal(
    document.getElementById('paymentDetailsModal')
  );

  modal.show();

}
  //==========================================
  // Refund Payment
  //==========================================

  refund(payment: any): void {

    this.alert.confirm(
      'Refund Payment?',
      `Refund payment for ${payment.companyName}?`
    ).then(result => {

      if (!result.isConfirmed) {
        return;
      }

      this.spinner.show();

      setTimeout(() => {

        payment.status = 'Refunded';

        this.refundAmount += payment.amount;

        this.calculateStatistics();

        this.spinner.hide();

        this.alert.success('Payment refunded successfully.');

      }, 700);

    });

  }

  //==========================================
  // Delete Payment
  //==========================================

  delete(paymentId: number): void {

    this.alert.deleteConfirm().then(result => {

      if (!result.isConfirmed) {
        return;
      }

      this.spinner.show();

      setTimeout(() => {

        this.payments = this.payments.filter(
          x => x.paymentId !== paymentId
        );

        this.calculateStatistics();

        this.spinner.hide();

        this.alert.success('Payment deleted successfully.');

      }, 600);

    });

  }

  //==========================================
  // Print Receipt
  //==========================================

  printReceipt(payment: any): void {

    this.alert.info(
      `Receipt generated for Invoice ${payment.invoiceNo}.`
    );

  }

  //==========================================
  // Download Invoice
  //==========================================

  downloadInvoice(payment: any): void {

    this.alert.info(
      `Invoice ${payment.invoiceNo} downloaded successfully.`
    );

  }

  //==========================================
  // Export
  //==========================================

  exportPayments(): void {

    this.alert.info(
      'Export functionality will be connected with Excel/PDF API.'
    );

  }

  //==========================================
  // Send Payment Reminder
  //==========================================

  sendReminder(payment: any): void {

    this.alert.success(
      `Payment reminder sent to ${payment.companyName}.`
    );

  }

  //==========================================
  // Retry Failed Payment
  //==========================================

  retryPayment(payment: any): void {

    this.spinner.show();

    setTimeout(() => {

      payment.status = 'Success';

      this.calculateStatistics();

      this.spinner.hide();

      this.alert.success(
        'Payment retried successfully.'
      );

    }, 800);

  }

  //==========================================
  // Badge Color
  //==========================================

  getStatusClass(status: string): string {

    switch (status) {

      case 'Success':
        return 'bg-success';

      case 'Pending':
        return 'bg-warning text-dark';

      case 'Failed':
        return 'bg-danger';

      case 'Refunded':
        return 'bg-secondary';

      default:
        return 'bg-primary';

    }

  }

  //==========================================
  // Payment Method Badge
  //==========================================

  getMethodClass(method: string): string {

    switch (method) {

      case 'UPI':
        return 'bg-success';

      case 'Credit Card':
        return 'bg-primary';

      case 'Debit Card':
        return 'bg-info';

      case 'Net Banking':
        return 'bg-warning text-dark';

      case 'Cash':
        return 'bg-dark';

      default:
        return 'bg-secondary';

    }

  }
exportExcel(): void {

  this.alert.info(
    'Excel export will be integrated with XLSX.'
  );

}
exportPdf(): void {

  this.alert.info(
    'PDF export will be integrated with jsPDF.'
  );

}

confirmRefund(): void {

  if (!this.selectedPayment) {
    return;
  }

  this.refund(this.selectedPayment);

}


}
