import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [CommonModule, FormsModule,Pagination],
  templateUrl: './contracts.html',
  styleUrl: './contracts.css',
})
export class Contracts {
   submitted = false;

  isEdit = false;


  page = 1;

  pageSize = 5;

  totalRecords = 0;


  searchText = '';



  contracts: any[] = [];



  contract: any = {


    contractId: 0,

    contractName: '',

    contractNumber: '',

    account: '',

    contact: '',

    contractType: '',

    startDate: '',

    endDate: '',

    contractValue: 0,

    billingFrequency: '',

    renewalType: '',

    autoRenewal: false,

    status: '',

    description: '',

    isActive: true


  };




  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef

  ) { }




  ngOnInit(): void {


    this.loadContracts();


  }





  loadContracts() {


    this.spinner.show();



    setTimeout(() => {



      this.contracts = [




        {

          contractId: 1,

          contractName: 'CRM Support Contract',

          contractNumber: 'CTR001',

          account: 'ABC Technologies',

          contact: 'Rahul Sharma',

          contractType: 'Support Contract',

          startDate: '2026-01-01',

          endDate: '2026-12-31',

          contractValue: 250000,

          billingFrequency: 'Yearly',

          renewalType: 'Auto Renewal',

          autoRenewal: true,

          status: 'Active',

          description: 'Annual CRM support and maintenance contract.',

          isActive: true

        },





        {

          contractId: 2,

          contractName: 'HRMS AMC Contract',

          contractNumber: 'CTR002',

          account: 'XYZ Solutions',

          contact: 'Priya Reddy',

          contractType: 'AMC Contract',

          startDate: '2026-02-15',

          endDate: '2027-02-14',

          contractValue: 180000,

          billingFrequency: 'Yearly',

          renewalType: 'Manual Renewal',

          autoRenewal: false,

          status: 'Active',

          description: 'Annual HRMS application maintenance contract.',

          isActive: true

        },





        {

          contractId: 3,

          contractName: 'ERP License Agreement',

          contractNumber: 'CTR003',

          account: 'Future Vision',

          contact: 'Arjun Kumar',

          contractType: 'License Contract',

          startDate: '2026-03-01',

          endDate: '2027-02-28',

          contractValue: 450000,

          billingFrequency: 'One Time',

          renewalType: 'No Renewal',

          autoRenewal: false,

          status: 'Draft',

          description: 'ERP software license agreement.',

          isActive: true

        },
                {

          contractId: 4,

          contractName: 'Cloud Subscription Contract',

          contractNumber: 'CTR004',

          account: 'Global InfoTech',

          contact: 'Sneha Patel',

          contractType: 'Subscription Contract',

          startDate: '2026-04-01',

          endDate: '2027-03-31',

          contractValue: 520000,

          billingFrequency: 'Monthly',

          renewalType: 'Auto Renewal',

          autoRenewal: true,

          status: 'Renewed',

          description: 'Cloud service subscription renewal contract.',

          isActive: true

        },





        {

          contractId: 5,

          contractName: 'Digital Marketing Agreement',

          contractNumber: 'CTR005',

          account: 'NextGen Pvt Ltd',

          contact: 'Kiran Verma',

          contractType: 'Service Contract',

          startDate: '2026-05-01',

          endDate: '2026-10-31',

          contractValue: 95000,

          billingFrequency: 'Half Yearly',

          renewalType: 'Manual Renewal',

          autoRenewal: false,

          status: 'Expired',

          description: 'Digital marketing service agreement.',

          isActive: false

        }



      ];




      this.contracts.sort(

        (a, b) => b.contractId - a.contractId

      );




      this.totalRecords = this.contracts.length;




      this.spinner.hide();




      this.cd.detectChanges();




    }, 500);



  }
    saveContract() {

    this.submitted = true;


    if (

      !this.contract.contractName ||

      !this.contract.contractNumber ||

      !this.contract.account ||

      !this.contract.contact ||

      !this.contract.contractType ||

      !this.contract.startDate ||

      !this.contract.endDate ||

      !this.contract.contractValue ||

      !this.contract.status

    ) {

      return;

    }



    this.spinner.show();



    setTimeout(() => {



      if (!this.isEdit) {



        const newContract = {



          ...this.contract,



          contractId: this.contracts.length

            ? Math.max(...this.contracts.map(x => x.contractId)) + 1

            : 1



        };



        this.contracts.unshift(newContract);



      }

      else {



        const index = this.contracts.findIndex(


          x => x.contractId === this.contract.contractId


        );



        if (index !== -1) {



          this.contracts[index] = {



            ...this.contract



          };



        }



      }





      this.contracts = [...this.contracts];



      this.totalRecords = this.contracts.length;



      this.page = 1;



      const isUpdate = this.isEdit;



      this.clear();



      this.spinner.hide();



      this.cd.detectChanges();




      this.alert.success(



        isUpdate

          ? 'Contract updated successfully.'

          : 'Contract created successfully.'



      );



    }, 500);



  }







  edit(id: number) {



    this.spinner.show();




    setTimeout(() => {




      const selected = this.contracts.find(


        x => x.contractId === id


      );




      if (selected) {



        this.contract = {



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




          this.contracts = this.contracts.filter(



            x => x.contractId !== id



          );





          this.totalRecords = this.contracts.length;





          if (



            this.page > 1 &&



            this.pagedContracts.length === 0



          ) {



            this.page--;



          }






          this.contracts = [...this.contracts];





          this.spinner.hide();





          this.cd.detectChanges();





          this.alert.success(



            'Contract deleted successfully.'



          );





        }, 500);




      }




    });



  }








  clear() {



    this.contract = {



      contractId: 0,

      contractName: '',

      contractNumber: '',

      account: '',

      contact: '',

      contractType: '',

      startDate: '',

      endDate: '',

      contractValue: 0,

      billingFrequency: '',

      renewalType: '',

      autoRenewal: false,

      status: '',

      description: '',

      isActive: true



    };





    this.isEdit = false;



    this.submitted = false;



    this.cd.detectChanges();



  }








  get filteredContracts() {



    return this.contracts.filter(x =>




      x.contractName

        .toLowerCase()

        .includes(this.searchText.toLowerCase())




      ||




      x.contractNumber

        .toLowerCase()

        .includes(this.searchText.toLowerCase())




      ||




      x.account

        .toLowerCase()

        .includes(this.searchText.toLowerCase())




      ||




      x.contact

        .toLowerCase()

        .includes(this.searchText.toLowerCase())




      ||




      x.contractType

        .toLowerCase()

        .includes(this.searchText.toLowerCase())




      ||




      x.status

        .toLowerCase()

        .includes(this.searchText.toLowerCase())



    );



  }








  get pagedContracts() {



    const start = (this.page - 1) * this.pageSize;



    return this.filteredContracts.slice(



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
