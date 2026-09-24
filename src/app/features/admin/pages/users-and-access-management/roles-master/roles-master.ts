import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Alertservice } from '../../../../../core/services/alertservice';

import { ControlsystemService } from '../../../../super-admin/services/controlsystem-service';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';
import { UserMenu } from '../../../../super-admin/users-and-access-management/menu-master/menu-master';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roles-master',
  imports: [FormsModule,CommonModule],
  templateUrl: './roles-master.html',
  styleUrl: './roles-master.css',
})
export class RolesMaster implements OnInit {
   constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef,

    private controlService: ControlsystemService

  ) {}



  ngOnInit(): void {

    this.loadActiveMenus();

    this.loadRoles();

  }




  // ==============================
  // Module Permissions (Active Menus, from Menu Master)
  // ==============================


  menuTree: { parent: UserMenu; children: UserMenu[] }[] = [];


  loadActiveMenus(): void {

    this.controlService
      .getUserMenus()
      .subscribe({

        next: (response) => {

          const activeMenus: UserMenu[] =
            (response.data || []).filter(
              (x: UserMenu) => x.isActive
            );

          this.menuTree =
            this.buildMenuTree(activeMenus);

        },

        error: (err) => {

          console.error(err);

        }
      });

  }


  private buildMenuTree(
    activeMenus: UserMenu[]
  ): { parent: UserMenu; children: UserMenu[] }[] {

    const activeIds =
      new Set(activeMenus.map(x => x.userMenuId));

    const parents = activeMenus.filter(
      x => !x.parentMenuId || !activeIds.has(x.parentMenuId)
    );

    return parents.map(parent => ({

      parent,

      children: activeMenus.filter(
        x => x.parentMenuId === parent.userMenuId
      )

    }));

  }


  allPermissionsSelected = false;


  toggleAllPermissions(): void {

    for (const group of this.menuTree) {

      this.model.permissions[group.parent.userMenuId] =
        this.allPermissionsSelected;

      for (const child of group.children) {

        this.model.permissions[child.userMenuId] =
          this.allPermissionsSelected;

      }

    }

  }




  // ==============================
  // Modal Controls
  // ==============================


  showModal = false;

  isEdit = false;

  editId = 0;




  // ==============================
  // Search
  // ==============================


  searchText = '';

  statusFilter = '';




  // ==============================
  // Roles Data
  // ==============================


  roles: any[] = [];


  loadRoles(): void {

    this.controlService
      .getUserRoles()
      .subscribe({

        next: (response) => {

          this.roles = this.mapRoles(response.data);

          this.cd.detectChanges();

        },

        error: (err) => {

          console.error(err);

        }
      });

  }


  private mapRoles(data: any[] | undefined): any[] {

    return (data || []).map((x: any) => ({

      id: x.userRoleId,

      roleName: x.roleName,

      accessLevel: x.accessLevel,

      userCount: x.userCount,

      description: x.description || '',

      permissions: x.permissions || {},

      status: x.status ? 'Active' : 'Inactive',

      isDefault: x.isDefault

    }));

  }


  permissionCount(item: any): number {

    return Object.values(item.permissions || {})
      .filter(v => v).length;

  }




  // ==============================
  // Form Model
  // ==============================


  model: any = this.emptyModel();


  emptyModel() {

    return {

      id: 0,

      roleName: '',

      accessLevel: 'Full Access',

      userCount: 0,

      description: '',

      permissions: {},

      status: 'Active',

      isDefault: false

    };

  }




  // ==============================
  // Statistics
  // ==============================


  get activeCount() {

    return this.roles.filter(
      x => x.status === 'Active'
    ).length;

  }


  get inactiveCount() {

    return this.roles.filter(
      x => x.status === 'Inactive'
    ).length;

  }


  get assignedUsers() {

    return this.roles.reduce(
      (sum, item) => sum + item.userCount,
      0
    );

  }




  // ==============================
  // Filter Roles
  // ==============================


  get filteredRoles() {

    return this.roles.filter(item => {

      const search =

        item.roleName
          .toLowerCase()
          .includes(this.searchText.toLowerCase())

        ||

        item.accessLevel
          .toLowerCase()
          .includes(this.searchText.toLowerCase())

        ||

        item.description
          .toLowerCase()
          .includes(this.searchText.toLowerCase());


      const status =

        this.statusFilter === ''

        ||

        item.status === this.statusFilter;


      return search && status;

    });

  }




  // ==============================
  // Refresh
  // ==============================


  refresh() {

    this.spinner.show();

    this.controlService
      .getUserRoles()
      .subscribe({

        next: (response) => {

          this.roles = this.mapRoles(response.data);

          this.cd.detectChanges();

          this.spinner.hide();

          this.alert.success(
            'Roles data refreshed successfully.'
          );

        },

        error: (err) => {

          this.spinner.hide();

          this.alert.error(err?.error?.message || 'Failed to refresh roles.');

        }
      });

  }




  // ==============================
  // Open Add Modal
  // ==============================


  openAddModal() {

    this.isEdit = false;

    this.editId = 0;

    this.model = this.emptyModel();

    this.allPermissionsSelected = false;

    this.showModal = true;

  }




  // ==============================
  // Close Modal
  // ==============================


  closeModal() {

    this.showModal = false;

    this.model = this.emptyModel();

    this.isEdit = false;

    this.editId = 0;

  }




  // ==============================
  // Save / Update
  // ==============================


  saveRole() {

    if (!this.model.roleName.trim()) {

      this.alert.warning(
        'Role Name is required.'
      );

      return;

    }


    this.spinner.show();


    const payload = {

      userRoleId: this.isEdit ? this.editId : 0,

      roleName: this.model.roleName.trim(),

      accessLevel: this.model.accessLevel,

      userCount: +this.model.userCount || 0,

      description: this.model.description,

      status: this.model.status === 'Active',

      isDefault: this.model.isDefault,

      permissions: this.model.permissions

    };


    const request$ = this.isEdit

      ? this.controlService.updateUserRole(payload)

      : this.controlService.createUserRole(payload);


    request$.subscribe({

      next: (res: any) => {

        this.spinner.hide();

        this.alert.success(res.message);

        this.loadRoles();

        this.closeModal();

        this.cd.detectChanges();

      },

      error: (err) => {

        this.spinner.hide();

        this.alert.error(err?.error?.message || 'Failed to save role.');

      }

    });

  }




  // ==============================
  // Edit
  // ==============================


  edit(item: any) {

    this.isEdit = true;

    this.editId = item.id;

    this.model = {

      ...item,

      permissions: {

        ...item.permissions

      }

    };

    this.allPermissionsSelected = false;

    this.showModal = true;

  }




  // ==============================
  // Delete
  // ==============================


  delete(id: number) {

    this.alert.deleteConfirm()
      .then(result => {

        if (result.isConfirmed) {

          this.spinner.show();

          this.controlService
            .deleteUserRole(id)
            .subscribe({

              next: (res: any) => {

                this.spinner.hide();

                this.alert.success(res.message);

                this.loadRoles();

                this.cd.detectChanges();

              },

              error: (err) => {

                this.spinner.hide();

                this.alert.error(err?.error?.message || 'Failed to delete role.');

              }
            });

        }

      });

  }




  // ==============================
  // Clear Filters
  // ==============================


  clearFilters() {

    this.searchText = '';

    this.statusFilter = '';

  }
}
