import { CommonModule } from '@angular/common';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';
// import { Pagination } from '../../../../../shared/pagination/pagination';

@Component({
  selector: 'app-timesheet',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './timesheet.html',
  styleUrl: './timesheet.css',
})
export class Timesheet {
  submitted = false;


  isEdit = false;



  page = 1;


  pageSize = 5;


  totalRecords = 0;



  searchText = '';





  timesheets: any[] = [];







  timesheet: any = {



    timesheetId: 0,


    employeeName: '',


    projectName: '',


    taskName: '',


    timesheetDate: '',


    startTime: '',


    endTime: '',


    totalHours: 0,


    workDescription: '',


    billingType: '',


    status: '',


    approvedBy: '',


    isActive: true



  };









  constructor(


    private alert: Alertservice,


    private spinner: Spinnerservice,


    private cd: ChangeDetectorRef


  ) { }









  ngOnInit(): void {



    this.loadTimesheets();



  }









  loadTimesheets() {



    this.spinner.show();







    setTimeout(() => {







      this.timesheets = [







        {



          timesheetId: 1,


          employeeName: 'Karishma',


          projectName: 'CRM Application',


          taskName: 'Development',


          timesheetDate: '2026-08-01',


          startTime: '09:00',


          endTime: '17:00',


          totalHours: 8,


          workDescription: 'Developed CRM lead management module.',


          billingType: 'Billable',


          status: 'Submitted',


          approvedBy: '',


          isActive: true



        },









        {



          timesheetId: 2,


          employeeName: 'Rahul',


          projectName: 'HRMS Portal',


          taskName: 'Bug Fixing',


          timesheetDate: '2026-08-02',


          startTime: '10:00',


          endTime: '16:00',


          totalHours: 6,


          workDescription: 'Resolved employee attendance related bugs.',


          billingType: 'Billable',


          status: 'Approved',


          approvedBy: 'Manager',


          isActive: true



        },









        {



          timesheetId: 3,


          employeeName: 'Sneha',


          projectName: 'Mobile Application',


          taskName: 'Testing',


          timesheetDate: '2026-08-03',


          startTime: '09:30',


          endTime: '16:30',


          totalHours: 7,


          workDescription: 'Performed application testing and prepared test cases.',


          billingType: 'Non Billable',


          status: 'Submitted',


          approvedBy: '',


          isActive: true



        },
                {



          timesheetId: 4,


          employeeName: 'Arun',


          projectName: 'ERP System',


          taskName: 'Code Review',


          timesheetDate: '2026-08-04',


          startTime: '09:00',


          endTime: '14:00',


          totalHours: 5,


          workDescription: 'Reviewed source code and suggested improvements.',


          billingType: 'Billable',


          status: 'Draft',


          approvedBy: '',


          isActive: true



        },









        {



          timesheetId: 5,


          employeeName: 'Durga',


          projectName: 'Customer Portal',


          taskName: 'Deployment',


          timesheetDate: '2026-08-05',


          startTime: '11:00',


          endTime: '15:00',


          totalHours: 4,


          workDescription: 'Deployed customer portal updates to production environment.',


          billingType: 'Non Billable',


          status: 'Rejected',


          approvedBy: 'Project Manager',


          isActive: false



        }







      ];









      this.timesheets.sort(



        (a, b) => b.timesheetId - a.timesheetId



      );









      this.totalRecords = this.timesheets.length;









      this.spinner.hide();









      this.cd.detectChanges();









    }, 500);







  }
    saveTimesheet() {


    this.submitted = true;



    if (


      !this.timesheet.employeeName ||


      !this.timesheet.projectName ||


      !this.timesheet.taskName ||


      !this.timesheet.timesheetDate ||


      !this.timesheet.startTime ||


      !this.timesheet.endTime ||


      !this.timesheet.workDescription ||


      !this.timesheet.status


    ) {


      return;


    }






    this.spinner.show();






    setTimeout(() => {






      if (!this.isEdit) {





        const newTimesheet = {




          ...this.timesheet,




          timesheetId: this.timesheets.length



            ? Math.max(...this.timesheets.map(x => x.timesheetId)) + 1



            : 1





        };





        this.timesheets.unshift(newTimesheet);






      }

      else {





        const index = this.timesheets.findIndex(



          x => x.timesheetId === this.timesheet.timesheetId



        );






        if (index !== -1) {





          this.timesheets[index] = {



            ...this.timesheet



          };





        }





      }








      this.timesheets = [...this.timesheets];







      this.totalRecords = this.timesheets.length;







      this.page = 1;








      const isUpdate = this.isEdit;







      this.clear();







      this.spinner.hide();







      this.cd.detectChanges();








      this.alert.success(




        isUpdate



          ? 'Timesheet updated successfully.'



          : 'Timesheet created successfully.'





      );







    }, 500);





  }









  edit(id: number) {




    this.spinner.show();







    setTimeout(() => {







      const selected = this.timesheets.find(



        x => x.timesheetId === id



      );







      if (selected) {





        this.timesheet = {



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






          this.timesheets = this.timesheets.filter(



            x => x.timesheetId !== id



          );







          this.totalRecords = this.timesheets.length;







          if (



            this.page > 1 &&



            this.pagedTimesheets.length === 0



          ) {



            this.page--;



          }








          this.timesheets = [...this.timesheets];







          this.spinner.hide();







          this.cd.detectChanges();







          this.alert.success(



            'Timesheet deleted successfully.'



          );







        }, 500);






      }







    });






  }









  clear() {




    this.timesheet = {




      timesheetId: 0,


      employeeName: '',


      projectName: '',


      taskName: '',


      timesheetDate: '',


      startTime: '',


      endTime: '',


      totalHours: 0,


      workDescription: '',


      billingType: '',


      status: '',


      approvedBy: '',


      isActive: true



    };







    this.isEdit = false;







    this.submitted = false;







    this.cd.detectChanges();






  }









  get filteredTimesheets() {




    return this.timesheets.filter(x =>






      x.employeeName



        .toLowerCase()



        .includes(this.searchText.toLowerCase())






      ||






      x.projectName



        .toLowerCase()



        .includes(this.searchText.toLowerCase())






      ||






      x.taskName



        .toLowerCase()



        .includes(this.searchText.toLowerCase())






      ||






      x.billingType



        .toLowerCase()



        .includes(this.searchText.toLowerCase())






      ||






      x.status



        .toLowerCase()



        .includes(this.searchText.toLowerCase())






    );






  }









  get pagedTimesheets() {




    const start = (this.page - 1) * this.pageSize;







    return this.filteredTimesheets.slice(



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
