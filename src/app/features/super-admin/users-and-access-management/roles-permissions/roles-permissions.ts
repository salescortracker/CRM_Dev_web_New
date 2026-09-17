import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/authentication/services/auth.service';
import { Menu } from '../menu-access/menu-access';

@Component({
  selector: 'app-roles-permissions',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './roles-permissions.html',
  styleUrl: './roles-permissions.css',
})
export class RolesPermissions implements OnInit {
  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef,

    private authService: AuthService

  ) {}



  ngOnInit(): void {

    this.loadActiveMenus();

    this.loadCompanies();

    this.loadRegions();

    this.loadRoles();

  }




  // ==============================
  // Module Permissions (Active Menus)
  // ==============================


  menuTree: { parent: Menu; children: Menu[] }[] = [];


  loadActiveMenus(): void {

    this.authService
      .getMenus()
      .subscribe({

        next: (response) => {

          const activeMenus: Menu[] =
            (response.data || []).filter(
              (x: Menu) => x.isActive
            );

          this.menuTree =
            this.buildMenuTree(activeMenus);

        },

        error: (err) => {

          console.error(err);

        }
      });

  }


  private buildMenuTree(
    activeMenus: Menu[]
  ): { parent: Menu; children: Menu[] }[] {

    const activeIds =
      new Set(activeMenus.map(x => x.menuId));

    const parents = activeMenus.filter(
      x => !x.parentMenuId || !activeIds.has(x.parentMenuId)
    );

    return parents.map(parent => ({

      parent,

      children: activeMenus.filter(
        x => x.parentMenuId === parent.menuId
      )

    }));

  }


  allPermissionsSelected = false;


  toggleAllPermissions(): void {

    for (const group of this.menuTree) {

      this.model.permissions[group.parent.menuId] =
        this.allPermissionsSelected;

      for (const child of group.children) {

        this.model.permissions[child.menuId] =
          this.allPermissionsSelected;

      }

    }

  }




  // ==============================
  // Company / Region Dropdowns
  // ==============================


  companies: any[] = [];

  regions: any[] = [];


  loadCompanies(): void {

    this.authService
      .getCompanies()
      .subscribe({

        next: (response) => {

          this.companies = response.data || [];

        },

        error: (err) => {

          console.error(err);

        }
      });

  }


  loadRegions(): void {

    this.authService
      .getRegions()
      .subscribe({

        next: (response) => {

          this.regions = response.data || [];

        },

        error: (err) => {

          console.error(err);

        }
      });

  }





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
  // Roles Data
  // ==============================


  roles:any[] = [];


  loadRoles(): void {

    this.authService
      .getRoles()
      .subscribe({

        next: (response) => {

          this.roles = this.mapRoles(response.data);

          this.cd.detectChanges();

        },

        error: (err) => {

          console.error(err);

        }
      });

  }


  private mapRoles(data: any[] | undefined): any[] {

    return (data || []).map((x: any) => ({

      id: x.roleId,

      companyId: x.companyId,

      regionId: x.regionId,

      roleName: x.roleName,

      accessLevel: x.accessLevel,

      userCount: x.userCount,

      description: x.description || '',

      permissions: x.permissions || {},

      status: x.status ? 'Active' : 'Inactive',

      isDefault: x.isDefault

    }));

  }


  permissionCount(item: any): number {

    return Object.values(item.permissions || {})
      .filter(v => v).length;

  }









  // ==============================
  // Form Model
  // ==============================


  model:any = this.emptyModel();





  emptyModel(){


    return {


      id:0,


      roleName:'',


      accessLevel:'Full Access',


      userCount:0,


      companyId:'',


      regionId:'',


      description:'',


      permissions:{},


      status:'Active',


      isDefault:false


    };


  }









  // ==============================
  // Statistics
  // ==============================


  get activeCount(){


    return this.roles.filter(

      x=>x.status==='Active'

    ).length;


  }







  get inactiveCount(){


    return this.roles.filter(

      x=>x.status==='Inactive'

    ).length;


  }







  get assignedUsers(){


    return this.roles.reduce(

      (sum,item)=>sum + item.userCount,

      0

    );


  }









  // ==============================
  // Filter Roles
  // ==============================


  get filteredRoles(){


    return this.roles.filter(item=>{



      const search =


      item.roleName

      .toLowerCase()

      .includes(this.searchText.toLowerCase())



      ||

      item.accessLevel

      .toLowerCase()

      .includes(this.searchText.toLowerCase())



      ||

      item.description

      .toLowerCase()

      .includes(this.searchText.toLowerCase());






      const status =


      this.statusFilter === ''

      ||

      item.status === this.statusFilter;






      return search && status;



    });



  }









  // ==============================
  // Refresh
  // ==============================


  refresh(){


    this.spinner.show();


    this.authService
      .getRoles()
      .subscribe({

        next: (response) => {

          this.roles = this.mapRoles(response.data);

          this.spinner.hide();

          this.alert.success(
            'Roles data refreshed successfully.'
          );

        },

        error: (err) => {

          this.spinner.hide();

          this.alert.error(err?.error?.message || 'Failed to refresh roles.');

        }
      });


  }




  // ==============================
  // Open Add Modal
  // ==============================


  openAddModal(){


    this.isEdit=false;


    this.editId=0;


    this.model=this.emptyModel();


    this.allPermissionsSelected=false;


    this.showModal=true;


  }




  // ==============================
  // Close Modal
  // ==============================


  closeModal(){


    this.showModal=false;


    this.model=this.emptyModel();


    this.isEdit=false;


    this.editId=0;


  }




  // ==============================
  // Save / Update
  // ==============================


  saveRole(){



    if(!this.model.roleName.trim()){



      this.alert.warning(

        'Role Name is required.'

      );


      return;


    }


    if(!this.model.companyId){


      this.alert.warning(

        'Company is required.'

      );


      return;

    }


    if(!this.model.regionId){


      this.alert.warning(

        'Region is required.'

      );


      return;

    }



    this.spinner.show();


    const payload = {

      roleId: this.isEdit ? this.editId : 0,

      companyId: +this.model.companyId,

      regionId: +this.model.regionId,

      roleName: this.model.roleName.trim(),

      accessLevel: this.model.accessLevel,

      userCount: +this.model.userCount || 0,

      description: this.model.description,

      status: this.model.status === 'Active',

      isDefault: this.model.isDefault,

      permissions: this.model.permissions

    };


    const request$ = this.isEdit

      ? this.authService.updateRole(payload)

      : this.authService.createRole(payload);


    request$.subscribe({

      next: (res: any) => {

        this.spinner.hide();

        this.alert.success(res.message);

        this.loadRoles();

        this.closeModal();

        this.cd.detectChanges();

      },

      error: (err) => {

        this.spinner.hide();

        this.alert.error(err?.error?.message || 'Failed to save role.');

      }

    });

  }









  // ==============================
  // Edit
  // ==============================


  edit(item:any){


    this.isEdit=true;


    this.editId=item.id;




    this.model={


      ...item,


      permissions:{


        ...item.permissions


      }


    };


    this.allPermissionsSelected=false;



    this.showModal=true;



  }









  // ==============================
  // Delete
  // ==============================


  delete(id:number){



    this.alert.deleteConfirm()

    .then(result=>{



      if(result.isConfirmed){



        this.spinner.show();


        this.authService
          .deleteRole(id)
          .subscribe({

            next: (res: any) => {

              this.spinner.hide();

              this.alert.success(res.message);

              this.loadRoles();

              this.cd.detectChanges();

            },

            error: (err) => {

              this.spinner.hide();

              this.alert.error(err?.error?.message || 'Failed to delete role.');

            }
          });



      }



    });



  }





  // ==============================
  // Clear Filters
  // ==============================


  clearFilters(){


    this.searchText='';


    this.statusFilter='';


  }
}
