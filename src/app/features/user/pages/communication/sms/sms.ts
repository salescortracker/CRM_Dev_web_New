import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-sms',
  standalone:true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './sms.html',
  styleUrl: './sms.css',
})
export class Sms {
   submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = '';

  messages: any[] = [];

  sms: any = {

    messageId: 0,
    recipientName: '',
    mobileNumber: '',
    senderId: '',
    relatedModule: '',
    priority: '',
    smsType: '',
    status: '',
    scheduledDate: '',
    messageBody: '',
    isActive: true

  };

  constructor(

    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef

  ) { }

  ngOnInit(): void {

    this.loadMessages();

  }

  loadMessages() {

    this.spinner.show();

    setTimeout(() => {

      this.messages = [

        {
          messageId: 1,
          recipientName: 'John Smith',
          mobileNumber: '9876543210',
          senderId: 'CRMAPP',
          relatedModule: 'Lead',
          priority: 'High',
          smsType: 'Transactional',
          status: 'Sent',
          scheduledDate: '2026-08-01',
          messageBody: 'Thank you for your interest. Our team will contact you shortly.',
          isActive: true
        },

        {
          messageId: 2,
          recipientName: 'Sophia',
          mobileNumber: '9876543211',
          senderId: 'CRMAPP',
          relatedModule: 'Customer',
          priority: 'Medium',
          smsType: 'Promotional',
          status: 'Scheduled',
          scheduledDate: '2026-08-04',
          messageBody: 'Special offers available this week. Contact us today.',
          isActive: true
        },

        {
          messageId: 3,
          recipientName: 'David',
          mobileNumber: '9876543212',
          senderId: 'CRMOTP',
          relatedModule: 'Opportunity',
          priority: 'Urgent',
          smsType: 'OTP',
          status: 'Delivered',
          scheduledDate: '2026-08-06',
          messageBody: 'Your OTP is 568921.',
          isActive: true
        },

        {
          messageId: 4,
          recipientName: 'Michael',
          mobileNumber: '9876543213',
          senderId: 'CRMAPP',
          relatedModule: 'Invoice',
          priority: 'Low',
          smsType: 'Notification',
          status: 'Draft',
          scheduledDate: '2026-08-08',
          messageBody: 'Invoice has been generated successfully.',
          isActive: true
        },

        {
          messageId: 5,
          recipientName: 'Robert',
          mobileNumber: '9876543214',
          senderId: 'CRMAPP',
          relatedModule: 'Deal',
          priority: 'High',
          smsType: 'Transactional',
          status: 'Failed',
          scheduledDate: '2026-08-10',
          messageBody: 'Meeting has been rescheduled.',
          isActive: true
        }

      ];

      this.messages.sort((a, b) => b.messageId - a.messageId);

      this.totalRecords = this.messages.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }

  saveMessage() {

    this.submitted = true;

    if (

      !this.sms.recipientName ||
      !this.sms.mobileNumber ||
      !this.sms.senderId ||
      !this.sms.status

    ) {

      return;

    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newMessage = {

          ...this.sms,

          messageId: this.messages.length
            ? Math.max(...this.messages.map(x => x.messageId)) + 1
            : 1

        };

        this.messages.unshift(newMessage);

      }

      else {

        const index = this.messages.findIndex(

          x => x.messageId === this.sms.messageId

        );

        if (index !== -1) {

          this.messages[index] = {

            ...this.sms

          };

        }

      }

      this.messages = [...this.messages];

      this.totalRecords = this.messages.length;

      this.page = 1;

      const successMessage = this.isEdit

        ? 'SMS updated successfully.'

        : 'SMS sent successfully.';

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(successMessage);

    }, 500);

  }
    edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.messages.find(
        x => x.messageId === id
      );

      if (selected) {

        this.sms = {
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

          this.messages = this.messages.filter(
            x => x.messageId !== id
          );

          this.totalRecords = this.messages.length;

          if (
            this.page > 1 &&
            this.pagedMessages.length === 0
          ) {

            this.page--;

          }

          // Refresh table

          this.messages = [...this.messages];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'SMS deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.sms = {

      messageId: 0,
      recipientName: '',
      mobileNumber: '',
      senderId: '',
      relatedModule: '',
      priority: '',
      smsType: '',
      status: '',
      scheduledDate: '',
      messageBody: '',
      isActive: true

    };

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredMessages() {

    return this.messages.filter(x =>

      x.recipientName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.mobileNumber
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.senderId
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

      x.smsType
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.status
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

    );

  }

  get pagedMessages() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredMessages.slice(

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
