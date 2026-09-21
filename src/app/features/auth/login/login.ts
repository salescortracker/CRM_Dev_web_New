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

          if (response.token) {
            localStorage.setItem('token', response.token);
          }

          localStorage.setItem('user', JSON.stringify(response));
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

            this.redirectUser(response);

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

  private redirectUser(response: any): void {

    // The server decides the layout from the user's assigned role
    // ('Super Admin' | 'Admin' | 'User'); the role name is the fallback.
    const role = this.normalizeRole(
      response?.layout ||
      response?.role ||
      response?.roleName ||
      response?.userRole ||
      response?.user?.role ||
      response?.user?.roleName
    );

    switch (role) {

      // ==========================================
      // NORMAL CRM USER
      // ==========================================

      case 'user':
      case 'sales executive':
      case 'sales manager':
      case 'manager':

        this.router.navigate(['/dashboard']);

        break;


      // ==========================================
      // CRM ADMIN
      // ==========================================

      case 'admin':

        this.router.navigate(['/admindashboard']);

        break;


      // ==========================================
      // CRM SUPER ADMIN
      // ==========================================

      case 'super admin':

        this.router.navigate(['/superadmindashboard']);

        break;


      // ==========================================
      // UNKNOWN USER
      // ==========================================

      default:

        this.router.navigate(['/dashboard']);

        break;
    }
  }

  private normalizeRole(role: string): string {
    return (role || '').replace(/[-_]/g, ' ').trim().toLowerCase();
  }

  // ==========================================================
  // PASSWORD VISIBILITY
  // ==========================================================

  togglePassword(): void {

    this.showPassword = !this.showPassword;

  }
}
