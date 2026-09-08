import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-projects',
  standalone:true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = '';

  projects: any[] = [];

  project: any = {

    projectId: 0,
    projectCode: 'PRJ-1001',
    projectName: '',
    customer: '',
    projectManager: '',
    projectType: '',
    priority: '',
    status: '',
    startDate: '',
    endDate: '',
    budget: '',
    completion: 0,
    teamMembers: '',
    description: '',
    isActive: true

  };

  constructor(

    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef

  ) { }

  ngOnInit(): void {

    this.loadProjects();

  }

  loadProjects() {

    this.spinner.show();

    setTimeout(() => {

      this.projects = [

        {
          projectId: 1,
          projectCode: 'PRJ-1001',
          projectName: 'CRM Implementation',
          customer: 'ABC Technologies',
          projectManager: 'Rahul Sharma',
          projectType: 'CRM Implementation',
          priority: 'High',
          status: 'In Progress',
          startDate: '2026-08-01',
          endDate: '2026-10-30',
          budget: 500000,
          completion: 65,
          teamMembers: 'Rahul, Priya, Kiran',
          description: 'CRM implementation for enterprise customer.',
          isActive: true
        },

        {
          projectId: 2,
          projectCode: 'PRJ-1002',
          projectName: 'ERP Integration',
          customer: 'XYZ Solutions',
          projectManager: 'Anil Kumar',
          projectType: 'Integration',
          priority: 'Critical',
          status: 'Planning',
          startDate: '2026-08-05',
          endDate: '2026-11-15',
          budget: 750000,
          completion: 10,
          teamMembers: 'Anil, Suresh',
          description: 'ERP integration with CRM.',
          isActive: true
        },

        {
          projectId: 3,
          projectCode: 'PRJ-1003',
          projectName: 'Support Portal',
          customer: 'Global Systems',
          projectManager: 'Priya Reddy',
          projectType: 'Support Project',
          priority: 'Medium',
          status: 'On Hold',
          startDate: '2026-07-20',
          endDate: '2026-09-25',
          budget: 300000,
          completion: 40,
          teamMembers: 'Priya, Ajay',
          description: 'Customer support portal enhancement.',
          isActive: true
        },

        {
          projectId: 4,
          projectCode: 'PRJ-1004',
          projectName: 'Data Migration',
          customer: 'TechNova Pvt Ltd',
          projectManager: 'Kiran Kumar',
          projectType: 'Migration',
          priority: 'High',
          status: 'Completed',
          startDate: '2026-06-10',
          endDate: '2026-07-25',
          budget: 450000,
          completion: 100,
          teamMembers: 'Kiran, Mahesh',
          description: 'Legacy data migration to CRM.',
          isActive: true
        },

        {
          projectId: 5,
          projectCode: 'PRJ-1005',
          projectName: 'Internal HR Portal',
          customer: 'Sunrise Industries',
          projectManager: 'Sandeep',
          projectType: 'Internal Project',
          priority: 'Low',
          status: 'Cancelled',
          startDate: '2026-08-08',
          endDate: '2026-10-01',
          budget: 200000,
          completion: 5,
          teamMembers: 'Sandeep, Ramesh',
          description: 'Internal employee HR portal.',
          isActive: true
        }

      ];

      this.projects.sort((a, b) => b.projectId - a.projectId);

      this.totalRecords = this.projects.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }

  saveProject() {

    this.submitted = true;

    if (

      !this.project.projectName ||
      !this.project.customer ||
      !this.project.projectManager ||
      !this.project.projectType ||
      !this.project.priority ||
      !this.project.status ||
      !this.project.startDate ||
      !this.project.endDate

    ) {

      return;

    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const nextId = this.projects.length
          ? Math.max(...this.projects.map(x => x.projectId)) + 1
          : 1;

        const newProject = {

          ...this.project,

          projectId: nextId,

          projectCode: 'PRJ-' + (1000 + nextId)

        };

        this.projects.unshift(newProject);

      }

      else {

        const index = this.projects.findIndex(

          x => x.projectId === this.project.projectId

        );

        if (index !== -1) {

          this.projects[index] = {

            ...this.project

          };

        }

      }

      this.projects = [...this.projects];

      this.totalRecords = this.projects.length;

      this.page = 1;

      const message = this.isEdit

        ? 'Project updated successfully.'

        : 'Project created successfully.';

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(message);

    }, 500);

  }
    edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.projects.find(
        x => x.projectId === id
      );

      if (selected) {

        this.project = {
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

          this.projects = this.projects.filter(
            x => x.projectId !== id
          );

          this.totalRecords = this.projects.length;

          if (
            this.page > 1 &&
            this.pagedProjects.length === 0
          ) {

            this.page--;

          }

          this.projects = [...this.projects];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Project deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    const nextId = this.projects.length
      ? Math.max(...this.projects.map(x => x.projectId)) + 1
      : 1;

    this.project = {

      projectId: 0,
      projectCode: 'PRJ-' + (1000 + nextId),
      projectName: '',
      customer: '',
      projectManager: '',
      projectType: '',
      priority: '',
      status: '',
      startDate: '',
      endDate: '',
      budget: '',
      completion: 0,
      teamMembers: '',
      description: '',
      isActive: true

    };

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredProjects() {

    return this.projects.filter(x =>

      x.projectCode
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.projectName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.customer
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.projectManager
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.projectType
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.priority
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.status
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

    );

  }

  get pagedProjects() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredProjects.slice(

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
