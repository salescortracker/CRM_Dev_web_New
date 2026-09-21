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
  selector: 'app-knowledge-base',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './knowledge-base.html',
  styleUrl: './knowledge-base.css',
})
export class KnowledgeBase implements OnInit {

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

  selectedFileName = '';

  //====================================================
  // Static Options
  //====================================================

  categories = [
    'Getting Started', 'Account Management', 'Billing', 'CRM Features',
    'Troubleshooting', 'API Documentation', 'Integrations', 'FAQ'
  ];

  statuses = ['Draft', 'Published', 'Archived'];

  visibilities = ['Public', 'Internal', 'Customers Only'];

  uploadTypes = ['File', 'Link', 'Video', 'Document'];

  //====================================================
  // Knowledge Base Articles List
  //====================================================

  articles: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  article: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      articleId: 0,

      articleTitle: '',
      category: '',
      status: '',

      keywords: '',
      visibility: '',

      author: '',
      version: 'v1.0',

      lastUpdated: '',

      attachment: '',
      uploadType: '',

      summary: '',
      articleContent: '',

      isActive: true

    };

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadArticles();

  }

  //====================================================
  // File Selection (filename only — no upload endpoint)
  //====================================================

  onFileSelected(event: any): void {

    if (event.target.files.length > 0) {

      const file = event.target.files[0];

      this.selectedFileName = file.name;

      this.article.attachment = file.name;

    }

  }

  //====================================================
  // Load Articles
  //====================================================

  loadArticles(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getallknowledgebases`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.articles = res.data || [];

          } else {

            this.articles = [];

            this.alert.warning(
              res?.message || 'No Knowledge Base articles found.'
            );

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Error loading knowledge base articles:', err);

          this.articles = [];

          this.alert.error(
            err?.error?.message || 'Failed to load knowledge base articles.'
          );

          this.cd.detectChanges();

        }

      });

  }

  //====================================================
  // Filtered Articles
  //====================================================

  get filteredArticles() {

    const search = this.searchText.trim().toLowerCase();

    if (!search) return this.articles;

    return this.articles.filter(x =>

      (x.articleTitle || '').toLowerCase().includes(search) ||
      (x.category || '').toLowerCase().includes(search) ||
      (x.author || '').toLowerCase().includes(search) ||
      (x.visibility || '').toLowerCase().includes(search) ||
      (x.status || '').toLowerCase().includes(search) ||
      (x.version || '').toLowerCase().includes(search)

    );

  }

  get pagedArticles() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredArticles.slice(start, start + this.pageSize);

  }

  //====================================================
  // Save / Update
  //====================================================

  saveArticle(): void {

    this.submitted = true;

    if (
      !this.article.articleTitle || !this.article.articleTitle.trim() ||
      !this.article.status ||
      !this.article.visibility ||
      !this.article.version || !this.article.version.trim()
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    const payload = {

      articleId: this.isEdit ? this.article.articleId : 0,

      articleTitle: this.article.articleTitle.trim(),

      category: this.article.category
        ? this.article.category.trim()
        : null,

      status: this.article.status.trim(),

      keywords: this.article.keywords
        ? this.article.keywords.trim()
        : null,

      visibility: this.article.visibility.trim(),

      author: this.article.author
        ? this.article.author.trim()
        : null,

      version: this.article.version.trim(),

      lastUpdated: this.article.lastUpdated || null,

      attachment: this.article.attachment
        ? this.article.attachment.trim()
        : null,

      uploadType: this.article.uploadType
        ? this.article.uploadType.trim()
        : null,

      summary: this.article.summary
        ? this.article.summary.trim()
        : null,

      articleContent: this.article.articleContent
        ? this.article.articleContent.trim()
        : null,

      isActive: !!this.article.isActive

    };

    this.spinner.show();

    if (this.isEdit) {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/updateknowledgebase`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Knowledge base article updated successfully.'
              );

              this.clear();

              this.loadArticles();

            } else {

              this.alert.warning(
                res?.message || 'Failed to update knowledge base article.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Update knowledge base article error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to update knowledge base article.'
            );

          }

        });

    } else {

      this.http
        .post<ApiResponse>(
          `${this.baseUrl}/Admin/createknowledgebase`,
          payload
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Knowledge base article created successfully.'
              );

              this.clear();

              this.loadArticles();

            } else {

              this.alert.warning(
                res?.message || 'Failed to create knowledge base article.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Create knowledge base article error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to create knowledge base article.'
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
      .get<ApiResponse<any>>(`${this.baseUrl}/Admin/getbyknowledgebase/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.article = {

              articleId: data.articleId,

              articleTitle: data.articleTitle || '',
              category: data.category || '',
              status: data.status || '',

              keywords: data.keywords || '',
              visibility: data.visibility || '',

              author: data.author || '',
              version: data.version || '',

              lastUpdated: data.lastUpdated
                ? data.lastUpdated.substring(0, 10)
                : '',

              attachment: data.attachment || '',
              uploadType: data.uploadType || '',

              summary: data.summary || '',
              articleContent: data.articleContent || '',

              isActive: data.isActive === true

            };

            this.selectedFileName = data.attachment || '';

            this.isEdit = true;

            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'Knowledge base article not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get knowledge base article error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to load knowledge base article.'
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
          `${this.baseUrl}/Admin/deleteknowledgebase/${id}`,
          {}
        )
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message || 'Knowledge base article deleted successfully.'
              );

              if (this.page > 1 && this.pagedArticles.length === 1) {
                this.page = this.page - 1;
              }

              this.loadArticles();

            } else {

              this.alert.warning(
                res?.message || 'Failed to delete knowledge base article.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete knowledge base article error:', err);

            this.alert.error(
              err?.error?.message || 'Failed to delete knowledge base article.'
            );

          }

        });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.article = this.getEmptyModel();

    this.selectedFileName = '';

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
