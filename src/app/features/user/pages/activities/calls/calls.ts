import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-calls',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './calls.html',
  styleUrl: './calls.css',
})
export class Calls {
  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = '';

  calls: any[] = [];

  call: any = {

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
    duration: '',
    priority: '',
    outcome: '',
    followUpDate: '',
    status: '',
    notes: '',
    isActive: true

  };

  constructor(

    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef

  ) { }

  ngOnInit(): void {

    this.loadCalls();

  }

  loadCalls() {

    this.spinner.show();

    setTimeout(() => {

      this.calls = [

        {
          callId: 1,
          callSubject: 'CRM Follow-up Call',
          callType: 'Follow-up Call',
          relatedTo: 'Opportunity',
          customer: 'ABC Technologies',
          contactPerson: 'Rahul Sharma',
          assignedTo: 'Sales Executive',
          direction: 'Outbound',
          callDate: '2026-07-30',
          callTime: '10:00',
          duration: 20,
          priority: 'High',
          outcome: 'Interested',
          followUpDate: '2026-08-02',
          status: 'Completed',
          notes: 'Customer requested proposal.',
          isActive: true
        },

        {
          callId: 2,
          callSubject: 'Demo Confirmation',
          callType: 'Demo Call',
          relatedTo: 'Lead',
          customer: 'XYZ Solutions',
          contactPerson: 'Priya Reddy',
          assignedTo: 'Business Executive',
          direction: 'Outbound',
          callDate: '2026-07-31',
          callTime: '11:30',
          duration: 15,
          priority: 'Medium',
          outcome: 'Connected',
          followUpDate: '2026-08-03',
          status: 'Scheduled',
          notes: 'Demo scheduled successfully.',
          isActive: true
        },

        {
          callId: 3,
          callSubject: 'Requirement Discussion',
          callType: 'Customer Discussion',
          relatedTo: 'Quotation',
          customer: 'Future Vision',
          contactPerson: 'Arjun Kumar',
          assignedTo: 'Sales Manager',
          direction: 'Inbound',
          callDate: '2026-08-01',
          callTime: '02:00',
          duration: 35,
          priority: 'High',
          outcome: 'Follow-up Required',
          followUpDate: '2026-08-04',
          status: 'Completed',
          notes: 'Need revised quotation.',
          isActive: true
        },

        {
          callId: 4,
          callSubject: 'Support Discussion',
          callType: 'Support Call',
          relatedTo: 'Account',
          customer: 'Global InfoTech',
          contactPerson: 'Sneha Patel',
          assignedTo: 'Support Engineer',
          direction: 'Inbound',
          callDate: '2026-08-02',
          callTime: '04:15',
          duration: 18,
          priority: 'Medium',
          outcome: 'Connected',
          followUpDate: '',
          status: 'Completed',
          notes: 'Issue resolved.',
          isActive: true
        },

        {
          callId: 5,
          callSubject: 'Contract Follow-up',
          callType: 'Sales Call',
          relatedTo: 'Order',
          customer: 'NextGen Pvt Ltd',
          contactPerson: 'Kiran Verma',
          assignedTo: 'Account Manager',
          direction: 'Outbound',
          callDate: '2026-08-03',
          callTime: '05:30',
          duration: 12,
          priority: 'Low',
          outcome: 'Callback Requested',
          followUpDate: '2026-08-06',
          status: 'Scheduled',
          notes: 'Customer requested callback next week.',
          isActive: true
        }

      ];

      this.calls.sort((a, b) => b.callId - a.callId);

      this.totalRecords = this.calls.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }

  saveCall() {

    this.submitted = true;

    if (

      !this.call.callSubject ||
      !this.call.callType ||
      !this.call.assignedTo ||
      !this.call.direction ||
      !this.call.callDate ||
      !this.call.callTime ||
      !this.call.status

    ) {

      return;

    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newCall = {

          ...this.call,

          callId: this.calls.length
            ? Math.max(...this.calls.map(x => x.callId)) + 1
            : 1

        };

        this.calls.unshift(newCall);

      }

      else {

        const index = this.calls.findIndex(

          x => x.callId === this.call.callId

        );

        if (index !== -1) {

          this.calls[index] = {

            ...this.call

          };

        }

      }

      // Refresh table immediately

      this.calls = [...this.calls];

      this.totalRecords = this.calls.length;

      this.page = 1;

      const message = this.isEdit
        ? 'Call updated successfully.'
        : 'Call created successfully.';

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(message);

    }, 500);

  }
    edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.calls.find(
        x => x.callId === id
      );

      if (selected) {

        this.call = {
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

          this.calls = this.calls.filter(
            x => x.callId !== id
          );

          this.totalRecords = this.calls.length;

          if (
            this.page > 1 &&
            this.pagedCalls.length === 0
          ) {
            this.page--;
          }

          // Refresh table immediately

          this.calls = [...this.calls];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Call deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.call = {

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
      duration: '',
      priority: '',
      outcome: '',
      followUpDate: '',
      status: '',
      notes: '',
      isActive: true

    };

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredCalls() {

    return this.calls.filter(x =>

      x.callSubject
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.customer
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.contactPerson
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.assignedTo
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.callType
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.direction
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.outcome
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.status
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

    );

  }

  get pagedCalls() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredCalls.slice(

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
