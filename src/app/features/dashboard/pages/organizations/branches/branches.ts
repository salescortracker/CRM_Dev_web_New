import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './branches.html',
  styleUrl: './branches.css',
})
export class Branches {
  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice
  ) { }

  //====================================================
  // Form Variables
  //====================================================

  submitted = false;
  isEdit = false;

  searchText = '';
  companyFilter = '';
  regionFilter = '';
  statusFilter = '';

  page = 1;
  pageSize = 10;

  //====================================================
  // Branch Model
  //====================================================

  branch: any = this.getEmptyModel();

  getEmptyModel() {

    return {

      branchId: 0,

      organization: '',

      company: '',

      region: '',

      businessUnit: '',

      branchName: '',

      branchCode: '',

      manager: '',

      email: '',

      phone: '',

      address: '',

      city: '',

      state: '',

      country: '',

      zipCode: '',

      openTime: '09:00',

      closeTime: '18:00',

      timeZone: 'Asia/Kolkata',

      status: 'Active',

      isActive: true,

      isHeadOffice: false,

      remarks: ''

    };

  }

  //====================================================
  // Static Branch Data
  //====================================================

  branches: any[] = [

    {

      branchId: 1,

      organization: 'OpenVision Technologies',

      company: 'ABC Technologies',

      region: 'South Region',

      businessUnit: 'Corporate',

      branchName: 'Hyderabad Branch',

      branchCode: 'HYD001',

      manager: 'Ramesh Kumar',

      email: 'hyd@abc.com',

      phone: '9876543210',

      address: 'Madhapur',

      city: 'Hyderabad',

      state: 'Telangana',

      country: 'India',

      zipCode: '500081',

      openTime: '09:00',

      closeTime: '18:00',

      timeZone: 'Asia/Kolkata',

      status: 'Active',

      isActive: true,

      isHeadOffice: true,

      remarks: ''

    },

    {

      branchId: 2,

      organization: 'OpenVision Technologies',

      company: 'XYZ Solutions',

      region: 'North Region',

      businessUnit: 'Sales',

      branchName: 'Delhi Branch',

      branchCode: 'DEL001',

      manager: 'Amit Sharma',

      email: 'delhi@xyz.com',

      phone: '9988776655',

      address: 'Connaught Place',

      city: 'Delhi',

      state: 'Delhi',

      country: 'India',

      zipCode: '110001',

      openTime: '09:30',

      closeTime: '18:30',

      timeZone: 'Asia/Kolkata',

      status: 'Active',

      isActive: true,

      isHeadOffice: false,

      remarks: ''

    },

    {

      branchId: 3,

      organization: 'OpenVision Technologies',

      company: 'Open CRM',

      region: 'South Region',

      businessUnit: 'IT',

      branchName: 'Bangalore Branch',

      branchCode: 'BLR001',

      manager: 'Suresh Reddy',

      email: 'blr@opencrm.com',

      phone: '9012345678',

      address: 'Whitefield',

      city: 'Bangalore',

      state: 'Karnataka',

      country: 'India',

      zipCode: '560066',

      openTime: '09:00',

      closeTime: '18:00',

      timeZone: 'Asia/Kolkata',

      status: 'Inactive',

      isActive: false,

      isHeadOffice: false,

      remarks: ''

    }

  ];

  //====================================================
  // Filtered Branches
  //====================================================

  get filteredBranches() {

    return this.branches.filter(x => {

      const search =

        x.branchName.toLowerCase().includes(this.searchText.toLowerCase()) ||

        x.branchCode.toLowerCase().includes(this.searchText.toLowerCase()) ||

        x.company.toLowerCase().includes(this.searchText.toLowerCase()) ||

        x.manager.toLowerCase().includes(this.searchText.toLowerCase()) ||

        x.city.toLowerCase().includes(this.searchText.toLowerCase());

      const company =

        !this.companyFilter ||

        x.company === this.companyFilter;

      const region =

        !this.regionFilter ||

        x.region === this.regionFilter;

      const status =

        !this.statusFilter ||

        x.status === this.statusFilter;

      return search && company && region && status;

    });

  }

  //====================================================
  // Pagination
  //====================================================

  get pagedBranches() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredBranches.slice(start, start + this.pageSize);

  }
    //====================================================
  // Save Branch
  //====================================================

  saveBranch(): void {

    this.submitted = true;

    if (
      !this.branch.organization ||
      !this.branch.company ||
      !this.branch.region ||
      !this.branch.branchName ||
      !this.branch.branchCode
    ) {
      this.alert.warning('Please fill all required fields.');
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (this.isEdit) {

        const index = this.branches.findIndex(
          x => x.branchId === this.branch.branchId
        );

        if (index > -1) {
          this.branches[index] = { ...this.branch };
        }

        this.alert.success('Branch updated successfully.');

      } else {

        this.branch.branchId = new Date().getTime();

        this.branches.unshift({ ...this.branch });

        this.alert.success('Branch created successfully.');

      }

      this.spinner.hide();

      this.clear();

    }, 500);

  }

  //====================================================
  // Edit Branch
  //====================================================

  edit(id: number): void {

    const data = this.branches.find(x => x.branchId === id);

    if (!data) {
      return;
    }

    this.branch = { ...data };

    this.isEdit = true;

    this.submitted = false;

  }

  //====================================================
  // Delete Branch
  //====================================================

  delete(id: number): void {

    this.alert.deleteConfirm().then(result => {

      if (!result.isConfirmed) {
        return;
      }

      this.spinner.show();

      setTimeout(() => {

        this.branches = this.branches.filter(
          x => x.branchId !== id
        );

        this.spinner.hide();

        this.alert.success('Branch deleted successfully.');

      }, 500);

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.branch = this.getEmptyModel();

    this.submitted = false;

    this.isEdit = false;

  }

  //====================================================
  // Clear Filters
  //====================================================

  clearFilters(): void {

    this.searchText = '';

    this.companyFilter = '';

    this.regionFilter = '';

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

    this.spinner.show();

    setTimeout(() => {

      this.spinner.hide();

      this.alert.success('Branches refreshed successfully.');

    }, 500);

  }

  //====================================================
  // Dashboard Statistics
  //====================================================

  get totalBranches(): number {

    return this.branches.length;

  }

  get activeBranches(): number {

    return this.branches.filter(x => x.status === 'Active').length;

  }

  get inactiveBranches(): number {

    return this.branches.filter(x => x.status === 'Inactive').length;

  }

  get headOfficeBranches(): number {

    return this.branches.filter(x => x.isHeadOffice).length;

  }


}
