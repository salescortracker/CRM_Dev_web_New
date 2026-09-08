import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../shared/pagination/pagination';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { Spinnerservice } from '../../../core/services/spinnerservice';
import { Alertservice } from '../../../core/services/alertservice';

@Component({
  selector: 'app-region',
  imports: [CommonModule,
    FormsModule,
    Pagination],
  templateUrl: './region.html',
  styleUrl: './region.css',
})
export class Region {
  companies: any[] = [];
  regions: any[] = [];

  submitted = false;

  page = 1;
  pageSize = 10;

  totalRecords = 0;

  searchText = '';

  isEdit = false;

  region: any = {
    regionId: 0,
    companyId: 0,
    regionName: '',
    country: '',
    regionCode: '',
    contactPerson: '',
    email: '',
    phoneNumber: '',
    address: '',
    isActive: true
  };

  constructor(
    private authService: AuthService,
    private spinner: Spinnerservice,
    private alert: Alertservice,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.loadCompanies();

    this.loadRegions();

  }

  //=============================
  // Load Companies Dropdown
  //=============================

  loadCompanies() {

    this.authService.getCompanies().subscribe({

      next: (res) => {

        this.companies = (res.data || []).filter(
          (x: any) => x.isActive === true
        );

      },

      error: (err) => {

        this.alert.error(err.error.message);

      }

    });

  }

  //=============================
  // Load Regions
  //=============================

  loadRegions(page: number = 1) {

    this.page = page;

    this.spinner.show();

    this.authService.getRegions().subscribe({

      next: (res) => {

        this.spinner.hide();

        this.regions = (res.data || []).sort(

          (a: any, b: any) => b.regionId - a.regionId

        );

        this.totalRecords = this.regions.length;

        this.cd.detectChanges();

      },

      error: (err) => {

        this.spinner.hide();

        this.alert.error(err.error.message);

      }

    });

  }

  //=============================
  // Save / Update
  //=============================

  saveRegion() {

    this.submitted = true;

    if (

      !this.region.companyId ||

      !this.region.regionName

    ) {

      return;

    }

    this.spinner.show();

    if (!this.isEdit) {

      this.authService.createRegion(this.region)

        .subscribe({

          next: (res) => {

            this.spinner.hide();

            this.alert.success(res.message).then(() => {

              this.page = 1;

              this.loadRegions();

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

      this.authService.updateRegion(this.region)

        .subscribe({

          next: (res) => {

            this.spinner.hide();

            this.submitted = false;

            this.alert.success(res.message).then(() => {

              this.page = 1;

              this.loadRegions();

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
  //=============================
  // Edit Region
  //=============================

  edit(id: number) {

    this.spinner.show();

    this.authService.getRegionById(id)
      .subscribe({

        next: (res) => {

          this.spinner.hide();

          this.region = res.data;

          this.isEdit = true;

          this.submitted = false;

        },

        error: (err) => {

          this.spinner.hide();

          this.alert.error(err.error.message);

        }

      });

  }

  //=============================
  // Delete Region
  //=============================

  delete(id: number) {

    this.alert.deleteConfirm().then(result => {

      if (result.isConfirmed) {

        this.spinner.show();

        this.authService.deleteRegion(id)
          .subscribe({

            next: (res) => {

              this.spinner.hide();

              this.alert.success(res.message).then(() => {

                this.loadRegions(this.page);

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

  //=============================
  // Clear
  //=============================

  clear() {

    this.region = {

      regionId: 0,
      companyId: 0,
      regionName: '',
      country: '',
      regionCode: '',
      contactPerson: '',
      email: '',
      phoneNumber: '',
      address: '',
      isActive: true

    };

    this.isEdit = false;

    this.submitted = false;

  }

  //=============================
  // Search
  //=============================

  get filteredRegions() {

    return this.regions.filter((x: any) =>

      x.regionName.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.companyName.toLowerCase().includes(this.searchText.toLowerCase())

    );

  }

  //=============================
  // Pagination
  //=============================

  get pagedRegions() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredRegions.slice(

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
