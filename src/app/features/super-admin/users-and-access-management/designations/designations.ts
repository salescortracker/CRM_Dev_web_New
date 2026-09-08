import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';

@Component({
  selector: 'app-designations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './designations.html',
  styleUrl: './designations.css',
})
export class Designations {
  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef

  ) { }





  // ==============================
  // Modal Controls
  // ==============================


  showModal = false;

  isEdit = false;

  editId = 0;





  // ==============================
  // Search
  // ==============================


  searchText = '';

  statusFilter = '';






  // ==============================
  // Static Designation Data
  // ==============================


  designations: any[] = [


    {
      id: 1,
      designationName: 'Software Engineer',
      department: 'IT',
      jobLevel: 'Mid Level',
      reportingTo: 'Team Lead',
      employeeCount: 15,
      description: 'Develop and maintain software applications.',
      status: 'Active',
      isDefault: true
    },


    {
      id: 2,
      designationName: 'Senior Developer',
      department: 'IT',
      jobLevel: 'Senior',
      reportingTo: 'Engineering Manager',
      employeeCount: 8,
      description: 'Handle complex development activities.',
      status: 'Active',
      isDefault: false
    },


    {
      id: 3,
      designationName: 'HR Executive',
      department: 'HR',
      jobLevel: 'Junior',
      reportingTo: 'HR Manager',
      employeeCount: 5,
      description: 'Manage employee related activities.',
      status: 'Inactive',
      isDefault: false
    },


    {
      id: 4,
      designationName: 'Sales Manager',
      department: 'Sales',
      jobLevel: 'Manager',
      reportingTo: 'Sales Head',
      employeeCount: 10,
      description: 'Manage sales operations.',
      status: 'Active',
      isDefault: false
    }


  ];







  // ==============================
  // Form Model
  // ==============================


  model: any = this.emptyModel();





  emptyModel() {


    return {


      id: 0,

      designationName: '',

      department: 'IT',

      jobLevel: 'Entry Level',

      reportingTo: 'Manager',

      employeeCount: 0,

      description: '',

      status: 'Active',

      isDefault: false


    };


  }







  // ==============================
  // Statistics
  // ==============================


  get activeCount() {


    return this.designations.filter(

      x => x.status === 'Active'

    ).length;


  }





  get inactiveCount() {


    return this.designations.filter(

      x => x.status === 'Inactive'

    ).length;


  }





  get employeeCount() {


    return this.designations.reduce(

      (sum, item) => sum + item.employeeCount,

      0

    );


  }







  // ==============================
  // Search Filter
  // ==============================


  get filteredDesignations() {


    return this.designations.filter(item => {


      const search =


        item.designationName
          .toLowerCase()
          .includes(this.searchText.toLowerCase())


        ||

        item.department
          .toLowerCase()
          .includes(this.searchText.toLowerCase())


        ||

        item.jobLevel
          .toLowerCase()
          .includes(this.searchText.toLowerCase());





      const status =


        this.statusFilter === ''

        ||

        item.status === this.statusFilter;




      return search && status;



    });



  }









  // ==============================
  // Refresh
  // ==============================


  refresh() {


    this.spinner.show();



    setTimeout(() => {


      this.spinner.hide();


      this.alert.success(

        'Designation data refreshed successfully.'

      );


    }, 500);



  }









  // ==============================
  // Open Add Modal
  // ==============================


  openAddModal() {


    this.isEdit = false;

    this.editId = 0;

    this.model = this.emptyModel();

    this.showModal = true;


  }









  // ==============================
  // Close Modal
  // ==============================


  closeModal() {


    this.showModal = false;

    this.model = this.emptyModel();

    this.isEdit = false;

    this.editId = 0;


  }









  // ==============================
  // Save / Update
  // ==============================


  saveDesignation() {



    if (!this.model.designationName.trim()) {


      this.alert.warning(

        'Designation Name is required.'

      );

      return;


    }




    this.spinner.show();




    setTimeout(() => {





      if (this.isEdit) {



        const index = this.designations.findIndex(

          x => x.id === this.editId

        );




        if (index !== -1) {


          this.designations[index] = {

            ...this.model,

            id: this.editId

          };


        }



        this.alert.success(

          'Designation updated successfully.'

        );



      }

      else {





        this.model.id = new Date().getTime();





        this.designations.unshift({


          ...this.model


        });





        this.alert.success(

          'Designation created successfully.'

        );



      }







      this.spinner.hide();





      // Close Modal


      this.closeModal();





      // Refresh UI


      this.cd.detectChanges();




    }, 500);



  }









  // ==============================
  // Edit
  // ==============================


  edit(item: any) {



    this.isEdit = true;


    this.editId = item.id;



    this.model = {

      ...item

    };



    this.showModal = true;



  }









  // ==============================
  // Delete
  // ==============================


  delete(id: number) {



    this.alert.deleteConfirm()

      .then(result => {



        if (result.isConfirmed) {



          this.spinner.show();




          setTimeout(() => {





            this.designations = this.designations.filter(

              x => x.id !== id

            );






            this.spinner.hide();




            this.alert.success(

              'Designation deleted successfully.'

            );





            this.cd.detectChanges();





          }, 500);



        }



      });



  }









  // ==============================
  // Clear Filters
  // ==============================


  clearFilters() {


    this.searchText = '';

    this.statusFilter = '';


  }
}
