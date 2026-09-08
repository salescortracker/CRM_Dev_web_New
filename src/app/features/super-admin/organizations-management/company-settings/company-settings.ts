import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { Pagination } from '../../../../shared/pagination/pagination';

@Component({
  selector: 'app-company-settings',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './company-settings.html',
  styleUrl: './company-settings.css',
})
export class CompanySettings {
     activeUsers = 125;
  settings: any = {

  // Notifications
  desktopNotifications: true,

  // UI
  defaultDashboard: 'CRM Dashboard',
  theme: 'Light',
  landingPage: '/dashboard',

  // Prefixes
  defaultCurrency: 'INR',
  leadPrefix: 'LEAD',
  customerPrefix: 'CUS',
  invoicePrefix: 'INV',
  employeePrefix: 'EMP',

  // Automation
  autoLeadAssignment: true,
  autoFollowup: true,
  autoOpportunity: true,
  autoQuotation: true,
  autoInvoice: true,
  autoEmail: false,

  // File Upload
  maxUploadSize: 10,
  profileImageSize: 2,
  allowedFileTypes: '.jpg,.jpeg,.png,.pdf,.docx',
  storagePath: 'D:\\CRM\\Uploads',
  backupPath: 'D:\\CRM\\Backup',
  compressUploads: true,
  enableCloudStorage: false,

  // AI
  enableAI: true,
  aiLeadScoring: true,
  aiSalesPrediction: true,
  aiEmailSuggestions: true,
  aiChatAssistant: true,
  aiProvider: 'OpenAI',
  aiApiKey: '',
  

  // Integrations
  googleCalendar: false,
  microsoft365: false,
  zoom: false,
  microsoftTeams: false,
  slack: false,
  whatsApp: false,
  paymentGateway: false,
  smsGateway: false,

  // API
  publicApiKey: '',
  secretApiKey: ''

};

  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice
  ) { }

  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 10;

  searchText = '';

  companySetting: any = {};

  companySettings: any[] = [];

  ngOnInit(): void {

    this.resetForm();

    this.loadStaticData();

  }

  resetForm(): void {

    this.companySetting = {

      settingId: 0,

      companyName: '',

      companyCode: '',

      companyEmail: '',

      companyPhone: '',

      companyWebsite: '',

      companyAddress: '',

      city: '',

      state: '',

      country: '',

      postalCode: '',

      timeZone: 'Asia/Kolkata',

      currency: 'INR',

      dateFormat: 'dd/MM/yyyy',

      timeFormat: '12 Hours',

      language: 'English',

      financialYear: 'April - March',

      weekStartDay: 'Monday',

      logo: '',

      favicon: '',

      smtpHost: '',

      smtpPort: 587,

      smtpUserName: '',

      smtpPassword: '',

      smtpFromEmail: '',

      smtpSSL: true,

      loginWithOTP: false,

      twoFactorAuthentication: false,

      passwordExpiryDays: 90,

      sessionTimeout: 30,

      allowSelfRegistration: false,

      enableAuditLogs: true,

      enableNotifications: true,

      enableEmailNotification: true,

      enableSMSNotification: false,

      enableWhatsAppNotification: false,

      maintenanceMode: false,

      isActive: true

    };

  }

  loadStaticData(): void {

    this.companySettings = [

      {

        settingId: 1,

        companyName: 'ABC Technologies',

        companyCode: 'ABC001',

        companyEmail: 'info@abc.com',

        companyPhone: '9876543210',

        companyWebsite: 'www.abc.com',

        companyAddress: 'Hyderabad',

        city: 'Hyderabad',

        state: 'Telangana',

        country: 'India',

        postalCode: '500081',

        timeZone: 'Asia/Kolkata',

        currency: 'INR',

        dateFormat: 'dd/MM/yyyy',

        timeFormat: '12 Hours',

        language: 'English',

        financialYear: 'April -March',

        weekStartDay: 'Monday',

        smtpHost: 'smtp.gmail.com',

        smtpPort: 587,

        smtpUserName: 'admin@abc.com',

        smtpPassword: '******',

        smtpFromEmail: 'admin@abc.com',

        smtpSSL: true,

        loginWithOTP: true,

        twoFactorAuthentication: true,

        passwordExpiryDays: 90,

        sessionTimeout: 30,

        allowSelfRegistration: false,

        enableAuditLogs: true,

        enableNotifications: true,

        enableEmailNotification: true,

        enableSMSNotification: false,

        enableWhatsAppNotification: false,

        maintenanceMode: false,

        isActive: true

      }

    ];

  }
    // ==========================================
  // Save / Update Company Settings
  // ==========================================

  saveSettings(): void {

    this.submitted = true;

    if (
      !this.companySetting.companyName ||
      !this.companySetting.companyCode ||
      !this.companySetting.companyEmail
    ) {
      this.alert.warning('Please fill all mandatory fields.');
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (this.isEdit) {

        const index = this.companySettings.findIndex(
          x => x.settingId === this.companySetting.settingId
        );

        if (index > -1) {

          this.companySettings[index] = {
            ...this.companySetting
          };

        }

        this.alert.success('Company Settings updated successfully.');

      }
      else {

        this.companySetting.settingId = new Date().getTime();

        this.companySettings.unshift({
          ...this.companySetting
        });

        this.alert.success('Company Settings saved successfully.');

      }

      this.spinner.hide();

      this.clear();

    }, 500);

  }

  // ==========================================
  // Clear Form
  // ==========================================

  clear(): void {

    this.resetForm();

    this.isEdit = false;

    this.submitted = false;

  }

  // ==========================================
  // Cancel Edit
  // ==========================================

  cancel(): void {

    this.clear();

  }

  // ==========================================
  // Reset to Default
  // ==========================================

  restoreDefaults(): void {

    this.alert.confirm(
      'Restore Default Settings?',
      'All unsaved changes will be lost.'
    ).then(result => {

      if (!result.isConfirmed) {
        return;
      }

      this.resetForm();

      this.isEdit = false;

      this.alert.success('Default settings restored.');

    });

  }
    // ==========================================
  // Edit
  // ==========================================

  edit(settingId: number): void {

    const data = this.companySettings.find(
      x => x.settingId === settingId
    );

    if (!data) {
      return;
    }

    this.companySetting = {
      ...data
    };

    this.isEdit = true;

    this.submitted = false;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }

  // ==========================================
  // Delete
  // ==========================================

  delete(settingId: number): void {

    this.alert.deleteConfirm().then(result => {

      if (!result.isConfirmed) {
        return;
      }

      this.spinner.show();

      setTimeout(() => {

        this.companySettings =
          this.companySettings.filter(
            x => x.settingId !== settingId
          );

        this.spinner.hide();

        this.alert.success(
          'Company Settings deleted successfully.'
        );

      }, 500);

    });

  }

  // ==========================================
  // Refresh
  // ==========================================

  refresh(): void {

    this.spinner.show();

    setTimeout(() => {

      this.spinner.hide();

      this.alert.success(
        'Company Settings refreshed successfully.'
      );

    }, 500);

  }

  // ==========================================
  // Import
  // ==========================================

  importSettings(): void {

    this.alert.info(
      'Import functionality will be connected with API.'
    );

  }

  // ==========================================
  // Export
  // ==========================================

  exportSettings(): void {

    this.alert.info(
      'Export functionality will be connected with API.'
    );

  }

  // ==========================================
  // Download Template
  // ==========================================

  downloadTemplate(): void {

    this.alert.info(
      'Template download functionality coming soon.'
    );

  }

  // ==========================================
  // Restore Backup
  // ==========================================

  restoreBackup(): void {

    this.alert.warning(
      'Restore Backup functionality will be available after backend integration.'
    );

  }
    // ==========================================
  // Search & Filtering
  // ==========================================

  get filteredSettings(): any[] {

    const search = this.searchText.toLowerCase().trim();

    return this.companySettings.filter(x => {

      return (
        x.companyName?.toLowerCase().includes(search) ||
        x.companyCode?.toLowerCase().includes(search) ||
        x.companyEmail?.toLowerCase().includes(search) ||
        x.city?.toLowerCase().includes(search) ||
        x.country?.toLowerCase().includes(search)
      );

    });

  }

  // ==========================================
  // Pagination
  // ==========================================

  get pagedSettings(): any[] {

    const start = (this.page - 1) * this.pageSize;

    const end = start + this.pageSize;

    return this.filteredSettings.slice(start, end);

  }

  changePage(page: number): void {

    this.page = page;

  }

  changePageSize(size: number): void {

    this.pageSize = size;

    this.page = 1;

  }

  // ==========================================
  // Statistics
  // ==========================================

  get totalSettings(): number {

    return this.companySettings.length;

  }

  get activeSettings(): number {

    return this.companySettings.filter(x => x.isActive).length;

  }

  get inactiveSettings(): number {

    return this.companySettings.filter(x => !x.isActive).length;

  }

  // ==========================================
  // Search Clear
  // ==========================================

  clearSearch(): void {

    this.searchText = '';

    this.page = 1;

  }
}
