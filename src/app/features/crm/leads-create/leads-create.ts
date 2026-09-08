import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
interface LeadActivity {
  type: string;
  title: string;
  date: string;
  user: string;
}

interface Lead {
  id: number;

  leadName: string;
  companyName: string;

  contactName: string;
  phone: string;
  email: string;
  website: string;

  source: string;
  status: string;
  priority: string;

  owner: string;
  ownerInitials: string;

  nextFollowUp: string;
  followUpStatus: string;

  value: number;
  expectedRevenue: number;

  industry: string;
  createdDate: string;

  notes: string;

  favorite: boolean;

  activity: LeadActivity[];
}
@Component({
  selector: 'app-leads-create',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './leads-create.html',
  styleUrl: './leads-create.css',
})
export class LeadsCreate {
   /* =========================================================
     STATIC LEAD DATA
     ========================================================= */

  lead = {

    firstName: 'Arjun',

    lastName: 'Reddy',

    owner: 'Sanjay Kumar',

    email: 'arjun@technova.com',

    phone: '+91 98765 43210',

    source: 'Website',

    status: 'New',

    score: 75,

    industry: 'Technology',

    companyName: 'TechNova Solutions',

    website: 'https://technova.com',

    companyIndustry: 'Technology',

    companySize: '51-200',

    city: 'Hyderabad',

    country: 'India',

    expectedValue: '5,00,000',

    expectedClose: '2026-09-30',

    description:
      'Potential enterprise customer interested in CRM automation, sales management and business process automation.'

  };


  /* =========================================================
     STATIC DROPDOWNS
     ========================================================= */

  owners = [
    'Sanjay Kumar',
    'Anil Mehta',
    'Rahul Menon',
    'Ravi Sharma',
    'Vivek Kumar'
  ];


  leadSources = [
    'Website',
    'LinkedIn',
    'Campaign',
    'Referral',
    'Cold Call',
    'Email',
    'Advertisement',
    'Partner'
  ];


  leadStatuses = [
    'New',
    'Contacted',
    'Qualified',
    'Nurturing',
    'Unqualified',
    'Lost'
  ];


  industries = [
    'Technology',
    'IT Services',
    'FinTech',
    'Manufacturing',
    'Healthcare',
    'Retail',
    'Education',
    'Consulting',
    'Real Estate'
  ];


  companySizes = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+'
  ];


  countries = [
    'India',
    'United States',
    'United Kingdom',
    'Australia',
    'Singapore',
    'United Arab Emirates'
  ];


  /* =========================================================
     CREATE LEAD
     ========================================================= */

  createLead(): void {

    console.log('Lead Created:', this.lead);

    /*
      For now static only.

      Later:

      POST /api/leads

      After successful creation:
      navigate to:

      /crm/leads/LD-10285
    */
  }


  /* =========================================================
     CANCEL
     ========================================================= */

  cancel(): void {

    console.log('Cancel lead creation');

  }


  /* =========================================================
     INITIALS
     ========================================================= */

  getInitials(): string {

    const first =
      this.lead.firstName
        ? this.lead.firstName.charAt(0)
        : 'L';

    const last =
      this.lead.lastName
        ? this.lead.lastName.charAt(0)
        : 'D';

    return (first + last).toUpperCase();
  }

}



