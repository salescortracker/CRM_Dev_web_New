import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface StatCard {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  cssClass: string;
  trend: string;
  trendUp: boolean;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  leads: number;
  deals: number;
  status: string;
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
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  // =========================================================
  // PAGE
  // =========================================================

  pageTitle = 'Admin Dashboard';

  currentDate = new Date();

  // =========================================================
  // STATISTICS
  // =========================================================

  statCards: StatCard[] = [
    {
      title: 'Total Users',
      value: '86',
      subtitle: '4 added this month',
      icon: 'bi bi-people',
      cssClass: 'red',
      trend: '+4.7%',
      trendUp: true
    },
    {
      title: 'Active Leads',
      value: '312',
      subtitle: 'Across all sales teams',
      icon: 'bi bi-person-plus',
      cssClass: 'blue',
      trend: '+9.2%',
      trendUp: true
    },
    {
      title: 'Monthly Revenue',
      value: '₹6.85L',
      subtitle: 'Current month revenue',
      icon: 'bi bi-currency-rupee',
      cssClass: 'green',
      trend: '+6.4%',
      trendUp: true
    },
    {
      title: 'Open Tickets',
      value: '14',
      subtitle: '3 pending response',
      icon: 'bi bi-life-preserver',
      cssClass: 'purple',
      trend: '-2.1%',
      trendUp: false
    }
  ];

  // =========================================================
  // SECONDARY STATISTICS
  // =========================================================

  secondaryStats = [
    {
      title: 'Opportunities',
      value: '128',
      icon: 'bi bi-handshake',
      cssClass: 'orange'
    },
    {
      title: 'Quotations',
      value: '64',
      icon: 'bi bi-file-earmark-text',
      cssClass: 'cyan'
    },
    {
      title: 'Invoices',
      value: '212',
      icon: 'bi bi-receipt',
      cssClass: 'indigo'
    },
    {
      title: 'Active Campaigns',
      value: '6',
      icon: 'bi bi-megaphone',
      cssClass: 'pink'
    }
  ];

  // =========================================================
  // REVENUE DATA
  // =========================================================

  revenueData: RevenueData[] = [
    { month: 'Jan', value: 3.8 },
    { month: 'Feb', value: 4.1 },
    { month: 'Mar', value: 4.6 },
    { month: 'Apr', value: 5.0 },
    { month: 'May', value: 5.4 },
    { month: 'Jun', value: 5.9 },
    { month: 'Jul', value: 6.3 },
    { month: 'Aug', value: 6.85 }
  ];

  // =========================================================
  // TEAM
  // =========================================================

  teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Priya Nair',
      role: 'Sales Manager',
      leads: 48,
      deals: 12,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Arjun Mehta',
      role: 'Sales Executive',
      leads: 36,
      deals: 9,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Sneha Kapoor',
      role: 'Sales Executive',
      leads: 29,
      deals: 6,
      status: 'Active'
    },
    {
      id: 4,
      name: 'Ravi Kumar',
      role: 'Support Lead',
      leads: 18,
      deals: 3,
      status: 'On Leave'
    },
    {
      id: 5,
      name: 'Divya Rao',
      role: 'Marketing Executive',
      leads: 22,
      deals: 4,
      status: 'Active'
    }
  ];

  // =========================================================
  // RECENT ACTIVITIES
  // =========================================================

  activities: Activity[] = [
    {
      id: 1,
      icon: 'bi bi-person-plus',
      cssClass: 'activity-blue',
      title: 'New user added',
      description: 'Divya Rao joined as Marketing Executive',
      time: '18 minutes ago'
    },
    {
      id: 2,
      icon: 'bi bi-handshake',
      cssClass: 'activity-green',
      title: 'Deal won',
      description: 'Opportunity "Enterprise Rollout" closed',
      time: '42 minutes ago'
    },
    {
      id: 3,
      icon: 'bi bi-receipt',
      cssClass: 'activity-purple',
      title: 'Invoice generated',
      description: 'Invoice INV-2026-00341 created',
      time: '1 hour ago'
    },
    {
      id: 4,
      icon: 'bi bi-life-preserver',
      cssClass: 'activity-orange',
      title: 'Support ticket escalated',
      description: 'Ticket #482 marked high priority',
      time: '2 hours ago'
    },
    {
      id: 5,
      icon: 'bi bi-shield-check',
      cssClass: 'activity-red',
      title: 'Role updated',
      description: 'Permissions changed for Sales Executive role',
      time: '3 hours ago'
    }
  ];

  // =========================================================
  // MODULE USAGE
  // =========================================================

  moduleUsage = [
    {
      name: 'CRM & Leads',
      status: 'In Use',
      value: 92,
      cssClass: 'healthy'
    },
    {
      name: 'Sales & Quotations',
      status: 'In Use',
      value: 84,
      cssClass: 'healthy'
    },
    {
      name: 'Marketing',
      status: 'In Use',
      value: 61,
      cssClass: 'healthy'
    },
    {
      name: 'Customer Service',
      status: 'In Use',
      value: 47,
      cssClass: 'healthy'
    }
  ];

  // =========================================================
  // SUBSCRIPTION SNAPSHOT
  // =========================================================

  currentPlan = 'Professional';

  planUsersUsed = 86;

  planUsersLimit = 100;

  planRenewalDate = '18 Nov 2026';

  get planUsagePercent(): number {
    return Math.min(
      100,
      Math.round((this.planUsersUsed / this.planUsersLimit) * 100)
    );
  }

  // =========================================================
  // QUICK ACTIONS
  // =========================================================

  quickActions = [
    {
      title: 'Manage Users',
      icon: 'bi bi-people',
      route: '/users',
      cssClass: 'red'
    },
    {
      title: 'Roles & Permissions',
      icon: 'bi bi-shield-lock',
      route: '/roles-permissions',
      cssClass: 'blue'
    },
    {
      title: 'Company Settings',
      icon: 'bi bi-building-gear',
      route: '/company-profile',
      cssClass: 'purple'
    },
    {
      title: 'Reports',
      icon: 'bi bi-bar-chart',
      route: '/my-reports',
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
  // TEAM STATUS CLASS
  // =========================================================

  getStatusClass(status: string): string {

    switch (status.toLowerCase()) {

      case 'active':
        return 'status-active';

      case 'on leave':
        return 'status-trial';

      default:
        return '';
    }
  }
}
