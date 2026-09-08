import { ChangeDetectorRef, Component } from '@angular/core';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-holiday-calendar',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './holiday-calendar.html',
  styleUrl: './holiday-calendar.css',
})
export class HolidayCalendar {
    submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;

  searchText = '';

  holidays: any[] = [];

  holiday: any = {

    holidayId: 0,

    holidayName: '',
    holidayDate: '',
    holidayType: '',

    branch: '',
    businessUnit: '',
    department: '',

    category: '',

    applicableFor: 'All Employees',

    country: '',
    state: '',

    recurring: 'No',

    year: '2026',

    description: '',

    isActive: true

  };

  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.loadHolidays();

  }

  loadHolidays() {

    this.spinner.show();

    setTimeout(() => {

      this.holidays = [

        {
          holidayId: 1,

          holidayName: 'Republic Day',

          holidayDate: '2026-01-26',

          holidayType: 'National Holiday',

          branch: 'Hyderabad Head Office',

          businessUnit: 'Corporate',

          department: 'All Departments',

          category: 'Government',

          applicableFor: 'All Employees',

          country: 'India',

          state: 'Telangana',

          recurring: 'Yes',

          year: '2026',

          description: 'Republic Day celebration.',

          isActive: true

        },

        {
          holidayId: 2,

          holidayName: 'Ugadi',

          holidayDate: '2026-03-19',

          holidayType: 'Festival Holiday',

          branch: 'Vijayawada Branch',

          businessUnit: 'Sales',

          department: 'Sales',

          category: 'Festival',

          applicableFor: 'All Employees',

          country: 'India',

          state: 'Andhra Pradesh',

          recurring: 'Yes',

          year: '2026',

          description: 'Telugu New Year Festival.',

          isActive: true

        },

        {
          holidayId: 3,

          holidayName: 'Independence Day',

          holidayDate: '2026-08-15',

          holidayType: 'National Holiday',

          branch: 'Bengaluru Branch',

          businessUnit: 'Operations',

          department: 'All Departments',

          category: 'Government',

          applicableFor: 'All Employees',

          country: 'India',

          state: 'Karnataka',

          recurring: 'Yes',

          year: '2026',

          description: 'Indian Independence Day.',

          isActive: true

        },
                {
          holidayId: 4,

          holidayName: 'Gandhi Jayanti',

          holidayDate: '2026-10-02',

          holidayType: 'National Holiday',

          branch: 'Chennai Branch',

          businessUnit: 'Finance',

          department: 'Accounts',

          category: 'Government',

          applicableFor: 'All Employees',

          country: 'India',

          state: 'Tamil Nadu',

          recurring: 'Yes',

          year: '2026',

          description: 'Birthday of Mahatma Gandhi.',

          isActive: true

        },

        {
          holidayId: 5,

          holidayName: 'Christmas',

          holidayDate: '2026-12-25',

          holidayType: 'Public Holiday',

          branch: 'Mumbai Branch',

          businessUnit: 'Corporate',

          department: 'All Departments',

          category: 'Religious',

          applicableFor: 'All Employees',

          country: 'India',

          state: 'Maharashtra',

          recurring: 'Yes',

          year: '2026',

          description: 'Christmas celebration.',

          isActive: true

        }

      ];

      this.holidays.sort(
        (a, b) => b.holidayId - a.holidayId
      );

      this.totalRecords = this.holidays.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }
    saveHoliday() {

    this.submitted = true;

    if (
      !this.holiday.holidayName ||
      !this.holiday.holidayDate ||
      !this.holiday.holidayType ||
      !this.holiday.branch ||
      !this.holiday.country
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newHoliday = {

          ...this.holiday,

          holidayId: this.holidays.length
            ? Math.max(...this.holidays.map(x => x.holidayId)) + 1
            : 1

        };

        this.holidays.unshift(newHoliday);

      } else {

        const index = this.holidays.findIndex(
          x => x.holidayId === this.holiday.holidayId
        );

        if (index !== -1) {

          this.holidays[index] = {

            ...this.holiday

          };

        }

      }

      this.holidays = [...this.holidays];

      this.totalRecords = this.holidays.length;

      this.page = 1;

      const isUpdate = this.isEdit;

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(
        isUpdate
          ? 'Holiday updated successfully.'
          : 'Holiday created successfully.'
      );

    }, 500);

  }

  edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.holidays.find(
        x => x.holidayId === id
      );

      if (selected) {

        this.holiday = {

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

          this.holidays = this.holidays.filter(
            x => x.holidayId !== id
          );

          this.totalRecords = this.holidays.length;

          if (
            this.page > 1 &&
            this.pagedHolidays.length === 0
          ) {

            this.page--;

          }

          this.holidays = [...this.holidays];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Holiday deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.holiday = {

      holidayId: 0,

      holidayName: '',
      holidayDate: '',
      holidayType: '',

      branch: '',
      businessUnit: '',
      department: '',

      category: '',

      applicableFor: 'All Employees',

      country: '',
      state: '',

      recurring: 'No',

      year: '2026',

      description: '',

      isActive: true

    };

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredHolidays() {

    return this.holidays.filter(x =>

      x.holidayName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.holidayType
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.branch
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.businessUnit
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.department
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.category
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.country
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.state
        .toLowerCase()
        .includes(this.searchText.toLowerCase() ));

  }

  get pagedHolidays() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredHolidays.slice(
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
