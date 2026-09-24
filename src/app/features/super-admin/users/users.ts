import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { ControlsystemService } from '../services/controlsystem-service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  constructor(

private alert:Alertservice,

private spinner:Spinnerservice,

private cd:ChangeDetectorRef,

private authService:AuthService,

private controlService: ControlsystemService

){}



ngOnInit(): void {

  this.loadCompanies();

  this.loadRegions();

  this.loadDepartments();

  this.loadDesignations();

  this.loadBranches();

  this.loadRoles();

  this.loadUsers();

}




// COMPANY / REGION DROPDOWNS


companies:any[]=[];

regions:any[]=[];


loadCompanies(): void {

  this.authService
    .getCompanies()
    .subscribe({

      next: (response) => {

        this.companies = (response.data || [])
          .filter((x: any) => x.isActive);

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

        this.regions = (response.data || [])
          .filter((x: any) => x.isActive);

      },

      error: (err) => {

        console.error(err);

      }
    });

}


// Regions belonging to the selected company, for the cascading dropdown.
get formRegions(): any[] {

  if (!this.model.companyId) {
    return [];
  }

  return this.regions.filter(
    r => r.companyId === Number(this.model.companyId)
  );

}


onFormCompanyChange(): void {

  this.model.regionId = '';

  this.model.branchId = '';

  this.clearRoleIfNotAvailable();

}


onFormRegionChange(): void {

  this.model.branchId = '';

  this.clearRoleIfNotAvailable();

}




// ROLE DROPDOWN (active roles created in Roles & Permissions)


roles: any[] = [];


loadRoles(): void {

  this.authService
    .getRoles()
    .subscribe({

      next: (response) => {

        this.roles = (response.data || [])
          .filter((x: any) => x.status !== false);

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading roles:', err);

        this.roles = [];

      }
    });

}


// Unique, sorted role names.
private uniqueNames(names: string[]): string[] {

  const seen = new Map<string, string>();

  for (const name of names) {

    const key = (name || '').trim().toLowerCase();

    if (key && !seen.has(key)) {
      seen.set(key, name.trim());
    }

  }

  return Array.from(seen.values())
    .sort((a, b) => a.localeCompare(b));

}


// Roles of the selected company (and region, once one is chosen) - the
// same rule the login uses to find the role that drives the sidebar.
get availableRoleNames(): string[] {

  if (!this.model.companyId) {
    return [];
  }

  return this.uniqueNames(
    this.roles
      .filter(r =>
        Number(r.companyId) === Number(this.model.companyId) &&
        (!this.model.regionId ||
          Number(r.regionId) === Number(this.model.regionId)))
      .map(r => r.roleName)
  );

}


// Options for the form's Role dropdown. A user's current role stays
// visible when editing even if it is no longer in the list.
get formRoles(): string[] {

  const names = this.availableRoleNames;

  const current = (this.model.role || '').trim();

  const hasCurrent = names.some(
    n => n.toLowerCase() === current.toLowerCase()
  );

  return current && !hasCurrent
    ? [...names, current]
    : names;

}


// Options for the Role filter above the table.
get roleFilterOptions(): string[] {

  return this.uniqueNames([
    ...this.roles.map(r => r.roleName),
    ...this.users.map(u => u.role)
  ]);

}


private clearRoleIfNotAvailable(): void {

  const current = (this.model.role || '').trim().toLowerCase();

  const stillAvailable = this.availableRoleNames.some(
    n => n.toLowerCase() === current
  );

  if (!stillAvailable) {
    this.model.role = '';
  }

}




// DEPARTMENT / DESIGNATION DROPDOWNS


departments: any[] = [];

designations: any[] = [];

branches: any[] = [];


loadDepartments(): void {

  this.controlService
    .getDepartments()
    .subscribe({

      next: (res: any) => {

        this.departments = (res?.data || []).filter(
          (x: any) => x.status === true || x.status === 'Active'
        );

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading departments:', err);

        this.departments = [];

      }

    });

}


loadDesignations(): void {

  this.controlService
    .getDesignations()
    .subscribe({

      next: (res: any) => {

        this.designations = (res?.data || []).filter(
          (x: any) => x.status === true || x.status === 'Active'
        );

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading designations:', err);

        this.designations = [];

      }

    });

}


// Designations belonging to the selected department, for the cascading dropdown.
get formDesignations(): any[] {

  if (!this.model.departmentId) {
    return [];
  }

  return this.designations.filter(
    d => d.departmentId === Number(this.model.departmentId)
  );

}


onFormDepartmentChange(): void {

  this.model.designationId = '';

}


loadBranches(): void {

  this.controlService
    .getBranches()
    .subscribe({

      next: (res: any) => {

        this.branches = (res?.data || []).filter(
          (x: any) => x.status === true || x.status === 'Active'
        );

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error('Error loading branches:', err);

        this.branches = [];

      }

    });

}


// Branches belonging to the selected company (and region, once one is
// chosen), for the cascading dropdown.
get formBranches(): any[] {

  return this.branches.filter(b => {

    const matchesCompany =
      !this.model.companyId ||
      b.companyId === Number(this.model.companyId);

    const matchesRegion =
      !this.model.regionId ||
      b.regionId === Number(this.model.regionId);

    return matchesCompany && matchesRegion;

  });

}




// MODAL

showModal=false;

isEdit=false;

editId=0;

showPassword=false;



// FILTER

searchText='';

roleFilter='';

statusFilter='';





// USERS DATA (from API)


users:any[]=[];


loadUsers(): void {

  this.spinner.show();

  this.controlService
    .getUsers()
    .subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success) {

          this.users = (res.data || []).map((x: any) => ({
            id: x.userId,
            firstName: x.firstName,
            lastName: x.lastName || '',
            email: x.email,
            mobile: x.mobileNumber,
            employeeCode: x.employeeCode,
            companyId: x.companyId,
            regionId: x.regionId,
            branchId: x.branchId,
            branch: x.branchName || '',
            departmentId: x.departmentId,
            department: x.departmentName || '',
            designationId: x.designationId,
            designation: x.designationName || '',
            role: x.role || 'User',
            status: x.isActive ? 'Active' : 'Inactive',
            loginAccess: true,
            lastLogin: x.lastLoginDate
              ? new Date(x.lastLoginDate).toLocaleString()
              : '-'
          }));

        } else {

          this.users = [];

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        this.spinner.hide();

        console.error('Error loading users:', err);

        this.users = [];

        this.alert.error(
          err?.error?.message ||
          'Failed to load users.'
        );

      }

    });

}




model:any=this.emptyModel();





emptyModel(){

return {


id:0,

firstName:'',

lastName:'',

email:'',

mobile:'',

employeeCode:'',

companyId:'',

regionId:'',

branchId:'',

departmentId:'',

designationId:'',

role:'',

password:'',

status:'Active',

loginAccess:true,

lastLogin:'-'


};


}







// STATISTICS


get activeUsers(){

return this.users.filter(x=>x.status==='Active').length;

}


get inactiveUsers(){

return this.users.filter(x=>x.status==='Inactive').length;

}



get adminUsers(){

return this.users.filter(x=>x.role==='Admin').length;

}







// FILTER


get filteredUsers(){


return this.users.filter(item=>{


let search=

item.firstName.toLowerCase()
.includes(this.searchText.toLowerCase())

||

item.lastName.toLowerCase()
.includes(this.searchText.toLowerCase())

||

item.email.toLowerCase()
.includes(this.searchText.toLowerCase())

||

item.employeeCode.toLowerCase()
.includes(this.searchText.toLowerCase());




let role=

this.roleFilter=='' ||

item.role===this.roleFilter;




let status=

this.statusFilter=='' ||

item.status===this.statusFilter;



return search && role && status;


});


}







refresh(){

this.loadUsers();

}






openAddModal(){


this.isEdit=false;

this.editId=0;

this.model=this.emptyModel();

this.showPassword=false;

this.showModal=true;


}







closeModal(){


this.showModal=false;

this.model=this.emptyModel();

this.isEdit=false;

this.editId=0;

this.showPassword=false;


}







saveUser(){



if(!this.model.firstName.trim()){


this.alert.warning(
'First Name is required.'
);


return;

}



if(!this.model.email.trim()){


this.alert.warning(
'Email is required.'
);


return;

}


if(!this.model.mobile || !this.model.mobile.trim()){


this.alert.warning(
'Mobile Number is required.'
);


return;

}


if(!this.model.employeeCode || !this.model.employeeCode.trim()){


this.alert.warning(
'Employee Code is required.'
);


return;

}


if(!this.model.companyId){


this.alert.warning(
'Company is required.'
);


return;

}



if(!this.model.role || !this.model.role.trim()){


this.alert.warning(
'Role is required.'
);


return;

}



const data = {

  userId: this.isEdit ? this.editId : 0,

  companyId: Number(this.model.companyId),

  regionId: this.model.regionId ? Number(this.model.regionId) : null,

  branchId: this.model.branchId ? Number(this.model.branchId) : null,

  departmentId: this.model.departmentId ? Number(this.model.departmentId) : null,

  designationId: this.model.designationId ? Number(this.model.designationId) : null,

  employeeCode: this.model.employeeCode.trim(),

  firstName: this.model.firstName.trim(),

  lastName: this.model.lastName ? this.model.lastName.trim() : '',

  email: this.model.email.trim(),

  mobileNumber: this.model.mobile.trim(),

  role: this.model.role.trim(),

  // Leave blank on edit to keep the current password; on create, a blank
  // password lets the backend assign the default one.
  password: this.model.password ? this.model.password.trim() : null,

  isActive: this.model.status === 'Active'

};



this.spinner.show();



const request$ = this.isEdit
  ? this.controlService.updateUser(data)
  : this.controlService.createUser(data);

request$.subscribe({

  next: (res: any) => {

    this.spinner.hide();

    if (res?.success) {

      this.alert.success(
        res.message ||
        (this.isEdit ? 'User updated successfully.' : 'User created successfully.')
      );

      this.closeModal();

      this.loadUsers();

    } else {

      this.alert.warning(
        res?.message || 'Unable to save user.'
      );

    }

    this.cd.detectChanges();

  },

  error: (err) => {

    this.spinner.hide();

    console.error('Save user error:', err);

    this.alert.error(
      err?.error?.message || 'Failed to save user.'
    );

  }

});


}







edit(id:number){


this.spinner.show();

this.controlService
  .getUserById(id)
  .subscribe({

    next: (res: any) => {

      this.spinner.hide();

      if (res?.success && res.data) {

        const data = res.data;

        this.isEdit = true;

        this.editId = id;

        this.model = {

          id: data.userId,

          firstName: data.firstName || '',

          lastName: data.lastName || '',

          email: data.email || '',

          mobile: data.mobileNumber || '',

          employeeCode: data.employeeCode || '',

          companyId: data.companyId || '',

          regionId: data.regionId || '',

          branchId: data.branchId || '',

          departmentId: data.departmentId || '',

          designationId: data.designationId || '',

          role: data.role || '',

          password: data.password || '',

          status: data.isActive ? 'Active' : 'Inactive',

          loginAccess: true,

          lastLogin: data.lastLoginDate
            ? new Date(data.lastLoginDate).toLocaleString()
            : '-'

        };

        this.showPassword = false;

        this.showModal = true;

        this.cd.detectChanges();

      } else {

        this.alert.warning(
          res?.message || 'User not found.'
        );

      }

    },

    error: (err) => {

      this.spinner.hide();

      console.error('Get user error:', err);

      this.alert.error(
        err?.error?.message || 'Failed to load user.'
      );

    }

  });


}







delete(id:number){



this.alert.deleteConfirm()

.then(result=>{


if(result.isConfirmed){


this.spinner.show();

this.controlService
  .deleteUser(id)
  .subscribe({

    next: (res: any) => {

      this.spinner.hide();

      if (res?.success) {

        this.alert.success(
          res.message || 'User deleted successfully.'
        );

        this.loadUsers();

      } else {

        this.alert.warning(
          res?.message || 'Unable to delete user.'
        );

      }

      this.cd.detectChanges();

    },

    error: (err) => {

      this.spinner.hide();

      console.error('Delete user error:', err);

      this.alert.error(
        err?.error?.message || 'Failed to delete user.'
      );

    }

  });


}



});



}







clearFilters(){


this.searchText='';

this.roleFilter='';

this.statusFilter='';


}
}
