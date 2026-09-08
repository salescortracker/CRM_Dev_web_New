import { ChangeDetectorRef, Component } from '@angular/core';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lead-settings',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './lead-settings.html',
  styleUrl: './lead-settings.css',
})
export class LeadSettings {
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
  // Static Lead Settings Data
  // ==============================


  leadSettings:any[] = [



    {


      id:1,


      settingName:'Default Lead Management',


      defaultStatus:'New',


      priority:'High',


      assignmentRule:'Round Robin',


      followUpDays:3,


      autoAssignment:true,


      emailNotification:true,


      status:'Active',


      isDefault:true



    },





    {


      id:2,


      settingName:'Enterprise Lead Process',


      defaultStatus:'Qualified',


      priority:'Critical',


      assignmentRule:'Territory Based',


      followUpDays:7,


      autoAssignment:true,


      emailNotification:true,


      status:'Active',


      isDefault:false



    },





    {


      id:3,


      settingName:'Manual Sales Leads',


      defaultStatus:'Contacted',


      priority:'Medium',


      assignmentRule:'Manual Assignment',


      followUpDays:5,


      autoAssignment:false,


      emailNotification:false,


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


      settingName:'',


      defaultStatus:'New',


      priority:'Medium',


      assignmentRule:'Round Robin',


      followUpDays:3,


      autoAssignment:true,


      emailNotification:true,


      status:'Active',


      isDefault:false



    };



  }









  // ==============================
  // Statistics
  // ==============================


  get activeCount(){


    return this.leadSettings.filter(

      x=>x.status==='Active'

    ).length;



  }








  get inactiveCount(){


    return this.leadSettings.filter(

      x=>x.status==='Inactive'

    ).length;



  }








  get defaultSetting(){


    const item=this.leadSettings.find(

      x=>x.isDefault

    );



    return item ? item.settingName : '-';



  }









  // ==============================
  // Filter
  // ==============================


  get filteredLeadSettings(){



    return this.leadSettings.filter(item=>{



      const search =



      item.settingName

      .toLowerCase()

      .includes(this.searchText.toLowerCase())



      ||



      item.defaultStatus

      .toLowerCase()

      .includes(this.searchText.toLowerCase())



      ||



      item.assignmentRule

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

        'Lead settings refreshed successfully.'

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


  saveLeadSetting(){



    if(!this.model.settingName.trim()){



      this.alert.warning(

        'Setting Name is required.'

      );


      return;


    }






    this.spinner.show();






    setTimeout(()=>{





      if(this.isEdit){



        const index=this.leadSettings.findIndex(

          x=>x.id===this.editId

        );





        if(index!==-1){



          this.leadSettings[index]={


            ...this.model,


            id:this.editId


          };



        }




        this.alert.success(

          'Lead setting updated successfully.'

        );





      }

      else{



        this.model.id=new Date().getTime();




        this.leadSettings.unshift({



          ...this.model



        });





        this.alert.success(

          'Lead setting created successfully.'

        );



      }






      this.spinner.hide();





      // Close modal

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





          this.leadSettings = this.leadSettings.filter(

            x=>x.id!==id

          );






          this.spinner.hide();






          this.alert.success(

            'Lead setting deleted successfully.'

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
