import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-whatsapp',
  standalone:true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './whatsapp.html',
  styleUrl: './whatsapp.css',
})
export class Whatsapp {
   submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = '';

  selectedFileName = '';

  messages: any[] = [];

  message: any = {

    messageId: 0,
    recipientName: '',
    mobileNumber: '',
    template: '',
    relatedModule: '',
    mediaType: '',
    priority: '',
    attachment: '',
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

  onFileSelected(event: any) {

    if (event.target.files.length > 0) {

      const file = event.target.files[0];

      this.selectedFileName = file.name;

      this.message.attachment = file.name;

    }

  }

  loadMessages() {

    this.spinner.show();

    setTimeout(() => {

      this.messages = [

        {
          messageId: 1,
          recipientName: 'John Smith',
          mobileNumber: '9876543210',
          template: 'Welcome Message',
          relatedModule: 'Lead',
          mediaType: 'Text',
          priority: 'High',
          attachment: '',
          status: 'Delivered',
          scheduledDate: '2026-08-01',
          messageBody: 'Welcome to our CRM. We are happy to assist you.',
          isActive: true
        },

        {
          messageId: 2,
          recipientName: 'Robert',
          mobileNumber: '9876543211',
          template: 'Payment Reminder',
          relatedModule: 'Invoice',
          mediaType: 'PDF',
          priority: 'Urgent',
          attachment: 'Invoice.pdf',
          status: 'Sent',
          scheduledDate: '2026-08-03',
          messageBody: 'Please clear your pending invoice.',
          isActive: true
        },

        {
          messageId: 3,
          recipientName: 'Sophia',
          mobileNumber: '9876543212',
          template: 'Meeting Reminder',
          relatedModule: 'Deal',
          mediaType: 'Image',
          priority: 'Medium',
          attachment: 'Meeting.png',
          status: 'Scheduled',
          scheduledDate: '2026-08-05',
          messageBody: 'Reminder for tomorrow meeting.',
          isActive: true
        },

        {
          messageId: 4,
          recipientName: 'David',
          mobileNumber: '9876543213',
          template: 'Product Information',
          relatedModule: 'Opportunity',
          mediaType: 'Video',
          priority: 'Low',
          attachment: 'Demo.mp4',
          status: 'Read',
          scheduledDate: '2026-08-06',
          messageBody: 'Please check our latest product demo.',
          isActive: true
        },

        {
          messageId: 5,
          recipientName: 'Michael',
          mobileNumber: '9876543214',
          template: 'Follow-up',
          relatedModule: 'Customer',
          mediaType: 'Document',
          priority: 'Medium',
          attachment: 'Quotation.docx',
          status: 'Failed',
          scheduledDate: '2026-08-08',
          messageBody: 'Following up regarding our previous discussion.',
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

      !this.message.recipientName ||
      !this.message.mobileNumber ||
      !this.message.status

    ) {

      return;

    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newMessage = {

          ...this.message,

          messageId: this.messages.length
            ? Math.max(...this.messages.map(x => x.messageId)) + 1
            : 1

        };

        this.messages.unshift(newMessage);

      }

      else {

        const index = this.messages.findIndex(

          x => x.messageId === this.message.messageId

        );

        if (index !== -1) {

          this.messages[index] = {

            ...this.message

          };

        }

      }

      this.messages = [...this.messages];

      this.totalRecords = this.messages.length;

      this.page = 1;

      const successMessage = this.isEdit

        ? 'WhatsApp message updated successfully.'

        : 'WhatsApp message sent successfully.';

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

        this.message = {
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

          // Refresh table immediately

          this.messages = [...this.messages];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'WhatsApp message deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.message = {

      messageId: 0,
      recipientName: '',
      mobileNumber: '',
      template: '',
      relatedModule: '',
      mediaType: '',
      priority: '',
      attachment: '',
      status: '',
      scheduledDate: '',
      messageBody: '',
      isActive: true

    };

    this.selectedFileName = '';

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

      x.template
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
