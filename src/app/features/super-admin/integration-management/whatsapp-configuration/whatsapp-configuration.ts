import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';

@Component({
  selector: 'app-whatsapp-configuration',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './whatsapp-configuration.html',
  styleUrl: './whatsapp-configuration.css',
})
export class WhatsappConfiguration {
   constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice, private cd: ChangeDetectorRef
  ) {}

  searchText = '';
  statusFilter = '';

  showModal = false;
  isEdit = false;

  editId = 0;

  whatsappConfigurations: any[] = [

    {
      id: 1,
      provider: 'Meta WhatsApp',
      displayName: 'CRM Support',
      phoneNumber: '+91 9876543210',
      businessId: 'META001',
      apiVersion: 'v18.0',
      accessToken: '********',
      webhookUrl: 'https://crm.com/webhook',
      status: 'Connected',
      isDefault: true
    },

    {
      id: 2,
      provider: 'Twilio',
      displayName: 'Sales Team',
      phoneNumber: '+91 9876500000',
      businessId: 'TWL002',
      apiVersion: 'v18.0',
      accessToken: '********',
      webhookUrl: 'https://crm.com/webhook2',
      status: 'Disconnected',
      isDefault: false
    }

  ];

  model:any={
      id:0,
      provider:'',
      displayName:'',
      phoneNumber:'',
      businessId:'',
      apiVersion:'',
      accessToken:'',
      webhookUrl:'',
      status:'Connected',
      isDefault:false
  };

  refresh(){

      this.spinner.show();

      setTimeout(()=>{

          this.spinner.hide();

          this.alert.success("Data Refreshed Successfully");

      },600);

  }

  openAddModal(){

      this.isEdit=false;

      this.model={

        id:0,
        provider:'',
        displayName:'',
        phoneNumber:'',
        businessId:'',
        apiVersion:'',
        accessToken:'',
        webhookUrl:'',
        status:'Connected',
        isDefault:false

      };

      this.showModal=true;

  }

  closeModal(){

     this.showModal = false;

    this.isEdit = false;

    this.editId = 0;

    this.model = {
      id:0,
      provider:'',
      displayName:'',
      phoneNumber:'',
      businessId:'',
      apiVersion:'',
      accessToken:'',
      webhookUrl:'',
      status:'Connected',
      isDefault:false
    };

    this.cd.detectChanges();

  }

  saveConfiguration(){

    if(!this.model.provider){

        this.alert.warning("Provider Name is required");

        return;

    }


    if(!this.model.phoneNumber){

        this.alert.warning("Phone Number is required");

        return;

    }


    this.spinner.show();


    setTimeout(()=>{


        if(this.isEdit){


            const index =
            this.whatsappConfigurations.findIndex(
                x=>x.id == this.editId
            );


            if(index !== -1){

                this.whatsappConfigurations[index] =
                {
                    ...this.model
                };

            }


            this.spinner.hide();


            this.closeModal();


            this.alert.success(
              "WhatsApp Configuration updated successfully."
            );


        }
        else{


            this.model.id = Date.now();


            this.whatsappConfigurations.unshift(
                {
                    ...this.model
                }
            );


            this.spinner.hide();


            this.closeModal();


            this.alert.success(
              "WhatsApp Configuration added successfully."
            );


        }


        this.cd.detectChanges();


    },700);


}

  edit(item:any){

      this.model={...item};

      this.editId=item.id;

      this.isEdit=true;

      this.showModal=true;

  }

 delete(id:number){


    this.alert.deleteConfirm()
    .then(result=>{


        if(result.isConfirmed){


            this.spinner.show();



            setTimeout(()=>{


                this.whatsappConfigurations =
                this.whatsappConfigurations.filter(
                    x=>x.id !== id
                );


                this.spinner.hide();



                this.cd.detectChanges();



                this.alert.success(
                  "WhatsApp Configuration deleted successfully."
                );



            },500);



        }



    });


}

  clearFilters(){

      this.searchText='';

      this.statusFilter='';

  }

  get filteredProviders(){

      return this.whatsappConfigurations.filter(x=>{

          const search=

          x.provider.toLowerCase().includes(this.searchText.toLowerCase()) ||

          x.displayName.toLowerCase().includes(this.searchText.toLowerCase()) ||

          x.phoneNumber.toLowerCase().includes(this.searchText.toLowerCase());

          const status=

          !this.statusFilter ||

          x.status==this.statusFilter;

          return search && status;

      });

  }

  get connectedCount(){

      return this.whatsappConfigurations.filter(x=>x.status=="Connected").length;

  }

  get disconnectedCount(){

      return this.whatsappConfigurations.filter(x=>x.status=="Disconnected").length;

  }

  get defaultProvider(){

      const item=this.whatsappConfigurations.find(x=>x.isDefault);

      return item?item.provider:'-';

  }
}
