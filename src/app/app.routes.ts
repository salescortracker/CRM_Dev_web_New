import { Routes } from '@angular/router';
import { authGuard } from './core/authentication/guards/auth-guard';
import { roleGuard } from './core/authentication/guards/role-guard';


export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password')
        .then(m => m.ForgotPassword)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then(m => m.AdminLayout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard-home/dashboard-home')
            .then(m => m.DashboardHome)
      },
      {
        path: 'admindashboard',
        canActivate: [roleGuard],
        data: { role: 'Admin' },
        loadComponent: () =>
          import('./features/admin/pages/dashboard/admin-dashboard')
            .then(m => m.AdminDashboard)
      },
      {
        path: 'superadmindashboard',
        canActivate: [roleGuard],
        data: { role: 'Super Admin' },
        loadComponent: () =>
          import('./features/crm/super-admin-layout/super-admin-dashboard/super-admin-dashboard')
            .then(m => m.SuperAdminDashboard)
      },
      {
        path: 'company',
        loadComponent: () =>
          import('./features/dashboard/pages/company/company')
            .then(m => m.Company)
      },
      {
        path: 'master-data',
        loadComponent: () =>
          import('./features/super-admin/master-data/master-data')
            .then(m => m.MasterData)
      },

      {
        path: 'region',
        loadComponent: () =>
          import('./features/pages/region/region').then(m => m.Region)
      },
      // {
      //   path: 'menu-access',
      //   canActivate: [roleGuard],
      //   data: { role: 'Super Admin' },
      //   loadComponent: () =>
      //     import('./features/super-admin/menu-access/menu-access')
      //       .then(m => m.MenuAccess)
      // },
      {
        path: 'user',
        canActivate: [roleGuard],
        data: { role: 'Super Admin' },
        loadComponent: () =>
          import('./features/super-admin/users/users')
            .then(m => m.Users)
      },
      {
        path: 'roles',
        loadComponent: () => import('./features/dashboard/pages/roles/roles')
          .then(m => m.Roles)
      },
      {
        path: 'branches',
        loadComponent: () => import('./features/dashboard/pages/organizations/branches/branches')
          .then(m => m.Branches)
      },
      {
        path: 'plans',
        loadComponent: () => import('./features/super-admin/plans/plans')
          .then(m => m.Plans)
      },
      {
        path: 'organizations',
        loadComponent: () => import('./features/super-admin/organizations/organizations')
          .then(m => m.Organizations)
      },

      {
        path: 'subscriptions',
        loadComponent: () => import('./features/super-admin/subscriptions/subscriptions')
          .then(m => m.Subscriptions)
      },
      {
        path: 'audit-logs',
        loadComponent: () => import('./features/super-admin/audit-logs/audit-logs')
          .then(m => m.AuditLogs)
      },
      {
        path: 'login-history',
        loadComponent: () => import('./features/super-admin/login-history/login-history')
          .then(m => m.LoginHistory)
      },
      {
        path: 'api-logs',
        loadComponent: () => import('./features/super-admin/api-logs/api-logs')
          .then(m => m.ApiLogs)
      },
      {
        path: 'error-logs',
        loadComponent: () => import('./features/super-admin/error-logs/error-logs')
          .then(m => m.ErrorLogs)
      },
      {
        path: 'user-activities',
        loadComponent: () => import('./features/super-admin/user-activities/user-activities')
          .then(m => m.UserActivities)
      },
      {
        path: 'login-sessions',
        loadComponent: () => import('./features/super-admin/login-sessions/login-sessions')
          .then(m => m.LoginSessions)
      },
      {
        path: 'backup-recovery',
        loadComponent: () => import('./features/super-admin/backup-recovery/backup-recovery')
          .then(m => m.BackupRecovery)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/super-admin/notifications/notifications')
          .then(m => m.Notifications)
      },
      // {
      //   path: 'email-configuration',
      //   loadComponent: () => import('./features/super-admin/email-configuration/email-configuration')
      //     .then(m => m.EmailConfiguration)
      // },

      {
        path: 'workflow-rules',
        loadComponent: () => import('./features/super-admin/workflow-rules/workflow-rules')
          .then(m => m.WorkflowRules)
      },
      {
        path: 'approval-workflow',
        loadComponent: () => import('./features/super-admin/approval-workflow/approval-workflow')
          .then(m => m.ApprovalWorkflow)
      },
      {
        path: 'auto-assignment',
        loadComponent: () => import('./features/super-admin/auto-assignment/auto-assignment')
          .then(m => m.AutoAssignment)
      },
      {
        path: 'escalation-rules',
        loadComponent: () => import('./features/super-admin/escalation-rules/escalation-rules')
          .then(m => m.EscalationRules)
      },
      {
        path: 'sla-rules',
        loadComponent: () => import('./features/super-admin/sla-rules/sla-rules')
          .then(m => m.SlaRules)
      },
      {
        path: 'email-automation',
        loadComponent: () => import('./features/super-admin/email-automation/email-automation')
          .then(m => m.EmailAutomation)
      },
      {
        path: 'scheduled-jobs',
        loadComponent: () => import('./features/super-admin/scheduled-jobs/scheduled-jobs')
          .then(m => m.ScheduledJobs)
      },
      {
        path: 'password-policy',
        loadComponent: () => import('./features/super-admin/password-policy/password-policy')
          .then(m => m.PasswordPolicy)
      },
      {
        path: 'mfa',
        loadComponent: () => import('./features/super-admin/mfa/mfa')
          .then(m => m.Mfa)
      },
      {
        path: 'ip-restrictions',
        loadComponent: () => import('./features/super-admin/ip-restrictions/ip-restrictions')
          .then(m => m.IpRestrictions)
      },
      {
        path: 'device-management',
        loadComponent: () => import('./features/super-admin/device-management/device-management')
          .then(m => m.DeviceManagement)
      },
      {
        path: 'security-logs',
        loadComponent: () => import('./features/super-admin/security-logs/security-logs')
          .then(m => m.SecurityLogs)
      },
      {
        path: 'email-notification',
        loadComponent: () => import('./features/super-admin/email-notification/email-notification')
          .then(m => m.EmailNotification)
      },
      {
        path: 'sms-notification',
        loadComponent: () => import('./features/super-admin/sms-notification/sms-notification')
          .then(m => m.SmsNotification)
      },

      {
        path: 'whatsapp-notification',
        loadComponent: () => import('./features/super-admin/whatsapp-notification/whatsapp-notification')
          .then(m => m.WhatsappNotification)
      },
      {
        path: 'push-notification',
        loadComponent: () => import('./features/super-admin/push-notifications/push-notifications')
          .then(m => m.PushNotifications)
      },
      {
        path: 'notification-rules',
        loadComponent: () => import('./features/super-admin/notification-rules/notification-rules')
          .then(m => m.NotificationRules)
      },
      {
        path: 'platform-reports',
        loadComponent: () => import('./features/super-admin/platform-reports/platform-reports')
          .then(m => m.PlatformReports)
      },
      {
        path: 'company-reports',
        loadComponent: () => import('./features/super-admin/company-reports/company-reports')
          .then(m => m.CompanyReports)
      },
      {
        path: 'revenue-reports',
        loadComponent: () => import('./features/super-admin/revenue-reports/revenue-reports')
          .then(m => m.RevenueReports)
      },
      {
        path: 'subscription-reports',
        loadComponent: () => import('./features/super-admin/subscription-reports/subscription-reports')
          .then(m => m.SubscriptionReports)
      },
      {
        path: 'user-reports',
        loadComponent: () => import('./features/super-admin/user-reports/user-reports')
          .then(m => m.UserReports)
      },
      {
        path: 'audit-reports',
        loadComponent: () => import('./features/super-admin/audit-reports/audit-reports')
          .then(m => m.AuditReports)
      },
      {
        path: 'custom-reports',
        loadComponent: () => import('./features/super-admin/custom-reports/custom-reports')
          .then(m => m.CustomReports)
      },
      {
        path: 'general-settings',
        loadComponent: () => import('./features/super-admin/general-settings/general-settings')
          .then(m => m.GeneralSettings)
      },
      {
        path: 'brands',
        loadComponent: () => import('./features/super-admin/brands/brands')
          .then(m => m.Brands)
      },
      {
        path: 'localization',
        loadComponent: () => import('./features/super-admin/localization/localization')
          .then(m => m.Localization)
      },
      {
        path: 'time-zones',
        loadComponent: () => import('./features/super-admin/time-zones/time-zones')
          .then(m => m.TimeZones)
      },
      {
        path: 'currency',
        loadComponent: () => import('./features/super-admin/currency/currency')
          .then(m => m.Currency)
      },
      {
        path: 'fiscal-year',
        loadComponent: () => import('./features/super-admin/fiscal-year/fiscal-year')
          .then(m => m.FiscalYear)
      },
      {
        path: 'number-formats',
        loadComponent: () => import('./features/super-admin/number-formats/number-formats')
          .then(m => m.NumberFormats)
      },
      {
        path: 'file-storage',
        loadComponent: () => import('./features/super-admin/file-storage/file-storage')
          .then(m => m.FileStorage)
      },
      {
        path: 'license',
        loadComponent: () => import('./features/super-admin/license/license')
          .then(m => m.License)
      },
      {
        path: 'fileupload-document',
        loadComponent: () => import('./features/super-admin/fileupload-document/fileupload-document')
          .then(m => m.FileuploadDocument)
      },

      {
        path: 'company-administrators',
        loadComponent: () => import('./features/super-admin/organizations-management/company-administrators/company-administrators')
          .then(m => m.CompanyAdministrators)
      },
      {
        path: 'business-units',
        loadComponent: () => import('./features/super-admin/organizations-management/business-units/business-units')
          .then(m => m.BusinessUnits)
      },
      {
        path: 'company-settings',
        loadComponent: () => import('./features/super-admin/organizations-management/company-settings/company-settings')
          .then(m => m.CompanySettings)
      },
      {
        path: 'payment-tracking',
        loadComponent: () => import('./features/super-admin/subscription-management/payment-tracking/payment-tracking')
          .then(m => m.PaymentTracking)
      },
      {
        path: 'billing',
        loadComponent: () => import('./features/super-admin/subscription-management/billing/billing')
          .then(m => m.Billing)
      },
      {
        path: 'invoices',
        loadComponent: () => import('./features/super-admin/subscription-management/invoices/invoices')
          .then(m => m.Invoices)
      },
      {
        path: 'coupons-discounts',
        loadComponent: () => import('./features/super-admin/subscription-management/coupons-discounts/coupons-discounts')
          .then(m => m.CouponsDiscounts)
      },
      {
        path: 'departments',
        loadComponent: () => import('./features/super-admin/users-and-access-management/departments/departments')
          .then(m => m.Departments)
      },
      {
        path: 'designations',
        loadComponent: () => import('./features/super-admin/users-and-access-management/designations/designations')
          .then(m => m.Designations)
      },
      {
        path: 'menu-access',
        loadComponent: () => import('./features/super-admin/users-and-access-management/menu-access/menu-access')
          .then(m => m.MenuAccess)
      },
      {
        path: 'roles-permissions',
        loadComponent: () => import('./features/super-admin/users-and-access-management/roles-permissions/roles-permissions')
          .then(m => m.RolesPermissions)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/super-admin/users/users')
          .then(m => m.Users)
      },
      {
        path: 'teams',
        loadComponent: () => import('./features/super-admin/users-and-access-management/teams/teams')
          .then(m => m.Teams)
      },
      {
        path: 'access-policies',
        loadComponent: () => import('./features/super-admin/users-and-access-management/access-policies/access-policies')
          .then(m => m.AccessPolicies)
      },

      {
        path: 'lead-settings',
        loadComponent: () => import('./features/super-admin/crm-module-configuration/lead-settings/lead-settings')
          .then(m => m.LeadSettings)
      },
      {
        path: 'pipeline-settings',
        loadComponent: () => import('./features/super-admin/crm-module-configuration/pipeline-settings/pipeline-settings')
          .then(m => m.PipelineSettings)
      },
      {
        path: 'opportunity-stages',
        loadComponent: () => import('./features/super-admin/crm-module-configuration/opportunity-stages/opportunity-stages')
          .then(m => m.OpportunityStages)
      },
      {
        path: 'activity-types',
        loadComponent: () => import('./features/super-admin/crm-module-configuration/activity-types/activity-types')
          .then(m => m.ActivityTypes)
      },
      {
        path: 'sources',
        loadComponent: () => import('./features/super-admin/crm-module-configuration/sources/sources')
          .then(m => m.Sources)
      },
      {
        path: 'industries',
        loadComponent: () => import('./features/super-admin/crm-module-configuration/industries/industries')
          .then(m => m.Industries)
      },
      {
        path: 'territories',
        loadComponent: () => import('./features/super-admin/crm-module-configuration/territories/territories')
          .then(m => m.Territories)
      },
      {
        path: 'salestargets',
        loadComponent: () => import('./features/super-admin/crm-module-configuration/salestargets/salestargets')
          .then(m => m.Salestargets)
      },
      {
        path: 'number-series',
        loadComponent: () => import('./features/super-admin/crm-module-configuration/number-series/number-series')
          .then(m => m.NumberSeries)
      },
      {
        path: 'custom-fields',
        loadComponent: () => import('./features/super-admin/crm-module-configuration/custom-fields/custom-fields')
          .then(m => m.CustomFields)
      },
      {
        path: 'email-configuration',
        loadComponent: () => import('./features/super-admin/integration-management/email-configuration/email-configuration')
          .then(m => m.EmailConfiguration)
      },
      {
        path: 'sms-configuration',
        loadComponent: () => import('./features/super-admin/integration-management/sms-configuration/sms-configuration')
          .then(m => m.SmsConfiguration)
      },
      {
        path: 'whatsapp-configuration',
        loadComponent: () => import('./features/super-admin/integration-management/whatsapp-configuration/whatsapp-configuration')
          .then(m => m.WhatsappConfiguration)
      },
      {
        path: 'telephony-configuration',
        loadComponent: () => import('./features/super-admin/integration-management/telephony-configuration/telephony-configuration')
          .then(m => m.TelephonyConfiguration)
      },
      {
        path: 'api-configuration',
        loadComponent: () => import('./features/super-admin/integration-management/api-configuration/api-configuration')
          .then(m => m.ApiConfiguration)
      },
      {
        path: 'webhooks-configuration',
        loadComponent: () => import('./features/super-admin/integration-management/webhooks-configuration/webhooks-configuration')
          .then(m => m.WebhooksConfiguration)
      },
      {
        path: 'third-party-integrations',
        loadComponent: () => import('./features/super-admin/integration-management/third-party-integrations/third-party-integrations')
          .then(m => m.ThirdPartyIntegrations)
      },















      {
        path: 'leads',
        loadComponent: () => import('./features/user/pages/crm/leads/leads')
          .then(m => m.Leads)
      },
         {
        path: 'leads-create',
        loadComponent: () => import('./features/crm/leads-create/leads-create')
          .then(m => m.LeadsCreate)
      },
       {
        path: 'leads-list',
        loadComponent: () => import('./features/crm/lead-list/lead-list')
          .then(m => m.LeadList)
      },
      {
        path: 'leads-details',
        loadComponent: () => import('./features/crm/leads-details/leads-details')
          .then(m => m.LeadsDetails)
      },
       {
        path: 'pipeline',
        loadComponent: () => import('./features/crm/pipeline/pipeline')
          .then(m => m.Pipeline)
      },
      {
        path: 'superadmin',
        loadComponent: () => import('./features/crm/super-admin-layout/super-admin-layout')
          .then(m => m.SuperAdminLayout)
      },

 {
  path: 'prospects',
  loadComponent: () =>
    import('./features/crm/prospects/prospects')
      .then(m => m.Prospects)
},
{
  path: 'company-details',
  loadComponent: () =>
    import('./features/crm/company-details/company-details')
      .then(m => m.CompanyDetails)
},
{
  path: 'company-list',
  loadComponent: () =>
    import('./features/crm/company-list/company-list')
      .then(m => m.CompanyList)
},
{
  path: 'company-create',
  loadComponent: () =>
    import('./features/crm/company-create/company-create')
      .then(m => m.CompanyCreate)
},
{
  path: 'contact-details',
  loadComponent: () =>
    import('./features/crm/contact-details/contact-details')
      .then(m => m.ContactDetails)
},
{
  path: 'contact-list',
  loadComponent: () =>
    import('./features/crm/contact-list/contact-list')
      .then(m => m.ContactList)
},
{
  path: 'contact-create',
  loadComponent: () =>
    import('./features/crm/contact-create/contact-create')
      .then(m => m.ContactCreate)
},
      {
        path: 'accounts',
        loadComponent: () => import('./features/user/pages/accounts/accounts')
          .then(m => m.Accounts)
      },
      {
        path: 'contacts',
        loadComponent: () => import('./features/user/pages/crm/contacts/contacts')
          .then(m => m.Contacts)
      },
      {
        path: 'opportunities',
        loadComponent: () => import('./features/user/pages/crm/opportunities/opportunities')
          .then(m => m.Opportunities)
      },
      {
        path: 'quotations',
        loadComponent: () => import('./features/user/pages/sales/quotations/quotations')
          .then(m => m.Quotations)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/user/pages/sales/orders/orders')
          .then(m => m.Orders)
      },
      {
        path: 'invoice-sales',
        loadComponent: () => import('./features/user/pages/sales/invoice-sales/invoice-sales')
          .then(m => m.InvoiceSales)
      },
      {
        path: 'payments',
        loadComponent: () => import('./features/user/pages/sales/payments/payments')
          .then(m => m.Payments)
      },
      {
        path: 'products',
        loadComponent: () => import('./features/user/pages/sales/products/products')
          .then(m => m.Products)
      },
      {
        path: 'calendar',
        loadComponent: () => import('./features/user/pages/activities/calendar/calendar')
          .then(m => m.Calendar)
      },
      {
        path: 'tasks',
        loadComponent: () => import('./features/user/pages/activities/tasks/tasks')
          .then(m => m.Tasks)
      },
      {
        path: 'meetings',
        loadComponent: () => import('./features/user/pages/activities/meetings/meetings')
          .then(m => m.Meetings)
      },
      {
        path: 'calls',
        loadComponent: () => import('./features/user/pages/activities/calls/calls')
          .then(m => m.Calls)
      },
      {
        path: 'emails',
        loadComponent: () => import('./features/user/pages/activities/emails/emails')
          .then(m => m.Emails)
      },
      {
        path: 'notes',
        loadComponent: () => import('./features/user/pages/activities/notes/notes')
          .then(m => m.Notes)
      },
      {
        path: 'campaigns',
        loadComponent: () => import('./features/user/pages/marketing/campaigns/campaigns')
          .then(m => m.Campaigns)
      },
      {
        path: 'email-campaigns',
        loadComponent: () => import('./features/user/pages/marketing/email-campaigns/email-campaigns')
          .then(m => m.EmailCampaigns)
      },
      {
        path: 'sms-campaigns',
        loadComponent: () => import('./features/user/pages/marketing/sms-campaigns/sms-campaigns')
          .then(m => m.SmsCampaigns)
      },
      {
        path: 'whatsapp-campaigns',
        loadComponent: () => import('./features/user/pages/marketing/whatsapp-campaigns/whatsapp-campaigns')
          .then(m => m.WhatsappCampaigns)
      },
      {
        path: 'email',
        loadComponent: () => import('./features/user/pages/communication/email/email')
          .then(m => m.Email)
      },
      {
        path: 'whatsapp',
        loadComponent: () => import('./features/user/pages/communication/whatsapp/whatsapp')
          .then(m => m.Whatsapp)
      },
      {
        path: 'sms',
        loadComponent: () => import('./features/user/pages/communication/sms/sms')
          .then(m => m.Sms)
      },
      {
        path: 'tickets',
        loadComponent: () => import('./features/user/pages/customer-service/tickets/tickets')
          .then(m => m.Tickets)
      },
      {
        path: 'knowledge-base',
        loadComponent: () => import('./features/user/pages/customer-service/knowledge-base/knowledge-base')
          .then(m => m.KnowledgeBase)
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/user/pages/projects/projects/projects')
          .then(m => m.Projects)
      },

      {
        path: 'milestones',
        loadComponent: () => import('./features/user/pages/projects/milestones/milestones')
          .then(m => m.Milestones)
      },
      {
        path: 'project-tasks',
        loadComponent: () => import('./features/user/pages/projects/project-tasks/project-tasks')
          .then(m => m.ProjectTasks)
      },
      {
        path: 'project-documents',
        loadComponent: () => import('./features/user/pages/projects/project-documents/project-documents')
          .then(m => m.ProjectDocuments)
      },
      {
        path: 'my-documents',
        loadComponent: () => import('./features/user/pages/documents/my-documents/my-documents')
          .then(m => m.MyDocuments)
      },
      {
        path: 'shared-documents',
        loadComponent: () => import('./features/user/pages/documents/shared-documents/shared-documents')
          .then(m => m.SharedDocuments)
      },
      {
        path: 'my-reports',
        loadComponent: () => import('./features/user/pages/reports/my-reports/my-reports')
          .then(m => m.MyReports)
      },
      {
        path: 'team-reports',
        loadComponent: () => import('./features/user/pages/reports/team-reports/team-reports')
          .then(m => m.TeamReports)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/user/pages/profile/profile/profile')
          .then(m => m.Profile)
      },
      {
        path: 'sessions',
        loadComponent: () => import('./features/user/pages/profile/sessions/sessions')
          .then(m => m.Sessions)
      },
      {
        path: 'my-mfa',
        loadComponent: () => import('./features/user/pages/profile/mfa/mfa')
          .then(m => m.Mfa)
      },

      {
        path: 'company-profile',
        loadComponent: () => import('./features/admin/pages/organization/company-profile/company-profile')
          .then(m => m.CompanyProfile)
      },
      {
        path: 'business-hours',
        loadComponent: () => import('./features/admin/pages/organization/business-hours/business-hours')
          .then(m => m.BusinessHours)
      },
      {
        path: 'holiday-calendar',
        loadComponent: () => import('./features/admin/pages/organization/holiday-calendar/holiday-calendar')
          .then(m => m.HolidayCalendar)
      },
      {
        path: 'user-groups',
        loadComponent: () => import('./features/admin/pages/organization/user-groups/user-groups')
          .then(m => m.UserGroups)
      },
      {
        path: 'inherited',
        loadComponent: () => import('./features/admin/pages/users-and-access-management/inherited/inherited')
          .then(m => m.Inherited)
      },
      {
        path: 'user-limit',
        loadComponent: () => import('./features/admin/pages/users-and-access-management/user-limit/user-limit')
          .then(m => m.UserLimit)
      },
      {
        path: 'lead-sources',
        loadComponent: () => import('./features/admin/pages/crm-module-configuration/lead-sources/lead-sources')
          .then(m => m.LeadSources)
      },
      {
        path: 'price-books',
        loadComponent: () => import('./features/admin/pages/crm-operations/price-books/price-books')
          .then(m => m.PriceBooks)
      },
    {
      path: 'contracts',
      loadComponent: () => import('./features/admin/pages/crm-operations/contracts/contracts')
        .then(m => m.Contracts)
    },
    {
      path: 'marketing-lists',
      loadComponent: () => import('./features/admin/pages/marketing/marketing-lists/marketing-lists')
        .then(m => m.MarketingLists)
    },
   
  {
    path: 'ticket-categories',
    loadComponent: () => import('./features/admin/pages/customer-service/ticket-categories/ticket-categories')
      .then(m => m.TicketCategories)
  },
  {
    path: 'faqs',
    loadComponent: () => import('./features/admin/pages/customer-service/faqs/faqs')
      .then(m => m.Faqs)
  },
{
  path: 'timesheet',
  loadComponent: () => import('./features/admin/pages/projects/timesheet/timesheet')
    .then(m => m.Timesheet)
},
{
  path: 'api-tokens',
  loadComponent: () => import('./features/admin/pages/integrations/api-tokens/api-tokens')
    .then(m => m.ApiTokens)
},
{
  path: 'company-webhooks',
  loadComponent:() => import('./features/admin/pages/integrations/company-webhooks/company-webhooks')
  .then(m=>m.CompanyWebhooks)
},
{
  path: 'gmail-integration',
  loadComponent:() => import('./features/admin/pages/integrations/gmail-integration/gmail-integration')
  .then(m=>m.GmailIntegration)
},
{
  path:'outlook-integration',
  loadComponent:() => import('./features/admin/pages/integrations/outlook-integration/outlook-integration')
  .then(m=>m.OutlookIntegration)
},

{
  path: 'microsoft-teams',
  loadComponent:() => import('./features/admin/pages/integrations/microsoft-teams/microsoft-teams')
  .then(m=>m.MicrosoftTeams)
},
{
  path: 'zoom',
  loadComponent:() => import('./features/admin/pages/integrations/zoom/zoom')
  .then(m=>m.Zoom)
},
{
  path: 'api-usage-logs',
  loadComponent:() => import('./features/admin/pages/api-usage-logs/api-usage-logs')
  .then(m=>m.ApiUsageLogs)
},
{
  path: 'file-upload-settings',
  loadComponent:() => import('./features/admin/pages/file-management/file-upload-settings/file-upload-settings')
  .then(m=>m.FileUploadSettings)
  
},
{
  path: 'document-categories',
  loadComponent:() => import('./features/admin/pages/file-management/document-categories/document-categories')
  .then(m=>m.DocumentCategories)
},
{
  path:'storage-usage',
  loadComponent:() => import('./features/admin/pages/file-management/storage-usage/storage-usage')
  .then(m=>m.StorageUsage)
},

  
      { path: '**', redirectTo: 'dashboard' }
    ]
  },
  { path: '**', redirectTo: 'login' }

];
