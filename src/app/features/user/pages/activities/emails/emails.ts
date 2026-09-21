import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { ApiResponse } from '../../../../../core/authentication/services/auth.service';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';
import { isValidEmailList, nullIfEmpty } from '../activities.util';

@Component({
  selector: 'app-emails',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './emails.html',
  styleUrl: './emails.css',
})
export class Emails implements OnInit {

  private baseUrl = environment.apiUrl;

  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  searchText = '';

  emails: any[] = [];

  email: any = this.getEmptyModel();

  constructor(
    private http: HttpClient,
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  getEmptyModel() {

    return {

      emailId: 0,
      emailSubject: '',
      emailType: '',
      relatedTo: '',
      customer: '',
      contactPerson: '',
      toEmail: '',
      cc: '',
      assignedTo: '',
      priority: '',
      sentDate: '',
      status: '',
      message: '',
      isActive: true

    };

  }

  ngOnInit(): void {

    this.loadEmails();

  }

  //====================================================
  // Load
  //====================================================

  loadEmails(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getallactivityemails`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.emails = res.data || [];

          } else {

            this.emails = [];

            this.alert.warning(res?.message || 'No Emails found.');

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Load emails error:', err);

          this.emails = [];

          this.alert.error(err?.error?.message || 'Failed to load Emails.');

          this.cd.detectChanges();

        }

      });

  }

  //====================================================
  // Save (Create / Update)
  //====================================================

  saveEmail(): void {

    this.submitted = true;

    if (
      !this.email.emailSubject?.trim() ||
      !this.email.emailType ||
      !this.email.toEmail?.trim() ||
      !this.email.assignedTo?.trim() ||
      !this.email.sentDate ||
      !this.email.status
    ) {
      return;
    }

    if (!isValidEmailList(this.email.toEmail)) {
      this.alert.warning('To Email is not a valid email address.');
      return;
    }

    if (this.email.cc?.trim() && !isValidEmailList(this.email.cc)) {
      this.alert.warning('CC is not a valid email address.');
      return;
    }

    const payload = {

      emailId: this.email.emailId,
      emailSubject: this.email.emailSubject.trim(),
      emailType: this.email.emailType,
      relatedTo: nullIfEmpty(this.email.relatedTo),
      customer: nullIfEmpty(this.email.customer),
      contactPerson: nullIfEmpty(this.email.contactPerson),
      toEmail: this.email.toEmail.trim(),
      cc: nullIfEmpty(this.email.cc),
      assignedTo: this.email.assignedTo.trim(),
      priority: nullIfEmpty(this.email.priority),
      sentDate: this.email.sentDate,
      status: this.email.status,
      message: nullIfEmpty(this.email.message),
      isActive: !!this.email.isActive

    };

    const url = this.isEdit
      ? `${this.baseUrl}/Admin/updateactivityemail`
      : `${this.baseUrl}/Admin/createactivityemail`;

    const failMessage = this.isEdit
      ? 'Failed to update Email.'
      : 'Failed to create Email.';

    this.spinner.show();

    this.http
      .post<ApiResponse>(url, payload)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(res.message);

            this.clear();

            this.page = 1;

            this.loadEmails();

          } else {

            this.alert.warning(res?.message || failMessage);

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Save email error:', err);

          this.alert.error(err?.error?.message || failMessage);

        }

      });

  }

  //====================================================
  // Edit
  //====================================================

  edit(id: number): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any>>(`${this.baseUrl}/Admin/getbyactivityemail/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.email = {

              emailId: data.emailId,
              emailSubject: data.emailSubject || '',
              emailType: data.emailType || '',
              relatedTo: data.relatedTo || '',
              customer: data.customer || '',
              contactPerson: data.contactPerson || '',
              toEmail: data.toEmail || '',
              cc: data.cc || '',
              assignedTo: data.assignedTo || '',
              priority: data.priority || '',
              sentDate: data.sentDate || '',
              status: data.status || '',
              message: data.message || '',
              isActive: !!data.isActive

            };

            this.isEdit = true;

            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'Email not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get email error:', err);

          this.alert.error(err?.error?.message || 'Failed to load Email.');

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
        .post<ApiResponse>(`${this.baseUrl}/Admin/deleteactivityemail/${id}`, {})
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(res.message);

              // Editing the record that was just deleted - reset the form
              if (this.email.emailId === id) {
                this.clear();
              }

              if (this.page > 1 && this.pagedEmails.length === 1) {
                this.page = this.page - 1;
              }

              this.loadEmails();

            } else {

              this.alert.warning(res?.message || 'Failed to delete Email.');

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete email error:', err);

            this.alert.error(err?.error?.message || 'Failed to delete Email.');

          }

        });

    });

  }

  //====================================================
  // Clear
  //====================================================

  clear(): void {

    this.email = this.getEmptyModel();

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  //====================================================
  // Search / Pagination
  //====================================================

  get filteredEmails() {

    const search = this.searchText.toLowerCase();

    return this.emails.filter(x =>

      (x.emailSubject || '').toLowerCase().includes(search) ||

      (x.customer || '').toLowerCase().includes(search) ||

      (x.contactPerson || '').toLowerCase().includes(search) ||

      (x.toEmail || '').toLowerCase().includes(search) ||

      (x.assignedTo || '').toLowerCase().includes(search) ||

      (x.emailType || '').toLowerCase().includes(search) ||

      (x.priority || '').toLowerCase().includes(search) ||

      (x.status || '').toLowerCase().includes(search)

    );

  }

  get pagedEmails() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredEmails.slice(start, start + this.pageSize);

  }

  changePage(page: number) {

    this.page = page;

  }

  changePageSize(size: number) {

    this.pageSize = size;

    this.page = 1;

  }

}
