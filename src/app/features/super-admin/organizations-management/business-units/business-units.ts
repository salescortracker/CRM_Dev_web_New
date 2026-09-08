import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { Pagination } from '../../../../shared/pagination/pagination';

@Component({
  selector: 'app-business-units',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './business-units.html',
  styleUrl: './business-units.css',
})
export class BusinessUnits {
   constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice
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

  businessUnit: any = this.getEmptyModel();

  //====================================================
  // Empty Model
  //====================================================

  getEmptyModel() {

    return {

      businessUnitId: 0,

      organization: '',

      company: '',

      businessUnitName: '',

      businessUnitCode: '',

      parentBusinessUnit: '',

      unitHead: '',

      department: '',

      region: '',

      branch: '',

      employeeStrength: 0,

      costCenterCode: '',

      annualBudget: 0,

      phone: '',

      email: '',

      extension: '',

      workingHours: 'General Shift',

      description: '',

      remarks: '',

      status: 'Active',

      isActive: true,

      isDefault: false,

      isBillable: false

    };

  }

  //====================================================
  // Static Data
  //====================================================

  businessUnits: any[] = [

    {

      businessUnitId: 1,

      organization: 'OpenVision Technologies',

      company: 'ABC Technologies',

      businessUnitName: 'Sales',

      businessUnitCode: 'BU001',

      parentBusinessUnit: 'Corporate',

      unitHead: 'John Smith',

      department: 'Sales',

      region: 'South Region',

      branch: 'Hyderabad',

      employeeStrength: 45,

      costCenterCode: 'CC100',

      annualBudget: 250000,

      phone: '9876543210',

      email: 'sales@abc.com',

      extension: '101',

      workingHours: 'General Shift',

      description: 'Sales Division',

      remarks: '',

      status: 'Active',

      isActive: true,

      isDefault: true,

      isBillable: true

    },

    {

      businessUnitId: 2,

      organization: 'OpenVision Technologies',

      company: 'XYZ Solutions',

      businessUnitName: 'Human Resources',

      businessUnitCode: 'BU002',

      parentBusinessUnit: 'Corporate',

      unitHead: 'Maria Joseph',

      department: 'HR',

      region: 'North Region',

      branch: 'Delhi',

      employeeStrength: 20,

      costCenterCode: 'CC200',

      annualBudget: 120000,

      phone: '9988776655',

      email: 'hr@xyz.com',

      extension: '102',

      workingHours: 'General Shift',

      description: 'HR Department',

      remarks: '',

      status: 'Active',

      isActive: true,

      isDefault: false,

      isBillable: false

    },

    {

      businessUnitId: 3,

      organization: 'OpenVision Technologies',

      company: 'Open CRM',

      businessUnitName: 'Finance',

      businessUnitCode: 'BU003',

      parentBusinessUnit: 'Corporate',

      unitHead: 'David Wilson',

      department: 'Finance',

      region: 'West Region',

      branch: 'Mumbai',

      employeeStrength: 15,

      costCenterCode: 'CC300',

      annualBudget: 175000,

      phone: '9876501234',

      email: 'finance@opencrm.com',

      extension: '103',

      workingHours: 'General Shift',

      description: 'Finance Department',

      remarks: '',

      status: 'Inactive',

      isActive: false,

      isDefault: false,

      isBillable: true

    }

  ];
    //====================================================
  // Filtered Business Units
  //====================================================

  get filteredBusinessUnits() {

    return this.businessUnits.filter(x => {

      const search = this.searchText.toLowerCase();

      const matchSearch =
        !search ||

        x.businessUnitName.toLowerCase().includes(search) ||

        x.businessUnitCode.toLowerCase().includes(search) ||

        x.company.toLowerCase().includes(search) ||

        x.department.toLowerCase().includes(search) ||

        x.unitHead.toLowerCase().includes(search) ||

        x.email.toLowerCase().includes(search);

      const matchCompany =
        !this.companyFilter ||
        x.company === this.companyFilter;

      const matchStatus =
        !this.statusFilter ||
        x.status === this.statusFilter;

      return matchSearch && matchCompany && matchStatus;

    });

  }

  //====================================================
  // Pagination
  //====================================================

  get pagedBusinessUnits() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredBusinessUnits.slice(
      start,
      start + this.pageSize
    );

  }

  //====================================================
  // Dashboard Statistics
  //====================================================

  get totalBusinessUnits() {

    return this.businessUnits.length;

  }

  get activeBusinessUnits() {

    return this.businessUnits.filter(x => x.isActive).length;

  }

  get inactiveBusinessUnits() {

    return this.businessUnits.filter(x => !x.isActive).length;

  }

  get totalCompanies() {

    return [...new Set(this.businessUnits.map(x => x.company))].length;

  }

  get totalEmployees() {

    return this.businessUnits.reduce(

      (total, item) => total + Number(item.employeeStrength || 0),

      0

    );

  }

  get totalBudget() {

    return this.businessUnits.reduce(

      (total, item) => total + Number(item.annualBudget || 0),

      0

    );

  }
    //====================================================
  // Save / Update
  //====================================================

  saveBusinessUnit(): void {

    this.submitted = true;

    if (
      !this.businessUnit.company ||
      !this.businessUnit.businessUnitName ||
      !this.businessUnit.businessUnitCode ||
      !this.businessUnit.unitHead
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (this.isEdit) {

        const index = this.businessUnits.findIndex(
          x => x.businessUnitId === this.businessUnit.businessUnitId
        );

        if (index > -1) {
          this.businessUnits[index] = {
            ...this.businessUnit
          };
        }

        this.alert.success('Business Unit updated successfully.');

      }
      else {

        this.businessUnit.businessUnitId = new Date().getTime();

        this.businessUnits.unshift({
          ...this.businessUnit
        });

        this.alert.success('Business Unit created successfully.');

      }

      this.spinner.hide();

      this.clear();

    }, 500);

  }

  //====================================================
  // Edit
  //====================================================

  edit(id: number): void {

    const data = this.businessUnits.find(
      x => x.businessUnitId === id
    );

    if (!data) return;

    this.businessUnit = {
      ...data
    };

    this.isEdit = true;

    this.submitted = false;

  }

  //====================================================
  // Delete
  //====================================================

  delete(id: number): void {

    this.alert.deleteConfirm().then(result => {

      if (!result.isConfirmed) return;

      this.spinner.show();

      setTimeout(() => {

        this.businessUnits =
          this.businessUnits.filter(
            x => x.businessUnitId !== id
          );

        this.spinner.hide();

        this.alert.success(
          'Business Unit deleted successfully.'
        );

      }, 400);

    });

  }

  //====================================================
  // Clear Form
  //====================================================

  clear(): void {

    this.businessUnit = this.getEmptyModel();

    this.submitted = false;

    this.isEdit = false;

  }

  //====================================================
  // Clear Search Filters
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

    this.spinner.show();

    setTimeout(() => {

      this.page = 1;

      this.spinner.hide();

      this.alert.success(
        'Business Units refreshed successfully.'
      );

    }, 500);

  }
}
