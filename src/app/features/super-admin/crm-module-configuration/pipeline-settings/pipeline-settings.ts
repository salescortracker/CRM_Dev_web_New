import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';

@Component({
  selector: 'app-pipeline-settings',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './pipeline-settings.html',
  styleUrl: './pipeline-settings.css',
})
export class PipelineSettings {
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
  // Static Pipeline Data
  // ==============================


  pipelines:any[] = [



    {

      id:1,

      pipelineName:'Enterprise Sales Pipeline',

      pipelineCode:'ENT_SALES',

      pipelineType:'Enterprise',

      description:'Large enterprise customer sales workflow',

      totalStages:7,

      status:'Active',

      isDefault:true

    },





    {

      id:2,

      pipelineName:'SMB Sales Pipeline',

      pipelineCode:'SMB_SALES',

      pipelineType:'Sales',

      description:'Small and medium business sales process',

      totalStages:5,

      status:'Active',

      isDefault:false

    },





    {

      id:3,

      pipelineName:'Partner Channel Pipeline',

      pipelineCode:'PARTNER_PIPE',

      pipelineType:'Partner',

      description:'Partner and channel based opportunities',

      totalStages:4,

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


      pipelineName:'',


      pipelineCode:'',


      pipelineType:'Sales',


      description:'',


      totalStages:5,


      status:'Active',


      isDefault:false



    };


  }









  // ==============================
  // Statistics
  // ==============================


  get activeCount(){


    return this.pipelines.filter(

      x=>x.status==='Active'

    ).length;


  }







  get inactiveCount(){


    return this.pipelines.filter(

      x=>x.status==='Inactive'

    ).length;


  }







  get defaultPipeline(){


    const item=this.pipelines.find(

      x=>x.isDefault

    );


    return item ? item.pipelineName : '-';


  }









  // ==============================
  // Filter Pipelines
  // ==============================


  get filteredPipelines(){



    return this.pipelines.filter(item=>{





      const search =



      item.pipelineName

      .toLowerCase()

      .includes(this.searchText.toLowerCase())



      ||



      item.pipelineType

      .toLowerCase()

      .includes(this.searchText.toLowerCase())



      ||



      item.pipelineCode

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

        'Pipeline settings refreshed successfully.'

      );



    },500);



  }









  // ==============================
  // Add Modal
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



     this.showModal = false;


    this.isEdit = false;


    this.editId = 0;


    this.model = this.emptyModel();



    this.cd.detectChanges();



  }









  // ==============================
  // Save / Update Pipeline
  // ==============================


  savePipeline(){


    if(!this.model.pipelineName.trim()){

        this.alert.warning(
            'Pipeline Name is required.'
        );

        return;
    }



    if(!this.model.pipelineCode.trim()){

        this.alert.warning(
            'Pipeline Code is required.'
        );

        return;
    }



    this.spinner.show();



    setTimeout(()=>{


        if(this.isEdit){


            const index = this.pipelines.findIndex(
                x => x.id === this.editId
            );


            if(index !== -1){


                this.pipelines[index] = {

                    ...this.model,

                    id:this.editId

                };


            }


            this.alert.success(
                'Pipeline updated successfully.'
            );


        }
        else{


            const newPipeline = {

                ...this.model,

                id:new Date().getTime()

            };


            this.pipelines = [

                newPipeline,

                ...this.pipelines

            ];



            this.alert.success(
                'Pipeline created successfully.'
            );


        }




        this.spinner.hide();



        // IMPORTANT FIX
        setTimeout(()=>{


            this.closeModal();


            this.cd.detectChanges();


        },100);



    },500);



}









  // ==============================
  // Edit Pipeline
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
  // Delete Pipeline
  // ==============================


  delete(id:number){


    this.alert.deleteConfirm()

    .then(result=>{


        if(result.isConfirmed){



            this.spinner.show();



            setTimeout(()=>{


                this.pipelines = this.pipelines.filter(

                    x => x.id !== id

                );



                this.spinner.hide();



                this.alert.success(

                    'Pipeline deleted successfully.'

                );



                // IMPORTANT FIX
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
