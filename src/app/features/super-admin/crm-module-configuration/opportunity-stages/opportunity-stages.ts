import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';

@Component({
  selector: 'app-opportunity-stages',
   standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './opportunity-stages.html',
  styleUrl: './opportunity-stages.css',
})
export class OpportunityStages {
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
  // Static Opportunity Stages Data
  // ==============================


  stages:any[] = [



    {

      id:1,

      stageName:'Qualification',

      stageCode:'QUALIFICATION',

      probability:20,

      stageOrder:1,

      forecastCategory:'Pipeline',

      stageType:'Open',

      status:'Active',

      isDefault:true,

      isWonStage:false,

      isLostStage:false

    },





    {

      id:2,

      stageName:'Proposal Sent',

      stageCode:'PROPOSAL_SENT',

      probability:50,

      stageOrder:2,

      forecastCategory:'Best Case',

      stageType:'Open',

      status:'Active',

      isDefault:false,

      isWonStage:false,

      isLostStage:false

    },





    {

      id:3,

      stageName:'Negotiation',

      stageCode:'NEGOTIATION',

      probability:80,

      stageOrder:3,

      forecastCategory:'Commit',

      stageType:'Open',

      status:'Active',

      isDefault:false,

      isWonStage:false,

      isLostStage:false

    },





    {

      id:4,

      stageName:'Closed Won',

      stageCode:'CLOSED_WON',

      probability:100,

      stageOrder:4,

      forecastCategory:'Closed',

      stageType:'Won',

      status:'Active',

      isDefault:false,

      isWonStage:true,

      isLostStage:false

    },





    {

      id:5,

      stageName:'Closed Lost',

      stageCode:'CLOSED_LOST',

      probability:0,

      stageOrder:5,

      forecastCategory:'Omitted',

      stageType:'Lost',

      status:'Active',

      isDefault:false,

      isWonStage:false,

      isLostStage:true

    }



  ];









  // ==============================
  // Form Model
  // ==============================


  model:any = this.emptyModel();





  emptyModel(){


    return {


      id:0,


      stageName:'',


      stageCode:'',


      probability:0,


      stageOrder:1,


      forecastCategory:'Pipeline',


      stageType:'Open',


      status:'Active',


      isDefault:false,


      isWonStage:false,


      isLostStage:false



    };


  }









  // ==============================
  // Statistics
  // ==============================


  get activeCount(){


    return this.stages.filter(

      x=>x.status === 'Active'

    ).length;


  }







  get inactiveCount(){


    return this.stages.filter(

      x=>x.status === 'Inactive'

    ).length;


  }







  get defaultStage(){


    const item=this.stages.find(

      x=>x.isDefault

    );


    return item ? item.stageName : '-';


  }









  // ==============================
  // Filter Stages
  // ==============================


  get filteredStages(){



    return this.stages.filter(item=>{





      const search =



      item.stageName

      .toLowerCase()

      .includes(this.searchText.toLowerCase())



      ||



      item.stageCode

      .toLowerCase()

      .includes(this.searchText.toLowerCase())



      ||



      item.forecastCategory

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

        'Opportunity stages refreshed successfully.'

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
  // Save / Update Stage
  // ==============================


  saveStage(){





    if(!this.model.stageName.trim()){



      this.alert.warning(

        'Stage Name is required.'

      );


      return;


    }






    if(!this.model.stageCode.trim()){



      this.alert.warning(

        'Stage Code is required.'

      );


      return;


    }







    this.spinner.show();






    setTimeout(()=>{





      if(this.isEdit){





        const index=this.stages.findIndex(

          x=>x.id === this.editId

        );






        if(index !== -1){



          this.stages[index]={



            ...this.model,


            id:this.editId



          };



        }






        this.alert.success(

          'Opportunity stage updated successfully.'

        );





      }

      else{





        this.model.id=new Date().getTime();






        this.stages.unshift({



          ...this.model



        });






        this.alert.success(

          'Opportunity stage created successfully.'

        );





      }







      this.spinner.hide();





      // Close modal after save/update

      this.closeModal();





      // Refresh UI

      this.cd.detectChanges();





    },500);





  }









  // ==============================
  // Edit Stage
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
  // Delete Stage
  // ==============================


  delete(id:number){



    this.alert.deleteConfirm()

    .then(result=>{





      if(result.isConfirmed){





        this.spinner.show();






        setTimeout(()=>{





          this.stages=this.stages.filter(



            x=>x.id !== id



          );






          this.spinner.hide();






          this.alert.success(



            'Opportunity stage deleted successfully.'



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
