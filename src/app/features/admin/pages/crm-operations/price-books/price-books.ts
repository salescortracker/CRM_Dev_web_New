import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-price-books',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './price-books.html',
  styleUrl: './price-books.css',
})
export class PriceBooks {
  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;

  searchText = '';

  priceBooks: any[] = [];

  priceBook: any = {

    priceBookId: 0,

    priceBookName: '',

    priceBookCode: '',

    currency: '',

    applicableFor: '',

    effectiveFrom: '',

    expiryDate: '',

    priceType: '',

    discount: 0,

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

    this.loadPriceBooks();

  }

  loadPriceBooks() {

    this.spinner.show();

    setTimeout(() => {

      this.priceBooks = [

        {
          priceBookId: 1,

          priceBookName: 'Standard Price Book',

          priceBookCode: 'PB001',

          currency: 'INR',

          applicableFor: 'Retail Customers',

          effectiveFrom: '2026-01-01',

          expiryDate: '2026-12-31',

          priceType: 'Standard',

          discount: 0,

          description: 'Standard pricing for retail customers.',

          status: 'Active',

          isActive: true

        },

        {
          priceBookId: 2,

          priceBookName: 'Corporate Pricing',

          priceBookCode: 'PB002',

          currency: 'INR',

          applicableFor: 'Corporate Customers',

          effectiveFrom: '2026-02-01',

          expiryDate: '2026-12-31',

          priceType: 'Promotional',

          discount: 10,

          description: 'Special pricing for corporate customers.',

          status: 'Active',

          isActive: true

        },

        {
          priceBookId: 3,

          priceBookName: 'Dealer Price List',

          priceBookCode: 'PB003',

          currency: 'USD',

          applicableFor: 'Dealers',

          effectiveFrom: '2026-03-01',

          expiryDate: '2026-12-31',

          priceType: 'Standard',

          discount: 15,

          description: 'Dealer-specific pricing with standard discounts.',

          status: 'Active',

          isActive: true

        },
                {
          priceBookId: 4,

          priceBookName: 'Festival Offer',

          priceBookCode: 'PB004',

          currency: 'INR',

          applicableFor: 'Retail Customers',

          effectiveFrom: '2026-10-01',

          expiryDate: '2026-11-15',

          priceType: 'Seasonal',

          discount: 25,

          description: 'Special festive season pricing for retail customers.',

          status: 'Inactive',

          isActive: false

        },

        {
          priceBookId: 5,

          priceBookName: 'Wholesale Special',

          priceBookCode: 'PB005',

          currency: 'EUR',

          applicableFor: 'Wholesale Customers',

          effectiveFrom: '2026-04-01',

          expiryDate: '2026-12-31',

          priceType: 'Special Offer',

          discount: 20,

          description: 'Exclusive discounted pricing for wholesale customers.',

          status: 'Active',

          isActive: true

        }

      ];

      this.priceBooks.sort(
        (a, b) => b.priceBookId - a.priceBookId
      );

      this.totalRecords = this.priceBooks.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }
    savePriceBook() {

    this.submitted = true;

    if (
      !this.priceBook.priceBookName ||
      !this.priceBook.priceBookCode ||
      !this.priceBook.currency ||
      !this.priceBook.applicableFor ||
      !this.priceBook.effectiveFrom ||
      !this.priceBook.priceType ||
      !this.priceBook.status
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newPriceBook = {

          ...this.priceBook,

          priceBookId: this.priceBooks.length
            ? Math.max(...this.priceBooks.map(x => x.priceBookId)) + 1
            : 1

        };

        this.priceBooks.unshift(newPriceBook);

      }
      else {

        const index = this.priceBooks.findIndex(
          x => x.priceBookId === this.priceBook.priceBookId
        );

        if (index !== -1) {

          this.priceBooks[index] = {

            ...this.priceBook

          };

        }

      }


      this.priceBooks = [...this.priceBooks];

      this.totalRecords = this.priceBooks.length;

      this.page = 1;

      const isUpdate = this.isEdit;


      this.clear();


      this.spinner.hide();

      this.cd.detectChanges();


      this.alert.success(

        isUpdate
          ? 'Price Book updated successfully.'
          : 'Price Book created successfully.'

      );


    }, 500);

  }



  edit(id: number) {

    this.spinner.show();


    setTimeout(() => {


      const selected = this.priceBooks.find(

        x => x.priceBookId === id

      );


      if (selected) {


        this.priceBook = {

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


          this.priceBooks = this.priceBooks.filter(

            x => x.priceBookId !== id

          );


          this.totalRecords = this.priceBooks.length;



          if (

            this.page > 1 &&

            this.pagedPriceBooks.length === 0

          ) {


            this.page--;


          }



          this.priceBooks = [...this.priceBooks];


          this.spinner.hide();


          this.cd.detectChanges();



          this.alert.success(

            'Price Book deleted successfully.'

          );



        }, 500);


      }


    });


  }



  clear() {


    this.priceBook = {


      priceBookId: 0,

      priceBookName: '',

      priceBookCode: '',

      currency: '',

      applicableFor: '',

      effectiveFrom: '',

      expiryDate: '',

      priceType: '',

      discount: 0,

      description: '',

      status: '',

      isActive: true


    };


    this.isEdit = false;


    this.submitted = false;


    this.cd.detectChanges();


  }



  get filteredPriceBooks() {


    return this.priceBooks.filter(x =>


      x.priceBookName

        .toLowerCase()

        .includes(this.searchText.toLowerCase())



      ||



      x.priceBookCode

        .toLowerCase()

        .includes(this.searchText.toLowerCase())



      ||



      x.currency

        .toLowerCase()

        .includes(this.searchText.toLowerCase())



      ||



      x.applicableFor

        .toLowerCase()

        .includes(this.searchText.toLowerCase())



      ||



      x.priceType

        .toLowerCase()

        .includes(this.searchText.toLowerCase())



      ||



      x.status

        .toLowerCase()

        .includes(this.searchText.toLowerCase())


    );


  }



  get pagedPriceBooks() {


    const start = (this.page - 1) * this.pageSize;


    return this.filteredPriceBooks.slice(

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
