import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../../../../core/authentication/services/auth.service';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { Alertservice } from '../../../../core/services/alertservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../shared/pagination/pagination';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule,
    FormsModule, Pagination],
  templateUrl: './company.html',
  styleUrl: './company.css',
})
export class Company {
  companies: any[] = [];
  submitted = false;
  // page = 1;
  // pageSize = 3;
  totalRecords = 0;
  searchText = '';

  page = 1;

  pageSize = 5;


  company: any = {
    companyId: 0,
    companyName: '',
    companyCode: '',
    industryType: '',
    headquarters: '',
    companyEmail: '',
    companyContact: '',
    companyAddress: '',
    companyLogo: '',
    planId: null,
    planStartDate: '',
    expiryDate: '',
    isDefault: 0,
    isActive: true
  };

  isEdit = false;

  constructor(
    private authService: AuthService,
    private spinner: Spinnerservice,
    private alert: Alertservice,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(page: number = 1) {
    this.page = page;

    this.spinner.show();

    this.authService.getCompanies().subscribe({

      next: (res) => {

        this.spinner.hide();

        this.companies = (res.data || []).sort(
          (a: any, b: any) => b.companyId - a.companyId
        );
        this.totalRecords = this.companies.length;




        this.cd.detectChanges();
      },

      error: (err) => {

        this.spinner.hide();

        this.alert.error(err.error.message);

      }

    });

  }

  saveCompany() {

    // if (!this.company.companyName) {

    //   this.alert.warning("Company Name Required");

    //   return;

    // }
    this.submitted = true;

    if (
      !this.company.companyName ||
      !this.company.planStartDate ||
      !this.company.expiryDate ||
      !this.company.companyCode
    ) {

      return;

    }
    this.spinner.show();

    if (!this.isEdit) {

      this.authService.createCompany(this.company)
        .subscribe({

          next: (res) => {

            this.spinner.hide();


            this.alert.success(res.message).then(() => {

              this.page = 1;

              this.loadCompanies();

              this.clear();

            });

          },

          error: (err) => {

            this.spinner.hide();

            this.alert.error(err.error.message);

          }

        });

    }

    else {

      this.authService.updateCompany(this.company)
        .subscribe({

          next: (res) => {

            this.spinner.hide();
            this.company = res.data;

            this.isEdit = true;

            this.submitted = false;

            this.alert.success(res.message).then(() => {

              this.page = 1;

              this.loadCompanies();

              this.clear();

            });

          },

          error: (err) => {

            this.spinner.hide();

            this.alert.error(err.error.message);

          }

        });

    }

  }

  edit(id: number) {

    this.spinner.show();

    this.authService.getCompanyById(id)
      .subscribe({

        next: (res) => {

          this.spinner.hide();

          this.company = res.data;

          this.isEdit = true;

        },

        error: (err) => {

          this.spinner.hide();

          this.alert.error(err.error.message);

        }

      });

  }

  delete(id: number) {

    this.alert.deleteConfirm().then(result => {

      if (result.isConfirmed) {

        this.spinner.show();

        this.authService.deleteCompany(id)
          .subscribe({

            next: (res) => {

              this.spinner.hide();

              this.alert.success(res.message).then(() => {

                this.loadCompanies(this.page);

              });

            },

            error: (err) => {

              this.spinner.hide();

              this.alert.error(err.error.message);

            }

          });

      }

    });

  }

  clear() {

    this.company = {
      companyId: 0,
      companyName: '',
      companyCode: '',
      industryType: '',
      headquarters: '',
      companyEmail: '',
      companyContact: '',
      companyAddress: '',
      companyLogo: '',
      planId: null,
      planStartDate: '',
      expiryDate: '',
      isDefault: 0,
      isActive: true
    };

    this.isEdit = false;

    // Reset validation
    this.submitted = false;
  }
  get filteredCompanies() {

    return this.companies.filter(x =>

      x.companyName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

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
