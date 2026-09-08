import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { Alertservice } from '../../../../core/services/alertservice';

interface SmsConfigurationModel {

  id: number;
  provider: string;
  senderId: string;
  apiUrl: string;
  route: string;
  apiKey: string;
  apiSecret: string;
  company: string;
  status: string;
  active: boolean;
  isDefault: boolean;

}

@Component({
  selector: 'app-sms-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sms-configuration.html',
  styleUrl: './sms-configuration.css',
})
export class SmsConfiguration {
  constructor(
    private spinner: Spinnerservice,
    private alert: Alertservice,
    private cd: ChangeDetectorRef
  ) { }

  showModal = false;

  isEdit = false;

  editingIndex: number | null = null;

  searchText = '';

  statusFilter = '';

  smsConfigurations: SmsConfigurationModel[] = [

    {
      id: 1,
      provider: 'Twilio',
      senderId: 'CRMAPP',
      apiUrl: 'https://api.twilio.com',
      route: 'Transactional',
      apiKey: 'TWL001',
      apiSecret: '********',
      company: 'CRM Global',
      status: 'Connected',
      active: true,
      isDefault: true
    },

    {
      id: 2,
      provider: 'MSG91',
      senderId: 'CRMIND',
      apiUrl: 'https://api.msg91.com',
      route: 'Promotional',
      apiKey: 'MSG001',
      apiSecret: '********',
      company: 'CRM India',
      status: 'Connected',
      active: true,
      isDefault: false
    },

    {
      id: 3,
      provider: 'TextLocal',
      senderId: 'CRMUK',
      apiUrl: 'https://api.textlocal.in',
      route: 'OTP',
      apiKey: 'TXT001',
      apiSecret: '********',
      company: 'CRM UK',
      status: 'Disconnected',
      active: false,
      isDefault: false
    }

  ];

  model: SmsConfigurationModel = {

    id: 0,
    provider: '',
    senderId: '',
    apiUrl: '',
    route: '',
    apiKey: '',
    apiSecret: '',
    company: '',
    status: 'Connected',
    active: true,
    isDefault: false

  };
  //-----------------------------------------
  // Refresh
  //-----------------------------------------

  refresh() {

    this.spinner.show();

    setTimeout(() => {

      this.spinner.hide();

      this.alert.success("SMS configurations refreshed successfully.");

    }, 700);

  }

  //-----------------------------------------
  // Open Add Popup
  //-----------------------------------------

  openAddModal() {

    this.isEdit = false;

    this.editingIndex = null;

    this.model = {

      id: 0,
      provider: '',
      senderId: '',
      apiUrl: '',
      route: '',
      apiKey: '',
      apiSecret: '',
      company: '',
      status: 'Connected',
      active: true,
      isDefault: false

    };

    this.showModal = true;

  }

  //-----------------------------------------
  // Close Popup
  //-----------------------------------------

  closeModal() {

    this.showModal = false;

    this.isEdit = false;

    this.editingIndex = null;

  }

  //-----------------------------------------
  // Save
  //-----------------------------------------

  saveConfiguration() {

    if (!this.model.provider) {

      this.alert.warning("Provider Name is required.");

      return;

    }


    if (!this.model.senderId) {

      this.alert.warning("Sender ID is required.");

      return;

    }


    if (!this.model.apiUrl) {

      this.alert.warning("API URL is required.");

      return;

    }



    this.spinner.show();



    setTimeout(() => {



      if (this.model.isDefault) {


        this.smsConfigurations.forEach(x => {

          x.isDefault = false;

        });


      }



      let isUpdating = this.isEdit;



      if (!isUpdating) {



        this.smsConfigurations.unshift({

          ...this.model,

          id: Date.now()

        });



      }

      else {



        this.smsConfigurations[this.editingIndex!] = {


          ...this.model,


          id: this.smsConfigurations[this.editingIndex!].id


        };


      }



      this.spinner.hide();



      // Close modal first

      this.closeModal();



      // Refresh Angular UI

      this.cd.detectChanges();



      // Show alert after modal close

      setTimeout(() => {


        this.alert.success(

          isUpdating

            ? "SMS Configuration updated successfully."

            : "SMS Configuration added successfully."

        );


      }, 200);



    }, 700);


  }

  //-----------------------------------------
  // Edit
  //-----------------------------------------

  edit(item: SmsConfigurationModel) {

    this.spinner.show();

    setTimeout(() => {

      this.spinner.hide();

      this.model = { ...item };

      this.editingIndex =
        this.smsConfigurations.indexOf(item);

      this.isEdit = true;

      this.showModal = true;

    }, 500);

  }

  //-----------------------------------------
  // Delete
  //-----------------------------------------

  delete(id: number) {


    this.alert.deleteConfirm()

      .then(result => {


        if (result.isConfirmed) {


          this.spinner.show();



          setTimeout(() => {


            this.smsConfigurations =

              this.smsConfigurations.filter(

                x => x.id !== id

              );



            this.spinner.hide();



            this.cd.detectChanges();



            this.alert.success(

              "SMS Configuration deleted successfully."

            );



          }, 500);



        }



      });


  }

  //-----------------------------------------
  // Clear Filters
  //-----------------------------------------

  clearFilters() {

    this.searchText = '';

    this.statusFilter = '';

  }
  //-----------------------------------------
  // Statistics
  //-----------------------------------------

  get connectedCount() {

    return this.smsConfigurations.filter(x =>
      x.status === 'Connected'
    ).length;

  }

  get disconnectedCount() {

    return this.smsConfigurations.filter(x =>
      x.status === 'Disconnected'
    ).length;

  }

  get defaultProvider() {

    const provider =
      this.smsConfigurations.find(x => x.isDefault);

    return provider ? provider.provider : '-';

  }

  //-----------------------------------------
  // Filtered Grid
  //-----------------------------------------

  get filteredProviders() {

    return this.smsConfigurations.filter(item => {

      const matchesSearch =

        item.provider.toLowerCase().includes(this.searchText.toLowerCase()) ||

        item.senderId.toLowerCase().includes(this.searchText.toLowerCase()) ||

        item.apiUrl.toLowerCase().includes(this.searchText.toLowerCase()) ||

        item.route.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesStatus =

        this.statusFilter == '' ||

        item.status == this.statusFilter;

      return matchesSearch && matchesStatus;

    });

  }
}
