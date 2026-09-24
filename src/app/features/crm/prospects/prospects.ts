import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CompanyInformationDto, CompanyService } from '../services/company.service';
import { ContactDto, ContactService } from '../services/contact.service';
import { Alertservice } from '../../../core/services/alertservice';

@Component({
  selector: 'app-prospects',
  imports: [CommonModule, FormsModule],
  templateUrl: './prospects.html',
  styleUrl: './prospects.css',
})
export class Prospects implements OnInit {

  searchText = '';

  searchType = 'Company';

  companies: CompanyInformationDto[] = [];

  contacts: ContactDto[] = [];

  isLoading = false;

  private readonly avatarColors = ['blue', 'purple', 'green', 'orange', 'red'];

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private contactService: ContactService,
    private alert: Alertservice,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  // ================= LOAD =================

  loadData(): void {

    this.isLoading = true;

    let pending = 2;

    const done = () => {

      if (--pending === 0) {
        this.isLoading = false;
      }

      this.cd.detectChanges();
    };

    this.companyService.getCompanies().subscribe({

      next: res => {
        this.companies = res?.success && res.data ? res.data : [];
        done();
      },

      error: err => {
        this.alert.error(err?.error?.message || 'Failed to load companies.');
        done();
      }
    });

    this.contactService.getContacts().subscribe({

      next: res => {
        this.contacts = res?.success && res.data ? res.data : [];
        done();
      },

      error: err => {
        this.alert.error(err?.error?.message || 'Failed to load contacts.');
        done();
      }
    });
  }

  setSearchType(type: string): void {
    this.searchType = type;
    this.searchText = '';
  }

  // ================= FILTERS =================

  get filteredCompanies(): CompanyInformationDto[] {

    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.companies;
    }

    return this.companies.filter(company =>
      [
        company.companyName,
        company.legalCompanyName,
        company.industryName,
        company.city,
        company.website
      ].some(v => (v || '').toLowerCase().includes(search))
    );
  }

  get filteredContacts(): ContactDto[] {

    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.contacts;
    }

    return this.contacts.filter(contact =>
      [
        this.getContactName(contact),
        contact.contactNumber,
        contact.companyName,
        contact.designation,
        contact.businessEmail,
        contact.phone
      ].some(v => (v || '').toLowerCase().includes(search))
    );
  }

  // ================= DISPLAY HELPERS =================

  getContactName(contact: ContactDto): string {
    return `${contact.firstName || ''} ${contact.lastName || ''}`.trim();
  }

  getContactCount(company: CompanyInformationDto): number {
    return this.contacts.filter(
      x => x.companyInformationId === company.companyInformationId
    ).length;
  }

  getInitials(value: string): string {

    const words = (value || '').trim().split(/\s+/).filter(w => w.length > 0);

    if (words.length === 0) {
      return '';
    }

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  }

  getColor(id: number): string {
    return this.avatarColors[id % this.avatarColors.length];
  }

  // ================= NAVIGATION =================

  openCompany(company: CompanyInformationDto): void {

    this.router.navigate(['/company-details'], {
      queryParams: { id: company.companyInformationId }
    });
  }

  openContact(contact: ContactDto): void {

    this.router.navigate(['/contact-details'], {
      queryParams: { id: contact.contactInformationId }
    });
  }

  createCompany(): void {
    this.router.navigate(['/company-create']);
  }

  createContact(): void {
    this.router.navigate(['/contact-create']);
  }
}
