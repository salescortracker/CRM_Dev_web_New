import { ChangeDetectorRef, Component } from '@angular/core';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-api-configuration',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './api-configuration.html',
  styleUrl: './api-configuration.css',
})
export class ApiConfiguration {
   constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice, private cd: ChangeDetectorRef
  ) { }

  showModal = false;

  isEdit = false;

  editId = 0;

  searchText = '';

  statusFilter = '';

  apiConfigurations: any[] = [

    {
      id: 1,
      apiName: 'Google Maps API',
      baseUrl: 'https://maps.googleapis.com',
      apiKey: 'GOOGLE_API_KEY',
      apiSecret: 'GOOGLE_SECRET',
      version: 'v3',
      authType: 'API Key',
      timeout: 30,
      rateLimit: 1000,
      ssl: true,
      status: 'Connected',
      isDefault: true
    },

    {
      id: 2,
      apiName: 'Twilio API',
      baseUrl: 'https://api.twilio.com',
      apiKey: 'TWILIO_KEY',
      apiSecret: 'TWILIO_SECRET',
      version: 'v1',
      authType: 'Bearer Token',
      timeout: 60,
      rateLimit: 500,
      ssl: true,
      status: 'Disconnected',
      isDefault: false
    }

  ];

  model: any = this.emptyModel();

  emptyModel() {

    return {

      id: 0,

      apiName: '',

      baseUrl: '',

      apiKey: '',

      apiSecret: '',

      version: 'v1',

      authType: 'API Key',

      timeout: 30,

      rateLimit: 1000,

      ssl: true,

      status: 'Connected',

      isDefault: false

    };

  }

  get connectedCount() {

    return this.apiConfigurations.filter(x => x.status == 'Connected').length;

  }

  get disconnectedCount() {

    return this.apiConfigurations.filter(x => x.status == 'Disconnected').length;

  }

  get defaultApi() {

    const item = this.apiConfigurations.find(x => x.isDefault);

    return item ? item.apiName : '-';

  }

  get filteredProviders() {

    return this.apiConfigurations.filter(x => {

      const search =

        x.apiName.toLowerCase().includes(this.searchText.toLowerCase()) ||

        x.baseUrl.toLowerCase().includes(this.searchText.toLowerCase()) ||

        x.authType.toLowerCase().includes(this.searchText.toLowerCase());

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

      this.alert.success('API configurations refreshed successfully.');

    }, 500);

  }

  openAddModal() {

    this.isEdit = false;

    this.editId = 0;

    this.model = this.emptyModel();

    this.showModal = true;

  }

  closeModal() {

    this.showModal = false;

    this.model = this.emptyModel();

    this.isEdit = false;

    this.editId = 0;

    this.cd.detectChanges();
  }

  saveConfiguration() {

    if (!this.model.apiName.trim()) {

      this.alert.warning('API Name is required.');

      return;

    }

    if (!this.model.baseUrl.trim()) {

      this.alert.warning('Base URL is required.');

      return;

    }

    this.spinner.show();

    setTimeout(() => {

      // Only one Default API
      if (this.model.isDefault) {
        this.apiConfigurations.forEach(x => x.isDefault = false);
      }

      if (this.isEdit) {

        const index = this.apiConfigurations.findIndex(
          x => x.id === this.editId
        );

        if (index !== -1) {

          this.apiConfigurations[index] = {
            ...this.model,
            id: this.editId
          };

        }

        this.alert.success('API Configuration updated successfully.');

      }
      else {

        this.model.id = Date.now();

        this.apiConfigurations.unshift({
          ...this.model
        });

        this.alert.success('API Configuration created successfully.');

      }

      this.spinner.hide();

      // Close Modal
      this.showModal = false;

      // Reset Form
      this.model = this.emptyModel();

      this.isEdit = false;
      this.editId = 0;

      // Refresh UI
      this.cd.detectChanges();

    }, 500);

  }

  edit(item: any) {

    this.isEdit = true;

    this.editId = item.id;

    this.model = {

      ...item

    };

    this.showModal = true;

  }

  delete(id: number) {

    this.alert.deleteConfirm().then(result => {

      if (result.isConfirmed) {

        this.spinner.show();

        setTimeout(() => {

          this.apiConfigurations =
            this.apiConfigurations.filter(x => x.id !== id);

          this.spinner.hide();

          this.alert.success(
            'API Configuration deleted successfully.'
          );

          // Refresh UI
          this.cd.detectChanges();

        }, 500);

      }

    });

  }

  clearFilters() {

    this.searchText = '';

    this.statusFilter = '';

  }
}
