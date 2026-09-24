import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { AuthMenu } from '../../../core/authentication/models/login-response.model';

interface MasterAdminMenu {
  label: string;
  icon: string;
  route?: string;
  expanded?: boolean;
  children?: MasterAdminMenu[];
}

@Component({
  selector: 'app-master-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class MasterAdminSidebar implements OnInit {

  @Output()
  sidebarToggle = new EventEmitter<boolean>();

  isCollapsed = false;

  menus: MasterAdminMenu[] = [];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadMenus();
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.sidebarToggle.emit(this.isCollapsed);
  }

  // Same source as the existing console Sidebar (Roles & Permissions
  // assigned menus, sent by the login API) - kept independent so the
  // original Sidebar component is never touched.
  private loadMenus(): void {

    const user = this.authService.getCurrentUser();

    if (Array.isArray(user?.menus) && user.menus.length > 0) {
      this.menus = this.buildRoleMenus(user.menus);
      return;
    }

    // No modules assigned yet - just Dashboard, so the shell is never empty.
    this.menus = [
      { label: 'Dashboard', icon: 'fa-chart-line', route: '/admindashboard' }
    ];

  }

  private buildRoleMenus(items: AuthMenu[]): MasterAdminMenu[] {

    const ids = new Set(items.map(x => x.menuId));

    const toMenu = (item: AuthMenu): MasterAdminMenu => {

      const children = items
        .filter(x => x.parentMenuId === item.menuId)
        .map(toMenu);

      const menu: MasterAdminMenu = {
        label: item.menuName,
        icon: item.icon || 'fa-circle',
      };

      if (children.length > 0) {
        menu.expanded = false;
        menu.children = children;
      } else if (item.url) {
        menu.route = item.url.startsWith('/') ? item.url : '/' + item.url;
      }

      return menu;

    };

    return items
      .filter(x => !x.parentMenuId || !ids.has(x.parentMenuId))
      .map(toMenu);

  }

  onMenuClick(menu: MasterAdminMenu): void {

    if (menu.children && menu.children.length > 0) {
      menu.expanded = !menu.expanded;
      return;
    }

    if (menu.route) {
      this.router.navigateByUrl(menu.route);
    }

  }

  onChildClick(child: MasterAdminMenu): void {

    if (child.children && child.children.length > 0) {
      child.expanded = !child.expanded;
      return;
    }

    if (child.route) {
      this.router.navigateByUrl(child.route);
    }

  }

}
