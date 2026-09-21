import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';
import { EMAIL_PATTERN, apiErrorMessage, passwordFlow } from '../shared/password-flow';

// Step 1 of 3: enter the email -> POST Auth/forgot-password sends the OTP.
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: ['../shared/password-pages.css', './forgot-password.css'],
})
export class ForgotPassword {

  email = '';

  loading = signal(false);

  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
    private alert: Alertservice,
    private spinner: Spinnerservice
  ) {}

  sendOtp(): void {

    const email = this.email.trim();

    if (!email) {
      this.errorMessage.set('Please enter your email address.');
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      this.errorMessage.set('Please enter a valid email address.');
      return;
    }

    this.errorMessage.set('');
    this.loading.set(true);
    this.spinner.show();

    this.authService.forgotPassword({ email }).subscribe({

      next: (res) => {

        this.loading.set(false);
        this.spinner.hide();

        // Start a fresh flow for this email.
        passwordFlow.setEmail(email);

        this.alert
          .success(res?.message || 'OTP sent successfully.')
          .then(() => this.router.navigate(['/verify-otp']));

      },

      error: (err) => {

        this.loading.set(false);
        this.spinner.hide();

        this.errorMessage.set(
          apiErrorMessage(
            err,
            'We could not send the OTP. Check that this email is registered and try again.'
          )
        );

      }

    });

  }

}
