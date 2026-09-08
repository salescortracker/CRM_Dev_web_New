import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../core/services/alertservice';
import { Spinnerservice } from '../../../core/services/spinnerservice';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  constructor(

private alert:Alertservice,

private spinner:Spinnerservice,

private cd:ChangeDetectorRef

){}





// MODAL

showModal=false;

isEdit=false;

editId=0;



// FILTER

searchText='';

roleFilter='';

statusFilter='';





// STATIC USERS DATA


users:any[]=[


{

id:1,

firstName:'John',

lastName:'Smith',

email:'john@crm.com',

mobile:'9876543210',

employeeCode:'EMP001',

department:'Sales',

designation:'Manager',

role:'Admin',

username:'john',

password:'123456',

confirmPassword:'123456',

status:'Active',

loginAccess:true,

lastLogin:'25-Jul-2026'


},



{

id:2,

firstName:'Sarah',

lastName:'Wilson',

email:'sarah@crm.com',

mobile:'9988776655',

employeeCode:'EMP002',

department:'IT',

designation:'Developer',

role:'User',

username:'sarah',

password:'123456',

confirmPassword:'123456',

status:'Active',

loginAccess:true,

lastLogin:'24-Jul-2026'


},



{

id:3,

firstName:'David',

lastName:'Brown',

email:'david@crm.com',

mobile:'8899776655',

employeeCode:'EMP003',

department:'HR',

designation:'Executive',

role:'Admin',

username:'david',

password:'123456',

confirmPassword:'123456',

status:'Inactive',

loginAccess:false,

lastLogin:'20-Jul-2026'


}



];







model:any=this.emptyModel();





emptyModel(){

return {


id:0,

firstName:'',

lastName:'',

email:'',

mobile:'',

employeeCode:'',

department:'Sales',

designation:'Manager',

role:'User',

username:'',

password:'',

confirmPassword:'',

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


this.spinner.show();


setTimeout(()=>{


this.spinner.hide();


this.alert.success(
'Users refreshed successfully.'
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





this.spinner.show();



setTimeout(()=>{



if(this.isEdit){



let index=this.users.findIndex(
x=>x.id===this.editId
);



if(index!=-1){


this.users[index]={

...this.model,

id:this.editId

};


}



this.alert.success(
'User updated successfully.'
);



}

else{



this.model.id=new Date().getTime();



this.model.lastLogin='Today';



this.users.unshift({

...this.model

});



this.alert.success(
'User created successfully.'
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

...item

};


this.showModal=true;


}








delete(id:number){



this.alert.deleteConfirm()

.then(result=>{


if(result.isConfirmed){



this.spinner.show();



setTimeout(()=>{


this.users=this.users.filter(
x=>x.id!==id
);



this.spinner.hide();



this.alert.success(
'User deleted successfully.'
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
