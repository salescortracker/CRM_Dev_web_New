import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../shared/pagination/pagination';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { ControlsystemService } from '../services/controlsystem-service';

@Component({
  selector: 'app-email-automation',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './email-automation.html',
  styleUrl: './email-automation.css',
})
export class EmailAutomation implements OnInit {

  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private controlsystemService: ControlsystemService
  ) { }

  //====================================================
  // Screen Variables
  //====================================================

  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 10;

  searchText = '';
  companyFilter = '';
  statusFilter = '';

  //====================================================
  // Dropdown Data (from backend)
  //====================================================

  companies: any[] = [];
  regions: any[] = [];
  emailTemplates: any[] = [];

  //====================================================
  // Delay Unit Helper (UI only — collapses into minutes)
  //====================================================

  delayUnits = [
    { label: 'Immediately', multiplier: 0 },
    { label: 'Minutes', multiplier: 1 },
    { label: 'Hours', multiplier: 60 },
    { label: 'Days', multiplier: 1440 }
  ];

  //====================================================
  // Email Automation List
  //====================================================

  emailAutomations: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  emailAutomation: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      emailAutomationId: 0,

      companyId: null,

      regionId: null,

      automationName: '',

      moduleName: '',

      description: '',

      triggerEvent: '',

      emailTemplateId: null,

      recipientType: '',

      scheduleType: '',

      delayValue: null,

      delayUnit: 'Immediately',

      fromEmail: '',

      isActive: true

    };

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadCompanies();

    this.loadRegions();

    this.loadEmailTemplates();

    this.loadEmailAutomations();

  }

  //====================================================
  // Load Dropdown Data
  //====================================================

  loadCompanies(): void {

    this.authService.getCompanies().subscribe({

      next: (res: any) => {

        this.companies = (res?.data || []).filter(
          (x: any) => x.isActive !== false
        );

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading companies:', err);

        this.companies = [];

      }

    });

  }

  loadRegions(): void {

    this.authService.getRegions().subscribe({

      next: (res: any) => {

        this.regions = (res?.data || []).filter(
          (x: any) => x.isActive !== false
        );

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading regions:', err);

        this.regions = [];

      }

    });

  }

  loadEmailTemplates(): void {

    this.controlsystemService.getEmailTemplates().subscribe({

      next: (res: any) => {

        this.emailTemplates = res?.data || [];

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading email templates:', err);

        this.emailTemplates = [];

      }

    });

  }

  //====================================================
  // Load Email Automations
  //====================================================

  loadEmailAutomations(): void {

    this.spinner.show();

    this.controlsystemService.getEmailAutomations().subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success) {

          this.emailAutomations = res.data || [];

        } else {

          this.emailAutomations = [];

          this.alert.warning(
            res?.message || 'No email automation records found.'
          );

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Error loading email automations:', err);

        this.emailAutomations = [];

        this.alert.error(
          err?.error?.message || 'Failed to load email automations.'
        );

        this.cd.detectChanges();

      }

    });

  }

  //====================================================
  // Lookup Helpers (Display Names)
  //====================================================

  getCompanyName(id: any): string {

    if (!id) return '-';

    const item = this.companies.find(x => x.companyId === Number(id));

    return item ? item.companyName : '-';

  }

  getRegionName(id: any): string {

    if (!id) return '-';

    const item = this.regions.find(x => x.regionId === Number(id));

    return item ? item.regionName : '-';

  }

  getEmailTemplateName(id: any): string {

    if (!id) return '-';

    const item = this.emailTemplates.find(
      x => x.emailTemplateId === Number(id)
    );

    return item ? item.templateName : '-';

  }

  getDelayLabel(item: any): string {

    const minutes = Number(item.delayMinutes || 0);

    if (!minutes) return 'Immediately';

    if (minutes % 1440 === 0) {
      return `${minutes / 1440} Day(s)`;
    }

    if (minutes % 60 === 0) {
      return `${minutes / 60} Hour(s)`;
    }

    return `${minutes} Minute(s)`;

  }

  private minutesToValueUnit(minutes: number | null | undefined): { value: number | null, unit: string } {

    const m = Number(minutes || 0);

    if (!m) return { value: null, unit: 'Immediately' };

    if (m % 1440 === 0) {
      return { value: m / 1440, unit: 'Days' };
    }

    if (m % 60 === 0) {
      return { value: m / 60, unit: 'Hours' };
    }

    return { value: m, unit: 'Minutes' };

  }

  //====================================================
  // Cascading Dropdown
  //====================================================

  get formRegions(): any[] {

    if (!this.emailAutomation.companyId) return this.regions;

    return this.regions.filter(
      x => x.companyId === Number(this.emailAutomation.companyId)
    );

  }

  onCompanyChange(): void {

    this.emailAutomation.regionId = null;

  }

  //====================================================
  // Filtered Email Automations
  //====================================================

  get filteredEmailAutomations() {

    return this.emailAutomations.filter(x => {

      const search = this.searchText.trim().toLowerCase();

      const matchSearch =
        !search ||
        (x.automationName || '').toLowerCase().includes(search) ||
        (x.moduleName || '').toLowerCase().includes(search) ||
        (x.triggerEvent || '').toLowerCase().includes(search);

      const matchCompany =
        !this.companyFilter ||
        Number(x.companyId) === Number(this.companyFilter);

      const matchStatus =
        this.statusFilter === '' ||
        (this.statusFilter === 'Active' && x.isActive === true) ||
        (this.statusFilter === 'Inactive' && x.isActive === false);

      return matchSearch && matchCompany && matchStatus;

    });

  }

  //====================================================
  // Pagination
  //====================================================

  get pagedEmailAutomations() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredEmailAutomations.slice(start, start + this.pageSize);

  }

  //====================================================
  // Statistics
  //====================================================

  get totalAutomations(): number {

    return this.emailAutomations.length;

  }

  get activeAutomations(): number {

    return this.emailAutomations.filter(x => x.isActive === true).length;

  }

  get inactiveAutomations(): number {

    return this.emailAutomations.filter(x => x.isActive === false).length;

  }

  get scheduledAutomations(): number {

    return this.emailAutomations.filter(x => x.scheduleType === 'Scheduled').length;

  }

  //====================================================
  // Save / Update
  //====================================================

  saveEmailAutomation(): void {

    this.submitted = true;

    if (
      !this.emailAutomation.companyId ||
      !this.emailAutomation.regionId ||
      !this.emailAutomation.automationName ||
      !this.emailAutomation.automationName.trim() ||
      !this.emailAutomation.moduleName ||
      !this.emailAutomation.triggerEvent ||
      !this.emailAutomation.recipientType ||
      !this.emailAutomation.scheduleType
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    const unit = this.delayUnits.find(
      u => u.label === this.emailAutomation.delayUnit
    ) || this.delayUnits[0];

    const delayMinutes =
      unit.multiplier === 0
        ? 0
        : Number(this.emailAutomation.delayValue || 0) * unit.multiplier;

    if (delayMinutes < 0) {

      this.alert.warning('Delay Minutes cannot be negative.');

      return;

    }

    const payload = {

      emailAutomationId: this.isEdit ? this.emailAutomation.emailAutomationId : 0,

      companyId: Number(this.emailAutomation.companyId),

      regionId: Number(this.emailAutomation.regionId),

      automationName: this.emailAutomation.automationName.trim(),

      moduleName: this.emailAutomation.moduleName,

      description: this.emailAutomation.description
        ? this.emailAutomation.description.trim()
        : null,

      triggerEvent: this.emailAutomation.triggerEvent,

      emailTemplateId: this.emailAutomation.emailTemplateId
        ? Number(this.emailAutomation.emailTemplateId)
        : null,

      recipientType: this.emailAutomation.recipientType,

      scheduleType: this.emailAutomation.scheduleType,

      delayMinutes: delayMinutes,

      fromEmail: this.emailAutomation.fromEmail
        ? this.emailAutomation.fromEmail.trim()
        : null,

      isActive: !!this.emailAutomation.isActive

    };

    this.spinner.show();

    if (this.isEdit) {

      this.controlsystemService.updateEmailAutomation(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Email Automation updated successfully.'
            );

            this.clear();

            this.loadEmailAutomations();

          } else {

            this.alert.warning(
              res?.message || 'Failed to update email automation.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Update email automation error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to update email automation.'
          );

        }

      });

    } else {

      this.controlsystemService.createEmailAutomation(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Email Automation created successfully.'
            );

            this.clear();

            this.loadEmailAutomations();

          } else {

            this.alert.warning(
              res?.message || 'Failed to create email automation.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Create email automation error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to create email automation.'
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

    this.controlsystemService.getEmailAutomationById(id).subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success && res.data) {

          const data = res.data;

          const delay = this.minutesToValueUnit(data.delayMinutes);

          this.emailAutomation = {

            emailAutomationId: data.emailAutomationId,

            companyId: data.companyId,

            regionId: data.regionId,

            automationName: data.automationName || '',

            moduleName: data.moduleName || '',

            description: data.description || '',

            triggerEvent: data.triggerEvent || '',

            emailTemplateId: data.emailTemplateId,

            recipientType: data.recipientType || '',

            scheduleType: data.scheduleType || '',

            delayValue: delay.value,

            delayUnit: delay.unit,

            fromEmail: data.fromEmail || '',

            isActive: data.isActive === true

          };

          this.isEdit = true;

          this.submitted = false;

          this.cd.detectChanges();

        } else {

          this.alert.warning(res?.message || 'Email Automation not found.');

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Get email automation error:', err);

        this.alert.error(
          err?.error?.message || 'Failed to load email automation.'
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

      this.controlsystemService.deleteEmailAutomation(id).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Email Automation deleted successfully.'
            );

            if (this.page > 1 && this.pagedEmailAutomations.length === 1) {
              this.page = this.page - 1;
            }

            this.loadEmailAutomations();

          } else {

            this.alert.warning(
              res?.message || 'Failed to delete email automation.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Delete email automation error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to delete email automation.'
          );

        }

      });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.emailAutomation = this.getEmptyModel();

    this.submitted = false;

    this.isEdit = false;

  }

  //====================================================
  // Clear Filters
  //====================================================

  clearFilters(): void {

    this.searchText = '';

    this.companyFilter = '';

    this.statusFilter = '';

    this.page = 1;

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

  //====================================================
  // Refresh
  //====================================================

  refresh(): void {

    this.page = 1;

    this.loadEmailAutomations();

  }

}
