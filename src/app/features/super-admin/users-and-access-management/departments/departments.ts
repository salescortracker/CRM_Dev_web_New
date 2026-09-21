import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { ControlsystemService } from '../../services/controlsystem-service';
import { AuthService } from '../../../../core/authentication/services/auth.service';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './departments.html',
  styleUrl: './departments.css',
})
export class Departments {
  constructor(
     private controlSystemService: ControlsystemService,
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef,
    private authService: AuthService
  ) {}



  // ==============================
  // Modal Controls
  // ==============================

  showModal = false;

  isEdit = false;

  editId = 0;



  // ==============================
  // Search
  // ==============================

  searchText = '';

  statusFilter = '';



  // ==============================
  // Static Department Data
  // ==============================

  departments:any[] = [];


  // ==============================
  // Company / Region Dropdown Data
  // ==============================

  // Active companies from the database.
  companies: any[] = [];

  // All active regions from the database.
  regions: any[] = [];

  // Active regions of the company selected in the form.
  companyRegions: any[] = [];


  // ==============================
  // Form Model
  // ==============================

  model: any = this.emptyModel();


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  ngOnInit(): void {

    this.loadCompanies();

    this.loadRegions();

    this.loadDepartments();

  }


  // =========================================================
  // COMPANY / REGION DROPDOWNS
  // =========================================================

  loadCompanies(): void {

    this.authService.getCompanies().subscribe({

      next: (res: any) => {

        this.companies = (res?.data || []).filter(
          (x: any) => x.isActive !== false
        );

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading companies:', err);

        this.companies = [];

      }

    });

  }


  loadRegions(): void {

    this.authService.getRegions().subscribe({

      next: (res: any) => {

        this.regions = (res?.data || []).filter(
          (x: any) => x.isActive !== false
        );

        // Regions may arrive after the edit modal opened.
        this.updateCompanyRegions();

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading regions:', err);

        this.regions = [];

        this.companyRegions = [];

      }

    });

  }


  // Only the regions that belong to the selected company.
  updateCompanyRegions(): void {

    const companyId = Number(this.model.companyId);

    this.companyRegions = companyId
      ? this.regions.filter(
          (r: any) => Number(r.companyId) === companyId
        )
      : [];

  }


  onCompanyChange(): void {

    this.model.regionId = null;

    this.updateCompanyRegions();

  }


  // =========================================================
  // EMPTY MODEL
  // =========================================================

  emptyModel() {

    return {

      departmentId: 0,

      departmentName: '',

      departmentCode: '',

      description: '',

      companyId: null as number | null,

      regionId: null as number | null,

      status: true

    };

  }


  // =========================================================
  // GET ALL DEPARTMENTS
  // =========================================================

 loadDepartments(): void {

  this.spinner.show();

  this.controlSystemService.getDepartments().subscribe({

    next: (res: any) => {

      this.spinner.hide();

      console.log('Department API Response:', res);
      console.log('Department Data:', res?.data);

      if (res && res.data) {

        this.departments = res.data.map((item: any) => {

          console.log('Department Item:', item);
          console.log('Department ID:', item.departmentId);
          console.log('DepartmentId:', item.DepartmentId);

          return {
            ...item,
            status: item.status === true ? 'Active' : 'Inactive'
          };

        });

      } else {

        this.departments = [];

      }

      this.cd.detectChanges();

    },

    error: (err) => {

      this.spinner.hide();

      console.error('Get Departments Error:', err);

      this.departments = [];

      this.alert.error(
        err?.error?.message ||
        'Failed to load departments.'
      );

      this.cd.detectChanges();

    }

  });

}

  // =========================================================
  // STATISTICS
  // =========================================================

  get activeCount(): number {

    return this.departments.filter(
      x => x.status === 'Active'
    ).length;

  }


  get inactiveCount(): number {

    return this.departments.filter(
      x => x.status === 'Inactive'
    ).length;

  }


  /*
   * Department API currently does not return employeeCount.
   * Therefore we are not calculating fake employee data.
   *
   * Later, if your backend returns employeeCount,
   * this getter can be updated.
   */

  get employeeCount(): number {

    return this.departments.reduce(
      (total, item) =>
        total + (Number(item.employeeCount) || 0),
      0
    );

  }


  // =========================================================
  // FILTERED DEPARTMENTS
  // =========================================================

  get filteredDepartments(): any[] {

    const search = this.searchText
      .trim()
      .toLowerCase();


    return this.departments.filter(item => {

      const departmentName =
        (item.departmentName || '')
          .toLowerCase();

      const departmentCode =
        (item.departmentCode || '')
          .toLowerCase();

      const description =
        (item.description || '')
          .toLowerCase();


      const companyName =
        (item.companyName || '')
          .toLowerCase();

      const regionName =
        (item.regionName || '')
          .toLowerCase();


      const matchesSearch =

        departmentName.includes(search) ||

        departmentCode.includes(search) ||

        description.includes(search) ||

        companyName.includes(search) ||

        regionName.includes(search);


      const matchesStatus =

        this.statusFilter === '' ||

        item.status === this.statusFilter;


      return matchesSearch && matchesStatus;

    });

  }


  // =========================================================
  // REFRESH
  // =========================================================

  refresh(): void {

    this.loadDepartments();

  }


  // =========================================================
  // OPEN ADD MODAL
  // =========================================================

  openAddModal(): void {

    this.isEdit = false;

    this.editId = 0;

    this.model = this.emptyModel();

    this.updateCompanyRegions();

    this.showModal = true;

  }


  // =========================================================
  // CLOSE MODAL
  // =========================================================

  closeModal(): void {

    this.showModal = false;

    this.model = this.emptyModel();

    this.updateCompanyRegions();

    this.isEdit = false;

    this.editId = 0;

  }


  // =========================================================
  // SAVE / UPDATE DEPARTMENT
  // =========================================================

  saveDepartment(): void {

    // -----------------------------------------
    // Department Name Validation
    // -----------------------------------------

    if (
      !this.model.departmentName ||
      !this.model.departmentName.trim()
    ) {

      this.alert.warning(
        'Department Name is required.'
      );

      return;

    }


    // -----------------------------------------
    // Department Code Validation
    // -----------------------------------------

    if (
      !this.model.departmentCode ||
      !this.model.departmentCode.trim()
    ) {

      this.alert.warning(
        'Department Code is required.'
      );

      return;

    }


    // -----------------------------------------
    // Company / Region Validation
    // -----------------------------------------

    if (!this.model.companyId) {

      this.alert.warning(
        'Please select a Company.'
      );

      return;

    }


    if (!this.model.regionId) {

      this.alert.warning(
        'Please select a Region.'
      );

      return;

    }


    // -----------------------------------------
    // Prepare API Model
    // -----------------------------------------

    const data = {

      departmentId: this.isEdit
        ? this.editId
        : 0,

      companyId:
        Number(this.model.companyId),

      regionId:
        Number(this.model.regionId),

      departmentName:
        this.model.departmentName.trim(),

      departmentCode:
        this.model.departmentCode.trim().toUpperCase(),

      description:
        this.model.description
          ? this.model.description.trim()
          : '',

      // Frontend Active/Inactive -> Backend bool
      status:
        this.model.status === 'Active' ||
        this.model.status === true

    };


    this.spinner.show();


    // =====================================================
    // UPDATE
    // =====================================================

    if (this.isEdit) {

      this.controlSystemService
        .updateDepartment(data)
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res) {

              this.alert.success(
                res.message ||
                'Department updated successfully.'
              );

              this.closeModal();

              this.loadDepartments();

            }
            else {

              this.alert.error(
                'Unable to update department.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error(
              'Update Department Error:',
              err
            );

            this.alert.error(
              err?.error?.message ||
              'Failed to update department.'
            );

          }

        });

    }


    // =====================================================
    // CREATE
    // =====================================================

    else {

      this.controlSystemService
        .createDepartment(data)
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res) {

              this.alert.success(
                res.message ||
                'Department created successfully.'
              );

              this.closeModal();

              this.loadDepartments();

            }
            else {

              this.alert.error(
                'Unable to create department.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error(
              'Create Department Error:',
              err
            );

            this.alert.error(
              err?.error?.message ||
              'Failed to create department.'
            );

          }

        });

    }

  }


  // =========================================================
  // EDIT DEPARTMENT
  // =========================================================

  edit(item: any): void {

    this.isEdit = true;

    this.editId =
      item.departmentId ||
      item.DepartmentId ||
      0;


    this.model = {

      departmentId: this.editId,

      departmentName:
        item.departmentName || '',

      departmentCode:
        item.departmentCode || '',

      description:
        item.description || '',

      // 0 (legacy records saved without a company) -> nothing selected
      companyId:
        item.companyId || null,

      regionId:
        item.regionId || null,

      status:
        item.status === true ||
        item.status === 'Active'
          ? 'Active'
          : 'Inactive'

    };

    this.updateCompanyRegions();


    this.showModal = true;

  }


  // =========================================================
  // DELETE DEPARTMENT
  // =========================================================

  delete(id: number): void {

    if (!id) {

      this.alert.error(
        'Invalid department ID.'
      );

      return;

    }


    this.alert.deleteConfirm()
      .then((result: any) => {

        if (!result.isConfirmed) {

          return;

        }


        this.spinner.show();


        this.controlSystemService
          .deleteDepartment(id)
          .subscribe({

            next: (res: any) => {

              this.spinner.hide();

              if (res) {

                this.alert.success(
                  res.message ||
                  'Department deleted successfully.'
                );

                this.loadDepartments();

              }
              else {

                this.alert.error(
                  'Unable to delete department.'
                );

              }

            },

            error: (err) => {

              this.spinner.hide();

              console.error(
                'Delete Department Error:',
                err
              );

              this.alert.error(
                err?.error?.message ||
                'Failed to delete department.'
              );

            }

          });

      });

  }


  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  clearFilters(): void {

    this.searchText = '';

    this.statusFilter = '';

  }
}
