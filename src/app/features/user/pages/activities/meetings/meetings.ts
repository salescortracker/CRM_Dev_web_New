import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-meetings',
  standalone:true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './meetings.html',
  styleUrl: './meetings.css',
})
export class Meetings {
   submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = '';

  meetings: any[] = [];

  meeting: any = {

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

  constructor(

    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef

  ) { }

  ngOnInit(): void {

    this.loadMeetings();

  }

  loadMeetings() {

    this.spinner.show();

    setTimeout(() => {

      this.meetings = [

        {
          meetingId: 1,
          meetingTitle: 'CRM Product Demo',
          meetingType: 'Product Demo',
          relatedTo: 'Opportunity',
          customer: 'ABC Technologies',
          contactPerson: 'Rahul Sharma',
          organizer: 'Sales Executive',
          meetingDate: '2026-07-30',
          startTime: '10:00',
          endTime: '11:00',
          meetingMode: 'Online',
          location: 'Microsoft Teams',
          priority: 'High',
          reminder: '30 Minutes Before',
          status: 'Scheduled',
          agenda: 'CRM Product Demonstration',
          isActive: true
        },

        {
          meetingId: 2,
          meetingTitle: 'Requirement Discussion',
          meetingType: 'Requirement Gathering',
          relatedTo: 'Lead',
          customer: 'XYZ Solutions',
          contactPerson: 'Priya Reddy',
          organizer: 'Business Analyst',
          meetingDate: '2026-07-31',
          startTime: '02:00',
          endTime: '03:30',
          meetingMode: 'Offline',
          location: 'Hyderabad Office',
          priority: 'Medium',
          reminder: '1 Hour Before',
          status: 'Completed',
          agenda: 'Requirement Collection',
          isActive: true
        },

        {
          meetingId: 3,
          meetingTitle: 'Sales Review',
          meetingType: 'Review Meeting',
          relatedTo: 'Quotation',
          customer: 'Future Vision',
          contactPerson: 'Arjun Kumar',
          organizer: 'Sales Manager',
          meetingDate: '2026-08-02',
          startTime: '11:00',
          endTime: '12:00',
          meetingMode: 'Hybrid',
          location: 'Conference Room',
          priority: 'High',
          reminder: '15 Minutes Before',
          status: 'Scheduled',
          agenda: 'Monthly Sales Review',
          isActive: true
        },

        {
          meetingId: 4,
          meetingTitle: 'Implementation Planning',
          meetingType: 'Project Discussion',
          relatedTo: 'Order',
          customer: 'Global InfoTech',
          contactPerson: 'Sneha Patel',
          organizer: 'Project Manager',
          meetingDate: '2026-08-04',
          startTime: '03:00',
          endTime: '04:30',
          meetingMode: 'Online',
          location: 'Google Meet',
          priority: 'Medium',
          reminder: '30 Minutes Before',
          status: 'Rescheduled',
          agenda: 'Implementation Plan Discussion',
          isActive: true
        },

        {
          meetingId: 5,
          meetingTitle: 'Customer Feedback',
          meetingType: 'Customer Meeting',
          relatedTo: 'Account',
          customer: 'NextGen Pvt Ltd',
          contactPerson: 'Kiran Verma',
          organizer: 'Account Manager',
          meetingDate: '2026-08-06',
          startTime: '05:00',
          endTime: '06:00',
          meetingMode: 'Offline',
          location: 'Client Office',
          priority: 'Low',
          reminder: '1 Day Before',
          status: 'Scheduled',
          agenda: 'Quarterly Customer Feedback',
          isActive: true
        }

      ];

      this.meetings.sort((a, b) => b.meetingId - a.meetingId);

      this.totalRecords = this.meetings.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }

  saveMeeting() {

    this.submitted = true;

    if (

      !this.meeting.meetingTitle ||
      !this.meeting.meetingType ||
      !this.meeting.organizer ||
      !this.meeting.meetingDate ||
      !this.meeting.startTime ||
      !this.meeting.meetingMode ||
      !this.meeting.status

    ) {

      return;

    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newMeeting = {

          ...this.meeting,

          meetingId: this.meetings.length
            ? Math.max(...this.meetings.map(x => x.meetingId)) + 1
            : 1

        };

        this.meetings.unshift(newMeeting);

      }

      else {

        const index = this.meetings.findIndex(

          x => x.meetingId === this.meeting.meetingId

        );

        if (index !== -1) {

          this.meetings[index] = {

            ...this.meeting

          };

        }

      }

      // Refresh table immediately

      this.meetings = [...this.meetings];

      this.totalRecords = this.meetings.length;

      this.page = 1;

      const message = this.isEdit

        ? 'Meeting updated successfully.'

        : 'Meeting created successfully.';

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(message);

    }, 500);

  }
    edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.meetings.find(
        x => x.meetingId === id
      );

      if (selected) {

        this.meeting = {
          ...selected
        };

        this.isEdit = true;

        this.submitted = false;

        this.cd.detectChanges();

      }

      this.spinner.hide();

    }, 300);

  }

  delete(id: number) {

    this.alert.deleteConfirm().then(result => {

      if (result.isConfirmed) {

        this.spinner.show();

        setTimeout(() => {

          this.meetings = this.meetings.filter(
            x => x.meetingId !== id
          );

          this.totalRecords = this.meetings.length;

          if (
            this.page > 1 &&
            this.pagedMeetings.length === 0
          ) {
            this.page--;
          }

          // Refresh table immediately

          this.meetings = [...this.meetings];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Meeting deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.meeting = {

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

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredMeetings() {

    return this.meetings.filter(x =>

      x.meetingTitle
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.meetingType
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.customer
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.organizer
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.meetingMode
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.status
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

    );

  }

  get pagedMeetings() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredMeetings.slice(

      start,

      start + this.pageSize

    );

  }

  changePage(page: number) {

    this.page = page;

  }

  changePageSize(size: number) {

    this.pageSize = size;

    this.page = 1;

  }


}
