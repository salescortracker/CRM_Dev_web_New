import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-document-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './document-categories.html',
  styleUrl: './document-categories.css',
})
export class DocumentCategories {
  submitted = false;

  isEdit = false;

  page = 1;

  pageSize = 5;

  totalRecords = 0;

  searchText = '';



  documentCategories: any[] = [];



  documentCategory: any = {

    documentCategoryId: 0,

    categoryName: '',

    categoryCode: '',

    parentCategory: '',

    allowedFileTypes: '',

    retentionPeriod: null,

    description: '',

    isActive: true

  };



  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef

  ) { }



  ngOnInit(): void {

    this.loadDocumentCategories();

  }





  loadDocumentCategories() {

    this.spinner.show();

    setTimeout(() => {

      this.documentCategories = [

        {

          documentCategoryId: 1,

          categoryName: 'HR Documents',

          categoryCode: 'HR001',

          parentCategory: '',

          allowedFileTypes: 'PDF, DOCX',

          retentionPeriod: 365,

          description: 'Employee HR related documents.',

          isActive: true

        },



        {

          documentCategoryId: 2,

          categoryName: 'Finance Documents',

          categoryCode: 'FIN001',

          parentCategory: '',

          allowedFileTypes: 'PDF, XLSX',

          retentionPeriod: 730,

          description: 'Financial and accounting documents.',

          isActive: true

        },



        {

          documentCategoryId: 3,

          categoryName: 'Customer Contracts',

          categoryCode: 'CUS001',

          parentCategory: 'Legal Documents',

          allowedFileTypes: 'PDF',

          retentionPeriod: 1095,

          description: 'Customer agreements and contracts.',

          isActive: true

        },
                {

          documentCategoryId: 4,

          categoryName: 'Marketing Assets',

          categoryCode: 'MKT001',

          parentCategory: '',

          allowedFileTypes: 'JPG, PNG, MP4',

          retentionPeriod: 180,

          description: 'Marketing images, videos and promotional files.',

          isActive: true

        },



        {

          documentCategoryId: 5,

          categoryName: 'Employee Certificates',

          categoryCode: 'EMP001',

          parentCategory: 'HR Documents',

          allowedFileTypes: 'PDF, JPG',

          retentionPeriod: 365,

          description: 'Employee education and certification documents.',

          isActive: false

        }

      ];



      this.documentCategories.sort(

        (a, b) => b.documentCategoryId - a.documentCategoryId

      );



      this.totalRecords = this.documentCategories.length;



      this.spinner.hide();



      this.cd.detectChanges();



    }, 500);

  }
    saveDocumentCategory() {

    this.submitted = true;

    if (
      !this.documentCategory.categoryName ||
      !this.documentCategory.categoryCode ||
      !this.documentCategory.allowedFileTypes
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newCategory = {

          ...this.documentCategory,

          documentCategoryId: this.documentCategories.length
            ? Math.max(...this.documentCategories.map(x => x.documentCategoryId)) + 1
            : 1

        };

        this.documentCategories.unshift(newCategory);

      } else {

        const index = this.documentCategories.findIndex(
          x => x.documentCategoryId === this.documentCategory.documentCategoryId
        );

        if (index !== -1) {

          this.documentCategories[index] = {

            ...this.documentCategory

          };

        }

      }


      this.documentCategories = [...this.documentCategories];

      this.totalRecords = this.documentCategories.length;

      this.page = 1;


      const isUpdate = this.isEdit;


      this.clear();


      this.spinner.hide();


      this.cd.detectChanges();


      this.alert.success(

        isUpdate
          ? 'Document Category updated successfully.'
          : 'Document Category created successfully.'

      );


    }, 500);

  }







  edit(id: number) {

    this.spinner.show();


    setTimeout(() => {


      const selected = this.documentCategories.find(

        x => x.documentCategoryId === id

      );


      if (selected) {


        this.documentCategory = {

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


          this.documentCategories = this.documentCategories.filter(

            x => x.documentCategoryId !== id

          );



          this.totalRecords = this.documentCategories.length;



          if (

            this.page > 1 &&

            this.pagedDocumentCategories.length === 0

          ) {

            this.page--;

          }



          this.documentCategories = [...this.documentCategories];



          this.spinner.hide();



          this.cd.detectChanges();



          this.alert.success(

            'Document Category deleted successfully.'

          );



        }, 500);



      }


    });


  }







  clear() {


    this.documentCategory = {


      documentCategoryId: 0,


      categoryName: '',


      categoryCode: '',


      parentCategory: '',


      allowedFileTypes: '',


      retentionPeriod: null,


      description: '',


      isActive: true


    };



    this.submitted = false;


    this.isEdit = false;


    this.cd.detectChanges();


  }







  get filteredDocumentCategories() {


    return this.documentCategories.filter(x =>



      x.categoryName.toLowerCase().includes(

        this.searchText.toLowerCase()

      )

      ||

      x.categoryCode.toLowerCase().includes(

        this.searchText.toLowerCase()

      )

      ||

      x.parentCategory.toLowerCase().includes(

        this.searchText.toLowerCase()

      )

      ||

      x.allowedFileTypes.toLowerCase().includes(

        this.searchText.toLowerCase()

      )



    );


  }







  get pagedDocumentCategories() {


    const start = (this.page - 1) * this.pageSize;


    return this.filteredDocumentCategories.slice(


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
