import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css',
})
export class Tickets {
  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = '';

  tickets: any[] = [];

  ticket: any = {

    ticketId: 0,
    ticketNumber: 'TKT-1001',
    customerName: '',
    contactPerson: '',
    email: '',
    mobileNumber: '',
    subject: '',
    category: '',
    priority: '',
    status: '',
    assignedTo: '',
    source: '',
    relatedModule: '',
    dueDate: '',
    description: '',
    resolutionNotes: '',
    isActive: true

  };

  constructor(

    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef

  ) { }

  ngOnInit(): void {

    this.loadTickets();

  }

  loadTickets() {

    this.spinner.show();

    setTimeout(() => {

      this.tickets = [

        {
          ticketId: 1,
          ticketNumber: 'TKT-1001',
          customerName: 'John Smith',
          contactPerson: 'John Smith',
          email: 'john@gmail.com',
          mobileNumber: '9876543210',
          subject: 'Unable to Login',
          category: 'Login Issue',
          priority: 'High',
          status: 'Open',
          assignedTo: 'Rahul',
          source: 'Web',
          relatedModule: 'Customer',
          dueDate: '2026-08-01',
          description: 'Customer is unable to login.',
          resolutionNotes: '',
          isActive: true
        },

        {
          ticketId: 2,
          ticketNumber: 'TKT-1002',
          customerName: 'Sophia',
          contactPerson: 'Sophia',
          email: 'sophia@gmail.com',
          mobileNumber: '9876543211',
          subject: 'Invoice Amount Incorrect',
          category: 'Billing',
          priority: 'Medium',
          status: 'In Progress',
          assignedTo: 'David',
          source: 'Email',
          relatedModule: 'Invoice',
          dueDate: '2026-08-03',
          description: 'Invoice amount mismatch.',
          resolutionNotes: '',
          isActive: true
        },

        {
          ticketId: 3,
          ticketNumber: 'TKT-1003',
          customerName: 'Michael',
          contactPerson: 'Michael',
          email: 'michael@gmail.com',
          mobileNumber: '9876543212',
          subject: 'Application Error',
          category: 'Technical Issue',
          priority: 'Critical',
          status: 'Waiting for Customer',
          assignedTo: 'Kevin',
          source: 'Phone',
          relatedModule: 'Product',
          dueDate: '2026-08-05',
          description: 'Unexpected application error.',
          resolutionNotes: '',
          isActive: true
        },

        {
          ticketId: 4,
          ticketNumber: 'TKT-1004',
          customerName: 'David',
          contactPerson: 'David',
          email: 'david@gmail.com',
          mobileNumber: '9876543213',
          subject: 'Need Product Guidance',
          category: 'Product Support',
          priority: 'Low',
          status: 'Resolved',
          assignedTo: 'Kiran',
          source: 'WhatsApp',
          relatedModule: 'Product',
          dueDate: '2026-08-07',
          description: 'Requested product training.',
          resolutionNotes: 'Training completed.',
          isActive: true
        },

        {
          ticketId: 5,
          ticketNumber: 'TKT-1005',
          customerName: 'Robert',
          contactPerson: 'Robert',
          email: 'robert@gmail.com',
          mobileNumber: '9876543214',
          subject: 'Bug Found',
          category: 'Bug Report',
          priority: 'High',
          status: 'Closed',
          assignedTo: 'Ajay',
          source: 'Mobile App',
          relatedModule: 'Lead',
          dueDate: '2026-08-09',
          description: 'Bug reported in dashboard.',
          resolutionNotes: 'Bug fixed successfully.',
          isActive: true
        }

      ];

      this.tickets.sort((a, b) => b.ticketId - a.ticketId);

      this.totalRecords = this.tickets.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }

  saveTicket() {

    this.submitted = true;

    if (

      !this.ticket.customerName ||
      !this.ticket.subject ||
      !this.ticket.category ||
      !this.ticket.priority ||
      !this.ticket.status

    ) {

      return;

    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const nextId = this.tickets.length
          ? Math.max(...this.tickets.map(x => x.ticketId)) + 1
          : 1;

        const newTicket = {

          ...this.ticket,

          ticketId: nextId,

          ticketNumber: 'TKT-' + (1000 + nextId)

        };

        this.tickets.unshift(newTicket);

      }

      else {

        const index = this.tickets.findIndex(

          x => x.ticketId === this.ticket.ticketId

        );

        if (index !== -1) {

          this.tickets[index] = {

            ...this.ticket

          };

        }

      }

      this.tickets = [...this.tickets];

      this.totalRecords = this.tickets.length;

      this.page = 1;

      const message = this.isEdit

        ? 'Ticket updated successfully.'

        : 'Ticket created successfully.';

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(message);

    }, 500);

  }
    edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.tickets.find(
        x => x.ticketId === id
      );

      if (selected) {

        this.ticket = {
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

          this.tickets = this.tickets.filter(
            x => x.ticketId !== id
          );

          this.totalRecords = this.tickets.length;

          if (
            this.page > 1 &&
            this.pagedTickets.length === 0
          ) {

            this.page--;

          }

          this.tickets = [...this.tickets];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Ticket deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    const nextId = this.tickets.length
      ? Math.max(...this.tickets.map(x => x.ticketId)) + 1
      : 1;

    this.ticket = {

      ticketId: 0,
      ticketNumber: 'TKT-' + (1000 + nextId),
      customerName: '',
      contactPerson: '',
      email: '',
      mobileNumber: '',
      subject: '',
      category: '',
      priority: '',
      status: '',
      assignedTo: '',
      source: '',
      relatedModule: '',
      dueDate: '',
      description: '',
      resolutionNotes: '',
      isActive: true

    };

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredTickets() {

    return this.tickets.filter(x =>

      x.ticketNumber
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.customerName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.subject
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.category
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

      ||

      x.assignedTo
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

    );

  }

  get pagedTickets() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredTickets.slice(

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
