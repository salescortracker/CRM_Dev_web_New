import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './invoices.html',
  styleUrl: './invoices.css',
})
export class Invoices {
  // ==========================================
  // Invoice Form Object
  // ==========================================


  invoice: any = {};



  submitted = false;

  isEdit = false;



  // ==========================================
  // Pagination
  // ==========================================


  page = 1;

  pageSize = 10;



  searchText = '';



  // ==========================================
  // Filters
  // ==========================================


  statusFilter = '';

  companyFilter = '';

  fromDate = '';

  toDate = '';



  // ==========================================
  // Data Collection
  // ==========================================


  invoices: any[] = [];



  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice

  ) { }





  ngOnInit(): void {


    this.resetForm();


    this.loadStaticInvoices();


  }





  // ==========================================
  // Reset Invoice Form
  // ==========================================


  resetForm(): void {


    this.invoice = {


      invoiceId: 0,


      invoiceNumber: '',


      companyName: '',


      companyEmail: '',


      companyPhone: '',



      planName: '',


      billingCycle: 'Monthly',



      invoiceDate: new Date()
        .toISOString()
        .substring(0, 10),



      dueDate: '',



      description: '',



      quantity: 1,


      unitPrice: 0,


      subTotal: 0,


      gstPercentage: 18,


      taxAmount: 0,


      discount: 0,


      totalAmount: 0,



      paidAmount: 0,


      balanceAmount: 0,



      paymentStatus: 'Pending',



      paymentMethod: 'UPI',



      transactionId: '',



      currency: 'INR',



      notes: '',



      isActive: true



    };


  }







  // ==========================================
  // Static Invoice Data
  // ==========================================


  loadStaticInvoices(): void {


    this.invoices = [



      {


        invoiceId: 1,


        invoiceNumber: 'INV-1001',


        companyName: 'ABC Technologies',


        companyEmail: 'admin@abc.com',


        companyPhone: '9876543210',



        planName: 'Enterprise Plan',



        billingCycle: 'Yearly',



        invoiceDate: '2026-07-01',



        dueDate: '2026-07-15',



        description:
          'CRM Enterprise Subscription',



        quantity: 1,



        unitPrice: 50000,



        subTotal: 50000,



        gstPercentage: 18,



        taxAmount: 9000,



        discount: 2000,



        totalAmount: 57000,



        paidAmount: 57000,



        balanceAmount: 0,



        paymentStatus: 'Paid',



        paymentMethod: 'Bank Transfer',



        transactionId: 'TXN100001',



        currency: 'INR',



        notes: 'Annual CRM Subscription',



        isActive: true


      },




      {


        invoiceId: 2,


        invoiceNumber: 'INV-1002',


        companyName: 'XYZ Solutions',



        companyEmail: 'contact@xyz.com',



        companyPhone: '9988776655',



        planName: 'Professional Plan',



        billingCycle: 'Monthly',



        invoiceDate: '2026-07-05',



        dueDate: '2026-07-20',



        description: 'CRM Monthly Subscription',



        quantity: 1,



        unitPrice: 5000,



        subTotal: 5000,



        gstPercentage: 18,



        taxAmount: 900,



        discount: 0,



        totalAmount: 5900,



        paidAmount: 3000,



        balanceAmount: 2900,



        paymentStatus: 'Partial',



        paymentMethod: 'UPI',



        transactionId: 'TXN100002',



        currency: 'INR',



        notes: 'Partial payment received',



        isActive: true


      }




    ];



  }
  // ==========================================
  // Save / Update Invoice
  // ==========================================


  saveInvoice(): void {


    this.submitted = true;



    if (
      !this.invoice.companyName ||
      !this.invoice.planName ||
      !this.invoice.totalAmount
    ) {


      this.alert.warning(
        'Please fill all mandatory invoice details.'
      );


      return;


    }



    this.spinner.show();



    setTimeout(() => {



      if (this.isEdit) {



        const index =
          this.invoices.findIndex(
            x => x.invoiceId === this.invoice.invoiceId
          );



        if (index > -1) {


          this.invoices[index] = {
            ...this.invoice
          };


        }



        this.alert.success(
          'Invoice updated successfully.'
        );


      }
      else {



        this.invoice.invoiceId =
          new Date().getTime();



        if (!this.invoice.invoiceNumber) {


          this.invoice.invoiceNumber =
            'INV-' + this.invoice.invoiceId;


        }



        this.invoice.balanceAmount =
          this.invoice.totalAmount -
          this.invoice.paidAmount;



        this.invoices.unshift(
          {
            ...this.invoice
          }
        );



        this.alert.success(
          'Invoice created successfully.'
        );



      }



      this.spinner.hide();



      this.clear();



    }, 500);



  }






  // ==========================================
  // Clear Form
  // ==========================================


  clear(): void {



    this.resetForm();



    this.isEdit = false;



    this.submitted = false;



  }







  // ==========================================
  // Edit Invoice
  // ==========================================


  edit(invoiceId: number): void {



    const data =
      this.invoices.find(
        x => x.invoiceId === invoiceId
      );



    if (!data) {

      return;

    }



    this.invoice = {
      ...data
    };



    this.isEdit = true;



    window.scrollTo({

      top: 0,

      behavior: 'smooth'

    });



  }








  // ==========================================
  // Delete Invoice
  // ==========================================


  delete(invoiceId: number): void {



    this.alert.deleteConfirm()
      .then(result => {



        if (!result.isConfirmed) {

          return;

        }



        this.spinner.show();



        setTimeout(() => {



          this.invoices =
            this.invoices.filter(
              x => x.invoiceId !== invoiceId
            );



          this.spinner.hide();



          this.alert.success(
            'Invoice deleted successfully.'
          );



        }, 500);



      });



  }







  // ==========================================
  // View Invoice
  // ==========================================


  view(invoiceId: number): void {



    const invoice =
      this.invoices.find(
        x => x.invoiceId === invoiceId
      );



    if (invoice) {



      this.alert.info(

        `Invoice Number : ${invoice.invoiceNumber}`

      );


    }



  }







  // ==========================================
  // Print Invoice
  // ==========================================


  printInvoice(invoiceId: number): void {



    const invoice =
      this.invoices.find(
        x => x.invoiceId === invoiceId
      );



    if (!invoice) {

      return;

    }



    window.print();



  }







  // ==========================================
  // Download PDF
  // ==========================================


  downloadPdf(invoiceId: number): void {



    this.alert.info(

      'Invoice PDF download functionality will be connected with API.'

    );


  }








  // ==========================================
  // Export Excel
  // ==========================================


  exportExcel(): void {



    this.alert.info(

      'Excel export functionality will be connected with API.'

    );



  }








  // ==========================================
  // Export PDF
  // ==========================================


  exportPdf(): void {



    this.alert.info(

      'PDF export functionality will be connected with API.'

    );


  }







  // ==========================================
  // Calculate Invoice Amount
  // ==========================================


  calculateAmount(): void {



    this.invoice.subTotal =
      this.invoice.quantity *
      this.invoice.unitPrice;



    this.invoice.taxAmount =
      (
        this.invoice.subTotal *
        this.invoice.gstPercentage
      ) / 100;



    this.invoice.totalAmount =
      this.invoice.subTotal +
      this.invoice.taxAmount -
      this.invoice.discount;



    this.invoice.balanceAmount =
      this.invoice.totalAmount -
      this.invoice.paidAmount;



  }
  // ==========================================
  // Filtered Invoices
  // ==========================================


  get filteredInvoices(): any[] {


    let data = [...this.invoices];



    // Search Filter

    const search =
      this.searchText
        .toLowerCase()
        .trim();



    if (search) {


      data =
        data.filter(x =>


          x.invoiceNumber
            ?.toLowerCase()
            .includes(search)


          ||

          x.companyName
            ?.toLowerCase()
            .includes(search)


          ||

          x.planName
            ?.toLowerCase()
            .includes(search)


          ||

          x.paymentStatus
            ?.toLowerCase()
            .includes(search)


        );


    }




    // Status Filter

    if (this.statusFilter) {


      data =
        data.filter(x =>

          x.paymentStatus === this.statusFilter

        );


    }




    // Company Filter

    if (this.companyFilter) {


      data =
        data.filter(x =>

          x.companyName === this.companyFilter

        );


    }





    // From Date Filter

    if (this.fromDate) {


      data =
        data.filter(x =>

          new Date(x.invoiceDate)
          >= new Date(this.fromDate)

        );


    }





    // To Date Filter

    if (this.toDate) {


      data =
        data.filter(x =>

          new Date(x.invoiceDate)
          <= new Date(this.toDate)

        );


    }



    return data;



  }







  // ==========================================
  // Pagination Data
  // ==========================================


  get pagedInvoices(): any[] {



    const start =
      (this.page - 1) *
      this.pageSize;



    const end =
      start + this.pageSize;



    return this.filteredInvoices
      .slice(start, end);



  }







  // ==========================================
  // Change Page
  // ==========================================


  changePage(page: number): void {


    this.page = page;


  }







  // ==========================================
  // Change Page Size
  // ==========================================


  changePageSize(size: number): void {


    this.pageSize = size;


    this.page = 1;


  }







  // ==========================================
  // Clear Search
  // ==========================================


  clearSearch(): void {


    this.searchText = '';


    this.statusFilter = '';


    this.companyFilter = '';


    this.fromDate = '';


    this.toDate = '';


    this.page = 1;


  }








  // ==========================================
  // Statistics
  // ==========================================



  get totalInvoices(): number {


    return this.invoices.length;


  }







  get totalAmount(): number {


    return this.invoices.reduce(

      (sum, item) =>
        sum + Number(item.totalAmount || 0),

      0

    );


  }







  get totalReceived(): number {


    return this.invoices.reduce(

      (sum, item) =>
        sum + Number(item.paidAmount || 0),

      0

    );


  }







  get totalPending(): number {


    return this.invoices.reduce(

      (sum, item) =>
        sum + Number(item.balanceAmount || 0),

      0

    );


  }







  get paidInvoices(): number {


    return this.invoices.filter(

      x => x.paymentStatus === 'Paid'

    ).length;



  }







  get pendingInvoices(): number {


    return this.invoices.filter(

      x =>
        x.paymentStatus === 'Pending'

    ).length;



  }







  get partialInvoices(): number {


    return this.invoices.filter(

      x =>
        x.paymentStatus === 'Partial'

    ).length;



  }







  get overdueInvoices(): number {


    const today =
      new Date();



    return this.invoices.filter(x => {


      return (

        new Date(x.dueDate) < today

        &&

        x.paymentStatus !== 'Paid'

      );


    }).length;



  }








  // ==========================================
  // Refresh Invoice List
  // ==========================================


  refresh(): void {


    this.spinner.show();



    setTimeout(() => {


      this.loadStaticInvoices();



      this.spinner.hide();



      this.alert.success(

        'Invoice list refreshed successfully.'

      );



    }, 500);



  }








  // ==========================================
  // Duplicate Invoice
  // ==========================================


  duplicate(invoiceId: number): void {


    const data =
      this.invoices.find(

        x => x.invoiceId === invoiceId

      );



    if (!data) {

      return;

    }



    const copy = {

      ...data,

      invoiceId: new Date().getTime(),

      invoiceNumber:
        'INV-' + new Date().getTime(),

      paymentStatus: 'Pending',

      paidAmount: 0,

      balanceAmount: data.totalAmount


    };



    this.invoices.unshift(copy);



    this.alert.success(

      'Invoice duplicated successfully.'

    );



  }


// ==========================================
// HTML Compatibility Properties
// ==========================================


// Invoice List Alias

get invoiceList(): any[] {

  return this.invoices;

}



// Total Invoice Amount

get totalInvoiceAmount(): number {


  return this.invoices.reduce(

    (sum, item) => 
      sum + Number(item.totalAmount || 0),

    0

  );


}



// Received Amount

get receivedAmount(): number {


  return this.invoices.reduce(

    (sum, item) =>
      sum + Number(item.paidAmount || 0),

    0

  );


}

}
