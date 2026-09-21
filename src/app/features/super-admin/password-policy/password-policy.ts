import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';
import { Pagination } from '../../../shared/pagination/pagination';

@Component({
  selector: 'app-password-policy',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './password-policy.html',
  styleUrl: './password-policy.css',
})
export class PasswordPolicy implements OnInit {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  //====================================================
  // Screen Variables
  //====================================================

  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 10;

  searchText = '';

  //====================================================
  // Password Policy List
  //====================================================

  passwordPolicies: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  passwordPolicy: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      passwordPolicyId: 0,

      policyName: '',

      minimumPasswordLength: 8,
      maximumPasswordLength: 32,

      passwordExpiryDays: null,
      passwordHistory: null,

      maximumFailedLoginAttempts: null,
      accountLockDurationMinutes: null,
      sessionTimeoutMinutes: null,

      mfarequirement: false,

      requireUppercaseLetter: true,
      requireLowercaseLetter: true,
      requireNumber: true,
      requireSpecialCharacter: true,

      preventUsernameInPassword: true,
      forcePasswordChangeOnFirstLogin: true,
      allowPasswordReuse: false,

      policyActive: true

    };

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadPasswordPolicies();

  }

  //====================================================
  // Load Password Policies
  //====================================================

  loadPasswordPolicies(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getallpasswordpolicy`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.passwordPolicies = res.data || [];

          } else {

            this.passwordPolicies = [];

            this.alert.warning(
              res?.message || 'No Password Policy records found.'
            );

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Error loading password policies:', err);

          this.passwordPolicies = [];

          this.alert.error(
            err?.error?.message || 'Failed to load password policies.'
          );

          this.cd.detectChanges();

        }

      });

  }

  //====================================================
  // Filtered Password Policies
  //====================================================

  get filteredPasswordPolicies() {

    const search = this.searchText.trim().toLowerCase();

    if (!search) return this.passwordPolicies;

    return this.passwordPolicies.filter(x =>
      (x.policyName || '').toLowerCase().includes(search)
    );

  }

  get pagedPasswordPolicies() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredPasswordPolicies.slice(start, start + this.pageSize);

  }

  //====================================================
  // Save / Update
  //====================================================

  savePasswordPolicy(): void {

    this.submitted = true;

    if (
      !this.passwordPolicy.policyName ||
      !this.passwordPolicy.policyName.trim() ||
      !this.passwordPolicy.minimumPasswordLength ||
      Number(this.passwordPolicy.minimumPasswordLength) <= 0 ||
      !this.passwordPolicy.maximumPasswordLength ||
      Number(this.passwordPolicy.maximumPasswordLength) <= 0
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    if (
      Number(this.passwordPolicy.minimumPasswordLength) >
      Number(this.passwordPolicy.maximumPasswordLength)
    ) {

      this.alert.warning(
        'Minimum Password Length cannot be greater than Maximum Password Length.'
      );

      return;

    }

    if (
      this.passwordPolicy.passwordExpiryDays !== null &&
      this.passwordPolicy.passwordExpiryDays !== '' &&
      Number(this.passwordPolicy.passwordExpiryDays) < 0
    ) {

      this.alert.warning('Password Expiry Days cannot be negative.');

      return;

    }

    if (
      this.passwordPolicy.passwordHistory !== null &&
      this.passwordPolicy.passwordHistory !== '' &&
      Number(this.passwordPolicy.passwordHistory) < 0
    ) {

      this.alert.warning('Password History cannot be negative.');

      return;

    }

    if (
      this.passwordPolicy.maximumFailedLoginAttempts !== null &&
      this.passwordPolicy.maximumFailedLoginAttempts !== '' &&
      Number(this.passwordPolicy.maximumFailedLoginAttempts) <= 0
    ) {

      this.alert.warning('Maximum Failed Login Attempts must be greater than zero.');

      return;

    }

    if (
      this.passwordPolicy.accountLockDurationMinutes !== null &&
      this.passwordPolicy.accountLockDurationMinutes !== '' &&
      Number(this.passwordPolicy.accountLockDurationMinutes) <= 0
    ) {

      this.alert.warning('Account Lock Duration must be greater than zero.');

      return;

    }

    if (
      this.passwordPolicy.sessionTimeoutMinutes !== null &&
      this.passwordPolicy.sessionTimeoutMinutes !== '' &&
      Number(this.passwordPolicy.sessionTimeoutMinutes) <= 0
    ) {

      this.alert.warning('Session Timeout must be greater than zero.');

      return;

    }

    const payload = {

      passwordPolicyId: this.isEdit ? this.passwordPolicy.passwordPolicyId : 0,

      policyName: this.passwordPolicy.policyName.trim(),

      minimumPasswordLength: Number(this.passwordPolicy.minimumPasswordLength),
      maximumPasswordLength: Number(this.passwordPolicy.maximumPasswordLength),

      passwordExpiryDays:
        this.passwordPolicy.passwordExpiryDays !== null &&
          this.passwordPolicy.passwordExpiryDays !== ''
          ? Number(this.passwordPolicy.passwordExpiryDays)
          : null,

      passwordHistory:
        this.passwordPolicy.passwordHistory !== null &&
          this.passwordPolicy.passwordHistory !== ''
          ? Number(this.passwordPolicy.passwordHistory)
          : null,

      maximumFailedLoginAttempts:
        this.passwordPolicy.maximumFailedLoginAttempts !== null &&
          this.passwordPolicy.maximumFailedLoginAttempts !== ''
          ? Number(this.passwordPolicy.maximumFailedLoginAttempts)
          : null,

      accountLockDurationMinutes:
        this.passwordPolicy.accountLockDurationMinutes !== null &&
          this.passwordPolicy.accountLockDurationMinutes !== ''
          ? Number(this.passwordPolicy.accountLockDurationMinutes)
          : null,

      sessionTimeoutMinutes:
        this.passwordPolicy.sessionTimeoutMinutes !== null &&
          this.passwordPolicy.sessionTimeoutMinutes !== ''
          ? Number(this.passwordPolicy.sessionTimeoutMinutes)
          : null,

      mfarequirement: !!this.passwordPolicy.mfarequirement,

      requireUppercaseLetter: !!this.passwordPolicy.requireUppercaseLetter,
      requireLowercaseLetter: !!this.passwordPolicy.requireLowercaseLetter,
      requireNumber: !!this.passwordPolicy.requireNumber,
      requireSpecialCharacter: !!this.passwordPolicy.requireSpecialCharacter,

      preventUsernameInPassword: !!this.passwordPolicy.preventUsernameInPassword,
      forcePasswordChangeOnFirstLogin: !!this.passwordPolicy.forcePasswordChangeOnFirstLogin,
      allowPasswordReuse: !!this.passwordPolicy.allowPasswordReuse,

      policyActive: !!this.passwordPolicy.policyActive

    };

    this.spinner.show();

    if (this.isEdit) {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/updatepasswordpolicy`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Password Policy updated successfully.'
              );

              this.clear();

              this.loadPasswordPolicies();

            } else {

              this.alert.warning(
                res?.message || 'Failed to update password policy.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Update password policy error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to update password policy.'
            );

          }

        });

    } else {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/createpasswordpolicy`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Password Policy created successfully.'
              );

              this.clear();

              this.loadPasswordPolicies();

            } else {

              this.alert.warning(
                res?.message || 'Failed to create password policy.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Create password policy error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to create password policy.'
            );

          }

        });

    }

  }

  //====================================================
  // Edit
  //====================================================

  edit(id: number): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any>>(`${this.baseUrl}/Admin/getbypasswordpolicy/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.passwordPolicy = {

              passwordPolicyId: data.passwordPolicyId,

              policyName: data.policyName || '',

              minimumPasswordLength: data.minimumPasswordLength ?? 8,
              maximumPasswordLength: data.maximumPasswordLength ?? 32,

              passwordExpiryDays: data.passwordExpiryDays ?? null,
              passwordHistory: data.passwordHistory ?? null,

              maximumFailedLoginAttempts: data.maximumFailedLoginAttempts ?? null,
              accountLockDurationMinutes: data.accountLockDurationMinutes ?? null,
              sessionTimeoutMinutes: data.sessionTimeoutMinutes ?? null,

              mfarequirement: data.mfarequirement === true,

              requireUppercaseLetter: data.requireUppercaseLetter === true,
              requireLowercaseLetter: data.requireLowercaseLetter === true,
              requireNumber: data.requireNumber === true,
              requireSpecialCharacter: data.requireSpecialCharacter === true,

              preventUsernameInPassword: data.preventUsernameInPassword === true,
              forcePasswordChangeOnFirstLogin: data.forcePasswordChangeOnFirstLogin === true,
              allowPasswordReuse: data.allowPasswordReuse === true,

              policyActive: data.policyActive === true

            };

            this.isEdit = true;

            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'Password Policy not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get password policy error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to load password policy.'
          );

        }

      });

  }

  //====================================================
  // Delete
  //====================================================

  delete(id: number): void {

    this.alert.deleteConfirm().then(result => {

      if (!result.isConfirmed) return;

      this.spinner.show();

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/deletepasswordpolicy/${id}`,
          {}
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Password Policy deleted successfully.'
              );

              if (this.page > 1 && this.pagedPasswordPolicies.length === 1) {
                this.page = this.page - 1;
              }

              this.loadPasswordPolicies();

            } else {

              this.alert.warning(
                res?.message || 'Failed to delete password policy.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete password policy error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete password policy.'
            );

          }

        });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.passwordPolicy = this.getEmptyModel();

    this.isEdit = false;

    this.submitted = false;

  }

  //====================================================
  // Pagination
  //====================================================

  changePage(page: number): void {

    this.page = page;

  }

  changePageSize(size: number): void {

    this.pageSize = size;

    this.page = 1;

  }

}
