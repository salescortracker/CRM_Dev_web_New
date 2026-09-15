import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { ControlsystemService } from '../../services/controlsystem-service';

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
    private cd: ChangeDetectorRef
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
  // Form Model
  // ==============================

  model: any = this.emptyModel();


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  ngOnInit(): void {

    this.loadDepartments();

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


      const matchesSearch =

        departmentName.includes(search) ||

        departmentCode.includes(search) ||

        description.includes(search);


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

    this.showModal = true;

  }


  // =========================================================
  // CLOSE MODAL
  // =========================================================

  closeModal(): void {

    this.showModal = false;

    this.model = this.emptyModel();

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
    // Prepare API Model
    // -----------------------------------------

    const data = {

      departmentId: this.isEdit
        ? this.editId
        : 0,

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

      status:
        item.status === true ||
        item.status === 'Active'
          ? 'Active'
          : 'Inactive'

    };


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
