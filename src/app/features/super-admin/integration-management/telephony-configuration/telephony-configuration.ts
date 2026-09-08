import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';

@Component({
  selector: 'app-telephony-configuration',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './telephony-configuration.html',
  styleUrl: './telephony-configuration.css',
})
export class TelephonyConfiguration {
   constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice , private cd: ChangeDetectorRef
  ) { }

  showModal = false;

  isEdit = false;

  editId = 0;

  searchText = '';

  statusFilter = '';

  providers: any[] = [

    {
      id: 1,
      provider: 'Twilio',
      country: 'USA',
      phoneNumber: '+1 9876543210',
      callerId: 'CRM Support',
      apiKey: 'TWILIO_KEY',
      apiSecret: '123456',
      recording: true,
      callForwarding: true,
      status: 'Connected',
      isDefault: true
    },

    {
      id: 2,
      provider: 'Exotel',
      country: 'India',
      phoneNumber: '+91 9876543210',
      callerId: 'CRM Sales',
      apiKey: 'EXOTEL_KEY',
      apiSecret: '654321',
      recording: false,
      callForwarding: true,
      status: 'Disconnected',
      isDefault: false
    }

  ];

  model: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      id: 0,

      provider: '',

      country: 'India',

      phoneNumber: '',

      callerId: '',

      apiKey: '',

      apiSecret: '',

      recording: false,

      callForwarding: false,

      status: 'Connected',

      isDefault: false

    };

  }
  get connectedCount() {

    return this.providers.filter(x => x.status == 'Connected').length;

  }

  get disconnectedCount() {

    return this.providers.filter(x => x.status == 'Disconnected').length;

  }

  get defaultProvider() {

    const item = this.providers.find(x => x.isDefault);

    return item ? item.provider : '-';

  }
  get filteredProviders() {

    return this.providers.filter(x => {

      const search =

        x.provider.toLowerCase().includes(this.searchText.toLowerCase()) ||

        x.country.toLowerCase().includes(this.searchText.toLowerCase()) ||

        x.phoneNumber.toLowerCase().includes(this.searchText.toLowerCase());

      const status =

        this.statusFilter == '' ||

        x.status == this.statusFilter;

      return search && status;

    });

  }
  refresh() {

    this.spinner.show();

    setTimeout(() => {

      this.spinner.hide();

      this.alert.success('Telephony configurations refreshed.');

    }, 500);

  }
  openAddModal() {

    this.isEdit = false;

    this.model = this.getEmptyModel();

    this.showModal = true;

  }
  closeModal() {

    this.showModal = false;

    this.model = this.getEmptyModel();

  }
  saveConfiguration() {

  if (!this.model.provider) {

    this.alert.warning('Provider Name is required.');

    return;

  }


  this.spinner.show();


  setTimeout(() => {


    if (this.isEdit) {


      const index = this.providers.findIndex(
        x => x.id == this.editId
      );


      if(index !== -1){

        this.providers[index] = {

          ...this.model,

          id:this.editId

        };

      }


      this.alert.success(
        'Configuration updated successfully.'
      );


    }

    else {


      this.model.id = Date.now();


      this.providers.unshift({

        ...this.model

      });


      this.alert.success(
        'Configuration created successfully.'
      );


    }


    this.spinner.hide();


    // Close Modal

    this.showModal = false;


    // Reset Form

    this.model = this.getEmptyModel();


    this.isEdit = false;

    this.editId = 0;


    // Force UI Refresh

    this.cd.detectChanges();


  },500);

}
  edit(item: any) {

    this.isEdit = true;

    this.editId = item.id;

    this.model = { ...item };

    this.showModal = true;

  }
delete(id:number){

  this.alert.deleteConfirm()
  .then(result=>{


    if(result.isConfirmed){


      this.spinner.show();


      setTimeout(()=>{


        this.providers =
        this.providers.filter(
          x=>x.id !== id
        );


        this.spinner.hide();


        this.alert.success(
          'Configuration deleted successfully.'
        );


        // Force Table Refresh

        this.cd.detectChanges();


      },500);


    }


  });

}
  clearFilters() {

    this.searchText = '';

    this.statusFilter = '';

  }
}
