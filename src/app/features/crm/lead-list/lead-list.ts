import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;

  company: string;
  industry: string;

  contact: string;
  contactEmail: string;

  source: string;

  status:
    | 'New'
    | 'Contacted'
    | 'Qualified'
    | 'Proposal'
    | 'Negotiation'
    | 'Lost';

  rating:
    | 'Hot'
    | 'Warm'
    | 'Cold';

  owner: string;

  createdDate: string;
}
@Component({
  selector: 'app-lead-list',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './lead-list.html',
  styleUrl: './lead-list.css',
})
export class LeadList {
    // =========================================================
  // SEARCH / FILTER
  // =========================================================

  searchText: string = '';

  selectedStatus: string = 'All';

  selectedRating: string = 'All';

  selectedOwner: string = 'All';


  // =========================================================
  // VIEW
  // =========================================================

  isCardView: boolean = false;


  // =========================================================
  // SELECTION
  // =========================================================

  selectedLeads: number[] = [];

  allSelected: boolean = false;


  // =========================================================
  // LEADS
  // =========================================================

  leads: Lead[] = [

    {
      id: 1,
      name: 'Ravi Kumar',
      email: 'ravi.kumar@abctech.com',
      phone: '+91 98765 43210',

      company: 'ABC Technologies',
      industry: 'IT Services',

      contact: 'Ravi Kumar',
      contactEmail: 'ravi.kumar@abctech.com',

      source: 'Website',

      status: 'New',

      rating: 'Hot',

      owner: 'Admin',

      createdDate: '18 Aug 2026'
    },


    {
      id: 2,
      name: 'Suresh Reddy',
      email: 'suresh@xyzsolutions.com',
      phone: '+91 99887 66554',

      company: 'XYZ Solutions',
      industry: 'Software',

      contact: 'Suresh Reddy',
      contactEmail: 'suresh@xyzsolutions.com',

      source: 'Referral',

      status: 'Contacted',

      rating: 'Warm',

      owner: 'John Smith',

      createdDate: '17 Aug 2026'
    },


    {
      id: 3,
      name: 'Priya Sharma',
      email: 'priya@techsolutions.com',
      phone: '+91 98761 23456',

      company: 'Tech Solutions',
      industry: 'Technology',

      contact: 'Priya Sharma',
      contactEmail: 'priya@techsolutions.com',

      source: 'Campaign',

      status: 'Qualified',

      rating: 'Hot',

      owner: 'Admin',

      createdDate: '16 Aug 2026'
    },


    {
      id: 4,
      name: 'Arun Kumar',
      email: 'arun@globalsystems.com',
      phone: '+91 91234 56789',

      company: 'Global Systems',
      industry: 'Enterprise',

      contact: 'Arun Kumar',
      contactEmail: 'arun@globalsystems.com',

      source: 'LinkedIn',

      status: 'Proposal',

      rating: 'Hot',

      owner: 'David Wilson',

      createdDate: '15 Aug 2026'
    },


    {
      id: 5,
      name: 'Meena Rani',
      email: 'meena@smartbusiness.com',
      phone: '+91 90123 45678',

      company: 'Smart Business Pvt Ltd',
      industry: 'Consulting',

      contact: 'Meena Rani',
      contactEmail: 'meena@smartbusiness.com',

      source: 'Google Ads',

      status: 'Negotiation',

      rating: 'Warm',

      owner: 'John Smith',

      createdDate: '14 Aug 2026'
    },


    {
      id: 6,
      name: 'Kiran Rao',
      email: 'kiran@innovatech.com',
      phone: '+91 93456 78901',

      company: 'Innovatech',
      industry: 'Technology',

      contact: 'Kiran Rao',
      contactEmail: 'kiran@innovatech.com',

      source: 'Website',

      status: 'New',

      rating: 'Cold',

      owner: 'Admin',

      createdDate: '13 Aug 2026'
    },


    {
      id: 7,
      name: 'Vikram Singh',
      email: 'vikram@nextgen.com',
      phone: '+91 98876 54321',

      company: 'NextGen Systems',
      industry: 'IT Services',

      contact: 'Vikram Singh',
      contactEmail: 'vikram@nextgen.com',

      source: 'Referral',

      status: 'Contacted',

      rating: 'Warm',

      owner: 'David Wilson',

      createdDate: '12 Aug 2026'
    },


    {
      id: 8,
      name: 'Anjali Patel',
      email: 'anjali@digitalworld.com',
      phone: '+91 97654 32109',

      company: 'Digital World',
      industry: 'Digital Marketing',

      contact: 'Anjali Patel',
      contactEmail: 'anjali@digitalworld.com',

      source: 'Campaign',

      status: 'Qualified',

      rating: 'Hot',

      owner: 'John Smith',

      createdDate: '11 Aug 2026'
    },


    {
      id: 9,
      name: 'Rajesh Verma',
      email: 'rajesh@enterprise.com',
      phone: '+91 96543 21098',

      company: 'Enterprise Corp',
      industry: 'Manufacturing',

      contact: 'Rajesh Verma',
      contactEmail: 'rajesh@enterprise.com',

      source: 'Trade Show',

      status: 'Lost',

      rating: 'Cold',

      owner: 'Admin',

      createdDate: '10 Aug 2026'
    },


    {
      id: 10,
      name: 'Sneha Reddy',
      email: 'sneha@futuretech.com',
      phone: '+91 95432 10987',

      company: 'FutureTech',
      industry: 'Software',

      contact: 'Sneha Reddy',
      contactEmail: 'sneha@futuretech.com',

      source: 'Website',

      status: 'New',

      rating: 'Warm',

      owner: 'David Wilson',

      createdDate: '09 Aug 2026'
    }

  ];


  // =========================================================
  // FILTERED DATA
  // =========================================================

  filteredLeads: Lead[] = [];


  constructor(
    private router: Router
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.filteredLeads = [...this.leads];

  }


  // =========================================================
  // SUMMARY
  // =========================================================

  get totalLeads(): number {

    return this.leads.length;

  }


  get newLeads(): number {

    return this.leads.filter(
      x => x.status === 'New'
    ).length;

  }


  get contactedLeads(): number {

    return this.leads.filter(
      x => x.status === 'Contacted'
    ).length;

  }


  get qualifiedLeads(): number {

    return this.leads.filter(
      x => x.status === 'Qualified'
    ).length;

  }


  get hotLeads(): number {

    return this.leads.filter(
      x => x.rating === 'Hot'
    ).length;

  }


  // =========================================================
  // SEARCH / FILTER
  // =========================================================

  applyFilters(): void {

    const search = this.searchText
      .trim()
      .toLowerCase();


    this.filteredLeads = this.leads.filter(lead => {

      const matchesSearch =
        !search ||

        lead.name
          .toLowerCase()
          .includes(search) ||

        lead.email
          .toLowerCase()
          .includes(search) ||

        lead.phone
          .toLowerCase()
          .includes(search) ||

        lead.company
          .toLowerCase()
          .includes(search) ||

        lead.contact
          .toLowerCase()
          .includes(search);


      const matchesStatus =
        this.selectedStatus === 'All' ||
        lead.status === this.selectedStatus;


      const matchesRating =
        this.selectedRating === 'All' ||
        lead.rating === this.selectedRating;


      const matchesOwner =
        this.selectedOwner === 'All' ||
        lead.owner === this.selectedOwner;


      return (
        matchesSearch &&
        matchesStatus &&
        matchesRating &&
        matchesOwner
      );

    });


    this.clearSelection();

  }


  // =========================================================
  // CLEAR SEARCH
  // =========================================================

  clearSearch(): void {

    this.searchText = '';

    this.applyFilters();

  }


  // =========================================================
  // RESET FILTER
  // =========================================================

  resetFilters(): void {

    this.searchText = '';

    this.selectedStatus = 'All';

    this.selectedRating = 'All';

    this.selectedOwner = 'All';

    this.filteredLeads = [...this.leads];

    this.clearSelection();

  }


  // =========================================================
  // REFRESH
  // =========================================================

 


  // =========================================================
  // INITIALS
  // =========================================================

  getInitials(value: string): string {

    if (!value) {
      return '';
    }

    const words = value.trim().split(' ');

    if (words.length === 1) {

      return words[0]
        .substring(0, 2)
        .toUpperCase();

    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();

  }


  // =========================================================
  // STATUS CLASS
  // =========================================================

  getStatusClass(status: string): string {

    switch (status) {

      case 'New':
        return 'status-new';

      case 'Contacted':
        return 'status-contacted';

      case 'Qualified':
        return 'status-qualified';

      case 'Proposal':
        return 'status-proposal';

      case 'Negotiation':
        return 'status-negotiation';

      case 'Lost':
        return 'status-lost';

      default:
        return '';

    }

  }


  // =========================================================
  // RATING CLASS
  // =========================================================

  getRatingClass(rating: string): string {

    switch (rating) {

      case 'Hot':
        return 'rating-hot';

      case 'Warm':
        return 'rating-warm';

      case 'Cold':
        return 'rating-cold';

      default:
        return '';

    }

  }


  // =========================================================
  // SELECT
  // =========================================================

  toggleSelection(
    id: number,
    event: Event
  ): void {

    const checkbox =
      event.target as HTMLInputElement;


    if (checkbox.checked) {

      if (!this.selectedLeads.includes(id)) {

        this.selectedLeads.push(id);

      }

    } else {

      this.selectedLeads =
        this.selectedLeads.filter(
          x => x !== id
        );

    }


    this.updateSelectAll();

  }


  // =========================================================
  // SELECT ALL
  // =========================================================

  toggleAllSelection(event: Event): void {

    const checkbox =
      event.target as HTMLInputElement;


    if (checkbox.checked) {

      this.selectedLeads =
        this.filteredLeads.map(
          x => x.id
        );

    } else {

      this.selectedLeads = [];

    }


    this.allSelected = checkbox.checked;

  }


  // =========================================================
  // UPDATE SELECT ALL
  // =========================================================

  updateSelectAll(): void {

    this.allSelected =
      this.filteredLeads.length > 0 &&
      this.selectedLeads.length ===
      this.filteredLeads.length;

  }


  // =========================================================
  // IS SELECTED
  // =========================================================

  isSelected(id: number): boolean {

    return this.selectedLeads.includes(id);

  }


  // =========================================================
  // CLEAR SELECTION
  // =========================================================

  clearSelection(): void {

    this.selectedLeads = [];

    this.allSelected = false;

  }


  // =========================================================
  // BULK DELETE
  // =========================================================

  bulkDelete(): void {

    if (this.selectedLeads.length === 0) {
      return;
    }


    this.leads = this.leads.filter(
      lead =>
        !this.selectedLeads.includes(lead.id)
    );


    this.clearSelection();

    this.applyFilters();

  }


  // =========================================================
  // DELETE LEAD
  // =========================================================

  deleteLead(lead: Lead): void {

    this.leads = this.leads.filter(
      x => x.id !== lead.id
    );


    this.applyFilters();

  }


  // =========================================================
  // VIEW LEAD
  // =========================================================

  viewLead(lead: Lead): void {

    this.router.navigate([
      '/leads-details'
    ]);

  }
  


  // =========================================================
  // EDIT LEAD
  // =========================================================

  editLead(lead: Lead): void {

    this.router.navigate([
      '/leads-create',
      'edit',
      lead.id
    ]);

  }


  // =========================================================
  // CREATE LEAD
  // =========================================================

  createLead(): void {
  this.router.navigate(['/leads-create']);
}
  openLead(): void {

    this.router.navigate([
      '/leads-details'
      
    ]);

  }
viewLeadDetails(lead: Lead): void {

  this.router.navigate([
    '/lead-details',
    lead.id
  ]);

}
loadLeads(): void {

  this.filteredLeads = [...this.leads];

  this.clearSelection();

}
refreshLeads(): void {

  this.searchText = '';

  this.selectedStatus = 'All';

  this.selectedRating = 'All';

  this.selectedOwner = 'All';

  this.loadLeads();

}


  // =========================================================
  // CALL LEAD
  // =========================================================

  callLead(lead: Lead): void {

    window.location.href =
      'tel:' + lead.phone;

  }


  // =========================================================
  // CARD / TABLE VIEW
  // =========================================================

  toggleView(): void {

    this.isCardView =
      !this.isCardView;

  }
}
