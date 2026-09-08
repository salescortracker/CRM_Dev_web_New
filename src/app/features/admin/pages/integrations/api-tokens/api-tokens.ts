import { ChangeDetectorRef, Component } from '@angular/core';
import { Common } from '../../../../../core/services/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-api-tokens',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './api-tokens.html',
  styleUrl: './api-tokens.css',
})
export class ApiTokens {
    submitted = false;

  isEdit = false;

  page = 1;

  pageSize = 5;

  totalRecords = 0;

  searchText = '';



  apiTokens: any[] = [];



  apiToken: any = {

    apiTokenId: 0,

    tokenName: '',

    tokenCode: '',

    integrationType: '',

    apiKey: '',

    secretKey: '',

    expiryDate: '',

    accessLevel: '',

    status: '',

    description: '',

    isActive: true

  };



  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef

  ) { }



  ngOnInit(): void {

    this.loadApiTokens();

  }



  loadApiTokens() {

    this.spinner.show();

    setTimeout(() => {

      this.apiTokens = [

        {

          apiTokenId: 1,

          tokenName: 'CRM Production Token',

          tokenCode: 'API001',

          integrationType: 'CRM API',

          apiKey: 'crm_prod_api_key_001',

          secretKey: 'crm_secret_key_001',

          expiryDate: '2027-12-31',

          accessLevel: 'Full Access',

          status: 'Active',

          description: 'Production API token used for CRM integrations.',

          isActive: true

        },

        {

          apiTokenId: 2,

          tokenName: 'HRMS Service Token',

          tokenCode: 'API002',

          integrationType: 'HRMS API',

          apiKey: 'hrms_api_key_002',

          secretKey: 'hrms_secret_key_002',

          expiryDate: '2027-10-15',

          accessLevel: 'Read & Write',

          status: 'Active',

          description: 'API token for HRMS employee synchronization.',

          isActive: true

        },

        {

          apiTokenId: 3,

          tokenName: 'Razorpay Token',

          tokenCode: 'API003',

          integrationType: 'Payment Gateway',

          apiKey: 'payment_api_key_003',

          secretKey: 'payment_secret_key_003',

          expiryDate: '2028-01-20',

          accessLevel: 'Administrator',

          status: 'Active',

          description: 'Payment gateway integration token.',

          isActive: true

        },
                {

          apiTokenId: 4,

          tokenName: 'Twilio SMS Token',

          tokenCode: 'API004',

          integrationType: 'SMS Gateway',

          apiKey: 'sms_api_key_004',

          secretKey: 'sms_secret_key_004',

          expiryDate: '2026-12-31',

          accessLevel: 'Read Only',

          status: 'Expired',

          description: 'SMS Gateway token used for sending OTPs and notifications.',

          isActive: false

        },



        {

          apiTokenId: 5,

          tokenName: 'SendGrid Email Token',

          tokenCode: 'API005',

          integrationType: 'Email Service',

          apiKey: 'email_api_key_005',

          secretKey: 'email_secret_key_005',

          expiryDate: '2027-06-30',

          accessLevel: 'Full Access',

          status: 'Revoked',

          description: 'Email service integration token for transactional emails.',

          isActive: false

        }

      ];



      this.apiTokens.sort(

        (a, b) => b.apiTokenId - a.apiTokenId

      );



      this.totalRecords = this.apiTokens.length;



      this.spinner.hide();



      this.cd.detectChanges();



    }, 500);

  }
    saveApiToken() {

    this.submitted = true;

    if (
      !this.apiToken.tokenName ||
      !this.apiToken.tokenCode ||
      !this.apiToken.integrationType ||
      !this.apiToken.apiKey ||
      !this.apiToken.secretKey ||
      !this.apiToken.accessLevel ||
      !this.apiToken.status
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newApiToken = {

          ...this.apiToken,

          apiTokenId: this.apiTokens.length
            ? Math.max(...this.apiTokens.map(x => x.apiTokenId)) + 1
            : 1

        };

        this.apiTokens.unshift(newApiToken);

      }
      else {

        const index = this.apiTokens.findIndex(
          x => x.apiTokenId === this.apiToken.apiTokenId
        );

        if (index !== -1) {

          this.apiTokens[index] = {
            ...this.apiToken
          };

        }

      }

      this.apiTokens = [...this.apiTokens];

      this.totalRecords = this.apiTokens.length;

      this.page = 1;

      const isUpdate = this.isEdit;

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(
        isUpdate
          ? 'API Token updated successfully.'
          : 'API Token created successfully.'
      );

    }, 500);

  }







  edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.apiTokens.find(
        x => x.apiTokenId === id
      );

      if (selected) {

        this.apiToken = {
          ...selected
        };

        this.isEdit = true;

        this.submitted = false;

        this.cd.detectChanges();

      }

      this.spinner.hide();

    }, 300);

  }







  delete(id: number) {

    this.alert.deleteConfirm().then(result => {

      if (result.isConfirmed) {

        this.spinner.show();

        setTimeout(() => {

          this.apiTokens = this.apiTokens.filter(
            x => x.apiTokenId !== id
          );

          this.totalRecords = this.apiTokens.length;

          if (
            this.page > 1 &&
            this.pagedApiTokens.length === 0
          ) {
            this.page--;
          }

          this.apiTokens = [...this.apiTokens];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'API Token deleted successfully.'
          );

        }, 500);

      }

    });

  }







  clear() {

    this.apiToken = {

      apiTokenId: 0,

      tokenName: '',

      tokenCode: '',

      integrationType: '',

      apiKey: '',

      secretKey: '',

      expiryDate: '',

      accessLevel: '',

      status: '',

      description: '',

      isActive: true

    };

    this.submitted = false;

    this.isEdit = false;

    this.cd.detectChanges();

  }







  get filteredApiTokens() {

    return this.apiTokens.filter(x =>

      x.tokenName.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.tokenCode.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.integrationType.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.accessLevel.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.status.toLowerCase().includes(this.searchText.toLowerCase())

    );

  }







  get pagedApiTokens() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredApiTokens.slice(
      start,
      start + this.pageSize
    );

  }







  changePage(page: number) {

    this.page = page;

  }







  changePageSize(size: number) {

    this.pageSize = size;

    this.page = 1;

  }


}
