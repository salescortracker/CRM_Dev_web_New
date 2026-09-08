import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-prospects',
  imports: [CommonModule,FormsModule],
  templateUrl: './prospects.html',
  styleUrl: './prospects.css',
})
export class Prospects {
  searchText = '';

  searchType = 'Company';

  companies = [
    {
      id: 'CMP-1001',
      name: 'TechNova Solutions',
      industry: 'Technology',
      city: 'Hyderabad',
      country: 'India',
      website: 'www.technova.com',
      contacts: 12,
      initials: 'TS',
      color: 'blue'
    },
    {
      id: 'CMP-1002',
      name: 'CloudMatrix Pvt Ltd',
      industry: 'IT Services',
      city: 'Bengaluru',
      country: 'India',
      website: 'www.cloudmatrix.in',
      contacts: 8,
      initials: 'CM',
      color: 'purple'
    },
    {
      id: 'CMP-1003',
      name: 'FinEdge Technologies',
      industry: 'FinTech',
      city: 'Hyderabad',
      country: 'India',
      website: 'www.finedge.com',
      contacts: 5,
      initials: 'FT',
      color: 'green'
    },
    {
      id: 'CMP-1004',
      name: 'BrightWorks India',
      industry: 'Manufacturing',
      city: 'Chennai',
      country: 'India',
      website: 'www.brightworks.in',
      contacts: 7,
      initials: 'BI',
      color: 'orange'
    },
    {
      id: 'CMP-1005',
      name: 'Vertex Global',
      industry: 'Consulting',
      city: 'Mumbai',
      country: 'India',
      website: 'www.vertexglobal.com',
      contacts: 4,
      initials: 'VG',
      color: 'red'
    }
  ];

  contacts = [
    {
      id: 'CON-2001',
      name: 'Arjun Reddy',
      designation: 'CTO',
      company: 'TechNova Solutions',
      email: 'arjun@technova.com',
      phone: '+91 98765 43210',
      city: 'Hyderabad',
      initials: 'AR',
      color: 'blue'
    },
    {
      id: 'CON-2002',
      name: 'Priya Sharma',
      designation: 'HR Manager',
      company: 'CloudMatrix Pvt Ltd',
      email: 'priya@cloudmatrix.in',
      phone: '+91 99887 66554',
      city: 'Bengaluru',
      initials: 'PS',
      color: 'purple'
    },
    {
      id: 'CON-2003',
      name: 'Vikram Kumar',
      designation: 'Procurement Manager',
      company: 'FinEdge Technologies',
      email: 'vikram@finedge.com',
      phone: '+91 91234 56789',
      city: 'Hyderabad',
      initials: 'VK',
      color: 'green'
    },
    {
      id: 'CON-2004',
      name: 'Neha Singh',
      designation: 'Operations Head',
      company: 'BrightWorks India',
      email: 'neha@brightworks.in',
      phone: '+91 90012 34567',
      city: 'Chennai',
      initials: 'NS',
      color: 'orange'
    }
  ];

  constructor(private router: Router) {}

  setSearchType(type: string): void {
    this.searchType = type;
    this.searchText = '';
  }

  get filteredCompanies() {

    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.companies;
    }

    return this.companies.filter(company =>
      company.name.toLowerCase().includes(search) ||
      company.industry.toLowerCase().includes(search) ||
      company.city.toLowerCase().includes(search)
    );
  }

  get filteredContacts() {

    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.contacts;
    }

    return this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(search) ||
      contact.company.toLowerCase().includes(search) ||
      contact.email.toLowerCase().includes(search) ||
      contact.phone.includes(search)
    );
  }

  openCompany(company: any): void {

    this.router.navigate(
      ['/company-details', company.id]
    );
  }

  openContact(contact: any): void {

    this.router.navigate(
      ['/contact-details', contact.id]
    );
  }

  createCompany(): void {

    this.router.navigate(
      ['/company-list']
    );
  }

  createContact(): void {

    this.router.navigate(
      ['/contact-list']
    );
  }
}
