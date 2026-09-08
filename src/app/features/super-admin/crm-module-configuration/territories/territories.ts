import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';

@Component({
  selector: 'app-territories',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './territories.html',
  styleUrl: './territories.css',
})
export class Territories {
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
  // Static Territory Data
  // =====================================


  territories:any[] = [



    {

      id:1,

      territoryName:'South India Sales',

      territoryCode:'SOUTH-001',

      region:'South Region',

      managerName:'Ravi Kumar',

      customerCount:120,

      priority:'High',

      description:'Covers Andhra Pradesh, Telangana and Karnataka regions',

      status:'Active',

      isDefault:true

    },





    {

      id:2,

      territoryName:'North India Sales',

      territoryCode:'NORTH-001',

      region:'North Region',

      managerName:'Amit Sharma',

      customerCount:95,

      priority:'High',

      description:'Covers Delhi, Punjab and Haryana regions',

      status:'Active',

      isDefault:false

    },





    {

      id:3,

      territoryName:'West India Sales',

      territoryCode:'WEST-001',

      region:'West Region',

      managerName:'Priya Patel',

      customerCount:75,

      priority:'Medium',

      description:'Covers Maharashtra and Gujarat regions',

      status:'Active',

      isDefault:false

    },





    {

      id:4,

      territoryName:'East India Sales',

      territoryCode:'EAST-001',

      region:'East Region',

      managerName:'Suresh Das',

      customerCount:60,

      priority:'Medium',

      description:'Covers West Bengal and Odisha regions',

      status:'Inactive',

      isDefault:false

    }



  ];









  // =====================================
  // Form Model
  // =====================================


  model:any = this.emptyModel();






  emptyModel(){



    return {



      id:0,


      territoryName:'',


      territoryCode:'',


      region:'South Region',


      managerName:'',


      customerCount:0,


      priority:'Medium',


      description:'',


      status:'Active',


      isDefault:false



    };


  }









  // =====================================
  // Statistics
  // =====================================


  get activeCount(){



    return this.territories.filter(

      x => x.status === 'Active'

    ).length;



  }







  get inactiveCount(){



    return this.territories.filter(

      x => x.status === 'Inactive'

    ).length;



  }







  get defaultTerritory(){



    const item = this.territories.find(

      x => x.isDefault

    );



    return item ? item.territoryName : '-';



  }









  // =====================================
  // Filter Territories
  // =====================================


  get filteredTerritories(){



    return this.territories.filter(item=>{





      const search =



        item.territoryName

        .toLowerCase()

        .includes(

          this.searchText.toLowerCase()

        )





        ||





        item.territoryCode

        .toLowerCase()

        .includes(

          this.searchText.toLowerCase()

        )





        ||





        item.region

        .toLowerCase()

        .includes(

          this.searchText.toLowerCase()

        )





        ||





        item.managerName

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

        'Territories refreshed successfully.'

      );



    },500);



  }









  // =====================================
  // Open Add Modal
  // =====================================


  openAddModal(){



    this.isEdit = false;


    this.editId = 0;


    this.model = this.emptyModel();


    this.showModal = true;



  }









  // =====================================
  // Close Modal
  // =====================================


  closeModal(){



    this.showModal = false;


    this.model = this.emptyModel();


    this.isEdit = false;


    this.editId = 0;



  }









  // =====================================
  // Save / Update Territory
  // =====================================


  saveTerritory(){





    if(!this.model.territoryName.trim()){



      this.alert.warning(

        'Territory Name is required.'

      );


      return;


    }







    if(!this.model.territoryCode.trim()){



      this.alert.warning(

        'Territory Code is required.'

      );


      return;


    }







    this.spinner.show();







    setTimeout(()=>{





      if(this.isEdit){





        const index = this.territories.findIndex(



          x => x.id === this.editId



        );







        if(index !== -1){





          this.territories[index] = {



            ...this.model,


            id:this.editId



          };





        }







        this.alert.success(

          'Territory updated successfully.'

        );





      }

      else{





        this.model.id = new Date().getTime();







        this.territories.unshift({



          ...this.model



        });







        this.alert.success(

          'Territory created successfully.'

        );





      }









      this.spinner.hide();







      // Auto Close Modal

      this.closeModal();







      // Refresh UI

      this.cd.detectChanges();







    },500);





  }









  // =====================================
  // Edit Territory
  // =====================================


  edit(item:any){



    this.isEdit = true;


    this.editId = item.id;





    this.model = {



      ...item



    };







    this.showModal = true;



  }









  // =====================================
  // Delete Territory
  // =====================================


  delete(id:number){



    this.alert.deleteConfirm()

    .then(result=>{





      if(result.isConfirmed){





        this.spinner.show();






        setTimeout(()=>{





          this.territories = this.territories.filter(



            x => x.id !== id



          );







          this.spinner.hide();







          this.alert.success(

            'Territory deleted successfully.'

          );







          this.cd.detectChanges();







        },500);





      }





    });



  }









  // =====================================
  // Clear Filters
  // =====================================


  clearFilters(){



    this.searchText = '';


    this.statusFilter = '';



  }

}
