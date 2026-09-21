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
  selector: 'app-meetings',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './meetings.html',
  styleUrl: './meetings.css',
})
export class Meetings implements OnInit {

  private baseUrl = environment.apiUrl;

  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  searchText = '';

  meetings: any[] = [];

  meeting: any = this.getEmptyModel();

  constructor(
    private http: HttpClient,
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  getEmptyModel() {

    return {

      meetingId: 0,
      meetingTitle: '',
      meetingType: '',
      relatedTo: '',
      customer: '',
      contactPerson: '',
      organizer: '',
      meetingDate: '',
      startTime: '',
      endTime: '',
      meetingMode: '',
      location: '',
      priority: '',
      reminder: '',
      status: '',
      agenda: '',
      isActive: true

    };

  }

  ngOnInit(): void {

    this.loadMeetings();

  }

  //====================================================
  // Load
  //====================================================

  loadMeetings(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getallactivitymeetings`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            // Times arrive as HH:mm:ss - the grid shows HH:mm
            this.meetings = (res.data || []).map((x: any) => ({
              ...x,
              startTime: fromApiTime(x.startTime),
              endTime: fromApiTime(x.endTime)
            }));

          } else {

            this.meetings = [];

            this.alert.warning(res?.message || 'No Meetings found.');

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Load meetings error:', err);

          this.meetings = [];

          this.alert.error(err?.error?.message || 'Failed to load Meetings.');

          this.cd.detectChanges();

        }

      });

  }

  //====================================================
  // Save (Create / Update)
  //====================================================

  saveMeeting(): void {

    this.submitted = true;

    if (
      !this.meeting.meetingTitle?.trim() ||
      !this.meeting.meetingType ||
      !this.meeting.organizer?.trim() ||
      !this.meeting.meetingDate ||
      !this.meeting.startTime ||
      !this.meeting.meetingMode ||
      !this.meeting.status
    ) {
      return;
    }

    if (
      this.meeting.endTime &&
      this.meeting.endTime <= this.meeting.startTime
    ) {
      this.alert.warning('End Time must be later than Start Time.');
      return;
    }

    const payload = {

      meetingId: this.meeting.meetingId,
      meetingTitle: this.meeting.meetingTitle.trim(),
      meetingType: this.meeting.meetingType,
      relatedTo: nullIfEmpty(this.meeting.relatedTo),
      customer: nullIfEmpty(this.meeting.customer),
      contactPerson: nullIfEmpty(this.meeting.contactPerson),
      organizer: this.meeting.organizer.trim(),
      meetingDate: this.meeting.meetingDate,
      startTime: toApiTime(this.meeting.startTime),
      endTime: toApiTime(this.meeting.endTime),
      meetingMode: this.meeting.meetingMode,
      location: nullIfEmpty(this.meeting.location),
      priority: nullIfEmpty(this.meeting.priority),
      reminder: nullIfEmpty(this.meeting.reminder),
      status: this.meeting.status,
      agenda: nullIfEmpty(this.meeting.agenda),
      isActive: !!this.meeting.isActive

    };

    const url = this.isEdit
      ? `${this.baseUrl}/Admin/updateactivitymeeting`
      : `${this.baseUrl}/Admin/createactivitymeeting`;

    const failMessage = this.isEdit
      ? 'Failed to update Meeting.'
      : 'Failed to create Meeting.';

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

            this.loadMeetings();

          } else {

            this.alert.warning(res?.message || failMessage);

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Save meeting error:', err);

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
      .get<ApiResponse<any>>(`${this.baseUrl}/Admin/getbyactivitymeeting/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.meeting = {

              meetingId: data.meetingId,
              meetingTitle: data.meetingTitle || '',
              meetingType: data.meetingType || '',
              relatedTo: data.relatedTo || '',
              customer: data.customer || '',
              contactPerson: data.contactPerson || '',
              organizer: data.organizer || '',
              meetingDate: data.meetingDate || '',
              startTime: fromApiTime(data.startTime),
              endTime: fromApiTime(data.endTime),
              meetingMode: data.meetingMode || '',
              location: data.location || '',
              priority: data.priority || '',
              reminder: data.reminder || '',
              status: data.status || '',
              agenda: data.agenda || '',
              isActive: !!data.isActive

            };

            this.isEdit = true;

            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'Meeting not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get meeting error:', err);

          this.alert.error(err?.error?.message || 'Failed to load Meeting.');

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
        .post<ApiResponse>(`${this.baseUrl}/Admin/deleteactivitymeeting/${id}`, {})
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(res.message);

              // Editing the record that was just deleted - reset the form
              if (this.meeting.meetingId === id) {
                this.clear();
              }

              if (this.page > 1 && this.pagedMeetings.length === 1) {
                this.page = this.page - 1;
              }

              this.loadMeetings();

            } else {

              this.alert.warning(res?.message || 'Failed to delete Meeting.');

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete meeting error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete Meeting.'
            );

          }

        });

    });

  }

  //====================================================
  // Clear
  //====================================================

  clear(): void {

    this.meeting = this.getEmptyModel();

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  //====================================================
  // Search / Pagination
  //====================================================

  get filteredMeetings() {

    const search = this.searchText.toLowerCase();

    return this.meetings.filter(x =>

      (x.meetingTitle || '').toLowerCase().includes(search) ||

      (x.meetingType || '').toLowerCase().includes(search) ||

      (x.customer || '').toLowerCase().includes(search) ||

      (x.organizer || '').toLowerCase().includes(search) ||

      (x.meetingMode || '').toLowerCase().includes(search) ||

      (x.status || '').toLowerCase().includes(search)

    );

  }

  get pagedMeetings() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredMeetings.slice(start, start + this.pageSize);

  }

  changePage(page: number) {

    this.page = page;

  }

  changePageSize(size: number) {

    this.pageSize = size;

    this.page = 1;

  }

}
