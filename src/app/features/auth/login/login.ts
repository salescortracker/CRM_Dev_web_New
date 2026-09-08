import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Spinnerservice } from '../../../core/services/spinnerservice';
import { Alertservice } from '../../../core/services/alertservice';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
 username: string = '';
  password: string = '';

  loading: boolean = false;
  errorMessage: string = '';

  showPassword: boolean = false;
  rememberMe: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private spinner: Spinnerservice,
    private alertService: Alertservice
  ) {}

  login(): void {

    // ==============================
    // VALIDATION
    // ==============================

    if (!this.username || !this.password) {

      this.alertService.warning(
        'Please enter Username and Password'
      );

      return;
    }

    this.loading = true;
    this.spinner.show();
    this.errorMessage = '';

    // ==============================
    // LOGIN API
    // ==============================

    this.authService.login({
      userName: this.username.trim(),
      password: this.password
    }).subscribe({

      next: (response: any) => {

        this.loading = false;
        this.spinner.hide();

        console.log('Login Success:', response);

        // ==========================================
        // NORMALIZE USERNAME
        // ==========================================

        const loggedInUsername =
          this.username.trim().toLowerCase();

        // ==========================================
        // STORE LOGIN INFORMATION
        // ==========================================

        localStorage.setItem(
          'loggedInUser',
          loggedInUsername
        );

        localStorage.setItem(
          'isLoggedIn',
          'true'
        );

        // ==========================================
        // OPTIONAL: STORE API RESPONSE
        // ==========================================

        if (response) {
          localStorage.setItem(
            'loginResponse',
            JSON.stringify(response)
          );
        }

        // ==========================================
        // SUCCESS MESSAGE
        // ==========================================

        this.alertService
          .success('Login Successful')
          .then(() => {

            // ======================================
            // ROLE / USER REDIRECTION
            // ======================================

            this.redirectUser(loggedInUsername);

          });

      },

      error: (error: any) => {

        this.loading = false;
        this.spinner.hide();

        console.error('Login Error:', error);

        const message =
          error?.error?.message ||
          error?.error?.Message ||
          'Invalid Username or Password';

        this.errorMessage = message;

        this.alertService.error(message);
      }

    });
  }

  // ==========================================================
  // USER REDIRECTION
  // ==========================================================

  private redirectUser(username: string): void {

    switch (username) {

      // ==========================================
      // NORMAL CRM USER
      // ==========================================

      case 'user@crm.com':

        this.router.navigate(['/dashboard']);

        break;


      // ==========================================
      // CRM ADMIN
      // ==========================================

      case 'admin@crm.com':

        this.router.navigate(['/admindashboard']);

        break;


      // ==========================================
      // CRM SUPER ADMIN
      // ==========================================

      case 'superadmin@crm.com':

        this.router.navigate(['/superadmindashboard']);

        break;


      // ==========================================
      // UNKNOWN USER
      // ==========================================

      default:

        this.alertService.warning(
          'User role is not configured. Please contact administrator.'
        );

        this.router.navigate(['/login']);

        break;
    }
  }

  // ==========================================================
  // PASSWORD VISIBILITY
  // ==========================================================

  togglePassword(): void {

    this.showPassword = !this.showPassword;

  }
}
