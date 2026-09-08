import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-ticket-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './ticket-categories.html',
  styleUrl: './ticket-categories.css',
})
export class TicketCategories {
  submitted = false;


  isEdit = false;



  page = 1;


  pageSize = 5;


  totalRecords = 0;



  searchText = '';





  ticketCategories: any[] = [];






  ticketCategory: any = {



    ticketCategoryId: 0,


    categoryName: '',


    categoryCode: '',


    parentCategory: '',


    categoryType: '',


    priority: '',


    slaHours: 0,


    assignedTeam: '',


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



    this.loadTicketCategories();



  }
  loadTicketCategories() {

    this.spinner.show();
    setTimeout(() => {

      this.ticketCategories = [







        {



          ticketCategoryId: 1,


          categoryName: 'Software Issue',


          categoryCode: 'TC001',


          parentCategory: 'Technical Support',


          categoryType: 'Technical Support',


          priority: 'High',


          slaHours: 24,


          assignedTeam: 'Technical Team',


          status: 'Active',


          description: 'Issues related to software application problems.',


          isActive: true



        },









        {



          ticketCategoryId: 2,


          categoryName: 'Payment Issue',


          categoryCode: 'TC002',


          parentCategory: 'Billing Support',


          categoryType: 'Billing Support',


          priority: 'Medium',


          slaHours: 48,


          assignedTeam: 'Billing Team',


          status: 'Active',


          description: 'Customer payment and invoice related issues.',


          isActive: true



        },









        {



          ticketCategoryId: 3,


          categoryName: 'Product Query',


          categoryCode: 'TC003',


          parentCategory: 'Product Support',


          categoryType: 'Product Support',


          priority: 'Low',


          slaHours: 72,


          assignedTeam: 'Customer Success Team',


          status: 'Active',


          description: 'General product information and queries.',


          isActive: true



        },
        {



          ticketCategoryId: 4,


          categoryName: 'Customer Complaint',


          categoryCode: 'TC004',


          parentCategory: 'Customer Support',


          categoryType: 'Customer Complaint',


          priority: 'Critical',


          slaHours: 12,


          assignedTeam: 'Support Team',


          status: 'Draft',


          description: 'Customer complaints and escalation related tickets.',


          isActive: true



        },









        {



          ticketCategoryId: 5,


          categoryName: 'General Enquiry',


          categoryCode: 'TC005',


          parentCategory: 'Customer Support',


          categoryType: 'General Query',


          priority: 'Low',


          slaHours: 96,


          assignedTeam: 'Sales Team',


          status: 'Archived',


          description: 'General customer questions and information requests.',


          isActive: false



        }







      ];









      this.ticketCategories.sort(



        (a, b) => b.ticketCategoryId - a.ticketCategoryId



      );









      this.totalRecords = this.ticketCategories.length;









      this.spinner.hide();









      this.cd.detectChanges();









    }, 500);







  }
  saveTicketCategory() {


    this.submitted = true;



    if (


      !this.ticketCategory.categoryName ||


      !this.ticketCategory.categoryCode ||


      !this.ticketCategory.categoryType ||


      !this.ticketCategory.status


    ) {


      return;


    }






    this.spinner.show();






    setTimeout(() => {






      if (!this.isEdit) {





        const newCategory = {




          ...this.ticketCategory,




          ticketCategoryId: this.ticketCategories.length



            ? Math.max(...this.ticketCategories.map(x => x.ticketCategoryId)) + 1



            : 1





        };





        this.ticketCategories.unshift(newCategory);






      }

      else {





        const index = this.ticketCategories.findIndex(



          x => x.ticketCategoryId === this.ticketCategory.ticketCategoryId



        );






        if (index !== -1) {





          this.ticketCategories[index] = {




            ...this.ticketCategory




          };





        }





      }








      this.ticketCategories = [...this.ticketCategories];







      this.totalRecords = this.ticketCategories.length;







      this.page = 1;








      const isUpdate = this.isEdit;







      this.clear();







      this.spinner.hide();







      this.cd.detectChanges();








      this.alert.success(




        isUpdate



          ? 'Ticket Category updated successfully.'



          : 'Ticket Category created successfully.'





      );







    }, 500);





  }









  edit(id: number) {




    this.spinner.show();







    setTimeout(() => {







      const selected = this.ticketCategories.find(



        x => x.ticketCategoryId === id



      );







      if (selected) {





        this.ticketCategory = {



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






          this.ticketCategories = this.ticketCategories.filter(



            x => x.ticketCategoryId !== id



          );







          this.totalRecords = this.ticketCategories.length;







          if (



            this.page > 1 &&



            this.pagedTicketCategories.length === 0



          ) {



            this.page--;



          }








          this.ticketCategories = [...this.ticketCategories];







          this.spinner.hide();







          this.cd.detectChanges();







          this.alert.success(



            'Ticket Category deleted successfully.'



          );







        }, 500);






      }







    });






  }









  clear() {




    this.ticketCategory = {




      ticketCategoryId: 0,


      categoryName: '',


      categoryCode: '',


      parentCategory: '',


      categoryType: '',


      priority: '',


      slaHours: 0,


      assignedTeam: '',


      status: '',


      description: '',


      isActive: true



    };







    this.isEdit = false;







    this.submitted = false;







    this.cd.detectChanges();






  }









  get filteredTicketCategories() {




    return this.ticketCategories.filter(x =>






      x.categoryName



        .toLowerCase()



        .includes(this.searchText.toLowerCase())






      ||






      x.categoryCode



        .toLowerCase()



        .includes(this.searchText.toLowerCase())






      ||






      x.categoryType



        .toLowerCase()



        .includes(this.searchText.toLowerCase())






      ||






      x.priority



        .toLowerCase()



        .includes(this.searchText.toLowerCase())






      ||






      x.assignedTeam



        .toLowerCase()



        .includes(this.searchText.toLowerCase())






      ||






      x.status



        .toLowerCase()



        .includes(this.searchText.toLowerCase())






    );






  }









  get pagedTicketCategories() {




    const start = (this.page - 1) * this.pageSize;







    return this.filteredTicketCategories.slice(



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
