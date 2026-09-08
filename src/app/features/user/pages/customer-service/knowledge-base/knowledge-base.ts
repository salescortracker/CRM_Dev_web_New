import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-knowledge-base',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './knowledge-base.html',
  styleUrl: './knowledge-base.css',
})
export class KnowledgeBase {
   submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = '';

  selectedFileName = '';

  articles: any[] = [];

  article: any = {

    articleId: 0,
    title: '',
    category: '',
    keywords: '',
    visibility: '',
    status: '',
    author: '',
    version: '',
    lastUpdated: '',
    summary: '',
    content: '',
    attachment: '',
    isActive: true

  };

  constructor(

    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef

  ) { }

  ngOnInit(): void {

    this.loadArticles();

  }

  onFileSelected(event: any) {

    if (event.target.files.length > 0) {

      const file = event.target.files[0];

      this.selectedFileName = file.name;

      this.article.attachment = file.name;

    }

  }

  loadArticles() {

    this.spinner.show();

    setTimeout(() => {

      this.articles = [

        {
          articleId: 1,
          title: 'Getting Started with CRM',
          category: 'Getting Started',
          keywords: 'crm,start,guide',
          visibility: 'Public',
          status: 'Published',
          author: 'Admin',
          version: 'v1.0',
          lastUpdated: '2026-08-01',
          summary: 'Basic CRM introduction.',
          content: 'Complete guide for new CRM users.',
          attachment: 'CRM_Guide.pdf',
          isActive: true
        },

        {
          articleId: 2,
          title: 'Invoice Payment Process',
          category: 'Billing',
          keywords: 'invoice,payment,billing',
          visibility: 'Customers Only',
          status: 'Published',
          author: 'Finance Team',
          version: 'v2.1',
          lastUpdated: '2026-08-03',
          summary: 'Invoice payment instructions.',
          content: 'Detailed payment process.',
          attachment: 'Invoice.pdf',
          isActive: true
        },

        {
          articleId: 3,
          title: 'API Authentication',
          category: 'API Documentation',
          keywords: 'api,jwt,authentication',
          visibility: 'Internal',
          status: 'Draft',
          author: 'Development Team',
          version: 'v1.2',
          lastUpdated: '2026-08-05',
          summary: 'API authentication flow.',
          content: 'JWT authentication documentation.',
          attachment: '',
          isActive: true
        },

        {
          articleId: 4,
          title: 'Troubleshooting Login Issues',
          category: 'Troubleshooting',
          keywords: 'login,password,error',
          visibility: 'Public',
          status: 'Published',
          author: 'Support Team',
          version: 'v3.0',
          lastUpdated: '2026-08-06',
          summary: 'Fix common login issues.',
          content: 'Troubleshooting guide.',
          attachment: 'LoginGuide.pdf',
          isActive: true
        },

        {
          articleId: 5,
          title: 'CRM FAQs',
          category: 'FAQ',
          keywords: 'faq,crm,questions',
          visibility: 'Customers Only',
          status: 'Archived',
          author: 'Admin',
          version: 'v1.5',
          lastUpdated: '2026-08-08',
          summary: 'Frequently asked questions.',
          content: 'CRM FAQ documentation.',
          attachment: '',
          isActive: true
        }

      ];

      this.articles.sort((a, b) => b.articleId - a.articleId);

      this.totalRecords = this.articles.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }

  saveArticle() {

    this.submitted = true;

    if (

      !this.article.title ||
      !this.article.category ||
      !this.article.status

    ) {

      return;

    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newArticle = {

          ...this.article,

          articleId: this.articles.length
            ? Math.max(...this.articles.map(x => x.articleId)) + 1
            : 1

        };

        this.articles.unshift(newArticle);

      }

      else {

        const index = this.articles.findIndex(

          x => x.articleId === this.article.articleId

        );

        if (index !== -1) {

          this.articles[index] = {

            ...this.article

          };

        }

      }

      this.articles = [...this.articles];

      this.totalRecords = this.articles.length;

      this.page = 1;

      const message = this.isEdit

        ? 'Knowledge base article updated successfully.'

        : 'Knowledge base article created successfully.';

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(message);

    }, 500);

  }
    edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.articles.find(
        x => x.articleId === id
      );

      if (selected) {

        this.article = {
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

          this.articles = this.articles.filter(
            x => x.articleId !== id
          );

          this.totalRecords = this.articles.length;

          if (
            this.page > 1 &&
            this.pagedArticles.length === 0
          ) {

            this.page--;

          }

          // Refresh Grid

          this.articles = [...this.articles];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Knowledge base article deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.article = {

      articleId: 0,
      title: '',
      category: '',
      keywords: '',
      visibility: '',
      status: '',
      author: '',
      version: '',
      lastUpdated: '',
      summary: '',
      content: '',
      attachment: '',
      isActive: true

    };

    this.selectedFileName = '';

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredArticles() {

    return this.articles.filter(x =>

      x.title
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.category
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.author
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.visibility
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.status
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.version
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

    );

  }

  get pagedArticles() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredArticles.slice(

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
