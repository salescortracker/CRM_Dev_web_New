import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';

@Component({
  selector: 'app-activity-types',
    standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './activity-types.html',
  styleUrl: './activity-types.css',
})
export class ActivityTypes {
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
  // Search Filter
  // ==============================


  searchText = '';

  statusFilter = '';







  // ==============================
  // Static Activity Type Data
  // ==============================


  activityTypes:any[] = [



    {

      id:1,

      activityName:'Phone Call',

      activityCode:'CALL',

      category:'Call',

      description:'Customer and sales representative phone communication',

      duration:15,

      reminderRequired:true,

      reminderTime:10,

      status:'Active',

      isDefault:true

    },





    {

      id:2,

      activityName:'Customer Meeting',

      activityCode:'MEETING',

      category:'Meeting',

      description:'Customer discussion and business meeting',

      duration:60,

      reminderRequired:true,

      reminderTime:30,

      status:'Active',

      isDefault:false

    },





    {

      id:3,

      activityName:'Email Follow-up',

      activityCode:'EMAIL',

      category:'Email',

      description:'Follow-up communication through email',

      duration:10,

      reminderRequired:false,

      reminderTime:0,

      status:'Active',

      isDefault:false

    },





    {

      id:4,

      activityName:'Product Demo',

      activityCode:'DEMO',

      category:'Meeting',

      description:'Product demonstration for customer',

      duration:90,

      reminderRequired:true,

      reminderTime:60,

      status:'Active',

      isDefault:false

    },





    {

      id:5,

      activityName:'Task Follow-up',

      activityCode:'TASK',

      category:'Task',

      description:'Internal follow-up task activity',

      duration:30,

      reminderRequired:false,

      reminderTime:0,

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


      activityName:'',


      activityCode:'',


      category:'Call',


      description:'',


      duration:30,


      reminderRequired:false,


      reminderTime:10,


      status:'Active',


      isDefault:false



    };


  }









  // ==============================
  // Statistics
  // ==============================


  get activeCount(){


    return this.activityTypes.filter(

      x => x.status === 'Active'

    ).length;


  }







  get inactiveCount(){


    return this.activityTypes.filter(

      x => x.status === 'Inactive'

    ).length;


  }







  get defaultActivity(){


    const item=this.activityTypes.find(

      x=>x.isDefault

    );


    return item ? item.activityName : '-';


  }









  // ==============================
  // Filter Activity Types
  // ==============================


  get filteredActivityTypes(){



    return this.activityTypes.filter(item=>{





      const search =



      item.activityName

      .toLowerCase()

      .includes(this.searchText.toLowerCase())



      ||



      item.activityCode

      .toLowerCase()

      .includes(this.searchText.toLowerCase())



      ||



      item.category

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

        'Activity types refreshed successfully.'

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
  // Save / Update Activity
  // ==============================


  saveActivityType(){





    if(!this.model.activityName.trim()){



      this.alert.warning(

        'Activity Name is required.'

      );


      return;


    }






    if(!this.model.activityCode.trim()){



      this.alert.warning(

        'Activity Code is required.'

      );


      return;


    }







    this.spinner.show();






    setTimeout(()=>{





      if(this.isEdit){





        const index=this.activityTypes.findIndex(

          x=>x.id === this.editId

        );






        if(index !== -1){



          this.activityTypes[index]={



            ...this.model,


            id:this.editId



          };



        }






        this.alert.success(

          'Activity type updated successfully.'

        );





      }

      else{





        this.model.id=new Date().getTime();






        this.activityTypes.unshift({



          ...this.model



        });






        this.alert.success(

          'Activity type created successfully.'

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
  // Edit Activity
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
  // Delete Activity
  // ==============================


  delete(id:number){



    this.alert.deleteConfirm()

    .then(result=>{





      if(result.isConfirmed){





        this.spinner.show();






        setTimeout(()=>{





          this.activityTypes=this.activityTypes.filter(



            x=>x.id !== id



          );






          this.spinner.hide();






          this.alert.success(



            'Activity type deleted successfully.'



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
