import { ChangeDetectorRef, Component } from '@angular/core';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-third-party-integrations',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './third-party-integrations.html',
  styleUrl: './third-party-integrations.css',
})
export class ThirdPartyIntegrations {
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
  // Static Integration Data
  // ==============================


  integrations:any[] = [



    {

      id:1,

      integrationName:'Salesforce CRM',

      provider:'Salesforce',

      category:'CRM',

      apiVersion:'v57',

      baseUrl:'https://api.salesforce.com',

      apiKey:'SF_API_KEY',

      secretKey:'SF_SECRET',

      authType:'OAuth 2.0',

      syncFrequency:'Real Time',

      timeout:30,

      sslEnabled:true,

      status:'Connected',

      isDefault:true

    },




    {

      id:2,

      integrationName:'Stripe Payment Gateway',

      provider:'Stripe',

      category:'Payment',

      apiVersion:'v1',

      baseUrl:'https://api.stripe.com',

      apiKey:'STRIPE_KEY',

      secretKey:'STRIPE_SECRET',

      authType:'Bearer Token',

      syncFrequency:'Every 15 Minutes',

      timeout:60,

      sslEnabled:true,

      status:'Disconnected',

      isDefault:false

    },




    {

      id:3,

      integrationName:'WhatsApp Business API',

      provider:'Meta',

      category:'Communication',

      apiVersion:'v18',

      baseUrl:'https://graph.facebook.com',

      apiKey:'META_KEY',

      secretKey:'META_SECRET',

      authType:'API Key',

      syncFrequency:'Real Time',

      timeout:30,

      sslEnabled:true,

      status:'Connected',

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


      integrationName:'',


      provider:'',


      category:'CRM',


      apiVersion:'v1',


      baseUrl:'',


      apiKey:'',


      secretKey:'',


      authType:'API Key',


      syncFrequency:'Real Time',


      timeout:30,


      sslEnabled:true,


      status:'Connected',


      isDefault:false



    };


  }









  // ==============================
  // Statistics
  // ==============================


  get connectedCount(){


    return this.integrations.filter(

      x=>x.status==='Connected'

    ).length;


  }







  get disconnectedCount(){


    return this.integrations.filter(

      x=>x.status==='Disconnected'

    ).length;


  }







  get defaultIntegration(){


    const item = this.integrations.find(

      x=>x.isDefault

    );


    return item ? item.integrationName : '-';


  }









  // ==============================
  // Search & Filter
  // ==============================


  get filteredIntegrations(){


    return this.integrations.filter(item=>{



      const search =


      item.integrationName

      .toLowerCase()

      .includes(this.searchText.toLowerCase())



      ||

      item.provider

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

        'Third party integrations refreshed successfully.'

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


  saveIntegration(){



    if(!this.model.integrationName.trim()){



      this.alert.warning(

        'Integration Name is required.'

      );


      return;

    }





    if(!this.model.provider.trim()){



      this.alert.warning(

        'Provider Name is required.'

      );


      return;

    }







    this.spinner.show();






    setTimeout(()=>{





      if(this.isEdit){



        const index=this.integrations.findIndex(

          x=>x.id===this.editId

        );





        if(index!==-1){



          this.integrations[index]={


            ...this.model,


            id:this.editId


          };



        }



        this.alert.success(

          'Integration updated successfully.'

        );



      }



      else{



        this.model.id=new Date().getTime();




        this.integrations.unshift({


          ...this.model


        });




        this.alert.success(

          'Integration created successfully.'

        );



      }






      this.spinner.hide();




      // Close modal after save

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



          const index=this.integrations.findIndex(

            x=>x.id===id

          );





          if(index!==-1){


            this.integrations.splice(index,1);


          }





          this.spinner.hide();




          this.cd.detectChanges();





          this.alert.success(

            'Integration deleted successfully.'

          );





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
