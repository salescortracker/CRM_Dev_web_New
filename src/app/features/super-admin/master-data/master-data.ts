import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { MasterDataService } from './master-data.service';

type CategoryId = 'geographic' | 'finance' | 'crm' | 'organization' | 'product' | 'support' | 'hr';
type FilterStatus = 'all' | 'active' | 'inactive';

interface CatTheme {
  color: string;
  light: string;
  soft: string;
}

interface Category {
  id: CategoryId;
  label: string;
  iconCls: string;
}

interface SubTab {
  id: string;
  label: string;
  iconCls: string;
}

interface SimpleEntity {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  extra?: string;
}

interface Country {
  id: string;
  regionId: string;
  name: string;
  iso2: string;
  iso3: string;
  phoneCode: string;
  currencyId: string;
  isActive: boolean;
}

interface State {
  id: string;
  countryId: string;
  name: string;
  code: string;
  isActive: boolean;
}

interface City {
  id: string;
  stateId: string;
  countryId: string;
  name: string;
  isActive: boolean;
}

interface Currency {
  id: string;
  name: string;
  code: string;
  symbol: string;
  decimals: number;
  isDefault: boolean;
  isActive: boolean;
}

interface TimeZone {
  id: string;
  name: string;
  offset: string;
  abbreviation: string;
  isActive: boolean;
}

interface Language {
  id: string;
  name: string;
  code: string;
  nativeName: string;
  isActive: boolean;
}

interface Nationality {
  id: string;
  name: string;
  countryId: string;
  isActive: boolean;
}

const THEMES: Record<CategoryId, CatTheme> = {
  geographic: { color: '#3b82f6', light: 'rgba(59,130,246,0.08)', soft: 'rgba(59,130,246,0.15)' },
  finance: { color: '#10b981', light: 'rgba(16,185,129,0.08)', soft: 'rgba(16,185,129,0.15)' },
  crm: { color: '#8b5cf6', light: 'rgba(139,92,246,0.08)', soft: 'rgba(139,92,246,0.15)' },
  organization: { color: '#f59e0b', light: 'rgba(245,158,11,0.08)', soft: 'rgba(245,158,11,0.15)' },
  product: { color: '#6366f1', light: 'rgba(99,102,241,0.08)', soft: 'rgba(99,102,241,0.15)' },
  support: { color: '#f43f5e', light: 'rgba(244,63,94,0.08)', soft: 'rgba(244,63,94,0.15)' },
  hr: { color: '#14b8a6', light: 'rgba(20,184,166,0.08)', soft: 'rgba(20,184,166,0.15)' },
};

const CATEGORIES: Category[] = [
  { id: 'geographic', label: 'Geographic', iconCls: 'fa-globe' },
  { id: 'finance', label: 'Finance', iconCls: 'fa-receipt' },
  { id: 'crm', label: 'CRM', iconCls: 'fa-bullseye' },
  { id: 'organization', label: 'Organization', iconCls: 'fa-building' },
  { id: 'product', label: 'Product', iconCls: 'fa-box' },
  { id: 'support', label: 'Support', iconCls: 'fa-headset' },
  { id: 'hr', label: 'HR', iconCls: 'fa-user-check' },
];

const GEO_TABS: SubTab[] = [
  { id: 'countries', label: 'Countries', iconCls: 'fa-flag' },
  { id: 'states', label: 'States', iconCls: 'fa-map-pin' },
  { id: 'cities', label: 'Cities', iconCls: 'fa-city' },
  { id: 'currencies', label: 'Currencies', iconCls: 'fa-dollar-sign' },
  { id: 'timezones', label: 'Time Zones', iconCls: 'fa-clock' },
  { id: 'languages', label: 'Languages', iconCls: 'fa-language' },
  { id: 'nationalities', label: 'Nationalities', iconCls: 'fa-user' },
];

const FIN_TABS: SubTab[] = [
  { id: 'taxTypes', label: 'Tax Types', iconCls: 'fa-percent' },
  { id: 'gst', label: 'GST', iconCls: 'fa-file-invoice' },
  { id: 'vat', label: 'VAT', iconCls: 'fa-badge-dollar' },
  { id: 'paymentTerms', label: 'Payment Terms', iconCls: 'fa-credit-card' },
  { id: 'paymentMethods', label: 'Payment Methods', iconCls: 'fa-money-check-dollar' },
  { id: 'invoicePrefixes', label: 'Invoice Prefix', iconCls: 'fa-hashtag' },
  { id: 'creditTerms', label: 'Credit Terms', iconCls: 'fa-calendar-days' },
];

const CRM_TABS: SubTab[] = [
  { id: 'leadSources', label: 'Lead Sources', iconCls: 'fa-filter' },
  { id: 'leadStatuses', label: 'Lead Statuses', iconCls: 'fa-code-branch' },
  { id: 'opportunityStages', label: 'Opportunity Stages', iconCls: 'fa-bolt' },
  { id: 'pipelines', label: 'Pipelines', iconCls: 'fa-diagram-project' },
  { id: 'customerTypes', label: 'Customer Types', iconCls: 'fa-circle-user' },
  { id: 'customerCategories', label: 'Customer Categories', iconCls: 'fa-tag' },
  { id: 'activityTypes', label: 'Activity Types', iconCls: 'fa-bullseye' },
  { id: 'followUpTypes', label: 'Follow-up Types', iconCls: 'fa-phone' },
  { id: 'communicationTypes', label: 'Communication Types', iconCls: 'fa-message' },
  { id: 'meetingTypes', label: 'Meeting Types', iconCls: 'fa-users' },
  { id: 'callOutcomes', label: 'Call Outcomes', iconCls: 'fa-phone-volume' },
  { id: 'winReasons', label: 'Win Reasons', iconCls: 'fa-trophy' },
  { id: 'lossReasons', label: 'Loss Reasons', iconCls: 'fa-thumbs-down' },
  { id: 'competitors', label: 'Competitors', iconCls: 'fa-shield-halved' },
  { id: 'priorities', label: 'Priorities', iconCls: 'fa-triangle-exclamation' },
  { id: 'ratings', label: 'Ratings', iconCls: 'fa-star' },
];

const ORG_TABS: SubTab[] = [
  { id: 'industries', label: 'Industries', iconCls: 'fa-briefcase' },
  { id: 'businessTypes', label: 'Business Types', iconCls: 'fa-tag' },
  { id: 'companyCategories', label: 'Company Categories', iconCls: 'fa-layer-group' },
  { id: 'branchTypes', label: 'Branch Types', iconCls: 'fa-building' },
  { id: 'departments', label: 'Departments', iconCls: 'fa-sitemap' },
  { id: 'designations', label: 'Designations', iconCls: 'fa-id-badge' },
  { id: 'employeeTypes', label: 'Employee Types', iconCls: 'fa-user' },
  { id: 'businessUnits', label: 'Business Units', iconCls: 'fa-network-wired' },
];

const PROD_TABS: SubTab[] = [
  { id: 'productCategories', label: 'Product Categories', iconCls: 'fa-layer-group' },
  { id: 'brands', label: 'Brands', iconCls: 'fa-tag' },
  { id: 'unitsOfMeasure', label: 'Units of Measure', iconCls: 'fa-ruler' },
  { id: 'warehouses', label: 'Warehouses', iconCls: 'fa-boxes-stacked' },
  { id: 'productTypes', label: 'Product Types', iconCls: 'fa-box' },
];

const SUPPORT_TABS: SubTab[] = [
  { id: 'ticketPriorities', label: 'Ticket Priority', iconCls: 'fa-triangle-exclamation' },
  { id: 'ticketCategories', label: 'Ticket Categories', iconCls: 'fa-clipboard-list' },
  { id: 'ticketStatuses', label: 'Ticket Statuses', iconCls: 'fa-code-branch' },
  { id: 'slaLevels', label: 'SLA Levels', iconCls: 'fa-shield-halved' },
  { id: 'resolutionTypes', label: 'Resolution Types', iconCls: 'fa-file-lines' },
];

const HR_TABS: SubTab[] = [
  { id: 'holidays', label: 'Holidays', iconCls: 'fa-calendar' },
  { id: 'shifts', label: 'Shifts', iconCls: 'fa-clock' },
  { id: 'leaveTypes', label: 'Leave Types', iconCls: 'fa-umbrella-beach' },
  { id: 'attendanceStatuses', label: 'Attendance Status', iconCls: 'fa-user-check' },
];

const TAB_MAP: Record<CategoryId, SubTab[]> = {
  geographic: GEO_TABS,
  finance: FIN_TABS,
  crm: CRM_TABS,
  organization: ORG_TABS,
  product: PROD_TABS,
  support: SUPPORT_TABS,
  hr: HR_TABS,
};

const se = (id: string, name: string, description: string, isActive: boolean, extra = ''): SimpleEntity => ({
  id,
  name,
  description,
  isActive,
  extra,
});

@Component({
  selector: 'app-master-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './master-data.html',
  styleUrl: './master-data.css',
  animations: [
    trigger('fadeUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))]),
    ]),
    trigger('toast', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px) scale(0.92)' }),
        animate('220ms ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
      ]),
      transition(':leave', [animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.92)' }))]),
    ]),
  ],
})
export class MasterData implements OnDestroy, OnInit {
  readonly themes = THEMES;
  readonly filterStatuses: FilterStatus[] = ['all', 'active', 'inactive'];

  category: CategoryId = 'geographic';
  activeSubTab = 'countries';
  search = '';
  statusFilter: FilterStatus = 'all';
  regionFilter = 'all';
  countryFilter = 'all';
  stateFilter = 'all';
  toast: string | null = null;
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  geoModalOpen = false;
  geoModalEditing: any = null;
  geoModalTab = 'countries';
  geoForm: Record<string, any> = {};
  geoErrors: Record<string, string> = {};
  modalCid = '';

  simModalOpen = false;
  simModalEditing: SimpleEntity | null = null;
  simModalLabel = '';
  simModalExtraLabel = '';
  simModalExtraIsColor = false;
  private simModalKey = '';
  simForm = { name: '', description: '', isActive: true, extra: '' };
  simErrors: Record<string, string> = {};
  private companies: any[] = [];
  private loadingTabs = new Set<string>();

  regions: Array<{ id: string; name: string; companyId?: number }> = [
    { id: 'r1', name: 'Asia' },
    { id: 'r2', name: 'Europe' },
    { id: 'r3', name: 'North America' },
    { id: 'r4', name: 'Middle East' },
    { id: 'r5', name: 'Africa' },
    { id: 'r6', name: 'Oceania' },
    { id: 'r7', name: 'South America' },
  ];

  constructor(private masterDataService: MasterDataService) {}

  ngOnInit(): void {
    this.clearSeedData();
    this.loadReferenceData();
    this.loadTabData(this.activeSubTab);
  }

  countries: Country[] = [
    { id: 'c1', regionId: 'r1', name: 'India', iso2: 'IN', iso3: 'IND', phoneCode: '+91', currencyId: 'cy1', isActive: true },
    { id: 'c2', regionId: 'r3', name: 'United States', iso2: 'US', iso3: 'USA', phoneCode: '+1', currencyId: 'cy2', isActive: true },
    { id: 'c3', regionId: 'r4', name: 'United Arab Emirates', iso2: 'AE', iso3: 'ARE', phoneCode: '+971', currencyId: 'cy5', isActive: true },
    { id: 'c4', regionId: 'r2', name: 'United Kingdom', iso2: 'GB', iso3: 'GBR', phoneCode: '+44', currencyId: 'cy4', isActive: true },
    { id: 'c5', regionId: 'r3', name: 'Canada', iso2: 'CA', iso3: 'CAN', phoneCode: '+1', currencyId: 'cy6', isActive: true },
    { id: 'c6', regionId: 'r2', name: 'Germany', iso2: 'DE', iso3: 'DEU', phoneCode: '+49', currencyId: 'cy3', isActive: true },
    { id: 'c7', regionId: 'r6', name: 'Australia', iso2: 'AU', iso3: 'AUS', phoneCode: '+61', currencyId: 'cy7', isActive: true },
    { id: 'c8', regionId: 'r7', name: 'Brazil', iso2: 'BR', iso3: 'BRA', phoneCode: '+55', currencyId: 'cy8', isActive: false },
  ];

  states: State[] = [
    { id: 's1', countryId: 'c1', name: 'Maharashtra', code: 'MH', isActive: true },
    { id: 's2', countryId: 'c1', name: 'Karnataka', code: 'KA', isActive: true },
    { id: 's3', countryId: 'c1', name: 'Tamil Nadu', code: 'TN', isActive: true },
    { id: 's4', countryId: 'c1', name: 'Delhi', code: 'DL', isActive: true },
    { id: 's5', countryId: 'c2', name: 'California', code: 'CA', isActive: true },
    { id: 's6', countryId: 'c2', name: 'Texas', code: 'TX', isActive: true },
    { id: 's7', countryId: 'c2', name: 'New York', code: 'NY', isActive: true },
    { id: 's8', countryId: 'c4', name: 'England', code: 'ENG', isActive: true },
  ];

  cities: City[] = [
    { id: 'ci1', stateId: 's1', countryId: 'c1', name: 'Mumbai', isActive: true },
    { id: 'ci2', stateId: 's1', countryId: 'c1', name: 'Pune', isActive: true },
    { id: 'ci3', stateId: 's2', countryId: 'c1', name: 'Bangalore', isActive: true },
    { id: 'ci4', stateId: 's3', countryId: 'c1', name: 'Chennai', isActive: true },
    { id: 'ci5', stateId: 's5', countryId: 'c2', name: 'Los Angeles', isActive: true },
    { id: 'ci6', stateId: 's7', countryId: 'c2', name: 'New York City', isActive: true },
    { id: 'ci7', stateId: 's8', countryId: 'c4', name: 'London', isActive: true },
  ];

  currencies: Currency[] = [
    { id: 'cy1', name: 'Indian Rupee', code: 'INR', symbol: 'INR', decimals: 2, isDefault: false, isActive: true },
    { id: 'cy2', name: 'US Dollar', code: 'USD', symbol: '$', decimals: 2, isDefault: true, isActive: true },
    { id: 'cy3', name: 'Euro', code: 'EUR', symbol: 'EUR', decimals: 2, isDefault: false, isActive: true },
    { id: 'cy4', name: 'British Pound', code: 'GBP', symbol: 'GBP', decimals: 2, isDefault: false, isActive: true },
    { id: 'cy5', name: 'UAE Dirham', code: 'AED', symbol: 'AED', decimals: 2, isDefault: false, isActive: true },
    { id: 'cy6', name: 'Canadian Dollar', code: 'CAD', symbol: 'CAD', decimals: 2, isDefault: false, isActive: true },
    { id: 'cy7', name: 'Australian Dollar', code: 'AUD', symbol: 'AUD', decimals: 2, isDefault: false, isActive: true },
    { id: 'cy8', name: 'Brazilian Real', code: 'BRL', symbol: 'BRL', decimals: 2, isDefault: false, isActive: false },
  ];

  timezones: TimeZone[] = [
    { id: 'tz1', name: 'India Standard Time', offset: 'UTC+5:30', abbreviation: 'IST', isActive: true },
    { id: 'tz2', name: 'Greenwich Mean Time', offset: 'UTC+0', abbreviation: 'GMT', isActive: true },
    { id: 'tz3', name: 'Eastern Standard Time', offset: 'UTC-5', abbreviation: 'EST', isActive: true },
    { id: 'tz4', name: 'Gulf Standard Time', offset: 'UTC+4', abbreviation: 'GST', isActive: true },
  ];

  languages: Language[] = [
    { id: 'l1', name: 'English', code: 'en', nativeName: 'English', isActive: true },
    { id: 'l2', name: 'Hindi', code: 'hi', nativeName: 'Hindi', isActive: true },
    { id: 'l3', name: 'Arabic', code: 'ar', nativeName: 'Arabic', isActive: true },
    { id: 'l4', name: 'French', code: 'fr', nativeName: 'Francais', isActive: true },
  ];

  nationalities: Nationality[] = [
    { id: 'n1', name: 'Indian', countryId: 'c1', isActive: true },
    { id: 'n2', name: 'American', countryId: 'c2', isActive: true },
    { id: 'n3', name: 'Emirati', countryId: 'c3', isActive: true },
    { id: 'n4', name: 'British', countryId: 'c4', isActive: true },
  ];

  simpleData: Record<string, SimpleEntity[]> = {
    taxTypes: [se('tt1', 'Standard Tax', 'General applicable tax', true, '18%'), se('tt2', 'Reduced Tax', 'Reduced rate', true, '5%'), se('tt3', 'Zero Rate', 'Zero-rated', true, '0%')],
    gst: [se('g1', 'Standard GST', 'GST standard rate', true, '18%'), se('g2', 'Reduced GST', 'GST reduced rate', true, '5%'), se('g3', 'Zero GST', 'Zero-rated GST', true, '0%')],
    vat: [se('v1', 'Standard VAT', 'VAT standard rate', true, '20%'), se('v2', 'Reduced VAT', 'VAT reduced rate', true, '5%'), se('v3', 'Zero VAT', 'Zero-rated VAT', true, '0%')],
    paymentTerms: [se('pt1', 'Immediate', 'Due on receipt', true, '0 days'), se('pt2', 'Net 15', 'Within 15 days', true, '15 days'), se('pt3', 'Net 30', 'Within 30 days', true, '30 days')],
    paymentMethods: [se('pm1', 'Cash', 'Physical cash', true), se('pm2', 'Bank Transfer', 'Wire transfer', true), se('pm3', 'Credit Card', 'Card via gateway', true), se('pm4', 'UPI', 'Unified Payments Interface', true)],
    invoicePrefixes: [se('ip1', 'INV', 'Standard invoice', true, 'INV'), se('ip2', 'PRO', 'Proforma invoice', true, 'PRO'), se('ip3', 'TAX', 'Tax invoice', true, 'TAX')],
    creditTerms: [se('ct1', 'Immediate', 'No credit period', true, '0 days'), se('ct2', '15 Days', 'Short-term credit', true, '15 days'), se('ct3', '30 Days', 'Standard credit', true, '30 days')],
    leadSources: [se('ls1', 'Website', 'Organic inquiry', true), se('ls2', 'Referral', 'Customer referral', true), se('ls3', 'Cold Call', 'Outbound calls', true), se('ls4', 'Email Campaign', 'Email marketing', true)],
    leadStatuses: [se('lst1', 'New', 'Freshly created', true, '#3b82f6'), se('lst2', 'Contacted', 'Outreach done', true, '#8b5cf6'), se('lst3', 'Qualified', 'Meets ICP', true, '#10b981'), se('lst4', 'Converted', 'Converted to opportunity', true, '#b91538')],
    opportunityStages: [se('os1', 'Prospecting', 'Identifying opportunities', true, '10%'), se('os2', 'Qualification', 'Qualifying', true, '25%'), se('os3', 'Proposal', 'Proposal sent', true, '50%'), se('os4', 'Negotiation', 'Under negotiation', true, '75%')],
    pipelines: [se('pip1', 'Standard Sales', 'Default B2B pipeline', true), se('pip2', 'Enterprise Sales', 'Large account pipeline', true), se('pip3', 'SMB Pipeline', 'Small and mid-market', true)],
    customerTypes: [se('ct1', 'Individual', 'Single person', true), se('ct2', 'Corporate', 'Corporate entity', true), se('ct3', 'Government', 'Government body', true), se('ct4', 'Enterprise', 'Large enterprise', true)],
    customerCategories: [se('cc1', 'Platinum', 'Highest tier', true), se('cc2', 'Gold', 'High-value', true), se('cc3', 'Silver', 'Mid-value', true), se('cc4', 'Bronze', 'Standard', true)],
    activityTypes: [se('at1', 'Call', 'Phone or video call', true), se('at2', 'Email', 'Outbound email', true), se('at3', 'Meeting', 'Customer meeting', true), se('at4', 'Task', 'Follow-up task', true)],
    followUpTypes: [se('fu1', 'Call Back', 'Schedule a return call', true), se('fu2', 'Email Follow-up', 'Follow up by email', true), se('fu3', 'Meeting', 'Schedule a meeting', true)],
    communicationTypes: [se('com1', 'Phone', 'Phone communication', true), se('com2', 'Email', 'Email communication', true), se('com3', 'WhatsApp', 'WhatsApp message', true)],
    meetingTypes: [se('mt1', 'Discovery', 'Discovery call', true), se('mt2', 'Demo', 'Product demonstration', true), se('mt3', 'Negotiation', 'Commercial discussion', true)],
    callOutcomes: [se('co1', 'Connected', 'Customer answered', true), se('co2', 'No Answer', 'No response', true), se('co3', 'Interested', 'Customer interested', true)],
    winReasons: [se('wr1', 'Best Price', 'Won by pricing', true), se('wr2', 'Product Fit', 'Strong functional match', true), se('wr3', 'Relationship', 'Existing relationship', true)],
    lossReasons: [se('lr1', 'Price', 'Lost due to price', true), se('lr2', 'Competitor', 'Lost to competitor', true), se('lr3', 'No Budget', 'Budget unavailable', true)],
    competitors: [se('cmp1', 'Salesforce', 'Enterprise CRM competitor', true), se('cmp2', 'Zoho CRM', 'SMB CRM competitor', true), se('cmp3', 'HubSpot', 'Marketing-led CRM', true)],
    priorities: [se('pr1', 'Low', 'Low priority', true, '#22c55e'), se('pr2', 'Medium', 'Medium priority', true, '#f59e0b'), se('pr3', 'High', 'High priority', true, '#ef4444')],
    ratings: [se('rtg1', 'Hot', 'High engagement', true), se('rtg2', 'Warm', 'Moderate engagement', true), se('rtg3', 'Cold', 'Low engagement', true)],
    industries: [se('ind1', 'Technology', 'Technology businesses', true), se('ind2', 'Finance', 'Financial services', true), se('ind3', 'Healthcare', 'Healthcare providers', true)],
    businessTypes: [se('bt1', 'B2B', 'Business to business', true), se('bt2', 'B2C', 'Business to consumer', true), se('bt3', 'Marketplace', 'Marketplace operator', true)],
    companyCategories: [se('ccat1', 'Enterprise', 'Large account', true), se('ccat2', 'SMB', 'Small and medium business', true), se('ccat3', 'Startup', 'Early stage business', true)],
    branchTypes: [se('br1', 'Head Office', 'Primary office', true), se('br2', 'Regional Office', 'Regional location', true), se('br3', 'Warehouse', 'Storage branch', true)],
    departments: [se('dep1', 'Sales', 'Sales department', true), se('dep2', 'Marketing', 'Marketing department', true), se('dep3', 'Support', 'Support department', true)],
    designations: [se('des1', 'Manager', 'Manager role', true), se('des2', 'Executive', 'Executive role', true), se('des3', 'Administrator', 'Administrator role', true)],
    employeeTypes: [se('et1', 'Full Time', 'Permanent employee', true), se('et2', 'Contract', 'Contract employee', true), se('et3', 'Intern', 'Internship role', true)],
    businessUnits: [se('bu1', 'North', 'North business unit', true), se('bu2', 'South', 'South business unit', true), se('bu3', 'International', 'International unit', true)],
    productCategories: [se('pc1', 'Software', 'Software products', true), se('pc2', 'Services', 'Service offerings', true), se('pc3', 'Hardware', 'Hardware products', true)],
    brands: [se('b1', 'CRM Core', 'Core CRM brand', true), se('b2', 'CRM Pro', 'Professional CRM brand', true)],
    unitsOfMeasure: [se('u1', 'Each', 'Single unit', true), se('u2', 'Hour', 'Hourly billing', true), se('u3', 'Month', 'Monthly billing', true)],
    warehouses: [se('w1', 'Main Warehouse', 'Primary inventory location', true), se('w2', 'Regional Warehouse', 'Regional inventory location', true)],
    productTypes: [se('ptp1', 'Subscription', 'Recurring product', true), se('ptp2', 'One Time', 'One-time product', true), se('ptp3', 'Service', 'Service product', true)],
    ticketPriorities: [se('tp1', 'Low', 'Low priority', true, '#22c55e'), se('tp2', 'Medium', 'Standard priority', true, '#f59e0b'), se('tp3', 'High', 'Needs attention', true, '#ef4444')],
    ticketCategories: [se('tc1', 'Technical', 'Technical issue', true), se('tc2', 'Billing', 'Invoice query', true), se('tc3', 'Feature Request', 'New feature ask', true)],
    ticketStatuses: [se('ts1', 'Open', 'New ticket', true, '#3b82f6'), se('ts2', 'In Progress', 'Being worked on', true, '#8b5cf6'), se('ts3', 'Closed', 'Ticket closed', true, '#94a3b8')],
    slaLevels: [se('sl1', 'Bronze', 'Standard SLA', true, '8 hrs'), se('sl2', 'Silver', 'Enhanced SLA', true, '4 hrs'), se('sl3', 'Gold', 'Premium SLA', true, '2 hrs')],
    resolutionTypes: [se('res1', 'Fixed', 'Root cause resolved', true), se('res2', 'Workaround', 'Temporary workaround', true), se('res3', 'Duplicate', 'Duplicate ticket', true)],
    holidays: [se('h1', 'New Year Day', '1 January', true), se('h2', 'Republic Day', '26 January India', true), se('h3', 'Christmas Day', '25 December', true)],
    shifts: [se('sh1', 'Morning Shift', 'Early shift', true, '06:00-14:00'), se('sh2', 'Day Shift', 'Business hours', true, '09:00-17:00'), se('sh3', 'Night Shift', 'Overnight', true, '22:00-06:00')],
    leaveTypes: [se('lt1', 'Annual Leave', 'Paid annual leave', true), se('lt2', 'Sick Leave', 'Medical leave', true), se('lt3', 'Casual Leave', 'Short-notice leave', true)],
    attendanceStatuses: [se('as1', 'Present', 'Full day present', true), se('as2', 'Absent', 'Not present', true), se('as3', 'Late', 'Arrived late', true)],
  };

  private readonly extraLabelMap: Record<string, { label: string; isColor?: boolean }> = {
    taxTypes: { label: 'Rate' },
    gst: { label: 'Rate' },
    vat: { label: 'Rate' },
    paymentTerms: { label: 'Duration' },
    invoicePrefixes: { label: 'Prefix Code' },
    creditTerms: { label: 'Days' },
    leadStatuses: { label: 'Color', isColor: true },
    opportunityStages: { label: 'Probability' },
    priorities: { label: 'Color', isColor: true },
    ticketPriorities: { label: 'Color', isColor: true },
    ticketStatuses: { label: 'Color', isColor: true },
    slaLevels: { label: 'Response Time' },
    shifts: { label: 'Hours' },
  };

  get theme(): CatTheme {
    return THEMES[this.category];
  }

  get categories(): Category[] {
    return CATEGORIES;
  }

  get activeTabs(): SubTab[] {
    return TAB_MAP[this.category];
  }

  get currentSimpleData(): SimpleEntity[] {
    return this.simpleData[this.activeSubTab] ?? [];
  }

  get extraLabel(): string {
    return this.extraLabelMap[this.activeSubTab]?.label ?? '';
  }

  get extraIsColor(): boolean {
    return this.extraLabelMap[this.activeSubTab]?.isColor ?? false;
  }

  get isGeoCategory(): boolean {
    return this.category === 'geographic';
  }

  get activeTabLabel(): string {
    return this.activeTabs.find((tab) => tab.id === this.activeSubTab)?.label ?? '';
  }

  get filteredGeoData(): any[] {
    const query = this.search.toLowerCase();
    const matchesStatus = (item: any) =>
      this.statusFilter === 'all' || (this.statusFilter === 'active' ? item.isActive : !item.isActive);

    switch (this.activeSubTab) {
      case 'countries':
        return this.countries.filter((country) =>
          matchesStatus(country) &&
          (!query || country.name.toLowerCase().includes(query) || country.iso2.toLowerCase().includes(query) || country.iso3.toLowerCase().includes(query)) &&
          (this.regionFilter === 'all' || country.regionId === this.regionFilter)
        );
      case 'states':
        return this.states.filter((state) =>
          matchesStatus(state) &&
          (!query || state.name.toLowerCase().includes(query) || state.code.toLowerCase().includes(query)) &&
          (this.countryFilter === 'all' || state.countryId === this.countryFilter)
        );
      case 'cities':
        return this.cities.filter((city) =>
          matchesStatus(city) &&
          (!query || city.name.toLowerCase().includes(query)) &&
          (this.stateFilter === 'all' || city.stateId === this.stateFilter)
        );
      case 'currencies':
        return this.currencies.filter((currency) =>
          matchesStatus(currency) &&
          (!query || currency.name.toLowerCase().includes(query) || currency.code.toLowerCase().includes(query))
        );
      case 'timezones':
        return this.timezones.filter((timezone) =>
          matchesStatus(timezone) &&
          (!query || timezone.name.toLowerCase().includes(query) || timezone.abbreviation.toLowerCase().includes(query))
        );
      case 'languages':
        return this.languages.filter((language) =>
          matchesStatus(language) &&
          (!query || language.name.toLowerCase().includes(query) || language.code.toLowerCase().includes(query))
        );
      case 'nationalities':
        return this.nationalities.filter((nationality) =>
          matchesStatus(nationality) && (!query || nationality.name.toLowerCase().includes(query))
        );
      default:
        return [];
    }
  }

  get filteredSimpleData(): SimpleEntity[] {
    const query = this.search.toLowerCase();
    return this.currentSimpleData.filter((item) =>
      (this.statusFilter === 'all' || (this.statusFilter === 'active' ? item.isActive : !item.isActive)) &&
      (!query || item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query))
    );
  }

  get activeFilteredData(): any[] {
    return this.isGeoCategory ? this.filteredGeoData : this.filteredSimpleData;
  }

  get entityTotal(): number {
    return this.isGeoCategory ? this.getGeoRaw().length : this.currentSimpleData.length;
  }

  get entityActive(): number {
    return this.isGeoCategory
      ? this.getGeoRaw().filter((item: any) => item.isActive).length
      : this.currentSimpleData.filter((item) => item.isActive).length;
  }

  get catTotal(): number {
    return this.activeTabs.reduce((sum, tab) => sum + this.getTabCount(tab.id).total, 0);
  }

  get globalTotal(): number {
    return CATEGORIES.reduce((sum, category) => sum + this.getCategoryTotal(category.id), 0);
  }

  getTabIcon(tabId: string): string {
    return this.activeTabs.find((tab) => tab.id === tabId)?.iconCls ?? '';
  }

  getTabCount(tabId: string): { total: number; active: number } {
    const category = CATEGORIES.find((item) => item.id === tabId);
    if (category) {
      return { total: this.getCategoryTotal(category.id), active: this.getCategoryActive(category.id) };
    }

    if (this.category === 'geographic') {
      const raw = this.getGeoRawFor(tabId);
      return { total: raw.length, active: raw.filter((item: any) => item.isActive).length };
    }

    const items = this.simpleData[tabId] ?? [];
    return { total: items.length, active: items.filter((item) => item.isActive).length };
  }

  countryName(id: string): string {
    return this.countries.find((country) => country.id === id)?.name ?? '-';
  }

  stateName(id: string): string {
    return this.states.find((state) => state.id === id)?.name ?? '-';
  }

  currCode(id: string): string {
    return this.currencies.find((currency) => currency.id === id)?.code ?? '-';
  }

  regionName(id: string): string {
    return this.regions.find((region) => region.id === id)?.name ?? '-';
  }

  statesFor(countryId: string): State[] {
    return this.states.filter((state) => state.countryId === countryId);
  }

  tabRatio(tabId: string): number {
    const count = this.getTabCount(tabId);
    return count.total ? Math.round((count.active / count.total) * 100) : 0;
  }

  selectCategory(category: CategoryId): void {
    this.category = category;
    this.activeSubTab = TAB_MAP[category][0].id;
    this.resetFilters();
    this.loadTabData(this.activeSubTab);
  }

  selectSubTab(tabId: string): void {
    this.activeSubTab = tabId;
    this.resetFilters();
    this.loadTabData(tabId);
  }

  openGeoAdd(tab: string): void {
    const defaultCompanyId = this.defaultCompanyId();
    const blanks: Record<string, any> = {
      countries: { companyId: defaultCompanyId, regionId: '', name: '', iso2: '', iso3: '', phoneCode: '+', currencyId: '', isActive: true },
      states: { companyId: defaultCompanyId, regionId: '', countryId: '', name: '', code: '', isActive: true },
      cities: { companyId: defaultCompanyId, regionId: '', countryId: '', stateId: '', name: '', isActive: true },
      currencies: { name: '', code: '', symbol: '', decimals: 2, isDefault: false, isActive: true },
      timezones: { name: '', offset: 'UTC+0', abbreviation: '', isActive: true },
      languages: { name: '', code: '', nativeName: '', isActive: true },
      nationalities: { name: '', countryId: '', isActive: true },
    };

    this.geoForm = { ...blanks[tab] };
    this.geoErrors = {};
    this.modalCid = '';
    this.geoModalEditing = null;
    this.geoModalTab = tab;
    this.geoModalOpen = true;
  }

  openGeoEdit(tab: string, item: any): void {
    this.geoForm = { ...item };
    this.geoErrors = {};
    this.modalCid = item.countryId ?? '';
    this.geoModalEditing = item;
    this.geoModalTab = tab;
    this.geoModalOpen = true;
  }

  saveGeo(): void {
    const form = this.geoForm;
    const errors: Record<string, string> = {};

    if (!form['name']?.trim()) {
      errors['name'] = 'Name is required.';
    }
    if (this.geoModalTab === 'countries') {
      if (!form['regionId']) {
        errors['regionId'] = 'Region required.';
      }
      if (!form['iso2']?.trim() || form['iso2'].trim().length !== 2) {
        errors['iso2'] = 'Must be 2 characters.';
      }
      if (!form['iso3']?.trim() || form['iso3'].trim().length !== 3) {
        errors['iso3'] = 'Must be 3 characters.';
      }
      if (!form['phoneCode']?.startsWith('+')) {
        errors['phoneCode'] = 'Must start with +.';
      }
    }
    if (this.geoModalTab === 'states' && !form['countryId']) {
      errors['countryId'] = 'Country required.';
    }
    if (this.geoModalTab === 'cities' && !form['stateId']) {
      errors['stateId'] = 'State required.';
    }
    if (this.geoModalTab === 'currencies') {
      if (!form['code']?.trim() || form['code'].trim().length !== 3) {
        errors['code'] = 'Must be 3 characters.';
      }
      if (!form['symbol']?.trim()) {
        errors['symbol'] = 'Symbol required.';
      }
    }
    if (this.geoModalTab === 'languages' && !form['code']?.trim()) {
      errors['code'] = 'Code required.';
    }
    if (this.geoModalTab === 'nationalities' && !form['countryId']) {
      errors['countryId'] = 'Country required.';
    }

    if (Object.keys(errors).length) {
      this.geoErrors = errors;
      return;
    }

    const request = this.geoModalEditing
      ? this.masterDataService.update(this.geoModalTab, this.toApiPayload(this.geoModalTab, form))
      : this.masterDataService.create(this.geoModalTab, this.toApiPayload(this.geoModalTab, form));

    request.subscribe({
      next: (res) => {
        this.showToast(res?.message || `${form['name']} ${this.geoModalEditing ? 'updated' : 'added'}.`);
        this.geoModalOpen = false;
        this.loadTabData(this.geoModalTab);
        this.loadReferenceData();
      },
      error: (error) => {
        this.showToast(error?.error?.message || `${this.activeTabLabel} API is not ready yet.`);
      },
    });
  }

  toggleGeo(tab: string, id: string): void {
    const item = this.getGeoRawFor(tab).find((entry: any) => entry.id === id);
    if (!item) {
      return;
    }

    const payload = this.toApiPayload(tab, { ...item, isActive: !item.isActive });
    this.masterDataService.update(tab, payload).subscribe({
      next: (res) => {
        this.showToast(res?.message || 'Status updated.');
        this.loadTabData(tab);
      },
      error: (error) => {
        this.showToast(error?.error?.message || `${this.activeTabLabel} API is not ready yet.`);
      },
    });
  }

  setDefaultCurrency(id: string): void {
    this.currencies = this.currencies.map((currency) => ({ ...currency, isDefault: currency.id === id }));
    this.showToast('Default currency set.');
  }

  onCityCountryChange(countryId: string): void {
    this.modalCid = countryId;
    this.geoForm['countryId'] = countryId;
    this.geoForm['stateId'] = '';
  }

  openSimAdd(tabId: string): void {
    this.simModalKey = tabId;
    this.simModalLabel = this.activeTabs.find((tab) => tab.id === tabId)?.label ?? tabId;
    this.simModalExtraLabel = this.extraLabelMap[tabId]?.label ?? '';
    this.simModalExtraIsColor = this.extraLabelMap[tabId]?.isColor ?? false;
    this.simForm = { name: '', description: '', isActive: true, extra: '' };
    this.simErrors = {};
    this.simModalEditing = null;
    this.simModalOpen = true;
  }

  openSimEdit(tabId: string, item: SimpleEntity): void {
    this.simModalKey = tabId;
    this.simModalLabel = this.activeTabs.find((tab) => tab.id === tabId)?.label ?? tabId;
    this.simModalExtraLabel = this.extraLabelMap[tabId]?.label ?? '';
    this.simModalExtraIsColor = this.extraLabelMap[tabId]?.isColor ?? false;
    this.simForm = { name: item.name, description: item.description, isActive: item.isActive, extra: item.extra ?? '' };
    this.simErrors = {};
    this.simModalEditing = item;
    this.simModalOpen = true;
  }

  saveSim(): void {
    const errors: Record<string, string> = {};
    if (!this.simForm.name.trim()) {
      errors['name'] = `${this.simModalLabel} name is required.`;
    }

    if (Object.keys(errors).length) {
      this.simErrors = errors;
      return;
    }

    const payload = this.toApiPayload(this.simModalKey, {
      ...this.simModalEditing,
      ...this.simForm,
    });
    const request = this.simModalEditing
      ? this.masterDataService.update(this.simModalKey, payload)
      : this.masterDataService.create(this.simModalKey, payload);

    request.subscribe({
      next: (res) => {
        this.showToast(res?.message || `${this.simForm.name} ${this.simModalEditing ? 'updated' : 'saved'}.`);
        this.simModalOpen = false;
        this.loadTabData(this.simModalKey);
      },
      error: (error) => {
        this.showToast(error?.error?.message || `${this.simModalLabel} API is not ready yet.`);
      },
    });
  }

  toggleSim(tabId: string, id: string): void {
    const items = this.simpleData[tabId] ?? [];
    const item = items.find((entry) => entry.id === id);
    if (!item) {
      return;
    }

    this.masterDataService.update(tabId, this.toApiPayload(tabId, { ...item, isActive: !item.isActive })).subscribe({
      next: (res) => {
        this.showToast(res?.message || 'Status updated.');
        this.loadTabData(tabId);
      },
      error: (error) => {
        this.showToast(error?.error?.message || `${this.activeTabLabel} API is not ready yet.`);
      },
    });
  }

  loadTabData(tabId: string, silent = false): void {
    if (this.loadingTabs.has(tabId)) {
      return;
    }

    this.loadingTabs.add(tabId);
    this.masterDataService.getAll(tabId).subscribe({
      next: (res) => {
        this.setTabData(tabId, res?.data || []);
        this.loadingTabs.delete(tabId);
      },
      error: () => {
        this.setTabData(tabId, []);
        this.loadingTabs.delete(tabId);
        if (!silent) {
          this.showToast(`${this.activeTabLabel || tabId} API is not ready yet.`);
        }
      },
    });
  }

  private loadReferenceData(): void {
    this.masterDataService.getAll('companies').subscribe({
      next: (res) => {
        this.companies = res?.data || [];
      },
      error: () => {
        this.companies = [];
      },
    });

    this.masterDataService.getAll('regions').subscribe({
      next: (res) => {
        this.regions = (res?.data || []).map((item: any) => ({
          id: String(item.regionId ?? item.id),
          name: item.regionName ?? item.name ?? '',
          companyId: item.companyId,
        }));
      },
      error: () => {
        this.regions = [];
      },
    });

    this.loadTabData('countries', true);
    this.loadTabData('states', true);
  }

  private setTabData(tabId: string, rows: any[]): void {
    switch (tabId) {
      case 'countries':
        this.countries = rows.map((row) => this.toCountry(row));
        break;
      case 'states':
        this.states = rows.map((row) => this.toState(row));
        break;
      case 'cities':
        this.cities = rows.map((row) => this.toCity(row));
        break;
      case 'currencies':
        this.currencies = rows.map((row) => this.toCurrency(row));
        break;
      case 'timezones':
        this.timezones = rows.map((row) => this.toTimeZone(row));
        break;
      case 'languages':
        this.languages = rows.map((row) => this.toLanguage(row));
        break;
      case 'nationalities':
        this.nationalities = rows.map((row) => this.toNationality(row));
        break;
      default:
        this.simpleData[tabId] = rows.map((row) => this.toSimpleEntity(row));
        break;
    }
  }

  private toCountry(row: any): Country {
    const code = row.countryCode ?? row.code ?? row.iso2 ?? '';
    return {
      ...row,
      id: String(row.countryId ?? row.id),
      regionId: String(row.regionId ?? ''),
      name: row.countryName ?? row.name ?? '',
      iso2: row.iso2 ?? code,
      iso3: row.iso3 ?? code,
      phoneCode: row.phoneCode ?? '+',
      currencyId: String(row.currencyId ?? ''),
      isActive: row.isActive ?? true,
    };
  }

  private toState(row: any): State {
    return {
      ...row,
      id: String(row.stateId ?? row.id),
      countryId: String(row.countryId ?? ''),
      name: row.stateName ?? row.name ?? '',
      code: row.stateCode ?? row.code ?? '',
      isActive: row.isActive ?? true,
    };
  }

  private toCity(row: any): City {
    return {
      ...row,
      id: String(row.cityId ?? row.id),
      stateId: String(row.stateId ?? ''),
      countryId: String(row.countryId ?? ''),
      name: row.cityName ?? row.name ?? '',
      isActive: row.isActive ?? true,
    };
  }

  private toCurrency(row: any): Currency {
    return {
      ...row,
      id: String(row.currencyId ?? row.id),
      name: row.currencyName ?? row.name ?? '',
      code: row.currencyCode ?? row.code ?? '',
      symbol: row.currencySymbol ?? row.symbol ?? '',
      decimals: row.decimalPlaces ?? row.decimals ?? 2,
      isDefault: row.isDefault ?? false,
      isActive: row.isActive ?? true,
    };
  }

  private toTimeZone(row: any): TimeZone {
    return {
      ...row,
      id: String(row.timeZoneId ?? row.timezoneId ?? row.id),
      name: row.timeZoneName ?? row.name ?? '',
      offset: row.offset ?? '',
      abbreviation: row.abbreviation ?? '',
      isActive: row.isActive ?? true,
    };
  }

  private toLanguage(row: any): Language {
    return {
      ...row,
      id: String(row.languageId ?? row.id),
      name: row.languageName ?? row.name ?? '',
      code: row.languageCode ?? row.code ?? '',
      nativeName: row.nativeName ?? '',
      isActive: row.isActive ?? true,
    };
  }

  private toNationality(row: any): Nationality {
    return {
      ...row,
      id: String(row.nationalityId ?? row.id),
      name: row.nationalityName ?? row.name ?? '',
      countryId: String(row.countryId ?? ''),
      isActive: row.isActive ?? true,
    };
  }

  private toSimpleEntity(row: any): SimpleEntity {
    return {
      ...row,
      id: String(row.id ?? row.masterId ?? row[`${this.activeSubTab}Id`] ?? row[`${this.activeSubTab.slice(0, -1)}Id`] ?? ''),
      name: row.name ?? row.masterName ?? row.title ?? '',
      description: row.description ?? '',
      extra: row.extra ?? row.code ?? row.color ?? row.rate ?? '',
      isActive: row.isActive ?? true,
    };
  }

  showToast(message: string): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toast = message;
    this.toastTimer = setTimeout(() => {
      this.toast = null;
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }

  trackById(_: number, item: any): string {
    return item.id;
  }

  private clearSeedData(): void {
    this.regions = [];
    this.countries = [];
    this.states = [];
    this.cities = [];
    this.currencies = [];
    this.timezones = [];
    this.languages = [];
    this.nationalities = [];
    Object.keys(this.simpleData).forEach((key) => {
      this.simpleData[key] = [];
    });
  }

  private defaultCompanyId(): number {
    return Number(this.companies[0]?.companyId ?? this.companies[0]?.id ?? 0);
  }

  private companyIdForRegion(regionId: string): number {
    return Number(this.regions.find((region) => region.id === String(regionId))?.companyId ?? this.defaultCompanyId());
  }

  private toApiPayload(tabId: string, form: any): any {
    switch (tabId) {
      case 'countries':
        return {
          countryId: Number(form.countryId ?? form.id ?? 0),
          companyId: Number(form.companyId ?? this.companyIdForRegion(form.regionId)),
          regionId: Number(form.regionId ?? 0),
          countryName: form.name ?? form.countryName ?? '',
          countryCode: form.countryCode ?? form.iso2 ?? form.code ?? '',
          isActive: form.isActive ?? true,
        };
      case 'states': {
        const country = this.countries.find((item) => item.id === String(form.countryId));
        return {
          stateId: Number(form.stateId ?? form.id ?? 0),
          companyId: Number(form.companyId ?? this.companyIdForRegion(form.regionId || country?.regionId)),
          regionId: Number(form.regionId ?? country?.regionId ?? 0),
          countryId: Number(form.countryId ?? 0),
          stateName: form.name ?? form.stateName ?? '',
          stateCode: form.code ?? form.stateCode ?? '',
          isActive: form.isActive ?? true,
        };
      }
      case 'cities': {
        const country = this.countries.find((item) => item.id === String(form.countryId));
        return {
          cityId: Number(form.cityId ?? form.id ?? 0),
          companyId: Number(form.companyId ?? this.companyIdForRegion(form.regionId || country?.regionId)),
          regionId: Number(form.regionId ?? country?.regionId ?? 0),
          countryId: Number(form.countryId ?? 0),
          stateId: Number(form.stateId ?? 0),
          cityName: form.name ?? form.cityName ?? '',
          isActive: form.isActive ?? true,
        };
      }
      case 'currencies':
        return {
          currencyId: Number(form.currencyId ?? form.id ?? 0),
          currencyName: form.name ?? form.currencyName ?? '',
          currencyCode: form.code ?? form.currencyCode ?? '',
          currencySymbol: form.symbol ?? form.currencySymbol ?? '',
          decimalPlaces: Number(form.decimals ?? form.decimalPlaces ?? 2),
          isDefault: form.isDefault ?? false,
          isActive: form.isActive ?? true,
        };
      case 'timezones':
        return {
          timeZoneId: Number(form.timeZoneId ?? form.timezoneId ?? form.id ?? 0),
          timeZoneName: form.name ?? form.timeZoneName ?? '',
          offset: form.offset ?? '',
          abbreviation: form.abbreviation ?? '',
          isActive: form.isActive ?? true,
        };
      case 'languages':
        return {
          languageId: Number(form.languageId ?? form.id ?? 0),
          languageName: form.name ?? form.languageName ?? '',
          languageCode: form.code ?? form.languageCode ?? '',
          nativeName: form.nativeName ?? '',
          isActive: form.isActive ?? true,
        };
      case 'nationalities':
        return {
          nationalityId: Number(form.nationalityId ?? form.id ?? 0),
          nationalityName: form.name ?? form.nationalityName ?? '',
          countryId: Number(form.countryId ?? 0),
          isActive: form.isActive ?? true,
        };
      default:
        return {
          id: Number(form.id ?? 0),
          name: form.name ?? '',
          description: form.description ?? '',
          extra: form.extra ?? '',
          isActive: form.isActive ?? true,
        };
    }
  }

  private resetFilters(): void {
    this.search = '';
    this.statusFilter = 'all';
    this.regionFilter = 'all';
    this.countryFilter = 'all';
    this.stateFilter = 'all';
  }

  private getGeoRaw(): any[] {
    return this.getGeoRawFor(this.activeSubTab);
  }

  private getGeoRawFor(tab: string): any[] {
    switch (tab) {
      case 'countries':
        return this.countries;
      case 'states':
        return this.states;
      case 'cities':
        return this.cities;
      case 'currencies':
        return this.currencies;
      case 'timezones':
        return this.timezones;
      case 'languages':
        return this.languages;
      case 'nationalities':
        return this.nationalities;
      default:
        return [];
    }
  }

  private getCategoryTotal(category: CategoryId): number {
    return TAB_MAP[category].reduce((sum, tab) => {
      if (category === 'geographic') {
        return sum + this.getGeoRawFor(tab.id).length;
      }
      return sum + (this.simpleData[tab.id]?.length ?? 0);
    }, 0);
  }

  private getCategoryActive(category: CategoryId): number {
    return TAB_MAP[category].reduce((sum, tab) => {
      if (category === 'geographic') {
        return sum + this.getGeoRawFor(tab.id).filter((item: any) => item.isActive).length;
      }
      return sum + (this.simpleData[tab.id] ?? []).filter((item) => item.isActive).length;
    }, 0);
  }

  private applyGeoSave(form: any): void {
    const tab = this.geoModalTab;
    const update = (items: any[], setter: (value: any[]) => void) => {
      if (this.geoModalEditing) {
        setter(items.map((item) => {
          if (item.id === this.geoModalEditing.id) {
            return { ...item, ...form };
          }
          return tab === 'currencies' && form.isDefault ? { ...item, isDefault: false } : item;
        }));
        return;
      }

      const next = { id: `${tab[0]}${Date.now()}`, ...form };
      setter(tab === 'currencies' && form.isDefault
        ? [...items.map((item: any) => ({ ...item, isDefault: false })), next]
        : [...items, next]
      );
    };

    switch (tab) {
      case 'countries':
        update(this.countries, (value) => this.countries = value);
        break;
      case 'states':
        update(this.states, (value) => this.states = value);
        break;
      case 'cities':
        update(this.cities, (value) => this.cities = value);
        break;
      case 'currencies':
        update(this.currencies, (value) => this.currencies = value);
        break;
      case 'timezones':
        update(this.timezones, (value) => this.timezones = value);
        break;
      case 'languages':
        update(this.languages, (value) => this.languages = value);
        break;
      case 'nationalities':
        update(this.nationalities, (value) => this.nationalities = value);
        break;
    }
  }
}
