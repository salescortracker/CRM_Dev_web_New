import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';
import { ControlsystemService } from '../../../../super-admin/services/controlsystem-service';
import { AdminService } from '../../../services/admin-service';

@Component({
  selector: 'app-holiday-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './holiday-calendar.html',
  styleUrl: './holiday-calendar.css',
})
export class HolidayCalendar implements OnInit {

  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef,
    private controlsystemService: ControlsystemService,
    private adminService: AdminService
  ) { }

  //====================================================
  // Screen Variables
  //====================================================

  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 10;

  searchText = '';
  countryFilter = '';
  statusFilter = '';

  //====================================================
  // Dropdown Data (from backend)
  //====================================================

  branches: any[] = [];
  businessUnits: any[] = [];
  departments: any[] = [];
  countries: any[] = [];
  states: any[] = [];

  //====================================================
  // Holiday List
  //====================================================

  holidays: any[] = [];

  //====================================================
  // Form Model
  //====================================================

  holiday: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      holidayCalendarId: 0,

      holidayName: '',

      holidayDate: '',

      holidayType: '',

      branchId: null,

      businessUnitId: null,

      departmentId: null,

      holidayCategory: '',

      applicableFor: 'All Employees',

      countryId: null,

      stateId: null,

      recurringHoliday: false,

      description: ''

    };

  }

  //====================================================
  // Lifecycle
  //====================================================

  ngOnInit(): void {

    this.loadBranches();

    this.loadBusinessUnits();

    this.loadDepartments();

    this.loadCountries();

    this.loadStates();

    this.loadHolidays();

  }

  //====================================================
  // Load Dropdown Data
  //====================================================

  loadBranches(): void {

    this.controlsystemService.getBranches().subscribe({

      next: (res: any) => {

        this.branches = res?.data || [];

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading branches:', err);

        this.branches = [];

      }

    });

  }

  loadBusinessUnits(): void {

    this.controlsystemService.getBusinessUnits().subscribe({

      next: (res: any) => {

        this.businessUnits = res?.data || [];

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading business units:', err);

        this.businessUnits = [];

      }

    });

  }

  loadDepartments(): void {

    this.controlsystemService.getDepartments().subscribe({

      next: (res: any) => {

        this.departments = (res?.data || []).filter(
          (x: any) => x.status === true || x.status === 'Active'
        );

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading departments:', err);

        this.departments = [];

      }

    });

  }

  loadCountries(): void {

    this.controlsystemService.getCountries().subscribe({

      next: (res: any) => {

        this.countries = (res?.data || []).filter(
          (x: any) => x.isActive !== false
        );

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading countries:', err);

        this.countries = [];

      }

    });

  }

  loadStates(): void {

    this.controlsystemService.getStates().subscribe({

      next: (res: any) => {

        this.states = (res?.data || []).filter(
          (x: any) => x.isActive !== false
        );

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading states:', err);

        this.states = [];

      }

    });

  }

  //====================================================
  // Load Holidays
  //====================================================

  loadHolidays(): void {

    this.spinner.show();

    this.adminService.getHolidayCalendars().subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success) {

          this.holidays = res.data || [];

        } else {

          this.holidays = [];

          this.alert.warning(
            res?.message || 'No holiday records found.'
          );

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Error loading holidays:', err);

        this.holidays = [];

        this.alert.error(
          err?.error?.message || 'Failed to load holidays.'
        );

        this.cd.detectChanges();

      }

    });

  }

  //====================================================
  // Lookup Helpers (Display Names)
  //====================================================

  getBranchName(id: any): string {

    if (!id) return '-';

    const item = this.branches.find(x => x.branchId === Number(id));

    return item ? item.branchName : '-';

  }

  getBusinessUnitName(id: any): string {

    if (!id) return '-';

    const item = this.businessUnits.find(
      x => x.businessUnitId === Number(id)
    );

    return item ? item.businessUnitName : '-';

  }

  getDepartmentName(id: any): string {

    if (!id) return '-';

    const item = this.departments.find(
      x => x.departmentId === Number(id)
    );

    return item ? item.departmentName : '-';

  }

  getCountryName(id: any): string {

    if (!id) return '-';

    const item = this.countries.find(x => x.countryId === Number(id));

    return item ? item.countryName : '-';

  }

  getStateName(id: any): string {

    if (!id) return '-';

    const item = this.states.find(x => x.stateId === Number(id));

    return item ? item.stateName : '-';

  }

  //====================================================
  // Cascading Dropdown
  //====================================================

  get formStates(): any[] {

    if (!this.holiday.countryId) return this.states;

    return this.states.filter(
      x => x.countryId === Number(this.holiday.countryId)
    );

  }

  onCountryChange(): void {

    this.holiday.stateId = null;

  }

  //====================================================
  // Filtered Holidays
  //====================================================

  get filteredHolidays() {

    return this.holidays.filter(x => {

      const search = this.searchText.trim().toLowerCase();

      const matchSearch =
        !search ||
        (x.holidayName || '').toLowerCase().includes(search) ||
        (x.holidayType || '').toLowerCase().includes(search) ||
        (x.holidayCategory || '').toLowerCase().includes(search) ||
        (x.description || '').toLowerCase().includes(search);

      const matchCountry =
        !this.countryFilter ||
        Number(x.countryId) === Number(this.countryFilter);

      const matchStatus =
        this.statusFilter === '' ||
        (this.statusFilter === 'Recurring' && x.recurringHoliday === true) ||
        (this.statusFilter === 'One-time' && x.recurringHoliday === false);

      return matchSearch && matchCountry && matchStatus;

    });

  }

  //====================================================
  // Pagination
  //====================================================

  get pagedHolidays() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredHolidays.slice(start, start + this.pageSize);

  }

  //====================================================
  // Statistics
  //====================================================

  get totalHolidays(): number {

    return this.holidays.length;

  }

  get recurringHolidays(): number {

    return this.holidays.filter(x => x.recurringHoliday === true).length;

  }

  get upcomingHolidays(): number {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return this.holidays.filter(x => {

      if (!x.holidayDate) return false;

      const d = new Date(x.holidayDate);

      return d >= today;

    }).length;

  }

  get totalYears(): number {

    return [...new Set(this.holidays.map(x => x.year))].length;

  }

  //====================================================
  // Save / Update
  //====================================================

  saveHoliday(): void {

    this.submitted = true;

    if (
      !this.holiday.holidayName ||
      !this.holiday.holidayName.trim() ||
      !this.holiday.holidayDate
    ) {

      this.alert.warning('Please fill all required fields.');

      return;

    }

    const holidayDate: Date = new Date(this.holiday.holidayDate);

    const payload = {

      holidayCalendarId: this.isEdit ? this.holiday.holidayCalendarId : 0,

      holidayName: this.holiday.holidayName.trim(),

      holidayDate: this.holiday.holidayDate,

      year: holidayDate.getFullYear(),

      holidayType: this.holiday.holidayType
        ? this.holiday.holidayType.trim()
        : null,

      branchId: this.holiday.branchId ? Number(this.holiday.branchId) : null,

      businessUnitId: this.holiday.businessUnitId
        ? Number(this.holiday.businessUnitId)
        : null,

      departmentId: this.holiday.departmentId
        ? Number(this.holiday.departmentId)
        : null,

      holidayCategory: this.holiday.holidayCategory
        ? this.holiday.holidayCategory.trim()
        : null,

      applicableFor: this.holiday.applicableFor
        ? this.holiday.applicableFor.trim()
        : null,

      countryId: this.holiday.countryId ? Number(this.holiday.countryId) : null,

      stateId: this.holiday.stateId ? Number(this.holiday.stateId) : null,

      recurringHoliday: !!this.holiday.recurringHoliday,

      description: this.holiday.description
        ? this.holiday.description.trim()
        : null

    };

    this.spinner.show();

    if (this.isEdit) {

      this.adminService.updateHolidayCalendar(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Holiday updated successfully.'
            );

            this.clear();

            this.loadHolidays();

          } else {

            this.alert.warning(
              res?.message || 'Failed to update holiday.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Update holiday error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to update holiday.'
          );

        }

      });

    } else {

      this.adminService.createHolidayCalendar(payload).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Holiday created successfully.'
            );

            this.clear();

            this.loadHolidays();

          } else {

            this.alert.warning(
              res?.message || 'Failed to create holiday.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Create holiday error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to create holiday.'
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

    this.adminService.getHolidayCalendarById(id).subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success && res.data) {

          const data = res.data;

          this.holiday = {

            holidayCalendarId: data.holidayCalendarId,

            holidayName: data.holidayName || '',

            holidayDate: data.holidayDate
              ? data.holidayDate.substring(0, 10)
              : '',

            holidayType: data.holidayType || '',

            branchId: data.branchId,

            businessUnitId: data.businessUnitId,

            departmentId: data.departmentId,

            holidayCategory: data.holidayCategory || '',

            applicableFor: data.applicableFor || '',

            countryId: data.countryId,

            stateId: data.stateId,

            recurringHoliday: data.recurringHoliday === true,

            description: data.description || ''

          };

          this.isEdit = true;

          this.submitted = false;

          this.cd.detectChanges();

        } else {

          this.alert.warning(res?.message || 'Holiday not found.');

        }

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Get holiday error:', err);

        this.alert.error(
          err?.error?.message || 'Failed to load holiday.'
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

      this.adminService.deleteHolidayCalendar(id).subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(
              res.message || 'Holiday deleted successfully.'
            );

            if (this.page > 1 && this.pagedHolidays.length === 1) {
              this.page = this.page - 1;
            }

            this.loadHolidays();

          } else {

            this.alert.warning(
              res?.message || 'Failed to delete holiday.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Delete holiday error:', err);

          this.alert.error(
            err?.error?.message || 'Failed to delete holiday.'
          );

        }

      });

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.holiday = this.getEmptyModel();

    this.submitted = false;

    this.isEdit = false;

  }

  //====================================================
  // Clear Filters
  //====================================================

  clearFilters(): void {

    this.searchText = '';

    this.countryFilter = '';

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

    this.loadHolidays();

  }

}
