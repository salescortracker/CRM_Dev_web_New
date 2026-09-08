import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-leads-details',
   imports: [CommonModule,FormsModule],
  templateUrl: './leads-details.html',
  styleUrl: './leads-details.css',
})
export class LeadsDetails {
    // ============================================================
  // ACTIVE TAB
  // ============================================================

  activeTab: string = 'Overview';

  tabs: string[] = [
    'Overview',
    'Company',
    'Contact',
    'Calls',
    'Follow-ups',
    'Emails',
    'Meetings',
    'Tasks',
    'Notes',
    'Quotations',
    'Orders',
    'Invoices',
    'Payments',
    'Timeline'
  ];

  // ============================================================
  // ACTIVE MODAL
  // ============================================================

  activeModal:
    | 'call'
    | 'followup'
    | 'email'
    | 'meeting'
    | 'task'
    | 'note'
    | 'quotation'
    | 'order'
    | 'invoice'
    | null = null;

  // ============================================================
  // SELECTED RECORDS
  // ============================================================

  selectedInvoice: any = null;
  selectedQuotation: any = null;
  selectedOrder: any = null;

  // ============================================================
  // LEAD
  // ============================================================

  lead: any = {
    id: 101,
    fullName: 'Arun Reddy',
    email: 'arun.reddy@example.com',
    phone: '+91 98765 43210',
    alternatePhone: '+91 91234 56789',
    owner: 'Admin',
    score: 85,
    source: 'Website',
    status: 'Qualified',
    value: '₹12,50,000',
    expectedClose: '30 Sep 2026',
    createdDate: '10 Aug 2026',
    lastContacted: '20 Aug 2026',

    company: {
      name: 'TechNova Solutions',
      website: 'www.technova.com',
      industry: 'Technology',
      size: '201 - 500',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India'
    },

    contact: {
      designation: 'Chief Technology Officer',
      email: 'arun.reddy@example.com',
      phone: '+91 98765 43210',
      alternatePhone: '+91 91234 56789',
      department: 'Technology'
    }
  };

  // ============================================================
  // CALLS
  // ============================================================

  calls: any[] = [
    {
      id: 1,
      type: 'Outbound',
      date: '20 Aug 2026',
      time: '10:30 AM',
      duration: '08:42',
      status: 'Connected',
      outcome: 'Interested',
      notes: 'Discussed enterprise CRM requirements.'
    },
    {
      id: 2,
      type: 'Inbound',
      date: '18 Aug 2026',
      time: '03:20 PM',
      duration: '12:20',
      status: 'Follow-up Required',
      outcome: 'Follow-up Required',
      notes: 'Customer requested pricing details.'
    },
    {
      id: 3,
      type: 'Outbound',
      date: '16 Aug 2026',
      time: '11:15 AM',
      duration: '05:32',
      status: 'Connected',
      outcome: 'Connected',
      notes: 'Initial requirement discussion.'
    }
  ];

  // ============================================================
  // FOLLOW UPS
  // ============================================================

  followUps: any[] = [
    {
      id: 1,
      title: 'Discuss Enterprise CRM Proposal',
      type: 'Call',
      date: '22 Aug 2026',
      time: '11:00 AM',
      priority: 'High',
      status: 'Upcoming',
      description: 'Discuss enterprise CRM proposal.'
    },
    {
      id: 2,
      title: 'Send Pricing Information',
      type: 'Email',
      date: '24 Aug 2026',
      time: '03:30 PM',
      priority: 'Medium',
      status: 'Upcoming',
      description: 'Send enterprise pricing.'
    },
    {
      id: 3,
      title: 'Product Demonstration',
      type: 'Meeting',
      date: '19 Aug 2026',
      time: '04:00 PM',
      priority: 'High',
      status: 'Overdue',
      description: 'Product demonstration.'
    }
  ];

  // ============================================================
  // EMAILS
  // ============================================================

  emails: any[] = [
    {
      id: 1,
      subject: 'Enterprise CRM Proposal',
      from: 'sales@corcrm.com',
      to: 'arun.reddy@example.com',
      date: '20 Aug 2026',
      time: '10:20 AM',
      status: 'Sent',
      preview: 'Please find attached the CRM proposal...'
    },
    {
      id: 2,
      subject: 'CRM Requirements Discussion',
      from: 'arun.reddy@example.com',
      to: 'sales@corcrm.com',
      date: '19 Aug 2026',
      time: '02:40 PM',
      status: 'Received',
      preview: 'Thank you for sharing the requirements...'
    },
    {
      id: 3,
      subject: 'Product Introduction',
      from: 'sales@corcrm.com',
      to: 'arun.reddy@example.com',
      date: '18 Aug 2026',
      time: '11:00 AM',
      status: 'Sent',
      preview: 'I would like to introduce our CRM platform...'
    }
  ];

  // ============================================================
  // MEETINGS
  // ============================================================

  meetings: any[] = [
    {
      id: 1,
      title: 'Enterprise CRM Demo',
      date: '22 Aug 2026',
      time: '11:00 AM',
      duration: '60 Minutes',
      type: 'Online',
      location: 'Microsoft Teams',
      status: 'Scheduled',
      owner: 'Admin'
    },
    {
      id: 2,
      title: 'Requirement Discussion',
      date: '25 Aug 2026',
      time: '03:00 PM',
      duration: '45 Minutes',
      type: 'Online',
      location: 'Google Meet',
      status: 'Scheduled',
      owner: 'Admin'
    },
    {
      id: 3,
      title: 'Initial Discussion',
      date: '15 Aug 2026',
      time: '02:00 PM',
      duration: '30 Minutes',
      type: 'Online',
      location: 'Microsoft Teams',
      status: 'Completed',
      owner: 'Admin'
    }
  ];

  // ============================================================
  // TASKS
  // ============================================================

  tasks: any[] = [
    {
      id: 1,
      title: 'Send CRM Proposal',
      dueDate: '21 Aug 2026',
      priority: 'High',
      status: 'Pending',
      owner: 'Admin'
    },
    {
      id: 2,
      title: 'Prepare Product Demo',
      dueDate: '22 Aug 2026',
      priority: 'High',
      status: 'In Progress',
      owner: 'Admin'
    },
    {
      id: 3,
      title: 'Update Lead Information',
      dueDate: '18 Aug 2026',
      priority: 'Low',
      status: 'Completed',
      owner: 'Admin'
    }
  ];

  // ============================================================
  // NOTES
  // ============================================================

  notes: any[] = [
    {
      id: 1,
      title: 'Enterprise CRM Requirements',
      category: 'Requirement',
      description:
        'Customer is looking for CRM automation, lead management, email integration, call tracking and reporting dashboards.',
      createdBy: 'Admin',
      date: '20 Aug 2026',
      pinned: true,
      visibility: 'Sales Team'
    },
    {
      id: 2,
      title: 'Pricing Discussion',
      category: 'Commercial',
      description:
        'Customer requested enterprise pricing and annual subscription options.',
      createdBy: 'Sales Team',
      date: '19 Aug 2026',
      pinned: false,
      visibility: 'Everyone'
    },
    {
      id: 3,
      title: 'Integration Requirement',
      category: 'Technical',
      description:
        'Customer wants API integration with existing ERP and HRMS applications.',
      createdBy: 'Technical Team',
      date: '18 Aug 2026',
      pinned: false,
      visibility: 'Private'
    }
  ];

  // ============================================================
  // OPPORTUNITIES
  // ============================================================

  opportunities: any[] = [
    {
      id: 1,
      number: 'OPP-2026-0015',
      name: 'Enterprise CRM Implementation',
      date: '20 Aug 2026',
      amount: '₹15,00,000',
      stage: 'Proposal',
      probability: 70,
      status: 'Open',
      owner: 'Admin'
    },
    {
      id: 2,
      number: 'OPP-2026-0011',
      name: 'CRM + HRMS Integration',
      date: '15 Aug 2026',
      amount: '₹8,50,000',
      stage: 'Negotiation',
      probability: 80,
      status: 'Open',
      owner: 'Admin'
    },
    {
      id: 3,
      number: 'OPP-2026-0008',
      name: 'CRM Analytics Module',
      date: '05 Aug 2026',
      amount: '₹5,25,000',
      stage: 'Closed Won',
      probability: 100,
      status: 'Won',
      owner: 'Admin'
    }
  ];

  // ============================================================
  // QUOTATIONS
  // ============================================================

  quotations: any[] = [
    {
      id: 1,
      number: 'QT-2026-0012',
      date: '20 Aug 2026',
      amount: '₹12,50,000',
      status: 'Sent',
      customerName: 'Arun Reddy',
      subject: 'Enterprise CRM Proposal',
      validUntil: '30 Sep 2026',
      notes: 'Enterprise CRM implementation quotation.',
      items: [
        {
          id: 1,
          product: 'CORCRM Enterprise',
          description: 'Enterprise CRM License',
          quantity: 1,
          rate: 1250000,
          discount: 0
        }
      ]
    },
    {
      id: 2,
      number: 'QT-2026-0009',
      date: '15 Aug 2026',
      amount: '₹8,75,000',
      status: 'Draft',
      customerName: 'Arun Reddy',
      subject: 'CRM Implementation',
      validUntil: '15 Sep 2026',
      notes: '',
      items: [
        {
          id: 1,
          product: 'CRM Professional',
          description: 'CRM implementation',
          quantity: 1,
          rate: 875000,
          discount: 0
        }
      ]
    }
  ];

  // ============================================================
  // ORDERS
  // ============================================================

  orders: any[] = [
    {
      id: 1,
      number: 'SO-2026-0031',
      date: '10 Aug 2026',
      amount: '₹9,50,000',
      status: 'Processing',
      customerName: 'Arun Reddy',
      orderDate: '10 Aug 2026',
      expectedDate: '30 Aug 2026',
      shippingAddress: 'Hyderabad, Telangana, India',
      billingAddress: 'Hyderabad, Telangana, India',
      notes: '',
      items: [
        {
          id: 1,
          product: 'CRM Enterprise',
          description: 'Enterprise CRM',
          quantity: 1,
          rate: 950000,
          discount: 0
        }
      ]
    },
    {
      id: 2,
      number: 'SO-2026-0024',
      date: '01 Aug 2026',
      amount: '₹5,25,000',
      status: 'Completed',
      customerName: 'Arun Reddy',
      orderDate: '01 Aug 2026',
      expectedDate: '20 Aug 2026',
      shippingAddress: 'Hyderabad, Telangana, India',
      billingAddress: 'Hyderabad, Telangana, India',
      notes: '',
      items: [
        {
          id: 1,
          product: 'CRM Professional',
          description: 'Professional CRM',
          quantity: 1,
          rate: 525000,
          discount: 0
        }
      ]
    }
  ];

  // ============================================================
  // INVOICES
  // ============================================================

  invoices: any[] = [
    {
      id: 1,
      number: 'INV-2026-0051',
      date: '10 Aug 2026',
      amount: '₹5,00,000',
      dueDate: '10 Sep 2026',
      status: 'Pending',
      customerName: 'Arun Reddy',
      invoiceDate: '10 Aug 2026',
      notes: '',
      items: [
        {
          id: 1,
          product: 'CRM Enterprise',
          description: 'Enterprise CRM',
          quantity: 1,
          rate: 500000,
          discount: 0
        }
      ]
    },
    {
      id: 2,
      number: 'INV-2026-0042',
      date: '01 Aug 2026',
      amount: '₹2,50,000',
      dueDate: '01 Sep 2026',
      status: 'Paid',
      customerName: 'Arun Reddy',
      invoiceDate: '01 Aug 2026',
      notes: '',
      items: [
        {
          id: 1,
          product: 'CRM Professional',
          description: 'Professional CRM',
          quantity: 1,
          rate: 250000,
          discount: 0
        }
      ]
    }
  ];

  // ============================================================
  // PAYMENTS
  // ============================================================

  payments: any[] = [
    {
      id: 1,
      number: 'PAY-2026-0021',
      date: '05 Aug 2026',
      amount: '₹2,50,000',
      mode: 'Bank Transfer',
      status: 'Completed'
    },
    {
      id: 2,
      number: 'PAY-2026-0018',
      date: '28 Jul 2026',
      amount: '₹1,25,000',
      mode: 'UPI',
      status: 'Completed'
    }
  ];

  // ============================================================
  // TIMELINE
  // ============================================================

  timeline: any[] = [
    {
      id: 1,
      icon: 'bi-person-plus',
      type: 'lead',
      title: 'Lead created',
      description: 'Lead was created from website enquiry.',
      date: '10 Aug 2026',
      time: '09:30 AM'
    },
    {
      id: 2,
      icon: 'bi-telephone',
      type: 'call',
      title: 'Outbound call completed',
      description:
        'Discussed CRM requirements and implementation timeline.',
      date: '16 Aug 2026',
      time: '11:15 AM'
    },
    {
      id: 3,
      icon: 'bi-envelope',
      type: 'email',
      title: 'Proposal email sent',
      description:
        'Enterprise CRM proposal was sent to the customer.',
      date: '18 Aug 2026',
      time: '11:00 AM'
    },
    {
      id: 4,
      icon: 'bi-sticky',
      type: 'note',
      title: 'Requirement note added',
      description:
        'Customer requires CRM, HRMS and reporting integration.',
      date: '19 Aug 2026',
      time: '09:30 AM'
    },
    {
      id: 5,
      icon: 'bi-calendar-check',
      type: 'followup',
      title: 'Follow-up scheduled',
      description:
        'Enterprise CRM proposal discussion scheduled.',
      date: '20 Aug 2026',
      time: '10:00 AM'
    }
  ];

  // ============================================================
  // FORMS
  // ============================================================

  callForm: any = {
    type: 'Outbound',
    outcome: '',
    duration: '00:00',
    notes: ''
  };

  followupForm: any = {
    title: '',
    type: 'Call',
    priority: 'Medium',
    date: '',
    time: '',
    description: '',
    reminder: true,
    reminderMinutes: 15
  };

  emailForm: any = {
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    message: ''
  };

  meetingForm: any = {
    title: '',
    date: '',
    time: '',
    duration: '30',
    type: 'Online',
    location: '',
    description: ''
  };

  taskForm: any = {
    title: '',
    dueDate: '',
    priority: 'Medium',
    description: ''
  };

  noteForm: any = {
    title: '',
    category: 'General',
    visibility: 'Everyone',
    pinned: false,
    description: ''
  };

  quotationForm: any = {
    customerName: 'Arun Reddy',
    quotationDate: '',
    validUntil: '',
    subject: '',
    notes: '',
    items: []
  };

  orderForm: any = {
    customerName: 'Arun Reddy',
    orderDate: '',
    expectedDate: '',
    shippingAddress: '',
    billingAddress: '',
    notes: '',
    items: []
  };

  invoiceForm: any = {
    customerName: 'Arun Reddy',
    invoiceDate: '',
    dueDate: '',
    notes: '',
    items: []
  };

  // ============================================================
  // DISCOUNTS
  // ============================================================

  quotationDiscount = 0;
  orderDiscount = 0;
  invoiceDiscount = 0;

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const leadId = params['leadId'];

      if (leadId !== undefined && leadId !== null) {
        const parsedId = Number(leadId);

        if (!Number.isNaN(parsedId)) {
          this.lead.id = parsedId;
        }
      }
    });

    this.resetQuotationForm();
    this.resetOrderForm();
    this.resetInvoiceForm();
    this.resetEmailForm();
  }

  // ============================================================
  // TAB
  // ============================================================

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // ============================================================
  // MODAL
  // ============================================================

  openModal(
    modal:
      | 'call'
      | 'followup'
      | 'email'
      | 'meeting'
      | 'task'
      | 'note'
      | 'quotation'
      | 'order'
      | 'invoice'
  ): void {
    this.activeModal = modal;

    switch (modal) {
      case 'call':
        this.resetCallForm();
        break;

      case 'followup':
        this.resetFollowUpForm();
        break;

      case 'email':
        this.resetEmailForm();
        break;

      case 'meeting':
        this.resetMeetingForm();
        break;

      case 'task':
        this.resetTaskForm();
        break;

      case 'note':
        this.resetNoteForm();
        break;

      case 'quotation':
        this.resetQuotationForm();
        break;

      case 'order':
        this.resetOrderForm();
        break;

      case 'invoice':
        this.resetInvoiceForm();
        break;
    }
  }

  closeModal(): void {
    this.activeModal = null;
  }

  // ============================================================
  // QUICK ACTIONS
  // ============================================================

  makeCall(): void {
    this.openModal('call');
  }

  scheduleFollowUp(): void {
    this.openModal('followup');
  }

  composeEmail(): void {
    this.openModal('email');
  }

  scheduleMeeting(): void {
    this.openModal('meeting');
  }

  createTask(): void {
    this.openModal('task');
  }

  addNote(): void {
    this.openModal('note');
  }

  editLead(): void {
    console.log('Edit lead:', this.lead);
  }

  // ============================================================
  // VIEW RECORDS
  // ============================================================

  viewInvoice(invoice: any): void {
    if (!invoice) {
      return;
    }

    this.selectedInvoice = invoice;
  }

  closeInvoice(): void {
    this.selectedInvoice = null;
  }

  viewQuotation(quotation: any): void {
    if (!quotation) {
      return;
    }

    this.selectedQuotation = quotation;
  }

  closeQuotation(): void {
    this.selectedQuotation = null;
  }

  viewOrder(order: any): void {
    if (!order) {
      return;
    }

    this.selectedOrder = order;
  }

  closeOrder(): void {
    this.selectedOrder = null;
  }

  // ============================================================
  // CALL
  // ============================================================

  saveCall(): void {
    if (!this.callForm.outcome) {
      alert('Please select call outcome.');
      return;
    }

    const date = this.getTodayDate();
    const time = this.getCurrentTime();

    const call = {
      id: Date.now(),
      type: this.callForm.type,
      date,
      time,
      duration: this.callForm.duration || '00:00',
      status: this.callForm.outcome,
      outcome: this.callForm.outcome,
      notes: this.callForm.notes || ''
    };

    this.calls.unshift(call);

    this.timeline.unshift({
      id: Date.now(),
      icon: this.getCallIcon(this.callForm.type),
      type: 'call',
      title: `${this.callForm.type} call logged`,
      description: this.callForm.notes || this.callForm.outcome,
      date,
      time
    });

    this.resetCallForm();
    this.closeModal();
    this.activeTab = 'Calls';
  }

  resetCallForm(): void {
    this.callForm = {
      type: 'Outbound',
      outcome: '',
      duration: '00:00',
      notes: ''
    };
  }

  // ============================================================
  // FOLLOW UP
  // ============================================================

  saveFollowUp(): void {
    if (
      !this.followupForm.title ||
      !this.followupForm.date ||
      !this.followupForm.time
    ) {
      alert('Please enter subject, date and time.');
      return;
    }

    this.followUps.unshift({
      id: Date.now(),
      title: this.followupForm.title,
      type: this.followupForm.type,
      date: this.followupForm.date,
      time: this.followupForm.time,
      priority: this.followupForm.priority,
      status: 'Upcoming',
      description: this.followupForm.description || ''
    });

    this.timeline.unshift({
      id: Date.now(),
      icon: this.getFollowUpIcon(this.followupForm.type),
      type: 'followup',
      title: 'Follow-up scheduled',
      description: this.followupForm.title,
      date: this.followupForm.date,
      time: this.followupForm.time
    });

    this.resetFollowUpForm();
    this.closeModal();
    this.activeTab = 'Follow-ups';
  }

  resetFollowUpForm(): void {
    this.followupForm = {
      title: '',
      type: 'Call',
      priority: 'Medium',
      date: '',
      time: '',
      description: '',
      reminder: true,
      reminderMinutes: 15
    };
  }

  // ============================================================
  // EMAIL
  // ============================================================

  sendEmail(): void {
    if (
      !this.emailForm.to ||
      !this.emailForm.subject ||
      !this.emailForm.message
    ) {
      alert('Please enter recipient, subject and message.');
      return;
    }

    const date = this.getTodayDate();
    const time = this.getCurrentTime();

    this.emails.unshift({
      id: Date.now(),
      subject: this.emailForm.subject,
      from: 'sales@corcrm.com',
      to: this.emailForm.to,
      date,
      time,
      status: 'Sent',
      preview: String(this.emailForm.message).substring(0, 70)
    });

    this.timeline.unshift({
      id: Date.now(),
      icon: 'bi-envelope',
      type: 'email',
      title: 'Email sent',
      description: this.emailForm.subject,
      date,
      time
    });

    this.resetEmailForm();
    this.closeModal();
    this.activeTab = 'Emails';
  }

  resetEmailForm(): void {
    this.emailForm = {
      to: this.lead?.email || '',
      cc: '',
      bcc: '',
      subject: '',
      message: ''
    };
  }

  // ============================================================
  // MEETING
  // ============================================================

  saveMeeting(): void {
    if (
      !this.meetingForm.title ||
      !this.meetingForm.date ||
      !this.meetingForm.time
    ) {
      alert('Please enter meeting title, date and time.');
      return;
    }

    this.meetings.unshift({
      id: Date.now(),
      title: this.meetingForm.title,
      date: this.meetingForm.date,
      time: this.meetingForm.time,
      duration: `${this.meetingForm.duration} Minutes`,
      type: this.meetingForm.type,
      location: this.meetingForm.location || '-',
      status: 'Scheduled',
      owner: 'Admin'
    });

    this.timeline.unshift({
      id: Date.now(),
      icon: 'bi-people',
      type: 'meeting',
      title: 'Meeting scheduled',
      description: this.meetingForm.title,
      date: this.meetingForm.date,
      time: this.meetingForm.time
    });

    this.resetMeetingForm();
    this.closeModal();
    this.activeTab = 'Meetings';
  }

  resetMeetingForm(): void {
    this.meetingForm = {
      title: '',
      date: '',
      time: '',
      duration: '30',
      type: 'Online',
      location: '',
      description: ''
    };
  }

  // ============================================================
  // TASK
  // ============================================================

  saveTask(): void {
    if (
      !this.taskForm.title ||
      !this.taskForm.dueDate
    ) {
      alert('Please enter task title and due date.');
      return;
    }

    this.tasks.unshift({
      id: Date.now(),
      title: this.taskForm.title,
      dueDate: this.taskForm.dueDate,
      priority: this.taskForm.priority,
      status: 'Pending',
      owner: 'Admin'
    });

    this.timeline.unshift({
      id: Date.now(),
      icon: 'bi-check2-square',
      type: 'task',
      title: 'Task created',
      description: this.taskForm.title,
      date: this.taskForm.dueDate,
      time: 'Pending'
    });

    this.resetTaskForm();
    this.closeModal();
    this.activeTab = 'Tasks';
  }

  resetTaskForm(): void {
    this.taskForm = {
      title: '',
      dueDate: '',
      priority: 'Medium',
      description: ''
    };
  }

  // ============================================================
  // NOTE
  // ============================================================

  saveNote(): void {
    if (
      !this.noteForm.title ||
      !this.noteForm.description
    ) {
      alert('Please enter note title and description.');
      return;
    }

    const date = this.getTodayDate();

    this.notes.unshift({
      id: Date.now(),
      title: this.noteForm.title,
      category: this.noteForm.category,
      description: this.noteForm.description,
      createdBy: 'Admin',
      date,
      pinned: this.noteForm.pinned,
      visibility: this.noteForm.visibility
    });

    this.timeline.unshift({
      id: Date.now(),
      icon: 'bi-sticky',
      type: 'note',
      title: 'Note added',
      description: this.noteForm.title,
      date,
      time: this.getCurrentTime()
    });

    this.resetNoteForm();
    this.closeModal();
    this.activeTab = 'Notes';
  }

  resetNoteForm(): void {
    this.noteForm = {
      title: '',
      category: 'General',
      visibility: 'Everyone',
      pinned: false,
      description: ''
    };
  }

  // ============================================================
  // QUOTATION ITEMS
  // ============================================================

  addQuotationItem(): void {
    if (!Array.isArray(this.quotationForm.items)) {
      this.quotationForm.items = [];
    }

    this.quotationForm.items.push({
      id: Date.now(),
      product: '',
      description: '',
      quantity: 1,
      rate: 0,
      discount: 0
    });
  }

  removeQuotationItem(index: number): void {
    if (!Array.isArray(this.quotationForm.items)) {
      return;
    }

    if (this.quotationForm.items.length <= 1) {
      return;
    }

    this.quotationForm.items.splice(index, 1);
  }

  calculateQuotationItemTotal(item: any): number {
    if (!item) {
      return 0;
    }

    const quantity = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const discount = Number(item.discount) || 0;

    return Math.max(
      0,
      quantity * rate - discount
    );
  }

  get quotationSubTotal(): number {
    const items = this.quotationForm?.items || [];

    return items.reduce(
      (total: number, item: any) =>
        total + this.calculateQuotationItemTotal(item),
      0
    );
  }

  get quotationTax(): number {
    /*
     * Supports HTML that uses quotationTax.
     * Default tax is 0 because no tax rate was
     * specified in the quotation form.
     */
    return 0;
  }

  get quotationDiscountAmount(): number {
    return Number(this.quotationDiscount) || 0;
  }

  get quotationGrandTotal(): number {
    return Math.max(
      0,
      this.quotationSubTotal +
        this.quotationTax -
        this.quotationDiscountAmount
    );
  }

  calculateQuotationTotals(): number {
    return this.quotationGrandTotal;
  }

  // ============================================================
  // SAVE QUOTATION
  // ============================================================

  saveQuotation(): void {
    if (
      !this.quotationForm.customerName ||
      !this.quotationForm.quotationDate
    ) {
      alert('Please enter customer and quotation date.');
      return;
    }

    const amount = this.calculateQuotationTotals();

    const quotation = {
      id: Date.now(),
      number:
        `QT-${new Date().getFullYear()}-${String(
          this.quotations.length + 13
        ).padStart(4, '0')}`,
      date: this.quotationForm.quotationDate,
      amount: this.formatCurrency(amount),
      status: 'Draft',
      customerName: this.quotationForm.customerName,
      subject: this.quotationForm.subject,
      validUntil: this.quotationForm.validUntil,
      notes: this.quotationForm.notes,
      items: JSON.parse(
        JSON.stringify(
          this.quotationForm.items || []
        )
      )
    };

    this.quotations.unshift(quotation);

    this.timeline.unshift({
      id: Date.now(),
      icon: 'bi-file-earmark-text',
      type: 'quotation',
      title: 'Quotation created',
      description: quotation.number,
      date: quotation.date,
      time: this.getCurrentTime()
    });

    this.resetQuotationForm();
    this.closeModal();
    this.activeTab = 'Quotations';
  }

  resetQuotationForm(): void {
    this.quotationDiscount = 0;

    this.quotationForm = {
      customerName: this.lead?.fullName || '',
      quotationDate: this.getInputDate(),
      validUntil: '',
      subject: '',
      notes: '',
      items: [
        {
          id: Date.now(),
          product: '',
          description: '',
          quantity: 1,
          rate: 0,
          discount: 0
        }
      ]
    };
  }

  // ============================================================
  // ORDER ITEMS
  // ============================================================

  addOrderItem(): void {
    if (!Array.isArray(this.orderForm.items)) {
      this.orderForm.items = [];
    }

    this.orderForm.items.push({
      id: Date.now(),
      product: '',
      description: '',
      quantity: 1,
      rate: 0,
      discount: 0
    });
  }

  removeOrderItem(index: number): void {
    if (!Array.isArray(this.orderForm.items)) {
      return;
    }

    if (this.orderForm.items.length <= 1) {
      return;
    }

    this.orderForm.items.splice(index, 1);
  }

  calculateOrderItemTotal(item: any): number {
    if (!item) {
      return 0;
    }

    const quantity = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const discount = Number(item.discount) || 0;

    return Math.max(
      0,
      quantity * rate - discount
    );
  }

  get orderSubTotal(): number {
    const items = this.orderForm?.items || [];

    return items.reduce(
      (total: number, item: any) =>
        total + this.calculateOrderItemTotal(item),
      0
    );
  }

  get orderTax(): number {
    return 0;
  }

  get orderDiscountAmount(): number {
    return Number(this.orderDiscount) || 0;
  }

  get orderGrandTotal(): number {
    return Math.max(
      0,
      this.orderSubTotal +
        this.orderTax -
        this.orderDiscountAmount
    );
  }

  calculateOrderTotals(): number {
    return this.orderGrandTotal;
  }

  // ============================================================
  // SAVE ORDER
  // ============================================================

  saveOrder(): void {
    if (
      !this.orderForm.customerName ||
      !this.orderForm.orderDate
    ) {
      alert('Please enter customer and order date.');
      return;
    }

    const amount = this.calculateOrderTotals();

    const order = {
      id: Date.now(),
      number:
        `SO-${new Date().getFullYear()}-${String(
          this.orders.length + 32
        ).padStart(4, '0')}`,
      date: this.orderForm.orderDate,
      amount: this.formatCurrency(amount),
      status: 'Processing',
      customerName: this.orderForm.customerName,
      orderDate: this.orderForm.orderDate,
      expectedDate: this.orderForm.expectedDate,
      shippingAddress: this.orderForm.shippingAddress,
      billingAddress: this.orderForm.billingAddress,
      notes: this.orderForm.notes,
      items: JSON.parse(
        JSON.stringify(
          this.orderForm.items || []
        )
      )
    };

    this.orders.unshift(order);

    this.timeline.unshift({
      id: Date.now(),
      icon: 'bi-cart-check',
      type: 'order',
      title: 'Sales order created',
      description: order.number,
      date: order.date,
      time: this.getCurrentTime()
    });

    this.resetOrderForm();
    this.closeModal();
    this.activeTab = 'Orders';
  }

  resetOrderForm(): void {
    this.orderDiscount = 0;

    const company = this.lead?.company || {};

    const address = [
      company.city,
      company.state,
      company.country
    ]
      .filter(Boolean)
      .join(', ');

    this.orderForm = {
      customerName: this.lead?.fullName || '',
      orderDate: this.getInputDate(),
      expectedDate: '',
      shippingAddress: address,
      billingAddress: address,
      notes: '',
      items: [
        {
          id: Date.now(),
          product: '',
          description: '',
          quantity: 1,
          rate: 0,
          discount: 0
        }
      ]
    };
  }

  // ============================================================
  // INVOICE ITEMS
  // ============================================================

  addInvoiceItem(): void {
    if (!Array.isArray(this.invoiceForm.items)) {
      this.invoiceForm.items = [];
    }

    this.invoiceForm.items.push({
      id: Date.now(),
      product: '',
      description: '',
      quantity: 1,
      rate: 0,
      discount: 0
    });
  }

  removeInvoiceItem(index: number): void {
    if (!Array.isArray(this.invoiceForm.items)) {
      return;
    }

    if (this.invoiceForm.items.length <= 1) {
      return;
    }

    this.invoiceForm.items.splice(index, 1);
  }

  calculateInvoiceItemTotal(item: any): number {
    if (!item) {
      return 0;
    }

    const quantity = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const discount = Number(item.discount) || 0;

    return Math.max(
      0,
      quantity * rate - discount
    );
  }

  get invoiceSubTotal(): number {
    const items = this.invoiceForm?.items || [];

    return items.reduce(
      (total: number, item: any) =>
        total + this.calculateInvoiceItemTotal(item),
      0
    );
  }

  get invoiceTax(): number {
    return 0;
  }

  get invoiceDiscountAmount(): number {
    return Number(this.invoiceDiscount) || 0;
  }

  get invoiceGrandTotal(): number {
    return Math.max(
      0,
      this.invoiceSubTotal +
        this.invoiceTax -
        this.invoiceDiscountAmount
    );
  }

  calculateInvoiceTotals(): number {
    return this.invoiceGrandTotal;
  }

  // ============================================================
  // SAVE INVOICE
  // ============================================================

  saveInvoice(): void {
    if (
      !this.invoiceForm.customerName ||
      !this.invoiceForm.invoiceDate
    ) {
      alert('Please enter customer and invoice date.');
      return;
    }

    const amount = this.calculateInvoiceTotals();

    const invoice = {
      id: Date.now(),
      number:
        `INV-${new Date().getFullYear()}-${String(
          this.invoices.length + 52
        ).padStart(4, '0')}`,
      date: this.invoiceForm.invoiceDate,
      amount: this.formatCurrency(amount),
      dueDate: this.invoiceForm.dueDate,
      status: 'Pending',
      customerName: this.invoiceForm.customerName,
      invoiceDate: this.invoiceForm.invoiceDate,
      notes: this.invoiceForm.notes,
      items: JSON.parse(
        JSON.stringify(
          this.invoiceForm.items || []
        )
      )
    };

    this.invoices.unshift(invoice);

    this.timeline.unshift({
      id: Date.now(),
      icon: 'bi-receipt',
      type: 'invoice',
      title: 'Invoice created',
      description: invoice.number,
      date: invoice.date,
      time: this.getCurrentTime()
    });

    this.resetInvoiceForm();
    this.closeModal();
    this.activeTab = 'Invoices';
  }

  resetInvoiceForm(): void {
    this.invoiceDiscount = 0;

    this.invoiceForm = {
      customerName: this.lead?.fullName || '',
      invoiceDate: this.getInputDate(),
      dueDate: '',
      notes: '',
      items: [
        {
          id: Date.now(),
          product: '',
          description: '',
          quantity: 1,
          rate: 0,
          discount: 0
        }
      ]
    };
  }

  // ============================================================
  // OPEN NEW INVOICE
  // ============================================================

  openNewInvoice(): void {
    this.router.navigate(
      ['/crm/invoices/create'],
      {
        queryParams: {
          leadId: this.lead?.id
        }
      }
    );
  }

  // ============================================================
  // TAB COUNTS
  // ============================================================

  getTabCount(tab: string): number | null {
    switch (tab) {
      case 'Calls':
        return this.calls.length;

      case 'Follow-ups':
        return this.followUps.length;

      case 'Emails':
        return this.emails.length;

      case 'Meetings':
        return this.meetings.length;

      case 'Tasks':
        return this.tasks.length;

      case 'Notes':
        return this.notes.length;

      case 'Quotations':
        return this.quotations.length;

      case 'Orders':
        return this.orders.length;

      case 'Invoices':
        return this.invoices.length;

      case 'Payments':
        return this.payments.length;

      default:
        return null;
    }
  }

  get currentTabCount(): number | null {
    return this.getTabCount(this.activeTab);
  }

  getInvoiceCount(status?: string): number {
    if (!status) {
      return this.invoices.length;
    }

    return this.invoices.filter(
      invoice =>
        String(invoice?.status || '').toLowerCase() ===
        status.toLowerCase()
    ).length;
  }

  // ============================================================
  // ACTIVITY TOTALS
  // ============================================================

  get totalActivities(): number {
    return (
      this.calls.length +
      this.followUps.length +
      this.emails.length +
      this.meetings.length +
      this.tasks.length +
      this.notes.length
    );
  }

  get upcomingFollowUps(): number {
    return this.followUps.filter(
      x => x?.status === 'Upcoming'
    ).length;
  }

  get completedCalls(): number {
    return this.calls.filter(
      x =>
        x?.status === 'Connected' ||
        x?.outcome === 'Connected'
    ).length;
  }

  get pendingTasks(): number {
    return this.tasks.filter(
      x =>
        x?.status === 'Pending' ||
        x?.status === 'In Progress'
    ).length;
  }

  // ============================================================
  // FINANCIAL TOTALS
  // ============================================================

  get quotationTotal(): number {
    return this.quotations.reduce(
      (total: number, quotation: any) =>
        total + this.parseAmount(quotation?.amount),
      0
    );
  }

  get paidTotal(): number {
    return this.payments.reduce(
      (total: number, payment: any) =>
        total + this.parseAmount(payment?.amount),
      0
    );
  }

  get outstandingTotal(): number {
    return this.invoices
      .filter(
        invoice =>
          String(invoice?.status || '').toLowerCase() !==
          'paid'
      )
      .reduce(
        (total: number, invoice: any) =>
          total + this.parseAmount(invoice?.amount),
        0
      );
  }

  get opportunityTotal(): number {
    return this.opportunities.reduce(
      (total: number, opportunity: any) =>
        total + this.parseAmount(opportunity?.amount),
      0
    );
  }

  get orderTotal(): number {
    return this.orders.reduce(
      (total: number, order: any) =>
        total + this.parseAmount(order?.amount),
      0
    );
  }

  get invoiceTotal(): number {
    return this.invoices.reduce(
      (total: number, invoice: any) =>
        total + this.parseAmount(invoice?.amount),
      0
    );
  }

  // ============================================================
  // CURRENCY
  // ============================================================

  private parseAmount(value: any): number {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return 0;
    }

    return Number(
      String(value)
        .replace(/[₹,\s]/g, '')
    ) || 0;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat(
      'en-IN',
      {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }
    ).format(Number(value) || 0);
  }

  // ============================================================
  // STATUS
  // ============================================================

  getStatusClass(status: string): string {
    if (!status) {
      return '';
    }

    return String(status)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');
  }

  getPriorityClass(priority: string): string {
    if (!priority) {
      return '';
    }

    return String(priority)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');
  }

  getTimelineTypeClass(type: string): string {
    if (!type) {
      return '';
    }

    return String(type)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');
  }

  getLeadStatusClass(): string {
    return this.getStatusClass(
      this.lead?.status || ''
    );
  }

  // ============================================================
  // MODAL TITLE
  // ============================================================

  getModalTitle(): string {
    switch (this.activeModal) {
      case 'call':
        return 'Log Call';

      case 'followup':
        return 'Schedule Follow-up';

      case 'email':
        return 'Compose Email';

      case 'meeting':
        return 'Schedule Meeting';

      case 'task':
        return 'Create Task';

      case 'note':
        return 'Add Note';

      case 'quotation':
        return 'Create Quotation';

      case 'order':
        return 'Create Sales Order';

      case 'invoice':
        return 'Create Invoice';

      default:
        return '';
    }
  }

  // ============================================================
  // NOTE
  // ============================================================

  toggleNotePin(note: any): void {
    if (!note) {
      return;
    }

    note.pinned = !note.pinned;
  }

  // ============================================================
  // TASK
  // ============================================================

  markTaskCompleted(task: any): void {
    if (!task) {
      return;
    }

    task.status = 'Completed';

    this.timeline.unshift({
      id: Date.now(),
      icon: 'bi-check-circle',
      type: 'task',
      title: 'Task completed',
      description: task.title,
      date: this.getTodayDate(),
      time: this.getCurrentTime()
    });
  }

  // ============================================================
  // FOLLOW UP
  // ============================================================

  markFollowUpCompleted(followUp: any): void {
    if (!followUp) {
      return;
    }

    followUp.status = 'Completed';

    this.timeline.unshift({
      id: Date.now(),
      icon: 'bi-calendar-check',
      type: 'followup',
      title: 'Follow-up completed',
      description: followUp.title,
      date: this.getTodayDate(),
      time: this.getCurrentTime()
    });
  }

  // ============================================================
  // DELETE
  // ============================================================

  deleteCall(id: number): void {
    this.calls = this.calls.filter(
      x => x.id !== id
    );
  }

  deleteFollowUp(id: number): void {
    this.followUps = this.followUps.filter(
      x => x.id !== id
    );
  }

  deleteEmail(id: number): void {
    this.emails = this.emails.filter(
      x => x.id !== id
    );
  }

  deleteMeeting(id: number): void {
    this.meetings = this.meetings.filter(
      x => x.id !== id
    );
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(
      x => x.id !== id
    );
  }

  deleteNote(id: number): void {
    this.notes = this.notes.filter(
      x => x.id !== id
    );
  }

  deleteQuotation(id: number): void {
    this.quotations = this.quotations.filter(
      x => x.id !== id
    );

    if (this.selectedQuotation?.id === id) {
      this.closeQuotation();
    }
  }

  deleteOrder(id: number): void {
    this.orders = this.orders.filter(
      x => x.id !== id
    );

    if (this.selectedOrder?.id === id) {
      this.closeOrder();
    }
  }

  deleteInvoice(id: number): void {
    this.invoices = this.invoices.filter(
      x => x.id !== id
    );

    if (this.selectedInvoice?.id === id) {
      this.closeInvoice();
    }
  }

  deletePayment(id: number): void {
    this.payments = this.payments.filter(
      x => x.id !== id
    );
  }

  // ============================================================
  // DATE / TIME
  // ============================================================

  getTodayDate(): string {
    return new Date().toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  }

  getInputDate(): string {
    const date = new Date();

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString(
      'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  }

  // ============================================================
  // INITIALS
  // ============================================================

  getInitials(name: string): string {
    if (!name) {
      return '';
    }

    return String(name)
      .split(' ')
      .filter(x => x.length > 0)
      .map(x => x.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  // ============================================================
  // SCORE
  // ============================================================

  getScoreClass(score: number): string {
    const value = Number(score) || 0;

    if (value >= 80) {
      return 'excellent';
    }

    if (value >= 60) {
      return 'good';
    }

    if (value >= 40) {
      return 'average';
    }

    return 'low';
  }

  // ============================================================
  // ICONS
  // ============================================================

  getCallIcon(type: string): string {
    return type === 'Inbound'
      ? 'bi-telephone-inbound'
      : 'bi-telephone-outbound';
  }

  getEmailIcon(status: string): string {
    return status === 'Received'
      ? 'bi-envelope-open'
      : 'bi-envelope';
  }

  getFollowUpIcon(type: string): string {
    switch (type) {
      case 'Call':
        return 'bi-telephone';

      case 'Email':
        return 'bi-envelope';

      case 'Meeting':
        return 'bi-calendar-event';

      case 'Task':
        return 'bi-check2-square';

      default:
        return 'bi-calendar-check';
    }
  }

  getMeetingIcon(type: string): string {
    return type === 'Online'
      ? 'bi-camera-video'
      : 'bi-geo-alt';
  }

  getPaymentIcon(mode: string): string {
    switch (mode) {
      case 'UPI':
        return 'bi-phone';

      case 'Bank Transfer':
        return 'bi-bank';

      case 'Cash':
        return 'bi-cash';

      case 'Card':
        return 'bi-credit-card';

      default:
        return 'bi-wallet2';
    }
  }

  // ============================================================
  // TRACK BY
  // ============================================================

  trackById(
    index: number,
    item: any
  ): any {
    return item?.id ?? index;
  }

  // ============================================================
  // PRINT INVOICE
  // ============================================================

  printInvoice(): void {
    if (!this.selectedInvoice) {
      console.warn('No invoice selected.');
      return;
    }

    const invoiceElement =
      document.querySelector(
        '.invoice-paper'
      ) as HTMLElement | null;

    if (!invoiceElement) {
      console.error(
        'Invoice element ".invoice-paper" not found.'
      );
      return;
    }

    const printContent =
      invoiceElement.innerHTML;

    const printWindow = window.open(
      '',
      '_blank',
      'width=1200,height=900,top=50,left=50'
    );

    if (!printWindow) {
      alert(
        'Unable to open print window. Please allow pop-ups for this site.'
      );
      return;
    }

    const invoiceNumber =
      this.selectedInvoice?.number || 'Invoice';

    printWindow.document.open();

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport"
      content="width=device-width, initial-scale=1.0">
<title>${invoiceNumber}</title>

<style>

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  background: #ffffff;
  color: #222222;
  font-family: Arial, Helvetica, sans-serif;

  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

body {
  padding: 30px;
}

.invoice-paper {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  background: #ffffff;
}

.invoice-company-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;
}

.invoice-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.invoice-logo {
  width: 48px;
  height: 48px;
  min-width: 48px;
  background: #b02828;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 22px;
  font-weight: 700;
}

.invoice-brand h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
}

.invoice-brand span {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #777777;
  letter-spacing: 2px;
}

.invoice-title {
  text-align: right;
}

.invoice-title span {
  display: block;
  font-size: 12px;
  color: #777777;
  letter-spacing: 2px;
}

.invoice-title h2 {
  margin: 5px 0 0;
  font-size: 25px;
  font-weight: 800;
}

.invoice-divider {
  height: 2px;
  background: #b02828;
  margin: 25px 0;
}

.invoice-meta-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.invoice-meta-grid span,
.invoice-address-box span {
  display: block;
  margin-bottom: 6px;
  font-size: 11px;
  color: #777777;
  text-transform: uppercase;
  letter-spacing: .8px;
}

.invoice-meta-grid strong {
  font-size: 14px;
}

.invoice-address-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 25px;
  margin-bottom: 35px;
}

.invoice-address-box {
  border: 1px solid #dddddd;
  padding: 20px;
  border-radius: 8px;
  page-break-inside: avoid;
}

.invoice-address-box strong {
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
}

.invoice-address-box p {
  margin: 4px 0;
  font-size: 13px;
  line-height: 1.5;
  color: #555555;
}

.invoice-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

.invoice-table thead {
  display: table-header-group;
}

.invoice-table tr {
  page-break-inside: avoid;
}

.invoice-table th {
  padding: 12px;
  background: #f5f5f5;
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  border-bottom: 2px solid #dddddd;
}

.invoice-table td {
  padding: 13px 12px;
  border-bottom: 1px solid #eeeeee;
  font-size: 13px;
}

.invoice-bottom {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 40px;
}

.invoice-payment-note {
  padding: 20px;
}

.invoice-payment-note span {
  display: block;
  font-size: 11px;
  color: #777777;
  letter-spacing: 1px;
}

.invoice-payment-note strong {
  display: inline-block;
  margin-top: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  background: #fff3cd;
  color: #856404;
  font-size: 12px;
}

.invoice-total-box {
  border: 1px solid #dddddd;
  border-radius: 8px;
  overflow: hidden;
}

.invoice-total-box > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 11px 16px;
  border-bottom: 1px solid #eeeeee;
  font-size: 13px;
}

.invoice-grand-total {
  background: #f8f8f8;
  font-size: 16px !important;
  font-weight: 700;
}

.invoice-balance {
  background: #fff4f4;
  color: #b02828;
  font-size: 16px !important;
  font-weight: 700;
}

.invoice-terms {
  margin-top: 35px;
  padding-top: 20px;
  border-top: 1px solid #dddddd;
}

.invoice-terms p {
  margin: 8px 0 0;
  color: #666666;
  font-size: 12px;
  line-height: 1.6;
}

.invoice-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  padding-top: 15px;
  border-top: 1px solid #dddddd;
  color: #777777;
  font-size: 11px;
}

@page {
  size: A4;
  margin: 12mm;
}

@media print {

  html,
  body {
    margin: 0;
    padding: 0;
  }

  .invoice-paper {
    width: 100%;
    max-width: none;
  }

  .no-print {
    display: none !important;
  }

}

</style>
</head>

<body>

<div class="invoice-paper">

${printContent}

</div>

<script>

window.addEventListener(
  'load',
  function () {

    setTimeout(
      function () {

        window.focus();
        window.print();

      },
      500
    );

  }
);

window.addEventListener(
  'afterprint',
  function () {

    setTimeout(
      function () {

        window.close();

      },
      300
    );

  }
);

</script>

</body>
</html>
`);

    printWindow.document.close();
  }
  // ============================================================
// ORDER / QUOTATION COUNTS
// ============================================================

get pendingOrderCount(): number {
  return this.orders.filter(
    order =>
      String(order?.status || '').toLowerCase() === 'pending' ||
      String(order?.status || '').toLowerCase() === 'processing'
  ).length;
}

get quotationAcceptedCount(): number {
  return this.quotations.filter(
    quotation =>
      String(quotation?.status || '').toLowerCase() === 'accepted'
  ).length;
}


// ============================================================
// OPEN NEW QUOTATION
// ============================================================

openNewQuotation(): void {
  this.activeModal = 'quotation';
  this.resetQuotationForm();
}


// ============================================================
// OPEN NEW ORDER
// ============================================================

openNewOrder(): void {
  this.activeModal = 'order';
  this.resetOrderForm();
}
}
