import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { ControlsystemService } from '../../services/controlsystem-service';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './invoices.html',
  styleUrl: './invoices.css',
})
export class Invoices implements OnInit {
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

  companies: any[] = [];

  plans: any[] = [];



  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private controlService: ControlsystemService,

    private cdr: ChangeDetectorRef

  ) { }





  ngOnInit(): void {


    this.resetForm();

    this.loadCompanies();

    this.loadPlans();

    this.loadInvoices();


  }


  // ==========================================
  // Load Dropdown Data
  // ==========================================

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

    this.invoice.organizationId = Number(organizationId);
    this.invoice.companyName = company ? company.organizationName : '';
    this.invoice.companyEmail = company ? (company.contactEmail || company.email) : '';
    this.invoice.companyPhone = company ? (company.contactMobile || company.phone) : '';

  }

  onPlanChange(planId: any): void {

    const plan = this.plans.find(p => p.planId === Number(planId));

    this.invoice.planId = Number(planId);
    this.invoice.planName = plan ? plan.planName : '';

  }



  // ==========================================
  // Reset Invoice Form
  // ==========================================


  resetForm(): void {


    this.invoice = {


      invoiceId: 0,


      invoiceNumber: '',


      organizationId: null,


      companyName: '',


      companyEmail: '',


      companyPhone: '',



      planId: null,


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
  // Load Invoices (API)
  // ==========================================


  loadInvoices(): void {

    this.spinner.show();

    this.controlService.getInvoices().subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res.success) {

          this.invoices = (res.data || []).map((x: any) => ({
            invoiceId: x.invoiceId,
            invoiceNumber: x.invoiceNumber,
            organizationId: x.organizationId,
            companyName: x.organizationName,
            companyEmail: x.companyEmail,
            companyPhone: x.companyPhone,
            planId: x.planId,
            planName: x.planName,
            billingCycle: x.billingCycle,
            invoiceDate: (x.invoiceDate || '').slice(0, 10),
            dueDate: x.dueDate ? x.dueDate.slice(0, 10) : '',
            description: x.description,
            quantity: x.quantity,
            unitPrice: x.unitPrice,
            subTotal: x.subTotal,
            gstPercentage: x.gstPercentage,
            taxAmount: x.taxAmount,
            discount: x.discount,
            totalAmount: x.totalAmount,
            paidAmount: x.paidAmount,
            balanceAmount: x.balanceAmount,
            paymentStatus: x.paymentStatus,
            paymentMethod: x.paymentMethod,
            transactionId: x.transactionId,
            currency: x.currency,
            notes: x.notes,
            isActive: x.isActive
          }));

          this.cdr.detectChanges();

        } else {

          this.alert.warning(res.message);

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Error loading invoices:', err);

        this.alert.error(err?.error?.message || 'Unable to load invoices.');

      }

    });

  }
  // ==========================================
  // Save / Update Invoice
  // ==========================================


  saveInvoice(): void {


    this.submitted = true;



    if (
      !this.invoice.organizationId ||
      !this.invoice.planId ||
      !this.invoice.totalAmount
    ) {


      this.alert.warning(
        'Please fill all mandatory invoice details.'
      );


      return;


    }

    const dto = {
      invoiceId: this.isEdit ? this.invoice.invoiceId : 0,
      invoiceNumber: this.invoice.invoiceNumber,
      organizationId: this.invoice.organizationId,
      companyEmail: this.invoice.companyEmail,
      companyPhone: this.invoice.companyPhone,
      planId: this.invoice.planId,
      billingCycle: this.invoice.billingCycle,
      invoiceDate: this.invoice.invoiceDate,
      dueDate: this.invoice.dueDate || null,
      description: this.invoice.description,
      quantity: this.invoice.quantity,
      unitPrice: this.invoice.unitPrice,
      subTotal: this.invoice.subTotal,
      gstPercentage: this.invoice.gstPercentage,
      taxAmount: this.invoice.taxAmount,
      discount: this.invoice.discount,
      totalAmount: this.invoice.totalAmount,
      paidAmount: this.invoice.paidAmount,
      paymentStatus: this.invoice.paymentStatus,
      paymentMethod: this.invoice.paymentMethod,
      transactionId: this.invoice.transactionId,
      currency: this.invoice.currency,
      notes: this.invoice.notes,
      isActive: this.invoice.isActive
    };

    this.spinner.show();

    const request = this.isEdit
      ? this.controlService.updateInvoice(dto)
      : this.controlService.createInvoice(dto);

    request.subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res.success) {

          this.loadInvoices();

          this.alert.success(res.message);

          this.clear();

        } else {

          this.alert.warning(res.message);

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error(err);

        this.alert.error(err?.error?.message || 'Unable to save invoice.');

      }

    });


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

        this.controlService.deleteInvoice(invoiceId).subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res.success) {

              this.loadInvoices();

              this.alert.success(res.message);

            } else {

              this.alert.warning(res.message);

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error(err);

            this.alert.error(err?.error?.message || 'Unable to delete invoice.');

          }

        });



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


    this.loadInvoices();

    this.alert.success(

      'Invoice list refreshed successfully.'

    );


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



    const dto = {
      invoiceId: 0,
      invoiceNumber: 'INV-' + Date.now(),
      organizationId: data.organizationId,
      companyEmail: data.companyEmail,
      companyPhone: data.companyPhone,
      planId: data.planId,
      billingCycle: data.billingCycle,
      invoiceDate: new Date().toISOString().slice(0, 10),
      dueDate: data.dueDate || null,
      description: data.description,
      quantity: data.quantity,
      unitPrice: data.unitPrice,
      subTotal: data.subTotal,
      gstPercentage: data.gstPercentage,
      taxAmount: data.taxAmount,
      discount: data.discount,
      totalAmount: data.totalAmount,
      paidAmount: 0,
      paymentStatus: 'Pending',
      paymentMethod: data.paymentMethod,
      transactionId: '',
      currency: data.currency,
      notes: data.notes,
      isActive: true
    };

    this.spinner.show();

    this.controlService.createInvoice(dto).subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res.success) {

          this.loadInvoices();

          this.alert.success('Invoice duplicated successfully.');

        } else {

          this.alert.warning(res.message);

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error(err);

        this.alert.error(err?.error?.message || 'Unable to duplicate invoice.');

      }

    });


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
