import { ChangeDetectorRef, Component } from '@angular/core';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';

@Component({
  selector: 'app-file-upload-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './file-upload-settings.html',
  styleUrl: './file-upload-settings.css',
})
export class FileUploadSettings {
   submitted = false;

  isEdit = false;

  page = 1;

  pageSize = 5;

  totalRecords = 0;

  searchText = '';



  fileUploadSettings: any[] = [];



  fileUpload: any = {

    fileUploadSettingId: 0,

    settingName: '',

    allowedFileTypes: '',

    maxFileSize: null,

    maxFiles: null,

    storageLocation: '',

    virusScanEnabled: false,

    autoRenameFiles: false,

    description: '',

    isActive: true

  };



  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef

  ) { }



  ngOnInit(): void {

    this.loadFileUploadSettings();

  }



  loadFileUploadSettings() {

    this.spinner.show();

    setTimeout(() => {

      this.fileUploadSettings = [

        {

          fileUploadSettingId: 1,

          settingName: 'Employee Documents',

          allowedFileTypes: 'PDF, DOCX',

          maxFileSize: 10,

          maxFiles: 5,

          storageLocation: 'Local Storage',

          virusScanEnabled: true,

          autoRenameFiles: true,

          description: 'Upload settings for employee-related documents.',

          isActive: true

        },



        {

          fileUploadSettingId: 2,

          settingName: 'Customer Attachments',

          allowedFileTypes: 'PDF, JPG, PNG',

          maxFileSize: 20,

          maxFiles: 10,

          storageLocation: 'Azure Blob Storage',

          virusScanEnabled: true,

          autoRenameFiles: false,

          description: 'Customer attachment upload configuration.',

          isActive: true

        },



        {

          fileUploadSettingId: 3,

          settingName: 'Lead Documents',

          allowedFileTypes: 'PDF, XLSX',

          maxFileSize: 15,

          maxFiles: 8,

          storageLocation: 'Amazon S3',

          virusScanEnabled: false,

          autoRenameFiles: true,

          description: 'Lead document upload settings.',

          isActive: true

        },
                {

          fileUploadSettingId: 4,

          settingName: 'Marketing Assets',

          allowedFileTypes: 'JPG, PNG, MP4',

          maxFileSize: 100,

          maxFiles: 20,

          storageLocation: 'Google Cloud Storage',

          virusScanEnabled: true,

          autoRenameFiles: false,

          description: 'Upload settings for marketing images, videos and promotional assets.',

          isActive: true

        },



        {

          fileUploadSettingId: 5,

          settingName: 'Contracts',

          allowedFileTypes: 'PDF',

          maxFileSize: 25,

          maxFiles: 10,

          storageLocation: 'Azure Blob Storage',

          virusScanEnabled: true,

          autoRenameFiles: true,

          description: 'Upload configuration for customer and vendor contracts.',

          isActive: false

        }

      ];



      this.fileUploadSettings.sort(

        (a, b) => b.fileUploadSettingId - a.fileUploadSettingId

      );



      this.totalRecords = this.fileUploadSettings.length;



      this.spinner.hide();



      this.cd.detectChanges();



    }, 500);

  }
    saveFileUploadSetting() {

    this.submitted = true;

    if (
      !this.fileUpload.settingName ||
      !this.fileUpload.allowedFileTypes ||
      !this.fileUpload.maxFileSize ||
      !this.fileUpload.maxFiles ||
      !this.fileUpload.storageLocation
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newSetting = {

          ...this.fileUpload,

          fileUploadSettingId: this.fileUploadSettings.length
            ? Math.max(...this.fileUploadSettings.map(x => x.fileUploadSettingId)) + 1
            : 1

        };

        this.fileUploadSettings.unshift(newSetting);

      } else {

        const index = this.fileUploadSettings.findIndex(
          x => x.fileUploadSettingId === this.fileUpload.fileUploadSettingId
        );

        if (index !== -1) {

          this.fileUploadSettings[index] = {

            ...this.fileUpload

          };

        }

      }

      this.fileUploadSettings = [...this.fileUploadSettings];

      this.totalRecords = this.fileUploadSettings.length;

      this.page = 1;

      const isUpdate = this.isEdit;

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(

        isUpdate
          ? 'File Upload Setting updated successfully.'
          : 'File Upload Setting created successfully.'

      );

    }, 500);

  }







  edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.fileUploadSettings.find(
        x => x.fileUploadSettingId === id
      );

      if (selected) {

        this.fileUpload = {

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

          this.fileUploadSettings = this.fileUploadSettings.filter(
            x => x.fileUploadSettingId !== id
          );

          this.totalRecords = this.fileUploadSettings.length;

          if (
            this.page > 1 &&
            this.pagedFileUploadSettings.length === 0
          ) {

            this.page--;

          }

          this.fileUploadSettings = [...this.fileUploadSettings];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'File Upload Setting deleted successfully.'
          );

        }, 500);

      }

    });

  }







  clear() {

    this.fileUpload = {

      fileUploadSettingId: 0,

      settingName: '',

      allowedFileTypes: '',

      maxFileSize: null,

      maxFiles: null,

      storageLocation: '',

      virusScanEnabled: false,

      autoRenameFiles: false,

      description: '',

      isActive: true

    };

    this.submitted = false;

    this.isEdit = false;

    this.cd.detectChanges();

  }







  get filteredFileUploadSettings() {

    return this.fileUploadSettings.filter(x =>

      x.settingName.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.allowedFileTypes.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.storageLocation.toLowerCase().includes(this.searchText.toLowerCase())

    );

  }







  get pagedFileUploadSettings() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredFileUploadSettings.slice(

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
