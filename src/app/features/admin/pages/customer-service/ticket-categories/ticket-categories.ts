import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { ApiResponse } from '../../../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-ticket-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './ticket-categories.html',
  styleUrl: './ticket-categories.css',
})
export class TicketCategories implements OnInit {

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

  parentCategories = [
    'Customer Support', 'Technical Support', 'Billing Support', 'Product Support'
  ];

  categoryTypes = [
    'Technical Support', 'Billing Support', 'Product Support',
    'Customer Complaint', 'General Query'
  ];

  priorities = ['Low', 'Medium', 'High', 'Critical'];

  assignedTeams = [
    'Support Team', 'Technical Team', 'Sales Team', 'Billing Team', 'Customer Success Team'
  ];

  statuses = ['Active', 'Inactive', 'Draft', 'Archived'];

  //====================================================
  // Ticket Categories List
  //====================================================

  ticketCategories: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  ticketCategory: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      categoryId: 0,

      categoryName: '',
      categoryCode: '',

      parentCategory: '',
      categoryType: '',
      priority: '',

      slaHours: null,

      assignedTeam: '',
      status: '',

      description: ''

    };

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadTicketCategories();

  }

  //====================================================
  // Load Ticket Categories
  //====================================================

  loadTicketCategories(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getallticketcategories`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.ticketCategories = res.data || [];

          } else {

            this.ticketCategories = [];

            this.alert.warning(
              res?.message || 'No Ticket Category records found.'
            );

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Error loading ticket categories:', err);

          this.ticketCategories = [];

          this.alert.error(
            err?.error?.message || 'Failed to load ticket categories.'
          );

          this.cd.detectChanges();

        }

      });

  }

  //====================================================
  // Filtered Ticket Categories
  //====================================================

  get filteredTicketCategories() {

    const search = this.searchText.trim().toLowerCase();

    if (!search) return this.ticketCategories;

    return this.ticketCategories.filter(x =>

      (x.categoryName || '').toLowerCase().includes(search) ||
      (x.categoryCode || '').toLowerCase().includes(search) ||
      (x.categoryType || '').toLowerCase().includes(search) ||
      (x.priority || '').toLowerCase().includes(search) ||
      (x.assignedTeam || '').toLowerCase().includes(search) ||
      (x.status || '').toLowerCase().includes(search)

    );

  }

  get pagedTicketCategories() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredTicketCategories.slice(start, start + this.pageSize);

  }

  //====================================================
  // Save / Update
  //====================================================

  saveTicketCategory(): void {

    this.submitted = true;

    if (
      !this.ticketCategory.categoryName || !this.ticketCategory.categoryName.trim() ||
      !this.ticketCategory.categoryCode || !this.ticketCategory.categoryCode.trim() ||
      !this.ticketCategory.categoryType ||
      !this.ticketCategory.status
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    if (
      this.ticketCategory.slaHours !== null &&
      this.ticketCategory.slaHours !== '' &&
      Number(this.ticketCategory.slaHours) < 0
    ) {

      this.alert.warning('SLA Hours cannot be negative.');

      return;

    }

    const payload = {

      categoryId: this.isEdit ? this.ticketCategory.categoryId : 0,

      categoryName: this.ticketCategory.categoryName.trim(),
      categoryCode: this.ticketCategory.categoryCode.trim(),

      parentCategory: this.ticketCategory.parentCategory
        ? this.ticketCategory.parentCategory.trim()
        : null,

      categoryType: this.ticketCategory.categoryType
        ? this.ticketCategory.categoryType.trim()
        : null,

      priority: this.ticketCategory.priority
        ? this.ticketCategory.priority.trim()
        : null,

      slaHours:
        this.ticketCategory.slaHours !== null &&
          this.ticketCategory.slaHours !== ''
          ? Number(this.ticketCategory.slaHours)
          : null,

      assignedTeam: this.ticketCategory.assignedTeam
        ? this.ticketCategory.assignedTeam.trim()
        : null,

      status: this.ticketCategory.status.trim(),

      description: this.ticketCategory.description
        ? this.ticketCategory.description.trim()
        : null

    };

    this.spinner.show();

    if (this.isEdit) {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/updateticketcategory`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Ticket Category updated successfully.'
              );

              this.clear();

              this.loadTicketCategories();

            } else {

              this.alert.warning(
                res?.message || 'Failed to update ticket category.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Update ticket category error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to update ticket category.'
            );

          }

        });

    } else {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/createticketcategory`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Ticket Category created successfully.'
              );

              this.clear();

              this.loadTicketCategories();

            } else {

              this.alert.warning(
                res?.message || 'Failed to create ticket category.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Create ticket category error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to create ticket category.'
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
      .get<ApiResponse<any>>(`${this.baseUrl}/Admin/getbyticketcategory/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.ticketCategory = {

              categoryId: data.categoryId,

              categoryName: data.categoryName || '',
              categoryCode: data.categoryCode || '',

              parentCategory: data.parentCategory || '',
              categoryType: data.categoryType || '',
              priority: data.priority || '',

              slaHours: data.slaHours ?? null,

              assignedTeam: data.assignedTeam || '',
              status: data.status || '',

              description: data.description || ''

            };

            this.isEdit = true;

            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'Ticket Category not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get ticket category error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to load ticket category.'
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
          `${this.baseUrl}/Admin/deleteticketcategory/${id}`,
          {}
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Ticket Category deleted successfully.'
              );

              if (this.page > 1 && this.pagedTicketCategories.length === 1) {
                this.page = this.page - 1;
              }

              this.loadTicketCategories();

            } else {

              this.alert.warning(
                res?.message || 'Failed to delete ticket category.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete ticket category error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete ticket category.'
            );

          }

        });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.ticketCategory = this.getEmptyModel();

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
