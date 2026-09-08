import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-calendar',
  standalone:true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar {
   submitted = false;

  isEdit = false;


  page = 1;

  pageSize = 5;

  totalRecords = 0;

  searchText = '';



  events: any[] = [];



  event: any = {


    eventId: 0,

    title: '',

    eventType: '',

    relatedTo: '',

    customer: '',

    contactPerson: '',

    assignedTo: '',

    startDate: '',

    startTime: '',

    endDate: '',

    endTime: '',

    priority: '',

    reminder: '',

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


    this.loadEvents();


  }







  loadEvents() {


    this.spinner.show();



    setTimeout(() => {



      this.events = [



        {

          eventId: 1,

          title: 'CRM Demo Meeting',

          eventType: 'Demo',

          relatedTo: 'Lead',

          customer: 'ABC Technologies',

          contactPerson: 'Rahul Sharma',

          assignedTo: 'Sales Executive',

          startDate: '2026-07-29',

          startTime: '10:00',

          endDate: '2026-07-29',

          endTime: '11:00',

          priority: 'High',

          reminder: '15 Minutes Before',

          status: 'Scheduled',

          description: 'Product demo presentation for CRM solution.',

          isActive: true

        },



        {

          eventId: 2,

          title: 'Customer Follow Up Call',

          eventType: 'Call',

          relatedTo: 'Contact',

          customer: 'XYZ Solutions',

          contactPerson: 'Priya Reddy',

          assignedTo: 'Account Manager',

          startDate: '2026-07-30',

          startTime: '14:00',

          endDate: '2026-07-30',

          endTime: '14:30',

          priority: 'Medium',

          reminder: '30 Minutes Before',

          status: 'Completed',

          description: 'Follow up discussion regarding quotation.',

          isActive: true

        },



        {

          eventId: 3,

          title: 'Product Discussion',

          eventType: 'Meeting',

          relatedTo: 'Opportunity',

          customer: 'Future Vision',

          contactPerson: 'Arjun Kumar',

          assignedTo: 'Sales Manager',

          startDate: '2026-08-01',

          startTime: '11:30',

          endDate: '2026-08-01',

          endTime: '12:30',

          priority: 'High',

          reminder: '1 Hour Before',

          status: 'Scheduled',

          description: 'Discussion about enterprise package.',

          isActive: true

        },



        {

          eventId: 4,

          title: 'Contract Renewal Reminder',

          eventType: 'Follow Up',

          relatedTo: 'Account',

          customer: 'Global InfoTech',

          contactPerson: 'Sneha Patel',

          assignedTo: 'Customer Success',

          startDate: '2026-08-05',

          startTime: '09:30',

          endDate: '2026-08-05',

          endTime: '10:00',

          priority: 'Low',

          reminder: '5 Minutes Before',

          status: 'Scheduled',

          description: 'Annual contract renewal discussion.',

          isActive: true

        },



        {

          eventId: 5,

          title: 'Training Session',

          eventType: 'Training',

          relatedTo: 'Account',

          customer: 'NextGen Pvt Ltd',

          contactPerson: 'Kiran Verma',

          assignedTo: 'Support Team',

          startDate: '2026-08-10',

          startTime: '15:00',

          endDate: '2026-08-10',

          endTime: '17:00',

          priority: 'Medium',

          reminder: '30 Minutes Before',

          status: 'Scheduled',

          description: 'User training session for CRM application.',

          isActive: true

        }



      ];




      this.events.sort(

        (a, b) => b.eventId - a.eventId

      );



      this.totalRecords = this.events.length;



      this.spinner.hide();



      this.cd.detectChanges();



    }, 500);



  }









  saveEvent() {



    this.submitted = true;



    if (


      !this.event.title ||

      !this.event.eventType ||

      !this.event.startDate ||

      !this.event.startTime ||

      !this.event.status


    ) {


      return;


    }






    this.spinner.show();




    setTimeout(() => {




      if (!this.isEdit) {




        const newEvent = {


          ...this.event,


          eventId:

            this.events.length

              ?

              Math.max(

                ...this.events.map(x => x.eventId)

              ) + 1

              :

              1


        };



        this.events.unshift(newEvent);



      }

      else {



        const index = this.events.findIndex(


          x => x.eventId === this.event.eventId


        );



        if (index !== -1) {


          this.events[index] = {


            ...this.event


          };


        }



      }





      // Immediate UI refresh

      this.events = [

        ...this.events

      ];



      this.totalRecords = this.events.length;



      this.page = 1;



      const message = this.isEdit

        ?

        'Calendar event updated successfully.'

        :

        'Calendar event created successfully.';





      this.clear();



      this.spinner.hide();



      this.cd.detectChanges();



      this.alert.success(message);




    }, 500);



  }

    edit(id: number) {


    this.spinner.show();



    setTimeout(() => {



      const selected = this.events.find(

        x => x.eventId === id

      );



      if (selected) {


        this.event = {

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




          this.events = this.events.filter(


            x => x.eventId !== id


          );




          this.totalRecords = this.events.length;



          if (

            this.page > 1 &&

            this.pagedEvents.length === 0

          ) {


            this.page--;


          }




          // Immediate table refresh

          this.events = [

            ...this.events

          ];



          this.spinner.hide();



          this.cd.detectChanges();




          this.alert.success(

            'Calendar event deleted successfully.'

          );




        }, 500);



      }



    });



  }









  clear() {



    this.event = {



      eventId: 0,

      title: '',

      eventType: '',

      relatedTo: '',

      customer: '',

      contactPerson: '',

      assignedTo: '',

      startDate: '',

      startTime: '',

      endDate: '',

      endTime: '',

      priority: '',

      reminder: '',

      status: '',

      description: '',

      isActive: true



    };




    this.isEdit = false;



    this.submitted = false;



    this.cd.detectChanges();



  }









  get filteredEvents() {



    return this.events.filter(x =>




      (

        x.title +

        ' ' +

        x.eventType +

        ' ' +

        x.customer +

        ' ' +

        x.contactPerson +

        ' ' +

        x.status

      )

      .toLowerCase()

      .includes(

        this.searchText.toLowerCase()

      )



    );



  }









  get pagedEvents() {



    const start =

      (this.page - 1) * this.pageSize;



    return this.filteredEvents.slice(



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
