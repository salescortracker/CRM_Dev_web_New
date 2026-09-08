import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-emails',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './emails.html',
  styleUrl: './emails.css',
})
export class Emails {
  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = '';

  emails: any[] = [];

  email: any = {

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

  constructor(

    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef

  ) { }

  ngOnInit(): void {

    this.loadEmails();

  }

  loadEmails() {

    this.spinner.show();

    setTimeout(() => {

      this.emails = [

        {
          emailId: 1,
          emailSubject: 'CRM Product Proposal',
          emailType: 'Proposal Email',
          relatedTo: 'Opportunity',
          customer: 'ABC Technologies',
          contactPerson: 'Rahul Sharma',
          toEmail: 'rahul@abctech.com',
          cc: 'manager@abctech.com',
          assignedTo: 'Sales Executive',
          priority: 'High',
          sentDate: '2026-07-30',
          status: 'Sent',
          message: 'CRM proposal has been shared successfully.',
          isActive: true
        },

        {
          emailId: 2,
          emailSubject: 'Quotation Follow-up',
          emailType: 'Follow-up Email',
          relatedTo: 'Quotation',
          customer: 'XYZ Solutions',
          contactPerson: 'Priya Reddy',
          toEmail: 'priya@xyzsolutions.com',
          cc: '',
          assignedTo: 'Business Executive',
          priority: 'Medium',
          sentDate: '2026-07-31',
          status: 'Delivered',
          message: 'Follow-up regarding quotation approval.',
          isActive: true
        },

        {
          emailId: 3,
          emailSubject: 'Demo Invitation',
          emailType: 'Sales Email',
          relatedTo: 'Lead',
          customer: 'Future Vision',
          contactPerson: 'Arjun Kumar',
          toEmail: 'arjun@futurevision.com',
          cc: '',
          assignedTo: 'Sales Manager',
          priority: 'High',
          sentDate: '2026-08-01',
          status: 'Opened',
          message: 'Invitation sent for CRM product demo.',
          isActive: true
        },

        {
          emailId: 4,
          emailSubject: 'Support Response',
          emailType: 'Support Email',
          relatedTo: 'Account',
          customer: 'Global InfoTech',
          contactPerson: 'Sneha Patel',
          toEmail: 'sneha@globalinfo.com',
          cc: 'support@company.com',
          assignedTo: 'Support Engineer',
          priority: 'Low',
          sentDate: '2026-08-02',
          status: 'Sent',
          message: 'Issue resolved and response sent.',
          isActive: true
        },

        {
          emailId: 5,
          emailSubject: 'Contract Reminder',
          emailType: 'Reminder Email',
          relatedTo: 'Order',
          customer: 'NextGen Pvt Ltd',
          contactPerson: 'Kiran Verma',
          toEmail: 'kiran@nextgen.com',
          cc: '',
          assignedTo: 'Account Manager',
          priority: 'Medium',
          sentDate: '2026-08-03',
          status: 'Scheduled',
          message: 'Reminder regarding contract renewal.',
          isActive: true
        }

      ];

      this.emails.sort((a, b) => b.emailId - a.emailId);

      this.totalRecords = this.emails.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }

  saveEmail() {

    this.submitted = true;

    if (

      !this.email.emailSubject ||
      !this.email.emailType ||
      !this.email.toEmail ||
      !this.email.assignedTo ||
      !this.email.sentDate ||
      !this.email.status

    ) {

      return;

    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newEmail = {

          ...this.email,

          emailId: this.emails.length
            ? Math.max(...this.emails.map(x => x.emailId)) + 1
            : 1

        };

        this.emails.unshift(newEmail);

      }

      else {

        const index = this.emails.findIndex(

          x => x.emailId === this.email.emailId

        );

        if (index !== -1) {

          this.emails[index] = {

            ...this.email

          };

        }

      }

      // Refresh table immediately

      this.emails = [...this.emails];

      this.totalRecords = this.emails.length;

      this.page = 1;

      const message = this.isEdit
        ? 'Email updated successfully.'
        : 'Email created successfully.';

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(message);

    }, 500);

  }
    edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.emails.find(
        x => x.emailId === id
      );

      if (selected) {

        this.email = {
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

          this.emails = this.emails.filter(
            x => x.emailId !== id
          );

          this.totalRecords = this.emails.length;

          if (
            this.page > 1 &&
            this.pagedEmails.length === 0
          ) {

            this.page--;

          }

          // Refresh table immediately

          this.emails = [...this.emails];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Email deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.email = {

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

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredEmails() {

    return this.emails.filter(x =>

      x.emailSubject
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

      x.toEmail
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.assignedTo
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.emailType
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.priority
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.status
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

    );

  }

  get pagedEmails() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredEmails.slice(

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
