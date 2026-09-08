import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface StatCard {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  cssClass: string;
  trend: string;
  trendUp: boolean;
}

interface Company {
  id: number;
  name: string;
  email: string;
  plan: string;
  users: number;
  status: string;
  revenue: number;
  createdDate: string;
}

interface Activity {
  id: number;
  icon: string;
  cssClass: string;
  title: string;
  description: string;
  time: string;
}

interface RevenueData {
  month: string;
  value: number;
}
@Component({
  selector: 'app-super-admin-dashboard',
  imports: [CommonModule,FormsModule],
  templateUrl: './super-admin-dashboard.html',
  styleUrl: './super-admin-dashboard.css',
})
export class SuperAdminDashboard {
   // =========================================================
  // PAGE
  // =========================================================

  pageTitle = 'Super Admin Dashboard';

  currentDate = new Date();

  // =========================================================
  // STATISTICS
  // =========================================================

  statCards: StatCard[] = [
    {
      title: 'Total Companies',
      value: '248',
      subtitle: '12 added this month',
      icon: 'bi bi-building',
      cssClass: 'red',
      trend: '+5.1%',
      trendUp: true
    },
    {
      title: 'Active Users',
      value: '4,862',
      subtitle: 'Users across all companies',
      icon: 'bi bi-people',
      cssClass: 'blue',
      trend: '+8.4%',
      trendUp: true
    },
    {
      title: 'Monthly Revenue',
      value: '₹18.42L',
      subtitle: 'Current month revenue',
      icon: 'bi bi-currency-rupee',
      cssClass: 'green',
      trend: '+12.6%',
      trendUp: true
    },
    {
      title: 'Active Subscriptions',
      value: '221',
      subtitle: '89.1% of total companies',
      icon: 'bi bi-credit-card',
      cssClass: 'purple',
      trend: '+3.2%',
      trendUp: true
    }
  ];

  // =========================================================
  // SECONDARY STATISTICS
  // =========================================================

  secondaryStats = [
    {
      title: 'New Leads',
      value: '1,284',
      icon: 'bi bi-person-plus',
      cssClass: 'orange'
    },
    {
      title: 'Opportunities',
      value: '642',
      icon: 'bi bi-handshake',
      cssClass: 'cyan'
    },
    {
      title: 'Invoices',
      value: '1,842',
      icon: 'bi bi-receipt',
      cssClass: 'indigo'
    },
    {
      title: 'Tickets',
      value: '86',
      icon: 'bi bi-life-preserver',
      cssClass: 'pink'
    }
  ];

  // =========================================================
  // REVENUE DATA
  // =========================================================

  revenueData: RevenueData[] = [
    { month: 'Jan', value: 8.2 },
    { month: 'Feb', value: 9.5 },
    { month: 'Mar', value: 10.8 },
    { month: 'Apr', value: 12.4 },
    { month: 'May', value: 13.6 },
    { month: 'Jun', value: 15.2 },
    { month: 'Jul', value: 16.8 },
    { month: 'Aug', value: 18.4 }
  ];

  // =========================================================
  // COMPANIES
  // =========================================================

  companies: Company[] = [
    {
      id: 1,
      name: 'ABC Technologies',
      email: 'admin@abctech.com',
      plan: 'Enterprise',
      users: 184,
      status: 'Active',
      revenue: 125000,
      createdDate: '18 Aug 2026'
    },
    {
      id: 2,
      name: 'Global InfoTech',
      email: 'admin@globalinfotech.com',
      plan: 'Professional',
      users: 96,
      status: 'Active',
      revenue: 72000,
      createdDate: '15 Aug 2026'
    },
    {
      id: 3,
      name: 'Future Vision',
      email: 'admin@futurevision.com',
      plan: 'Enterprise',
      users: 248,
      status: 'Active',
      revenue: 148000,
      createdDate: '12 Aug 2026'
    },
    {
      id: 4,
      name: 'NextGen Solutions',
      email: 'admin@nextgen.com',
      plan: 'Starter',
      users: 34,
      status: 'Trial',
      revenue: 12000,
      createdDate: '10 Aug 2026'
    },
    {
      id: 5,
      name: 'Cortracker India',
      email: 'admin@cortracker.com',
      plan: 'Professional',
      users: 126,
      status: 'Active',
      revenue: 84000,
      createdDate: '08 Aug 2026'
    }
  ];

  // =========================================================
  // RECENT ACTIVITIES
  // =========================================================

  activities: Activity[] = [
    {
      id: 1,
      icon: 'bi bi-building-add',
      cssClass: 'activity-red',
      title: 'New company registered',
      description: 'NextGen Solutions joined the CRM platform',
      time: '12 minutes ago'
    },
    {
      id: 2,
      icon: 'bi bi-credit-card',
      cssClass: 'activity-green',
      title: 'Subscription upgraded',
      description: 'ABC Technologies upgraded to Enterprise',
      time: '35 minutes ago'
    },
    {
      id: 3,
      icon: 'bi bi-person-plus',
      cssClass: 'activity-blue',
      title: 'New users added',
      description: '24 users added by Global InfoTech',
      time: '1 hour ago'
    },
    {
      id: 4,
      icon: 'bi bi-receipt',
      cssClass: 'activity-purple',
      title: 'Invoice generated',
      description: 'Monthly subscription invoice generated',
      time: '2 hours ago'
    },
    {
      id: 5,
      icon: 'bi bi-shield-check',
      cssClass: 'activity-orange',
      title: 'Security event',
      description: 'Admin permissions updated',
      time: '3 hours ago'
    }
  ];

  // =========================================================
  // SUBSCRIPTION DISTRIBUTION
  // =========================================================

  subscriptionPlans = [
    {
      name: 'Enterprise',
      count: 62,
      percentage: 28,
      cssClass: 'enterprise'
    },
    {
      name: 'Professional',
      count: 104,
      percentage: 47,
      cssClass: 'professional'
    },
    {
      name: 'Starter',
      count: 55,
      percentage: 25,
      cssClass: 'starter'
    }
  ];

  // =========================================================
  // SYSTEM HEALTH
  // =========================================================

  systemHealth = [
    {
      name: 'API Server',
      status: 'Operational',
      value: 99.99,
      cssClass: 'healthy'
    },
    {
      name: 'Database',
      status: 'Operational',
      value: 99.98,
      cssClass: 'healthy'
    },
    {
      name: 'Background Jobs',
      status: 'Operational',
      value: 99.95,
      cssClass: 'healthy'
    },
    {
      name: 'Email Service',
      status: 'Operational',
      value: 99.97,
      cssClass: 'healthy'
    }
  ];

  // =========================================================
  // QUICK ACTIONS
  // =========================================================

  quickActions = [
    {
      title: 'Add Company',
      icon: 'bi bi-building-add',
      route: '/superadmindashboard/companies',
      cssClass: 'red'
    },
    {
      title: 'Manage Users',
      icon: 'bi bi-people',
      route: '/superadmindashboard/users',
      cssClass: 'blue'
    },
    {
      title: 'Subscriptions',
      icon: 'bi bi-credit-card',
      route: '/superadmindashboard/subscriptions',
      cssClass: 'purple'
    },
    {
      title: 'Reports',
      icon: 'bi bi-bar-chart',
      route: '/superadmindashboard/reports',
      cssClass: 'green'
    }
  ];

  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private router: Router
  ) {}

  // =========================================================
  // NAVIGATION
  // =========================================================

  navigate(route: string): void {
    this.router.navigateByUrl(route);
  }

  // =========================================================
  // COMPANY DETAILS
  // =========================================================

  viewCompany(companyId: number): void {
    this.router.navigate([
      '/superadmindashboard/companies',
      companyId
    ]);
  }

  // =========================================================
  // ADD COMPANY
  // =========================================================

  addCompany(): void {
    this.router.navigate([
      '/superadmindashboard/companies/create'
    ]);
  }

  // =========================================================
  // FORMAT CURRENCY
  // =========================================================

  formatCurrency(value: number): string {

    if (value >= 10000000) {
      return '₹' + (value / 10000000).toFixed(2) + 'Cr';
    }

    if (value >= 100000) {
      return '₹' + (value / 100000).toFixed(2) + 'L';
    }

    if (value >= 1000) {
      return '₹' + (value / 1000).toFixed(1) + 'K';
    }

    return '₹' + value.toLocaleString('en-IN');
  }

  // =========================================================
  // REVENUE HEIGHT
  // =========================================================

  getRevenueHeight(value: number): number {

    const maxValue = Math.max(
      ...this.revenueData.map(x => x.value)
    );

    if (maxValue === 0) {
      return 0;
    }

    return (value / maxValue) * 100;
  }

  // =========================================================
  // COMPANY STATUS CLASS
  // =========================================================

  getStatusClass(status: string): string {

    switch (status.toLowerCase()) {

      case 'active':
        return 'status-active';

      case 'trial':
        return 'status-trial';

      case 'inactive':
        return 'status-inactive';

      default:
        return '';
    }
  }

  // =========================================================
  // PLAN CLASS
  // =========================================================

  getPlanClass(plan: string): string {

    switch (plan.toLowerCase()) {

      case 'enterprise':
        return 'plan-enterprise';

      case 'professional':
        return 'plan-professional';

      case 'starter':
        return 'plan-starter';

      default:
        return '';
    }
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  logout(): void {

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loginResponse');

    this.router.navigate(['/login']);
  }
}
