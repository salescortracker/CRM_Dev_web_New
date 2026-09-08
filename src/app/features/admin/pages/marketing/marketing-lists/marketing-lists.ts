import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-marketing-lists',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './marketing-lists.html',
  styleUrl: './marketing-lists.css',
})
export class MarketingLists {
    submitted = false;

  isEdit = false;


  page = 1;

  pageSize = 5;

  totalRecords = 0;


  searchText = '';



  marketingLists: any[] = [];




  marketingList: any = {


    marketingListId: 0,

    listName: '',

    listCode: '',

    listType: '',

    targetAudience: '',

    totalMembers: 0,

    createdDate: '',

    owner: '',

    status: '',

    description: '',

    isActive: true


  };






  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef

  ) { }





  ngOnInit(): void {


    this.loadMarketingLists();


  }







  loadMarketingLists() {


    this.spinner.show();




    setTimeout(() => {



      this.marketingLists = [






        {

          marketingListId: 1,

          listName: 'Enterprise Customers',

          listCode: 'ML001',

          listType: 'Customer List',

          targetAudience: 'Existing Customers',

          totalMembers: 250,

          createdDate: '2026-07-01',

          owner: 'Karishma',

          status: 'Active',

          description: 'Premium enterprise customer marketing list.',

          isActive: true

        },







        {

          marketingListId: 2,

          listName: 'New Sales Leads',

          listCode: 'ML002',

          listType: 'Lead List',

          targetAudience: 'New Leads',

          totalMembers: 500,

          createdDate: '2026-07-05',

          owner: 'Rahul',

          status: 'Active',

          description: 'Fresh leads collected from sales campaigns.',

          isActive: true

        },







        {

          marketingListId: 3,

          listName: 'Product Campaign Contacts',

          listCode: 'ML003',

          listType: 'Contact List',

          targetAudience: 'All Contacts',

          totalMembers: 350,

          createdDate: '2026-07-10',

          owner: 'Sneha',

          status: 'Draft',

          description: 'Contacts prepared for upcoming product campaign.',

          isActive: true

        },
                {


          marketingListId: 4,


          listName: 'Partner Network',


          listCode: 'ML004',


          listType: 'Campaign List',


          targetAudience: 'Business Partners',


          totalMembers: 120,


          createdDate: '2026-07-15',


          owner: 'Arun',


          status: 'Active',


          description: 'Business partner communication and campaign list.',


          isActive: true


        },








        {


          marketingListId: 5,


          listName: 'Old Prospects',


          listCode: 'ML005',


          listType: 'Prospect List',


          targetAudience: 'Potential Customers',


          totalMembers: 200,


          createdDate: '2026-07-20',


          owner: 'Durga',


          status: 'Archived',


          description: 'Previous prospects list maintained for future reference.',


          isActive: false


        }





      ];







      this.marketingLists.sort(


        (a, b) => b.marketingListId - a.marketingListId


      );







      this.totalRecords = this.marketingLists.length;







      this.spinner.hide();







      this.cd.detectChanges();






    }, 500);





  }
    saveMarketingList() {


    this.submitted = true;



    if (


      !this.marketingList.listName ||


      !this.marketingList.listCode ||


      !this.marketingList.listType ||


      !this.marketingList.targetAudience ||


      !this.marketingList.status


    ) {


      return;


    }






    this.spinner.show();





    setTimeout(() => {





      if (!this.isEdit) {





        const newMarketingList = {




          ...this.marketingList,




          marketingListId: this.marketingLists.length



            ? Math.max(...this.marketingLists.map(x => x.marketingListId)) + 1



            : 1





        };





        this.marketingLists.unshift(newMarketingList);






      }

      else {





        const index = this.marketingLists.findIndex(



          x => x.marketingListId === this.marketingList.marketingListId



        );






        if (index !== -1) {




          this.marketingLists[index] = {




            ...this.marketingList




          };





        }





      }







      this.marketingLists = [...this.marketingLists];






      this.totalRecords = this.marketingLists.length;






      this.page = 1;






      const isUpdate = this.isEdit;






      this.clear();






      this.spinner.hide();






      this.cd.detectChanges();







      this.alert.success(




        isUpdate



          ? 'Marketing List updated successfully.'



          : 'Marketing List created successfully.'





      );






    }, 500);




  }









  edit(id: number) {




    this.spinner.show();






    setTimeout(() => {






      const selected = this.marketingLists.find(



        x => x.marketingListId === id



      );






      if (selected) {





        this.marketingList = {




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






          this.marketingLists = this.marketingLists.filter(



            x => x.marketingListId !== id



          );







          this.totalRecords = this.marketingLists.length;







          if (



            this.page > 1 &&



            this.pagedMarketingLists.length === 0



          ) {



            this.page--;



          }







          this.marketingLists = [...this.marketingLists];







          this.spinner.hide();







          this.cd.detectChanges();







          this.alert.success(



            'Marketing List deleted successfully.'



          );







        }, 500);






      }






    });





  }









  clear() {




    this.marketingList = {




      marketingListId: 0,



      listName: '',



      listCode: '',



      listType: '',



      targetAudience: '',



      totalMembers: 0,



      createdDate: '',



      owner: '',



      status: '',



      description: '',



      isActive: true





    };






    this.isEdit = false;






    this.submitted = false;






    this.cd.detectChanges();






  }









  get filteredMarketingLists() {




    return this.marketingLists.filter(x =>






      x.listName



        .toLowerCase()



        .includes(this.searchText.toLowerCase())






      ||






      x.listCode



        .toLowerCase()



        .includes(this.searchText.toLowerCase())






      ||






      x.listType



        .toLowerCase()



        .includes(this.searchText.toLowerCase())






      ||






      x.targetAudience



        .toLowerCase()



        .includes(this.searchText.toLowerCase())






      ||






      x.owner



        .toLowerCase()



        .includes(this.searchText.toLowerCase())






      ||






      x.status



        .toLowerCase()



        .includes(this.searchText.toLowerCase())





    );




  }









  get pagedMarketingLists() {




    const start = (this.page - 1) * this.pageSize;






    return this.filteredMarketingLists.slice(




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
