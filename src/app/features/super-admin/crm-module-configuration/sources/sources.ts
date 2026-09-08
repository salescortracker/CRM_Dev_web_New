import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';

@Component({
  selector: 'app-sources',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sources.html',
  styleUrl: './sources.css',
})
export class Sources {
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
  // Search
  // =================================


  searchText = '';

  statusFilter = '';







  // =================================
  // Static Source Data
  // =================================


  sources: any[] = [



    {

      id: 1,

      sourceName: 'Website',

      sourceCode: 'WEB',

      category: 'Digital Marketing',

      conversionRate: 35,

      priority: 'High',

      description: 'Leads generated from company website',

      status: 'Active',

      isDefault: true

    },





    {

      id: 2,

      sourceName: 'Google Ads',

      sourceCode: 'GADS',

      category: 'Digital Marketing',

      conversionRate: 40,

      priority: 'High',

      description: 'Paid search marketing campaigns',

      status: 'Active',

      isDefault: false

    },





    {

      id: 3,

      sourceName: 'Customer Referral',

      sourceCode: 'REF',

      category: 'Referral',

      conversionRate: 60,

      priority: 'Medium',

      description: 'Leads received from existing customers',

      status: 'Active',

      isDefault: false

    },





    {

      id: 4,

      sourceName: 'Social Media',

      sourceCode: 'SOCIAL',

      category: 'Campaign',

      conversionRate: 25,

      priority: 'Medium',

      description: 'Facebook, Instagram and LinkedIn campaigns',

      status: 'Active',

      isDefault: false

    },





    {

      id: 5,

      sourceName: 'Cold Calling',

      sourceCode: 'CALL',

      category: 'Sales',

      conversionRate: 15,

      priority: 'Low',

      description: 'Outbound sales calling leads',

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


      sourceName: '',


      sourceCode: '',


      category: 'Digital Marketing',


      conversionRate: 0,


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


    return this.sources.filter(

      x => x.status === 'Active'

    ).length;


  }







  get inactiveCount() {


    return this.sources.filter(

      x => x.status === 'Inactive'

    ).length;


  }







  get defaultSource() {


    const item = this.sources.find(

      x => x.isDefault

    );


    return item ? item.sourceName : '-';


  }









  // =================================
  // Filter Sources
  // =================================


  get filteredSources() {



    return this.sources.filter(item => {





      const search =





        item.sourceName

          .toLowerCase()

          .includes(

            this.searchText.toLowerCase()

          )





        ||





        item.sourceCode

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

        'Sources refreshed successfully.'

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
  // Save / Update Source
  // =================================


  saveSource() {





    if (!this.model.sourceName.trim()) {



      this.alert.warning(

        'Source Name is required.'

      );


      return;


    }







    if (!this.model.sourceCode.trim()) {



      this.alert.warning(

        'Source Code is required.'

      );


      return;


    }







    this.spinner.show();






    setTimeout(() => {






      if (this.isEdit) {






        const index = this.sources.findIndex(

          x => x.id === this.editId

        );







        if (index !== -1) {





          this.sources[index] = {



            ...this.model,


            id: this.editId



          };





        }







        this.alert.success(

          'Source updated successfully.'

        );






      }

      else {






        this.model.id = new Date().getTime();






        this.sources.unshift({



          ...this.model



        });







        this.alert.success(

          'Source created successfully.'

        );





      }







      this.spinner.hide();





      // Close Modal

      this.closeModal();





      // Refresh UI

      this.cd.detectChanges();







    }, 500);





  }









  // =================================
  // Edit Source
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
  // Delete Source
  // =================================


  delete(id: number) {



    this.alert.deleteConfirm()

      .then(result => {





        if (result.isConfirmed) {





          this.spinner.show();






          setTimeout(() => {





            this.sources = this.sources.filter(



              x => x.id !== id



            );






            this.spinner.hide();






            this.alert.success(

              'Source deleted successfully.'

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
