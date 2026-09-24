import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MasterAdminSidebar } from './sidebar/sidebar';
import { MasterAdminHeader } from './header/header';
import { MasterAdminFooter } from './footer/footer';

@Component({
  selector: 'app-master-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MasterAdminSidebar, MasterAdminHeader, MasterAdminFooter],
  templateUrl: './master-admin-layout.html',
  styleUrl: './master-admin-layout.css',
})
export class MasterAdminLayout {

  sidebarCollapsed = false;

  // Overlay sidebar on small screens; starts closed.
  mobileSidebarOpen = false;

  onSidebarToggle(collapsed: boolean): void {
    this.sidebarCollapsed = collapsed;
  }

  onMobileMenuToggle(): void {
    this.mobileSidebarOpen = !this.mobileSidebarOpen;
  }

  closeMobileSidebar(): void {
    this.mobileSidebarOpen = false;
  }

}
