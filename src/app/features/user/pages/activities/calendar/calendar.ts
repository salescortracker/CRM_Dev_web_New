import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { ApiResponse } from '../../../../../core/authentication/services/auth.service';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';
import { fromApiTime, nullIfEmpty, toApiTime } from '../activities.util';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar implements OnInit {

  private baseUrl = environment.apiUrl;

  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  searchText = '';

  events: any[] = [];

  event: any = this.getEmptyModel();

  constructor(
    private http: HttpClient,
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  getEmptyModel() {

    return {

      eventId: 0,
      title: '',
      eventType: '',
      relatedTo: '',
      customer: '',
      contactPerson: '',
      assignedTo: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      priority: '',
      reminder: '',
      status: '',
      description: '',
      isActive: true

    };

  }

  ngOnInit(): void {

    this.loadEvents();

  }

  //====================================================
  // Load
  //====================================================

  loadEvents(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getallcalendarevents`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            // Times arrive as HH:mm:ss - the grid shows HH:mm
            this.events = (res.data || []).map((x: any) => ({
              ...x,
              startTime: fromApiTime(x.startTime),
              endTime: fromApiTime(x.endTime)
            }));

          } else {

            this.events = [];

            this.alert.warning(res?.message || 'No Calendar Events found.');

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Load calendar events error:', err);

          this.events = [];

          this.alert.error(
            err?.error?.message || 'Failed to load Calendar Events.'
          );

          this.cd.detectChanges();

        }

      });

  }

  //====================================================
  // Save (Create / Update)
  //====================================================

  saveEvent(): void {

    this.submitted = true;

    if (
      !this.event.title?.trim() ||
      !this.event.eventType ||
      !this.event.startDate ||
      !this.event.startTime ||
      !this.event.status
    ) {
      return;
    }

    if (this.event.endDate && this.event.endDate < this.event.startDate) {
      this.alert.warning('End Date cannot be earlier than Start Date.');
      return;
    }

    // No end date means the event ends on the start date
    const endDate = this.event.endDate || this.event.startDate;

    if (
      this.event.endTime &&
      endDate === this.event.startDate &&
      this.event.endTime <= this.event.startTime
    ) {
      this.alert.warning('End Time must be later than Start Time.');
      return;
    }

    const payload = {

      eventId: this.event.eventId,
      title: this.event.title.trim(),
      eventType: this.event.eventType,
      relatedTo: nullIfEmpty(this.event.relatedTo),
      customer: nullIfEmpty(this.event.customer),
      contactPerson: nullIfEmpty(this.event.contactPerson),
      assignedTo: nullIfEmpty(this.event.assignedTo),
      startDate: this.event.startDate,
      startTime: toApiTime(this.event.startTime),
      endDate: this.event.endDate || null,
      endTime: toApiTime(this.event.endTime),
      priority: nullIfEmpty(this.event.priority),
      reminder: nullIfEmpty(this.event.reminder),
      status: this.event.status,
      description: nullIfEmpty(this.event.description),
      isActive: !!this.event.isActive

    };

    const url = this.isEdit
      ? `${this.baseUrl}/Admin/updatecalendarevent`
      : `${this.baseUrl}/Admin/createcalendarevent`;

    const failMessage = this.isEdit
      ? 'Failed to update Calendar Event.'
      : 'Failed to create Calendar Event.';

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

            this.loadEvents();

          } else {

            this.alert.warning(res?.message || failMessage);

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Save calendar event error:', err);

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
      .get<ApiResponse<any>>(`${this.baseUrl}/Admin/getbycalendarevent/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.event = {

              eventId: data.eventId,
              title: data.title || '',
              eventType: data.eventType || '',
              relatedTo: data.relatedTo || '',
              customer: data.customer || '',
              contactPerson: data.contactPerson || '',
              assignedTo: data.assignedTo || '',
              startDate: data.startDate || '',
              startTime: fromApiTime(data.startTime),
              endDate: data.endDate || '',
              endTime: fromApiTime(data.endTime),
              priority: data.priority || '',
              reminder: data.reminder || '',
              status: data.status || '',
              description: data.description || '',
              isActive: !!data.isActive

            };

            this.isEdit = true;

            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'Calendar Event not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get calendar event error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to load Calendar Event.'
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
        .post<ApiResponse>(`${this.baseUrl}/Admin/deletecalendarevent/${id}`, {})
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(res.message);

              // Editing the record that was just deleted - reset the form
              if (this.event.eventId === id) {
                this.clear();
              }

              if (this.page > 1 && this.pagedEvents.length === 1) {
                this.page = this.page - 1;
              }

              this.loadEvents();

            } else {

              this.alert.warning(
                res?.message || 'Failed to delete Calendar Event.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete calendar event error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete Calendar Event.'
            );

          }

        });

    });

  }

  //====================================================
  // Clear
  //====================================================

  clear(): void {

    this.event = this.getEmptyModel();

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  //====================================================
  // Search / Pagination
  //====================================================

  get filteredEvents() {

    const search = this.searchText.toLowerCase();

    return this.events.filter(x =>

      (
        (x.title || '') + ' ' +
        (x.eventType || '') + ' ' +
        (x.customer || '') + ' ' +
        (x.contactPerson || '') + ' ' +
        (x.status || '')
      )
        .toLowerCase()
        .includes(search)

    );

  }

  get pagedEvents() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredEvents.slice(start, start + this.pageSize);

  }

  changePage(page: number) {

    this.page = page;

  }

  changePageSize(size: number) {

    this.pageSize = size;

    this.page = 1;

  }

}
