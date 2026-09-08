import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { CommonModule } from '@angular/common';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-my-documents',
  standalone:true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './my-documents.html',
  styleUrl: './my-documents.css',
})
export class MyDocuments {
   submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;

  searchText = '';
  selectedCategory = '';
  selectedProject = '';

  selectedFileName = '';

  documents: any[] = [];

  document: any = {

    documentId: 0,
    documentName: '',
    category: '',
    project: '',
    folder: '',
    version: '',
    tags: '',
    fileName: '',
    fileType: '',
    fileSize: '',
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

      this.document.fileType =
        file.name.split('.').pop()?.toUpperCase();

    }

  }

  loadDocuments() {

    this.spinner.show();

    setTimeout(() => {

      this.documents = [

        {

          documentId: 1,
          documentName: 'CRM Requirement Document',
          category: 'Requirement Document',
          project: 'CRM Implementation',
          folder: 'Requirements',
          version: 'v1.0',
          tags: 'CRM,BRD',
          fileName: 'CRM_BRD.pdf',
          fileType: 'PDF',
          fileSize: 650,
          uploadDate: '2026-08-02',
          description: 'Business Requirement Document',
          isActive: true

        },

        {

          documentId: 2,
          documentName: 'Database Design',
          category: 'Design Document',
          project: 'ERP Integration',
          folder: 'Design',
          version: 'v2.1',
          tags: 'SQL,DB',
          fileName: 'Database.docx',
          fileType: 'DOCX',
          fileSize: 920,
          uploadDate: '2026-08-08',
          description: 'Database Architecture',
          isActive: true

        },

        {

          documentId: 3,
          documentName: 'API Collection',
          category: 'Technical Document',
          project: 'Support Portal',
          folder: 'API',
          version: 'v1.2',
          tags: 'API,Postman',
          fileName: 'API.json',
          fileType: 'JSON',
          fileSize: 220,
          uploadDate: '2026-08-11',
          description: 'REST API Collection',
          isActive: true

        },

        {

          documentId: 4,
          documentName: 'Deployment Guide',
          category: 'Technical Document',
          project: 'Data Migration',
          folder: 'Deployment',
          version: 'v3.0',
          tags: 'Server',
          fileName: 'Deployment.pdf',
          fileType: 'PDF',
          fileSize: 470,
          uploadDate: '2026-08-18',
          description: 'Deployment Process',
          isActive: true

        },

        {

          documentId: 5,
          documentName: 'User Manual',
          category: 'User Manual',
          project: 'Internal HR Portal',
          folder: 'Manual',
          version: 'v1.0',
          tags: 'Guide',
          fileName: 'Manual.pdf',
          fileType: 'PDF',
          fileSize: 1100,
          uploadDate: '2026-08-25',
          description: 'Application User Guide',
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

        ? 'Document updated successfully.'

        : 'Document saved successfully.';

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
            'Document deleted successfully.'
          );

        }, 500);

      }

    });

  }

  preview(item: any) {

    this.alert.info(

      'Preview',

      'Previewing "' + item.fileName + '".'

    );

  }

  download(item: any) {

    this.alert.success(

      'Download',

      '"' + item.fileName + '" download started.'

    );

  }

  share(item: any) {

    this.alert.success(

      'Share',

      '"' + item.fileName + '" shared successfully.'

    );

  }

  resetFilters() {

    this.searchText = '';

    this.selectedCategory = '';

    this.selectedProject = '';

    this.page = 1;

  }

  clear() {

    this.document = {

      documentId: 0,
      documentName: '',
      category: '',
      project: '',
      folder: '',
      version: '',
      tags: '',
      fileName: '',
      fileType: '',
      fileSize: '',
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

      (this.searchText === '' ||

        x.documentName.toLowerCase().includes(this.searchText.toLowerCase()) ||

        x.fileName.toLowerCase().includes(this.searchText.toLowerCase()) ||

        x.tags.toLowerCase().includes(this.searchText.toLowerCase())

      )

      &&

      (this.selectedCategory === '' ||

        x.category === this.selectedCategory

      )

      &&

      (this.selectedProject === '' ||

        x.project === this.selectedProject

      )

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
