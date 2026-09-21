import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { ApiResponse } from '../../../../../core/authentication/services/auth.service';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';
import { fromApiTime, nullIfEmpty, toApiTime, toNumberOrNull } from '../activities.util';

@Component({
  selector: 'app-calls',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './calls.html',
  styleUrl: './calls.css',
})
export class Calls implements OnInit {

  private baseUrl = environment.apiUrl;

  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  searchText = '';

  calls: any[] = [];

  call: any = this.getEmptyModel();

  constructor(
    private http: HttpClient,
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  getEmptyModel() {

    return {

      callId: 0,
      callSubject: '',
      callType: '',
      relatedTo: '',
      customer: '',
      contactPerson: '',
      assignedTo: '',
      direction: '',
      callDate: '',
      callTime: '',
      duration: null,
      priority: '',
      outcome: '',
      followUpDate: '',
      status: '',
      notes: '',
      isActive: true

    };

  }

  ngOnInit(): void {

    this.loadCalls();

  }

  //====================================================
  // Load
  //====================================================

  loadCalls(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getallactivitycalls`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            // Times arrive as HH:mm:ss - the grid shows HH:mm
            this.calls = (res.data || []).map((x: any) => ({
              ...x,
              callTime: fromApiTime(x.callTime)
            }));

          } else {

            this.calls = [];

            this.alert.warning(res?.message || 'No Calls found.');

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Load calls error:', err);

          this.calls = [];

          this.alert.error(err?.error?.message || 'Failed to load Calls.');

          this.cd.detectChanges();

        }

      });

  }

  //====================================================
  // Save (Create / Update)
  //====================================================

  saveCall(): void {

    this.submitted = true;

    if (
      !this.call.callSubject?.trim() ||
      !this.call.callType ||
      !this.call.assignedTo?.trim() ||
      !this.call.direction ||
      !this.call.callDate ||
      !this.call.callTime ||
      !this.call.status
    ) {
      return;
    }

    const duration = toNumberOrNull(this.call.duration);

    if (duration !== null && duration < 0) {
      this.alert.warning('Duration cannot be negative.');
      return;
    }

    const payload = {

      callId: this.call.callId,
      callSubject: this.call.callSubject.trim(),
      callType: this.call.callType,
      relatedTo: nullIfEmpty(this.call.relatedTo),
      customer: nullIfEmpty(this.call.customer),
      contactPerson: nullIfEmpty(this.call.contactPerson),
      assignedTo: this.call.assignedTo.trim(),
      direction: this.call.direction,
      callDate: this.call.callDate,
      callTime: toApiTime(this.call.callTime),
      duration: duration,
      priority: nullIfEmpty(this.call.priority),
      outcome: nullIfEmpty(this.call.outcome),
      followUpDate: this.call.followUpDate || null,
      status: this.call.status,
      notes: nullIfEmpty(this.call.notes),
      isActive: !!this.call.isActive

    };

    const url = this.isEdit
      ? `${this.baseUrl}/Admin/updateactivitycall`
      : `${this.baseUrl}/Admin/createactivitycall`;

    const failMessage = this.isEdit
      ? 'Failed to update Call.'
      : 'Failed to create Call.';

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

            this.loadCalls();

          } else {

            this.alert.warning(res?.message || failMessage);

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Save call error:', err);

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
      .get<ApiResponse<any>>(`${this.baseUrl}/Admin/getbyactivitycall/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.call = {

              callId: data.callId,
              callSubject: data.callSubject || '',
              callType: data.callType || '',
              relatedTo: data.relatedTo || '',
              customer: data.customer || '',
              contactPerson: data.contactPerson || '',
              assignedTo: data.assignedTo || '',
              direction: data.direction || '',
              callDate: data.callDate || '',
              callTime: fromApiTime(data.callTime),
              duration: data.duration ?? null,
              priority: data.priority || '',
              outcome: data.outcome || '',
              followUpDate: data.followUpDate || '',
              status: data.status || '',
              notes: data.notes || '',
              isActive: !!data.isActive

            };

            this.isEdit = true;

            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'Call not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get call error:', err);

          this.alert.error(err?.error?.message || 'Failed to load Call.');

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
        .post<ApiResponse>(`${this.baseUrl}/Admin/deleteactivitycall/${id}`, {})
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(res.message);

              // Editing the record that was just deleted - reset the form
              if (this.call.callId === id) {
                this.clear();
              }

              if (this.page > 1 && this.pagedCalls.length === 1) {
                this.page = this.page - 1;
              }

              this.loadCalls();

            } else {

              this.alert.warning(res?.message || 'Failed to delete Call.');

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete call error:', err);

            this.alert.error(err?.error?.message || 'Failed to delete Call.');

          }

        });

    });

  }

  //====================================================
  // Clear
  //====================================================

  clear(): void {

    this.call = this.getEmptyModel();

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  //====================================================
  // Search / Pagination
  //====================================================

  get filteredCalls() {

    const search = this.searchText.toLowerCase();

    return this.calls.filter(x =>

      (x.callSubject || '').toLowerCase().includes(search) ||

      (x.customer || '').toLowerCase().includes(search) ||

      (x.contactPerson || '').toLowerCase().includes(search) ||

      (x.assignedTo || '').toLowerCase().includes(search) ||

      (x.callType || '').toLowerCase().includes(search) ||

      (x.direction || '').toLowerCase().includes(search) ||

      (x.outcome || '').toLowerCase().includes(search) ||

      (x.status || '').toLowerCase().includes(search)

    );

  }

  get pagedCalls() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredCalls.slice(start, start + this.pageSize);

  }

  changePage(page: number) {

    this.page = page;

  }

  changePageSize(size: number) {

    this.pageSize = size;

    this.page = 1;

  }

}
