import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';

@Component({
  selector: 'app-login-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-history.html',
  styleUrl: './login-history.css',
})
export class LoginHistory implements OnInit {
  constructor(
    private authService: AuthService,
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.loadLoginHistory();

  }


  // ==============================
  // Data
  // ==============================

  history: any[] = [];


  loadLoginHistory(): void {

    this.spinner.show();

    this.authService
      .getLoginHistory()
      .subscribe({

        next: (response: any) => {

          this.spinner.hide();

          this.history = (response.data || []).map((x: any) => ({

            id: x.loginHistoryId,
            loginTime: x.loginTime,
            user: x.fullName || x.userName,
            userName: x.userName,
            email: x.email,
            loginType: x.loginType || 'Web',
            device: x.device || '-',
            ipAddress: x.ipAddress || '-',
            location: x.location || '-',
            status: x.status

          }));

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error(err);

          this.alert.error(
            err?.error?.message || 'Failed to load login history.'
          );

        }
      });

  }


  refresh(): void {

    this.loadLoginHistory();

  }




  // ==============================
  // Search / Filter
  // ==============================

  searchText = '';

  statusFilter = '';

  fromDate = '';


  get filteredHistory(): any[] {

    return this.history.filter(item => {

      const search = this.searchText.trim().toLowerCase();

      const matchesSearch =
        !search ||
        (item.user || '').toLowerCase().includes(search) ||
        (item.userName || '').toLowerCase().includes(search) ||
        (item.email || '').toLowerCase().includes(search);

      const matchesStatus =
        !this.statusFilter ||
        this.statusFilter === 'All' ||
        item.status === this.statusFilter;

      const matchesDate =
        !this.fromDate ||
        (item.loginTime || '').slice(0, 10) === this.fromDate;

      return matchesSearch && matchesStatus && matchesDate;

    });

  }


  clearFilters(): void {

    this.searchText = '';

    this.statusFilter = '';

    this.fromDate = '';

  }




  // ==============================
  // Statistics
  // ==============================

  get successCount(): number {

    return this.history.filter(x => x.status === 'Success').length;

  }

  get failedCount(): number {

    return this.history.filter(x => x.status === 'Failed').length;

  }

  get lockedCount(): number {

    return this.history.filter(x => x.status === 'Locked').length;

  }




  // ==============================
  // Row Actions
  // ==============================

  view(item: any): void {

    this.alert.info(
      `User : ${item.user}
Login Time : ${this.formatDate(item.loginTime)}
Login Type : ${item.loginType}
Device : ${item.device}
IP Address : ${item.ipAddress}
Location : ${item.location}
Status : ${item.status}`
    );

  }


  logout(item: any): void {

    this.alert.info(
      'Force logout will be connected once session management is implemented.'
    );

  }


  exportHistory(): void {

    this.alert.info(
      'Export functionality will be connected with Excel/PDF API.'
    );

  }




  // ==============================
  // Helpers
  // ==============================

  formatDate(value: string): string {

    if (!value) {
      return '-';
    }

    return new Date(value).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  }


  getStatusClass(status: string): string {

    switch (status) {

      case 'Success':
        return 'bg-success';

      case 'Failed':
        return 'bg-danger';

      case 'Locked':
        return 'bg-warning text-dark';

      default:
        return 'bg-secondary';

    }

  }
}
