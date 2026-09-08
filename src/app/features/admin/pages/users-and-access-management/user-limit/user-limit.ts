import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-user-limit',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './user-limit.html',
  styleUrl: './user-limit.css',
})
export class UserLimit {
   submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;

  searchText = '';

  userLimits: any[] = [];

  userLimit: any = {

    userLimitId: 0,

    company: '',

    branch: '',

    department: '',

    userCategory: '',

    licenseType: '',

    maximumUsers: 0,

    usedUsers: 0,

    availableUsers: 0,

    effectiveFrom: '',

    expiryDate: '',

    status: '',

    description: '',

    isActive: true

  };

  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.loadUserLimits();

  }

  loadUserLimits() {

    this.spinner.show();

    setTimeout(() => {

      this.userLimits = [

        {
          userLimitId: 1,

          company: 'ABC Technologies',

          branch: 'Hyderabad',

          department: 'Sales',

          userCategory: 'Employee',

          licenseType: 'Enterprise',

          maximumUsers: 250,

          usedUsers: 180,

          availableUsers: 70,

          effectiveFrom: '2026-01-01',

          expiryDate: '2026-12-31',

          status: 'Active',

          description: 'Enterprise user license allocation for Sales department.',

          isActive: true

        },

        {
          userLimitId: 2,

          company: 'XYZ Solutions',

          branch: 'Bangalore',

          department: 'HR',

          userCategory: 'Manager',

          licenseType: 'Professional',

          maximumUsers: 80,

          usedUsers: 45,

          availableUsers: 35,

          effectiveFrom: '2026-02-01',

          expiryDate: '2026-12-31',

          status: 'Active',

          description: 'Professional licenses assigned for HR Managers.',

          isActive: true

        },

        {
          userLimitId: 3,

          company: 'Future Vision',

          branch: 'Chennai',

          department: 'IT',

          userCategory: 'Administrator',

          licenseType: 'Enterprise',

          maximumUsers: 50,

          usedUsers: 30,

          availableUsers: 20,

          effectiveFrom: '2026-03-01',

          expiryDate: '2026-12-31',

          status: 'Active',

          description: 'Enterprise administrator licenses for IT department.',

          isActive: true

        },
                {
          userLimitId: 4,

          company: 'Global InfoTech',

          branch: 'Mumbai',

          department: 'Finance',

          userCategory: 'Employee',

          licenseType: 'Standard',

          maximumUsers: 120,

          usedUsers: 90,

          availableUsers: 30,

          effectiveFrom: '2026-04-01',

          expiryDate: '2026-12-31',

          status: 'Inactive',

          description: 'Standard user licenses allocated for Finance department.',

          isActive: false

        },

        {
          userLimitId: 5,

          company: 'NextGen Pvt Ltd',

          branch: 'Pune',

          department: 'Marketing',

          userCategory: 'Sales Executive',

          licenseType: 'Basic',

          maximumUsers: 60,

          usedUsers: 40,

          availableUsers: 20,

          effectiveFrom: '2026-05-01',

          expiryDate: '2026-12-31',

          status: 'Active',

          description: 'Basic licenses assigned to Marketing Sales Executives.',

          isActive: true

        }

      ];

      this.userLimits.sort(
        (a, b) => b.userLimitId - a.userLimitId
      );

      this.totalRecords = this.userLimits.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }
    saveUserLimit() {

    this.submitted = true;

    if (
      !this.userLimit.company ||
      !this.userLimit.branch ||
      !this.userLimit.department ||
      !this.userLimit.userCategory ||
      !this.userLimit.licenseType ||
      !this.userLimit.maximumUsers ||
      !this.userLimit.effectiveFrom ||
      !this.userLimit.expiryDate ||
      !this.userLimit.status
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      this.userLimit.availableUsers =
        Number(this.userLimit.maximumUsers) -
        Number(this.userLimit.usedUsers);

      if (!this.isEdit) {

        const newUserLimit = {

          ...this.userLimit,

          userLimitId: this.userLimits.length
            ? Math.max(...this.userLimits.map(x => x.userLimitId)) + 1
            : 1

        };

        this.userLimits.unshift(newUserLimit);

      } else {

        const index = this.userLimits.findIndex(
          x => x.userLimitId === this.userLimit.userLimitId
        );

        if (index !== -1) {

          this.userLimits[index] = {

            ...this.userLimit

          };

        }

      }

      this.userLimits = [...this.userLimits];

      this.totalRecords = this.userLimits.length;

      this.page = 1;

      const isUpdate = this.isEdit;

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(

        isUpdate
          ? 'User Limit updated successfully.'
          : 'User Limit created successfully.'

      );

    }, 500);

  }

  edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.userLimits.find(
        x => x.userLimitId === id
      );

      if (selected) {

        this.userLimit = {

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

          this.userLimits = this.userLimits.filter(
            x => x.userLimitId !== id
          );

          this.totalRecords = this.userLimits.length;

          if (
            this.page > 1 &&
            this.pagedUserLimits.length === 0
          ) {

            this.page--;

          }

          this.userLimits = [...this.userLimits];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'User Limit deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.userLimit = {

      userLimitId: 0,

      company: '',

      branch: '',

      department: '',

      userCategory: '',

      licenseType: '',

      maximumUsers: 0,

      usedUsers: 0,

      availableUsers: 0,

      effectiveFrom: '',

      expiryDate: '',

      status: '',

      description: '',

      isActive: true

    };

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredUserLimits() {

    return this.userLimits.filter(x =>

      x.company
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.branch
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.department
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.userCategory
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.licenseType
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.status
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

    );

  }

  get pagedUserLimits() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredUserLimits.slice(
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
