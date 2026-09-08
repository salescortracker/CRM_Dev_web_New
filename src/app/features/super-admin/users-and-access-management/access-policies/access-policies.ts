import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';

@Component({
  selector: 'app-access-policies',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './access-policies.html',
  styleUrl: './access-policies.css',
})
export class AccessPolicies {
  constructor(

private alert:Alertservice,

private spinner:Spinnerservice,

private cd:ChangeDetectorRef

){}





showModal=false;

isEdit=false;

editId=0;



searchText='';

roleFilter='';

statusFilter='';






policies:any[]=[


{

id:1,

policyName:'Admin Full Access',

policyCode:'POL001',

role:'Admin',

department:'All Departments',

modules:[

'Dashboard',

'Leads',

'Contacts',

'Deals',

'Reports'

],

ipRestriction:true,

allowedIP:'192.168.1.100',

loginRestriction:'24 Hours',

sessionTimeout:30,

status:'Active',

isDefault:true


},




{

id:2,

policyName:'Sales User Access',

policyCode:'POL002',

role:'User',

department:'Sales',

modules:[

'Dashboard',

'Leads',

'Contacts'

],

ipRestriction:false,

allowedIP:'',

loginRestriction:'Business Hours',

sessionTimeout:60,

status:'Active',

isDefault:false


},




{

id:3,

policyName:'Temporary Access Policy',

policyCode:'POL003',

role:'User',

department:'IT',

modules:[

'Dashboard',

'Settings'

],

ipRestriction:true,

allowedIP:'10.10.10.10',

loginRestriction:'Custom Time',

sessionTimeout:15,

status:'Inactive',

isDefault:false


}


];






model:any=this.emptyModel();





emptyModel(){


return {


id:0,

policyName:'',

policyCode:'',

role:'Admin',

department:'All Departments',

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


this.spinner.show();


setTimeout(()=>{


this.spinner.hide();


this.alert.success(

'Access policies refreshed successfully.'

);


},500);


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




this.spinner.show();



setTimeout(()=>{



let modules:string[]=[];



Object.keys(this.model.moduleAccess)

.forEach((key:string)=>{


if(this.model.moduleAccess[key]){


modules.push(

key.charAt(0).toUpperCase()+key.slice(1)

);


}


});






if(this.isEdit){



let index=this.policies.findIndex(

x=>x.id===this.editId

);



if(index!=-1){



this.policies[index]={

...this.model,

modules:modules,

id:this.editId

};


}



this.alert.success(

'Access policy updated successfully.'

);



}

else{


this.model.id=new Date().getTime();


this.model.modules=modules;



this.policies.unshift({

...this.model

});



this.alert.success(

'Access policy created successfully.'

);



}





this.spinner.hide();


this.closeModal();


this.cd.detectChanges();



},500);



}








edit(item:any){


this.isEdit=true;


this.editId=item.id;


this.model={


...item,


moduleAccess:{

dashboard:item.modules.includes('Dashboard'),

leads:item.modules.includes('Leads'),

contacts:item.modules.includes('Contacts'),

deals:item.modules.includes('Deals'),

reports:item.modules.includes('Reports'),

settings:item.modules.includes('Settings')

}


};


this.showModal=true;


}







delete(id:number){


this.alert.deleteConfirm()

.then(result=>{


if(result.isConfirmed){


this.spinner.show();



setTimeout(()=>{


this.policies=this.policies.filter(

x=>x.id!==id

);



this.spinner.hide();



this.alert.success(

'Access policy deleted successfully.'

);



this.cd.detectChanges();



},500);


}



});


}







clearFilters(){


this.searchText='';

this.roleFilter='';

this.statusFilter='';


}

}
