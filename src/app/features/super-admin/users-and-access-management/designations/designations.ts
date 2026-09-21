import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { ControlsystemService } from '../../services/controlsystem-service';
import { AuthService } from '../../../../core/authentication/services/auth.service';

@Component({
  selector: 'app-designations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './designations.html',
  styleUrl: './designations.css',
})
export class Designations {
  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef,
    private controlsystemService: ControlsystemService,
    private authService: AuthService

  ) { }





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
  // Static Designation Data
  // ==============================


  designations: any[] = [];

  departments: any[] = [];


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

 emptyModel() {

    return {

      designationId: 0,

      companyId: null as number | null,

      regionId: null as number | null,

      departmentId: null,

      designationName: '',

      designationCode: '',

      description: '',

      status: true

    };

  }


  // ==============================
  // Lifecycle
  // ==============================

  ngOnInit(): void {

    this.loadCompanies();

    this.loadRegions();

    this.loadDepartments();

    this.loadDesignations();

  }


  // ==============================
  // Company / Region Dropdowns
  // ==============================

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


  // ==============================
  // Load Departments
  // ==============================

  loadDepartments(): void {

    this.controlsystemService.getDepartments()
      .subscribe({

        next: (res: any) => {

          if (res?.success) {

            this.departments = (res.data || []).filter(
              (dept: any) =>
                dept.status === true ||
                dept.status === 'Active'
            );

          }
          else {

            this.departments = [];

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          console.error(
            'Error loading departments:',
            err
          );

          this.departments = [];

          this.alert.error(
            err?.error?.message ||
            'Failed to load departments.'
          );

        }

      });

  }


  // ==============================
  // Load Designations
  // ==============================

  loadDesignations(): void {

    this.spinner.show();

    this.controlsystemService.getDesignations()
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.designations =
              (res.data || []).map((item: any) => ({

                ...item,

                status:
                  item.status === true ||
                  item.status === 'Active'
                    ? 'Active'
                    : 'Inactive'

              }));

          }
          else {

            this.designations = [];

            this.alert.warning(
              res?.message ||
              'No designation records found.'
            );

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error(
            'Error loading designations:',
            err
          );

          this.designations = [];

          this.alert.error(
            err?.error?.message ||
            'Failed to load designations.'
          );

          this.cd.detectChanges();

        }

      });

  }


  // ==============================
  // Statistics
  // ==============================

  get activeCount(): number {

    return this.designations.filter(
      x => x.status === 'Active'
    ).length;

  }


  get inactiveCount(): number {

    return this.designations.filter(
      x => x.status === 'Inactive'
    ).length;

  }


  // ==============================
  // Search Filter
  // ==============================

  get filteredDesignations(): any[] {

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    return this.designations.filter(item => {

      const designationName =
        (item.designationName || '')
          .toLowerCase();

      const designationCode =
        (item.designationCode || '')
          .toLowerCase();

      const departmentName =
        (item.departmentName || '')
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
        !search ||
        designationName.includes(search) ||
        designationCode.includes(search) ||
        departmentName.includes(search) ||
        description.includes(search) ||
        companyName.includes(search) ||
        regionName.includes(search);


      const matchesStatus =
        !this.statusFilter ||
        item.status === this.statusFilter;


      return matchesSearch && matchesStatus;

    });

  }


  // ==============================
  // Refresh
  // ==============================

  refresh(): void {

    this.loadDesignations();

  }


  // ==============================
  // Open Add Modal
  // ==============================

  openAddModal(): void {

    this.isEdit = false;

    this.editId = 0;

    this.model = this.emptyModel();

    this.updateCompanyRegions();

    this.showModal = true;

  }


  // ==============================
  // Close Modal
  // ==============================

  closeModal(): void {

    this.showModal = false;

    this.model = this.emptyModel();

    this.updateCompanyRegions();

    this.isEdit = false;

    this.editId = 0;

  }


  // ==============================
  // Save / Update
  // ==============================

  saveDesignation(): void {

    // --------------------------
    // Validation
    // --------------------------

    if (
      !this.model.designationName ||
      !this.model.designationName.trim()
    ) {

      this.alert.warning(
        'Designation Name is required.'
      );

      return;

    }


    if (
      !this.model.designationCode ||
      !this.model.designationCode.trim()
    ) {

      this.alert.warning(
        'Designation Code is required.'
      );

      return;

    }


    if (
      !this.model.departmentId ||
      Number(this.model.departmentId) <= 0
    ) {

      this.alert.warning(
        'Please select a Department.'
      );

      return;

    }


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


    // --------------------------
    // Prepare API Object
    // --------------------------

    const data = {

      designationId:
        this.isEdit
          ? this.editId
          : 0,

      companyId:
        Number(this.model.companyId) || 0,

      regionId:
        Number(this.model.regionId) || 0,

      departmentId:
        Number(this.model.departmentId),

      designationName:
        this.model.designationName.trim(),

      designationCode:
        this.model.designationCode.trim(),

      description:
        this.model.description
          ? this.model.description.trim()
          : '',

      status:
        this.model.status === true ||
        this.model.status === 'Active'

    };


    this.spinner.show();


    // ==========================
    // UPDATE
    // ==========================

    if (this.isEdit) {

      this.controlsystemService
        .updateDesignation(data)
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message ||
                'Designation updated successfully.'
              );

              this.closeModal();

              this.loadDesignations();

            }
            else {

              this.alert.warning(
                res?.message ||
                'Failed to update designation.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error(
              'Update designation error:',
              err
            );

            this.alert.error(
              err?.error?.message ||
              'Failed to update designation.'
            );

          }

        });

    }

    // ==========================
    // CREATE
    // ==========================

    else {

      this.controlsystemService
        .createDesignation(data)
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(
                res.message ||
                'Designation created successfully.'
              );

              this.closeModal();

              this.loadDesignations();

            }
            else {

              this.alert.warning(
                res?.message ||
                'Failed to create designation.'
              );

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error(
              'Create designation error:',
              err
            );

            this.alert.error(
              err?.error?.message ||
              'Failed to create designation.'
            );

          }

        });

    }

  }


  // ==============================
  // Edit
  // ==============================

  edit(item: any): void {

    const id =
      Number(item?.designationId);


    if (!id || id <= 0) {

      this.alert.error(
        'Invalid designation ID.'
      );

      return;

    }


    this.spinner.show();


    this.controlsystemService
      .getDesignationById(id)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;


            this.isEdit = true;

            this.editId =
              Number(data.designationId);


            this.model = {

              designationId:
                data.designationId || 0,

              // 0 (legacy records saved without a company)
              // -> nothing selected
              companyId:
                data.companyId || null,

              regionId:
                data.regionId || null,

              departmentId:
                data.departmentId || null,

              designationName:
                data.designationName || '',

              designationCode:
                data.designationCode || '',

              description:
                data.description || '',

              status:
                data.status === true ||
                data.status === 'Active'

            };

            this.updateCompanyRegions();


            this.showModal = true;

            this.cd.detectChanges();

          }
          else {

            this.alert.warning(
              res?.message ||
              'Designation not found.'
            );

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error(
            'Get designation error:',
            err
          );

          this.alert.error(
            err?.error?.message ||
            'Failed to load designation.'
          );

        }

      });

  }


  // ==============================
  // Delete
  // ==============================

  delete(item: any): void {

    const id =
      Number(item?.designationId);


    if (!id || id <= 0) {

      this.alert.error(
        'Invalid designation ID.'
      );

      return;

    }


    this.alert.deleteConfirm()
      .then(result => {

        if (!result.isConfirmed) {

          return;

        }


        this.spinner.show();


        this.controlsystemService
          .deleteDesignation(id)
          .subscribe({

            next: (res: any) => {

              this.spinner.hide();

              if (res?.success) {

                this.alert.success(
                  res.message ||
                  'Designation deleted successfully.'
                );

                this.loadDesignations();

              }
              else {

                this.alert.warning(
                  res?.message ||
                  'Failed to delete designation.'
                );

              }

            },

            error: (err) => {

              this.spinner.hide();

              console.error(
                'Delete designation error:',
                err
              );

              this.alert.error(
                err?.error?.message ||
                'Failed to delete designation.'
              );

            }

          });

      });

  }


  // ==============================
  // Clear Filters
  // ==============================

  clearFilters(): void {

    this.searchText = '';

    this.statusFilter = '';

  }
}
