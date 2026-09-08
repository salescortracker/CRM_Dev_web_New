import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-profile',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
   submitted = false;


  profile: any = {

    userId: 0,

    profileImage: 'assets/images/default-profile.png',

    fullName: '',

    employeeCode: '',

    email: '',

    phone: '',

    alternatePhone: '',

    dateOfBirth: '',

    gender: '',

    address: '',

    city: '',

    state: '',

    country: '',


    companyName: '',

    department: '',

    designation: '',

    reportingManager: '',

    joiningDate: '',


    username: '',

    role: '',

    lastLogin: '',

    status: '',


    passwordChangedDate: '',

    mfaEnabled: false,

    activeSessions: 0


  };



  activity: any = {


    loginCount: 0,

    completedTasks: 0,

    createdLeads: 0,

    generatedReports: 0


  };



  recentActivities: any[] = [];




  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef

  ) { }





  ngOnInit(): void {


    this.loadProfile();


  }





  loadProfile() {


    this.spinner.show();



    setTimeout(() => {



      this.profile = {


        userId: 101,


        profileImage: 'assets/images/default-profile.png',


        fullName: 'Karishma Shaik',


        employeeCode: 'EMP0023',


        email: 'karishma@crm.com',


        phone: '9876543210',


        alternatePhone: '9123456780',


        dateOfBirth: '1998-05-15',


        gender: 'Female',


        address: 'Hyderabad, Telangana',


        city: 'Hyderabad',


        state: 'Telangana',


        country: 'India',



        companyName: 'CRM Solutions Pvt Ltd',


        department: 'Sales',


        designation: 'Sales Executive',


        reportingManager: 'Rajesh Kumar',


        joiningDate: '2025-01-10',



        username: 'karishma',


        role: 'CRM User',


        lastLogin: '2026-07-30 10:15 AM',


        status: 'Active',



        passwordChangedDate: '2026-07-01',


        mfaEnabled: true,


        activeSessions: 2


      };






      this.activity = {


        loginCount: 156,


        completedTasks: 84,


        createdLeads: 42,


        generatedReports: 18


      };







      this.recentActivities = [



        {


          icon: 'fa fa-right-to-bracket',


          title: 'Logged into CRM',


          description: 'Successful login from Chrome browser',


          date: 'Today 10:15 AM'


        },



        {


          icon: 'fa fa-user-plus',


          title: 'Created New Lead',


          description: 'Added customer lead ABC Technologies',


          date: 'Yesterday'


        },



        {


          icon: 'fa fa-file-export',


          title: 'Generated Report',


          description: 'Monthly sales report generated',


          date: '28-Jul-2026'


        },



        {


          icon: 'fa fa-key',


          title: 'Password Updated',


          description: 'Account password changed successfully',


          date: '01-Jul-2026'


        }



      ];





      this.spinner.hide();



      this.cd.detectChanges();




    }, 500);



  }









  updateProfile() {



    this.submitted = true;




    if (!this.profile.fullName) {


      return;


    }





    this.spinner.show();





    setTimeout(() => {



      this.spinner.hide();



      this.cd.detectChanges();



      this.alert.success(

        'Profile updated successfully.'

      );



    }, 500);



  }
  
  uploadImage(event: any) {


    const file = event.target.files[0];


    if (!file) {

      return;

    }



    const reader = new FileReader();



    reader.onload = () => {


      this.profile.profileImage = reader.result;


      this.cd.detectChanges();


    };



    reader.readAsDataURL(file);



  }






  resetProfile() {


    this.submitted = false;


    this.loadProfile();



    this.alert.info(

      'Profile Reset',

      'Profile changes reverted successfully.'

    );


  }






  validateEmail(email: string): boolean {


    const emailPattern =

      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



    return emailPattern.test(email);



  }






  validatePhone(phone: string): boolean {


    const phonePattern =

      /^[0-9]{10}$/;



    return phonePattern.test(phone);



  }






  getProfileCompletion(): number {



    let completedFields = 0;


    let totalFields = 0;




    const fields = [


      this.profile.fullName,


      this.profile.email,


      this.profile.phone,


      this.profile.dateOfBirth,


      this.profile.gender,


      this.profile.address,


      this.profile.department,


      this.profile.designation,


      this.profile.profileImage



    ];




    totalFields = fields.length;



    fields.forEach(field => {


      if (field) {


        completedFields++;


      }


    });



    return Math.round(

      (completedFields / totalFields) * 100

    );



  }






  changeProfileStatus(status: string) {


    this.profile.status = status;


    this.cd.detectChanges();


  }






}
