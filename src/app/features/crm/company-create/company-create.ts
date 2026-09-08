import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-company-create',
  imports: [CommonModule,FormsModule],
  templateUrl: './company-create.html',
  styleUrl: './company-create.css',
})
export class CompanyCreate {
  
  /* =========================================================
     FORM MODEL
  ========================================================= */

  company = {

    // ---------------------------------------------------------
    // COMPANY INFORMATION
    // ---------------------------------------------------------

    companyName: '',
    legalName: '',
    industry: '',
    companyType: '',
    website: '',
    phone: '',
    email: '',
    employees: '',
    annualRevenue: '',
    description: '',

    // ---------------------------------------------------------
    // ADDRESS
    // ---------------------------------------------------------

    address: {

      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: 'India',
      postalCode: ''

    },

    // ---------------------------------------------------------
    // REGISTRATION / SOCIAL
    // ---------------------------------------------------------

    linkedin: '',
    gstNumber: '',
    panNumber: '',

    // ---------------------------------------------------------
    // PRIMARY CONTACT
    // ---------------------------------------------------------

    primaryContactName: '',
    primaryContactDesignation: '',
    primaryContactEmail: '',
    primaryContactPhone: ''

  };


  /* =========================================================
     DROPDOWN DATA
  ========================================================= */

  industries: string[] = [

    'Technology',
    'Information Technology',
    'Software',
    'Manufacturing',
    'Healthcare',
    'Finance',
    'Banking',
    'Insurance',
    'Retail',
    'Education',
    'Real Estate',
    'Construction',
    'Telecommunications',
    'Logistics',
    'Consulting',
    'Marketing',
    'Automotive',
    'Pharmaceutical',
    'Hospitality',
    'Other'

  ];


  companyTypes: string[] = [

    'Private Limited',
    'Public Limited',
    'Partnership',
    'LLP',
    'Proprietorship',
    'Startup',
    'Government',
    'Non-Profit',
    'Other'

  ];


  countries: string[] = [

    'India',
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Singapore',
    'United Arab Emirates',
    'Germany',
    'France',
    'Japan',
    'Other'

  ];


  states: string[] = [

    'Andhra Pradesh',
    'Telangana',
    'Karnataka',
    'Tamil Nadu',
    'Maharashtra',
    'Delhi',
    'Gujarat',
    'Kerala',
    'West Bengal',
    'Rajasthan',
    'Odisha',
    'Punjab',
    'Haryana',
    'Uttar Pradesh',
    'Other'

  ];


  employeeRanges: string[] = [

    '1 - 10',
    '11 - 50',
    '51 - 200',
    '201 - 500',
    '501 - 1000',
    '1001 - 5000',
    '5000+'

  ];


  revenueRanges: string[] = [

    'Below ₹10 Lakhs',
    '₹10 Lakhs - ₹1 Crore',
    '₹1 Crore - ₹10 Crores',
    '₹10 Crores - ₹50 Crores',
    '₹50 Crores - ₹100 Crores',
    '₹100 Crores+'

  ];


  /* =========================================================
     UI STATE
  ========================================================= */

  submitted = false;

  isSaving = false;

  currentSection = 'basic';


  /* =========================================================
     CONSTRUCTOR
  ========================================================= */

  constructor(
    private router: Router
  ) {}


  /* =========================================================
     SECTION NAVIGATION
  ========================================================= */

  setSection(section: string): void {

    this.currentSection = section;

    setTimeout(() => {

      const element =
        document.getElementById(section);

      if (element) {

        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

      }

    }, 50);

  }


  /* =========================================================
     CREATE COMPANY
  ========================================================= */

  createCompany(): void {

    this.submitted = true;

    if (!this.isFormValid()) {

      this.currentSection = 'basic';

      return;

    }

    this.isSaving = true;


    const companyId =
      this.generateCompanyId();


    const newCompany = {

      id: companyId,

      name: this.company.companyName,

      legalName: this.company.legalName,

      industry: this.company.industry,

      companyType: this.company.companyType,

      website: this.company.website,

      phone: this.company.phone,

      email: this.company.email,

      employees: this.company.employees,

      annualRevenue: this.company.annualRevenue,

      description: this.company.description,


      // -------------------------------------------------------
      // ADDRESS
      // -------------------------------------------------------

      address: {

        addressLine1:
          this.company.address.addressLine1,

        addressLine2:
          this.company.address.addressLine2,

        city:
          this.company.address.city,

        state:
          this.company.address.state,

        country:
          this.company.address.country,

        postalCode:
          this.company.address.postalCode

      },


      // -------------------------------------------------------
      // REGISTRATION
      // -------------------------------------------------------

      linkedin:
        this.company.linkedin,

      gstNumber:
        this.company.gstNumber,

      panNumber:
        this.company.panNumber,


      // -------------------------------------------------------
      // PRIMARY CONTACT
      // -------------------------------------------------------

      primaryContact: {

        name:
          this.company.primaryContactName,

        designation:
          this.company.primaryContactDesignation,

        email:
          this.company.primaryContactEmail,

        phone:
          this.company.primaryContactPhone

      },


      // -------------------------------------------------------
      // CRM INFORMATION
      // -------------------------------------------------------

      contacts: 0,

      status: 'Prospect',

      color: 'blue',

      initials:
        this.getCompanyInitials(),

      createdAt:
        new Date().toISOString()

    };


    console.log(
      'CORCRM COMPANY CREATED:',
      newCompany
    );


    /* =========================================================
       STATIC STORAGE
       Later replace this with CompanyService API.
    ========================================================= */

    localStorage.setItem(
      'corcrm_new_company',
      JSON.stringify(newCompany)
    );


    localStorage.setItem(
      'corcrm_last_company_id',
      companyId
    );


    /* =========================================================
       REDIRECT TO COMPANY DETAILS
    ========================================================= */

    setTimeout(() => {

      this.isSaving = false;

      this.router.navigate([
        '/crm/company-details',
        companyId
      ]);

    }, 500);

  }


  /* =========================================================
     SAVE & CREATE ANOTHER
  ========================================================= */

  saveAndCreateAnother(): void {

    this.submitted = true;

    if (!this.isFormValid()) {

      return;

    }

    this.isSaving = true;


    const companyId =
      this.generateCompanyId();


    const newCompany = {

      id: companyId,

      name: this.company.companyName,

      legalName: this.company.legalName,

      industry: this.company.industry,

      companyType: this.company.companyType,

      website: this.company.website,

      phone: this.company.phone,

      email: this.company.email,

      employees: this.company.employees,

      annualRevenue: this.company.annualRevenue,

      description: this.company.description,

      address: {

        addressLine1:
          this.company.address.addressLine1,

        addressLine2:
          this.company.address.addressLine2,

        city:
          this.company.address.city,

        state:
          this.company.address.state,

        country:
          this.company.address.country,

        postalCode:
          this.company.address.postalCode

      },

      linkedin:
        this.company.linkedin,

      gstNumber:
        this.company.gstNumber,

      panNumber:
        this.company.panNumber,

      primaryContact: {

        name:
          this.company.primaryContactName,

        designation:
          this.company.primaryContactDesignation,

        email:
          this.company.primaryContactEmail,

        phone:
          this.company.primaryContactPhone

      },

      contacts: 0,

      status: 'Prospect',

      color: 'blue',

      initials:
        this.getCompanyInitials(),

      createdAt:
        new Date().toISOString()

    };


    console.log(
      'COMPANY CREATED:',
      newCompany
    );


    localStorage.setItem(
      'corcrm_new_company',
      JSON.stringify(newCompany)
    );


    setTimeout(() => {

      this.isSaving = false;

      this.resetForm();

    }, 500);

  }


  /* =========================================================
     VALIDATION
  ========================================================= */

  isFormValid(): boolean {

    return !!(

      this.company.companyName?.trim() &&

      this.company.industry &&

      this.company.companyType &&

      this.company.address.city?.trim() &&

      this.company.address.country

    );

  }


  /* =========================================================
     REQUIRED FIELD ERROR
  ========================================================= */

  isRequiredInvalid(
    value: string
  ): boolean {

    return (
      this.submitted &&
      !value?.trim()
    );

  }


  /* =========================================================
     EMAIL VALIDATION
  ========================================================= */

  isValidEmail(
    email: string
  ): boolean {

    if (!email) {

      return true;

    }

    const pattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(email);

  }


  /* =========================================================
     PHONE VALIDATION
  ========================================================= */

  isValidPhone(
    phone: string
  ): boolean {

    if (!phone) {

      return true;

    }

    const cleaned =
      phone.replace(/\D/g, '');

    return cleaned.length >= 10;

  }


  /* =========================================================
     WEBSITE NORMALIZATION
  ========================================================= */

  normalizeWebsite(): void {

    if (

      this.company.website &&

      !this.company.website
        .startsWith('http://') &&

      !this.company.website
        .startsWith('https://')

    ) {

      this.company.website =
        'https://' +
        this.company.website;

    }

  }


  /* =========================================================
     COMPANY INITIALS
  ========================================================= */

  getCompanyInitials(): string {

    const name =
      this.company.companyName?.trim();

    if (!name) {

      return 'CO';

    }


    const words =
      name
        .split(' ')
        .filter(
          word => word.length > 0
        );


    if (words.length === 1) {

      return words[0]
        .substring(0, 2)
        .toUpperCase();

    }


    return (

      words[0].charAt(0) +

      words[1].charAt(0)

    ).toUpperCase();

  }


  /* =========================================================
     COMPANY ID
  ========================================================= */

  private generateCompanyId(): string {

    const number =
      Math.floor(
        1000 +
        Math.random() * 9000
      );

    return `COMP-${number}`;

  }


  /* =========================================================
     CANCEL
  ========================================================= */

  cancel(): void {

    this.router.navigate([
      '/crm/companies'
    ]);

  }


  /* =========================================================
     BACK TO COMPANY LIST
  ========================================================= */

  backToCompanies(): void {

    this.router.navigate([
      '/crm/companies'
    ]);

  }


  /* =========================================================
     OPEN LAST COMPANY
  ========================================================= */

  openCompanyDetails(): void {

    const companyId =
      localStorage.getItem(
        'corcrm_last_company_id'
      );


    if (companyId) {

      this.router.navigate([
        '/crm/company-details',
        companyId
      ]);

    }

  }


  /* =========================================================
     RESET FORM
  ========================================================= */

  resetForm(): void {

    this.company = {

      companyName: '',
      legalName: '',
      industry: '',
      companyType: '',
      website: '',
      phone: '',
      email: '',
      employees: '',
      annualRevenue: '',
      description: '',

      address: {

        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: 'India',
        postalCode: ''

      },

      linkedin: '',
      gstNumber: '',
      panNumber: '',

      primaryContactName: '',
      primaryContactDesignation: '',
      primaryContactEmail: '',
      primaryContactPhone: ''

    };


    this.submitted = false;

    this.currentSection = 'basic';

  }
}
