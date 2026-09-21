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
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './faqs.html',
  styleUrl: './faqs.css',
})
export class Faqs implements OnInit {

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

  categories = ['Account', 'Billing', 'Product', 'Technical', 'General'];

  visibilities = ['Public', 'Internal', 'Customer Portal'];

  statuses = ['Active', 'Inactive', 'Draft', 'Archived'];

  //====================================================
  // FAQs List
  //====================================================

  faqs: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  faq: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      faqid: 0,

      faqtitle: '',
      faqcode: '',

      category: '',

      question: '',
      answer: '',

      visibility: '',

      displayOrder: null,

      status: ''

    };

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadFaqs();

  }

  //====================================================
  // Load FAQs
  //====================================================

  loadFaqs(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getallfaqmanagements`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.faqs = res.data || [];

          } else {

            this.faqs = [];

            this.alert.warning(
              res?.message || 'No FAQ records found.'
            );

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Error loading FAQs:', err);

          this.faqs = [];

          this.alert.error(
            err?.error?.message || 'Failed to load FAQs.'
          );

          this.cd.detectChanges();

        }

      });

  }

  //====================================================
  // Filtered FAQs
  //====================================================

  get filteredFaqs() {

    const search = this.searchText.trim().toLowerCase();

    if (!search) return this.faqs;

    return this.faqs.filter(x =>

      (x.faqtitle || '').toLowerCase().includes(search) ||
      (x.faqcode || '').toLowerCase().includes(search) ||
      (x.category || '').toLowerCase().includes(search) ||
      (x.visibility || '').toLowerCase().includes(search) ||
      (x.status || '').toLowerCase().includes(search)

    );

  }

  get pagedFaqs() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredFaqs.slice(start, start + this.pageSize);

  }

  //====================================================
  // Save / Update
  //====================================================

  saveFaq(): void {

    this.submitted = true;

    if (
      !this.faq.faqtitle || !this.faq.faqtitle.trim() ||
      !this.faq.faqcode || !this.faq.faqcode.trim() ||
      !this.faq.question || !this.faq.question.trim() ||
      !this.faq.answer || !this.faq.answer.trim() ||
      !this.faq.visibility ||
      !this.faq.status
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    if (
      this.faq.displayOrder !== null &&
      this.faq.displayOrder !== '' &&
      Number(this.faq.displayOrder) < 0
    ) {

      this.alert.warning('Display Order cannot be negative.');

      return;

    }

    const payload = {

      faqid: this.isEdit ? this.faq.faqid : 0,

      faqtitle: this.faq.faqtitle.trim(),
      faqcode: this.faq.faqcode.trim(),

      category: this.faq.category
        ? this.faq.category.trim()
        : null,

      question: this.faq.question.trim(),
      answer: this.faq.answer.trim(),

      visibility: this.faq.visibility.trim(),

      displayOrder:
        this.faq.displayOrder !== null &&
          this.faq.displayOrder !== ''
          ? Number(this.faq.displayOrder)
          : null,

      status: this.faq.status.trim()

    };

    this.spinner.show();

    if (this.isEdit) {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/updatefaqmanagement`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'FAQ updated successfully.'
              );

              this.clear();

              this.loadFaqs();

            } else {

              this.alert.warning(
                res?.message || 'Failed to update FAQ.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Update FAQ error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to update FAQ.'
            );

          }

        });

    } else {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/createfaqmanagement`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'FAQ created successfully.'
              );

              this.clear();

              this.loadFaqs();

            } else {

              this.alert.warning(
                res?.message || 'Failed to create FAQ.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Create FAQ error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to create FAQ.'
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
      .get<ApiResponse<any>>(`${this.baseUrl}/Admin/getbyfaqmanagement/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.faq = {

              faqid: data.faqid,

              faqtitle: data.faqtitle || '',
              faqcode: data.faqcode || '',

              category: data.category || '',

              question: data.question || '',
              answer: data.answer || '',

              visibility: data.visibility || '',

              displayOrder: data.displayOrder ?? null,

              status: data.status || ''

            };

            this.isEdit = true;

            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'FAQ not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get FAQ error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to load FAQ.'
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
          `${this.baseUrl}/Admin/deletefaqmanagement/${id}`,
          {}
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'FAQ deleted successfully.'
              );

              if (this.page > 1 && this.pagedFaqs.length === 1) {
                this.page = this.page - 1;
              }

              this.loadFaqs();

            } else {

              this.alert.warning(
                res?.message || 'Failed to delete FAQ.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete FAQ error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete FAQ.'
            );

          }

        });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.faq = this.getEmptyModel();

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
