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

  this.clearRoleIfNotAvailable();

}


onFormRegionChange(): void {

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




// MODAL

showModal=false;

isEdit=false;

editId=0;



// FILTER

searchText='';

roleFilter='';

statusFilter='';





// USERS DATA (from API)


users:any[]=[];


loadUsers(): void {

  this.spinner.show();

  this.controlService
    .getCompanyAdministrators()
    .subscribe({

      next: (res: any) => {

        this.spinner.hide();

        if (res?.success) {

          this.users = (res.data || []).map((x: any) => ({
            id: x.administratorId,
            firstName: x.firstName,
            lastName: x.lastName || '',
            email: x.email,
            mobile: x.mobileNumber,
            employeeCode: x.employeeCode,
            username: x.username,
            companyId: x.companyId,
            regionId: x.regionId,
            departmentId: x.departmentId,
            department: x.departmentName || '',
            designationId: x.designationId,
            designation: x.designationName || '',
            role: x.roleName || 'User',
            status: x.status ? 'Active' : 'Inactive',
            loginAccess: true,
            lastLogin: '-'
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

username:'',

companyId:'',

regionId:'',

departmentId:'',

designationId:'',

role:'',

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

this.showModal=true;


}







closeModal(){


this.showModal=false;

this.model=this.emptyModel();

this.isEdit=false;

this.editId=0;


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



// Username is no longer collected from the UI. On create the backend
// generates the real one; on edit keep the user's existing username -
// the login uses it to find the user's role and sidebar menus.
const derivedUsername =
  (this.isEdit && this.model.username)
    ? this.model.username
    : (this.model.email.split('@')[0] || this.model.employeeCode)
        .toLowerCase()
        .trim();

const data = {

  administratorId: this.isEdit ? this.editId : 0,

  companyId: Number(this.model.companyId),

  regionId: this.model.regionId ? Number(this.model.regionId) : null,

  departmentId: this.model.departmentId ? Number(this.model.departmentId) : null,

  designationId: this.model.designationId ? Number(this.model.designationId) : null,

  employeeCode: this.model.employeeCode.trim(),

  username: derivedUsername,

  firstName: this.model.firstName.trim(),

  lastName: this.model.lastName ? this.model.lastName.trim() : '',

  email: this.model.email.trim(),

  mobileNumber: this.model.mobile.trim(),

  roleName: this.model.role.trim(),

  status: this.model.status === 'Active'

};



this.spinner.show();



const request$ = this.isEdit
  ? this.controlService.updateCompanyAdministrator(data)
  : this.controlService.createCompanyAdministrator(data);

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







edit(item:any){


this.isEdit=true;

this.editId=item.id;

this.model={

  id: item.id,

  firstName: item.firstName,

  lastName: item.lastName,

  email: item.email,

  mobile: item.mobile,

  employeeCode: item.employeeCode,

  username: item.username || '',

  companyId: item.companyId || '',

  regionId: item.regionId || '',

  departmentId: item.departmentId || '',

  designationId: item.designationId || '',

  role: item.role,

  status: item.status,

  loginAccess: item.loginAccess,

  lastLogin: item.lastLogin

};

this.showModal=true;


}







delete(id:number){



this.alert.deleteConfirm()

.then(result=>{


if(result.isConfirmed){


this.spinner.show();

this.controlService
  .deleteCompanyAdministrator(id)
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
