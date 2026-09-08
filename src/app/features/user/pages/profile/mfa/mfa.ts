import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-mfa',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './mfa.html',
  styleUrl: './mfa.css',
})
export class Mfa {
   // =====================================
  // OTP Variable
  // =====================================


  otpCode = '';





  // =====================================
  // MFA Settings
  // =====================================


  mfaSettings: any = {


    enabled: false,


    method: '',


    contact: '',


    remainingCodes: 0,


    activatedDate: ''


  };







  // =====================================
  // Backup Codes
  // =====================================


  backupCodes: string[] = [];







  // =====================================
  // Trusted Devices
  // =====================================


  trustedDevices: any[] = [];








  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef

  ) {}








  ngOnInit(): void {


    this.loadMfaSettings();


  }









  // =====================================
  // Load MFA Settings
  // =====================================


  loadMfaSettings() {



    this.spinner.show();




    setTimeout(() => {



      this.mfaSettings = {


        enabled: true,


        method: 'Google Authenticator',


        contact: 'karishma@crm.com',


        remainingCodes: 6,


        activatedDate: '01-Jul-2026'


      };







      this.backupCodes = [


        '8K7P-92LM',


        '4XQ9-AB21',


        '7MN8-CD45',


        '2PL6-ZX90',


        '9RT3-KL72',


        '5YU8-QW34'


      ];







      this.trustedDevices = [



        {


          id: 1,


          deviceName: 'Dell Laptop - Chrome',


          location: 'Hyderabad, India',


          date: '01-Jul-2026'


        },



        {


          id: 2,


          deviceName: 'Samsung Galaxy S24',


          location: 'Hyderabad, India',


          date: '15-Jul-2026'


        }



      ];








      this.spinner.hide();



      this.cd.detectChanges();




    }, 500);



  }









  // =====================================
  // Enable / Disable MFA
  // =====================================


  toggleMfa() {



    if(this.mfaSettings.enabled) {



      this.alert.info(


        'MFA Enabled',


        'Complete OTP verification to activate MFA.'


      );



    }

    else {



      this.alert.warning(


        'MFA Disabled',


        'Your account is no longer protected with MFA.'


      );



    }



  }









  // =====================================
  // Verify OTP
  // =====================================


  verifyOtp() {



    if(!this.otpCode) {



      this.alert.warning(


        'OTP Required',


        'Please enter verification code.'


      );



      return;


    }







    if(this.otpCode.length !== 6) {



      this.alert.error(


        'Invalid OTP',


        'OTP should contain 6 digits.'


      );



      return;


    }








    this.spinner.show();




    setTimeout(() => {



      this.spinner.hide();





      this.mfaSettings.enabled = true;



      this.mfaSettings.activatedDate = new Date();



      this.alert.success(


        'MFA Activated Successfully.'


      );





      this.otpCode = '';



      this.cd.detectChanges();




    }, 700);



  }
  
  // =====================================
  // Remove Trusted Device
  // =====================================


  removeDevice(id: number) {



    this.alert.deleteConfirm().then(result => {



      if(result.isConfirmed) {



        this.spinner.show();



        setTimeout(() => {



          this.trustedDevices = this.trustedDevices.filter(


            device => device.id !== id


          );





          this.spinner.hide();



          this.cd.detectChanges();




          this.alert.success(


            'Trusted device removed successfully.'


          );



        },500);



      }



    });



  }









  // =====================================
  // Generate New Backup Codes
  // =====================================


  generateBackupCodes() {



    this.spinner.show();




    setTimeout(() => {



      this.backupCodes = [


        this.generateCode(),


        this.generateCode(),


        this.generateCode(),


        this.generateCode(),


        this.generateCode(),


        this.generateCode()


      ];





      this.mfaSettings.remainingCodes =


        this.backupCodes.length;






      this.spinner.hide();



      this.cd.detectChanges();




      this.alert.success(


        'New backup codes generated successfully.'


      );



    },500);



  }









  // =====================================
  // Generate Random Backup Code
  // =====================================


  generateCode(): string {



    const characters =

      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';




    let code = '';




    for(let i = 0; i < 8; i++) {



      code += characters.charAt(


        Math.floor(

          Math.random() * characters.length

        )


      );



    }






    return (

      code.substring(0,4)

      +

      '-'

      +

      code.substring(4,8)

    );



  }









  // =====================================
  // Change Authentication Method
  // =====================================


  changeAuthenticationMethod(method: string) {



    this.mfaSettings.method = method;




    this.alert.info(


      'Authentication Method Changed',


      'Selected method: ' + method


    );



  }









  // =====================================
  // Disable MFA
  // =====================================


  disableMfa() {



    this.alert.deleteConfirm().then(result => {



      if(result.isConfirmed) {



        this.spinner.show();




        setTimeout(() => {



          this.mfaSettings.enabled = false;



          this.mfaSettings.method = '';



          this.mfaSettings.remainingCodes = 0;






          this.spinner.hide();



          this.cd.detectChanges();





          this.alert.success(


            'Multi-Factor Authentication disabled.'


          );



        },500);



      }



    });



  }









  // =====================================
  // Copy Backup Code
  // =====================================


  copyCode(code: string) {



    navigator.clipboard.writeText(code);




    this.alert.success(


      'Backup code copied.'


    );



  }







}
