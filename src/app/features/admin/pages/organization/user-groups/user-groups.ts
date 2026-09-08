import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-user-groups',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './user-groups.html',
  styleUrl: './user-groups.css',
})
export class UserGroups {
    submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;

  searchText = '';

  userGroups: any[] = [];

  userGroup: any = {

    groupId: 0,

    groupName: '',
    groupCode: '',
    groupType: '',

    department: '',
    team: '',
    reportingManager: '',

    defaultRole: '',

    userLimit: 0,

    priority: 'Medium',

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

    this.loadUserGroups();

  }

  loadUserGroups() {

    this.spinner.show();

    setTimeout(() => {

      this.userGroups = [

        {
          groupId: 1,

          groupName: 'Sales Managers',

          groupCode: 'UG001',

          groupType: 'Sales',

          department: 'Sales',

          team: 'Team Alpha',

          reportingManager: 'Rahul Sharma',

          defaultRole: 'Manager',

          userLimit: 25,

          priority: 'High',

          status: 'Active',

          description: 'Sales management user group.',

          isActive: true

        },

        {
          groupId: 2,

          groupName: 'HR Executives',

          groupCode: 'UG002',

          groupType: 'Human Resources',

          department: 'Human Resources',

          team: 'Team Bravo',

          reportingManager: 'Priya Reddy',

          defaultRole: 'Executive',

          userLimit: 15,

          priority: 'Medium',

          status: 'Active',

          description: 'HR executive group.',

          isActive: true

        },

        {
          groupId: 3,

          groupName: 'IT Administrators',

          groupCode: 'UG003',

          groupType: 'IT',

          department: 'IT',

          team: 'Team Charlie',

          reportingManager: 'Arjun Kumar',

          defaultRole: 'Administrator',

          userLimit: 10,

          priority: 'High',

          status: 'Active',

          description: 'System administrators group.',

          isActive: true

        },
                {
          groupId: 4,

          groupName: 'Finance Team',

          groupCode: 'UG004',

          groupType: 'Finance',

          department: 'Finance',

          team: 'Team Delta',

          reportingManager: 'Sneha Patel',

          defaultRole: 'Team Lead',

          userLimit: 12,

          priority: 'Medium',

          status: 'Active',

          description: 'Finance department user group.',

          isActive: true

        },

        {
          groupId: 5,

          groupName: 'Customer Support',

          groupCode: 'UG005',

          groupType: 'Customer Support',

          department: 'Customer Support',

          team: 'Team Omega',

          reportingManager: 'Kiran Verma',

          defaultRole: 'Executive',

          userLimit: 30,

          priority: 'Low',

          status: 'Inactive',

          description: 'Customer support executives group.',

          isActive: false

        }

      ];

      this.userGroups.sort(
        (a, b) => b.groupId - a.groupId
      );

      this.totalRecords = this.userGroups.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }
    saveUserGroup() {

    this.submitted = true;

    if (
      !this.userGroup.groupName ||
      !this.userGroup.groupCode ||
      !this.userGroup.groupType ||
      !this.userGroup.defaultRole ||
      !this.userGroup.status
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newGroup = {

          ...this.userGroup,

          groupId: this.userGroups.length
            ? Math.max(...this.userGroups.map(x => x.groupId)) + 1
            : 1

        };

        this.userGroups.unshift(newGroup);

      } else {

        const index = this.userGroups.findIndex(
          x => x.groupId === this.userGroup.groupId
        );

        if (index !== -1) {

          this.userGroups[index] = {

            ...this.userGroup

          };

        }

      }

      this.userGroups = [...this.userGroups];

      this.totalRecords = this.userGroups.length;

      this.page = 1;

      const isUpdate = this.isEdit;

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(
        isUpdate
          ? 'User Group updated successfully.'
          : 'User Group created successfully.'
      );

    }, 500);

  }

  edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.userGroups.find(
        x => x.groupId === id
      );

      if (selected) {

        this.userGroup = {

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

          this.userGroups = this.userGroups.filter(
            x => x.groupId !== id
          );

          this.totalRecords = this.userGroups.length;

          if (
            this.page > 1 &&
            this.pagedUserGroups.length === 0
          ) {

            this.page--;

          }

          this.userGroups = [...this.userGroups];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'User Group deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.userGroup = {

      groupId: 0,

      groupName: '',
      groupCode: '',
      groupType: '',

      department: '',
      team: '',
      reportingManager: '',

      defaultRole: '',

      userLimit: 0,

      priority: 'Medium',

      status: '',

      description: '',

      isActive: true

    };

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredUserGroups() {

    return this.userGroups.filter(x =>

      x.groupName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.groupCode
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.groupType
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.department
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.team
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.reportingManager
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.defaultRole
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.status
        .toLowerCase()
        .includes(this.searchText.toLowerCase()));

  }

  get pagedUserGroups() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredUserGroups.slice(
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
