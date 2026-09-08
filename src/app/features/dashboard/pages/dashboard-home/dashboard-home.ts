import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../../core/authentication/services/auth.service';
import { LoginResponse } from '../../../../core/authentication/models/login-response.model';

interface StatCard {
  title: string;
  value: string;
  note: string;
  icon: string;
  tone: 'success' | 'muted' | 'danger';
}

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css',
})
export class DashboardHome {
   // =========================================================
  // USER
  // =========================================================

  userName = 'Dugra Prasad';

  // =========================================================
  // KPI DATA
  // =========================================================

  kpis = [
    {
      label: 'TOTAL LEADS',
      value: '1,284',
      growth: '18.4%',
      icon: 'fa-user-plus'
    },
    {
      label: 'OPPORTUNITIES',
      value: '286',
      growth: '12.7%',
      icon: 'fa-bullseye'
    },
    {
      label: 'PIPELINE VALUE',
      value: '$842K',
      growth: '24.8%',
      icon: 'fa-chart-line'
    },
    {
      label: 'CONVERSION RATE',
      value: '32.6%',
      growth: '4.2%',
      icon: 'fa-arrow-trend-up'
    }
  ];


  // =========================================================
  // SALES PIPELINE
  // =========================================================

  pipelineStages = [
    {
      name: 'New Leads',
      count: 128,
      value: '$182K potential',
      percentage: 82
    },
    {
      name: 'Qualified',
      count: 84,
      value: '$264K potential',
      percentage: 65
    },
    {
      name: 'Proposal',
      count: 42,
      value: '$196K potential',
      percentage: 48
    },
    {
      name: 'Negotiation',
      count: 21,
      value: '$118K potential',
      percentage: 32
    },
    {
      name: 'Won',
      count: 11,
      value: '$82K revenue',
      percentage: 24
    }
  ];


  // =========================================================
  // RECENT ACTIVITIES
  // =========================================================

  recentActivities = [
    {
      initials: 'AS',
      name: 'Alex Smith',
      activity: 'New lead created',
      time: '5m'
    },
    {
      initials: 'JD',
      name: 'John Davis',
      activity: 'Quotation sent',
      time: '18m'
    },
    {
      initials: 'RM',
      name: 'Rachel Miller',
      activity: 'Opportunity won',
      time: '42m'
    },
    {
      initials: 'MK',
      name: 'Michael King',
      activity: 'Follow-up scheduled',
      time: '1h'
    },
    {
      initials: 'SW',
      name: 'Sarah Wilson',
      activity: 'New contact added',
      time: '2h'
    }
  ];


  // =========================================================
  // CUSTOMER JOURNEY
  // =========================================================

  customerJourney = [
    {
      title: 'Lead',
      subtitle: 'Capture',
      icon: 'fa-user-plus'
    },
    {
      title: 'Contact',
      subtitle: 'Engage',
      icon: 'fa-address-book'
    },
    {
      title: 'Account',
      subtitle: 'Connect',
      icon: 'fa-building'
    },
    {
      title: 'Opportunity',
      subtitle: 'Qualify',
      icon: 'fa-bullseye'
    },
    {
      title: 'Quotation',
      subtitle: 'Propose',
      icon: 'fa-file-invoice'
    },
    {
      title: 'Revenue',
      subtitle: 'Grow',
      icon: 'fa-circle-check'
    }
  ];


  // =========================================================
  // TOP PERFORMERS
  // =========================================================

  topPerformers = [
    {
      initials: 'AS',
      name: 'Alex Smith',
      deals: 24,
      revenue: '$128K'
    },
    {
      initials: 'RM',
      name: 'Rachel Miller',
      deals: 21,
      revenue: '$114K'
    },
    {
      initials: 'JD',
      name: 'John Davis',
      deals: 18,
      revenue: '$96K'
    }
  ];


  // =========================================================
  // SALES SUMMARY
  // =========================================================

  salesSummary = [
    {
      label: 'New Leads',
      value: 128,
      percentage: 82
    },
    {
      label: 'Qualified',
      value: 84,
      percentage: 65
    },
    {
      label: 'Proposals',
      value: 42,
      percentage: 48
    },
    {
      label: 'Won Deals',
      value: 11,
      percentage: 24
    }
  ];

}
