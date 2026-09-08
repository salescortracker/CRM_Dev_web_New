import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './leads.html',
  styleUrl: './leads.css',
})
export class Leads {
  // =====================================
  // Form Validation
  // =====================================


  submitted = false;







  // =====================================
  // Pagination
  // =====================================


  page = 1;

  pageSize = 5;







  // =====================================
  // Search & Filters
  // =====================================


  searchText = '';

  selectedStatus = '';

  selectedSource = '';







  // =====================================
  // Lead Summary Cards
  // =====================================


  leadSummary: any = {


    total: 0,


    new: 0,


    followUps: 0,


    qualified: 0,


    converted: 0,


    lost: 0


  };








  // =====================================
  // Lead Form Object
  // =====================================


  lead: any = {


    leadId: 0,


    leadName: '',


    companyName: '',


    email: '',


    phone: '',


    website: '',


    industry: '',


    source: '',


    status: 'New',


    priority: 'Medium',


    expectedRevenue: 0,


    assignedTo: '',


    nextFollowUp: '',


    reminder: 'None',


    notes: ''


  };








  // =====================================
  // Lead Collection
  // =====================================


  leads: any[] = [];







  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef

  ) { }








  ngOnInit(): void {


    this.loadLeads();


  }








  // =====================================
  // Load Leads
  // =====================================


  loadLeads() {



    this.spinner.show();




    setTimeout(() => {



      this.leads = [




        {


          leadId: 1,


          leadName: 'Ravi Technologies',


          companyName: 'Ravi Tech Pvt Ltd',


          email: 'contact@ravitech.com',


          phone: '9876543210',


          website: 'www.ravitech.com',


          industry: 'IT Services',


          source: 'Website',


          status: 'New',


          priority: 'High',


          expectedRevenue: 50000,


          assignedTo: 'Rahul Sharma',


          nextFollowUp: '2026-08-01',


          reminder: 'Before 1 Day',


          notes: 'Interested in CRM solution'


        },






        {


          leadId: 2,


          leadName: 'ABC Healthcare',


          companyName: 'ABC Hospitals',


          email: 'info@abchealth.com',


          phone: '9123456780',


          website: 'www.abchealth.com',


          industry: 'Healthcare',


          source: 'Referral',


          status: 'Contacted',


          priority: 'Medium',


          expectedRevenue: 75000,


          assignedTo: 'Priya Singh',


          nextFollowUp: '2026-08-03',


          reminder: 'Before 1 Hour',


          notes: 'Demo scheduled'


        },






        {


          leadId: 3,


          leadName: 'Global Finance Ltd',


          companyName: 'Global Finance',


          email: 'sales@globalfinance.com',


          phone: '9988776655',


          website: 'www.globalfinance.com',


          industry: 'Finance',


          source: 'Campaign',


          status: 'Qualified',


          priority: 'High',


          expectedRevenue: 120000,


          assignedTo: 'Amit Kumar',


          nextFollowUp: '2026-08-05',


          reminder: 'Same Day',


          notes: 'Requirement analysis completed'


        },






        {


          leadId: 4,


          leadName: 'Edu Smart Academy',


          companyName: 'Edu Smart',


          email: 'admin@edusmart.com',


          phone: '9012345678',


          website: 'www.edusmart.com',


          industry: 'Education',


          source: 'Social Media',


          status: 'Converted',


          priority: 'Low',


          expectedRevenue: 90000,


          assignedTo: 'Rahul Sharma',


          nextFollowUp: '2026-07-25',


          reminder: 'None',


          notes: 'Converted to customer'


        },






        {


          leadId: 5,


          leadName: 'Manufacture Solutions',


          companyName: 'MS Industries',


          email: 'info@msindustry.com',


          phone: '9090909090',


          website: 'www.msindustry.com',


          industry: 'Manufacturing',


          source: 'Advertisement',


          status: 'Lost',


          priority: 'Low',


          expectedRevenue: 40000,


          assignedTo: 'Priya Singh',


          nextFollowUp: '2026-07-20',


          reminder: 'None',


          notes: 'Budget issue'


        }



      ];








      this.calculateLeadSummary();



      this.spinner.hide();



      this.cd.detectChanges();




    }, 500);



  }









  // =====================================
  // Calculate Dashboard Counts
  // =====================================


  calculateLeadSummary() {



    this.leadSummary.total = this.leads.length;



    this.leadSummary.new = this.leads.filter(

      x => x.status === 'New'

    ).length;




    this.leadSummary.followUps = this.leads.filter(

      x => x.nextFollowUp

    ).length;




    this.leadSummary.qualified = this.leads.filter(

      x => x.status === 'Qualified'

    ).length;




    this.leadSummary.converted = this.leads.filter(

      x => x.status === 'Converted'

    ).length;




    this.leadSummary.lost = this.leads.filter(

      x => x.status === 'Lost'

    ).length;



  }









  // =====================================
  // Save Lead
  // =====================================


  saveLead() {



    this.submitted = true;




    if (!this.lead.leadName) {


      return;


    }







    this.spinner.show();





    setTimeout(() => {



      if (this.lead.leadId === 0) {



        this.lead.leadId = this.leads.length + 1;



        this.leads.push({

          ...this.lead

        });



        this.alert.success(

          'Lead created successfully.'

        );



      }

      else {



        const index = this.leads.findIndex(


          x => x.leadId === this.lead.leadId


        );




        if (index !== -1) {



          this.leads[index] = {


            ...this.lead


          };



        }



        this.alert.success(

          'Lead updated successfully.'

        );



      }






      this.calculateLeadSummary();



      this.resetLead();



      this.spinner.hide();



      this.cd.detectChanges();




    }, 500);



  }

  // =====================================
  // Edit Lead
  // =====================================


  editLead(item: any) {


    this.lead = {


      ...item


    };



    this.submitted = false;



    window.scrollTo({

      top: 0,

      behavior: 'smooth'

    });


  }









  // =====================================
  // View Lead Details
  // =====================================


  viewLead(item: any) {



    const details = `

    Lead Name : ${item.leadName}

    Company : ${item.companyName}

    Email : ${item.email}

    Phone : ${item.phone}

    Industry : ${item.industry}

    Source : ${item.source}

    Status : ${item.status}

    Priority : ${item.priority}

    Revenue : $${item.expectedRevenue}

    Assigned To : ${item.assignedTo}

    Follow Up : ${item.nextFollowUp}

    Notes : ${item.notes}

    `;



    this.alert.info(

      'Lead Details',

      details

    );


  }









  // =====================================
  // Delete Lead
  // =====================================


  deleteLead(id: number) {



    this.alert.deleteConfirm().then(result => {



      if (result.isConfirmed) {



        this.spinner.show();




        setTimeout(() => {



          this.leads = this.leads.filter(


            x => x.leadId !== id


          );






          this.calculateLeadSummary();



          this.spinner.hide();



          this.cd.detectChanges();




          this.alert.success(


            'Lead deleted successfully.'


          );




        }, 500);



      }



    });



  }









  // =====================================
  // Convert Lead
  // =====================================


  convertLead(item: any) {



    this.alert.deleteConfirm().then(result => {



      if (result.isConfirmed) {



        this.spinner.show();




        setTimeout(() => {



          const lead = this.leads.find(


            x => x.leadId === item.leadId


          );




          if (lead) {



            lead.status = 'Converted';



          }





          this.calculateLeadSummary();



          this.spinner.hide();



          this.cd.detectChanges();





          this.alert.success(


            'Lead converted into customer successfully.'


          );




        }, 500);



      }



    });



  }









  // =====================================
  // Filtered Leads
  // =====================================


  get filteredLeads() {



    return this.leads.filter(lead => {



      const search = this.searchText

        .toLowerCase();





      const matchesSearch =



        this.searchText === '' ||



        lead.leadName

          .toLowerCase()

          .includes(search)





        ||





        lead.companyName

          .toLowerCase()

          .includes(search)





        ||





        lead.email

          .toLowerCase()

          .includes(search)







      const matchesStatus =



        this.selectedStatus === '' ||



        lead.status === this.selectedStatus;






      const matchesSource =



        this.selectedSource === '' ||



        lead.source === this.selectedSource;







      return (

        matchesSearch &&

        matchesStatus &&

        matchesSource

      );



    });



  }









  // =====================================
  // Pagination Records
  // =====================================


  get pagedLeads() {



    const start =


      (this.page - 1) * this.pageSize;






    return this.filteredLeads.slice(


      start,


      start + this.pageSize


    );



  }









  // =====================================
  // Apply Filters
  // =====================================


  applyFilters() {


    this.page = 1;


  }









  // =====================================
  // Reset Filters
  // =====================================


  resetFilters() {



    this.searchText = '';



    this.selectedStatus = '';



    this.selectedSource = '';



    this.page = 1;



  }









  // =====================================
  // Reset Lead Form
  // =====================================


  resetLead() {



    this.lead = {



      leadId: 0,


      leadName: '',


      companyName: '',


      email: '',


      phone: '',


      website: '',


      industry: '',


      source: '',


      status: 'New',


      priority: 'Medium',


      expectedRevenue: 0,


      assignedTo: '',


      nextFollowUp: '',


      reminder: 'None',


      notes: ''



    };





    this.submitted = false;



  }









  // =====================================
  // Pagination Change
  // =====================================


  changePage(pageNumber: number) {



    this.page = pageNumber;



  }









  // =====================================
  // Page Size Change
  // =====================================


  changePageSize(size: number) {



    this.pageSize = size;



    this.page = 1;



  }



}
