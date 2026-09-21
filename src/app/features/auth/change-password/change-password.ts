import { Component, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';
import { MIN_PASSWORD_LENGTH, apiErrorMessage, plainText } from '../shared/password-flow';

// Logged-in users: POST Auth/change-password (the API identifies the user
// from the JWT, so no user id or email is sent).
@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './change-password.html',
  styleUrls: ['../shared/password-pages.css', './change-password.css'],
})
export class ChangePassword {

  currentPassword = '';

  newPassword = '';

  confirmPassword = '';

  showCurrent = signal(false);

  showNew = signal(false);

  showConfirm = signal(false);

  loading = signal(false);

  errorMessage = signal('');

  readonly minLength = MIN_PASSWORD_LENGTH;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alert: Alertservice,
    private spinner: Spinnerservice
  ) {}

  changePassword(): void {

    if (!this.currentPassword) {
      this.errorMessage.set('Please enter your current password.');
      return;
    }

    if (!this.newPassword) {
      this.errorMessage.set('Please enter a new password.');
      return;
    }

    if (this.newPassword.length < this.minLength) {
      this.errorMessage.set(
        `New password must be at least ${this.minLength} characters long.`
      );
      return;
    }

    if (this.newPassword === this.currentPassword) {
      this.errorMessage.set('New password cannot be the same as the current password.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage.set('Confirm Password must match New Password.');
      return;
    }

    this.errorMessage.set('');
    this.loading.set(true);
    this.spinner.show();

    this.authService.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    }).subscribe({

      next: (message) => {

        this.loading.set(false);
        this.spinner.hide();

        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';

        this.alert.success(
          plainText(message) || 'Password changed successfully.'
        );

      },

      error: (err: HttpErrorResponse) => {

        this.loading.set(false);
        this.spinner.hide();

        // Token missing or expired.
        if (err.status === 401) {

          this.alert
            .warning('Your session has expired. Please sign in again.')
            .then(() => this.router.navigate(['/login']));

          return;

        }

        // The error body of a text request arrives as a string; validation
        // errors (400) are JSON, so parse it before reading the message.
        const body = this.parseBody(err);

        this.errorMessage.set(
          apiErrorMessage(
            body ? new HttpErrorResponse({ error: body, status: err.status }) : err,
            'We could not change your password. Check that your current password is correct and that the new password is different from it.'
          )
        );

      }

    });

  }

  // change-password is requested as text, so a JSON error body is a string.
  private parseBody(err: HttpErrorResponse): unknown {

    if (typeof err.error !== 'string') {
      return null;
    }

    try {
      return JSON.parse(err.error);
    } catch {
      return null;
    }

  }

}
