import { ChangeDetectorRef, Component } from '@angular/core';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-webhooks-configuration',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './webhooks-configuration.html',
  styleUrl: './webhooks-configuration.css',
})
export class WebhooksConfiguration {
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
  // Static Webhook Data
  // ==============================


  webhooks: any[] = [


    {

      id: 1,

      webhookName: 'CRM Lead Notification',

      eventName: 'Lead Created',

      endpointUrl: 'https://example.com/api/leads',

      httpMethod: 'POST',

      authType: 'Bearer Token',

      secretKey: 'CRM_SECRET_001',

      retryCount: 3,

      timeout: 30,

      sslVerification: true,

      status: 'Active',

      isDefault: true

    },



    {

      id: 2,

      webhookName: 'Invoice Sync Webhook',

      eventName: 'Invoice Generated',

      endpointUrl: 'https://erp.company.com/webhook/invoice',

      httpMethod: 'POST',

      authType: 'API Key',

      secretKey: 'ERP_SECRET_002',

      retryCount: 5,

      timeout: 60,

      sslVerification: true,

      status: 'Inactive',

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


      webhookName: '',


      eventName: 'Lead Created',


      endpointUrl: '',


      httpMethod: 'POST',


      authType: 'Bearer Token',


      secretKey: '',


      retryCount: 3,


      timeout: 30,


      sslVerification: true,


      status: 'Active',


      isDefault: false


    };


  }









  // ==============================
  // Statistics
  // ==============================


  get activeCount() {


    return this.webhooks.filter(

      x => x.status === 'Active'

    ).length;


  }







  get inactiveCount() {


    return this.webhooks.filter(

      x => x.status === 'Inactive'

    ).length;


  }







  get defaultWebhook() {


    const item = this.webhooks.find(

      x => x.isDefault

    );


    return item ? item.webhookName : '-';


  }










  // ==============================
  // Filter Data
  // ==============================


  get filteredWebhooks() {


    return this.webhooks.filter(item => {



      const search =


        item.webhookName

          .toLowerCase()

          .includes(this.searchText.toLowerCase())



        ||

        item.eventName

          .toLowerCase()

          .includes(this.searchText.toLowerCase())



        ||

        item.endpointUrl

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

        'Webhook configurations refreshed successfully.'

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


  saveWebhook() {


    if (!this.model.webhookName.trim()) {

      this.alert.warning(
        'Webhook Name is required.'
      );

      return;
    }



    if (!this.model.endpointUrl.trim()) {

      this.alert.warning(
        'Endpoint URL is required.'
      );

      return;
    }



    this.spinner.show();



    setTimeout(() => {



      if (this.isEdit) {


        const index = this.webhooks.findIndex(
          x => x.id === this.editId
        );


        if (index !== -1) {


          this.webhooks[index] = {

            ...this.model,

            id: this.editId

          };


        }



      }
      else {


        this.model.id = new Date().getTime();


        this.webhooks.unshift({

          ...this.model

        });


      }



      this.spinner.hide();



      // CLOSE MODAL FIRST

      this.closeModal();



      // Refresh Angular

      this.cd.detectChanges();



      setTimeout(() => {


        if (this.isEdit) {

          this.alert.success(
            'Webhook updated successfully.'
          );

        }
        else {

          this.alert.success(
            'Webhook created successfully.'
          );

        }



      }, 200);



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


            const index = this.webhooks.findIndex(
              x => x.id === id
            );



            if (index !== -1) {

              this.webhooks.splice(index, 1);

            }



            this.spinner.hide();


            this.cd.detectChanges();



            setTimeout(() => {


              this.alert.success(
                'Webhook deleted successfully.'
              );


            }, 200);



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
