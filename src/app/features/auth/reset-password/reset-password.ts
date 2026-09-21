import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';
import { MIN_PASSWORD_LENGTH, apiErrorMessage, passwordFlow } from '../shared/password-flow';

// Step 3 of 3: choose a new password -> POST Auth/reset-password.
// The API only accepts this after the OTP for the same email was verified.
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrls: ['../shared/password-pages.css', './reset-password.css'],
})
export class ResetPassword implements OnInit {

  email = '';

  newPassword = '';

  confirmPassword = '';

  showNewPassword = signal(false);

  showConfirmPassword = signal(false);

  loading = signal(false);

  errorMessage = signal('');

  readonly minLength = MIN_PASSWORD_LENGTH;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alert: Alertservice,
    private spinner: Spinnerservice
  ) {}

  ngOnInit(): void {

    this.email = passwordFlow.getEmail();

    // Reached without verifying an OTP first.
    if (!this.email) {
      this.router.navigate(['/forgot-password']);
      return;
    }

    if (!passwordFlow.isOtpVerified()) {
      this.router.navigate(['/verify-otp']);
    }

  }

  resetPassword(): void {

    if (!this.newPassword) {
      this.errorMessage.set('Please enter a new password.');
      return;
    }

    if (this.newPassword.length < this.minLength) {
      this.errorMessage.set(
        `Password must be at least ${this.minLength} characters long.`
      );
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage.set('Confirm Password must match New Password.');
      return;
    }

    this.errorMessage.set('');
    this.loading.set(true);
    this.spinner.show();

    this.authService
      .resetPassword({ email: this.email, newPassword: this.newPassword })
      .subscribe({

        next: (res) => {

          this.loading.set(false);
          this.spinner.hide();

          // The flow is finished; nothing should be reusable.
          passwordFlow.clear();

          this.alert
            .success(res?.message || 'Password reset successfully.')
            .then(() => this.router.navigate(['/login']));

        },

        error: (err) => {

          this.loading.set(false);
          this.spinner.hide();

          this.errorMessage.set(
            apiErrorMessage(
              err,
              'We could not reset your password. Your OTP verification may have expired - please start again.'
            )
          );

        }

      });

  }

}
