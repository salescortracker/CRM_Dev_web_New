import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './faqs.html',
  styleUrl: './faqs.css',
})
export class Faqs {
  submitted = false;


  isEdit = false;



  page = 1;


  pageSize = 5;


  totalRecords = 0;



  searchText = '';





  faqs: any[] = [];







  faq: any = {



    faqId: 0,


    faqTitle: '',


    faqCode: '',


    category: '',


    question: '',


    answer: '',


    visibility: '',


    displayOrder: 0,


    createdBy: '',


    status: '',


    isActive: true



  };









  constructor(


    private alert: Alertservice,


    private spinner: Spinnerservice,


    private cd: ChangeDetectorRef


  ) { }









  ngOnInit(): void {



    this.loadFaqs();



  }









  loadFaqs() {



    this.spinner.show();







    setTimeout(() => {







      this.faqs = [







        {



          faqId: 1,


          faqTitle: 'How to create account?',


          faqCode: 'FAQ001',


          category: 'Account',


          question: 'How can I create a new customer account?',


          answer: 'Users can create an account by completing the registration form.',


          visibility: 'Public',


          displayOrder: 1,


          createdBy: 'Karishma',


          status: 'Active',


          isActive: true



        },









        {



          faqId: 2,


          faqTitle: 'Payment methods available',


          faqCode: 'FAQ002',


          category: 'Billing',


          question: 'Which payment methods are supported?',


          answer: 'We support multiple online and offline payment methods.',


          visibility: 'Customer Portal',


          displayOrder: 2,


          createdBy: 'Rahul',


          status: 'Active',


          isActive: true



        },









        {



          faqId: 3,


          faqTitle: 'How to reset password?',


          faqCode: 'FAQ003',


          category: 'Technical',


          question: 'How can users reset their forgotten password?',


          answer: 'Use the forgot password option to reset your password.',


          visibility: 'Public',


          displayOrder: 3,


          createdBy: 'Sneha',


          status: 'Active',


          isActive: true



        },
        {



          faqId: 4,


          faqTitle: 'Product installation guide',


          faqCode: 'FAQ004',


          category: 'Product',


          question: 'How to install and configure the product?',


          answer: 'Follow the installation steps provided in the product setup documentation.',


          visibility: 'Internal',


          displayOrder: 4,


          createdBy: 'Arun',


          status: 'Draft',


          isActive: true



        },









        {



          faqId: 5,


          faqTitle: 'Contact support team',


          faqCode: 'FAQ005',


          category: 'General',


          question: 'How can customers contact support team?',


          answer: 'Customers can raise tickets or contact support through available channels.',


          visibility: 'Public',


          displayOrder: 5,


          createdBy: 'Durga',


          status: 'Archived',


          isActive: false



        }







      ];









      this.faqs.sort(



        (a, b) => b.faqId - a.faqId



      );









      this.totalRecords = this.faqs.length;









      this.spinner.hide();









      this.cd.detectChanges();









    }, 500);







  }
  saveFaq() {


    this.submitted = true;



    if (


      !this.faq.faqTitle ||


      !this.faq.faqCode ||


      !this.faq.category ||


      !this.faq.question ||


      !this.faq.answer ||


      !this.faq.status


    ) {


      return;


    }






    this.spinner.show();






    setTimeout(() => {






      if (!this.isEdit) {





        const newFaq = {




          ...this.faq,




          faqId: this.faqs.length



            ? Math.max(...this.faqs.map(x => x.faqId)) + 1



            : 1





        };





        this.faqs.unshift(newFaq);






      }

      else {





        const index = this.faqs.findIndex(



          x => x.faqId === this.faq.faqId



        );






        if (index !== -1) {





          this.faqs[index] = {



            ...this.faq



          };





        }





      }








      this.faqs = [...this.faqs];







      this.totalRecords = this.faqs.length;







      this.page = 1;








      const isUpdate = this.isEdit;







      this.clear();







      this.spinner.hide();







      this.cd.detectChanges();








      this.alert.success(




        isUpdate



          ? 'FAQ updated successfully.'



          : 'FAQ created successfully.'





      );







    }, 500);





  }









  edit(id: number) {




    this.spinner.show();







    setTimeout(() => {







      const selected = this.faqs.find(



        x => x.faqId === id



      );







      if (selected) {





        this.faq = {



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






          this.faqs = this.faqs.filter(



            x => x.faqId !== id



          );







          this.totalRecords = this.faqs.length;







          if (



            this.page > 1 &&



            this.pagedFaqs.length === 0



          ) {



            this.page--;



          }








          this.faqs = [...this.faqs];







          this.spinner.hide();







          this.cd.detectChanges();







          this.alert.success(



            'FAQ deleted successfully.'



          );







        }, 500);






      }







    });






  }









  clear() {




    this.faq = {




      faqId: 0,


      faqTitle: '',


      faqCode: '',


      category: '',


      question: '',


      answer: '',


      visibility: '',


      displayOrder: 0,


      createdBy: '',


      status: '',


      isActive: true



    };







    this.isEdit = false;







    this.submitted = false;







    this.cd.detectChanges();






  }









  get filteredFaqs() {




    return this.faqs.filter(x =>






      x.faqTitle



        .toLowerCase()



        .includes(this.searchText.toLowerCase())






      ||






      x.faqCode



        .toLowerCase()



        .includes(this.searchText.toLowerCase())






      ||






      x.category



        .toLowerCase()



        .includes(this.searchText.toLowerCase())






      ||






      x.visibility



        .toLowerCase()



        .includes(this.searchText.toLowerCase())






      ||






      x.createdBy



        .toLowerCase()



        .includes(this.searchText.toLowerCase())






      ||






      x.status



        .toLowerCase()



        .includes(this.searchText.toLowerCase())






    );






  }









  get pagedFaqs() {




    const start = (this.page - 1) * this.pageSize;







    return this.filteredFaqs.slice(



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
