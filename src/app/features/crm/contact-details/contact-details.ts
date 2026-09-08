import {
  Component,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-details',
 imports: [
    CommonModule,FormsModule
  ],
  templateUrl: './contact-details.html',
  styleUrl: './contact-details.css',
})
export class ContactDetails {
 // =========================================================
  // ACTIVE TAB
  // =========================================================

  activeTab: string = 'overview';


  // =========================================================
  // MODALS
  // =========================================================

  activeModal:
    | ''
    | 'call'
    | 'email'
    | 'followup'
    | 'note' = '';


  // =========================================================
  // CALL PANEL
  // =========================================================

  callPanelOpen: boolean = false;

  callInProgress: boolean = false;

  callMuted: boolean = false;

  callDuration: string = '00:00';

  private callTimer: ReturnType<typeof setInterval> | null = null;

  private callStartTime: number = 0;


  // =========================================================
  // EMAIL OPTIONS
  // =========================================================

  emailCcOpen: boolean = false;

  emailBccOpen: boolean = false;


  // =========================================================
  // CONTACT
  // =========================================================

  contact = {

    id: 'CON-1001',

    name: 'Rajesh Kumar',

    initials: 'RK',

    color: 'blue',

    status: 'Active',

    designation: 'Chief Executive Officer',

    department: 'Management',

    company: 'ABC Technologies',

    companyId: 'COM-1001',

    email: 'rajesh@abctech.com',

    phone: '+91 98765 43210',

    alternatePhone: '+91 98765 11122',

    website: 'www.abctech.com',

    contactType: 'Decision Maker',

    relationship: 'Prospect',

    addressLine1: 'Plot 25, HITEC City',

    addressLine2: 'Madhapur',

    city: 'Hyderabad',

    state: 'Telangana',

    country: 'India',

    postalCode: '500081'

  };


  // =========================================================
  // CALL FORM
  // =========================================================

  callForm = {

    type: 'Outbound',

    outcome: '',

    duration: '00:00',

    notes: ''

  };


  // =========================================================
  // EMAIL FORM
  // =========================================================

  emailForm = {

    to: this.contact.email,

    cc: '',

    bcc: '',

    subject: '',

    message: ''

  };


  // =========================================================
  // FOLLOW-UP FORM
  // =========================================================

  followupForm = {

    subject: '',

    type: 'Call',

    priority: 'Medium',

    date: this.getTomorrowDate(),

    time: '11:00',

    description: '',

    reminder: true,

    reminderMinutes: 15

  };


  // =========================================================
  // NOTE FORM
  // =========================================================

  noteForm = {

    title: '',

    category: 'General',

    visibility: 'Everyone',

    pinned: false,

    description: ''

  };


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private router: Router
  ) {}


  // =========================================================
  // TAB
  // =========================================================

  setTab(tab: string): void {

    this.activeTab = tab;

  }


  // =========================================================
  // CALL CONTACT
  // =========================================================

  callContact(): void {

    this.callPanelOpen = true;

    this.callInProgress = false;

    this.callMuted = false;

    this.callDuration = '00:00';

  }


  // =========================================================
  // START CALL
  // =========================================================
  //
  // Current implementation:
  // Opens system phone/dialer using tel:
  //
  // Actual Twilio browser calling should be connected here.
  //
  // =========================================================

  startCall(): void {

    if (!this.contact.phone) {
      return;
    }

    const phoneNumber = this.contact.phone.replace(/\s+/g, '');

    // Open system phone application
    window.location.href = `tel:${phoneNumber}`;

    // Start CRM call UI timer
    this.callInProgress = true;

    this.callMuted = false;

    this.startCallTimer();

  }


  // =========================================================
  // CALL TIMER
  // =========================================================

  private startCallTimer(): void {

    this.stopCallTimer();

    this.callStartTime = Date.now();

    this.callDuration = '00:00';

    this.callTimer = setInterval(() => {

      const elapsedSeconds = Math.floor(
        (Date.now() - this.callStartTime) / 1000
      );

      const minutes = Math.floor(elapsedSeconds / 60);

      const seconds = elapsedSeconds % 60;

      this.callDuration =
        `${this.padNumber(minutes)}:${this.padNumber(seconds)}`;

    }, 1000);

  }


  // =========================================================
  // END CALL
  // =========================================================

  endCall(): void {

    this.callInProgress = false;

    this.stopCallTimer();

    this.callForm.duration = this.callDuration;

    this.callDuration = this.callForm.duration;

    // Open call log modal
    this.activeModal = 'call';

  }


  // =========================================================
  // STOP CALL TIMER
  // =========================================================

  private stopCallTimer(): void {

    if (this.callTimer) {

      clearInterval(this.callTimer);

      this.callTimer = null;

    }

  }


  // =========================================================
  // MUTE
  // =========================================================

  toggleMute(): void {

    this.callMuted = !this.callMuted;

  }


  // =========================================================
  // CLOSE CALL PANEL
  // =========================================================

  closeCallPanel(): void {

    if (this.callInProgress) {

      this.endCall();

      return;

    }

    this.callPanelOpen = false;

  }


  // =========================================================
  // EMAIL
  // =========================================================

  emailContact(): void {

    this.openComposeEmail();

  }


  // =========================================================
  // OPEN COMPOSE EMAIL
  // =========================================================

  openComposeEmail(): void {

    this.emailForm.to = this.contact.email;

    this.emailForm.subject =
      `CRM Discussion - ${this.contact.company}`;

    this.emailForm.message =
      `Hi ${this.contact.name},\n\n` +
      `Thank you for discussing your requirements with our team.\n\n` +
      `Please let us know a convenient time for the next discussion.\n\n` +
      `Regards,\nCRM Sales Team`;

    this.emailCcOpen = false;

    this.emailBccOpen = false;

    this.activeModal = 'email';

  }


  // =========================================================
  // SEND EMAIL
  // =========================================================
  //
  // UI implementation only.
  // Connect this method to your SMTP / Microsoft Graph /
  // SendGrid / backend email API.
  //
  // =========================================================

  sendContactEmail(): void {

    if (!this.emailForm.to?.trim()) {

      return;

    }

    console.log('EMAIL TO SEND', {

      to: this.emailForm.to,

      cc: this.emailForm.cc,

      bcc: this.emailForm.bcc,

      subject: this.emailForm.subject,

      message: this.emailForm.message

    });

    alert('Email sent successfully.');

    this.closeModal();

  }


  // =========================================================
  // FOLLOW-UP
  // =========================================================

  addFollowUp(): void {

    this.followupForm.subject =
      `Follow-up with ${this.contact.name}`;

    this.followupForm.date =
      this.getTomorrowDate();

    this.followupForm.time =
      '11:00';

    this.followupForm.type =
      'Call';

    this.followupForm.priority =
      'Medium';

    this.followupForm.description = '';

    this.followupForm.reminder = true;

    this.followupForm.reminderMinutes = 15;

    this.activeModal = 'followup';

  }


  // =========================================================
  // SAVE FOLLOW-UP
  // =========================================================

  saveFollowUp(): void {

    if (!this.followupForm.subject?.trim()) {

      alert('Please enter follow-up subject.');

      return;

    }

    if (!this.followupForm.date) {

      alert('Please select follow-up date.');

      return;

    }

    if (!this.followupForm.time) {

      alert('Please select follow-up time.');

      return;

    }

    const followUpPayload = {

      contactId: this.contact.id,

      companyId: this.contact.companyId,

      contactName: this.contact.name,

      subject: this.followupForm.subject,

      type: this.followupForm.type,

      priority: this.followupForm.priority,

      date: this.followupForm.date,

      time: this.followupForm.time,

      description: this.followupForm.description,

      reminder: this.followupForm.reminder,

      reminderMinutes:
        this.followupForm.reminderMinutes

    };

    console.log(
      'FOLLOW-UP PAYLOAD',
      followUpPayload
    );

    alert('Follow-up scheduled successfully.');

    this.closeModal();

  }


  // =========================================================
  // NOTE
  // =========================================================

  addNote(): void {

    this.noteForm.title = '';

    this.noteForm.category = 'General';

    this.noteForm.visibility = 'Everyone';

    this.noteForm.pinned = false;

    this.noteForm.description = '';

    this.activeModal = 'note';

  }


  // =========================================================
  // SAVE NOTE
  // =========================================================

  saveNote(): void {

    if (!this.noteForm.title?.trim()) {

      alert('Please enter note title.');

      return;

    }

    if (!this.noteForm.description?.trim()) {

      alert('Please enter note description.');

      return;

    }

    const notePayload = {

      contactId: this.contact.id,

      companyId: this.contact.companyId,

      contactName: this.contact.name,

      title: this.noteForm.title,

      category: this.noteForm.category,

      visibility: this.noteForm.visibility,

      pinned: this.noteForm.pinned,

      description: this.noteForm.description

    };

    console.log(
      'NOTE PAYLOAD',
      notePayload
    );

    alert('Note saved successfully.');

    this.closeModal();

  }


  // =========================================================
  // SAVE CALL
  // =========================================================

  saveCall(): void {

    if (!this.callForm.outcome) {

      alert('Please select call outcome.');

      return;

    }

    const callPayload = {

      contactId: this.contact.id,

      companyId: this.contact.companyId,

      contactName: this.contact.name,

      phone: this.contact.phone,

      type: this.callForm.type,

      outcome: this.callForm.outcome,

      duration: this.callForm.duration,

      notes: this.callForm.notes,

      callDate: new Date()

    };

    console.log(
      'CALL PAYLOAD',
      callPayload
    );

    alert('Call activity saved successfully.');

    this.closeModal();

    this.callPanelOpen = false;

  }


  // =========================================================
  // CLOSE MODAL
  // =========================================================

  closeModal(): void {

    this.activeModal = '';

  }


  // =========================================================
  // EDIT CONTACT
  // =========================================================

  editContact(): void {

    this.router.navigate([
      '/crm/contacts/edit',
      this.contact.id
    ]);

  }


  // =========================================================
  // OPEN COMPANY
  // =========================================================

  openCompany(): void {

    this.router.navigate([
      '/crm/companies/details',
      this.contact.companyId
    ]);

  }


  // =========================================================
  // CONVERT TO LEAD
  // =========================================================

  convertToLead(): void {

    this.router.navigate(
      ['/crm/leads/create'],
      {
        queryParams: {

          contactId: this.contact.id,

          companyId: this.contact.companyId,

          company: this.contact.company,

          contact: this.contact.name,

          email: this.contact.email,

          phone: this.contact.phone

        }

      }
    );

  }


  // =========================================================
  // TAB TITLE
  // =========================================================

  getTabTitle(): string {

    switch (this.activeTab) {

      case 'activities':
        return 'Activities';

      case 'calls':
        return 'Calls';

      case 'emails':
        return 'Emails';

      case 'followups':
        return 'Follow-ups';

      case 'notes':
        return 'Notes';

      case 'leads':
        return 'Leads';

      default:
        return 'Overview';

    }

  }


  // =========================================================
  // TAB ICON
  // =========================================================

  getTabIcon(): string {

    switch (this.activeTab) {

      case 'activities':
        return 'fa-chart-line';

      case 'calls':
        return 'fa-phone';

      case 'emails':
        return 'fa-envelope';

      case 'followups':
        return 'fa-calendar-check';

      case 'notes':
        return 'fa-note-sticky';

      case 'leads':
        return 'fa-bullseye';

      default:
        return 'fa-user';

    }

  }


  // =========================================================
  // TOMORROW DATE
  // =========================================================

  private getTomorrowDate(): string {

    const date = new Date();

    date.setDate(
      date.getDate() + 1
    );

    return this.formatDateForInput(date);

  }


  // =========================================================
  // DATE FORMAT
  // =========================================================

  private formatDateForInput(date: Date): string {

    const year = date.getFullYear();

    const month =
      this.padNumber(date.getMonth() + 1);

    const day =
      this.padNumber(date.getDate());

    return `${year}-${month}-${day}`;

  }


  // =========================================================
  // PAD NUMBER
  // =========================================================

  private padNumber(value: number): string {

    return value
      .toString()
      .padStart(2, '0');

  }


  // =========================================================
  // DESTROY
  // =========================================================

  ngOnDestroy(): void {

    this.stopCallTimer();

  }
}
