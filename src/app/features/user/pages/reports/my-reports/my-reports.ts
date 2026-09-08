import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-my-reports',
  standalone:true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './my-reports.html',
  styleUrl: './my-reports.css',
})
export class MyReports {
   submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;

  searchText = '';
  selectedModule = '';
  selectedStatus = '';

  reports: any[] = [];

  report: any = {

    reportId: 0,
    reportName: '',
    reportType: '',
    module: '',
    fromDate: '',
    toDate: '',
    format: 'PDF',
    chartType: 'Bar',
    generatedBy: '',
    generatedDate: '',
    status: 'Generated',
    description: '',
    isFavorite: false

  };

  constructor(

    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef

  ) { }

  ngOnInit(): void {

    this.loadReports();

  }

  loadReports() {

    this.spinner.show();

    setTimeout(() => {

      this.reports = [

        {

          reportId: 1,
          reportName: 'Monthly Sales Report',
          reportType: 'Sales Report',
          module: 'Sales',
          fromDate: '2026-08-01',
          toDate: '2026-08-31',
          format: 'PDF',
          chartType: 'Bar',
          generatedBy: 'Karishma',
          generatedDate: '2026-09-01',
          status: 'Generated',
          description: 'Monthly sales summary.',
          isFavorite: true

        },

        {

          reportId: 2,
          reportName: 'Marketing Performance',
          reportType: 'Activity Report',
          module: 'Marketing',
          fromDate: '2026-08-01',
          toDate: '2026-08-31',
          format: 'Excel',
          chartType: 'Pie',
          generatedBy: 'Rahul',
          generatedDate: '2026-09-02',
          status: 'Generated',
          description: 'Campaign performance analysis.',
          isFavorite: false

        },

        {

          reportId: 3,
          reportName: 'Customer Growth',
          reportType: 'Customer Report',
          module: 'Customer Service',
          fromDate: '2026-08-01',
          toDate: '2026-08-31',
          format: 'CSV',
          chartType: 'Line',
          generatedBy: 'Priya',
          generatedDate: '2026-09-03',
          status: 'Pending',
          description: 'New customer registrations.',
          isFavorite: true

        },

        {

          reportId: 4,
          reportName: 'Project Status',
          reportType: 'Activity Report',
          module: 'Projects',
          fromDate: '2026-08-01',
          toDate: '2026-08-31',
          format: 'PDF',
          chartType: 'Area',
          generatedBy: 'Anil',
          generatedDate: '2026-09-04',
          status: 'Generated',
          description: 'Project progress report.',
          isFavorite: false

        },

        {

          reportId: 5,
          reportName: 'Documents Summary',
          reportType: 'Activity Report',
          module: 'Documents',
          fromDate: '2026-08-01',
          toDate: '2026-08-31',
          format: 'Excel',
          chartType: 'Bar',
          generatedBy: 'Sandeep',
          generatedDate: '2026-09-05',
          status: 'Failed',
          description: 'Documents upload summary.',
          isFavorite: false

        }

      ];

      this.reports.sort((a, b) => b.reportId - a.reportId);

      this.totalRecords = this.reports.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }

  saveReport() {

    this.submitted = true;

    if (

      !this.report.reportName ||
      !this.report.reportType ||
      !this.report.module

    ) {

      return;

    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const nextId = this.reports.length

          ? Math.max(...this.reports.map(x => x.reportId)) + 1

          : 1;

        this.reports.unshift({

          ...this.report,

          reportId: nextId

        });

      }

      else {

        const index = this.reports.findIndex(

          x => x.reportId === this.report.reportId

        );

        if (index !== -1) {

          this.reports[index] = {

            ...this.report

          };

        }

      }

      this.reports = [...this.reports];

      this.totalRecords = this.reports.length;

      this.page = 1;

      const message = this.isEdit

        ? 'Report updated successfully.'

        : 'Report generated successfully.';

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(message);

    }, 500);

  }
    edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.reports.find(
        x => x.reportId === id
      );

      if (selected) {

        this.report = {
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

          this.reports = this.reports.filter(
            x => x.reportId !== id
          );

          this.totalRecords = this.reports.length;

          if (
            this.page > 1 &&
            this.pagedReports.length === 0
          ) {

            this.page--;

          }

          this.reports = [...this.reports];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Report deleted successfully.'
          );

        }, 500);

      }

    });

  }

  preview(item: any) {

    this.alert.info(

      'Preview',

      'Opening "' + item.reportName + '" report.'

    );

  }

  download(item: any) {

    this.alert.success(

      'Download',

      '"' + item.reportName + '" download started.'

    );

  }

  share(item: any) {

    this.alert.success(

      'Share',

      '"' + item.reportName + '" shared successfully.'

    );

  }

  resetFilters() {

    this.searchText = '';

    this.selectedModule = '';

    this.selectedStatus = '';

    this.page = 1;

  }

  clear() {

    this.report = {

      reportId: 0,
      reportName: '',
      reportType: '',
      module: '',
      fromDate: '',
      toDate: '',
      format: 'PDF',
      chartType: 'Bar',
      generatedBy: '',
      generatedDate: '',
      status: 'Generated',
      description: '',
      isFavorite: false

    };

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredReports() {

    return this.reports.filter(x =>

      (

        this.searchText === '' ||

        x.reportName.toLowerCase().includes(this.searchText.toLowerCase()) ||

        x.reportType.toLowerCase().includes(this.searchText.toLowerCase()) ||

        x.description.toLowerCase().includes(this.searchText.toLowerCase()) ||

        x.generatedBy.toLowerCase().includes(this.searchText.toLowerCase())

      )

      &&

      (

        this.selectedModule === '' ||

        x.module === this.selectedModule

      )

      &&

      (

        this.selectedStatus === '' ||

        x.status === this.selectedStatus

      )

    );

  }

  get pagedReports() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredReports.slice(

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
