import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';
import { apiErrorMessage, passwordFlow } from '../shared/password-flow';

// Step 2 of 3: enter the OTP from the email -> POST Auth/verify-otp.
@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './verify-otp.html',
  styleUrls: ['../shared/password-pages.css', './verify-otp.css'],
})
export class VerifyOtp implements OnInit, OnDestroy {

  // Seconds before "Resend OTP" can be used again.
  private static readonly RESEND_SECONDS = 30;

  email = '';

  otp = '';

  loading = signal(false);

  errorMessage = signal('');

  resendIn = signal(VerifyOtp.RESEND_SECONDS);

  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alert: Alertservice,
    private spinner: Spinnerservice
  ) {}

  ngOnInit(): void {

    this.email = passwordFlow.getEmail();

    // Reached without going through Forgot Password.
    if (!this.email) {
      this.router.navigate(['/forgot-password']);
      return;
    }

    this.startCooldown();

  }

  ngOnDestroy(): void {

    this.stopCooldown();

  }

  // The OTP is exactly six digits.
  onOtpInput(event: Event): void {

    const input = event.target as HTMLInputElement;

    // Written back so anything that is not a digit disappears immediately.
    input.value = (input.value || '').replace(/\D/g, '').slice(0, 6);

    this.otp = input.value;

    this.errorMessage.set('');

  }

  verify(): void {

    if (!/^\d{6}$/.test(this.otp)) {
      this.errorMessage.set('Please enter the 6-digit OTP sent to your email.');
      return;
    }

    this.errorMessage.set('');
    this.loading.set(true);
    this.spinner.show();

    this.authService.verifyOtp({ email: this.email, otp: this.otp }).subscribe({

      next: (res) => {

        this.loading.set(false);
        this.spinner.hide();

        passwordFlow.setOtpVerified();

        this.alert
          .success(res?.message || 'OTP verified successfully.')
          .then(() => this.router.navigate(['/reset-password']));

      },

      error: (err) => {

        this.loading.set(false);
        this.spinner.hide();

        this.errorMessage.set(
          apiErrorMessage(
            err,
            'The OTP is invalid or has expired (it is valid for 5 minutes). Check the code or request a new one.'
          )
        );

      }

    });

  }

  // Sends a new OTP through the same forgot-password API.
  resend(): void {

    if (this.resendIn() > 0 || this.loading()) {
      return;
    }

    this.errorMessage.set('');
    this.loading.set(true);
    this.spinner.show();

    this.authService.forgotPassword({ email: this.email }).subscribe({

      next: (res) => {

        this.loading.set(false);
        this.spinner.hide();

        this.otp = '';

        this.startCooldown();

        this.alert.success(res?.message || 'OTP sent successfully.');

      },

      error: (err) => {

        this.loading.set(false);
        this.spinner.hide();

        this.errorMessage.set(
          apiErrorMessage(err, 'We could not resend the OTP. Please try again.')
        );

      }

    });

  }

  private startCooldown(): void {

    this.stopCooldown();

    this.resendIn.set(VerifyOtp.RESEND_SECONDS);

    this.timer = setInterval(() => {

      const next = this.resendIn() - 1;

      this.resendIn.set(Math.max(next, 0));

      if (next <= 0) {
        this.stopCooldown();
      }

    }, 1000);

  }

  private stopCooldown(): void {

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

  }

}
