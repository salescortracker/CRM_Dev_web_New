import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-company-list',
  imports: [CommonModule,FormsModule],
  templateUrl: './company-list.html',
  styleUrl: './company-list.css',
})
export class CompanyList {
   searchText = '';
  industryFilter = '';
  statusFilter = '';

  companies = [

    {
      id: 'COM-1001',
      name: 'ABC Technologies',
      initials: 'AT',
      color: 'blue',
      industry: 'Technology',
      city: 'Hyderabad',
      country: 'India',
      contacts: 12,
      status: 'Prospect',
      owner: 'Rajesh Kumar',
      ownerInitials: 'RK'
    },

    {
      id: 'COM-1002',
      name: 'Nova Financial Services',
      initials: 'NF',
      color: 'green',
      industry: 'Finance',
      city: 'Mumbai',
      country: 'India',
      contacts: 8,
      status: 'Active',
      owner: 'Priya Sharma',
      ownerInitials: 'PS'
    },

    {
      id: 'COM-1003',
      name: 'Vertex Healthcare',
      initials: 'VH',
      color: 'purple',
      industry: 'Healthcare',
      city: 'Bangalore',
      country: 'India',
      contacts: 15,
      status: 'Prospect',
      owner: 'John Smith',
      ownerInitials: 'JS'
    },

    {
      id: 'COM-1004',
      name: 'Global Manufacturing Ltd',
      initials: 'GM',
      color: 'orange',
      industry: 'Manufacturing',
      city: 'Chennai',
      country: 'India',
      contacts: 21,
      status: 'Active',
      owner: 'Rajesh Kumar',
      ownerInitials: 'RK'
    }

  ];


  get filteredCompanies() {

    const search = this.searchText.toLowerCase().trim();

    return this.companies.filter(company => {

      const matchesSearch =
        !search ||
        company.name.toLowerCase().includes(search) ||
        company.industry.toLowerCase().includes(search) ||
        company.city.toLowerCase().includes(search) ||
        company.country.toLowerCase().includes(search);

      const matchesIndustry =
        !this.industryFilter ||
        company.industry === this.industryFilter;

      const matchesStatus =
        !this.statusFilter ||
        company.status === this.statusFilter;

      return (
        matchesSearch &&
        matchesIndustry &&
        matchesStatus
      );

    });

  }


  get totalContacts(): number {

    return this.companies.reduce(
      (total, company) => total + company.contacts,
      0
    );

  }


  get activeProspects(): number {

    return this.companies.filter(
      x => x.status === 'Prospect'
    ).length;

  }


  get convertedLeads(): number {

    return this.companies.filter(
      x => x.status === 'Active'
    ).length;

  }


  constructor(
    private router: Router
  ) {}


  createCompany() {

    this.router.navigate([
      '/company-create'
    ]);

  }


  openCompany() {

    this.router.navigate([
      '/company-details'
     
    ]);

  }


  clearFilters() {

    this.searchText = '';
    this.industryFilter = '';
    this.statusFilter = '';

  }


  exportCompanies() {

    console.log('Export companies');

  }
}
