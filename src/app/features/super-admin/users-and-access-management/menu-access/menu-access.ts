import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/authentication/services/auth.service';

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
constructor(
  private authService: AuthService
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

    canApprove: false
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

          alert(res.message);

          this.loadMenus();

        }
      });

  }
  else {

    this.authService
      .updateMenu(this.selectedMenu)
      .subscribe({

        next: (res) => {

          alert(res.message);

          this.loadMenus();

        }
      });

  }

}

 deleteMenu(): void {

  if (!confirm('Delete Menu ?')) {

    return;

  }

  this.authService
    .deleteMenu(this.selectedMenu.menuId)
    .subscribe({

      next: (res) => {

        alert(res.message);

        this.loadMenus();

      }
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
