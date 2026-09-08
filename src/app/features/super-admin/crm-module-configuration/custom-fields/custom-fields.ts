import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';

@Component({
  selector: 'app-custom-fields',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './custom-fields.html',
  styleUrl: './custom-fields.css',
})
export class CustomFields {
  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef

  ) {}





  // =====================================
  // Modal Controls
  // =====================================


  showModal = false;


  isEdit = false;


  editId = 0;





  // =====================================
  // Search
  // =====================================


  searchText = '';

  statusFilter = '';





  // =====================================
  // Static Custom Fields Data
  // =====================================


  customFields:any[] = [


    {

      id:1,

      fieldName:'Customer Priority',

      displayLabel:'Priority',

      moduleName:'Lead',

      fieldType:'Dropdown',

      defaultValue:'High',

      placeholder:'Select Priority',

      fieldOrder:1,

      description:'Lead priority level',

      isRequired:true,

      isUnique:false,

      status:'Active'

    },





    {

      id:2,

      fieldName:'Customer Age',

      displayLabel:'Age',

      moduleName:'Contact',

      fieldType:'Number',

      defaultValue:'',

      placeholder:'Enter age',

      fieldOrder:2,

      description:'Customer age information',

      isRequired:false,

      isUnique:false,

      status:'Active'

    },





    {

      id:3,

      fieldName:'GST Number',

      displayLabel:'GST',

      moduleName:'Account',

      fieldType:'Text',

      defaultValue:'',

      placeholder:'Enter GST number',

      fieldOrder:3,

      description:'Company GST identification',

      isRequired:true,

      isUnique:true,

      status:'Inactive'

    }


  ];









  // =====================================
  // Form Model
  // =====================================


  model:any = this.emptyModel();





  emptyModel(){


    return {


      id:0,


      fieldName:'',


      displayLabel:'',


      moduleName:'Lead',


      fieldType:'Text',


      defaultValue:'',


      placeholder:'',


      fieldOrder:1,


      description:'',


      isRequired:false,


      isUnique:false,


      status:'Active'


    };


  }









  // =====================================
  // Statistics
  // =====================================


  get activeCount(){


    return this.customFields.filter(

      x=>x.status==='Active'

    ).length;


  }






  get inactiveCount(){


    return this.customFields.filter(

      x=>x.status==='Inactive'

    ).length;


  }






  get mandatoryCount(){


    return this.customFields.filter(

      x=>x.isRequired

    ).length;


  }









  // =====================================
  // Filter
  // =====================================


  get filteredFields(){



    return this.customFields.filter(item=>{





      const search =



        item.fieldName

        .toLowerCase()

        .includes(

          this.searchText.toLowerCase()

        )



        ||



        item.moduleName

        .toLowerCase()

        .includes(

          this.searchText.toLowerCase()

        )



        ||



        item.fieldType

        .toLowerCase()

        .includes(

          this.searchText.toLowerCase()

        );







      const status =



        this.statusFilter === ''

        ||

        item.status === this.statusFilter;





      return search && status;



    });



  }









  // =====================================
  // Refresh
  // =====================================


  refresh(){


    this.spinner.show();



    setTimeout(()=>{


      this.spinner.hide();


      this.alert.success(

        'Custom fields refreshed successfully.'

      );


    },500);



  }









  // =====================================
  // Open Add Modal
  // =====================================


  openAddModal(){


    this.isEdit=false;


    this.editId=0;


    this.model=this.emptyModel();


    this.showModal=true;



  }









  // =====================================
  // Close Modal
  // =====================================


  closeModal(){


    this.showModal=false;


    this.model=this.emptyModel();


    this.isEdit=false;


    this.editId=0;



  }









  // =====================================
  // Save / Update
  // =====================================


  saveField(){



    if(!this.model.fieldName.trim()){


      this.alert.warning(

        'Field Name is required.'

      );


      return;

    }





    if(!this.model.displayLabel.trim()){


      this.alert.warning(

        'Display Label is required.'

      );


      return;

    }







    this.spinner.show();




    setTimeout(()=>{





      if(this.isEdit){





        const index = this.customFields.findIndex(

          x=>x.id===this.editId

        );





        if(index!==-1){


          this.customFields[index]={


            ...this.model,


            id:this.editId


          };


        }





        this.alert.success(

          'Custom field updated successfully.'

        );





      }

      else{





        this.model.id=new Date().getTime();





        this.customFields.unshift({


          ...this.model


        });





        this.alert.success(

          'Custom field created successfully.'

        );





      }







      this.spinner.hide();





      // Close Modal

      this.closeModal();





      // Refresh UI

      this.cd.detectChanges();





    },500);



  }









  // =====================================
  // Edit
  // =====================================


  edit(item:any){


    this.isEdit=true;


    this.editId=item.id;




    this.model={

      ...item

    };



    this.showModal=true;



  }









  // =====================================
  // Delete
  // =====================================


  delete(id:number){



    this.alert.deleteConfirm()

    .then(result=>{





      if(result.isConfirmed){





        this.spinner.show();





        setTimeout(()=>{





          this.customFields = this.customFields.filter(

            x=>x.id!==id

          );





          this.spinner.hide();





          this.alert.success(

            'Custom field deleted successfully.'

          );





          this.cd.detectChanges();





        },500);





      }





    });



  }









  // =====================================
  // Clear Filter
  // =====================================


  clearFilters(){


    this.searchText='';


    this.statusFilter='';


  }
}
