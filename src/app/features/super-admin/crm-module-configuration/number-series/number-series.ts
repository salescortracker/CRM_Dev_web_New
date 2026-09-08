import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';

@Component({
  selector: 'app-number-series',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './number-series.html',
  styleUrl: './number-series.css',
})
export class NumberSeries {
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
  // Static Number Series Data
  // =====================================


  numberSeries:any[] = [



    {

      id:1,

      seriesName:'Lead Number Series',

      moduleName:'Lead',

      prefix:'LEAD',

      startNumber:1000,

      currentNumber:1056,

      format:'LEAD-{YYYY}-{0000}',

      description:'Automatic numbering for leads',

      status:'Active',

      isDefault:true

    },





    {

      id:2,

      seriesName:'Opportunity Series',

      moduleName:'Opportunity',

      prefix:'OPP',

      startNumber:5000,

      currentNumber:5032,

      format:'OPP-{YYYY}-{0000}',

      description:'Opportunity numbering sequence',

      status:'Active',

      isDefault:false

    },





    {

      id:3,

      seriesName:'Invoice Number Series',

      moduleName:'Invoice',

      prefix:'INV',

      startNumber:2000,

      currentNumber:2015,

      format:'INV-{YYYY}-{0000}',

      description:'Invoice generation series',

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


      seriesName:'',


      moduleName:'Lead',


      prefix:'',


      startNumber:1000,


      currentNumber:1000,


      format:'',


      description:'',


      status:'Active',


      isDefault:false



    };



  }









  // =====================================
  // Statistics
  // =====================================


  get activeCount(){



    return this.numberSeries.filter(

      x => x.status === 'Active'

    ).length;



  }







  get inactiveCount(){



    return this.numberSeries.filter(

      x => x.status === 'Inactive'

    ).length;



  }







  get defaultSeries(){



    const item = this.numberSeries.find(

      x => x.isDefault

    );



    return item ? item.seriesName : '-';



  }









  // =====================================
  // Filter Number Series
  // =====================================


  get filteredSeries(){



    return this.numberSeries.filter(item=>{





      const search =





        item.seriesName

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





        item.prefix

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

        'Number Series refreshed successfully.'

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
  // Save / Update Series
  // =====================================


  saveSeries(){





    if(!this.model.seriesName.trim()){



      this.alert.warning(

        'Series Name is required.'

      );


      return;


    }







    if(!this.model.prefix.trim()){



      this.alert.warning(

        'Prefix is required.'

      );


      return;


    }







    this.spinner.show();







    setTimeout(()=>{





      if(this.isEdit){





        const index = this.numberSeries.findIndex(



          x => x.id === this.editId



        );







        if(index !== -1){





          this.numberSeries[index] = {



            ...this.model,


            id:this.editId



          };





        }







        this.alert.success(

          'Number Series updated successfully.'

        );





      }

      else{





        this.model.id = new Date().getTime();







        this.numberSeries.unshift({



          ...this.model



        });







        this.alert.success(

          'Number Series created successfully.'

        );





      }









      this.spinner.hide();







      // Close modal after save/update

      this.closeModal();







      // Refresh UI

      this.cd.detectChanges();







    },500);





  }









  // =====================================
  // Edit Series
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
  // Delete Series
  // =====================================


  delete(id:number){



    this.alert.deleteConfirm()

    .then(result=>{





      if(result.isConfirmed){





        this.spinner.show();






        setTimeout(()=>{





          this.numberSeries = this.numberSeries.filter(



            x => x.id !== id



          );







          this.spinner.hide();







          this.alert.success(

            'Number Series deleted successfully.'

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
