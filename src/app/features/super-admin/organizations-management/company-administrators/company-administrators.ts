import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { Pagination } from '../../../../shared/pagination/pagination';

@Component({
  selector: 'app-company-administrators',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './company-administrators.html',
  styleUrl: './company-administrators.css',
})
export class CompanyAdministrators {
    constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice
  ) { }

  // ============================================
  // Form
  // ============================================

  submitted = false;
  isEdit = false;

  searchText = '';
  companyFilter = '';
  statusFilter = '';

  page = 1;
  pageSize = 10;

  adminId = 0;

  admin: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      adminId: 0,

      company: '',

      employeeCode: '',

      userName: '',

      firstName: '',

      lastName: '',

      email: '',

      mobile: '',

      password: '',

      confirmPassword: '',

      role: '',

      department: 'Administration',

      designation: '',

      reportingManager: '',

      region: 'South Region',

      branch: 'Hyderabad',

      language: 'English',

      timeZone: 'Asia/Kolkata',

      profileImage: '',

      lastLogin: new Date(),

      status: 'Active',

      isActive: true,

      emailVerified: true,

      mobileVerified: true,

      twoFactorEnabled: false,

      forcePasswordChange: false,

      remarks: ''

    };

  }

  // ============================================
  // Static Data
  // ============================================

  administrators: any[] = [

    {

      adminId: 1,

      company: 'ABC Technologies',

      employeeCode: 'EMP0001',

      userName: 'john.admin',

      firstName: 'John',

      lastName: 'David',

      email: 'john@abc.com',

      mobile: '9876543210',

      password: '123',

      confirmPassword: '123',

      role: 'Company Administrator',

      department: 'Administration',

      designation: 'Admin Manager',

      reportingManager: 'CEO',

      region: 'South Region',

      branch: 'Hyderabad',

      language: 'English',

      timeZone: 'Asia/Kolkata',

      lastLogin: new Date(),

      status: 'Active',

      isActive: true,

      emailVerified: true,

      mobileVerified: true,

      twoFactorEnabled: true,

      forcePasswordChange: false,

      remarks: ''

    },

    {

      adminId: 2,

      company: 'XYZ Solutions',

      employeeCode: 'EMP0002',

      userName: 'smith.hr',

      firstName: 'Smith',

      lastName: 'Joseph',

      email: 'smith@xyz.com',

      mobile: '9988776655',

      password: '123',

      confirmPassword: '123',

      role: 'HR Administrator',

      department: 'Human Resources',

      designation: 'HR Manager',

      reportingManager: 'Director',

      region: 'North Region',

      branch: 'Delhi',

      language: 'English',

      timeZone: 'Asia/Kolkata',

      lastLogin: new Date(),

      status: 'Inactive',

      isActive: false,

      emailVerified: true,

      mobileVerified: true,

      twoFactorEnabled: false,

      forcePasswordChange: true,

      remarks: ''

    }

  ];

  // ============================================
  // Filters
  // ============================================

  get filteredAdmins() {

    return this.administrators.filter(x => {

      const search =

        x.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||

        x.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||

        x.userName.toLowerCase().includes(this.searchText.toLowerCase()) ||

        x.employeeCode.toLowerCase().includes(this.searchText.toLowerCase()) ||

        x.email.toLowerCase().includes(this.searchText.toLowerCase());

      const company =

        !this.companyFilter ||

        x.company === this.companyFilter;

      const status =

        !this.statusFilter ||

        x.status === this.statusFilter;

      return search && company && status;

    });

  }

  // ============================================
  // Pagination
  // ============================================

  get pagedAdmins() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredAdmins.slice(start, start + this.pageSize);

  }

  // ============================================
  // Statistics
  // ============================================

  get totalAdmins() {

    return this.administrators.length;

  }

  get activeAdmins() {

    return this.administrators.filter(x => x.status === 'Active').length;

  }

  get inactiveAdmins() {

    return this.administrators.filter(x => x.status === 'Inactive').length;

  }

  get lockedAdmins() {

    return this.administrators.filter(x => x.status === 'Locked').length;

  }
  edit(id: number): void {

    const data = this.administrators.find(x => x.adminId === id);

    if (!data) {
      return;
    }

    this.admin = { ...data };

    this.isEdit = true;

    this.submitted = false;

  }

  delete(id: number): void {

    this.alert.deleteConfirm().then(result => {

      if (!result.isConfirmed) {
        return;
      }

      this.spinner.show();

      setTimeout(() => {

       this.administrators =
this.administrators.filter(x => x.adminId !== id);

if (this.page > Math.ceil(this.filteredAdmins.length / this.pageSize)) {
    this.page = Math.max(1, this.page - 1);
}

        this.spinner.hide();

        this.alert.success('Company Administrator deleted successfully.');

      }, 400);

    });

  }

  clear(): void {

    this.admin = this.getEmptyModel();

    this.isEdit = false;

    this.submitted = false;
  }



 
  changePage(page: number): void {

    this.page = page;


  }

  changePageSize(size: number): void {

    this.pageSize = size;

    this.page = 1;

   

  }

refresh(): void {

    this.spinner.show();

    setTimeout(() => {

        this.page = 1;

        this.spinner.hide();

        this.alert.success('Company Administrators refreshed successfully.');

    },500);

}

  get totalActive(): number {

    return this.administrators.filter(x => x.isActive).length;

  }

  get totalInactive(): number {

    return this.administrators.filter(x => !x.isActive).length;

  }

  get totalCompanies(): number {

    return [...new Set(this.administrators.map(x => x.companyName))].length;

  }

  get totalAdministrators(): number {

    return this.administrators.length;

  }
  saveAdmin(): void {

    this.submitted = true;

    if (
      !this.admin.company ||
      !this.admin.employeeCode ||
      !this.admin.userName ||
      !this.admin.firstName ||
      !this.admin.email ||
      !this.admin.mobile ||
      !this.admin.role
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (this.isEdit) {

        const index = this.administrators.findIndex(x => x.adminId === this.admin.adminId);

        if (index > -1) {
          this.administrators[index] = { ...this.admin };
        }

        this.alert.success('Company Administrator updated successfully.');

      } else {

        this.admin.adminId = new Date().getTime();

        this.administrators.unshift({ ...this.admin });

        this.alert.success('Company Administrator created successfully.');

      }

      this.spinner.hide();

      this.clear();

    }, 500);

  }
  clearFilters(): void {

    this.searchText = '';

    this.companyFilter = '';

    this.statusFilter = '';

    this.page = 1;

  }
}
