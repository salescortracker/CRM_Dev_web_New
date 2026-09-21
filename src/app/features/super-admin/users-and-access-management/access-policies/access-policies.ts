import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';
import { AuthService } from '../../../../core/authentication/services/auth.service';
import { ControlsystemService } from '../../services/controlsystem-service';

@Component({
  selector: 'app-access-policies',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './access-policies.html',
  styleUrl: './access-policies.css',
})
export class AccessPolicies implements OnInit {
  constructor(

private alert:Alertservice,

private spinner:Spinnerservice,

private cd:ChangeDetectorRef,

private authService: AuthService,

private controlService: ControlsystemService

){}



ngOnInit(): void {

  this.loadCompanies();

  this.loadRegions();

  this.loadDepartments();

  this.loadPolicies();

}




showModal=false;

isEdit=false;

editId=0;



searchText='';

roleFilter='';

statusFilter='';




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

        this.companies = (response.data || []).filter(
          (x: any) => x.isActive !== false
        );

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

        this.regions = (response.data || []).filter(
          (x: any) => x.isActive !== false
        );

      },

      error: (err) => {

        console.error(err);

      }
    });

}


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

}



// ==============================
// Department Dropdown
// ==============================

departments: any[] = [];


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




policies:any[]=[];


loadPolicies(): void {

  this.spinner.show();

  this.authService
    .getAccessPolicies()
    .subscribe({

      next: (response: any) => {

        this.spinner.hide();

        this.policies = this.mapPolicies(response.data);

        this.cd.detectChanges();

      },

      error: (err) => {

        this.spinner.hide();

        this.alert.error(err?.error?.message || 'Failed to load access policies.');

      }
    });

}


private mapPolicies(data: any[] | undefined): any[] {

  return (data || []).map((x: any) => ({

    id: x.policyId,
    policyName: x.policyName,
    policyCode: x.policyCode,
    companyId: x.companyId,
    regionId: x.regionId,
    role: x.roleName,
    departmentId: x.departmentId,
    department: x.departmentName || 'All Departments',
    modules: (x.modules || '').split(',').map((m: string) => m.trim()).filter((m: string) => !!m),
    ipRestriction: x.ipRestriction,
    allowedIP: x.allowedIp || '',
    loginRestriction: x.loginRestriction,
    sessionTimeout: x.sessionTimeout,
    status: x.status ? 'Active' : 'Inactive',
    isDefault: x.isDefault

  }));

}




model:any=this.emptyModel();


emptyModel(){

return {

id:0,
policyName:'',
policyCode:'',
companyId:'',
regionId:'',
role:'Admin',
departmentId:null,
modules:[],
moduleAccess:{
dashboard:false,
leads:false,
contacts:false,
deals:false,
reports:false,
settings:false
},
ipRestriction:false,
allowedIP:'',
loginRestriction:'24 Hours',
sessionTimeout:30,
status:'Active',
isDefault:false

};

}




// STATISTICS


get activePolicies(){

return this.policies.filter(
x=>x.status==='Active'
).length;

}


get inactivePolicies(){

return this.policies.filter(
x=>x.status==='Inactive'
).length;

}


get restrictedPolicies(){

return this.policies.filter(
x=>x.ipRestriction
).length;

}




// FILTER


get filteredPolicies(){

return this.policies.filter(item=>{

let search=

item.policyName
.toLowerCase()
.includes(this.searchText.toLowerCase())

||

item.policyCode
.toLowerCase()
.includes(this.searchText.toLowerCase());


let role=

this.roleFilter==''

||

item.role===this.roleFilter;


let status=

this.statusFilter==''

||

item.status===this.statusFilter;


return search && role && status;

});

}




refresh(){

this.loadPolicies();

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




savePolicy(){

if(!this.model.policyName.trim()){

this.alert.warning(
'Policy Name is required.'
);

return;

}


if(!this.model.companyId){

this.alert.warning(
'Company is required.'
);

return;

}


this.spinner.show();


let modules:string[]=[];

Object.keys(this.model.moduleAccess)
.forEach((key:string)=>{

if(this.model.moduleAccess[key]){

modules.push(
key.charAt(0).toUpperCase()+key.slice(1)
);

}

});


const payload = {

  policyId: this.isEdit ? this.editId : 0,

  companyId: +this.model.companyId,

  regionId: this.model.regionId ? +this.model.regionId : null,

  roleName: this.model.role,

  departmentId: this.model.departmentId ? +this.model.departmentId : null,

  policyName: this.model.policyName.trim(),

  modules: modules.join(','),

  ipRestriction: this.model.ipRestriction,

  allowedIp: this.model.allowedIP,

  loginRestriction: this.model.loginRestriction,

  sessionTimeout: +this.model.sessionTimeout || 30,

  status: this.model.status === 'Active',

  isDefault: this.model.isDefault

};


const request$ = this.isEdit

  ? this.authService.updateAccessPolicy(payload)

  : this.authService.createAccessPolicy(payload);


request$.subscribe({

  next: (res: any) => {

    this.spinner.hide();

    this.alert.success(res.message);

    this.loadPolicies();

    this.closeModal();

    this.cd.detectChanges();

  },

  error: (err) => {

    this.spinner.hide();

    this.alert.error(err?.error?.message || 'Failed to save access policy.');

  }

});


}




edit(item:any){

this.isEdit=true;

this.editId=item.id;

this.model={

id: item.id,
policyName: item.policyName,
policyCode: item.policyCode,
companyId: item.companyId || '',
regionId: item.regionId || '',
role: item.role,
departmentId: item.departmentId || null,
moduleAccess:{
dashboard:item.modules.includes('Dashboard'),
leads:item.modules.includes('Leads'),
contacts:item.modules.includes('Contacts'),
deals:item.modules.includes('Deals'),
reports:item.modules.includes('Reports'),
settings:item.modules.includes('Settings')
},
ipRestriction: item.ipRestriction,
allowedIP: item.allowedIP,
loginRestriction: item.loginRestriction,
sessionTimeout: item.sessionTimeout,
status: item.status,
isDefault: item.isDefault

};

this.showModal=true;

}




delete(id:number){

this.alert.deleteConfirm()

.then(result=>{

if(result.isConfirmed){

this.spinner.show();

this.authService
  .deleteAccessPolicy(id)
  .subscribe({

    next: (res: any) => {

      this.spinner.hide();

      this.alert.success(res.message);

      this.loadPolicies();

      this.cd.detectChanges();

    },

    error: (err) => {

      this.spinner.hide();

      this.alert.error(err?.error?.message || 'Failed to delete access policy.');

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
