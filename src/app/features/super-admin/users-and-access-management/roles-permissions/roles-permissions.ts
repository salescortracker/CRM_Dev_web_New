import { ChangeDetectorRef, Component } from '@angular/core';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-roles-permissions',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './roles-permissions.html',
  styleUrl: './roles-permissions.css',
})
export class RolesPermissions {
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
  // Static Roles Data
  // ==============================


  roles:any[] = [


    {

      id:1,

      roleName:'Super Admin',

      accessLevel:'Full Access',

      userCount:2,

      description:'Complete system access with all permissions.',

      permissions:{

        dashboard:true,

        leads:true,

        contacts:true,

        accounts:true,

        opportunities:true,

        activities:true,

        reports:true,

        settings:true,

        userManagement:true

      },

      status:'Active',

      isDefault:true

    },





    {

      id:2,

      roleName:'CRM Manager',

      accessLevel:'Admin Access',

      userCount:5,

      description:'Manage CRM operations and sales activities.',

      permissions:{

        dashboard:true,

        leads:true,

        contacts:true,

        accounts:true,

        opportunities:true,

        activities:true,

        reports:true,

        settings:false,

        userManagement:false

      },

      status:'Active',

      isDefault:false

    },






    {

      id:3,

      roleName:'Sales Executive',

      accessLevel:'Limited Access',

      userCount:20,

      description:'Handle leads, contacts and opportunities.',

      permissions:{

        dashboard:true,

        leads:true,

        contacts:true,

        accounts:false,

        opportunities:true,

        activities:true,

        reports:false,

        settings:false,

        userManagement:false

      },

      status:'Active',

      isDefault:false

    },






    {

      id:4,

      roleName:'Read Only User',

      accessLevel:'Read Only',

      userCount:10,

      description:'View only CRM information.',

      permissions:{

        dashboard:true,

        leads:true,

        contacts:true,

        accounts:true,

        opportunities:false,

        activities:false,

        reports:true,

        settings:false,

        userManagement:false

      },

      status:'Inactive',

      isDefault:false

    }



  ];









  // ==============================
  // Form Model
  // ==============================


  model:any = this.emptyModel();





  emptyModel(){


    return {


      id:0,


      roleName:'',


      accessLevel:'Full Access',


      userCount:0,


      description:'',


      permissions:{


        dashboard:false,


        leads:false,


        contacts:false,


        accounts:false,


        opportunities:false,


        activities:false,


        reports:false,


        settings:false,


        userManagement:false


      },


      status:'Active',


      isDefault:false


    };


  }









  // ==============================
  // Statistics
  // ==============================


  get activeCount(){


    return this.roles.filter(

      x=>x.status==='Active'

    ).length;


  }







  get inactiveCount(){


    return this.roles.filter(

      x=>x.status==='Inactive'

    ).length;


  }







  get assignedUsers(){


    return this.roles.reduce(

      (sum,item)=>sum + item.userCount,

      0

    );


  }









  // ==============================
  // Filter Roles
  // ==============================


  get filteredRoles(){


    return this.roles.filter(item=>{



      const search =


      item.roleName

      .toLowerCase()

      .includes(this.searchText.toLowerCase())



      ||

      item.accessLevel

      .toLowerCase()

      .includes(this.searchText.toLowerCase())



      ||

      item.description

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


  refresh(){


    this.spinner.show();



    setTimeout(()=>{


      this.spinner.hide();



      this.alert.success(

        'Roles data refreshed successfully.'

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


  saveRole(){



    if(!this.model.roleName.trim()){



      this.alert.warning(

        'Role Name is required.'

      );


      return;


    }






    this.spinner.show();





    setTimeout(()=>{





      if(this.isEdit){



        const index = this.roles.findIndex(

          x=>x.id===this.editId

        );





        if(index!==-1){



          this.roles[index]={


            ...this.model,


            id:this.editId


          };



        }





        this.alert.success(

          'Role updated successfully.'

        );




      }

      else{





        this.model.id=new Date().getTime();





        this.roles.unshift({


          ...this.model


        });





        this.alert.success(

          'Role created successfully.'

        );



      }







      this.spinner.hide();





      this.closeModal();





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


      ...item,


      permissions:{


        ...item.permissions


      }


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





          this.roles = this.roles.filter(

            x=>x.id!==id

          );





          this.spinner.hide();





          this.alert.success(

            'Role deleted successfully.'

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
