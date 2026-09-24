import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Router,RouterLinkActive, RouterLink ,RouterOutlet} from '@angular/router';
import { AuthService } from '../../core/authentication/services/auth.service';
import { AuthMenu } from '../../core/authentication/models/login-response.model';
import { Sidebar } from './sidebar/sidebar';
import { Header } from './header/header';

interface CrmMenuItem {
  label: string;
  icon: string;
  route?: string;
  expanded?: boolean;
  active?: boolean;
  children?: CrmMenuItem[];
}

// A module in the top nav, built from the menus assigned to the user's role.
interface TopNavModule {
  id: number;
  label: string;
  icon: string;
  route?: string;
  children: { label: string; icon: string; route: string }[];
}

interface CrmMenuGroup {
  heading: string;
  menus: CrmMenuItem[];
}

@Component({
  selector: 'app-admin-layout',
   imports: [
    NgClass,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    Sidebar,
    Header
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  /* =========================================================
     SIDEBAR
  ========================================================= */

  isCollapsed = false;

  /* =========================================================
     ADMIN / SUPER ADMIN CONSOLE MODE

     Admin and Super Admin use the role-aware Sidebar + Header
     for navigation instead of the CRM top-nav below, which
     stays exactly as-is for the regular User role.
  ========================================================= */

  consoleSidebarCollapsed = false;

  get isConsoleRole(): boolean {

    const layout = this.authService.getUserLayout();

    return layout === 'admin' || layout === 'super admin';

  }

  onConsoleSidebarToggle(collapsed: boolean): void {

    this.consoleSidebarCollapsed = collapsed;

  }


  /* =========================================================
     ROLE-BASED TOP NAV (User layout)

     The login API sends the modules/screens assigned to the
     user's role. When present they replace the default top
     nav; otherwise the default nav is kept.
  ========================================================= */

  openModuleId: number | null = null;

  get topNavModules(): TopNavModule[] | null {

    const menus = this.authService.getCurrentUser()?.menus;

    if (!Array.isArray(menus) || menus.length === 0) {

      return null;

    }

    const toRoute = (url?: string | null): string | undefined =>
      url ? (url.startsWith('/') ? url : '/' + url) : undefined;

    const ids = new Set(menus.map((x: AuthMenu) => x.menuId));

    return menus
      .filter((x: AuthMenu) => !x.parentMenuId || !ids.has(x.parentMenuId))
      .map((m: AuthMenu) => ({
        id: m.menuId,
        label: m.menuName,
        icon: m.icon || 'fa-circle',
        route: toRoute(m.url),
        children: menus
          .filter((c: AuthMenu) => c.parentMenuId === m.menuId)
          .map((c: AuthMenu) => ({
            label: c.menuName,
            icon: c.icon || 'fa-circle',
            route: toRoute(c.url) || ''
          }))
      }));

  }

  // Module whose screens the secondary bar shows: the one owning the
  // current page, else the last one clicked, else the first with screens.
  selectedModuleId: number | null = null;

  get activeModule(): TopNavModule | null {

    const modules = this.topNavModules;

    if (!modules) {

      return null;

    }

    const url = this.router.url.split('?')[0];

    return (
      modules.find(m => m.children.some(c => c.route && url.startsWith(c.route))) ||
      modules.find(m => m.id === this.selectedModuleId) ||
      modules.find(m => m.children.length > 0) ||
      null
    );

  }

  onModuleClick(module: TopNavModule): void {

    this.selectedModuleId = module.id;

    if (module.children.length > 0) {

      this.openModuleId = this.openModuleId === module.id ? null : module.id;

      return;

    }

    this.openModuleId = null;

    if (module.route) {

      this.router.navigateByUrl(module.route);

    }

  }

  onSubModuleClick(route: string): void {

    this.openModuleId = null;

    if (route) {

      this.router.navigateByUrl(route);

    }

  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {

    if (this.openModuleId !== null &&
        !this.host.nativeElement.querySelector('.top-menu')?.contains(event.target as Node)) {

      this.openModuleId = null;

    }

  }


  /* =========================================================
     USER INFORMATION - STATIC
  ========================================================= */

  // Logged-in user, from the login response.
  get userName(): string {

    const user = this.authService.getCurrentUser();

    return user?.fullName || user?.userName || '';

  }

  get userRole(): string {

    return this.authService.getCurrentUser()?.role || '';

  }

  get initials(): string {

    const parts = this.userName
      .split(/[\s@._-]+/)
      .filter(part => part.length > 0);

    return parts
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');

  }


  /* =========================================================
     HEADER INFORMATION
  ========================================================= */

  systemStatus = 'Active';

  lastUpdate = 'Just now';

  pipelineValue = '$500,000';

  notificationCount = 3;

  messageCount = 2;


  /* =========================================================
     SEARCH
  ========================================================= */

  searchText = '';


  /* =========================================================
     MENU
  ========================================================= */

  menuGroups: CrmMenuGroup[] = [

    /* =======================================================
       OVERVIEW
    ======================================================= */

    {
      heading: 'OVERVIEW',

      menus: [

        {
          label: 'Dashboard',
          icon: 'fa-chart-pie',
          route: '/crm/dashboard',
          active: true
        }

      ]
    },


    /* =======================================================
       CRM
    ======================================================= */

    {
      heading: 'CRM',

      menus: [

        {
          label: 'Leads',
          icon: 'fa-user-plus',
          route: '/crm/leads'
        },

        {
          label: 'Accounts',
          icon: 'fa-building',
          route: '/crm/accounts'
        },

        {
          label: 'Contacts',
          icon: 'fa-address-book',
          route: '/crm/contacts'
        },

        {
          label: 'Opportunities',
          icon: 'fa-bullseye',
          route: '/crm/opportunities'
        },

        {
          label: 'Campaigns',
          icon: 'fa-bullhorn',
          route: '/crm/campaigns'
        },

        {
          label: 'Pipelines',
          icon: 'fa-filter',
          route: '/crm/pipelines'
        }

      ]
    },


    /* =======================================================
       SALES
    ======================================================= */

    {
      heading: 'SALES',

      menus: [

        {
          label: 'Quotations',
          icon: 'fa-file-invoice',
          expanded: false,

          children: [

            {
              label: 'All Quotations',
              icon: 'fa-list',
              route: '/crm/quotations'
            },

            {
              label: 'Pending',
              icon: 'fa-clock',
              route: '/crm/quotations/pending'
            },

            {
              label: 'Approved',
              icon: 'fa-circle-check',
              route: '/crm/quotations/approved'
            }

          ]
        },


        {
          label: 'Orders',
          icon: 'fa-cart-shopping',
          route: '/crm/orders'
        },


        {
          label: 'Invoices',
          icon: 'fa-file-invoice-dollar',
          expanded: false,

          children: [

            {
              label: 'All Invoices',
              icon: 'fa-list',
              route: '/crm/invoices'
            },

            {
              label: 'Pending',
              icon: 'fa-clock',
              route: '/crm/invoices/pending'
            },

            {
              label: 'Paid',
              icon: 'fa-circle-check',
              route: '/crm/invoices/paid'
            },

            {
              label: 'Overdue',
              icon: 'fa-triangle-exclamation',
              route: '/crm/invoices/overdue'
            }

          ]
        },


        {
          label: 'Payments',
          icon: 'fa-credit-card',
          route: '/crm/payments'
        },


        {
          label: 'Products',
          icon: 'fa-box-open',
          route: '/crm/products'
        },


        {
          label: 'Discounts',
          icon: 'fa-tags',
          route: '/crm/discounts'
        },


        {
          label: 'Dispatch',
          icon: 'fa-truck-fast',
          route: '/crm/dispatch'
        }

      ]
    },


    /* =======================================================
       ACTIVITIES
    ======================================================= */

    {
      heading: 'ACTIVITIES',

      menus: [

        {
          label: 'Calendar',
          icon: 'fa-calendar-days',
          route: '/crm/calendar'
        },

        {
          label: 'Tasks',
          icon: 'fa-list-check',
          route: '/crm/tasks'
        },

        {
          label: 'Meetings',
          icon: 'fa-users',
          route: '/crm/meetings'
        },

        {
          label: 'Calls',
          icon: 'fa-phone',
          route: '/crm/calls'
        },

        {
          label: 'Emails',
          icon: 'fa-envelope',
          route: '/crm/emails'
        },

        {
          label: 'Follow Ups',
          icon: 'fa-clock-rotate-left',
          route: '/crm/follow-ups'
        },

        {
          label: 'Notes',
          icon: 'fa-note-sticky',
          route: '/crm/notes'
        }

      ]
    },


    /* =======================================================
       ANALYTICS
    ======================================================= */

    {
      heading: 'ANALYTICS',

      menus: [

        {
          label: 'Reports',
          icon: 'fa-chart-column',
          expanded: false,

          children: [

            {
              label: 'Sales Report',
              icon: 'fa-chart-line',
              route: '/crm/reports/sales'
            },

            {
              label: 'Lead Report',
              icon: 'fa-user-plus',
              route: '/crm/reports/leads'
            },

            {
              label: 'Revenue Report',
              icon: 'fa-money-bill-trend-up',
              route: '/crm/reports/revenue'
            },

            {
              label: 'Activity Report',
              icon: 'fa-chart-simple',
              route: '/crm/reports/activity'
            }

          ]
        },


        {
          label: 'Sales Forecast',
          icon: 'fa-chart-area',
          route: '/crm/sales-forecast'
        },


        {
          label: 'Performance',
          icon: 'fa-gauge-high',
          route: '/crm/performance'
        }

      ]
    },


    /* =======================================================
       ADMINISTRATION
    ======================================================= */

    {
      heading: 'ADMINISTRATION',

      menus: [

        {
          label: 'Users & Teams',
          icon: 'fa-users-gear',
          route: '/crm/users'
        },

        {
          label: 'Roles & Permissions',
          icon: 'fa-user-shield',
          route: '/crm/roles'
        },

        {
          label: 'CRM Settings',
          icon: 'fa-sliders',
          expanded: false,

          children: [

            {
              label: 'General Settings',
              icon: 'fa-gear',
              route: '/crm/settings/general'
            },

            {
              label: 'Email Settings',
              icon: 'fa-envelope',
              route: '/crm/settings/email'
            },

            {
              label: 'Notification Settings',
              icon: 'fa-bell',
              route: '/crm/settings/notifications'
            }

          ]
        }

      ]
    }

  ];


  /* =========================================================
     CONSTRUCTOR
  ========================================================= */

  constructor(
    private router: Router,
    private authService: AuthService,
    private host: ElementRef
  ) {}


  /* =========================================================
     SIDEBAR TOGGLE
  ========================================================= */

  toggleSidebar(): void {

    this.isCollapsed = !this.isCollapsed;

    /*
     * When sidebar is collapsed,
     * close all expanded menus.
     */

    if (this.isCollapsed) {

      this.closeExpandedMenus();

    }

  }


  /* =========================================================
     CLOSE EXPANDED MENUS
  ========================================================= */

  private closeExpandedMenus(): void {

    this.menuGroups.forEach(group => {

      group.menus.forEach(menu => {

        menu.expanded = false;

        if (menu.children) {

          menu.children.forEach(child => {

            child.expanded = false;

          });

        }

      });

    });

  }


  /* =========================================================
     MENU CLICK
  ========================================================= */

  onMenuClick(menu: CrmMenuItem): void {

    /*
     * If menu contains children,
     * open / close submenu.
     */

    if (menu.children && menu.children.length > 0) {

      menu.expanded = !menu.expanded;

      /*
       * Close sibling menus.
       */

      this.closeSiblingMenus(menu);

      return;

    }


    /*
     * Menu without children.
     */

    this.setActiveMenu(menu);


    if (menu.route) {

      this.router.navigateByUrl(menu.route);

    }

  }


  /* =========================================================
     CLOSE SIBLING MENUS
  ========================================================= */

  private closeSiblingMenus(
    selectedMenu: CrmMenuItem
  ): void {

    this.menuGroups.forEach(group => {

      group.menus.forEach(menu => {

        if (menu !== selectedMenu) {

          menu.expanded = false;

        }

      });

    });

  }


  /* =========================================================
     CHILD MENU CLICK
  ========================================================= */

  onChildClick(child: CrmMenuItem): void {

    /*
     * Third level menu
     */

    if (child.children && child.children.length > 0) {

      child.expanded = !child.expanded;

      return;

    }


    this.setActiveMenu(child);


    if (child.route) {

      this.router.navigateByUrl(child.route);

    }

  }


  /* =========================================================
     ACTIVE MENU
  ========================================================= */

  private setActiveMenu(
    selectedMenu: CrmMenuItem
  ): void {

    this.menuGroups.forEach(group => {

      group.menus.forEach(menu => {

        menu.active = false;

        if (menu.children) {

          menu.children.forEach(child => {

            child.active = false;

            if (child.children) {

              child.children.forEach(sub => {

                sub.active = false;

              });

            }

          });

        }

      });

    });


    selectedMenu.active = true;

  }


  /* =========================================================
     SEARCH
  ========================================================= */

  onSearch(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.searchText =
      input.value.trim().toLowerCase();

  }


  /* =========================================================
     MENU FILTER
  ========================================================= */

  isMenuVisible(menu: CrmMenuItem): boolean {

    if (!this.searchText) {

      return true;

    }


    const menuName =
      menu.label.toLowerCase();


    /*
     * Parent matches.
     */

    if (menuName.includes(this.searchText)) {

      return true;

    }


    /*
     * Child matches.
     */

    if (menu.children) {

      return menu.children.some(child =>

        child.label
          .toLowerCase()
          .includes(this.searchText)

      );

    }


    return false;

  }


  /* =========================================================
     NOTIFICATION
  ========================================================= */

  openNotifications(): void {

    console.log('Notifications opened');

  }


  /* =========================================================
     MESSAGES
  ========================================================= */

  openMessages(): void {

    console.log('Messages opened');

  }


  /* =========================================================
     COPY WORKSPACE LINK
  ========================================================= */

  copyWorkspaceLink(): void {

    const url =
      window.location.origin +
      '/crm/dashboard';


    navigator.clipboard
      .writeText(url)
      .then(() => {

        console.log(
          'Workspace link copied'
        );

      })
      .catch(() => {

        console.log(
          'Unable to copy workspace link'
        );

      });

  }


  /* =========================================================
     THEME
  ========================================================= */

  toggleTheme(): void {

    document.body.classList.toggle(
      'crm-dark-mode'
    );

  }


  /* =========================================================
     LOGOUT
  ========================================================= */

  logout(): void {

    /*
     * Static logout.
     * Replace with your authentication service
     * when API integration is added.
     */

    console.log(
      'User logged out'
    );


    this.router.navigateByUrl(
      '/login'
    );

  }


  /* =========================================================
     QUICK ACTIONS
  ========================================================= */

  createLead(): void {

    this.router.navigateByUrl(
      '/crm/leads/create'
    );

  }


  createQuotation(): void {

    this.router.navigateByUrl(
      '/crm/quotations/create'
    );

  }


  createOpportunity(): void {

    this.router.navigateByUrl(
      '/crm/opportunities/create'
    );

  }


  /* =========================================================
     DASHBOARD
  ========================================================= */

  goToDashboard(): void {

    this.router.navigateByUrl(
      '/crm/dashboard'
    );

  }


  /* =========================================================
     PROFILE
  ========================================================= */

  openProfile(): void {

    this.router.navigateByUrl(
      '/crm/profile'
    );

  }
  
}
