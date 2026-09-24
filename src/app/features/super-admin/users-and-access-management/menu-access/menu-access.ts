import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../../core/services/alertservice';

interface Permission {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
}
// interface Menu {
//   menuId: number;
//   menuName: string;
//   parentMenuId?: number;
//   url?: string;
//   icon?: string;
//   orderNo?: number;
//   menuType: string;
//   isActive: boolean;
//   canView: boolean;
//   canAdd: boolean;
//   canEdit: boolean;
//   canDelete: boolean;
//   canApprove: boolean;
// }

export interface Menu {
  menuId: number;
  menuName: string;
  parentMenuId: number | null;
  url?: string;
  icon?: string;
  orderNo?: number;
  menuType: string;
  isActive: boolean;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canReject: boolean;
  canDownload: boolean;
}

@Component({
  selector: 'app-menu-access',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './menu-access.html',
  styleUrl: './menu-access.css',
})
export class MenuAccess {
    roles: string[] = [
    'Super Admin',
    'Admin',
    'User'
  ];

  selectedRole = 'Super Admin';

  menus: Menu[] = [];

  selectedMenu!: Menu;

  isNew = false;

  // ================= SEARCH / PAGINATION (Menu List) =================

  searchText = '';

  pageSize = 8;

  currentPage = 1;

  get filteredMenus(): Menu[] {

    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.menus;
    }

    return this.menus.filter(menu =>
      [menu.menuName, menu.url, menu.menuType]
        .some(v => (v || '').toLowerCase().includes(search))
    );
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredMenus.length / this.pageSize));
  }

  get pagedMenus(): Menu[] {

    // Clamp in case the list shrank (search, delete, reload).
    const page = Math.min(this.currentPage, this.totalPages);

    const start = (page - 1) * this.pageSize;

    return this.filteredMenus.slice(start, start + this.pageSize);
  }

  get rangeStart(): number {
    return this.filteredMenus.length === 0
      ? 0
      : (Math.min(this.currentPage, this.totalPages) - 1) * this.pageSize + 1;
  }

  get rangeEnd(): number {
    return Math.min(
      Math.min(this.currentPage, this.totalPages) * this.pageSize,
      this.filteredMenus.length
    );
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }

  clearSearch(): void {
    this.searchText = '';
    this.currentPage = 1;
  }

  goToPage(page: number): void {

    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
  }

constructor(
  private authService: AuthService,
  private alert: Alertservice
) {}
  ngOnInit(): void {

    this.loadMenus();

    // this.selectedMenu = JSON.parse(JSON.stringify(this.menus[0]));

  }

loadMenus(): void {

  this.authService
    .getMenus()
    .subscribe({

      next: (response) => {

        this.menus = response.data;

        this.currentPage = Math.min(this.currentPage, this.totalPages);

        if (this.menus.length > 0) {

          this.selectedMenu =
            JSON.parse(
              JSON.stringify(this.menus[0])
            );

          this.syncSelectedRoleFromMenu();
        }
      },

      error: (err) => {

        console.error(err);

      }
    });
}

 selectMenu(menu: Menu): void {

  this.authService
      .getMenuById(menu.menuId)
      .subscribe({

        next: (response) => {

          this.selectedMenu =
            response.data;

          this.syncSelectedRoleFromMenu();

        }
      });

}

 addNewMenu(): void {

  this.selectedMenu = {

    menuId: 0,

    menuName: '',

    parentMenuId: null,

    url: '',

    icon: '',

    orderNo: 1,

    menuType: '',

    isActive: true,

    canView: true,

    canAdd: false,

    canEdit: false,

    canDelete: false,

    canApprove: false,

    canReject: false,

    canDownload: false
  };

  this.applyRoleToMenu(this.selectedRole);

}

 saveMenu(): void {

  this.applyRoleToMenu(this.selectedRole);

  if (this.selectedMenu.menuId === 0) {

    this.authService
      .createMenu(this.selectedMenu)
      .subscribe({

        next: (res) => {

          this.alert.success(res.message);

          this.loadMenus();

        },

        error: (err) => {

          this.alert.error(err?.error?.message || 'Failed to create menu.');

        }
      });

  }
  else {

    this.authService
      .updateMenu(this.selectedMenu)
      .subscribe({

        next: (res) => {

          this.alert.success(res.message);

          this.loadMenus();

        },

        error: (err) => {

          this.alert.error(err?.error?.message || 'Failed to update menu.');

        }
      });

  }

}

 deleteMenu(): void {

  this.alert.deleteConfirm().then((result) => {

    if (!result.isConfirmed) {

      return;

    }

    this.authService
      .deleteMenu(this.selectedMenu.menuId)
      .subscribe({

        next: (res) => {

          this.alert.success(res.message);

          this.loadMenus();

        },

        error: (err) => {

          this.alert.error(err?.error?.message || 'Failed to delete menu.');

        }
      });

  });

}

 toggleStatus() {

  this.selectedMenu.isActive =
    !this.selectedMenu.isActive;

  const index =
    this.menus.findIndex(
      x => x.menuId === this.selectedMenu.menuId
    );

  if (index !== -1) {

    this.menus[index].isActive =
      this.selectedMenu.isActive;

  }
}

  resetForm(){

    if(this.isNew){

      this.addNewMenu();

      return;

    }

    const menu=this.menus.find(x=>x.menuId == this.selectedMenu.menuId);

    if(menu){

      this.selectedMenu=JSON.parse(JSON.stringify(menu));

      this.syncSelectedRoleFromMenu();

    }

  }

  selectRole(role: string): void {

    this.selectedRole = role;

    this.applyRoleToMenu(role);

  }

  menuTypeChanged(): void {

    this.syncSelectedRoleFromMenu();

  }

  private applyRoleToMenu(role: string): void {

    if (!this.selectedMenu) {

      return;

    }

    this.selectedMenu.menuType =
      this.toMenuTypeRole(role);

  }

  private syncSelectedRoleFromMenu(): void {

    const role =
      this.toDisplayRole(this.selectedMenu?.menuType);

    if (role) {

      this.selectedRole = role;

    }

  }

  private toMenuTypeRole(role: string): string {

    return this.normalizeRole(role) === 'super admin'
      ? 'SuperAdmin'
      : role;

  }

  private toDisplayRole(menuType?: string): string | null {

    const normalizedRole =
      this.normalizeRole(menuType || '');

    if (normalizedRole === 'superadmin' || normalizedRole === 'super admin') {

      return 'Super Admin';

    }

    if (normalizedRole === 'admin') {

      return 'Admin';

    }

    if (normalizedRole === 'user') {

      return 'User';

    }

    return null;

  }

  private normalizeRole(role: string): string {

    const normalizedRole = (role || '')
      .replace(/[-_]/g, ' ')
      .trim()
      .toLowerCase();

    return normalizedRole === 'superadmin'
      ? 'super admin'
      : normalizedRole;

  }

  moveUp(){

    const index =
  this.menus.findIndex(
    x => x.menuId === this.selectedMenu.menuId
  );

    if(index>0){

      const temp=this.menus[index];

      this.menus[index]=this.menus[index-1];

      this.menus[index-1]=temp;

    }

  }

  moveDown(){

   const index =
  this.menus.findIndex(
    x => x.menuId === this.selectedMenu.menuId
  );

    if(index<this.menus.length-1){

      const temp=this.menus[index];

      this.menus[index]=this.menus[index+1];

      this.menus[index+1]=temp;

    }

  }
}
