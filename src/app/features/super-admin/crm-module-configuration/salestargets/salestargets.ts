import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';

@Component({
  selector: 'app-salestargets',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './salestargets.html',
  styleUrl: './salestargets.css',
})
export class Salestargets {
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
  // Static Sales Target Data
  // =====================================


  salesTargets:any[] = [



    {

      id:1,

      targetName:'Q1 Sales Target',

      targetCode:'Q1-SALES-001',

      employeeName:'Rahul Kumar',

      department:'Sales',

      targetAmount:50000,

      achievedAmount:42000,

      period:'Quarterly',

      status:'Active',

      description:'Quarterly sales revenue target',

      isDefault:true

    },





    {

      id:2,

      targetName:'Enterprise Deal Target',

      targetCode:'ENT-001',

      employeeName:'Priya Sharma',

      department:'Enterprise Sales',

      targetAmount:100000,

      achievedAmount:100000,

      period:'Yearly',

      status:'Completed',

      description:'Enterprise customer acquisition target',

      isDefault:false

    },





    {

      id:3,

      targetName:'Monthly Revenue Target',

      targetCode:'MONTH-001',

      employeeName:'Amit Patel',

      department:'Business Development',

      targetAmount:25000,

      achievedAmount:12000,

      period:'Monthly',

      status:'Pending',

      description:'Monthly revenue generation target',

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


      targetName:'',


      targetCode:'',


      employeeName:'',


      department:'Sales',


      targetAmount:0,


      achievedAmount:0,


      period:'Monthly',


      status:'Active',


      description:'',


      isDefault:false



    };


  }









  // =====================================
  // Statistics
  // =====================================


  get activeCount(){



    return this.salesTargets.filter(

      x => x.status === 'Active'

    ).length;



  }







  get completedCount(){



    return this.salesTargets.filter(

      x => x.status === 'Completed'

    ).length;



  }







  get defaultTarget(){



    const item = this.salesTargets.find(

      x => x.isDefault

    );



    return item ? item.targetName : '-';



  }









  // =====================================
  // Filter Sales Targets
  // =====================================


  get filteredTargets(){



    return this.salesTargets.filter(item=>{





      const search =





        item.targetName

        .toLowerCase()

        .includes(

          this.searchText.toLowerCase()

        )





        ||





        item.targetCode

        .toLowerCase()

        .includes(

          this.searchText.toLowerCase()

        )





        ||





        item.employeeName

        .toLowerCase()

        .includes(

          this.searchText.toLowerCase()

        )





        ||





        item.department

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

        'Sales Targets refreshed successfully.'

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
  // Save / Update Target
  // =====================================


  saveTarget(){





    if(!this.model.targetName.trim()){



      this.alert.warning(

        'Target Name is required.'

      );


      return;


    }







    if(!this.model.employeeName.trim()){



      this.alert.warning(

        'Employee Name is required.'

      );


      return;


    }







    this.spinner.show();







    setTimeout(()=>{





      if(this.isEdit){





        const index = this.salesTargets.findIndex(



          x => x.id === this.editId



        );







        if(index !== -1){





          this.salesTargets[index] = {



            ...this.model,


            id:this.editId



          };





        }







        this.alert.success(

          'Sales Target updated successfully.'

        );





      }

      else{





        this.model.id = new Date().getTime();







        this.salesTargets.unshift({



          ...this.model



        });







        this.alert.success(

          'Sales Target created successfully.'

        );





      }









      this.spinner.hide();







      // Close modal

      this.closeModal();







      // Refresh UI

      this.cd.detectChanges();







    },500);





  }









  // =====================================
  // Edit Target
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
  // Delete Target
  // =====================================


  delete(id:number){



    this.alert.deleteConfirm()

    .then(result=>{





      if(result.isConfirmed){





        this.spinner.show();






        setTimeout(()=>{





          this.salesTargets = this.salesTargets.filter(



            x => x.id !== id



          );







          this.spinner.hide();







          this.alert.success(

            'Sales Target deleted successfully.'

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
