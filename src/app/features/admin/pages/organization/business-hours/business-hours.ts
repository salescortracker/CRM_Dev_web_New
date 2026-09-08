import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-business-hours',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './business-hours.html',
  styleUrl: './business-hours.css',
})
export class BusinessHours {
    submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = '';

  businessHours: any[] = [];

  businessHour: any = {

    businessHoursId: 0,

    businessHoursName: '',
    branch: '',
    timeZone: '',

    startTime: '',
    endTime: '',

    breakStart: '',
    breakEnd: '',

    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,

    workingDays: '',

    weekendPolicy: 'Saturday & Sunday',
    holidayCalendar: 'India Holidays 2026',

    totalHours: '8 Hours',

    graceTime: 15,
    halfDayHours: 4,

    flexibleHours: 'No',
    overtimeAllowed: 'No',

    description: '',

    isActive: true

  };

  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.loadBusinessHours();

  }

  loadBusinessHours() {

    this.spinner.show();

    setTimeout(() => {

      this.businessHours = [

        {
          businessHoursId: 1,

          businessHoursName: 'Corporate Office Hours',

          branch: 'Hyderabad Head Office',

          timeZone: 'Asia/Kolkata',

          startTime: '09:00',

          endTime: '18:00',

          breakStart: '13:00',

          breakEnd: '14:00',

          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false,

          workingDays: 'Mon-Fri',

          weekendPolicy: 'Saturday & Sunday',

          holidayCalendar: 'India Holidays 2026',

          totalHours: '8 Hours',

          graceTime: 15,

          halfDayHours: 4,

          flexibleHours: 'No',

          overtimeAllowed: 'Yes',

          description: 'Standard office working hours.',

          isActive: true

        },

        {
          businessHoursId: 2,

          businessHoursName: 'Support Team Shift',

          branch: 'Bengaluru Branch',

          timeZone: 'Asia/Kolkata',

          startTime: '08:00',

          endTime: '17:00',

          breakStart: '12:30',

          breakEnd: '13:15',

          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: false,

          workingDays: 'Mon-Sat',

          weekendPolicy: 'Sunday Only',

          holidayCalendar: 'India Holidays 2026',

          totalHours: '8 Hours',

          graceTime: 10,

          halfDayHours: 4,

          flexibleHours: 'Yes',

          overtimeAllowed: 'Yes',

          description: 'Customer support shift.',

          isActive: true

        },

        {
          businessHoursId: 3,

          businessHoursName: 'Sales Team Hours',

          branch: 'Chennai Branch',

          timeZone: 'Asia/Kolkata',

          startTime: '10:00',

          endTime: '19:00',

          breakStart: '13:30',

          breakEnd: '14:15',

          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false,

          workingDays: 'Mon-Fri',

          weekendPolicy: 'Saturday & Sunday',

          holidayCalendar: 'Company Holidays',

          totalHours: '8 Hours',

          graceTime: 20,

          halfDayHours: 4,

          flexibleHours: 'Yes',

          overtimeAllowed: 'No',

          description: 'Sales department office timing.',

          isActive: true

        },
                {
          businessHoursId: 4,

          businessHoursName: 'Operations Shift',

          branch: 'Mumbai Branch',

          timeZone: 'Asia/Kolkata',

          startTime: '07:00',

          endTime: '16:00',

          breakStart: '12:00',

          breakEnd: '12:45',

          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: false,

          workingDays: 'Mon-Sat',

          weekendPolicy: 'Sunday Only',

          holidayCalendar: 'India Holidays 2026',

          totalHours: '8 Hours',

          graceTime: 15,

          halfDayHours: 4,

          flexibleHours: 'No',

          overtimeAllowed: 'Yes',

          description: 'Operations team business hours.',

          isActive: true

        },

        {
          businessHoursId: 5,

          businessHoursName: 'Regional Office Hours',

          branch: 'Vijayawada Branch',

          timeZone: 'Asia/Kolkata',

          startTime: '09:30',

          endTime: '18:30',

          breakStart: '13:00',

          breakEnd: '14:00',

          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false,

          workingDays: 'Mon-Fri',

          weekendPolicy: 'Saturday & Sunday',

          holidayCalendar: 'Company Holidays',

          totalHours: '8 Hours',

          graceTime: 10,

          halfDayHours: 4,

          flexibleHours: 'Yes',

          overtimeAllowed: 'No',

          description: 'Regional office working schedule.',

          isActive: true

        }

      ];

      this.businessHours.sort(
        (a, b) => b.businessHoursId - a.businessHoursId
      );

      this.totalRecords = this.businessHours.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }
    saveBusinessHours() {

    this.submitted = true;

    if (
      !this.businessHour.businessHoursName ||
      !this.businessHour.branch ||
      !this.businessHour.timeZone ||
      !this.businessHour.startTime ||
      !this.businessHour.endTime
    ) {
      return;
    }

    this.businessHour.workingDays = this.getWorkingDays();

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newBusinessHour = {

          ...this.businessHour,

          businessHoursId: this.businessHours.length
            ? Math.max(...this.businessHours.map(x => x.businessHoursId)) + 1
            : 1

        };

        this.businessHours.unshift(newBusinessHour);

      } else {

        const index = this.businessHours.findIndex(
          x => x.businessHoursId === this.businessHour.businessHoursId
        );

        if (index !== -1) {

          this.businessHours[index] = {

            ...this.businessHour

          };

        }

      }

      this.businessHours = [...this.businessHours];

      this.totalRecords = this.businessHours.length;

      this.page = 1;

      const isUpdate = this.isEdit;

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(
        isUpdate
          ? 'Business Hours updated successfully.'
          : 'Business Hours created successfully.'
      );

    }, 500);

  }

  getWorkingDays(): string {

    const days: string[] = [];

    if (this.businessHour.monday) days.push('Mon');
    if (this.businessHour.tuesday) days.push('Tue');
    if (this.businessHour.wednesday) days.push('Wed');
    if (this.businessHour.thursday) days.push('Thu');
    if (this.businessHour.friday) days.push('Fri');
    if (this.businessHour.saturday) days.push('Sat');
    if (this.businessHour.sunday) days.push('Sun');

    return days.join(', ');

  }

  edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.businessHours.find(
        x => x.businessHoursId === id
      );

      if (selected) {

        this.businessHour = {

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

          this.businessHours = this.businessHours.filter(
            x => x.businessHoursId !== id
          );

          this.totalRecords = this.businessHours.length;

          if (
            this.page > 1 &&
            this.pagedBusinessHours.length === 0
          ) {

            this.page--;

          }

          this.businessHours = [...this.businessHours];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Business Hours deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.businessHour = {

      businessHoursId: 0,

      businessHoursName: '',
      branch: '',
      timeZone: '',

      startTime: '',
      endTime: '',

      breakStart: '',
      breakEnd: '',

      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,

      workingDays: '',

      weekendPolicy: 'Saturday & Sunday',
      holidayCalendar: 'India Holidays 2026',

      totalHours: '8 Hours',

      graceTime: 15,
      halfDayHours: 4,

      flexibleHours: 'No',
      overtimeAllowed: 'No',

      description: '',

      isActive: true

    };

    this.submitted = false;

    this.isEdit = false;

    this.cd.detectChanges();

  }

  get filteredBusinessHours() {

    return this.businessHours.filter(x =>

      x.businessHoursName.toLowerCase().includes(this.searchText.toLowerCase())

      ||

      x.branch.toLowerCase().includes(this.searchText.toLowerCase())

      ||

      x.timeZone.toLowerCase().includes(this.searchText.toLowerCase())

      ||

      x.workingDays.toLowerCase().includes(this.searchText.toLowerCase())

      ||

      x.startTime.toLowerCase().includes(this.searchText.toLowerCase())

      ||

      x.endTime.toLowerCase().includes(this.searchText.toLowerCase())

      ||

      x.weekendPolicy.toLowerCase().includes(this.searchText.toLowerCase())

      ||

      x.holidayCalendar.toLowerCase().includes(this.searchText.toLowerCase()) );

  }

  get pagedBusinessHours() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredBusinessHours.slice(
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
