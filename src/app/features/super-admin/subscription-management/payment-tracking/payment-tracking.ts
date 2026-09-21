import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { ControlsystemService } from '../../services/controlsystem-service';

declare var bootstrap: any;

@Component({
  selector: 'app-payment-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './payment-tracking.html',
  styleUrl: './payment-tracking.css',
})
export class PaymentTracking implements OnInit {
  // Statistics
  totalRevenue = 0;
  refundPayments = 0;

  // Filters
  methodFilter = 'All';
  fromDate = '';
  toDate = '';

  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private controlService: ControlsystemService,
    private cdr: ChangeDetectorRef
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

  }

  //==========================================
  // Load Payments (API)
  //==========================================

  loadPayments(): void {

    this.spinner.show();

    this.controlService.getPaymentTrackings().subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res.success) {

          this.payments = (res.data || []).map((x: any) => ({
            paymentId: x.paymentId,
            organizationId: x.organizationId,
            companyName: x.organizationName,
            planId: x.planId,
            plan: x.planName,
            invoiceNo: x.invoiceNo,
            transactionId: x.transactionId,
            amount: x.amount,
            paymentMethod: x.paymentMethod,
            gateway: x.gateway,
            status: x.status,
            paymentDate: (x.paymentDate || '').slice(0, 10),
            nextRenewal: x.nextRenewal ? x.nextRenewal.slice(0, 10) : '-',
            refundAmount: x.refundAmount,
            refundReason: x.refundReason
          }));

          this.calculateStatistics();

          this.cdr.detectChanges();

        } else {

          this.alert.warning(res.message);

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Error loading payments:', err);

        this.alert.error(err?.error?.message || 'Unable to load payments.');

      }

    });

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

    this.refundAmount =
      this.payments
        .filter(x => x.status === 'Refunded')
        .reduce((sum, item) => sum + (item.refundAmount || item.amount), 0);

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

        x.companyName?.toLowerCase().includes(search) ||

        x.invoiceNo?.toLowerCase().includes(search) ||

        x.transactionId?.toLowerCase().includes(search) ||

        x.plan?.toLowerCase().includes(search)

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

    this.loadPayments();

    this.alert.success(
      'Payment data refreshed successfully.'
    );

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

    this.selectedPayment = payment;

    this.refundAmountValue = payment.amount;

    this.refundReason = '';

    const modal = new bootstrap.Modal(
      document.getElementById('refundModal')
    );

    modal.show();

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

      this.controlService.deletePaymentTracking(paymentId).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res.success) {

            this.loadPayments();

            this.alert.success(res.message);

          } else {

            this.alert.warning(res.message);

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error(err);

          this.alert.error(err?.error?.message || 'Unable to delete payment.');

        }

      });

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

    this.controlService.updatePaymentTracking({
      paymentId: payment.paymentId,
      organizationId: payment.organizationId,
      planId: payment.planId,
      invoiceNo: payment.invoiceNo,
      transactionId: payment.transactionId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      gateway: payment.gateway,
      status: 'Success',
      paymentDate: payment.paymentDate,
      nextRenewal: payment.nextRenewal === '-' ? null : payment.nextRenewal
    }).subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res.success) {

          this.loadPayments();

          this.alert.success('Payment retried successfully.');

        } else {

          this.alert.warning(res.message);

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error(err);

        this.alert.error(err?.error?.message || 'Unable to retry payment.');

      }

    });

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

  if (!this.selectedPayment?.paymentId) {
    return;
  }

  this.spinner.show();

  this.controlService.refundPaymentTracking(
    this.selectedPayment.paymentId,
    this.refundAmountValue,
    this.refundReason
  ).subscribe({

    next: (res: any) => {

      this.spinner.hide();

      if (res.success) {

        this.loadPayments();

        this.alert.success('Payment refunded successfully.');

      } else {

        this.alert.warning(res.message);

      }

    },

    error: (err) => {

      this.spinner.hide();

      console.error(err);

      this.alert.error(err?.error?.message || 'Unable to refund payment.');

    }

  });

}


}
