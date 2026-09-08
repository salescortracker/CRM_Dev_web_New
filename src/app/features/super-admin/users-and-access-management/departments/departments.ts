import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './departments.html',
  styleUrl: './departments.css',
})
export class Departments {
  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) {}



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
  // Static Department Data
  // ==============================

  departments:any[] = [

    {
      id:1,
      departmentName:'Information Technology',
      departmentCode:'IT001',
      departmentHead:'John Smith',
      parentDepartment:'Corporate',
      employeeCount:25,
      description:'Software development and technical operations department.',
      status:'Active',
      isDefault:true,
      allowEmployeeAssignment:true
    },


    {
      id:2,
      departmentName:'Human Resources',
      departmentCode:'HR001',
      departmentHead:'Sarah Williams',
      parentDepartment:'Administration',
      employeeCount:12,
      description:'Employee management and recruitment activities.',
      status:'Active',
      isDefault:false,
      allowEmployeeAssignment:true
    },


    {
      id:3,
      departmentName:'Finance',
      departmentCode:'FIN001',
      departmentHead:'Michael Brown',
      parentDepartment:'Corporate',
      employeeCount:8,
      description:'Finance and accounting operations.',
      status:'Inactive',
      isDefault:false,
      allowEmployeeAssignment:false
    },


    {
      id:4,
      departmentName:'Marketing',
      departmentCode:'MKT001',
      departmentHead:'David Wilson',
      parentDepartment:'Operations',
      employeeCount:15,
      description:'Marketing campaigns and business growth.',
      status:'Active',
      isDefault:false,
      allowEmployeeAssignment:true
    }

  ];




  // ==============================
  // Form Model
  // ==============================

  model:any = this.emptyModel();



  emptyModel(){

    return {

      id:0,

      departmentName:'',

      departmentCode:'',

      departmentHead:'Select Head',

      parentDepartment:'None',

      employeeCount:0,

      description:'',

      status:'Active',

      isDefault:false,

      allowEmployeeAssignment:true

    };

  }




  // ==============================
  // Statistics
  // ==============================


  get activeCount(){

    return this.departments.filter(
      x=>x.status==='Active'
    ).length;

  }



  get inactiveCount(){

    return this.departments.filter(
      x=>x.status==='Inactive'
    ).length;

  }



  get employeeCount(){

    return this.departments.reduce(
      (total,item)=> total + item.employeeCount,
      0
    );

  }





  // ==============================
  // Search Filter
  // ==============================


  get filteredDepartments(){


    return this.departments.filter(item=>{


      const search =


        item.departmentName
        .toLowerCase()
        .includes(
          this.searchText.toLowerCase()
        )


        ||

        item.departmentCode
        .toLowerCase()
        .includes(
          this.searchText.toLowerCase()
        )


        ||

        item.departmentHead
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






  // ==============================
  // Refresh
  // ==============================


  refresh(){


    this.spinner.show();


    setTimeout(()=>{


      this.spinner.hide();


      this.alert.success(
        'Departments refreshed successfully.'
      );


    },500);


  }






  // ==============================
  // Open Add Modal
  // ==============================


  openAddModal(){


    this.isEdit=false;

    this.editId=0;

    this.model=this.emptyModel();

    this.showModal=true;


  }





  // ==============================
  // Close Modal
  // ==============================


  closeModal(){


    this.showModal=false;

    this.model=this.emptyModel();

    this.isEdit=false;

    this.editId=0;


  }






  // ==============================
  // Save / Update
  // ==============================


  saveDepartment(){



    if(!this.model.departmentName.trim()){


      this.alert.warning(
        'Department Name is required.'
      );


      return;

    }




    if(!this.model.departmentCode.trim()){


      this.alert.warning(
        'Department Code is required.'
      );


      return;

    }





    this.spinner.show();



    setTimeout(()=>{





      if(this.isEdit){



        const index=this.departments.findIndex(

          x=>x.id===this.editId

        );



        if(index!==-1){


          this.departments[index]={

            ...this.model,

            id:this.editId

          };


        }




        this.alert.success(
          'Department updated successfully.'
        );



      }

      else{



        this.model.id=new Date().getTime();



        this.departments.unshift({

          ...this.model

        });



        this.alert.success(
          'Department created successfully.'
        );


      }






      this.spinner.hide();



      // Close Modal

      this.closeModal();



      // Refresh UI

      this.cd.detectChanges();




    },500);



  }







  // ==============================
  // Edit
  // ==============================


  edit(item:any){


    this.isEdit=true;

    this.editId=item.id;


    this.model={

      ...item

    };


    this.showModal=true;


  }






  // ==============================
  // Delete
  // ==============================


  delete(id:number){



    this.alert.deleteConfirm()

    .then(result=>{


      if(result.isConfirmed){



        this.spinner.show();



        setTimeout(()=>{



          this.departments=this.departments.filter(

            x=>x.id!==id

          );



          this.spinner.hide();



          this.alert.success(
            'Department deleted successfully.'
          );



          this.cd.detectChanges();



        },500);



      }


    });



  }







  // ==============================
  // Clear Filters
  // ==============================


  clearFilters(){


    this.searchText='';

    this.statusFilter='';


  }
}
