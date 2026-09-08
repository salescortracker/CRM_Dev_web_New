import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-sessions',
  standalone:true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './sessions.html',
  styleUrl: './sessions.css',
})
export class Sessions {
   // ================================
  // Pagination
  // ================================


  page = 1;

  pageSize = 5;



  // ================================
  // Filters
  // ================================


  searchText = '';

  selectedDeviceType = '';

  selectedStatus = '';





  // ================================
  // Session Summary
  // ================================


  sessionSummary: any = {


    totalSessions: 0,


    activeSessions: 0,


    mobileSessions: 0,


    lastLogin: ''


  };







  // ================================
  // Current Session
  // ================================


  currentSession: any = {


    deviceName: '',


    browser: '',


    operatingSystem: '',


    location: '',


    loginTime: ''


  };







  // ================================
  // Sessions List
  // ================================


  sessions: any[] = [];





  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef

  ) {}







  ngOnInit(): void {


    this.loadSessions();


  }








  // ===================================
  // Load Sessions
  // ===================================


  loadSessions() {



    this.spinner.show();




    setTimeout(() => {



      this.sessions = [




        {


          sessionId: 1,


          deviceName: 'Dell Laptop',


          deviceType: 'Desktop',


          browser: 'Chrome 150',


          operatingSystem: 'Windows 11',


          ipAddress: '192.168.1.101',


          location: 'Hyderabad, India',


          loginTime: '30-Jul-2026 10:15 AM',


          lastActivity: '2 minutes ago',


          status: 'Active',


          currentSession: true


        },





        {


          sessionId: 2,


          deviceName: 'Samsung Galaxy S24',


          deviceType: 'Mobile',


          browser: 'Chrome Mobile',


          operatingSystem: 'Android 15',


          ipAddress: '192.168.1.120',


          location: 'Hyderabad, India',


          loginTime: '29-Jul-2026 08:30 PM',


          lastActivity: 'Yesterday',


          status: 'Active',


          currentSession: false


        },





        {


          sessionId: 3,


          deviceName: 'iPad Pro',


          deviceType: 'Tablet',


          browser: 'Safari',


          operatingSystem: 'iPad OS',


          ipAddress: '192.168.1.135',


          location: 'Bangalore, India',


          loginTime: '25-Jul-2026 04:20 PM',


          lastActivity: '25-Jul-2026',


          status: 'Expired',


          currentSession: false


        },





        {


          sessionId: 4,


          deviceName: 'Office Desktop',


          deviceType: 'Desktop',


          browser: 'Microsoft Edge',


          operatingSystem: 'Windows 10',


          ipAddress: '192.168.1.140',


          location: 'Vijayawada, India',


          loginTime: '20-Jul-2026 09:00 AM',


          lastActivity: '20-Jul-2026',


          status: 'Logged Out',


          currentSession: false


        },





        {


          sessionId: 5,


          deviceName: 'OnePlus 12',


          deviceType: 'Mobile',


          browser: 'Chrome Mobile',


          operatingSystem: 'Android 14',


          ipAddress: '192.168.1.155',


          location: 'Chennai, India',


          loginTime: '15-Jul-2026 07:45 PM',


          lastActivity: '15-Jul-2026',


          status: 'Expired',


          currentSession: false


        }



      ];







      this.currentSession = this.sessions.find(


        x => x.currentSession === true


      );







      this.sessionSummary = {


        totalSessions: this.sessions.length,


        activeSessions: this.sessions.filter(


          x => x.status === 'Active'


        ).length,



        mobileSessions: this.sessions.filter(


          x => x.deviceType === 'Mobile'


        ).length,



        lastLogin: this.currentSession.loginTime


      };







      this.spinner.hide();



      this.cd.detectChanges();




    }, 500);



  }









  // ===================================
  // Logout Individual Session
  // ===================================


  logoutSession(sessionId: number) {



    this.alert.deleteConfirm().then(result => {



      if(result.isConfirmed) {



        this.spinner.show();




        setTimeout(() => {



          const session = this.sessions.find(


            x => x.sessionId === sessionId


          );





          if(session) {



            session.status = 'Logged Out';



          }






          this.sessionSummary.activeSessions =


            this.sessions.filter(


              x => x.status === 'Active'


            ).length;






          this.spinner.hide();




          this.cd.detectChanges();




          this.alert.success(


            'Session logged out successfully.'


          );




        },500);



      }



    });



  }
  
  // ===================================
  // Logout All Other Sessions
  // ===================================


  logoutAllSessions() {


    this.alert.deleteConfirm().then(result => {



      if (result.isConfirmed) {



        this.spinner.show();



        setTimeout(() => {



          this.sessions.forEach(session => {



            if (!session.currentSession) {



              session.status = 'Logged Out';



            }



          });






          this.sessionSummary.activeSessions =

            this.sessions.filter(


              x => x.status === 'Active'


            ).length;






          this.spinner.hide();



          this.cd.detectChanges();




          this.alert.success(


            'All other sessions logged out successfully.'


          );




        }, 500);



      }



    });



  }









  // ===================================
  // View Session Details
  // ===================================


  viewSession(session: any) {



    const message = `

    Device: ${session.deviceName}

    Browser: ${session.browser}

    OS: ${session.operatingSystem}

    IP Address: ${session.ipAddress}

    Location: ${session.location}

    Login Time: ${session.loginTime}

    Last Activity: ${session.lastActivity}

    Status: ${session.status}

    `;




    this.alert.info(

      'Session Details',

      message

    );



  }









  // ===================================
  // Filtered Sessions
  // ===================================


  get filteredSessions() {



    return this.sessions.filter(session =>



      (

        this.searchText === '' ||



        session.deviceName

          .toLowerCase()

          .includes(

            this.searchText.toLowerCase()

          )



        ||



        session.browser

          .toLowerCase()

          .includes(

            this.searchText.toLowerCase()

          )



        ||



        session.location

          .toLowerCase()

          .includes(

            this.searchText.toLowerCase()

          )



        ||



        session.ipAddress

          .toLowerCase()

          .includes(

            this.searchText.toLowerCase()

          )


      )



      &&



      (


        this.selectedDeviceType === '' ||


        session.deviceType === this.selectedDeviceType



      )



      &&



      (


        this.selectedStatus === '' ||


        session.status === this.selectedStatus



      )



    );



  }









  // ===================================
  // Pagination Data
  // ===================================


  get pagedSessions() {



    const start =


      (this.page - 1) * this.pageSize;






    return this.filteredSessions.slice(


      start,


      start + this.pageSize



    );



  }









  // ===================================
  // Reset Filters
  // ===================================


  resetFilters() {



    this.searchText = '';

    this.selectedDeviceType = '';

    this.selectedStatus = '';

    this.page = 1;



  }









  // ===================================
  // Page Change
  // ===================================


  changePage(pageNumber: number) {



    this.page = pageNumber;



  }









  // ===================================
  // Page Size Change
  // ===================================


  changePageSize(size: number) {



    this.pageSize = size;



    this.page = 1;



  }





}
