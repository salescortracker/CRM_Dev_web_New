import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-company-details',
  imports: [CommonModule,FormsModule],
  templateUrl: './company-details.html',
  styleUrl: './company-details.css',
})
export class CompanyDetails {
  // ============================================================
  // ACTIVE TAB
  // ============================================================

  activeTab:
    | 'overview'
    | 'contacts'
    | 'activities'
    | 'calls'
    | 'emails'
    | 'followups'
    | 'notes'
    | 'leads' = 'calls';


  // ============================================================
  // MODALS
  // ============================================================

  activeModal:
    | 'call'
    | 'email'
    | 'followup'
    | 'note'
    | 'lead'
    | null = null;

  followupModalOpen = false;
  noteModalOpen = false;
  emailModalOpen = false;

  // Optional call modal if you use it later
  callModalOpen = false;


  // ============================================================
  // EMAIL COMPOSE STATE
  // ============================================================

  emailComposeOpen = false;
  emailCcOpen = false;
  emailBccOpen = false;


  // ============================================================
  // CALL PANEL
  // ============================================================

  callPanelOpen = false;
  callInProgress = false;
  callMuted = false;
  callSeconds = 0;

  private callTimer: any = null;


  // ============================================================
  // SELECTED ITEMS
  // ============================================================

  selectedCall: any = null;
  selectedEmail: any = null;
  selectedNote: any = null;


  // ============================================================
  // FILTERS
  // ============================================================

  callFilter = 'All';
  emailFilter = 'All';
  followupFilter = 'Upcoming';

  callSearch = '';
  emailSearch = '';
  noteSearch = '';


  // ============================================================
  // CURRENT USER
  // ============================================================

  currentUserName = 'Dugra Prasad';


  // ============================================================
  // COMPANY
  // ============================================================

  company = {
    id: 'CMP-000124',
    name: 'ABC Technologies Pvt Ltd',
    initials: 'AT',
    status: 'Active',
    industry: 'Information Technology',
    city: 'Hyderabad',
    country: 'India',
    companySize: 250,
    website: 'www.abctech.com',
    phone: '+91 40 4567 8900',
    email: 'info@abctech.com',
    founded: 2014,
    owner: 'Dugra Prasad',
    contacts: 8,
    leads: 4,
    calls: 27,
    activities: 64
  };


  // ============================================================
  // PRIMARY CONTACT
  // ============================================================

  primaryContact = {
    id: 101,
    name: 'Arjun Reddy',
    initials: 'AR',
    designation: 'Sales Director',
    department: 'Sales',
    email: 'arjun.reddy@abctech.com',
    phone: '+91 98765 43210'
  };


  // ============================================================
  // CONTACTS
  // ============================================================

  contacts = [
    {
      id: 101,
      name: 'Arjun Reddy',
      initials: 'AR',
      designation: 'Sales Director',
      department: 'Sales',
      email: 'arjun.reddy@abctech.com',
      phone: '+91 98765 43210'
    },
    {
      id: 102,
      name: 'Priya Sharma',
      initials: 'PS',
      designation: 'HR Manager',
      department: 'Human Resources',
      email: 'priya.sharma@abctech.com',
      phone: '+91 99887 66554'
    },
    {
      id: 103,
      name: 'Rajesh Kumar',
      initials: 'RK',
      designation: 'IT Manager',
      department: 'Information Technology',
      email: 'rajesh.kumar@abctech.com',
      phone: '+91 91234 56789'
    },
    {
      id: 104,
      name: 'Sneha Rao',
      initials: 'SR',
      designation: 'Finance Manager',
      department: 'Finance',
      email: 'sneha.rao@abctech.com',
      phone: '+91 90123 45678'
    }
  ];


  // ============================================================
  // CALLS
  // ============================================================

  calls = [
    {
      id: 1,
      contact: 'Arjun Reddy',
      initials: 'AR',
      phone: '+91 98765 43210',
      type: 'Outbound',
      outcome: 'Interested',
      duration: '12:32',
      date: 'Today, 02:35 PM',
      owner: 'Dugra Prasad',
      notes: 'Customer interested in Enterprise CRM package.',
      status: 'Completed'
    },
    {
      id: 2,
      contact: 'Priya Sharma',
      initials: 'PS',
      phone: '+91 99887 66554',
      type: 'Outbound',
      outcome: 'Follow-up Required',
      duration: '06:18',
      date: 'Today, 11:20 AM',
      owner: 'Dugra Prasad',
      notes: 'Requested HRMS and CRM integration details.',
      status: 'Completed'
    },
    {
      id: 3,
      contact: 'Rajesh Kumar',
      initials: 'RK',
      phone: '+91 91234 56789',
      type: 'Inbound',
      outcome: 'Connected',
      duration: '08:42',
      date: 'Yesterday, 04:30 PM',
      owner: 'Rahul Kumar',
      notes: 'Technical discussion completed.',
      status: 'Completed'
    },
    {
      id: 4,
      contact: 'Sneha Rao',
      initials: 'SR',
      phone: '+91 90123 45678',
      type: 'Outbound',
      outcome: 'No Answer',
      duration: '00:00',
      date: 'Yesterday, 02:10 PM',
      owner: 'Dugra Prasad',
      notes: '',
      status: 'No Answer'
    },
    {
      id: 5,
      contact: 'Arjun Reddy',
      initials: 'AR',
      phone: '+91 98765 43210',
      type: 'Outbound',
      outcome: 'Connected',
      duration: '15:20',
      date: '18 Aug 2026, 03:15 PM',
      owner: 'Dugra Prasad',
      notes: 'Discussed implementation timeline.',
      status: 'Completed'
    }
  ];


  // ============================================================
  // EMAILS
  // ============================================================

  emails = [
    {
      id: 1,
      subject: 'Enterprise CRM Proposal',
      to: 'arjun.reddy@abctech.com',
      from: 'sales@corcrm.com',
      cc: '',
      bcc: '',
      date: 'Today, 02:15 PM',
      status: 'Sent',
      opened: true,
      body:
        'Hi Arjun,\n\nPlease find attached the Enterprise CRM proposal discussed during our call.\n\nRegards,\nDugra Prasad'
    },
    {
      id: 2,
      subject: 'CRM Product Introduction',
      to: 'priya.sharma@abctech.com',
      from: 'sales@corcrm.com',
      cc: '',
      bcc: '',
      date: 'Today, 10:45 AM',
      status: 'Sent',
      opened: true,
      body:
        'Hi Priya,\n\nSharing the CRM and HRMS product overview for your reference.'
    },
    {
      id: 3,
      subject: 'Re: CRM Demo Discussion',
      to: 'sales@corcrm.com',
      from: 'arjun.reddy@abctech.com',
      cc: '',
      bcc: '',
      date: 'Yesterday, 05:20 PM',
      status: 'Received',
      opened: true,
      body:
        'Hi Dugra,\n\nThe proposal looks good. We would like to schedule another discussion.'
    },
    {
      id: 4,
      subject: 'Meeting Request - CORCRM',
      to: 'arjun.reddy@abctech.com',
      from: 'sales@corcrm.com',
      cc: '',
      bcc: '',
      date: '18 Aug 2026, 11:00 AM',
      status: 'Sent',
      opened: false,
      body:
        'Requesting a meeting to discuss the next steps.'
    }
  ];


  // ============================================================
  // FOLLOW UPS
  // ============================================================

  followups = [
    {
      id: 1,
      title: 'Discuss Enterprise CRM Proposal',
      contact: 'Arjun Reddy',
      type: 'Call',
      date: '21 Aug 2026',
      time: '10:30 AM',
      priority: 'High',
      status: 'Upcoming'
    },
    {
      id: 2,
      title: 'Send HRMS Pricing',
      contact: 'Priya Sharma',
      type: 'Email',
      date: '22 Aug 2026',
      time: '02:00 PM',
      priority: 'Normal',
      status: 'Upcoming'
    },
    {
      id: 3,
      title: 'Technical Demo',
      contact: 'Rajesh Kumar',
      type: 'Meeting',
      date: '25 Aug 2026',
      time: '11:00 AM',
      priority: 'High',
      status: 'Upcoming'
    },
    {
      id: 4,
      title: 'Follow-up on Proposal',
      contact: 'Arjun Reddy',
      type: 'Call',
      date: '18 Aug 2026',
      time: '03:00 PM',
      priority: 'Normal',
      status: 'Overdue'
    },
    {
      id: 5,
      title: 'Initial Requirement Discussion',
      contact: 'Priya Sharma',
      type: 'Call',
      date: '15 Aug 2026',
      time: '04:00 PM',
      priority: 'Normal',
      status: 'Completed'
    }
  ];


  // ============================================================
  // NOTES
  // ============================================================

  notes = [
    {
      id: 1,
      title: 'Enterprise CRM Requirement',
      description:
        'Customer is interested in Enterprise CRM with HRMS integration, advanced reporting and approval workflow.',
      author: 'Dugra Prasad',
      date: 'Today, 02:45 PM',
      visibility: 'Sales Team',
      pinned: true
    },
    {
      id: 2,
      title: 'Budget Discussion',
      description:
        'Customer requested pricing for approximately 250 users. Commercial discussion planned next week.',
      author: 'Rahul Kumar',
      date: '19 Aug 2026',
      visibility: 'Sales Team',
      pinned: false
    },
    {
      id: 3,
      title: 'Current System',
      description:
        'Company currently uses spreadsheets and multiple disconnected applications for sales tracking.',
      author: 'Dugra Prasad',
      date: '17 Aug 2026',
      visibility: 'Everyone',
      pinned: false
    }
  ];


  // ============================================================
  // ACTIVITIES
  // ============================================================

  activities = [
    {
      type: 'call',
      icon: 'fa-solid fa-phone',
      title: 'Call completed',
      description: 'Called Arjun Reddy — Outcome: Interested',
      time: 'Today, 02:35 PM'
    },
    {
      type: 'email',
      icon: 'fa-regular fa-envelope',
      title: 'Email sent',
      description: 'Enterprise CRM Proposal sent to Arjun Reddy',
      time: 'Today, 02:15 PM'
    },
    {
      type: 'followup',
      icon: 'fa-regular fa-calendar-check',
      title: 'Follow-up scheduled',
      description: 'Proposal discussion scheduled for tomorrow',
      time: 'Today, 02:00 PM'
    },
    {
      type: 'note',
      icon: 'fa-regular fa-note-sticky',
      title: 'Note added',
      description: 'Enterprise CRM requirement recorded',
      time: 'Today, 01:45 PM'
    },
    {
      type: 'call',
      icon: 'fa-solid fa-phone',
      title: 'Call completed',
      description: 'Technical discussion with Rajesh Kumar',
      time: 'Yesterday, 04:30 PM'
    }
  ];


  // ============================================================
  // CALL FORM
  // ============================================================

  callForm = {
    contact: 'Arjun Reddy',
    type: 'Outbound',
    outcome: '',
    duration: '',
    notes: ''
  };


  // ============================================================
  // FOLLOWUP FORM
  // ============================================================

  followupForm = {
    subject: '',
    type: 'Call',
    contact: 'Arjun Reddy',
    date: '',
    time: '',
    priority: 'Medium',
    description: '',
    reminder: false,
    reminderMinutes: 15
  };


  // ============================================================
  // EMAIL FORM
  // ============================================================

  emailForm = {
    to: 'arjun.reddy@abctech.com',
    cc: '',
    bcc: '',
    subject: '',
    message: ''
  };


  // ============================================================
  // NOTE FORM
  // ============================================================

  noteForm = {
    title: '',
    category: 'General',
    description: '',
    pinned: false,
    visibility: 'Sales Team'
  };


  // ============================================================
  // TAB
  // ============================================================

  setTab(
    tab:
      | 'overview'
      | 'contacts'
      | 'activities'
      | 'calls'
      | 'emails'
      | 'followups'
      | 'notes'
      | 'leads'
  ): void {

    this.activeTab = tab;

    if (tab === 'emails' && !this.selectedEmail) {
      this.selectedEmail = this.emails[0] ?? null;
    }
  }


  // ============================================================
  // CALL
  // ============================================================

  makeCall(contact: any = this.primaryContact): void {

    this.selectedCall = contact;

    this.callPanelOpen = true;
    this.callInProgress = false;
    this.callMuted = false;
    this.callSeconds = 0;
  }


  startCall(): void {

    this.callInProgress = true;
    this.callSeconds = 0;

    this.clearCallTimer();

    this.callTimer = setInterval(() => {

      if (this.callInProgress) {
        this.callSeconds++;
      }

    }, 1000);
  }


  endCall(): void {

    this.callInProgress = false;

    this.clearCallTimer();

    const minutes = Math.floor(this.callSeconds / 60);
    const seconds = this.callSeconds % 60;

    this.callForm.duration =
      `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    this.callPanelOpen = false;

    this.openCallModal();
  }


  toggleMute(): void {
    this.callMuted = !this.callMuted;
  }


  closeCallPanel(): void {

    this.clearCallTimer();

    this.callPanelOpen = false;
    this.callInProgress = false;
  }


  private clearCallTimer(): void {

    if (this.callTimer) {
      clearInterval(this.callTimer);
      this.callTimer = null;
    }
  }


  get callTimerDisplay(): string {

    const minutes = Math.floor(this.callSeconds / 60);
    const seconds = this.callSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }


  // ============================================================
  // OPEN CALL MODAL
  // ============================================================

  openCallModal(): void {

    this.activeModal = 'call';
    this.callModalOpen = true;
  }


  // ============================================================
  // EMAIL
  // ============================================================

  sendEmail(): void {

    this.emailForm = {
      to: this.primaryContact.email,
      cc: '',
      bcc: '',
      subject: '',
      message: ''
    };

    this.emailModalOpen = true;
    this.emailComposeOpen = true;

    this.activeModal = 'email';
  }


  saveEmail(): void {

    if (
      !this.emailForm.to ||
      !this.emailForm.subject ||
      !this.emailForm.message
    ) {
      alert('Please complete To, Subject and Message.');
      return;
    }

    const newEmail = {
      id: Date.now(),
      subject: this.emailForm.subject,
      to: this.emailForm.to,
      from: 'sales@corcrm.com',
      cc: this.emailForm.cc,
      bcc: this.emailForm.bcc,
      date: 'Just now',
      status: 'Sent',
      opened: true,
      body: this.emailForm.message
    };

    this.emails.unshift(newEmail);

    this.selectedEmail = newEmail;

    this.activities.unshift({
      type: 'email',
      icon: 'fa-regular fa-envelope',
      title: 'Email sent',
      description: this.emailForm.subject,
      time: 'Just now'
    });

    this.company.activities++;

    this.closeEmailModal();
  }


  sendCompanyEmail(): void {
    this.saveEmail();
  }


  closeEmailModal(): void {

    this.emailModalOpen = false;
    this.emailComposeOpen = false;

    if (this.activeModal === 'email') {
      this.activeModal = null;
    }
  }


  // ============================================================
  // FOLLOW-UP
  // ============================================================

  addFollowUp(): void {

    this.followupForm = {
      subject: '',
      type: 'Call',
      contact: this.primaryContact.name,
      date: '',
      time: '',
      priority: 'Medium',
      description: '',
      reminder: false,
      reminderMinutes: 15
    };

    this.followupModalOpen = true;

    this.activeModal = 'followup';
  }


  saveFollowUp(): void {

    if (
      !this.followupForm.subject ||
      !this.followupForm.type ||
      !this.followupForm.contact ||
      !this.followupForm.date ||
      !this.followupForm.time
    ) {
      alert(
        'Please complete Subject, Activity Type, Contact, Date and Time.'
      );
      return;
    }

    this.followups.unshift({
      id: Date.now(),
      title: this.followupForm.subject,
      contact: this.followupForm.contact,
      type: this.followupForm.type,
      date: this.followupForm.date,
      time: this.followupForm.time,
      priority: this.followupForm.priority,
      status: 'Upcoming'
    });

    this.activities.unshift({
      type: 'followup',
      icon: 'fa-regular fa-calendar-check',
      title: 'Follow-up scheduled',
      description: this.followupForm.subject,
      time: 'Just now'
    });

    this.company.activities++;

    this.closeFollowUpModal();
  }


  closeFollowUpModal(): void {

    this.followupModalOpen = false;

    if (this.activeModal === 'followup') {
      this.activeModal = null;
    }
  }


  // ============================================================
  // NOTE
  // ============================================================

  addNote(): void {

    this.noteForm = {
      title: '',
      category: 'General',
      description: '',
      pinned: false,
      visibility: 'Sales Team'
    };

    this.noteModalOpen = true;

    this.activeModal = 'note';
  }


  saveNote(): void {

    if (
      !this.noteForm.title ||
      !this.noteForm.description
    ) {
      alert('Please enter Note Title and Description.');
      return;
    }

    this.notes.unshift({
      id: Date.now(),
      title: this.noteForm.title,
      description: this.noteForm.description,
      author: this.company.owner,
      date: 'Just now',
      visibility: this.noteForm.visibility,
      pinned: this.noteForm.pinned
    });

    this.activities.unshift({
      type: 'note',
      icon: 'fa-regular fa-note-sticky',
      title: 'Note added',
      description: this.noteForm.title,
      time: 'Just now'
    });

    this.company.activities++;

    this.closeNoteModal();
  }


  closeNoteModal(): void {

    this.noteModalOpen = false;

    if (this.activeModal === 'note') {
      this.activeModal = null;
    }
  }


  // ============================================================
  // CALL SAVE
  // ============================================================

  saveCall(): void {

    if (!this.callForm.outcome) {
      alert('Please select call outcome.');
      return;
    }

    const contact =
      this.contacts.find(
        x => x.name === this.callForm.contact
      ) || this.primaryContact;

    this.calls.unshift({
      id: Date.now(),
      contact: this.callForm.contact,
      initials: contact.initials,
      phone: contact.phone,
      type: this.callForm.type,
      outcome: this.callForm.outcome,
      duration: this.callForm.duration || '00:00',
      date: 'Just now',
      owner: this.company.owner,
      notes: this.callForm.notes,
      status: 'Completed'
    });

    this.company.calls++;
    this.company.activities++;

    this.activities.unshift({
      type: 'call',
      icon: 'fa-solid fa-phone',
      title: 'Call completed',
      description:
        `${this.callForm.contact} — ${this.callForm.outcome}`,
      time: 'Just now'
    });

    this.closeCallModal();
  }


  closeCallModal(): void {

    this.callModalOpen = false;

    if (this.activeModal === 'call') {
      this.activeModal = null;
    }
  }


  // ============================================================
  // LEAD
  // ============================================================

  createLead(): void {
    this.activeModal = 'lead';
  }


  // ============================================================
  // GENERIC MODAL
  // ============================================================

  closeModal(): void {

    this.activeModal = null;

    this.callModalOpen = false;
    this.emailModalOpen = false;
    this.followupModalOpen = false;
    this.noteModalOpen = false;
  }


  // ============================================================
  // FILTERED CALLS
  // ============================================================

  get filteredCalls(): any[] {

    let result = [...this.calls];

    if (this.callFilter !== 'All') {

      result = result.filter(
        x => x.outcome === this.callFilter
      );
    }

    if (this.callSearch?.trim()) {

      const search =
        this.callSearch.toLowerCase().trim();

      result = result.filter(x =>
        x.contact.toLowerCase().includes(search) ||
        x.outcome.toLowerCase().includes(search) ||
        x.phone.toLowerCase().includes(search) ||
        x.owner.toLowerCase().includes(search)
      );
    }

    return result;
  }


  // ============================================================
  // FILTERED EMAILS
  // ============================================================

  get filteredEmails(): any[] {

    let result = [...this.emails];

    if (this.emailFilter !== 'All') {

      result = result.filter(
        x => x.status === this.emailFilter
      );
    }

    if (this.emailSearch?.trim()) {

      const search =
        this.emailSearch.toLowerCase().trim();

      result = result.filter(x =>
        x.subject.toLowerCase().includes(search) ||
        x.to.toLowerCase().includes(search) ||
        x.from.toLowerCase().includes(search) ||
        x.body.toLowerCase().includes(search)
      );
    }

    return result;
  }


  // ============================================================
  // FILTERED FOLLOW UPS
  // ============================================================

  get filteredFollowups(): any[] {

    if (this.followupFilter === 'All') {
      return this.followups;
    }

    return this.followups.filter(
      x => x.status === this.followupFilter
    );
  }


  // ============================================================
  // FILTERED NOTES
  // ============================================================

  get filteredNotes(): any[] {

    if (!this.noteSearch?.trim()) {
      return this.notes;
    }

    const search =
      this.noteSearch.toLowerCase().trim();

    return this.notes.filter(x =>
      x.title.toLowerCase().includes(search) ||
      x.description.toLowerCase().includes(search) ||
      x.author.toLowerCase().includes(search) ||
      x.visibility.toLowerCase().includes(search)
    );
  }


  // ============================================================
  // CALL COUNTS
  // ============================================================

  get connectedCalls(): number {

    return this.calls.filter(x =>
      x.outcome === 'Connected' ||
      x.outcome === 'Interested'
    ).length;
  }


  get followupCalls(): number {

    return this.calls.filter(
      x => x.outcome === 'Follow-up Required'
    ).length;
  }


  get noAnswerCalls(): number {

    return this.calls.filter(
      x => x.outcome === 'No Answer'
    ).length;
  }


  // ============================================================
  // EMAIL COUNTS
  // ============================================================

  get sentEmails(): number {

    return this.emails.filter(
      x => x.status === 'Sent'
    ).length;
  }


  get receivedEmails(): number {

    return this.emails.filter(
      x => x.status === 'Received'
    ).length;
  }


  get openedEmails(): number {

    return this.emails.filter(
      x => x.opened
    ).length;
  }


  // These are the names your HTML is currently using

  get sentEmailCount(): number {
    return this.sentEmails;
  }


  get receivedEmailCount(): number {
    return this.receivedEmails;
  }


  get draftEmailCount(): number {
    return 0;
  }


  // ============================================================
  // FOLLOW-UP COUNTS
  // ============================================================

  get completedFollowups(): number {

    return this.followups.filter(
      x => x.status === 'Completed'
    ).length;
  }


  get upcomingFollowups(): number {

    return this.followups.filter(
      x => x.status === 'Upcoming'
    ).length;
  }


  get overdueFollowups(): number {

    return this.followups.filter(
      x => x.status === 'Overdue'
    ).length;
  }


  // ============================================================
  // CONTACT
  // ============================================================

  addContact(): void {
    alert('Add Contact mockup');
  }


  openContact(contact: any): void {
    alert(`Opening ${contact.name}`);
  }


  editCompany(): void {
    alert('Edit Company mockup');
  }


  // ============================================================
  // CLEANUP
  // ============================================================

  ngOnDestroy(): void {
    this.clearCallTimer();
  }
}
