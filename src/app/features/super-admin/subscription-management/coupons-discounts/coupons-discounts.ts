import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { ControlsystemService } from '../../services/controlsystem-service';

@Component({
  selector: 'app-coupons-discounts',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './coupons-discounts.html',
  styleUrl: './coupons-discounts.css',
})
export class CouponsDiscounts implements OnInit {
  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private controlService: ControlsystemService,
    private cdr: ChangeDetectorRef
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

  plans: any[] = [];




  ngOnInit(): void {

    this.resetForm();

    this.loadPlans();

    this.loadCoupons();

  }


  // ==========================================
  // Load Plans (API)
  // ==========================================

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


      planId: null,


      startDate: '',


      expiryDate: '',


      status: 'Active'


    };


  }




  // ==========================================
  // Load Coupons (API)
  // ==========================================


  loadCoupons(): void {

    this.spinner.show();

    this.controlService.getCoupons().subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res.success) {

          this.coupons = (res.data || []).map((x: any) => ({
            couponId: x.couponId,
            couponCode: x.couponCode,
            couponName: x.couponName,
            description: x.description,
            discountType: x.discountType,
            discountValue: x.discountValue,
            minimumAmount: x.minimumAmount,
            maximumDiscount: x.maximumDiscount,
            usageLimit: x.usageLimit,
            usedCount: x.usedCount,
            planId: x.planId,
            applicablePlan: x.planName || 'All Plans',
            startDate: x.startDate ? x.startDate.slice(0, 10) : '',
            expiryDate: x.expiryDate ? x.expiryDate.slice(0, 10) : '',
            status: x.status
          }));

          this.cdr.detectChanges();

        } else {

          this.alert.warning(res.message);

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Error loading coupons:', err);

        this.alert.error(err?.error?.message || 'Unable to load coupons.');

      }

    });

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

    const dto = {
      couponId: this.isEdit ? this.coupon.couponId : 0,
      couponCode: this.coupon.couponCode,
      couponName: this.coupon.couponName,
      description: this.coupon.description,
      discountType: this.coupon.discountType,
      discountValue: this.coupon.discountValue,
      minimumAmount: this.coupon.minimumAmount,
      maximumDiscount: this.coupon.maximumDiscount,
      usageLimit: this.coupon.usageLimit,
      usedCount: this.coupon.usedCount,
      planId: this.coupon.planId,
      startDate: this.coupon.startDate || null,
      expiryDate: this.coupon.expiryDate || null,
      status: this.coupon.status
    };

    this.spinner.show();

    const request = this.isEdit
      ? this.controlService.updateCoupon(dto)
      : this.controlService.createCoupon(dto);

    request.subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res.success) {

          this.loadCoupons();

          this.alert.success(res.message);

          this.clear();

        } else {

          this.alert.warning(res.message);

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error(err);

        this.alert.error(err?.error?.message || 'Unable to save coupon.');

      }

    });


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

        this.spinner.show();

        this.controlService.deleteCoupon(id).subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res.success) {

              this.loadCoupons();

              this.alert.success(res.message);

            } else {

              this.alert.warning(res.message);

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error(err);

            this.alert.error(err?.error?.message || 'Unable to delete coupon.');

          }

        });



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
