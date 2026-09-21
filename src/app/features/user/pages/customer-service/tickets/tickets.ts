import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { ApiResponse } from '../../../../../core/authentication/services/auth.service';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css',
})
export class Tickets implements OnInit {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  //====================================================
  // Screen Variables
  //====================================================

  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  searchText = '';

  //====================================================
  // Static Options
  //====================================================

  categories = [
    'Technical Issue', 'Billing', 'Product Support', 'Login Issue',
    'Bug Report', 'Feature Request', 'Complaint', 'General Inquiry'
  ];

  priorities = ['Low', 'Medium', 'High', 'Critical'];

  statuses = ['Open', 'In Progress', 'Waiting for Customer', 'Resolved', 'Closed'];

  sources = ['Web', 'Email', 'Phone', 'WhatsApp', 'Live Chat', 'Mobile App'];

  relatedModules = ['Customer', 'Lead', 'Deal', 'Order', 'Invoice', 'Product'];

  //====================================================
  // Tickets List
  //====================================================

  tickets: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  ticket: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      ticketId: 0,

      ticketNumber: this.generateNextTicketNumber(),

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
      resolutionNotes: ''

    };

  }

  //====================================================
  // Ticket Number Helper
  //====================================================

  generateNextTicketNumber(): string {

    const maxNumber = this.tickets.reduce((max, x) => {

      const match = /TKT-(\d+)/.exec(x.ticketNumber || '');

      const num = match ? Number(match[1]) : 0;

      return num > max ? num : max;

    }, 1000);

    return 'TKT-' + (maxNumber + 1);

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadTickets();

  }

  //====================================================
  // Load Tickets
  //====================================================

  loadTickets(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getallcustomersupporttickets`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.tickets = res.data || [];

          } else {

            this.tickets = [];

            this.alert.warning(
              res?.message || 'No Ticket records found.'
            );

          }

          this.ticket.ticketNumber = this.generateNextTicketNumber();

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Error loading tickets:', err);

          this.tickets = [];

          this.alert.error(
            err?.error?.message || 'Failed to load tickets.'
          );

          this.cd.detectChanges();

        }

      });

  }

  //====================================================
  // Filtered Tickets
  //====================================================

  get filteredTickets() {

    const search = this.searchText.trim().toLowerCase();

    if (!search) return this.tickets;

    return this.tickets.filter(x =>

      (x.ticketNumber || '').toLowerCase().includes(search) ||
      (x.customerName || '').toLowerCase().includes(search) ||
      (x.subject || '').toLowerCase().includes(search) ||
      (x.category || '').toLowerCase().includes(search) ||
      (x.priority || '').toLowerCase().includes(search) ||
      (x.status || '').toLowerCase().includes(search) ||
      (x.assignedTo || '').toLowerCase().includes(search)

    );

  }

  get pagedTickets() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredTickets.slice(start, start + this.pageSize);

  }

  //====================================================
  // Save / Update
  //====================================================

  saveTicket(): void {

    this.submitted = true;

    if (
      !this.ticket.ticketNumber || !this.ticket.ticketNumber.trim() ||
      !this.ticket.customerName || !this.ticket.customerName.trim() ||
      !this.ticket.subject || !this.ticket.subject.trim() ||
      !this.ticket.category ||
      !this.ticket.priority ||
      !this.ticket.status
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    const payload = {

      ticketId: this.isEdit ? this.ticket.ticketId : 0,

      ticketNumber: this.ticket.ticketNumber.trim(),
      customerName: this.ticket.customerName.trim(),

      contactPerson: this.ticket.contactPerson
        ? this.ticket.contactPerson.trim()
        : null,

      email: this.ticket.email ? this.ticket.email.trim() : null,

      mobileNumber: this.ticket.mobileNumber
        ? this.ticket.mobileNumber.trim()
        : null,

      subject: this.ticket.subject.trim(),

      category: this.ticket.category
        ? this.ticket.category.trim()
        : null,

      priority: this.ticket.priority
        ? this.ticket.priority.trim()
        : null,

      status: this.ticket.status.trim(),

      assignedTo: this.ticket.assignedTo
        ? this.ticket.assignedTo.trim()
        : null,

      source: this.ticket.source
        ? this.ticket.source.trim()
        : null,

      relatedModule: this.ticket.relatedModule
        ? this.ticket.relatedModule.trim()
        : null,

      dueDate: this.ticket.dueDate || null,

      description: this.ticket.description
        ? this.ticket.description.trim()
        : null,

      resolutionNotes: this.ticket.resolutionNotes
        ? this.ticket.resolutionNotes.trim()
        : null

    };

    this.spinner.show();

    if (this.isEdit) {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/updatecustomersupportticket`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Ticket updated successfully.'
              );

              this.clear();

              this.loadTickets();

            } else {

              this.alert.warning(
                res?.message || 'Failed to update ticket.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Update ticket error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to update ticket.'
            );

          }

        });

    } else {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/createcustomersupportticket`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Ticket created successfully.'
              );

              this.clear();

              this.loadTickets();

            } else {

              this.alert.warning(
                res?.message || 'Failed to create ticket.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Create ticket error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to create ticket.'
            );

          }

        });

    }

  }

  //====================================================
  // Edit
  //====================================================

  edit(id: number): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any>>(`${this.baseUrl}/Admin/getbycustomersupportticket/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.ticket = {

              ticketId: data.ticketId,

              ticketNumber: data.ticketNumber || '',

              customerName: data.customerName || '',
              contactPerson: data.contactPerson || '',
              email: data.email || '',
              mobileNumber: data.mobileNumber || '',

              subject: data.subject || '',
              category: data.category || '',
              priority: data.priority || '',
              status: data.status || '',

              assignedTo: data.assignedTo || '',
              source: data.source || '',
              relatedModule: data.relatedModule || '',

              dueDate: data.dueDate
                ? data.dueDate.substring(0, 10)
                : '',

              description: data.description || '',
              resolutionNotes: data.resolutionNotes || ''

            };

            this.isEdit = true;

            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'Ticket not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get ticket error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to load ticket.'
          );

        }

      });

  }

  //====================================================
  // Delete
  //====================================================

  delete(id: number): void {

    this.alert.deleteConfirm().then(result => {

      if (!result.isConfirmed) return;

      this.spinner.show();

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/deletecustomersupportticket/${id}`,
          {}
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Ticket deleted successfully.'
              );

              if (this.page > 1 && this.pagedTickets.length === 1) {
                this.page = this.page - 1;
              }

              this.loadTickets();

            } else {

              this.alert.warning(
                res?.message || 'Failed to delete ticket.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete ticket error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete ticket.'
            );

          }

        });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.ticket = this.getEmptyModel();

    this.isEdit = false;

    this.submitted = false;

  }

  //====================================================
  // Pagination
  //====================================================

  changePage(page: number): void {

    this.page = page;

  }

  changePageSize(size: number): void {

    this.pageSize = size;

    this.page = 1;

  }

}
