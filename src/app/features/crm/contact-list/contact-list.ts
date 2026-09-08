import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-contact-list',
 imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactList {
   searchText = '';
  companyFilter = '';
  statusFilter = '';

  contacts = [

    {
      id: 'CON-1001',
      name: 'Rajesh Kumar',
      initials: 'RK',
      color: 'blue',
      company: 'ABC Technologies',
      designation: 'Chief Executive Officer',
      department: 'Management',
      email: 'rajesh@abctech.com',
      phone: '+91 98765 43210',
      status: 'Active',
      owner: 'Arjun Rao',
      ownerInitials: 'AR'
    },

    {
      id: 'CON-1002',
      name: 'Priya Sharma',
      initials: 'PS',
      color: 'purple',
      company: 'ABC Technologies',
      designation: 'HR Director',
      department: 'Human Resources',
      email: 'priya@abctech.com',
      phone: '+91 98765 44321',
      status: 'Prospect',
      owner: 'Arjun Rao',
      ownerInitials: 'AR'
    },

    {
      id: 'CON-1003',
      name: 'Rahul Mehta',
      initials: 'RM',
      color: 'green',
      company: 'Finova Solutions',
      designation: 'Sales Director',
      department: 'Sales',
      email: 'rahul@finova.com',
      phone: '+91 99887 66554',
      status: 'Active',
      owner: 'Sneha Rao',
      ownerInitials: 'SR'
    },

    {
      id: 'CON-1004',
      name: 'Anita Reddy',
      initials: 'AR',
      color: 'orange',
      company: 'Medicare Systems',
      designation: 'Operations Manager',
      department: 'Operations',
      email: 'anita@medicare.com',
      phone: '+91 99881 22110',
      status: 'Prospect',
      owner: 'Arjun Rao',
      ownerInitials: 'AR'
    },

    {
      id: 'CON-1005',
      name: 'Vikram Singh',
      initials: 'VS',
      color: 'red',
      company: 'TechNova Labs',
      designation: 'CTO',
      department: 'Technology',
      email: 'vikram@technova.com',
      phone: '+91 98770 11122',
      status: 'Inactive',
      owner: 'Kiran Kumar',
      ownerInitials: 'KK'
    }

  ];


  companies = [
    'ABC Technologies',
    'Finova Solutions',
    'Medicare Systems',
    'TechNova Labs'
  ];


  get filteredContacts() {

    const search = this.searchText
      .trim()
      .toLowerCase();

    return this.contacts.filter(contact => {

      const matchesSearch =
        !search ||
        contact.name.toLowerCase().includes(search) ||
        contact.company.toLowerCase().includes(search) ||
        contact.designation.toLowerCase().includes(search) ||
        contact.email.toLowerCase().includes(search) ||
        contact.phone.toLowerCase().includes(search);

      const matchesCompany =
        !this.companyFilter ||
        contact.company === this.companyFilter;

      const matchesStatus =
        !this.statusFilter ||
        contact.status === this.statusFilter;

      return (
        matchesSearch &&
        matchesCompany &&
        matchesStatus
      );

    });

  }


  get activeContacts() {

    return this.contacts.filter(
      x => x.status === 'Active'
    ).length;

  }


  get prospects() {

    return this.contacts.filter(
      x => x.status === 'Prospect'
    ).length;

  }


  get convertedLeads() {

    return 3;

  }


  createContact() {

    this.router.navigate([
      'contact-create'
    ]);

  }


  openContact() {

    this.router.navigate([
      '/contact-details',
     
    ]);

  }


  clearFilters() {

    this.searchText = '';
    this.companyFilter = '';
    this.statusFilter = '';

  }


  exportContacts() {

    const headers = [
      'Contact',
      'Company',
      'Designation',
      'Email',
      'Phone',
      'Status',
      'Owner'
    ];

    const rows = this.contacts.map(x => [
      x.name,
      x.company,
      x.designation,
      x.email,
      x.phone,
      x.status,
      x.owner
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row =>
        row.map(value =>
          `"${value}"`
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob(
      [csv],
      {
        type: 'text/csv;charset=utf-8;'
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href = url;

    link.download =
      'CORCRM-Contacts.csv';

    link.click();

    window.URL.revokeObjectURL(url);

  }


  constructor(
    private router: Router
  ) {}
}
