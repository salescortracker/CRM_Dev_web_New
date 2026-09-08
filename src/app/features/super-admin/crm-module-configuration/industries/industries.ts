import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';

@Component({
  selector: 'app-industries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './industries.html',
  styleUrl: './industries.css',
})
export class Industries {
  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef

  ) { }







  // =================================
  // Modal Controls
  // =================================


  showModal = false;


  isEdit = false;


  editId = 0;







  // =================================
  // Search Filter
  // =================================


  searchText = '';

  statusFilter = '';







  // =================================
  // Static Industry Data
  // =================================


  industries: any[] = [



    {

      id: 1,

      industryName: 'Information Technology',

      industryCode: 'IT',

      category: 'Technology',

      customerCount: 150,

      priority: 'High',

      description: 'Software development and IT service companies',

      status: 'Active',

      isDefault: true

    },





    {

      id: 2,

      industryName: 'Healthcare',

      industryCode: 'HEALTH',

      category: 'Healthcare',

      customerCount: 85,

      priority: 'High',

      description: 'Hospitals, clinics and healthcare organizations',

      status: 'Active',

      isDefault: false

    },





    {

      id: 3,

      industryName: 'Banking & Finance',

      industryCode: 'BFSI',

      category: 'Finance',

      customerCount: 120,

      priority: 'Medium',

      description: 'Banks, insurance and financial institutions',

      status: 'Active',

      isDefault: false

    },





    {

      id: 4,

      industryName: 'Manufacturing',

      industryCode: 'MFG',

      category: 'Manufacturing',

      customerCount: 70,

      priority: 'Medium',

      description: 'Industrial and manufacturing businesses',

      status: 'Active',

      isDefault: false

    },





    {

      id: 5,

      industryName: 'Education',

      industryCode: 'EDU',

      category: 'Education',

      customerCount: 45,

      priority: 'Low',

      description: 'Schools, colleges and educational institutes',

      status: 'Inactive',

      isDefault: false

    }



  ];









  // =================================
  // Form Model
  // =================================


  model: any = this.emptyModel();






  emptyModel() {



    return {



      id: 0,


      industryName: '',


      industryCode: '',


      category: 'Technology',


      customerCount: 0,


      priority: 'Medium',


      description: '',


      status: 'Active',


      isDefault: false



    };


  }









  // =================================
  // Statistics
  // =================================


  get activeCount() {


    return this.industries.filter(

      x => x.status === 'Active'

    ).length;


  }







  get inactiveCount() {


    return this.industries.filter(

      x => x.status === 'Inactive'

    ).length;


  }







  get defaultIndustry() {


    const item = this.industries.find(

      x => x.isDefault

    );


    return item ? item.industryName : '-';


  }









  // =================================
  // Filter Industries
  // =================================


  get filteredIndustries() {



    return this.industries.filter(item => {





      const search =





        item.industryName

          .toLowerCase()

          .includes(

            this.searchText.toLowerCase()

          )





        ||





        item.industryCode

          .toLowerCase()

          .includes(

            this.searchText.toLowerCase()

          )





        ||





        item.category

          .toLowerCase()

          .includes(

            this.searchText.toLowerCase()

          );









      const status =





        this.statusFilter === ''

        ||

        item.status === this.statusFilter;







      return search && status;



    });



  }









  // =================================
  // Refresh
  // =================================


  refresh() {



    this.spinner.show();



    setTimeout(() => {



      this.spinner.hide();



      this.alert.success(

        'Industries refreshed successfully.'

      );



    }, 500);



  }









  // =================================
  // Add Modal
  // =================================


  openAddModal() {



    this.isEdit = false;


    this.editId = 0;


    this.model = this.emptyModel();


    this.showModal = true;



  }









  // =================================
  // Close Modal
  // =================================


  closeModal() {



    this.showModal = false;


    this.model = this.emptyModel();


    this.isEdit = false;


    this.editId = 0;



  }









  // =================================
  // Save / Update Industry
  // =================================


  saveIndustry() {





    if (!this.model.industryName.trim()) {



      this.alert.warning(

        'Industry Name is required.'

      );


      return;


    }







    if (!this.model.industryCode.trim()) {



      this.alert.warning(

        'Industry Code is required.'

      );


      return;


    }







    this.spinner.show();






    setTimeout(() => {






      if (this.isEdit) {






        const index = this.industries.findIndex(

          x => x.id === this.editId

        );







        if (index !== -1) {





          this.industries[index] = {



            ...this.model,


            id: this.editId



          };





        }







        this.alert.success(

          'Industry updated successfully.'

        );






      }

      else {






        this.model.id = new Date().getTime();






        this.industries.unshift({



          ...this.model



        });







        this.alert.success(

          'Industry created successfully.'

        );





      }







      this.spinner.hide();





      // Close modal after save/update

      this.closeModal();





      // Refresh UI

      this.cd.detectChanges();







    }, 500);





  }









  // =================================
  // Edit Industry
  // =================================


  edit(item: any) {



    this.isEdit = true;


    this.editId = item.id;




    this.model = {



      ...item



    };





    this.showModal = true;



  }









  // =================================
  // Delete Industry
  // =================================


  delete(id: number) {



    this.alert.deleteConfirm()

      .then(result => {





        if (result.isConfirmed) {





          this.spinner.show();






          setTimeout(() => {





            this.industries = this.industries.filter(



              x => x.id !== id



            );






            this.spinner.hide();






            this.alert.success(

              'Industry deleted successfully.'

            );






            this.cd.detectChanges();







          }, 500);





        }





      });



  }









  // =================================
  // Clear Filter
  // =================================


  clearFilters() {



    this.searchText = '';


    this.statusFilter = '';



  }
}
