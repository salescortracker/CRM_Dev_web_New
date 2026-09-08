import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';

@Component({
  selector: 'app-coupons-discounts',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './coupons-discounts.html',
  styleUrl: './coupons-discounts.css',
})
export class CouponsDiscounts {
  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice
  ) { }



  // ==========================================
  // Coupon Form
  // ==========================================


  coupon: any = {};



  submitted = false;

  isEdit = false;



  // ==========================================
  // Search / Filter
  // ==========================================


  searchText = '';

  statusFilter = '';



  // ==========================================
  // Pagination
  // ==========================================


  page = 1;

  pageSize = 10;



  // ==========================================
  // Data Collection
  // ==========================================


  coupons: any[] = [];




  ngOnInit(): void {

    this.resetForm();

    this.loadStaticData();

  }





  // ==========================================
  // Reset Form
  // ==========================================


  resetForm(): void {


    this.coupon = {


      couponId: 0,


      couponCode: '',


      couponName: '',


      description: '',


      discountType: 'Percentage',


      discountValue: 10,


      minimumAmount: 0,


      maximumDiscount: 500,


      usageLimit: 100,


      usedCount: 0,


      applicablePlan: 'All Plans',


      startDate: '',


      expiryDate: '',


      status: 'Active'


    };


  }






  // ==========================================
  // Static Data
  // ==========================================


  loadStaticData(): void {



    this.coupons = [


      {


        couponId: 1,


        couponCode: 'WELCOME20',


        couponName: 'Welcome Offer',


        description: 'New customer discount',


        discountType: 'Percentage',


        discountValue: 20,


        minimumAmount: 5000,


        maximumDiscount: 2000,


        usageLimit: 100,


        usedCount: 45,


        applicablePlan: 'All Plans',


        startDate: '2026-07-01',


        expiryDate: '2026-12-31',


        status: 'Active'


      },



      {


        couponId: 2,


        couponCode: 'SAVE500',


        couponName: 'Festival Discount',


        description: 'Fixed amount discount',


        discountType: 'Fixed Amount',


        discountValue: 500,


        minimumAmount: 3000,


        maximumDiscount: 500,


        usageLimit: 50,


        usedCount: 50,


        applicablePlan: 'Professional Plan',


        startDate: '2026-06-01',


        expiryDate: '2026-07-15',


        status: 'InActive'


      }


    ];



  }







  // ==========================================
  // Save Coupon
  // ==========================================


  saveCoupon(): void {



    this.submitted = true;



    if (
      !this.coupon.couponCode ||
      !this.coupon.couponName
    ) {

      this.alert.warning(
        'Please fill mandatory fields.'
      );

      return;

    }



    this.spinner.show();



    setTimeout(() => {


      if (this.isEdit) {



        const index =
          this.coupons.findIndex(
            x => x.couponId === this.coupon.couponId
          );



        if (index > -1) {


          this.coupons[index] =
          {
            ...this.coupon
          };


        }



        this.alert.success(
          'Coupon updated successfully.'
        );



      }
      else {


        this.coupon.couponId =
          new Date().getTime();



        this.coupons.unshift(
          {
            ...this.coupon
          }
        );



        this.alert.success(
          'Coupon created successfully.'
        );


      }



      this.spinner.hide();


      this.clear();



    }, 500);



  }







  // ==========================================
  // Clear
  // ==========================================


  clear(): void {


    this.resetForm();


    this.isEdit = false;


    this.submitted = false;


  }







  // ==========================================
  // Edit
  // ==========================================


  edit(id: number): void {


    const data =
      this.coupons.find(
        x => x.couponId === id
      );



    if (!data) {

      return;

    }



    this.coupon =
    {
      ...data
    };



    this.isEdit = true;



    window.scrollTo({

      top: 0,

      behavior: 'smooth'

    });



  }







  // ==========================================
  // Delete
  // ==========================================


  delete(id: number): void {


    this.alert.deleteConfirm()
      .then(result => {


        if (!result.isConfirmed) {

          return;

        }



        this.coupons =
          this.coupons.filter(
            x => x.couponId !== id
          );



        this.alert.success(
          'Coupon deleted successfully.'
        );



      });



  }







  // ==========================================
  // Statistics
  // ==========================================


  get totalCoupons(): number {


    return this.coupons.length;


  }




  get activeCoupons(): number {


    return this.coupons.filter(
      x => x.status === 'Active'
    ).length;


  }





  get expiredCoupons(): number {


    return this.coupons.filter(
      x => x.status === 'Expired'
    ).length;


  }






  get totalDiscount(): number {


    return this.coupons.reduce(
      (sum, x) =>
        sum + Number(x.discountValue),
      0
    );


  }







  // ==========================================
  // Filter
  // ==========================================


  get filteredCoupons(): any[] {


    const search =
      this.searchText
        .toLowerCase()
        .trim();



    return this.coupons.filter(x => {


      const matchesSearch =

        x.couponCode
          ?.toLowerCase()
          .includes(search)

        ||

        x.couponName
          ?.toLowerCase()
          .includes(search);



      const matchesStatus =

        this.statusFilter === ''

        ||

        x.status === this.statusFilter;



      return matchesSearch && matchesStatus;



    });



  }







  // ==========================================
  // Pagination Data
  // ==========================================


  get pagedCoupons(): any[] {



    const start =
      (this.page - 1) * this.pageSize;



    return this.filteredCoupons
      .slice(
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








  // ==========================================
  // Export
  // ==========================================


  exportExcel(): void {


    this.alert.info(
      'Excel export functionality will be connected with API.'
    );


  }






  exportPdf(): void {


    this.alert.info(
      'PDF export functionality will be connected with API.'
    );


  }
}
