import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
   submitted = false;

  isEdit = false;


  page = 1;

  pageSize = 5;

  totalRecords = 0;

  searchText = '';



  products: any[] = [];



  product: any = {


    productId: 0,

    productCode: '',

    productName: '',

    category: '',

    productType: '',

    brand: '',

    unit: '',

    unitPrice: 0,

    costPrice: 0,

    tax: 0,

    discount: 0,

    stockQuantity: 0,

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


    this.loadProducts();


  }





  loadProducts() {


    this.spinner.show();



    setTimeout(() => {



      this.products = [



        {

          productId: 1,

          productCode: 'PROD001',

          productName: 'CRM Software',

          category: 'Software',

          productType: 'Subscription',

          brand: 'Company CRM',

          unit: 'Year',

          unitPrice: 250000,

          costPrice: 150000,

          tax: 18,

          discount: 5,

          stockQuantity: 25,

          description: 'Complete CRM solution for business management.',

          status: 'Available',

          isActive: true

        },



        {

          productId: 2,

          productCode: 'PROD002',

          productName: 'HRMS Software',

          category: 'Software',

          productType: 'Subscription',

          brand: 'Company HRMS',

          unit: 'Year',

          unitPrice: 180000,

          costPrice: 100000,

          tax: 18,

          discount: 10,

          stockQuantity: 15,

          description: 'Employee management and payroll system.',

          status: 'Available',

          isActive: true

        },



        {

          productId: 3,

          productCode: 'PROD003',

          productName: 'Cloud Hosting Service',

          category: 'Cloud Services',

          productType: 'Service',

          brand: 'AWS',

          unit: 'Month',

          unitPrice: 120000,

          costPrice: 80000,

          tax: 18,

          discount: 0,

          stockQuantity: 50,

          description: 'Cloud hosting and server maintenance service.',

          status: 'Available',

          isActive: true

        },



        {

          productId: 4,

          productCode: 'PROD004',

          productName: 'Digital Marketing Package',

          category: 'Marketing',

          productType: 'Package',

          brand: 'Marketing Pro',

          unit: 'Month',

          unitPrice: 95000,

          costPrice: 60000,

          tax: 18,

          discount: 5,

          stockQuantity: 10,

          description: 'SEO, Social Media and Marketing services.',

          status: 'Available',

          isActive: true

        },



        {

          productId: 5,

          productCode: 'PROD005',

          productName: 'Technical Support',

          category: 'Support',

          productType: 'Service',

          brand: 'Support Plus',

          unit: 'Month',

          unitPrice: 50000,

          costPrice: 30000,

          tax: 18,

          discount: 0,

          stockQuantity: 0,

          description: '24/7 technical customer support.',

          status: 'Out of Stock',

          isActive: true

        }



      ];




      this.products.sort(

        (a,b)=> b.productId - a.productId

      );



      this.totalRecords = this.products.length;



      this.spinner.hide();



      this.cd.detectChanges();



    },500);



  }







  saveProduct() {



    this.submitted = true;



    if(


      !this.product.productCode ||

      !this.product.productName ||

      !this.product.category ||

      !this.product.productType ||

      !this.product.unitPrice ||

      !this.product.status


    ){


      return;


    }





    this.spinner.show();



    setTimeout(()=>{



      if(!this.isEdit){



        const newProduct = {


          ...this.product,


          productId:

          this.products.length

          ?

          Math.max(
            ...this.products.map(x=>x.productId)
          ) + 1

          :

          1


        };



        this.products.unshift(newProduct);



      }

      else{



        const index = this.products.findIndex(


          x=>x.productId === this.product.productId


        );



        if(index !== -1){



          this.products[index] = {


            ...this.product


          };


        }



      }




      // Refresh table immediately

      this.products = [

        ...this.products

      ];



      this.totalRecords = this.products.length;



      this.page = 1;



      const message = this.isEdit

      ?

      'Product updated successfully.'

      :

      'Product created successfully.';





      this.clear();



      this.spinner.hide();



      this.cd.detectChanges();



      this.alert.success(message);



    },500);



  }
    edit(id: number) {

    this.spinner.show();


    setTimeout(() => {


      const selected = this.products.find(

        x => x.productId === id

      );



      if (selected) {


        this.product = {

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



          this.products = this.products.filter(


            x => x.productId !== id


          );



          this.totalRecords = this.products.length;



          if (

            this.page > 1 &&

            this.pagedProducts.length === 0

          ) {


            this.page--;


          }



          // Immediate table refresh

          this.products = [

            ...this.products

          ];



          this.spinner.hide();



          this.cd.detectChanges();



          this.alert.success(

            'Product deleted successfully.'

          );



        }, 500);



      }



    });



  }







  clear() {



    this.product = {



      productId: 0,

      productCode: '',

      productName: '',

      category: '',

      productType: '',

      brand: '',

      unit: '',

      unitPrice: 0,

      costPrice: 0,

      tax: 0,

      discount: 0,

      stockQuantity: 0,

      description: '',

      status: '',

      isActive: true



    };



    this.isEdit = false;



    this.submitted = false;



    this.cd.detectChanges();



  }







  get filteredProducts() {



    return this.products.filter(x =>



      x.productCode

        .toLowerCase()

        .includes(this.searchText.toLowerCase())



      ||



      x.productName

        .toLowerCase()

        .includes(this.searchText.toLowerCase())



      ||



      x.category

        .toLowerCase()

        .includes(this.searchText.toLowerCase())



      ||



      x.productType

        .toLowerCase()

        .includes(this.searchText.toLowerCase())



      ||



      x.brand

        .toLowerCase()

        .includes(this.searchText.toLowerCase())



      ||



      x.status

        .toLowerCase()

        .includes(this.searchText.toLowerCase())



    );



  }







  get pagedProducts() {



    const start =

      (this.page - 1) * this.pageSize;



    return this.filteredProducts.slice(


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
