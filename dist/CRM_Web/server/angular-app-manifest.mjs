
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/login",
    "route": "/"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-5IRYY4ND.js",
      "chunk-QINCMNPM.js",
      "chunk-WY7IYMR6.js"
    ],
    "route": "/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-MFMQZN5S.js"
    ],
    "route": "/forgot-password"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/dashboard"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/admindashboard"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/superadmindashboard"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/company"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/master-data"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/region"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/user"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/roles"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/branches"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/plans"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/organizations"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/subscriptions"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/audit-logs"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/login-history"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/api-logs"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/error-logs"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/user-activities"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/login-sessions"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/backup-recovery"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/notifications"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/workflow-rules"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/approval-workflow"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/auto-assignment"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/escalation-rules"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/sla-rules"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/email-automation"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/scheduled-jobs"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/password-policy"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/mfa"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/ip-restrictions"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/device-management"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/security-logs"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/email-notification"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/sms-notification"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/whatsapp-notification"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/push-notification"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/notification-rules"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/platform-reports"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/company-reports"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/revenue-reports"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/subscription-reports"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/user-reports"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/audit-reports"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/custom-reports"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/general-settings"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/brands"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/localization"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/time-zones"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/currency"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/fiscal-year"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/number-formats"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/file-storage"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/license"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/fileupload-document"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/company-administrators"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/business-units"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/company-settings"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/payment-tracking"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/billing"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/invoices"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/coupons-discounts"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/departments"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/designations"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/menu-access"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/roles-permissions"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/users"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/teams"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/access-policies"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/lead-settings"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/pipeline-settings"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/opportunity-stages"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/activity-types"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/sources"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/industries"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/territories"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/salestargets"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/number-series"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/custom-fields"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/email-configuration"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/sms-configuration"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/whatsapp-configuration"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/telephony-configuration"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/api-configuration"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/webhooks-configuration"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/third-party-integrations"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/leads"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/leads-create"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/leads-list"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/leads-details"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/pipeline"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/superadmin"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/prospects"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/company-details"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/company-list"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/company-create"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/contact-details"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/contact-list"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/contact-create"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/accounts"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/contacts"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/opportunities"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/quotations"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/orders"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/invoice-sales"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/payments"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/products"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/calendar"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/tasks"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/meetings"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/calls"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/emails"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/notes"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/campaigns"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/email-campaigns"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/sms-campaigns"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/whatsapp-campaigns"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/email"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/whatsapp"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/sms"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/tickets"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/knowledge-base"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/projects"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/milestones"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/project-tasks"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/project-documents"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/my-documents"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/shared-documents"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/my-reports"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/team-reports"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/profile"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/sessions"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/my-mfa"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/company-profile"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/business-hours"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/holiday-calendar"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/user-groups"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/inherited"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/user-limit"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/lead-sources"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/price-books"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/contracts"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/marketing-lists"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/ticket-categories"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/faqs"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/timesheet"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/api-tokens"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/company-webhooks"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/gmail-integration"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/outlook-integration"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/microsoft-teams"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/zoom"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/api-usage-logs"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/file-upload-settings"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/document-categories"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "route": "/storage-usage"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-U46HFITT.js"
    ],
    "redirectTo": "/dashboard",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 5825, hash: '06a47a75c3af87ab4c3b4335c459a94a7ad2e05d654316fd11651415c501e8a2', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1468, hash: '4d049f231db151543a32c1fb6afd8765f9768beb8b0bfc979c7529f04c089377', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'company/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/company_index_html.mjs').then(m => m.default)},
    'master-data/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/master-data_index_html.mjs').then(m => m.default)},
    'organizations/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/organizations_index_html.mjs').then(m => m.default)},
    'branches/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/branches_index_html.mjs').then(m => m.default)},
    'audit-logs/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/audit-logs_index_html.mjs').then(m => m.default)},
    'api-logs/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/api-logs_index_html.mjs').then(m => m.default)},
    'user-activities/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/user-activities_index_html.mjs').then(m => m.default)},
    'backup-recovery/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/backup-recovery_index_html.mjs').then(m => m.default)},
    'workflow-rules/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/workflow-rules_index_html.mjs').then(m => m.default)},
    'auto-assignment/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/auto-assignment_index_html.mjs').then(m => m.default)},
    'sla-rules/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/sla-rules_index_html.mjs').then(m => m.default)},
    'scheduled-jobs/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/scheduled-jobs_index_html.mjs').then(m => m.default)},
    'mfa/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/mfa_index_html.mjs').then(m => m.default)},
    'device-management/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/device-management_index_html.mjs').then(m => m.default)},
    'whatsapp-notification/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/whatsapp-notification_index_html.mjs').then(m => m.default)},
    'email-notification/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/email-notification_index_html.mjs').then(m => m.default)},
    'company-reports/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/company-reports_index_html.mjs').then(m => m.default)},
    'notification-rules/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/notification-rules_index_html.mjs').then(m => m.default)},
    'subscription-reports/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/subscription-reports_index_html.mjs').then(m => m.default)},
    'forgot-password/index.html': {size: 7209, hash: 'c1519000735334c4abac92b696fed6ccbda68f83a49aa2aec70ddf85e67b3f39', text: () => import('./assets-chunks/forgot-password_index_html.mjs').then(m => m.default)},
    'audit-reports/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/audit-reports_index_html.mjs').then(m => m.default)},
    'general-settings/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/general-settings_index_html.mjs').then(m => m.default)},
    'currency/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/currency_index_html.mjs').then(m => m.default)},
    'number-formats/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/number-formats_index_html.mjs').then(m => m.default)},
    'company-administrators/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/company-administrators_index_html.mjs').then(m => m.default)},
    'license/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/license_index_html.mjs').then(m => m.default)},
    'company-settings/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/company-settings_index_html.mjs').then(m => m.default)},
    'billing/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/billing_index_html.mjs').then(m => m.default)},
    'localization/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/localization_index_html.mjs').then(m => m.default)},
    'designations/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/designations_index_html.mjs').then(m => m.default)},
    'coupons-discounts/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/coupons-discounts_index_html.mjs').then(m => m.default)},
    'lead-settings/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/lead-settings_index_html.mjs').then(m => m.default)},
    'roles-permissions/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/roles-permissions_index_html.mjs').then(m => m.default)},
    'teams/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/teams_index_html.mjs').then(m => m.default)},
    'opportunity-stages/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/opportunity-stages_index_html.mjs').then(m => m.default)},
    'sources/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/sources_index_html.mjs').then(m => m.default)},
    'territories/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/territories_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 34291, hash: 'c2c344d262da575059253e005850f3ed4e5635eb976b80a8e181b9f6f64d015f', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'number-series/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/number-series_index_html.mjs').then(m => m.default)},
    'whatsapp-configuration/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/whatsapp-configuration_index_html.mjs').then(m => m.default)},
    'email-configuration/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/email-configuration_index_html.mjs').then(m => m.default)},
    'third-party-integrations/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/third-party-integrations_index_html.mjs').then(m => m.default)},
    'leads-create/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/leads-create_index_html.mjs').then(m => m.default)},
    'leads-details/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/leads-details_index_html.mjs').then(m => m.default)},
    'api-configuration/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/api-configuration_index_html.mjs').then(m => m.default)},
    'company-details/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/company-details_index_html.mjs').then(m => m.default)},
    'superadmin/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/superadmin_index_html.mjs').then(m => m.default)},
    'company-create/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/company-create_index_html.mjs').then(m => m.default)},
    'contact-list/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/contact-list_index_html.mjs').then(m => m.default)},
    'opportunities/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/opportunities_index_html.mjs').then(m => m.default)},
    'accounts/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/accounts_index_html.mjs').then(m => m.default)},
    'orders/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/orders_index_html.mjs').then(m => m.default)},
    'calendar/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/calendar_index_html.mjs').then(m => m.default)},
    'payments/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/payments_index_html.mjs').then(m => m.default)},
    'meetings/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/meetings_index_html.mjs').then(m => m.default)},
    'email/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/email_index_html.mjs').then(m => m.default)},
    'campaigns/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/campaigns_index_html.mjs').then(m => m.default)},
    'emails/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/emails_index_html.mjs').then(m => m.default)},
    'sms-campaigns/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/sms-campaigns_index_html.mjs').then(m => m.default)},
    'sms/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/sms_index_html.mjs').then(m => m.default)},
    'knowledge-base/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/knowledge-base_index_html.mjs').then(m => m.default)},
    'milestones/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/milestones_index_html.mjs').then(m => m.default)},
    'project-documents/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/project-documents_index_html.mjs').then(m => m.default)},
    'team-reports/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/team-reports_index_html.mjs').then(m => m.default)},
    'shared-documents/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/shared-documents_index_html.mjs').then(m => m.default)},
    'sessions/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/sessions_index_html.mjs').then(m => m.default)},
    'company-profile/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/company-profile_index_html.mjs').then(m => m.default)},
    'holiday-calendar/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/holiday-calendar_index_html.mjs').then(m => m.default)},
    'inherited/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/inherited_index_html.mjs').then(m => m.default)},
    'lead-sources/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/lead-sources_index_html.mjs').then(m => m.default)},
    'contracts/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/contracts_index_html.mjs').then(m => m.default)},
    'timesheet/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/timesheet_index_html.mjs').then(m => m.default)},
    'ticket-categories/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/ticket-categories_index_html.mjs').then(m => m.default)},
    'company-webhooks/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/company-webhooks_index_html.mjs').then(m => m.default)},
    'outlook-integration/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/outlook-integration_index_html.mjs').then(m => m.default)},
    'file-upload-settings/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/file-upload-settings_index_html.mjs').then(m => m.default)},
    'zoom/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/zoom_index_html.mjs').then(m => m.default)},
    'storage-usage/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/storage-usage_index_html.mjs').then(m => m.default)},
    'admindashboard/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/admindashboard_index_html.mjs').then(m => m.default)},
    'region/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/region_index_html.mjs').then(m => m.default)},
    'subscriptions/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/subscriptions_index_html.mjs').then(m => m.default)},
    'roles/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/roles_index_html.mjs').then(m => m.default)},
    'error-logs/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/error-logs_index_html.mjs').then(m => m.default)},
    'notifications/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/notifications_index_html.mjs').then(m => m.default)},
    'escalation-rules/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/escalation-rules_index_html.mjs').then(m => m.default)},
    'password-policy/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/password-policy_index_html.mjs').then(m => m.default)},
    'security-logs/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/security-logs_index_html.mjs').then(m => m.default)},
    'push-notification/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/push-notification_index_html.mjs').then(m => m.default)},
    'revenue-reports/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/revenue-reports_index_html.mjs').then(m => m.default)},
    'custom-reports/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/custom-reports_index_html.mjs').then(m => m.default)},
    'time-zones/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/time-zones_index_html.mjs').then(m => m.default)},
    'file-storage/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/file-storage_index_html.mjs').then(m => m.default)},
    'business-units/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/business-units_index_html.mjs').then(m => m.default)},
    'menu-access/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/menu-access_index_html.mjs').then(m => m.default)},
    'invoices/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/invoices_index_html.mjs').then(m => m.default)},
    'access-policies/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/access-policies_index_html.mjs').then(m => m.default)},
    'activity-types/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/activity-types_index_html.mjs').then(m => m.default)},
    'salestargets/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/salestargets_index_html.mjs').then(m => m.default)},
    'webhooks-configuration/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/webhooks-configuration_index_html.mjs').then(m => m.default)},
    'leads-list/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/leads-list_index_html.mjs').then(m => m.default)},
    'sms-configuration/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/sms-configuration_index_html.mjs').then(m => m.default)},
    'prospects/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/prospects_index_html.mjs').then(m => m.default)},
    'contact-details/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/contact-details_index_html.mjs').then(m => m.default)},
    'contacts/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/contacts_index_html.mjs').then(m => m.default)},
    'invoice-sales/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/invoice-sales_index_html.mjs').then(m => m.default)},
    'notes/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/notes_index_html.mjs').then(m => m.default)},
    'tasks/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/tasks_index_html.mjs').then(m => m.default)},
    'whatsapp-campaigns/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/whatsapp-campaigns_index_html.mjs').then(m => m.default)},
    'tickets/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/tickets_index_html.mjs').then(m => m.default)},
    'project-tasks/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/project-tasks_index_html.mjs').then(m => m.default)},
    'my-reports/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/my-reports_index_html.mjs').then(m => m.default)},
    'my-mfa/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/my-mfa_index_html.mjs').then(m => m.default)},
    'user-groups/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/user-groups_index_html.mjs').then(m => m.default)},
    'price-books/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/price-books_index_html.mjs').then(m => m.default)},
    'faqs/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/faqs_index_html.mjs').then(m => m.default)},
    'dashboard/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/dashboard_index_html.mjs').then(m => m.default)},
    'login-history/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/login-history_index_html.mjs').then(m => m.default)},
    'gmail-integration/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/gmail-integration_index_html.mjs').then(m => m.default)},
    'user/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/user_index_html.mjs').then(m => m.default)},
    'api-usage-logs/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/api-usage-logs_index_html.mjs').then(m => m.default)},
    'approval-workflow/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/approval-workflow_index_html.mjs').then(m => m.default)},
    'platform-reports/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/platform-reports_index_html.mjs').then(m => m.default)},
    'ip-restrictions/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/ip-restrictions_index_html.mjs').then(m => m.default)},
    'brands/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/brands_index_html.mjs').then(m => m.default)},
    'fileupload-document/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/fileupload-document_index_html.mjs').then(m => m.default)},
    'pipeline-settings/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/pipeline-settings_index_html.mjs').then(m => m.default)},
    'departments/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/departments_index_html.mjs').then(m => m.default)},
    'leads/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/leads_index_html.mjs').then(m => m.default)},
    'custom-fields/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/custom-fields_index_html.mjs').then(m => m.default)},
    'quotations/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/quotations_index_html.mjs').then(m => m.default)},
    'whatsapp/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/whatsapp_index_html.mjs').then(m => m.default)},
    'my-documents/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/my-documents_index_html.mjs').then(m => m.default)},
    'calls/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/calls_index_html.mjs').then(m => m.default)},
    'company-list/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/company-list_index_html.mjs').then(m => m.default)},
    'business-hours/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/business-hours_index_html.mjs').then(m => m.default)},
    'marketing-lists/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/marketing-lists_index_html.mjs').then(m => m.default)},
    'microsoft-teams/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/microsoft-teams_index_html.mjs').then(m => m.default)},
    'superadmindashboard/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/superadmindashboard_index_html.mjs').then(m => m.default)},
    'login-sessions/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/login-sessions_index_html.mjs').then(m => m.default)},
    'fiscal-year/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/fiscal-year_index_html.mjs').then(m => m.default)},
    'sms-notification/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/sms-notification_index_html.mjs').then(m => m.default)},
    'users/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/users_index_html.mjs').then(m => m.default)},
    'telephony-configuration/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/telephony-configuration_index_html.mjs').then(m => m.default)},
    'contact-create/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/contact-create_index_html.mjs').then(m => m.default)},
    'email-campaigns/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/email-campaigns_index_html.mjs').then(m => m.default)},
    'profile/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/profile_index_html.mjs').then(m => m.default)},
    'plans/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/plans_index_html.mjs').then(m => m.default)},
    'user-reports/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/user-reports_index_html.mjs').then(m => m.default)},
    'industries/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/industries_index_html.mjs').then(m => m.default)},
    'api-tokens/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/api-tokens_index_html.mjs').then(m => m.default)},
    'pipeline/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/pipeline_index_html.mjs').then(m => m.default)},
    'user-limit/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/user-limit_index_html.mjs').then(m => m.default)},
    'products/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/products_index_html.mjs').then(m => m.default)},
    'email-automation/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/email-automation_index_html.mjs').then(m => m.default)},
    'document-categories/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/document-categories_index_html.mjs').then(m => m.default)},
    'projects/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/projects_index_html.mjs').then(m => m.default)},
    'payment-tracking/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/payment-tracking_index_html.mjs').then(m => m.default)},
    'styles-SBAMNSTX.css': {size: 306381, hash: '/a6hMenIsAo', text: () => import('./assets-chunks/styles-SBAMNSTX_css.mjs').then(m => m.default)}
  },
};
