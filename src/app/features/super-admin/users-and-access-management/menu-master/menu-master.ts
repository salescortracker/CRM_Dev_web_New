import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ControlsystemService } from '../../services/controlsystem-service';
import { Alertservice } from '../../../../core/services/alertservice';

export interface UserMenu {
  userMenuId: number;
  menuName: string;
  parentMenuId: number | null;
  url?: string;
  icon?: string;
  orderNo?: number;
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
  selector: 'app-menu-master',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-master.html',
  styleUrl: './menu-master.css',
})
export class MenuMaster {

  menus: UserMenu[] = [];

  selectedMenu!: UserMenu;

  isNew = false;

  constructor(
    private controlService: ControlsystemService,
    private alert: Alertservice
  ) {}

  ngOnInit(): void {

    this.loadMenus();

  }

  loadMenus(): void {

    this.controlService
      .getUserMenus()
      .subscribe({

        next: (response) => {

          this.menus = response.data;

          if (this.menus.length > 0) {

            this.selectedMenu =
              JSON.parse(
                JSON.stringify(this.menus[0])
              );

          }
        },

        error: (err) => {

          console.error(err);

        }
      });
  }

  selectMenu(menu: UserMenu): void {

    this.controlService
      .getUserMenuById(menu.userMenuId)
      .subscribe({

        next: (response) => {

          this.selectedMenu =
            response.data;

        }
      });

  }

  addNewMenu(): void {

    this.isNew = true;

    this.selectedMenu = {

      userMenuId: 0,

      menuName: '',

      parentMenuId: null,

      url: '',

      icon: '',

      orderNo: 1,

      isActive: true,

      canView: true,

      canAdd: false,

      canEdit: false,

      canDelete: false,

      canApprove: false,

      canReject: false,

      canDownload: false
    };

  }

  saveMenu(): void {

    if (this.selectedMenu.userMenuId === 0) {

      this.controlService
        .createUserMenu(this.selectedMenu)
        .subscribe({

          next: (res) => {

            this.alert.success(res.message);

            this.isNew = false;

            this.loadMenus();

          },

          error: (err) => {

            this.alert.error(err?.error?.message || 'Failed to create menu.');

          }
        });

    }
    else {

      this.controlService
        .updateUserMenu(this.selectedMenu)
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

      this.controlService
        .deleteUserMenu(this.selectedMenu.userMenuId)
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
        x => x.userMenuId === this.selectedMenu.userMenuId
      );

    if (index !== -1) {

      this.menus[index].isActive =
        this.selectedMenu.isActive;

    }
  }

  resetForm() {

    if (this.isNew) {

      this.addNewMenu();

      return;

    }

    const menu = this.menus.find(x => x.userMenuId == this.selectedMenu.userMenuId);

    if (menu) {

      this.selectedMenu = JSON.parse(JSON.stringify(menu));

    }

  }

  moveUp() {

    const index =
      this.menus.findIndex(
        x => x.userMenuId === this.selectedMenu.userMenuId
      );

    if (index > 0) {

      const temp = this.menus[index];

      this.menus[index] = this.menus[index - 1];

      this.menus[index - 1] = temp;

    }

  }

  moveDown() {

    const index =
      this.menus.findIndex(
        x => x.userMenuId === this.selectedMenu.userMenuId
      );

    if (index < this.menus.length - 1) {

      const temp = this.menus[index];

      this.menus[index] = this.menus[index + 1];

      this.menus[index + 1] = temp;

    }

  }
}
