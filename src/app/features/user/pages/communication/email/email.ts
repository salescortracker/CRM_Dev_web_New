import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './email.html',
  styleUrl: './email.css',
})
export class Email {
   submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = '';

  selectedFileName = '';

  emails: any[] = [];

  email: any = {

    emailId: 0,
    subject: '',
    recipientName: '',
    recipientEmail: '',
    relatedModule: '',
    priority: '',
    attachment: '',
    status: '',
    scheduledDate: '',
    body: '',
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

  onFileSelected(event: any) {

    if (event.target.files.length > 0) {

      const file = event.target.files[0];

      this.selectedFileName = file.name;

      this.email.attachment = file.name;

    }

  }

  loadEmails() {

    this.spinner.show();

    setTimeout(() => {

      this.emails = [

        {
          emailId: 1,
          subject: 'Welcome to CRM',
          recipientName: 'John Smith',
          recipientEmail: 'john@gmail.com',
          relatedModule: 'Lead',
          priority: 'High',
          attachment: 'Welcome.pdf',
          status: 'Sent',
          scheduledDate: '2026-08-01',
          body: 'Welcome to our CRM.',
          isActive: true
        },

        {
          emailId: 2,
          subject: 'Invoice Reminder',
          recipientName: 'Robert',
          recipientEmail: 'robert@gmail.com',
          relatedModule: 'Invoice',
          priority: 'Medium',
          attachment: '',
          status: 'Scheduled',
          scheduledDate: '2026-08-04',
          body: 'Your invoice payment is pending.',
          isActive: true
        },

        {
          emailId: 3,
          subject: 'Product Demo',
          recipientName: 'David',
          recipientEmail: 'david@gmail.com',
          relatedModule: 'Opportunity',
          priority: 'Low',
          attachment: 'Demo.pdf',
          status: 'Draft',
          scheduledDate: '2026-08-06',
          body: 'Please join our product demo.',
          isActive: true
        },

        {
          emailId: 4,
          subject: 'Subscription Renewal',
          recipientName: 'Sophia',
          recipientEmail: 'sophia@gmail.com',
          relatedModule: 'Customer',
          priority: 'Urgent',
          attachment: '',
          status: 'Sent',
          scheduledDate: '2026-08-08',
          body: 'Renew your subscription today.',
          isActive: true
        },

        {
          emailId: 5,
          subject: 'Meeting Invitation',
          recipientName: 'Michael',
          recipientEmail: 'michael@gmail.com',
          relatedModule: 'Deal',
          priority: 'Medium',
          attachment: 'Meeting.pdf',
          status: 'Failed',
          scheduledDate: '2026-08-10',
          body: 'Invitation for CRM discussion.',
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

      !this.email.subject ||
      !this.email.recipientName ||
      !this.email.recipientEmail ||
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

      this.emails = [...this.emails];

      this.totalRecords = this.emails.length;

      this.page = 1;

      const message = this.isEdit

        ? 'Email updated successfully.'

        : 'Email sent successfully.';

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

        this.selectedFileName = selected.attachment || '';

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

          // Refresh table

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
      subject: '',
      recipientName: '',
      recipientEmail: '',
      relatedModule: '',
      priority: '',
      attachment: '',
      status: '',
      scheduledDate: '',
      body: '',
      isActive: true

    };

    this.selectedFileName = '';

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredEmails() {

    return this.emails.filter(x =>

      x.subject
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.recipientName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.recipientEmail
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.relatedModule
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
