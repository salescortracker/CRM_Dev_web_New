import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-team-reports',
  standalone:true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './team-reports.html',
  styleUrl: './team-reports.css',
})
export class TeamReports {
  submitted = false;
  isEdit = false;


  page = 1;
  pageSize = 5;
  totalRecords = 0;


  searchText = '';
  selectedTeam = '';
  selectedStatus = '';


  teamReports: any[] = [];



  teamReport: any = {

    teamReportId: 0,
    reportName: '',
    teamName: '',
    manager: '',
    reportType: '',
    module: '',
    reportPeriod: 'This Month',
    fromDate: '',
    toDate: '',
    totalRecords: 0,
    exportFormat: 'PDF',
    generatedBy: '',
    generatedDate: '',
    status: 'Generated',
    description: '',
    isActive: true

  };



  constructor(

    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef

  ) { }



  ngOnInit(): void {

    this.loadTeamReports();

  }




  loadTeamReports() {


    this.spinner.show();


    setTimeout(() => {



      this.teamReports = [


        {

          teamReportId: 1,

          reportName: 'Sales Team Performance',

          teamName: 'Sales Team',

          manager: 'Rajesh Kumar',

          reportType: 'Performance Report',

          module: 'Sales',

          reportPeriod: 'This Month',

          fromDate: '2026-08-01',

          toDate: '2026-08-31',

          totalRecords: 245,

          exportFormat: 'Excel',

          generatedBy: 'Admin',

          generatedDate: '2026-09-01',

          status: 'Generated',

          description: 'Monthly sales team performance analysis.',

          isActive: true

        },



        {

          teamReportId: 2,

          reportName: 'Marketing Campaign Report',

          teamName: 'Marketing Team',

          manager: 'Priya Sharma',

          reportType: 'Activity Report',

          module: 'Marketing',

          reportPeriod: 'This Quarter',

          fromDate: '2026-07-01',

          toDate: '2026-09-30',

          totalRecords: 180,

          exportFormat: 'PDF',

          generatedBy: 'Manager',

          generatedDate: '2026-09-02',

          status: 'Generated',

          description: 'Marketing campaigns and lead conversion report.',

          isActive: true

        },



        {

          teamReportId: 3,

          reportName: 'Support Team Ticket Report',

          teamName: 'Support Team',

          manager: 'Anil Reddy',

          reportType: 'Performance Report',

          module: 'Customer Service',

          reportPeriod: 'This Month',

          fromDate: '2026-08-01',

          toDate: '2026-08-31',

          totalRecords: 520,

          exportFormat: 'CSV',

          generatedBy: 'Support Manager',

          generatedDate: '2026-09-03',

          status: 'Pending',

          description: 'Customer support ticket resolution report.',

          isActive: true

        },



        {

          teamReportId: 4,

          reportName: 'Development Team Productivity',

          teamName: 'Development Team',

          manager: 'Kiran Kumar',

          reportType: 'Performance Report',

          module: 'Projects',

          reportPeriod: 'This Week',

          fromDate: '2026-08-25',

          toDate: '2026-08-31',

          totalRecords: 95,

          exportFormat: 'Excel',

          generatedBy: 'Project Manager',

          generatedDate: '2026-09-04',

          status: 'Generated',

          description: 'Developer task completion report.',

          isActive: true

        },



        {

          teamReportId: 5,

          reportName: 'QA Testing Summary',

          teamName: 'QA Team',

          manager: 'Sandeep',

          reportType: 'Activity Report',

          module: 'Projects',

          reportPeriod: 'This Month',

          fromDate: '2026-08-01',

          toDate: '2026-08-31',

          totalRecords: 150,

          exportFormat: 'PDF',

          generatedBy: 'QA Lead',

          generatedDate: '2026-09-05',

          status: 'Failed',

          description: 'Testing activities and bug summary.',

          isActive: false

        }


      ];



      this.teamReports.sort(

        (a, b) => b.teamReportId - a.teamReportId

      );



      this.totalRecords = this.teamReports.length;



      this.spinner.hide();


      this.cd.detectChanges();



    }, 500);



  }






  saveTeamReport() {


    this.submitted = true;



    if (

      !this.teamReport.reportName ||

      !this.teamReport.teamName ||

      !this.teamReport.reportType

    ) {

      return;

    }



    this.spinner.show();



    setTimeout(() => {



      if (!this.isEdit) {



        const nextId = this.teamReports.length

          ? Math.max(

              ...this.teamReports.map(

                x => x.teamReportId

              )

            ) + 1

          : 1;



        this.teamReports.unshift({


          ...this.teamReport,


          teamReportId: nextId


        });



      }

      else {



        const index = this.teamReports.findIndex(


          x => x.teamReportId === this.teamReport.teamReportId


        );



        if (index !== -1) {



          this.teamReports[index] = {


            ...this.teamReport


          };


        }


      }




      this.teamReports = [

        ...this.teamReports

      ];



      this.totalRecords = this.teamReports.length;



      this.page = 1;



      const message = this.isEdit

        ? 'Team report updated successfully.'

        : 'Team report generated successfully.';




      this.clear();



      this.spinner.hide();



      this.cd.detectChanges();



      this.alert.success(message);



    }, 500);



  }
    edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.teamReports.find(

        x => x.teamReportId === id

      );


      if (selected) {

        this.teamReport = {

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



          this.teamReports = this.teamReports.filter(


            x => x.teamReportId !== id


          );



          this.totalRecords = this.teamReports.length;



          if (

            this.page > 1 &&

            this.pagedTeamReports.length === 0

          ) {


            this.page--;


          }



          this.teamReports = [


            ...this.teamReports


          ];



          this.spinner.hide();



          this.cd.detectChanges();



          this.alert.success(


            'Team report deleted successfully.'


          );



        }, 500);



      }


    });



  }






  view(item: any) {


    this.alert.info(


      'View Report',


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

    this.selectedTeam = '';

    this.selectedStatus = '';

    this.page = 1;


  }






  clear() {


    this.teamReport = {


      teamReportId: 0,

      reportName: '',

      teamName: '',

      manager: '',

      reportType: '',

      module: '',

      reportPeriod: 'This Month',

      fromDate: '',

      toDate: '',

      totalRecords: 0,

      exportFormat: 'PDF',

      generatedBy: '',

      generatedDate: '',

      status: 'Generated',

      description: '',

      isActive: true


    };



    this.isEdit = false;


    this.submitted = false;



    this.cd.detectChanges();


  }








  get filteredTeamReports() {


    return this.teamReports.filter(x =>



      (

        this.searchText === '' ||



        x.reportName

          .toLowerCase()

          .includes(

            this.searchText.toLowerCase()

          )



        ||



        x.teamName

          .toLowerCase()

          .includes(

            this.searchText.toLowerCase()

          )



        ||



        x.manager

          .toLowerCase()

          .includes(

            this.searchText.toLowerCase()

          )



        ||



        x.reportType

          .toLowerCase()

          .includes(

            this.searchText.toLowerCase()

          )


      )



      &&



      (


        this.selectedTeam === '' ||


        x.teamName === this.selectedTeam



      )



      &&



      (


        this.selectedStatus === '' ||


        x.status === this.selectedStatus



      )



    );


  }








  get pagedTeamReports() {


    const start =

      (this.page - 1) *

      this.pageSize;



    return this.filteredTeamReports.slice(


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
