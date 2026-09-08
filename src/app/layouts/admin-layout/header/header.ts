import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { LoginResponse } from '../../../core/authentication/models/login-response.model';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  currentUser: LoginResponse | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  get userName(): string {
    return this.currentUser?.userName || 'John';
  }

  get userRole(): string {
    return this.currentUser?.role || 'User';
  }

  get initials(): string {
    return this.userName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(name => name[0]?.toUpperCase())
      .join('') || 'U';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
