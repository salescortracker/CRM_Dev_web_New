import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-project-documents',
  standalone:true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './project-documents.html',
  styleUrl: './project-documents.css',
})
export class ProjectDocuments {
   submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = '';

  selectedFileName = '';

  documents: any[] = [];

  document: any = {

    documentId: 0,
    documentName: '',
    project: '',
    category: '',
    version: '',
    fileName: '',
    fileSize: '',
    fileType: '',
    uploadedBy: '',
    uploadDate: '',
    description: '',
    isActive: true

  };

  constructor(

    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef

  ) { }

  ngOnInit(): void {

    this.loadDocuments();

  }

  onFileSelected(event: any) {

    if (event.target.files.length > 0) {

      const file = event.target.files[0];

      this.selectedFileName = file.name;

      this.document.fileName = file.name;

      this.document.fileSize = Math.round(file.size / 1024);

      const extension = file.name.split('.').pop();

      this.document.fileType = extension?.toUpperCase();

    }

  }

  loadDocuments() {

    this.spinner.show();

    setTimeout(() => {

      this.documents = [

        {

          documentId: 1,
          documentName: 'Business Requirements',
          project: 'CRM Implementation',
          category: 'Requirement Document',
          version: 'v1.0',
          fileName: 'BRD.pdf',
          fileSize: 650,
          fileType: 'PDF',
          uploadedBy: 'Rahul Sharma',
          uploadDate: '2026-08-02',
          description: 'Business requirement document.',
          isActive: true

        },

        {

          documentId: 2,
          documentName: 'Database Design',
          project: 'ERP Integration',
          category: 'Design',
          version: 'v2.0',
          fileName: 'Database.docx',
          fileSize: 820,
          fileType: 'DOCX',
          uploadedBy: 'Anil Kumar',
          uploadDate: '2026-08-06',
          description: 'Database design document.',
          isActive: true

        },

        {

          documentId: 3,
          documentName: 'Test Cases',
          project: 'Support Portal',
          category: 'Testing',
          version: 'v1.1',
          fileName: 'Testing.xlsx',
          fileSize: 420,
          fileType: 'XLSX',
          uploadedBy: 'Priya Reddy',
          uploadDate: '2026-08-11',
          description: 'Application testing documents.',
          isActive: true

        },

        {

          documentId: 4,
          documentName: 'Deployment Guide',
          project: 'Data Migration',
          category: 'Deployment',
          version: 'v1.3',
          fileName: 'Deployment.pdf',
          fileSize: 350,
          fileType: 'PDF',
          uploadedBy: 'Kiran Kumar',
          uploadDate: '2026-08-16',
          description: 'Deployment steps.',
          isActive: true

        },

        {

          documentId: 5,
          documentName: 'User Manual',
          project: 'Internal HR Portal',
          category: 'User Manual',
          version: 'v3.0',
          fileName: 'Manual.pdf',
          fileSize: 980,
          fileType: 'PDF',
          uploadedBy: 'Sandeep',
          uploadDate: '2026-08-22',
          description: 'End user manual.',
          isActive: true

        }

      ];

      this.documents.sort((a, b) => b.documentId - a.documentId);

      this.totalRecords = this.documents.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }

  saveDocument() {

    this.submitted = true;

    if (

      !this.document.documentName ||
      !this.document.project ||
      !this.document.category

    ) {

      return;

    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const nextId = this.documents.length
          ? Math.max(...this.documents.map(x => x.documentId)) + 1
          : 1;

        const newDocument = {

          ...this.document,

          documentId: nextId

        };

        this.documents.unshift(newDocument);

      }

      else {

        const index = this.documents.findIndex(

          x => x.documentId === this.document.documentId

        );

        if (index !== -1) {

          this.documents[index] = {

            ...this.document

          };

        }

      }

      this.documents = [...this.documents];

      this.totalRecords = this.documents.length;

      this.page = 1;

      const message = this.isEdit

        ? 'Project document updated successfully.'

        : 'Project document created successfully.';

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(message);

    }, 500);

  }
    edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.documents.find(
        x => x.documentId === id
      );

      if (selected) {

        this.document = {
          ...selected
        };

        this.selectedFileName = selected.fileName;

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

          this.documents = this.documents.filter(
            x => x.documentId !== id
          );

          this.totalRecords = this.documents.length;

          if (
            this.page > 1 &&
            this.pagedDocuments.length === 0
          ) {

            this.page--;

          }

          this.documents = [...this.documents];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Project document deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.document = {

      documentId: 0,
      documentName: '',
      project: '',
      category: '',
      version: '',
      fileName: '',
      fileSize: '',
      fileType: '',
      uploadedBy: '',
      uploadDate: '',
      description: '',
      isActive: true

    };

    this.selectedFileName = '';

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredDocuments() {

    return this.documents.filter(x =>

      x.documentName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.project
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.category
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.version
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.fileName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.uploadedBy
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

    );

  }

  get pagedDocuments() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredDocuments.slice(

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
