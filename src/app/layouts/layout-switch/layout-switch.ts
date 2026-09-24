import { Component } from '@angular/core';
import { AuthService } from '../../core/authentication/services/auth.service';
import { AdminLayout } from '../admin-layout/admin-layout';
import { MasterAdminLayout } from '../master-admin-layout/master-admin-layout';

// Picks the outer shell by role, without touching AdminLayout's routes or
// internal logic. Admin gets the new MasterAdmin shell; Super Admin and
// User keep using AdminLayout exactly as before.
@Component({
  selector: 'app-layout-switch',
  imports: [AdminLayout, MasterAdminLayout],
  template: `
    @if (isAdmin) {
      <app-master-admin-layout></app-master-admin-layout>
    } @else {
      <app-admin-layout></app-admin-layout>
    }
  `,
})
export class LayoutSwitch {
  constructor(private authService: AuthService) {}

  get isAdmin(): boolean {
    return this.authService.getUserLayout() === 'admin';
  }
}
