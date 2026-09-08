import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-contact-create',
 imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './contact-create.html',
  styleUrl: './contact-create.css',
})
export class ContactCreate {
    companies = [
    'ABC Technologies',
    'Finova Solutions',
    'Medicare Systems',
    'TechNova Labs'
  ];


  contact = {

    firstName: '',
    lastName: '',

    designation: '',
    department: '',

    company: '',
    contactType: 'Decision Maker',
    relationship: 'Prospect',

    email: '',
    phone: '',
    alternatePhone: '',
    website: '',

    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',

    notes: ''

  };


  constructor(
    private router: Router
  ) {}


  saveContact() {

    if (
      !this.contact.firstName ||
      !this.contact.lastName ||
      !this.contact.company ||
      !this.contact.email ||
      !this.contact.phone
    ) {

      return;

    }


    console.log(
      'Contact saved:',
      this.contact
    );


    this.router.navigate([
      '/crm/contacts'
    ]);

  }


  cancel() {

    this.router.navigate([
      '/crm/contact-list'
    ]);

  }
}
