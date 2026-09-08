import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';

@Component({
  selector: 'app-api-usage-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './api-usage-logs.html',
  styleUrl: './api-usage-logs.css',
})
export class ApiUsageLogs {
   submitted = false;

  isEdit = false;

  page = 1;

  pageSize = 5;

  totalRecords = 0;

  searchText = '';



  apiUsageLogs: any[] = [];



  apiUsage: any = {

    apiUsageLogId: 0,

    apiName: '',

    endpointUrl: '',

    httpMethod: '',

    requestBy: '',

    responseStatus: '',

    responseTime: null,

    requestDate: '',

    ipAddress: '',

    description: '',

    isActive: true

  };



  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef

  ) { }



  ngOnInit(): void {

    this.loadApiUsageLogs();

  }



  loadApiUsageLogs() {

    this.spinner.show();

    setTimeout(() => {

      this.apiUsageLogs = [

        {

          apiUsageLogId: 1,

          apiName: 'Login API',

          endpointUrl: '/api/auth/login',

          httpMethod: 'POST',

          requestBy: 'Admin',

          responseStatus: 200,

          responseTime: 120,

          requestDate: '2026-08-06T09:15',

          ipAddress: '192.168.1.10',

          description: 'User login request.',

          isActive: true

        },



        {

          apiUsageLogId: 2,

          apiName: 'Create Lead',

          endpointUrl: '/api/leads/create',

          httpMethod: 'POST',

          requestBy: 'Sales Executive',

          responseStatus: 201,

          responseTime: 185,

          requestDate: '2026-08-06T09:40',

          ipAddress: '192.168.1.21',

          description: 'Lead created successfully.',

          isActive: true

        },



        {

          apiUsageLogId: 3,

          apiName: 'Get Customers',

          endpointUrl: '/api/customers',

          httpMethod: 'GET',

          requestBy: 'Manager',

          responseStatus: 200,

          responseTime: 95,

          requestDate: '2026-08-06T10:05',

          ipAddress: '192.168.1.35',

          description: 'Customer list retrieved successfully.',

          isActive: true

        },
                {

          apiUsageLogId: 4,

          apiName: 'Update Deal',

          endpointUrl: '/api/deals/update',

          httpMethod: 'PUT',

          requestBy: 'Sales Manager',

          responseStatus: 400,

          responseTime: 240,

          requestDate: '2026-08-06T10:30',

          ipAddress: '192.168.1.48',

          description: 'Deal update failed due to invalid request payload.',

          isActive: true

        },



        {

          apiUsageLogId: 5,

          apiName: 'Delete Contact',

          endpointUrl: '/api/contacts/delete',

          httpMethod: 'DELETE',

          requestBy: 'Administrator',

          responseStatus: 500,

          responseTime: 310,

          requestDate: '2026-08-06T11:05',

          ipAddress: '192.168.1.62',

          description: 'Internal server error while deleting contact.',

          isActive: false

        }

      ];



      this.apiUsageLogs.sort(

        (a, b) => b.apiUsageLogId - a.apiUsageLogId

      );



      this.totalRecords = this.apiUsageLogs.length;



      this.spinner.hide();



      this.cd.detectChanges();



    }, 500);

  }
    saveApiUsageLog() {

    this.submitted = true;

    if (
      !this.apiUsage.apiName ||
      !this.apiUsage.endpointUrl ||
      !this.apiUsage.httpMethod ||
      !this.apiUsage.requestBy ||
      !this.apiUsage.responseStatus ||
      !this.apiUsage.responseTime ||
      !this.apiUsage.requestDate
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newLog = {

          ...this.apiUsage,

          apiUsageLogId: this.apiUsageLogs.length
            ? Math.max(...this.apiUsageLogs.map(x => x.apiUsageLogId)) + 1
            : 1

        };

        this.apiUsageLogs.unshift(newLog);

      } else {

        const index = this.apiUsageLogs.findIndex(
          x => x.apiUsageLogId === this.apiUsage.apiUsageLogId
        );

        if (index !== -1) {

          this.apiUsageLogs[index] = {

            ...this.apiUsage

          };

        }

      }

      this.apiUsageLogs = [...this.apiUsageLogs];

      this.totalRecords = this.apiUsageLogs.length;

      this.page = 1;

      const isUpdate = this.isEdit;

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(

        isUpdate
          ? 'API Usage Log updated successfully.'
          : 'API Usage Log created successfully.'

      );

    }, 500);

  }







  edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.apiUsageLogs.find(
        x => x.apiUsageLogId === id
      );

      if (selected) {

        this.apiUsage = {

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

          this.apiUsageLogs = this.apiUsageLogs.filter(
            x => x.apiUsageLogId !== id
          );

          this.totalRecords = this.apiUsageLogs.length;

          if (
            this.page > 1 &&
            this.pagedApiUsageLogs.length === 0
          ) {

            this.page--;

          }

          this.apiUsageLogs = [...this.apiUsageLogs];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'API Usage Log deleted successfully.'
          );

        }, 500);

      }

    });

  }







  clear() {

    this.apiUsage = {

      apiUsageLogId: 0,

      apiName: '',

      endpointUrl: '',

      httpMethod: '',

      requestBy: '',

      responseStatus: '',

      responseTime: null,

      requestDate: '',

      ipAddress: '',

      description: '',

      isActive: true

    };

    this.submitted = false;

    this.isEdit = false;

    this.cd.detectChanges();

  }







  get filteredApiUsageLogs() {

    return this.apiUsageLogs.filter(x =>

      x.apiName.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.endpointUrl.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.httpMethod.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.requestBy.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.responseStatus.toString().includes(this.searchText.toLowerCase())

    );

  }







  get pagedApiUsageLogs() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredApiUsageLogs.slice(

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
