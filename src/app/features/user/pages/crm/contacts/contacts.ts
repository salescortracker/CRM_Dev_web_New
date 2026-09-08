import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
})
export class Contacts {
  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = '';

  contacts: any[] = [];

  contact: any = {

    contactId: 0,
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    account: '',
    designation: '',
    department: '',
    leadSource: '',
    dob: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    status: '',
    isActive: true

  };

  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice, private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.loadContacts();

  }

  loadContacts() {

    this.spinner.show();

    setTimeout(() => {

      this.contacts = [

        {
          contactId: 1,
          firstName: 'Rahul',
          lastName: 'Sharma',
          mobile: '9876543210',
          email: 'rahul@abctech.com',
          account: 'ABC Technologies',
          designation: 'Project Manager',
          department: 'IT',
          leadSource: 'Website',
          dob: '1993-06-12',
          address: 'Madhapur',
          city: 'Hyderabad',
          state: 'Telangana',
          country: 'India',
          pincode: '500081',
          status: 'Active',
          isActive: true
        },
        {
          contactId: 2,
          firstName: 'Priya',
          lastName: 'Reddy',
          mobile: '9988776655',
          email: 'priya@xyzsolutions.com',
          account: 'XYZ Solutions',
          designation: 'HR Manager',
          department: 'Human Resources',
          leadSource: 'LinkedIn',
          dob: '1994-09-18',
          address: 'Whitefield',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          pincode: '560066',
          status: 'Active',
          isActive: true
        },
        {
          contactId: 3,
          firstName: 'Arjun',
          lastName: 'Kumar',
          mobile: '9123456780',
          email: 'arjun@futurevision.com',
          account: 'Future Vision',
          designation: 'Business Analyst',
          department: 'Sales',
          leadSource: 'Referral',
          dob: '1992-03-25',
          address: 'Baner',
          city: 'Pune',
          state: 'Maharashtra',
          country: 'India',
          pincode: '411045',
          status: 'Inactive',
          isActive: false
        },
        {
          contactId: 4,
          firstName: 'Sneha',
          lastName: 'Patel',
          mobile: '9000011111',
          email: 'sneha@globalinfo.com',
          account: 'Global InfoTech',
          designation: 'Marketing Executive',
          department: 'Marketing',
          leadSource: 'Facebook',
          dob: '1996-01-08',
          address: 'Andheri',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          pincode: '400053',
          status: 'Active',
          isActive: true
        },
        {
          contactId: 5,
          firstName: 'Kiran',
          lastName: 'Verma',
          mobile: '9556677889',
          email: 'kiran@nextgen.com',
          account: 'NextGen Pvt Ltd',
          designation: 'Software Engineer',
          department: 'Development',
          leadSource: 'Google',
          dob: '1998-12-10',
          address: 'Gachibowli',
          city: 'Hyderabad',
          state: 'Telangana',
          country: 'India',
          pincode: '500032',
          status: 'Active',
          isActive: true
        }

      ];

      this.contacts.sort((a, b) => b.contactId - a.contactId);

      this.totalRecords = this.contacts.length;

      this.spinner.hide();
      this.cd.detectChanges();

    }, 500);

  }

  saveContact() {

    this.submitted = true;

    if (
      !this.contact.firstName ||
      !this.contact.lastName ||
      !this.contact.mobile ||
      !this.contact.email ||
      !this.contact.account ||
      !this.contact.status
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newContact = {
          ...this.contact,
          contactId: this.contacts.length
            ? Math.max(...this.contacts.map(x => x.contactId)) + 1
            : 1
        };

        this.contacts.unshift(newContact);

      }
      else {

        const index = this.contacts.findIndex(
          x => x.contactId === this.contact.contactId
        );

        if (index !== -1) {
          this.contacts[index] = {
            ...this.contact
          };
        }

      }

      this.contacts = [...this.contacts];

      this.totalRecords = this.contacts.length;

      this.page = 1;

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(
        this.isEdit
          ? 'Contact updated successfully.'
          : 'Contact created successfully.'
      );

    }, 500);

  }

  edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.contacts.find(
        x => x.contactId === id
      );

      if (selected) {

        this.contact = {
          ...selected
        };

        this.isEdit = true;

        this.submitted = false;

        this.cd.detectChanges();

      }

      this.spinner.hide();

    }, 300);

  }

  delete(id: number) {

    this.alert.deleteConfirm().then(result => {

      if (result.isConfirmed) {

        this.spinner.show();

        setTimeout(() => {

          this.contacts = this.contacts.filter(
            x => x.contactId !== id
          );

          this.totalRecords = this.contacts.length;

          if (
            this.page > 1 &&
            this.pagedContacts.length === 0
          ) {
            this.page--;
          }

          this.contacts = [...this.contacts];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success('Contact deleted successfully.');

        }, 500);

      }

    });

  }

  clear() {

    this.contact = {

      contactId: 0,
      firstName: '',
      lastName: '',
      mobile: '',
      email: '',
      account: '',
      designation: '',
      department: '',
      leadSource: '',
      dob: '',
      address: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      status: '',
      isActive: true

    };

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredContacts() {

    return this.contacts.filter(x =>

      (x.firstName + ' ' + x.lastName)
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.mobile
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.email
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.account
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.designation
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.department
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

    );

  }

  get pagedContacts() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredContacts.slice(

      start,

      start + this.pageSize

    );

  }

  changePage(page: number) {

    this.page = page;

  }

  changePageSize(size: number) {

    this.pageSize = size;

    this.page = 1;

  }


}
