import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-microsoft-teams',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './microsoft-teams.html',
  styleUrl: './microsoft-teams.css',
})
export class MicrosoftTeams {
   submitted = false;

  isEdit = false;

  page = 1;

  pageSize = 5;

  totalRecords = 0;

  searchText = '';



  microsoftTeams: any[] = [];



  teams: any = {

    teamsIntegrationId: 0,

    integrationName: '',

    teamName: '',

    teamId: '',

    tenantId: '',

    clientId: '',

    clientSecret: '',

    redirectUri: '',

    notificationChannel: '',

    syncFrequency: '',

    lastSyncDate: '',

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

    this.loadMicrosoftTeams();

  }



  loadMicrosoftTeams() {

    this.spinner.show();

    setTimeout(() => {

      this.microsoftTeams = [

        {

          teamsIntegrationId: 1,

          integrationName: 'Sales Teams',

          teamName: 'Sales Team',

          teamId: 'TEAM001',

          tenantId: 'TENANT001',

          clientId: 'CLIENT001',

          clientSecret: 'SECRET001',

          redirectUri: 'https://crm.company.com/auth/teams/callback',

          notificationChannel: 'Sales Notifications',

          syncFrequency: 'Every 15 Minutes',

          lastSyncDate: '2026-08-06T09:30',

          status: 'Connected',

          description: 'Microsoft Teams integration for Sales department.',

          isActive: true

        },



        {

          teamsIntegrationId: 2,

          integrationName: 'Support Teams',

          teamName: 'Support Team',

          teamId: 'TEAM002',

          tenantId: 'TENANT002',

          clientId: 'CLIENT002',

          clientSecret: 'SECRET002',

          redirectUri: 'https://crm.company.com/auth/teams/callback',

          notificationChannel: 'Support Alerts',

          syncFrequency: 'Hourly',

          lastSyncDate: '2026-08-06T08:00',

          status: 'Connected',

          description: 'Integration for customer support collaboration.',

          isActive: true

        },



        {

          teamsIntegrationId: 3,

          integrationName: 'HR Teams',

          teamName: 'HR Department',

          teamId: 'TEAM003',

          tenantId: 'TENANT003',

          clientId: 'CLIENT003',

          clientSecret: 'SECRET003',

          redirectUri: 'https://crm.company.com/auth/teams/callback',

          notificationChannel: 'HR Updates',

          syncFrequency: 'Daily',

          lastSyncDate: '2026-08-05T18:00',

          status: 'Pending',

          description: 'HR communication and recruitment notifications.',

          isActive: true

        },
                {

          teamsIntegrationId: 4,

          integrationName: 'Marketing Teams',

          teamName: 'Marketing Team',

          teamId: 'TEAM004',

          tenantId: 'TENANT004',

          clientId: 'CLIENT004',

          clientSecret: 'SECRET004',

          redirectUri: 'https://crm.company.com/auth/teams/callback',

          notificationChannel: 'Marketing Updates',

          syncFrequency: 'Every 30 Minutes',

          lastSyncDate: '2026-08-05T14:30',

          status: 'Error',

          description: 'Microsoft Teams integration for marketing campaigns and announcements.',

          isActive: false

        },



        {

          teamsIntegrationId: 5,

          integrationName: 'Accounts Teams',

          teamName: 'Finance Team',

          teamId: 'TEAM005',

          tenantId: 'TENANT005',

          clientId: 'CLIENT005',

          clientSecret: 'SECRET005',

          redirectUri: 'https://crm.company.com/auth/teams/callback',

          notificationChannel: 'Finance Alerts',

          syncFrequency: 'Every 5 Minutes',

          lastSyncDate: '2026-08-06T09:55',

          status: 'Disconnected',

          description: 'Finance and accounts Microsoft Teams integration.',

          isActive: false

        }

      ];



      this.microsoftTeams.sort(

        (a, b) => b.teamsIntegrationId - a.teamsIntegrationId

      );



      this.totalRecords = this.microsoftTeams.length;



      this.spinner.hide();



      this.cd.detectChanges();



    }, 500);

  }
    saveMicrosoftTeams() {

    this.submitted = true;

    if (
      !this.teams.integrationName ||
      !this.teams.teamName ||
      !this.teams.teamId ||
      !this.teams.tenantId ||
      !this.teams.clientId ||
      !this.teams.clientSecret ||
      !this.teams.redirectUri ||
      !this.teams.syncFrequency ||
      !this.teams.status
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newTeam = {

          ...this.teams,

          teamsIntegrationId: this.microsoftTeams.length
            ? Math.max(...this.microsoftTeams.map(x => x.teamsIntegrationId)) + 1
            : 1

        };

        this.microsoftTeams.unshift(newTeam);

      } else {

        const index = this.microsoftTeams.findIndex(
          x => x.teamsIntegrationId === this.teams.teamsIntegrationId
        );

        if (index !== -1) {

          this.microsoftTeams[index] = {

            ...this.teams

          };

        }

      }

      this.microsoftTeams = [...this.microsoftTeams];

      this.totalRecords = this.microsoftTeams.length;

      this.page = 1;

      const isUpdate = this.isEdit;

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(

        isUpdate
          ? 'Microsoft Teams Integration updated successfully.'
          : 'Microsoft Teams Integration created successfully.'

      );

    }, 500);

  }







  edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.microsoftTeams.find(
        x => x.teamsIntegrationId === id
      );

      if (selected) {

        this.teams = {

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

          this.microsoftTeams = this.microsoftTeams.filter(
            x => x.teamsIntegrationId !== id
          );

          this.totalRecords = this.microsoftTeams.length;

          if (
            this.page > 1 &&
            this.pagedMicrosoftTeams.length === 0
          ) {

            this.page--;

          }

          this.microsoftTeams = [...this.microsoftTeams];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Microsoft Teams Integration deleted successfully.'
          );

        }, 500);

      }

    });

  }







  clear() {

    this.teams = {

      teamsIntegrationId: 0,

      integrationName: '',

      teamName: '',

      teamId: '',

      tenantId: '',

      clientId: '',

      clientSecret: '',

      redirectUri: '',

      notificationChannel: '',

      syncFrequency: '',

      lastSyncDate: '',

      status: '',

      description: '',

      isActive: true

    };

    this.submitted = false;

    this.isEdit = false;

    this.cd.detectChanges();

  }







  get filteredMicrosoftTeams() {

    return this.microsoftTeams.filter(x =>

      x.integrationName.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.teamName.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.notificationChannel.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.syncFrequency.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.status.toLowerCase().includes(this.searchText.toLowerCase())

    );

  }







  get pagedMicrosoftTeams() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredMicrosoftTeams.slice(

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
