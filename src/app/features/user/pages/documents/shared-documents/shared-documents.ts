import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-shared-documents',
  standalone:true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './shared-documents.html',
  styleUrl: './shared-documents.css',
})
export class SharedDocuments {
   submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;

  searchText = '';
  selectedPermission = '';
  selectedStatus = '';

  sharedDocuments: any[] = [];

  sharedDocument: any = {

    shareId: 0,
    documentName: '',
    project: '',
    category: '',
    sharedBy: '',
    sharedWith: '',
    permission: '',
    status: 'Active',
    shareDate: '',
    expiryDate: '',
    fileType: '',
    fileSize: '',
    notes: '',
    isActive: true

  };

  constructor(

    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef

  ) { }

  ngOnInit(): void {

    this.loadSharedDocuments();

  }

  loadSharedDocuments() {

    this.spinner.show();

    setTimeout(() => {

      this.sharedDocuments = [

        {

          shareId: 1,
          documentName: 'CRM BRD',
          project: 'CRM Implementation',
          category: 'Requirement Document',
          sharedBy: 'Rahul Sharma',
          sharedWith: 'Sales Team',
          permission: 'Read',
          status: 'Active',
          shareDate: '2026-08-02',
          expiryDate: '2026-12-31',
          fileType: 'PDF',
          fileSize: 620,
          notes: 'Business Requirement Document',
          isActive: true

        },

        {

          shareId: 2,
          documentName: 'Database Design',
          project: 'ERP Integration',
          category: 'Design Document',
          sharedBy: 'Anil Kumar',
          sharedWith: 'Development Team',
          permission: 'Write',
          status: 'Active',
          shareDate: '2026-08-05',
          expiryDate: '2026-11-30',
          fileType: 'DOCX',
          fileSize: 890,
          notes: 'Database Structure',
          isActive: true

        },

        {

          shareId: 3,
          documentName: 'API Documentation',
          project: 'Support Portal',
          category: 'Technical Document',
          sharedBy: 'Priya Reddy',
          sharedWith: 'QA Team',
          permission: 'Full Access',
          status: 'Active',
          shareDate: '2026-08-10',
          expiryDate: '2027-01-15',
          fileType: 'PDF',
          fileSize: 410,
          notes: 'REST API Guide',
          isActive: true

        },

        {

          shareId: 4,
          documentName: 'Deployment Guide',
          project: 'Data Migration',
          category: 'Technical Document',
          sharedBy: 'Kiran Kumar',
          sharedWith: 'Infrastructure Team',
          permission: 'Read',
          status: 'Expired',
          shareDate: '2026-07-01',
          expiryDate: '2026-08-01',
          fileType: 'PDF',
          fileSize: 360,
          notes: 'Deployment Process',
          isActive: false

        },

        {

          shareId: 5,
          documentName: 'HR User Manual',
          project: 'Internal HR Portal',
          category: 'User Manual',
          sharedBy: 'Sandeep',
          sharedWith: 'HR Team',
          permission: 'Write',
          status: 'Revoked',
          shareDate: '2026-08-20',
          expiryDate: '2026-10-20',
          fileType: 'PDF',
          fileSize: 950,
          notes: 'Employee User Guide',
          isActive: false

        }

      ];

      this.sharedDocuments.sort((a, b) => b.shareId - a.shareId);

      this.totalRecords = this.sharedDocuments.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }

  saveSharedDocument() {

    this.submitted = true;

    if (

      !this.sharedDocument.documentName ||
      !this.sharedDocument.project ||
      !this.sharedDocument.category

    ) {

      return;

    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const nextId = this.sharedDocuments.length

          ? Math.max(...this.sharedDocuments.map(x => x.shareId)) + 1

          : 1;

        this.sharedDocuments.unshift({

          ...this.sharedDocument,

          shareId: nextId

        });

      }

      else {

        const index = this.sharedDocuments.findIndex(

          x => x.shareId === this.sharedDocument.shareId

        );

        if (index !== -1) {

          this.sharedDocuments[index] = {

            ...this.sharedDocument

          };

        }

      }

      this.sharedDocuments = [...this.sharedDocuments];

      this.totalRecords = this.sharedDocuments.length;

      this.page = 1;

      const message = this.isEdit

        ? 'Shared document updated successfully.'

        : 'Document shared successfully.';

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(message);

    }, 500);

  }
    edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.sharedDocuments.find(
        x => x.shareId === id
      );

      if (selected) {

        this.sharedDocument = {

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

          this.sharedDocuments = this.sharedDocuments.filter(

            x => x.shareId !== id

          );

          this.totalRecords = this.sharedDocuments.length;

          if (

            this.page > 1 &&

            this.pagedSharedDocuments.length === 0

          ) {

            this.page--;

          }

          this.sharedDocuments = [...this.sharedDocuments];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(

            'Shared document removed successfully.'

          );

        }, 500);

      }

    });

  }

  view(item: any) {

    this.alert.info(

      'View Document',

      'Opening "' + item.documentName + '".'

    );

  }

  download(item: any) {

    this.alert.success(

      'Download',

      '"' + item.documentName + '" download started.'

    );

  }

  managePermission(item: any) {

    this.alert.info(

      'Permission',

      'Managing permissions for "' + item.documentName + '".'

    );

  }

  resetFilters() {

    this.searchText = '';

    this.selectedPermission = '';

    this.selectedStatus = '';

    this.page = 1;

  }

  clear() {

    this.sharedDocument = {

      shareId: 0,
      documentName: '',
      project: '',
      category: '',
      sharedBy: '',
      sharedWith: '',
      permission: '',
      status: 'Active',
      shareDate: '',
      expiryDate: '',
      fileType: '',
      fileSize: '',
      notes: '',
      isActive: true

    };

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredSharedDocuments() {

    return this.sharedDocuments.filter(x =>

      (

        this.searchText === '' ||

        x.documentName.toLowerCase().includes(this.searchText.toLowerCase()) ||

        x.project.toLowerCase().includes(this.searchText.toLowerCase()) ||

        x.sharedBy.toLowerCase().includes(this.searchText.toLowerCase()) ||

        x.sharedWith.toLowerCase().includes(this.searchText.toLowerCase())

      )

      &&

      (

        this.selectedPermission === '' ||

        x.permission === this.selectedPermission

      )

      &&

      (

        this.selectedStatus === '' ||

        x.status === this.selectedStatus

      )

    );

  }

  get pagedSharedDocuments() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredSharedDocuments.slice(

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
