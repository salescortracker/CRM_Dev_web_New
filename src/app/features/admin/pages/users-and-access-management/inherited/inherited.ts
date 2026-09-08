import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-inherited',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './inherited.html',
  styleUrl: './inherited.css',
})
export class Inherited {
    submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;

  searchText = '';

  inheritances: any[] = [];

  inheritance: any = {

    inheritanceId: 0,

    inheritanceName: '',

    parentType: '',
    parentName: '',

    childType: '',
    childName: '',

    inheritanceLevel: '',

    permissionScope: '',

    effectiveFrom: '',

    effectiveTo: '',

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

    this.loadInheritances();

  }

  loadInheritances() {

    this.spinner.show();

    setTimeout(() => {

      this.inheritances = [

        {
          inheritanceId: 1,

          inheritanceName: 'Sales Manager Access',

          parentType: 'Role',

          parentName: 'Sales Manager',

          childType: 'User Group',

          childName: 'Sales Executives',

          inheritanceLevel: 'Full',

          permissionScope: 'CRM Only',

          effectiveFrom: '2026-01-01',

          effectiveTo: '2026-12-31',

          status: 'Active',

          description: 'Sales executives inherit all CRM permissions from Sales Manager.',

          isActive: true

        },

        {
          inheritanceId: 2,

          inheritanceName: 'HR Team Permissions',

          parentType: 'Department',

          parentName: 'Human Resources',

          childType: 'User',

          childName: 'Priya Reddy',

          inheritanceLevel: 'Partial',

          permissionScope: 'Selected Modules',

          effectiveFrom: '2026-02-01',

          effectiveTo: '2026-12-31',

          status: 'Active',

          description: 'HR permissions inherited for employee management modules.',

          isActive: true

        },

        {
          inheritanceId: 3,

          inheritanceName: 'Finance Read Access',

          parentType: 'Team',

          parentName: 'Finance Team',

          childType: 'Department',

          childName: 'Finance',

          inheritanceLevel: 'Read Only',

          permissionScope: 'Reports Only',

          effectiveFrom: '2026-03-01',

          effectiveTo: '2026-12-31',

          status: 'Inactive',

          description: 'Finance department inherits read-only reporting access.',

          isActive: false

        },
                {
          inheritanceId: 4,

          inheritanceName: 'IT Administrator Access',

          parentType: 'Role',

          parentName: 'Administrator',

          childType: 'Team',

          childName: 'IT Team',

          inheritanceLevel: 'Full',

          permissionScope: 'All Modules',

          effectiveFrom: '2026-04-01',

          effectiveTo: '2026-12-31',

          status: 'Active',

          description: 'IT Team inherits complete system administration permissions.',

          isActive: true

        },

        {
          inheritanceId: 5,

          inheritanceName: 'Marketing Group Access',

          parentType: 'User Group',

          parentName: 'Marketing Managers',

          childType: 'User Group',

          childName: 'Marketing Executives',

          inheritanceLevel: 'Partial',

          permissionScope: 'CRM Only',

          effectiveFrom: '2026-05-01',

          effectiveTo: '2026-12-31',

          status: 'Active',

          description: 'Marketing Executives inherit CRM marketing module permissions.',

          isActive: true

        }

      ];

      this.inheritances.sort(
        (a, b) => b.inheritanceId - a.inheritanceId
      );

      this.totalRecords = this.inheritances.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }
    saveInheritance() {

    this.submitted = true;

    if (
      !this.inheritance.inheritanceName ||
      !this.inheritance.parentType ||
      !this.inheritance.parentName ||
      !this.inheritance.childType ||
      !this.inheritance.childName ||
      !this.inheritance.inheritanceLevel ||
      !this.inheritance.permissionScope ||
      !this.inheritance.status
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newInheritance = {

          ...this.inheritance,

          inheritanceId: this.inheritances.length
            ? Math.max(...this.inheritances.map(x => x.inheritanceId)) + 1
            : 1

        };

        this.inheritances.unshift(newInheritance);

      } else {

        const index = this.inheritances.findIndex(
          x => x.inheritanceId === this.inheritance.inheritanceId
        );

        if (index !== -1) {

          this.inheritances[index] = {

            ...this.inheritance

          };

        }

      }

      this.inheritances = [...this.inheritances];

      this.totalRecords = this.inheritances.length;

      this.page = 1;

      const isUpdate = this.isEdit;

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(

        isUpdate
          ? 'Inherited Permission updated successfully.'
          : 'Inherited Permission created successfully.'

      );

    }, 500);

  }

  edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.inheritances.find(
        x => x.inheritanceId === id
      );

      if (selected) {

        this.inheritance = {

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

          this.inheritances = this.inheritances.filter(
            x => x.inheritanceId !== id
          );

          this.totalRecords = this.inheritances.length;

          if (
            this.page > 1 &&
            this.pagedInheritances.length === 0
          ) {

            this.page--;

          }

          this.inheritances = [...this.inheritances];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Inherited Permission deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.inheritance = {

      inheritanceId: 0,

      inheritanceName: '',

      parentType: '',
      parentName: '',

      childType: '',
      childName: '',

      inheritanceLevel: '',

      permissionScope: '',

      effectiveFrom: '',

      effectiveTo: '',

      status: '',

      description: '',

      isActive: true

    };

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredInheritances() {

    return this.inheritances.filter(x =>

      x.inheritanceName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.parentType
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.parentName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.childType
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.childName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.inheritanceLevel
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.permissionScope
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.status
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

    );

  }

  get pagedInheritances() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredInheritances.slice(

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
