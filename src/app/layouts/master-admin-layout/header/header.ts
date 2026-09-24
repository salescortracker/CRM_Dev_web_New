import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { LoginResponse } from '../../../core/authentication/models/login-response.model';

interface HeaderNotification {
  icon: string;
  title: string;
  time: string;
}

@Component({
  selector: 'app-master-admin-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class MasterAdminHeader {

  @Output()
  menuToggle = new EventEmitter<void>();

  currentUser: LoginResponse | null = null;

  searchText = '';

  notificationsOpen = false;
  profileOpen = false;

  // Placeholder feed - no dedicated notifications API exists yet.
  notifications: HeaderNotification[] = [
    { icon: 'fa-user-plus', title: 'A new user was added', time: 'Just now' },
    { icon: 'fa-shield-halved', title: 'Role permissions updated', time: 'Today' },
    { icon: 'fa-right-to-bracket', title: 'New login from this account', time: 'Today' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private elementRef: ElementRef
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  get userName(): string {
    return this.currentUser?.userName || 'Admin';
  }

  get userRole(): string {
    return this.currentUser?.role || 'Admin';
  }

  get initials(): string {
    return this.userName
      .split(/[\s@._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join('') || 'A';
  }

  toggleSidebar(): void {
    this.menuToggle.emit();
  }

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
    this.profileOpen = false;
  }

  toggleProfile(): void {
    this.profileOpen = !this.profileOpen;
    this.notificationsOpen = false;
  }

  goToProfile(): void {
    this.profileOpen = false;
    this.router.navigate(['/profile']);
  }

  changePassword(): void {
    this.profileOpen = false;
    this.router.navigate(['/change-password']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.notificationsOpen = false;
      this.profileOpen = false;
    }
  }

}
