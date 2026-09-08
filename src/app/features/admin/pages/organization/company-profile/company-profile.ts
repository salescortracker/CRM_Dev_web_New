import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './company-profile.html',
  styleUrl: './company-profile.css',
})
export class CompanyProfile {
  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = '';

  companies: any[] = [];

  company: any = {

    companyId: 0,

    companyName: '',
    companyCode: '',
    legalName: '',
    registrationNumber: '',
    gstNumber: '',
    panNumber: '',

    industry: '',
    companyType: '',
    establishedDate: '',

    email: '',
    phone: '',
    mobile: '',
    website: '',

    address1: '',
    address2: '',

    country: '',
    state: '',
    city: '',
    pincode: '',

    timeZone: 'Asia/Kolkata',
    currency: 'INR',
    financialYear: '2026-2027',

    description: '',

    isActive: true

  };

  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.loadCompanies();

  }

  loadCompanies() {

    this.spinner.show();

    setTimeout(() => {

      this.companies = [

        {
          companyId: 1,

          companyName: 'ABC Technologies Pvt Ltd',
          companyCode: 'ABC001',
          legalName: 'ABC Technologies Private Limited',

          registrationNumber: 'REG100001',
          gstNumber: '36ABCDE1234F1Z5',
          panNumber: 'ABCDE1234F',

          industry: 'Information Technology',
          companyType: 'Private Limited',
          establishedDate: '2017-05-15',

          email: 'info@abctech.com',
          phone: '04012345678',
          mobile: '9876543210',
          website: 'www.abctech.com',

          address1: 'Madhapur',
          address2: 'Hitech City',

          country: 'India',
          state: 'Telangana',
          city: 'Hyderabad',
          pincode: '500081',

          timeZone: 'Asia/Kolkata',
          currency: 'INR',
          financialYear: '2026-2027',

          description: 'Software Development Company',

          isActive: true

        },

        {
          companyId: 2,

          companyName: 'Global InfoTech',
          companyCode: 'GIT002',
          legalName: 'Global InfoTech Solutions LLP',

          registrationNumber: 'REG100002',
          gstNumber: '29ABCDE5678G1Z8',
          panNumber: 'BCDEA5678G',

          industry: 'Information Technology',
          companyType: 'LLP',
          establishedDate: '2019-08-12',

          email: 'contact@globalinfotech.com',
          phone: '08045678912',
          mobile: '9123456789',
          website: 'www.globalinfotech.com',

          address1: 'Whitefield',
          address2: 'IT Park',

          country: 'India',
          state: 'Karnataka',
          city: 'Bengaluru',
          pincode: '560066',

          timeZone: 'Asia/Kolkata',
          currency: 'INR',
          financialYear: '2026-2027',

          description: 'Cloud & ERP Solutions',

          isActive: true

        },

        {
          companyId: 3,

          companyName: 'Future Vision Pvt Ltd',
          companyCode: 'FV003',
          legalName: 'Future Vision Private Limited',

          registrationNumber: 'REG100003',
          gstNumber: '37ABCDE9988A1Z2',
          panNumber: 'ABCDE9988A',

          industry: 'Finance',
          companyType: 'Private Limited',
          establishedDate: '2015-03-20',

          email: 'info@futurevision.com',
          phone: '08661234567',
          mobile: '9988776655',
          website: 'www.futurevision.com',

          address1: 'Benz Circle',
          address2: 'MG Road',

          country: 'India',
          state: 'Andhra Pradesh',
          city: 'Vijayawada',
          pincode: '520010',

          timeZone: 'Asia/Kolkata',
          currency: 'INR',
          financialYear: '2026-2027',

          description: 'Financial Consulting Services',

          isActive: true

        },

        {
          companyId: 4,

          companyName: 'NextGen Pvt Ltd',
          companyCode: 'NG004',
          legalName: 'NextGen Technologies Pvt Ltd',

          registrationNumber: 'REG100004',
          gstNumber: '27ABCDE1234L1Z4',
          panNumber: 'ABCDE1234L',

          industry: 'Telecommunications',
          companyType: 'Private Limited',
          establishedDate: '2016-11-10',

          email: 'support@nextgen.com',
          phone: '02244556677',
          mobile: '9000011111',
          website: 'www.nextgen.com',

          address1: 'Andheri East',
          address2: 'MIDC',

          country: 'India',
          state: 'Maharashtra',
          city: 'Mumbai',
          pincode: '400093',

          timeZone: 'Asia/Kolkata',
          currency: 'INR',
          financialYear: '2026-2027',

          description: 'Telecommunication Solutions',

          isActive: false

        },

        {
          companyId: 5,

          companyName: 'Bright Solutions',
          companyCode: 'BS005',
          legalName: 'Bright Solutions India Pvt Ltd',

          registrationNumber: 'REG100005',
          gstNumber: '33ABCDE8888P1Z6',
          panNumber: 'ABCDE8888P',

          industry: 'Healthcare',
          companyType: 'Private Limited',
          establishedDate: '2020-01-05',

          email: 'admin@brightsolutions.com',
          phone: '04422334455',
          mobile: '9555555555',
          website: 'www.brightsolutions.com',

          address1: 'T Nagar',
          address2: 'Anna Salai',

          country: 'India',
          state: 'Tamil Nadu',
          city: 'Chennai',
          pincode: '600017',

          timeZone: 'Asia/Kolkata',
          currency: 'INR',
          financialYear: '2026-2027',

          description: 'Healthcare Software Provider',

          isActive: true

        }

      ];

      this.companies.sort(
        (a, b) => b.companyId - a.companyId
      );

      this.totalRecords = this.companies.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }
    saveCompany() {

    this.submitted = true;

    if (
      !this.company.companyName ||
      !this.company.companyCode ||
      !this.company.industry ||
      !this.company.companyType ||
      !this.company.email ||
      !this.company.phone ||
      !this.company.address1 ||
      !this.company.country ||
      !this.company.state ||
      !this.company.city
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newCompany = {

          ...this.company,

          companyId: this.companies.length
            ? Math.max(...this.companies.map(x => x.companyId)) + 1
            : 1

        };

        this.companies.unshift(newCompany);

      } else {

        const index = this.companies.findIndex(
          x => x.companyId === this.company.companyId
        );

        if (index !== -1) {

          this.companies[index] = {
            ...this.company
          };

        }

      }

      this.companies = [...this.companies];

      this.totalRecords = this.companies.length;

      this.page = 1;

      const isUpdate = this.isEdit;

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(
        isUpdate
          ? 'Company updated successfully.'
          : 'Company created successfully.'
      );

    }, 500);

  }

  edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.companies.find(
        x => x.companyId === id
      );

      if (selected) {

        this.company = {

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

          this.companies = this.companies.filter(
            x => x.companyId !== id
          );

          this.totalRecords = this.companies.length;

          if (
            this.page > 1 &&
            this.pagedCompanies.length === 0
          ) {

            this.page--;

          }

          this.companies = [...this.companies];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Company deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.company = {

      companyId: 0,

      companyName: '',
      companyCode: '',
      legalName: '',
      registrationNumber: '',
      gstNumber: '',
      panNumber: '',

      industry: '',
      companyType: '',
      establishedDate: '',

      email: '',
      phone: '',
      mobile: '',
      website: '',

      address1: '',
      address2: '',

      country: '',
      state: '',
      city: '',
      pincode: '',

      timeZone: 'Asia/Kolkata',
      currency: 'INR',
      financialYear: '2026-2027',

      description: '',

      isActive: true

    };

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredCompanies() {

    return this.companies.filter(x =>

      x.companyName.toLowerCase().includes(this.searchText.toLowerCase())

      ||

      x.companyCode.toLowerCase().includes(this.searchText.toLowerCase())

      ||

      x.legalName.toLowerCase().includes(this.searchText.toLowerCase())

      ||

      x.industry.toLowerCase().includes(this.searchText.toLowerCase())

      ||

      x.companyType.toLowerCase().includes(this.searchText.toLowerCase())

      ||

      x.email.toLowerCase().includes(this.searchText.toLowerCase())

      ||

      x.phone.toLowerCase().includes(this.searchText.toLowerCase())

      ||

      x.country.toLowerCase().includes(this.searchText.toLowerCase())

      ||

      x.state.toLowerCase().includes(this.searchText.toLowerCase())

      ||

      x.city.toLowerCase().includes(this.searchText.toLowerCase())

    );

  }

  get pagedCompanies() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredCompanies.slice(
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
