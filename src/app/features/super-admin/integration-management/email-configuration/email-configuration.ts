import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { Alertservice } from '../../../../core/services/alertservice';

interface EmailProvider {

  id: number;

  provider: string;

  email: string;

  host: string;

  port: number;

  username: string;

  password: string;

  ssl: boolean;

  status: string;

  isDefault: boolean;

}

@Component({
  selector: 'app-email-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './email-configuration.html',
  styleUrl: './email-configuration.css',
})
export class EmailConfiguration {
  searchText = '';

  statusFilter = '';

  showModal = false;

  isEdit = false;

  editingIndex: number | null = null;
  constructor(
    private spinner: Spinnerservice,
    private alert: Alertservice,
    private cd: ChangeDetectorRef
  ) { }

  emailConfigurations: EmailProvider[] = [

    {

      id: 1,

      provider: 'Gmail SMTP',

      email: 'admin@gmail.com',

      host: 'smtp.gmail.com',

      port: 587,

      username: 'admin@gmail.com',

      password: '123',

      ssl: true,

      status: 'Connected',

      isDefault: true

    },

    {

      id: 2,

      provider: 'Outlook',

      email: 'support@outlook.com',

      host: 'smtp.office365.com',

      port: 587,

      username: 'support',

      password: '123',

      ssl: true,

      status: 'Disconnected',

      isDefault: false

    }

  ];

  model: EmailProvider = {

    id: 0,

    provider: '',

    email: '',

    host: '',

    port: 587,

    username: '',

    password: '',

    ssl: true,

    status: 'Connected',

    isDefault: false

  };

  get connectedCount() {

    return this.emailConfigurations.filter(x => x.status == 'Connected').length;

  }

  get disconnectedCount() {

    return this.emailConfigurations.filter(x => x.status == 'Disconnected').length;

  }

  get defaultProvider() {

    return this.emailConfigurations.find(x => x.isDefault)?.provider || '-';

  }

  get filteredProviders() {

    return this.emailConfigurations.filter(x => {

      const matchSearch =

        x.provider.toLowerCase().includes(this.searchText.toLowerCase()) ||

        x.email.toLowerCase().includes(this.searchText.toLowerCase());

      const matchStatus =

        !this.statusFilter ||

        x.status == this.statusFilter;

      return matchSearch && matchStatus;

    });

  }

  refresh() {

    this.spinner.show();

    setTimeout(() => {

      this.spinner.hide();

      this.alert.success("Email configurations refreshed successfully.");

    }, 700);
  }

  clearFilters() {

    this.searchText = '';

    this.statusFilter = '';

  }

  openAddModal() {

    this.model = {
      id: 0,
      provider: '',
      email: '',
      host: '',
      port: 587,
      username: '',
      password: '',
      ssl: true,
      isDefault: false,
      status: 'Connected'
    };

    this.isEdit = false;

    this.showModal = true;

  }

  edit(item: any) {

    this.spinner.show();

    setTimeout(() => {

      this.spinner.hide();

      this.model = { ...item };

      this.editingIndex =
        this.emailConfigurations.indexOf(item);

      this.isEdit = true;

      this.showModal = true;

    }, 500);

  }

  closeModal() {

    this.showModal = false;

    this.isEdit = false;

    this.editingIndex = null;

  }

  cancel() {

    this.closeModal();

  }

  saveConfiguration() {

    if (!this.model.provider) {

      this.alert.warning("Provider Name is required.");

      return;

    }


    if (!this.model.host) {

      this.alert.warning("SMTP Host is required.");

      return;

    }


    if (!this.model.email) {

      this.alert.warning("Email is required.");

      return;

    }



    this.spinner.show();


    setTimeout(() => {


      if (!this.isEdit) {


        this.emailConfigurations.unshift({

          ...this.model,

          id: Date.now()

        });


      }

      else {


        this.emailConfigurations[this.editingIndex!] = {

          ...this.model

        };


      }



      this.spinner.hide();



      // Close modal first
      this.closeModal();



      // Force UI refresh
      this.cd.detectChanges();



      // Show success message after modal closed

      setTimeout(() => {


        this.alert.success(

          this.isEdit

            ? "Email configuration updated successfully."

            : "Email configuration added successfully."

        );


      }, 200);



    }, 700);


  }
  delete(id: number) {


    this.alert.deleteConfirm()

      .then(result => {


        if (result.isConfirmed) {


          this.spinner.show();



          setTimeout(() => {


            this.emailConfigurations =

              this.emailConfigurations.filter(

                x => x.id !== id

              );



            this.spinner.hide();



            this.cd.detectChanges();



            this.alert.success(

              "Configuration deleted successfully."

            );



          }, 600);


        }



      });


  }
}
