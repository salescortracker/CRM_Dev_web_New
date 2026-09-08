import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface AdminMenuItem {
  id: string;
  title: string;
  icon: string;
  children?: AdminMenuItem[];
}

interface Company {
  id: number;
  name: string;
  code: string;
  plan: string;
  users: number;
  status: string;
  revenue: number;
  createdDate: string;
}
@Component({
  selector: 'app-super-admin-layout',
  imports: [CommonModule,FormsModule],
  templateUrl: './super-admin-layout.html',
  styleUrl: './super-admin-layout.css',
})
export class SuperAdminLayout {

  // ============================================================
  // LAYOUT
  // ============================================================

  sidebarCollapsed = false;

  activeMenu = 'dashboard';

  activeSubMenu = '';

  showNotifications = false;

  showProfileMenu = false;

  searchText = '';

  // ============================================================
  // DASHBOARD FILTER
  // ============================================================

  selectedPeriod = 'This Month';

  periods: string[] = [
    'Today',
    'This Week',
    'This Month',
    'This Quarter',
    'This Year'
  ];

  // ============================================================
  // MENU
  // ============================================================

  menuItems: AdminMenuItem[] = [

    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'bi bi-grid-1x2'
    },

    {
      id: 'tenants',
      title: 'Tenant Management',
      icon: 'bi bi-buildings',
      children: [
        {
          id: 'companies',
          title: 'Companies',
          icon: 'bi bi-building'
        },
        {
          id: 'company-admins',
          title: 'Company Admins',
          icon: 'bi bi-person-badge'
        },
        {
          id: 'users',
          title: 'Users',
          icon: 'bi bi-people'
        },
        {
          id: 'regions',
          title: 'Regions',
          icon: 'bi bi-globe2'
        },
        {
          id: 'company-modules',
          title: 'Company Modules',
          icon: 'bi bi-boxes'
        }
      ]
    },

    {
      id: 'billing',
      title: 'Subscription & Billing',
      icon: 'bi bi-credit-card',
      children: [
        {
          id: 'plans',
          title: 'Subscription Plans',
          icon: 'bi bi-layers'
        },
        {
          id: 'subscriptions',
          title: 'Company Subscriptions',
          icon: 'bi bi-journal-check'
        },
        {
          id: 'billing-invoices',
          title: 'Invoices',
          icon: 'bi bi-receipt'
        },
        {
          id: 'payments',
          title: 'Payments',
          icon: 'bi bi-cash-stack'
        },
        {
          id: 'revenue',
          title: 'Revenue',
          icon: 'bi bi-graph-up-arrow'
        }
      ]
    },

    {
      id: 'crm-config',
      title: 'CRM Configuration',
      icon: 'bi bi-sliders',
      children: [
        {
          id: 'lead-sources',
          title: 'Lead Sources',
          icon: 'bi bi-megaphone'
        },
        {
          id: 'lead-status',
          title: 'Lead Status',
          icon: 'bi bi-tags'
        },
        {
          id: 'opportunity-stages',
          title: 'Opportunity Stages',
          icon: 'bi bi-funnel'
        },
        {
          id: 'pipelines',
          title: 'Pipelines',
          icon: 'bi bi-kanban'
        },
        {
          id: 'account-types',
          title: 'Account Types',
          icon: 'bi bi-building'
        },
        {
          id: 'contact-types',
          title: 'Contact Types',
          icon: 'bi bi-person-lines-fill'
        },
        {
          id: 'activity-types',
          title: 'Activity Types',
          icon: 'bi bi-calendar-event'
        },
        {
          id: 'lost-reasons',
          title: 'Lost Reasons',
          icon: 'bi bi-x-circle'
        }
      ]
    },

    {
      id: 'products',
      title: 'Product & Sales',
      icon: 'bi bi-box-seam',
      children: [
        {
          id: 'product-categories',
          title: 'Product Categories',
          icon: 'bi bi-folder'
        },
        {
          id: 'products-list',
          title: 'Products',
          icon: 'bi bi-box'
        },
        {
          id: 'tax',
          title: 'Tax Configuration',
          icon: 'bi bi-percent'
        },
        {
          id: 'price-lists',
          title: 'Price Lists',
          icon: 'bi bi-list-columns'
        },
        {
          id: 'discount-rules',
          title: 'Discount Rules',
          icon: 'bi bi-tag'
        }
      ]
    },

    {
      id: 'security',
      title: 'Security',
      icon: 'bi bi-shield-lock',
      children: [
        {
          id: 'roles',
          title: 'Roles',
          icon: 'bi bi-person-lock'
        },
        {
          id: 'permissions',
          title: 'Permissions',
          icon: 'bi bi-key'
        },
        {
          id: 'role-permissions',
          title: 'Role Permissions',
          icon: 'bi bi-shield-check'
        },
        {
          id: 'login-history',
          title: 'Login History',
          icon: 'bi bi-clock-history'
        },
        {
          id: 'audit-logs',
          title: 'Audit Logs',
          icon: 'bi bi-file-earmark-text'
        },
        {
          id: 'security-settings',
          title: 'Security Settings',
          icon: 'bi bi-gear'
        }
      ]
    },

    {
      id: 'communication',
      title: 'Communication',
      icon: 'bi bi-envelope',
      children: [
        {
          id: 'email-templates',
          title: 'Email Templates',
          icon: 'bi bi-envelope-paper'
        },
        {
          id: 'notification-templates',
          title: 'Notification Templates',
          icon: 'bi bi-bell'
        },
        {
          id: 'smtp',
          title: 'SMTP Settings',
          icon: 'bi bi-server'
        },
        {
          id: 'notifications',
          title: 'Notifications',
          icon: 'bi bi-bell-fill'
        }
      ]
    },

    {
      id: 'integrations',
      title: 'Integrations',
      icon: 'bi bi-plug',
      children: [
        {
          id: 'email-integration',
          title: 'Email',
          icon: 'bi bi-envelope'
        },
        {
          id: 'whatsapp',
          title: 'WhatsApp',
          icon: 'bi bi-whatsapp'
        },
        {
          id: 'sms',
          title: 'SMS',
          icon: 'bi bi-chat-dots'
        },
        {
          id: 'payment-gateway',
          title: 'Payment Gateway',
          icon: 'bi bi-credit-card'
        },
        {
          id: 'webhooks',
          title: 'API / Webhooks',
          icon: 'bi bi-code-slash'
        }
      ]
    },

    {
      id: 'reports',
      title: 'Reports',
      icon: 'bi bi-bar-chart',
      children: [
        {
          id: 'revenue-report',
          title: 'Revenue',
          icon: 'bi bi-currency-rupee'
        },
        {
          id: 'sales-report',
          title: 'Sales',
          icon: 'bi bi-graph-up'
        },
        {
          id: 'company-report',
          title: 'Companies',
          icon: 'bi bi-building'
        },
        {
          id: 'user-report',
          title: 'Users',
          icon: 'bi bi-people'
        },
        {
          id: 'usage-report',
          title: 'Usage Analytics',
          icon: 'bi bi-activity'
        }
      ]
    },

    {
      id: 'system',
      title: 'System',
      icon: 'bi bi-gear-wide-connected',
      children: [
        {
          id: 'system-settings',
          title: 'System Settings',
          icon: 'bi bi-gear'
        },
        {
          id: 'localization',
          title: 'Localization',
          icon: 'bi bi-translate'
        },
        {
          id: 'backup',
          title: 'Backup',
          icon: 'bi bi-database'
        }
      ]
    }
  ];

  // ============================================================
  // COMPANIES
  // ============================================================

  companies: Company[] = [
    {
      id: 1,
      name: 'ABC Technologies',
      code: 'ABC001',
      plan: 'Enterprise',
      users: 86,
      status: 'Active',
      revenue: 125000,
      createdDate: '2026-01-12'
    },
    {
      id: 2,
      name: 'XYZ Solutions',
      code: 'XYZ002',
      plan: 'Professional',
      users: 42,
      status: 'Active',
      revenue: 78000,
      createdDate: '2026-02-18'
    },
    {
      id: 3,
      name: 'Future Vision',
      code: 'FUT003',
      plan: 'Starter',
      users: 15,
      status: 'Trial',
      revenue: 12500,
      createdDate: '2026-07-04'
    },
    {
      id: 4,
      name: 'Global InfoTech',
      code: 'GIT004',
      plan: 'Enterprise',
      users: 124,
      status: 'Active',
      revenue: 184000,
      createdDate: '2025-11-20'
    },
    {
      id: 5,
      name: 'NextGen Pvt Ltd',
      code: 'NG005',
      plan: 'Professional',
      users: 31,
      status: 'Suspended',
      revenue: 45000,
      createdDate: '2026-03-11'
    }
  ];

  // ============================================================
  // DASHBOARD DATA
  // ============================================================

  totalCompanies = 128;

  activeCompanies = 114;

  trialCompanies = 9;

  suspendedCompanies = 5;

  totalUsers = 2486;

  activeUsers = 2314;

  monthlyRevenue = 1284500;

  yearlyRevenue = 14580000;

  activeSubscriptions = 114;

  expiringSubscriptions = 7;

  totalLeads = 18452;

  totalOpportunities = 4821;

  totalOrders = 2934;

  totalInvoices = 3287;

  // ============================================================
  // RECENT ACTIVITY
  // ============================================================

  recentActivities = [
    {
      icon: 'bi bi-building',
      title: 'New company registered',
      description: 'TechNova Solutions',
      time: '10 minutes ago'
    },
    {
      icon: 'bi bi-person-plus',
      title: 'New user created',
      description: 'Rahul Sharma',
      time: '25 minutes ago'
    },
    {
      icon: 'bi bi-credit-card',
      title: 'Subscription upgraded',
      description: 'ABC Technologies → Enterprise',
      time: '1 hour ago'
    },
    {
      icon: 'bi bi-receipt',
      title: 'Invoice generated',
      description: 'INV-2026-00892',
      time: '2 hours ago'
    },
    {
      icon: 'bi bi-shield-check',
      title: 'Security policy updated',
      description: 'MFA policy enabled',
      time: '3 hours ago'
    }
  ];

  // ============================================================
  // TOP COMPANIES
  // ============================================================

  topCompanies = [
    {
      name: 'Global InfoTech',
      revenue: 184000,
      users: 124
    },
    {
      name: 'ABC Technologies',
      revenue: 125000,
      users: 86
    },
    {
      name: 'XYZ Solutions',
      revenue: 78000,
      users: 42
    },
    {
      name: 'NextGen Pvt Ltd',
      revenue: 45000,
      users: 31
    }
  ];

  // ============================================================
  // MENU
  // ============================================================

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setActiveMenu(menuId: string): void {

    this.activeMenu = menuId;

    this.activeSubMenu = '';

  }

  setActiveSubMenu(
    menuId: string,
    parentId: string
  ): void {

    this.activeMenu = parentId;

    this.activeSubMenu = menuId;

  }

  isMenuActive(menuId: string): boolean {

    return this.activeMenu === menuId;

  }

  isSubMenuActive(menuId: string): boolean {

    return this.activeSubMenu === menuId;

  }

  // ============================================================
  // SEARCH
  // ============================================================

  get filteredCompanies(): Company[] {

    const search = this.searchText
      .trim()
      .toLowerCase();

    if (!search) {
      return this.companies;
    }

    return this.companies.filter(company =>
      company.name.toLowerCase().includes(search) ||
      company.code.toLowerCase().includes(search) ||
      company.plan.toLowerCase().includes(search)
    );

  }

  // ============================================================
  // COMPANY STATUS
  // ============================================================

  getCompanyStatusClass(status: string): string {

    switch (status) {

      case 'Active':
        return 'status-active';

      case 'Trial':
        return 'status-trial';

      case 'Suspended':
        return 'status-suspended';

      default:
        return '';

    }

  }

  // ============================================================
  // FORMAT CURRENCY
  // ============================================================

  formatCurrency(value: number): string {

    return new Intl.NumberFormat(
      'en-IN',
      {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }
    ).format(value);

  }

  // ============================================================
  // PROFILE
  // ============================================================

  toggleProfile(): void {

    this.showProfileMenu =
      !this.showProfileMenu;

    this.showNotifications = false;

  }

  toggleNotifications(): void {

    this.showNotifications =
      !this.showNotifications;

    this.showProfileMenu = false;

  }

  // ============================================================
  // QUICK ACTIONS
  // ============================================================

  openCompany(): void {

    this.setActiveSubMenu(
      'companies',
      'tenants'
    );

  }

  openUser(): void {

    this.setActiveSubMenu(
      'users',
      'tenants'
    );

  }

  openSubscription(): void {

    this.setActiveSubMenu(
      'subscriptions',
      'billing'
    );

  }

  openReports(): void {

    this.setActiveMenu('reports');

  }

  // ============================================================
  // LOGOUT
  // ============================================================

  logout(): void {

    console.log('Super Admin logout');

  }
}
