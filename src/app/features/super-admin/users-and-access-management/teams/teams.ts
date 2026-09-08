import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alertservice } from '../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../core/services/spinnerservice';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teams.html',
  styleUrl: './teams.css',
})
export class Teams {
  constructor(

    private alert: Alertservice,

    private spinner: Spinnerservice,

    private cd: ChangeDetectorRef

  ) { }





  showModal = false;

  isEdit = false;

  editId = 0;



  searchText = '';

  departmentFilter = '';

  statusFilter = '';






  teams: any[] = [


    {

      id: 1,

      teamName: 'Sales Team',

      teamCode: 'TEAM001',

      department: 'Sales',

      teamLead: 'John Smith',

      description: 'Handles enterprise sales activities',

      members: [

        'John Smith',

        'Sarah Wilson'

      ],

      createdDate: '20-Jul-2026',

      status: 'Active',

      isDefault: true


    },



    {

      id: 2,

      teamName: 'Development Team',

      teamCode: 'TEAM002',

      department: 'IT',

      teamLead: 'David Brown',

      description: 'Responsible for CRM development',

      members: [

        'David Brown',

        'Michael Johnson'

      ],

      createdDate: '18-Jul-2026',

      status: 'Active',

      isDefault: false


    },



    {

      id: 3,

      teamName: 'HR Team',

      teamCode: 'TEAM003',

      department: 'HR',

      teamLead: 'Sarah Wilson',

      description: 'Handles employee operations',

      members: [

        'Sarah Wilson'

      ],

      createdDate: '10-Jul-2026',

      status: 'Inactive',

      isDefault: false


    }


  ];








  model: any = this.emptyModel();






  emptyModel() {


    return {


      id: 0,

      teamName: '',

      teamCode: '',

      department: 'Sales',

      teamLead: '',

      description: '',

      members: [],

      membersList: {

        john: false,

        sarah: false,

        david: false,

        michael: false

      },

      createdDate: '',

      status: 'Active',

      isDefault: false


    };


  }







  // STATISTICS


  get activeTeams() {


    return this.teams.filter(

      x => x.status === 'Active'

    ).length;


  }



  get inactiveTeams() {


    return this.teams.filter(

      x => x.status === 'Inactive'

    ).length;


  }



  get totalMembers() {


    return this.teams.reduce(

      (total, item) => total + item.members.length,

      0

    );


  }








  // FILTER


  get filteredTeams() {


    return this.teams.filter(item => {


      let search =


        item.teamName

          .toLowerCase()

          .includes(this.searchText.toLowerCase())

        ||

        item.teamLead

          .toLowerCase()

          .includes(this.searchText.toLowerCase());





      let department =


        this.departmentFilter == ''

        ||

        item.department === this.departmentFilter;





      let status =


        this.statusFilter == ''

        ||

        item.status === this.statusFilter;





      return search && department && status;


    });


  }







  refresh() {


    this.spinner.show();


    setTimeout(() => {


      this.spinner.hide();


      this.alert.success(

        'Teams refreshed successfully.'

      );


    }, 500);


  }







  openAddModal() {


    this.isEdit = false;

    this.editId = 0;

    this.model = this.emptyModel();

    this.showModal = true;


  }







  closeModal() {


    this.showModal = false;

    this.model = this.emptyModel();

    this.isEdit = false;

    this.editId = 0;


  }







  saveTeam() {



    if (!this.model.teamName.trim()) {


      this.alert.warning(

        'Team Name is required.'

      );


      return;


    }





    this.spinner.show();



    setTimeout(() => {



      let selectedMembers: string[] = [];



      Object.keys(this.model.membersList)

        .forEach(key => {


          if (this.model.membersList[key]) {


            selectedMembers.push(key);


          }


        });





      if (this.isEdit) {



        let index = this.teams.findIndex(

          x => x.id === this.editId

        );



        if (index != -1) {



          this.teams[index] = {

            ...this.model,

            members: selectedMembers,

            id: this.editId

          };


        }



        this.alert.success(

          'Team updated successfully.'

        );



      }

      else {


        this.model.id = new Date().getTime();


        this.model.members = selectedMembers;


        this.model.createdDate = '27-Jul-2026';



        this.teams.unshift({

          ...this.model

        });



        this.alert.success(

          'Team created successfully.'

        );


      }





      this.spinner.hide();


      this.closeModal();


      this.cd.detectChanges();



    }, 500);



  }









  edit(item: any) {



    this.isEdit = true;


    this.editId = item.id;


    this.model = {


      ...item,


      membersList: {

        john: false,

        sarah: false,

        david: false,

        michael: false

      }


    };



    this.showModal = true;


  }









  delete(id: number) {



    this.alert.deleteConfirm()

      .then(result => {


        if (result.isConfirmed) {



          this.spinner.show();



          setTimeout(() => {


            this.teams = this.teams.filter(

              x => x.id !== id

            );



            this.spinner.hide();



            this.alert.success(

              'Team deleted successfully.'

            );



            this.cd.detectChanges();



          }, 500);



        }



      });


  }







  clearFilters() {


    this.searchText = '';

    this.departmentFilter = '';

    this.statusFilter = '';


  }
}
