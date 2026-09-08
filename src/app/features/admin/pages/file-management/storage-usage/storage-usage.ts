import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-storage-usage',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './storage-usage.html',
  styleUrl: './storage-usage.css',
})
export class StorageUsage {
  submitted = false;

  isEdit = false;

  page = 1;

  pageSize = 5;

  totalRecords = 0;

  searchText = '';



  storageUsages: any[] = [];



  storageUsage: any = {

    storageUsageId: 0,

    storageName: '',

    storageType: '',

    totalCapacity: null,

    usedCapacity: null,

    availableCapacity: null,

    usagePercentage: null,

    providerName: '',

    description: '',

    isActive: true

  };





  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef

  ) { }





  ngOnInit(): void {

    this.loadStorageUsage();

  }







  loadStorageUsage() {


    this.spinner.show();


    setTimeout(() => {


      this.storageUsages = [


        {

          storageUsageId: 1,

          storageName: 'Employee Storage',

          storageType: 'Local Storage',

          totalCapacity: 500,

          usedCapacity: 320,

          availableCapacity: 180,

          usagePercentage: 64,

          providerName: 'Internal Server',

          description: 'Storage for employee documents and files.',

          isActive: true

        },





        {

          storageUsageId: 2,

          storageName: 'Customer Files',

          storageType: 'Azure Blob Storage',

          totalCapacity: 1000,

          usedCapacity: 650,

          availableCapacity: 350,

          usagePercentage: 65,

          providerName: 'Microsoft Azure',

          description: 'Customer uploaded files storage.',

          isActive: true

        },





        {

          storageUsageId: 3,

          storageName: 'Backup Storage',

          storageType: 'Amazon S3',

          totalCapacity: 2000,

          usedCapacity: 900,

          availableCapacity: 1100,

          usagePercentage: 45,

          providerName: 'AWS',

          description: 'Application backup storage.',

          isActive: true

        },
                {

          storageUsageId: 4,

          storageName: 'Marketing Storage',

          storageType: 'Google Cloud Storage',

          totalCapacity: 1500,

          usedCapacity: 450,

          availableCapacity: 1050,

          usagePercentage: 30,

          providerName: 'Google Cloud',

          description: 'Storage for marketing images, videos and promotional files.',

          isActive: true

        },





        {

          storageUsageId: 5,

          storageName: 'Archive Storage',

          storageType: 'Azure Blob Storage',

          totalCapacity: 3000,

          usedCapacity: 1200,

          availableCapacity: 1800,

          usagePercentage: 40,

          providerName: 'Microsoft Azure',

          description: 'Long term archived document storage.',

          isActive: false

        }


      ];





      this.storageUsages.sort(


        (a, b) => b.storageUsageId - a.storageUsageId


      );





      this.totalRecords = this.storageUsages.length;





      this.spinner.hide();





      this.cd.detectChanges();





    }, 500);


  }
    saveStorageUsage() {

    this.submitted = true;

    if (
      !this.storageUsage.storageName ||
      !this.storageUsage.storageType ||
      !this.storageUsage.totalCapacity ||
      !this.storageUsage.usedCapacity
    ) {
      return;
    }


    this.spinner.show();


    setTimeout(() => {


      if (!this.isEdit) {


        const newStorage = {


          ...this.storageUsage,


          storageUsageId: this.storageUsages.length

            ? Math.max(...this.storageUsages.map(x => x.storageUsageId)) + 1

            : 1


        };


        this.storageUsages.unshift(newStorage);


      }

      else {


        const index = this.storageUsages.findIndex(


          x => x.storageUsageId === this.storageUsage.storageUsageId


        );


        if (index !== -1) {


          this.storageUsages[index] = {


            ...this.storageUsage


          };


        }


      }





      this.storageUsages = [...this.storageUsages];


      this.totalRecords = this.storageUsages.length;


      this.page = 1;


      const isUpdate = this.isEdit;


      this.clear();


      this.spinner.hide();


      this.cd.detectChanges();



      this.alert.success(


        isUpdate

          ? 'Storage Usage updated successfully.'

          : 'Storage Usage created successfully.'


      );



    }, 500);


  }







  edit(id: number) {


    this.spinner.show();



    setTimeout(() => {



      const selected = this.storageUsages.find(


        x => x.storageUsageId === id


      );



      if (selected) {



        this.storageUsage = {


          ...selected


        };



        this.isEdit = true;


        this.submitted = false;



        this.cd.detectChanges();



      }



      this.spinner.hide();



    }, 300);



  }







  delete(id: number) {



    this.alert.deleteConfirm().then(result => {



      if (result.isConfirmed) {



        this.spinner.show();



        setTimeout(() => {



          this.storageUsages = this.storageUsages.filter(


            x => x.storageUsageId !== id


          );



          this.totalRecords = this.storageUsages.length;




          if (


            this.page > 1 &&


            this.pagedStorageUsages.length === 0


          ) {


            this.page--;


          }





          this.storageUsages = [...this.storageUsages];



          this.spinner.hide();



          this.cd.detectChanges();




          this.alert.success(


            'Storage Usage deleted successfully.'


          );



        }, 500);



      }



    });



  }







  clear() {



    this.storageUsage = {



      storageUsageId: 0,


      storageName: '',


      storageType: '',


      totalCapacity: null,


      usedCapacity: null,


      availableCapacity: null,


      usagePercentage: null,


      providerName: '',


      description: '',


      isActive: true



    };



    this.submitted = false;



    this.isEdit = false;



    this.cd.detectChanges();



  }







  get filteredStorageUsages() {



    return this.storageUsages.filter(x =>



      x.storageName.toLowerCase().includes(


        this.searchText.toLowerCase()


      )



      ||



      x.storageType.toLowerCase().includes(


        this.searchText.toLowerCase()


      )



      ||



      x.providerName.toLowerCase().includes(


        this.searchText.toLowerCase()


      )



    );



  }







  get pagedStorageUsages() {



    const start = (this.page - 1) * this.pageSize;



    return this.filteredStorageUsages.slice(



      start,



      start + this.pageSize



    );



  }







  changePage(page: number) {



    this.page = page;



  }







  changePageSize(size: number) {



    this.pageSize = size;



    this.page = 1;



  }



}
