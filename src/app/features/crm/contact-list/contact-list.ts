import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactDto, ContactService } from '../services/contact.service';
import { Alertservice } from '../../../core/services/alertservice';

@Component({
  selector: 'app-contact-list',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactList implements OnInit {

  searchText = '';
  companyFilter = '';
  statusFilter = '';

  contacts: ContactDto[] = [];

  isLoading = false;

  private readonly avatarColors = ['blue', 'green', 'purple', 'orange', 'red'];

  constructor(
    private router: Router,
    private contactService: ContactService,
    private alert: Alertservice,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  // ================= GET ALL =================

  loadContacts(): void {

    this.isLoading = true;

    this.contactService.getContacts().subscribe({

      next: (res) => {

        this.contacts = res?.success && res.data ? res.data : [];

        this.isLoading = false;

        this.cd.detectChanges();
      },

      error: (err) => {

        this.isLoading = false;

        this.alert.error(err?.error?.message || 'Failed to load contacts.');

        this.cd.detectChanges();
      }
    });
  }

  // ================= FILTERS =================

  get companies(): string[] {

    const names = this.contacts
      .map(x => x.companyName)
      .filter((x): x is string => !!x);

    return Array.from(new Set(names)).sort();
  }

  get filteredContacts(): ContactDto[] {

    const search = this.searchText.trim().toLowerCase();

    return this.contacts.filter(contact => {

      const matchesSearch =
        !search ||
        [
          this.getContactName(contact),
          contact.contactNumber,
          contact.companyName,
          contact.designation,
          contact.department,
          contact.businessEmail,
          contact.phone,
          contact.alternatePhone
        ].some(v => (v || '').toLowerCase().includes(search));

      const matchesCompany =
        !this.companyFilter ||
        contact.companyName === this.companyFilter;

      const matchesStatus =
        !this.statusFilter ||
        this.getStatus(contact) === this.statusFilter;

      return matchesSearch && matchesCompany && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchText = '';
    this.companyFilter = '';
    this.statusFilter = '';
  }

  // ================= SUMMARY =================

  get activeContacts(): number {
    return this.contacts.filter(x => x.isActive).length;
  }

  get inactiveContacts(): number {
    return this.contacts.filter(x => !x.isActive).length;
  }

  get companyCount(): number {
    return this.companies.length;
  }

  // ================= DISPLAY HELPERS =================

  getContactName(contact: ContactDto): string {
    return `${contact.firstName || ''} ${contact.lastName || ''}`.trim();
  }

  getStatus(contact: ContactDto): string {
    return contact.isActive ? 'Active' : 'Inactive';
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

  getAvatarColor(contact: ContactDto): string {
    return this.avatarColors[contact.contactInformationId % this.avatarColors.length];
  }

  // ================= NAVIGATION =================

  createContact(): void {
    this.router.navigate(['/contact-create']);
  }

  editContact(contact: ContactDto): void {
    this.router.navigate(['/contact-create'], {
      queryParams: { id: contact.contactInformationId }
    });
  }

  openContact(contact: ContactDto): void {
    this.router.navigate(['/contact-details'], {
      queryParams: { id: contact.contactInformationId }
    });
  }

  // ================= DELETE =================

  deleteContact(contact: ContactDto): void {

    this.alert.deleteConfirm().then(result => {

      if (!result.isConfirmed) {
        return;
      }

      this.contactService.deleteContact(contact.contactInformationId).subscribe({

        next: (res) => {

          if (res?.success) {
            this.alert.success(res.message || 'Contact deleted successfully.');
            this.loadContacts();
          } else {
            this.alert.error(res?.message || 'Failed to delete contact.');
          }
        },

        error: (err) => {
          this.alert.error(err?.error?.message || 'Failed to delete contact.');
        }
      });
    });
  }
}
