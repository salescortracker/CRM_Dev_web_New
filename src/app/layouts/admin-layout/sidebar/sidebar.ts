import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { OnInit } from '@angular/core';
import { AuthService } from '../../../core/authentication/services/auth.service';
// import { AuthService } from '../../core/authentication/services/auth.service';

interface SidebarMenu {
  label: string;
  icon: string;
  route?: string;
  group: string;
  expanded?: boolean;
  children?: SidebarMenu[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {

  @Output()
  sidebarToggle = new EventEmitter<boolean>();

  isCollapsed = false;

  constructor(private router: Router, private authService: AuthService) { }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.sidebarToggle.emit(this.isCollapsed);
  }

  ngOnInit() {

    this.loadMenus();

  }
  loadMenus() {

    const role = this.authService.getCurrentUser()?.role;

    switch (role) {

      case 'Super Admin':

        this.menus = this.superAdminMenus;

        break;

      case 'Admin':

        this.menus = this.companyAdminMenus;

        break;

      case 'User':

        this.menus = this.userMenus;

        break;

      default:

        this.menus = [];

    }

  }
  menus: SidebarMenu[] = [];
  superAdminMenus: SidebarMenu[] = [

    {
      label: 'Dashboard',
      icon: 'fa-chart-line',
      route: '/dashboard',
      group: 'CRM'
    },

    {
      label: 'Organizations',
      icon: 'fa-sitemap',
      group: 'Administration',
      expanded: false,
      children: [
        {
          label: 'Organizations',
          icon: 'fa-users',
          route: '/organizations',
          group: 'Administration'
        },

        {
          label: 'Companys',
          icon: 'fa-building',
          route: '/company',
          group: 'Administration'
        },
        {
          label: 'Company Administrators',
          icon: 'fa-building',
          route: '/company-administrators',
          group: 'Administration'
        },
        {
          label: 'Regions',
          icon: 'fa-building',
          route: '/region',
          group: 'Administration'
        },
        {
          label: 'Branches',
          icon: 'fa-building',
          route: '/branches',
          group: 'Administration'
        },
        {
          label: 'Business Units (Optional)',
          icon: 'fa-building',
          route: '/business-units',
          group: 'Administration'
        },
        {
          label: ' Company Settings',
          icon: 'fa-building',
          route: '/company-settings',
          group: 'Administration'
        },



      ]

    },
    {
      label: 'Subscription Management',
      icon: 'fa-credit-card',
      group: 'Administration',
      expanded: false,
      children: [
        {
          label: 'Plans',
          icon: 'fa-building',
          route: '/plans',
          group: 'Administration'
        },
        {
          label: ' Company Subscriptions',
          icon: 'fa-code-branch',
          route: '/subscriptions',
          group: 'Administration'
        },
        // {
        //   label: 'Subscription Renewals',
        //   icon: 'fa-code-branch',
          //route: '/subscriptions',
        //   group: 'Administration'
        // },
        {
          label: ' Payment Tracking',
          icon: 'fa-map-location-dot',
          route: '/payment-tracking',
          group: 'Administration'
        },
        {
          label: 'Billing',
          icon: 'fa-map-location-dot',
          route: '/billing',
          group: 'Administration'
        },
        {
          label: 'Invoices',
          icon: 'fa-map-location-dot',
          route: '/invoices',
          group: 'Administration'
        },
        {
          label: ' Coupons & Discounts',
          icon: 'fa-map-location-dot',
          route: '/coupons-discounts',
          group: 'Administration'
        }
      ]
    },
    {
      label: 'User & Access Management',
      icon: 'fa-users-gear',
      group: 'Administration',
      expanded: false,
      children: [
        {
          label: 'Departments',
          icon: 'fa-building',
          route: '/departments',
          group: 'Administration'
        },
        {
          label: 'Designations',
          icon: 'fa-code-branch',
          route: '/designations',
          group: 'Administration'
        },
        {
          label: 'Menu Access',
          icon: 'fa-map-location-dot',
          route: '/menu-access',
          group: 'Administration'
        },
        {
          label: 'Roles And Permissions',
          icon: 'fa-map-location-dot',
          route: '/roles-permissions',
          group: 'Administration'
        },
        {
          label: 'Users',
          icon: 'fa-map-location-dot',
          route: '/users',
          group: 'Administration'
        },
        {
          label: 'Teams',
          icon: 'fa-map-location-dot',
          route: '/teams',
          group: 'Administration'
        }
        ,
        {
          label: 'Access Policies',
          icon: 'fa-map-location-dot',
          route: '/access-policies',
          group: 'Administration'
        }
      ]
    },
    {
      label: 'CRM Module Configuration',
      icon: 'fa-sliders',
      group: 'Administration',
      expanded: false,
      children: [
        {
          label: 'Lead Settings',
          icon: 'fa-building',
          route: '/lead-settings',
          group: 'Administration'
        },
        {
          label: 'Pipeline Settings',
          icon: 'fa-building',
          route: '/pipeline-settings',
          group: 'Administration'
        },
        {
          label: 'Opportunity Stages',
          icon: 'fa-building',
          route: '/opportunity-stages',
          group: 'Administration'
        },
        {
          label: 'Activity Types',
          icon: 'fa-building',
          route: '/activity-types',
          group: 'Administration'
        },
        {
          label: 'Sources',
          icon: 'fa-building',
          route: '/sources',
          group: 'Administration'
        },
        {
          label: 'Industries',
          icon: 'fa-building',
          route: '/industries',
          group: 'Administration'
        },
        {
          label: 'Territories',
          icon: 'fa-building',
          route: '/territories',
          group: 'Administration'
        },
        {
          label: 'Sales Targets',
          icon: 'fa-building',
          route: '/salestargets',
          group: 'Administration'
        },
        {
          label: 'Number Series',
          icon: 'fa-building',
          route: '/number-series',
          group: 'Administration'
        },
        {
          label: 'Custom Fields',
          icon: 'fa-building',
          route: '/custom-fields',
          group: 'Administration'
        },
      ]

    },
    {
      label: 'Integration Management',
      icon: 'fa-plug',
      group: 'Administration',
      expanded: false,
      children: [
        {
          label: 'Email Configuration',
          icon: 'fa-building',
          route: '/email-configuration',
          group: 'Administration'
        },
        {
          label: 'SMS Configuration',
          icon: 'fa-code-branch',
          route: '/sms-configuration',
          group: 'Administration'
        },
        {
          label: 'WhatsApp Configuration',
          icon: 'fa-map-location-dot',
          route: '/whatsapp-configuration',
          group: 'Administration'
        },
        {
          label: 'Telephony Configuration',
          icon: 'fa-map-location-dot',
          route: '/telephony-configuration',
          group: 'Administration'
        },
        {
          label: 'API Configuration',
          icon: 'fa-map-location-dot',
          route: '/api-configuration',
          group: 'Administration'
        },
        {
          label: 'Webhooks',
          icon: 'fa-map-location-dot',
          route: '/webhooks-configuration',
          group: 'Administration'
        },
        {
          label: 'Third Party Integrations',
          icon: 'fa-map-location-dot',
          route: '/third-party-integrations',
          group: 'Administration'
        }

      ]
    },
    {
      label: 'Workflow & Automation',
      icon: 'fa-gears',

      group: 'Administration',
      expanded: false,

      children: [

        {
          label: ' Workflow Rules',
          icon: 'fa-building',
          route: '/workflow-rules',
          group: 'Administration'
        },
        {
          label: 'Approval Workflow',
          icon: 'fa-building',
          route: '/approval-workflow',
          group: 'Administration'
        },
        {
          label: 'Auto Assignment',
          icon: 'fa-building',
          route: '/auto-assignment',
          group: 'Administration'
        },
        {
          label: 'Escalation Rules',
          icon: 'fa-building',
          route: '/escalation-rules',
          group: 'Administration'
        },
        {
          label: 'SLA Rules',
          icon: 'fa-building',
          route: '/sla-rules',
          group: 'Administration'
        },
        {
          label: 'Email Automation',
          icon: 'fa-building',
          route: '/email-automation',
          group: 'Administration'
        },
        {
          label: 'Scheduled Jobs',
          icon: 'fa-building',
          route: '/scheduled-jobs',
          group: 'Administration'
        }
      ]
    },
    {
      label: 'Security Center',
      icon: 'fa-shield-halved',

      group: 'Administration',
      expanded: false,

      children: [
        {
          label: 'Login Sessions',
          icon: 'fa-building',
          route: '/login-sessions',
          group: 'Administration'
        },
        {
          label: 'Password Policy',
          icon: 'fa-building',
          route: '/password-policy',
          group: 'Administration'
        },
        {
          label: 'MFA',
          icon: 'fa-building',
          route: '/mfa',
          group: 'Administration'
        },
        {
          label: 'IP Restrictions',
          icon: 'fa-building',
          route: '/ip-restrictions',
          group: 'Administration'
        },
        {
          label: 'Device Management',
          icon: 'fa-building',
          route: '/device-management',
          group: 'Administration'
        },
        {
          label: 'Security Logs',
          icon: 'fa-building',
          route: '/security-logs',
          group: 'Administration'
        }
      ]
    },
    {
      label: 'Notification Management',
      icon: 'fa-bell',
      route: '/notifications',
      group: 'Administration',
      expanded: false,

      children: [
        {
          label: 'Email Templates',
          icon: 'fa-building',
          route: '/email-notification',
          group: 'Administration'
        },
        {
          label: ' SMS Templates',
          icon: 'fa-building',
          route: '/sms-notification',
          group: 'Administration'
        },
        {
          label: 'WhatsApp Templates',
          icon: 'fa-building',
          route: '/whatsapp-notification',
          group: 'Administration'
        },
        {
          label: 'Push Notifications',
          icon: 'fa-building',
          route: '/push-notification',
          group: 'Administration'
        },
        {
          label: 'Notification Rules',
          icon: 'fa-building',
          route: '/notification-rules',
          group: 'Administration'
        },
      ]
    },
    {
      label: 'Audit & Monitoring',
      icon: 'fa-clipboard-check',
      route: '/audit-logs',
      group: 'Administration',
      expanded: false,

      children: [
        {
          label: 'Audit Logs',
          icon: 'fa-building',
          route: '/audit-logs',
          group: 'Administration'
        },
        {
          label: 'Login History',
          icon: 'fa-building',
          route: '/login-history',
          group: 'Administration'
        },
        {
          label: 'API Logs',
          icon: 'fa-building',
          route: '/api-logs',
          group: 'Administration'
        },
        {
          label: 'Error Logs',
          icon: 'fa-building',
          route: '/error-logs',
          group: 'Administration'
        },
        {
          label: 'User Activities',
          icon: 'fa-building',
          route: '/user-activities',
          group: 'Administration'
        },
      ]
    },
    // {
    //   label: 'Data Management',
    //   icon: 'fa-chart-line',

    //   group: 'Administration',
    //   expanded: false,

    //   children: [

    //     {
    //       label: 'Automated Backup',
    //       icon: 'fa-building',
    //       route: '/backup-recovery',
    //       group: 'Administration'
    //     },
    //      {
    //       label: 'Import Data',
    //       icon: 'fa-building',
    //       route: '/backup-recovery',
    //       group: 'Administration'
    //     },
    //       {
    //       label: 'Export Data',
    //       icon: 'fa-building',
    //       route: '/backup-recovery',
    //       group: 'Administration'
    //     },

    //   ]
    // },

    {
      label: 'Reports & Analytics',
      icon: 'fa-chart-simple',
      group: 'Administration',
      expanded: false,
      children: [
        {
          label: 'Platform Reports',
          icon: 'fa-building',
          route: '/platform-reports',
          group: 'Administration'
        },
        {
          label: 'Company Reports',
          icon: 'fa-building',
          route: '/company-reports',
          group: 'Administration'
        },
        {
          label: 'Revenue Reports',
          icon: 'fa-building',
          route: '/revenue-reports',
          group: 'Administration'
        },
        {
          label: 'Subscription Reports',
          icon: 'fa-building',
          route: '/subscription-reports',
          group: 'Administration'
        },
        
        {
          label: 'Audit Reports',
          icon: 'fa-building',
          route: '/audit-reports',
          group: 'Administration'
        },
        {
          label: 'Custom Reports',
          icon: 'fa-building',
          route: '/custom-reports',
          group: 'Administration'
        },
      ]
    },
    {
      label: 'System Settings',
      icon: 'fa-screwdriver-wrench',
      group: 'Administration',
      expanded: false,
      children: [
        {
          label: 'General Settings',
          icon: 'fa-sliders',
          route: '/general-settings',
          group: 'Administration'
        },
        {
          label: 'Branding',
          icon: 'fa-building',
          route: '/brands',
          group: 'Administration'
        },
        {
          label: 'Localization',
          icon: 'fa-building',
          route: '/localization',
          group: 'Administration'
        },
        {
          label: 'Time Zones',
          icon: 'fa-building',
          route: '/time-zones',
          group: 'Administration'
        },
        {
          label: 'Currency',
          icon: 'fa-building',
          route: '/currency',
          group: 'Administration'
        },
        {
          label: 'Fiscal Year',
          icon: 'fa-building',
          route: '/fiscal-year',
          group: 'Administration'
        },
        {
          label: 'Number Formats',
          icon: 'fa-building',
          route: '/number-formats',
          group: 'Administration'
        },

        {
          label: 'File Storage',
          icon: 'fa-building',
          route: '/file-storage',
          group: 'Administration'
        },

        {
          label: 'License',
          icon: 'fa-building',
          route: '/license',
          group: 'Administration'
        },
        {
          label: 'file Upload Document',
          icon: 'fa-building',
          route: '/fileupload-document',
          group: 'Administration'
        },
      ]
    },
    {
      label: 'Setup',
      icon: 'fa-gears',
      route: '/master-data',
      group: 'Setup',

    }

  ];
  companyAdminMenus: SidebarMenu[] = [
    {
      label: 'Dashboard',
      icon: 'fa-chart-line',
      route: '/dashboard',
      group: 'CRM'
    },
    {
      label: 'Organization',
      icon: 'fa-building',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'Company Profile', icon: 'fa-building-user', route: '/company-profile', group: 'CRM' },
        { label: 'Branches', icon: 'fa-code-branch', route: '/branches', group: 'CRM' },
        { label: 'Business Units', icon: 'fa-sitemap', route: '/business-units', group: 'CRM' },
        { label: 'Departments', icon: 'fa-users-rectangle', route: '/departments', group: 'CRM' },
        { label: 'Designations', icon: 'fa-id-badge', route: '/designations', group: 'CRM' },
        { label: 'Teams', icon: 'fa-people-group', route: '/teams', group: 'CRM' },
        { label: 'Territories', icon: 'fa-map-location-dot', route: '/territories', group: 'CRM' },
        { label: 'Business Hours', icon: 'fa-business-time', route: '/business-hours', group: 'CRM' },
        { label: 'Holiday Calendar', icon: 'fa-calendar-days', route: '/holiday-calendar', group: 'CRM' }
      ]
    },
    {
      label: 'User & Access Management',
      icon: 'fa-users',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'Users', icon: 'fa-user', route: '/users', group: 'CRM' },
        // { label: 'Roles', icon: 'fa-user-tag', route: '/roles', group: 'CRM' },
        { label: 'Roles & Permissions', icon: 'fa-key', route: '/roles-permissions', group: 'CRM' },
        { label: 'Menu Access', icon: 'fa-bars', route: '/menu-access', group: 'CRM' },
        { label: 'User Groups', icon: 'fa-users-viewfinder', route: '/user-groups', group: 'CRM' },
        { label: 'Access Policies', icon: 'fa-shield-halved', route: '/access-policies', group: 'CRM' },
        { label: 'Inherited', icon: 'fa-share-nodes', route: '/inherited', group: 'CRM' },
        { label: 'User Limit', icon: 'fa-user-check', route: '/user-limit', group: 'CRM' },
        { label: 'License', icon: 'fa-certificate', route: '/license', group: 'CRM' },
        { label: 'Password Policy', icon: 'fa-lock', route: '/password-policy', group: 'CRM' }
      ]
    },
    {
      label: 'CRM Configuration',
      icon: 'fa-sliders',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'Lead Settings', icon: 'fa-filter', route: '/lead-settings', group: 'CRM' },
        { label: 'Pipeline Settings', icon: 'fa-chart-line', route: '/pipeline-settings', group: 'CRM' },
        { label: 'Opportunity Stages', icon: 'fa-list-ol', route: '/opportunity-stages', group: 'CRM' },
        { label: 'Activity Types', icon: 'fa-list', route: '/activity-types', group: 'CRM' },
        { label: 'Lead Sources', icon: 'fa-bullhorn', route: '/lead-sources', group: 'CRM' },
        { label: 'Industries', icon: 'fa-industry', route: '/industries', group: 'CRM' },
        { label: 'Territories', icon: 'fa-earth-asia', route: '/territories', group: 'CRM' },
        { label: 'Sales Targets', icon: 'fa-bullseye', route: '/salestargets', group: 'CRM' },
        { label: 'Number Series', icon: 'fa-hashtag', route: '/number-series', group: 'CRM' },
        { label: 'Custom Fields', icon: 'fa-table-columns', route: '/custom-fields', group: 'CRM' }
      ]
    },
    {
      label: 'CRM Operations',
      icon: 'fa-briefcase',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'Leads', icon: 'fa-user-plus', route: '/leads', group: 'CRM' },
        { label: 'Leads Create', icon: 'fa-user-plus', route: '/leads-create', group: 'CRM' },
        { label: 'Accounts', icon: 'fa-building', route: '/accounts', group: 'CRM' },
        { label: 'Contacts', icon: 'fa-address-book', route: '/contacts', group: 'CRM' },
        { label: 'Opportunities', icon: 'fa-handshake', route: '/opportunities', group: 'CRM' },
        { label: 'Products', icon: 'fa-box', route: '/products', group: 'CRM' },
        { label: 'Price Books', icon: 'fa-book', route: '/price-books', group: 'CRM' },
        { label: 'Quotations', icon: 'fa-file-invoice', route: '/quotations', group: 'CRM' },
        { label: 'Sales Orders', icon: 'fa-cart-shopping', route: '/orders', group: 'CRM' },
        { label: 'Customer Invoices', icon: 'fa-file-invoice-dollar', route: '/invoice-sales', group: 'CRM' },
        { label: 'Customer Payments', icon: 'fa-money-check-dollar', route: '/payments', group: 'CRM' },
        { label: 'Contracts', icon: 'fa-file-signature', route: '/contracts', group: 'CRM' }
      ]
    },
    {
      label: 'Activities',
      icon: 'fa-calendar-days',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'Calendar', icon: 'fa-calendar', route: '/calendar', group: 'CRM' },
        { label: 'Tasks', icon: 'fa-list-check', route: '/tasks', group: 'CRM' },
        { label: 'Meetings', icon: 'fa-handshake', route: '/meetings', group: 'CRM' },
        { label: 'Calls', icon: 'fa-phone', route: '/calls', group: 'CRM' },
        { label: 'Emails', icon: 'fa-envelope', route: '/emails', group: 'CRM' },
        { label: 'Notes', icon: 'fa-note-sticky', route: '/notes', group: 'CRM' },
        // { label: 'Reminders', icon: 'fa-bell', route: '/reminders', group: 'CRM' }
      ]
    },
    {
      label: 'Marketing',
      icon: 'fa-bullhorn',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'Campaigns', icon: 'fa-bullhorn', route: '/campaigns', group: 'CRM' },
        { label: 'Email Campaigns', icon: 'fa-envelope', route: '/email-campaigns', group: 'CRM' },
        { label: 'SMS Campaigns', icon: 'fa-comment-sms', route: '/sms-campaigns', group: 'CRM' },
        { label: 'WhatsApp Campaigns', icon: 'fa-comments', route: '/whatsapp-campaigns', group: 'CRM' },
        { label: 'Marketing Lists', icon: 'fa-list', route: '/marketing-lists', group: 'CRM' }
      ]
    },

    {
      label: 'Customer Service',
      icon: 'fa-headset',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'Tickets', icon: 'fa-ticket', route: '/tickets', group: 'CRM' },
        { label: 'Ticket Categories', icon: 'fa-tags', route: '/ticket-categories', group: 'CRM' },
        { label: 'Knowledge Base', icon: 'fa-book-open', route: '/knowledge-base', group: 'CRM' },
        { label: 'FAQs', icon: 'fa-circle-question', route: '/faqs', group: 'CRM' }
      ]
    },

    {
      label: 'Projects',
      icon: 'fa-diagram-project',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'Projects', icon: 'fa-folder', route: '/projects', group: 'CRM' },
        { label: 'Milestones', icon: 'fa-flag-checkered', route: '/milestones', group: 'CRM' },
        { label: 'Tasks', icon: 'fa-list-check', route: '/project-tasks', group: 'CRM' },
        { label: 'Project Documents', icon: 'fa-file-lines', route: '/project-documents', group: 'CRM' },
        { label: 'Timesheets', icon: 'fa-clock', route: '/timesheet', group: 'CRM' }
      ]
    },
    // {
    //   label: 'Documents',
    //   icon: 'fa-folder-open',
    //   group: 'CRM',
    //   expanded: false,
    //   children: [
    //     { label: 'Document Library', icon: 'fa-folder-open', route: '/document-library', group: 'CRM' },
    //     { label: 'Document Categories', icon: 'fa-folder-tree', route: '/document-categories', group: 'CRM' },
    //     { label: 'Folders', icon: 'fa-folder', route: '/folders', group: 'CRM' },
    //     { label: 'Version History', icon: 'fa-clock-rotate-left', route: '/version-history', group: 'CRM' },
    //     { label: 'Sharing', icon: 'fa-share-nodes', route: '/sharing', group: 'CRM' }
    //   ]
    // },
    {
      label: 'Workflow & Automation',
      icon: 'fa-code-branch',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'Workflow Rules', icon: 'fa-gears', route: '/workflow-rules', group: 'CRM' },
        { label: 'Approval Workflow', icon: 'fa-check-double', route: '/approval-workflow', group: 'CRM' },
        { label: 'Auto Assignment', icon: 'fa-user-check', route: '/auto-assignment', group: 'CRM' },
        { label: 'Escalation Rules', icon: 'fa-arrow-up-right-dots', route: '/escalation-rules', group: 'CRM' },
        { label: 'SLA Rules', icon: 'fa-stopwatch', route: '/sla-rules', group: 'CRM' },
        { label: 'Email Automation', icon: 'fa-envelope-open-text', route: '/email-automation', group: 'CRM' }
      ]
    },
    {
      label: 'Communication',
      icon: 'fa-comments',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'Email Templates', icon: 'fa-envelope', route: '/email-notification', group: 'CRM' },
        { label: 'SMS Templates', icon: 'fa-comment', route: '/sms-notification', group: 'CRM' },
        { label: 'WhatsApp Templates', icon: 'fa-comments', route: '/whatsapp-notification', group: 'CRM' },
        { label: 'Push Notifications', icon: 'fa-bell', route: '/push-notification', group: 'CRM' },
        { label: 'Notification Rules', icon: 'fa-sliders', route: '/notification-rules', group: 'CRM' }
      ]
    },
    {
      label: 'Integrations',
      icon: 'fa-plug',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'API Tokens', icon: 'fa-key', route: '/api-tokens', group: 'CRM' },
        { label: 'Company Webhooks', icon: 'fa-link', route: '/company-webhooks', group: 'CRM' },
        { label: 'Gmail Integration', icon: 'fa-envelope', route: '/gmail-integration', group: 'CRM' },
        { label: 'Outlook Integration', icon: 'fa-envelope-open', route: '/outlook-integration', group: 'CRM' },
        { label: 'Google Calendar', icon: 'fa-calendar', route: '/calendar', group: 'CRM' },
        { label: 'Microsoft Teams', icon: 'fa-users', route: '/microsoft-teams', group: 'CRM' },
        { label: 'Zoom', icon: 'fa-video', route: '/zoom', group: 'CRM' }
      ]
    },
    {
      label: 'Security',
      icon: 'fa-shield-halved',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'Login Sessions', icon: 'fa-right-to-bracket', route: '/login-sessions', group: 'CRM' },
        { label: 'MFA', icon: 'fa-mobile-screen-button', route: '/mfa', group: 'CRM' },
        { label: 'IP Restrictions', icon: 'fa-network-wired', route: '/ip-restrictions', group: 'CRM' },
        { label: 'Device Management', icon: 'fa-laptop', route: '/device-management', group: 'CRM' },
        { label: 'Security Logs', icon: 'fa-file-shield', route: '/security-logs', group: 'CRM' }
      ]
    },
    // {
    //   label: 'Reports & Analytics',
    //   icon: 'fa-chart-column',
    //   group: 'CRM',
    //   expanded: false,
    //   children: [
    //     { label: 'Dashboard Reports', icon: 'fa-chart-pie', route: '/dashboard-reports', group: 'CRM' },
    //     { label: 'Lead Reports', icon: 'fa-user-plus', route: '/lead-reports', group: 'CRM' },
    //     { label: 'Opportunity Reports', icon: 'fa-handshake', route: '/opportunity-reports', group: 'CRM' },
    //     { label: 'Sales Reports', icon: 'fa-chart-line', route: '/sales-reports', group: 'CRM' },
    //     { label: 'Customer Reports', icon: 'fa-users', route: '/customer-reports', group: 'CRM' },
    //     { label: 'Product Reports', icon: 'fa-box', route: '/product-reports', group: 'CRM' },
    //     { label: 'Marketing Reports', icon: 'fa-bullhorn', route: '/marketing-reports', group: 'CRM' },
    //     { label: 'Support Reports', icon: 'fa-headset', route: '/support-reports', group: 'CRM' },
    //     { label: 'Employee Reports', icon: 'fa-user-tie', route: '/employee-reports', group: 'CRM' },
    //     { label: 'Audit Reports', icon: 'fa-clipboard-check', route: '/audit-reports', group: 'CRM' },
    //     { label: 'Custom Reports', icon: 'fa-file-export', route: '/custom-reports', group: 'CRM' }
    //   ]
    // },
    {
      label: 'Company Settings',
      icon: 'fa-gears',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'General Settings', icon: 'fa-sliders', route: '/general-settings', group: 'CRM' },
        { label: 'Branding', icon: 'fa-palette', route: '/brands', group: 'CRM' },
        { label: 'Localization', icon: 'fa-globe', route: '/localization', group: 'CRM' },
        { label: 'Time Zone', icon: 'fa-clock', route: '/time-zones', group: 'CRM' },
        { label: 'Currency', icon: 'fa-dollar-sign', route: '/currency', group: 'CRM' },
        { label: 'Fiscal Year', icon: 'fa-calendar-week', route: '/fiscal-year', group: 'CRM' },
        { label: 'Number Formats', icon: 'fa-hashtag', route: '/number-formats', group: 'CRM' }
      ]
    },
    {
      label: 'File Management',
      icon: 'fa-folder-tree',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'File Upload Settings', icon: 'fa-upload', route: '/file-upload-settings', group: 'CRM' },
        { label: 'Document Categories', icon: 'fa-folder', route: '/document-categories', group: 'CRM' },
        { label: 'Storage Usage', icon: 'fa-hard-drive', route: '/storage-usage', group: 'CRM' }
      ]
    },
    {
      label: 'Audit & Monitoring',
      icon: 'fa-clipboard-list',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'Audit Logs', icon: 'fa-clipboard-check', route: '/audit-logs', group: 'CRM' },
        { label: 'Login History', icon: 'fa-clock-rotate-left', route: '/login-history', group: 'CRM' },
        { label: 'API Usage Logs', icon: 'fa-code', route: '/api-usage-logs', group: 'CRM' },
        { label: 'Error Logs', icon: 'fa-triangle-exclamation', route: '/error-logs', group: 'CRM' },
        { label: 'User Activities', icon: 'fa-user-clock', route: '/user-activities', group: 'CRM' }
      ]
    },
     {
      label: 'Profile',
      icon: 'fa-user-circle',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'My Profile', icon: 'fa-id-card', route: '/profile', group: 'CRM' },
        // { label: 'Change Password', icon: 'fa-key', route: '/change-password', group: 'CRM' },
       { label: 'Sessions', icon: 'fa-laptop', route: '/sessions', group: 'CRM' },
       { label: 'Multi-Factor Authentication', icon: 'fa-shield-halved', route: '/my-mfa', group: 'CRM' }
      ]
    }

  ];
  userMenus: SidebarMenu[] = [

    // =====================================================
    // Dashboard
    // =====================================================
    {
      label: 'Dashboard',
      icon: 'fa-chart-line',
      route: '/dashboard',
      group: 'CRM'
    },

    // =====================================================
    // CRM
    // =====================================================
    {
      label: 'CRM',
      icon: 'fa-users',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'Leads', icon: 'fa-user-plus', route: '/leads', group: 'CRM' },
          { label: 'Leads Create', icon: 'fa-user-plus', route: '/leads-create', group: 'CRM' },
          { label: 'Leads List', icon: 'fa-list', route: '/leads-list', group: 'CRM' },
          { label: 'Leads Details', icon: 'fa-user', route: '/leads-details', group: 'CRM' },
        { label: 'Accounts', icon: 'fa-building', route: '/accounts', group: 'CRM' },
        { label: 'Contacts', icon: 'fa-address-book', route: '/contacts', group: 'CRM' },
        { label: 'Opportunities', icon: 'fa-handshake', route: '/opportunities', group: 'CRM' }
      ]
    },

    // =====================================================
    // Sales
    // =====================================================
    {
      label: 'Sales',
      icon: 'fa-cart-shopping',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'Quotations', icon: 'fa-file-signature', route: '/quotations', group: 'CRM' },
        { label: 'Orders', icon: 'fa-cart-arrow-down', route: '/orders', group: 'CRM' },
        { label: 'Invoices', icon: 'fa-file-invoice-dollar', route: '/invoice-sales', group: 'CRM' },
        { label: 'Payments', icon: 'fa-credit-card', route: '/payments', group: 'CRM' },
        { label: 'Products', icon: 'fa-box-open', route: '/products', group: 'CRM' }
      ]
    },

    // =====================================================
    // Activities
    // =====================================================
    {
      label: 'Activities',
      icon: 'fa-calendar-days',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'Calendar', icon: 'fa-calendar', route: '/calendar', group: 'CRM' },
        { label: 'Tasks', icon: 'fa-list-check', route: '/tasks', group: 'CRM' },
        { label: 'Meetings', icon: 'fa-handshake', route: '/meetings', group: 'CRM' },
        { label: 'Calls', icon: 'fa-phone', route: '/calls', group: 'CRM' },
        { label: 'Emails', icon: 'fa-envelope', route: '/emails', group: 'CRM' },
        { label: 'Notes', icon: 'fa-note-sticky', route: '/notes', group: 'CRM' }
      ]
    },

    // =====================================================
    // Marketing
    // =====================================================
    {
      label: 'Marketing',
      icon: 'fa-bullhorn',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'Campaigns', icon: 'fa-bullhorn', route: '/campaigns', group: 'CRM' },
        { label: 'Email Campaigns', icon: 'fa-envelope-open-text', route: '/email-campaigns', group: 'CRM' },
        { label: 'SMS Campaigns', icon: 'fa-comment-sms', route: '/sms-campaigns', group: 'CRM' },
        { label: 'WhatsApp Campaigns', icon: 'fa-brands fa-whatsapp', route: '/whatsapp-campaigns', group: 'CRM' }
      ]
    },

    // =====================================================
    // Communication
    // =====================================================
    {
      label: 'Communication',
      icon: 'fa-comments',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'Email', icon: 'fa-envelope', route: '/email', group: 'CRM' },
        { label: 'WhatsApp', icon: 'fa-brands fa-whatsapp', route: '/whatsapp', group: 'CRM' },
        { label: 'SMS', icon: 'fa-comment-dots', route: '/sms', group: 'CRM' }
      ]
    },

    // =====================================================
    // Customer Service
    // =====================================================
    {
      label: 'Customer Service',
      icon: 'fa-headset',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'Tickets', icon: 'fa-ticket', route: '/tickets', group: 'CRM' },
        { label: 'Knowledge Base', icon: 'fa-book', route: '/knowledge-base', group: 'CRM' }
      ]
    },

    // =====================================================
    // Projects
    // =====================================================
    {
      label: 'Projects',
      icon: 'fa-diagram-project',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'Projects', icon: 'fa-folder', route: '/projects', group: 'CRM' },
        { label: 'Milestones', icon: 'fa-flag-checkered', route: '/milestones', group: 'CRM' },
        { label: 'Tasks', icon: 'fa-list-check', route: '/project-tasks', group: 'CRM' },
        { label: 'Documents', icon: 'fa-folder-open', route: '/project-documents', group: 'CRM' }
      ]
    },

    // =====================================================
    // Documents
    // =====================================================
    {
      label: 'Documents',
      icon: 'fa-folder-open',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'My Documents', icon: 'fa-file', route: '/my-documents', group: 'CRM' },
        { label: 'Shared Documents', icon: 'fa-share-nodes', route: '/shared-documents', group: 'CRM' }
      ]
    },

    // =====================================================
    // Reports
    // =====================================================
    {
      label: 'Reports',
      icon: 'fa-chart-column',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'My Reports', icon: 'fa-chart-pie', route: '/my-reports', group: 'CRM' },
        { label: 'Team Reports', icon: 'fa-users', route: '/team-reports', group: 'CRM' }
      ]
    },

    // =====================================================
    // Profile
    // =====================================================
    {
      label: 'Profile',
      icon: 'fa-user-circle',
      group: 'CRM',
      expanded: false,
      children: [
        { label: 'My Profile', icon: 'fa-id-card', route: '/profile', group: 'CRM' },
        // { label: 'Change Password', icon: 'fa-key', route: '/change-password', group: 'CRM' },
       { label: 'Sessions', icon: 'fa-laptop', route: '/sessions', group: 'CRM' },
       { label: 'Multi-Factor Authentication', icon: 'fa-shield-halved', route: '/my-mfa', group: 'CRM' }
      ]
    }

  ];

  get menuGroups() {

    const groups = new Map<string, SidebarMenu[]>();

    this.menus.forEach(menu => {

      if (!groups.has(menu.group)) {
        groups.set(menu.group, []);
      }

      groups.get(menu.group)?.push(menu);

    });

    return Array.from(groups.entries()).map(([heading, menus]) => ({
      heading,
      menus
    }));

  }

  // onMenuClick(menu: SidebarMenu) {

  //   if (menu.children?.length) {

  //     menu.expanded = !menu.expanded;
  //     return;

  //   }

  //   if (menu.route) {

  //     this.router.navigate([menu.route]);

  //   }

  // }
  onMenuClick(menu: SidebarMenu) {

    if (menu.children && menu.children.length > 0) {

      menu.expanded = !menu.expanded;
      return;

    }

    if (menu.route) {

      this.router.navigate([menu.route]);

    }

  }

  onChildClick(menu: SidebarMenu) {

    if (menu.route) {

      this.router.navigate([menu.route]);

    }

  }

}
