import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-project-tasks',
  standalone:true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './project-tasks.html',
  styleUrl: './project-tasks.css',
})
export class ProjectTasks {
  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = '';

  tasks: any[] = [];

  task: any = {

    taskId: 0,
    taskName: '',
    project: '',
    milestone: '',
    assignedTo: '',
    priority: '',
    status: '',
    startDate: '',
    dueDate: '',
    estimatedHours: '',
    actualHours: '',
    completion: 0,
    tags: '',
    description: '',
    isActive: true

  };

  constructor(

    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef

  ) { }

  ngOnInit(): void {

    this.loadTasks();

  }

  loadTasks() {

    this.spinner.show();

    setTimeout(() => {

      this.tasks = [

        {

          taskId: 1,
          taskName: 'Requirement Analysis',
          project: 'CRM Implementation',
          milestone: 'Requirement Gathering',
          assignedTo: 'Rahul Sharma',
          priority: 'High',
          status: 'Completed',
          startDate: '2026-08-01',
          dueDate: '2026-08-05',
          estimatedHours: 24,
          actualHours: 22,
          completion: 100,
          tags: 'Analysis,Client',
          description: 'Gather business requirements from client.',
          isActive: true

        },

        {

          taskId: 2,
          taskName: 'Database Tables',
          project: 'ERP Integration',
          milestone: 'Database Design',
          assignedTo: 'Anil Kumar',
          priority: 'Critical',
          status: 'In Progress',
          startDate: '2026-08-06',
          dueDate: '2026-08-14',
          estimatedHours: 40,
          actualHours: 18,
          completion: 45,
          tags: 'SQL,Database',
          description: 'Create database schema and tables.',
          isActive: true

        },

        {

          taskId: 3,
          taskName: 'Dashboard UI',
          project: 'Support Portal',
          milestone: 'UI Development',
          assignedTo: 'Priya Reddy',
          priority: 'Medium',
          status: 'Review',
          startDate: '2026-08-10',
          dueDate: '2026-08-20',
          estimatedHours: 32,
          actualHours: 28,
          completion: 85,
          tags: 'Angular,Bootstrap',
          description: 'Develop dashboard UI screens.',
          isActive: true

        },

        {

          taskId: 4,
          taskName: 'API Testing',
          project: 'Data Migration',
          milestone: 'System Testing',
          assignedTo: 'Kiran Kumar',
          priority: 'High',
          status: 'Open',
          startDate: '2026-08-15',
          dueDate: '2026-08-25',
          estimatedHours: 20,
          actualHours: 0,
          completion: 10,
          tags: 'API,Testing',
          description: 'Test all migration APIs.',
          isActive: true

        },

        {

          taskId: 5,
          taskName: 'Production Deployment',
          project: 'Internal HR Portal',
          milestone: 'Go Live',
          assignedTo: 'Sandeep',
          priority: 'Low',
          status: 'Cancelled',
          startDate: '2026-08-18',
          dueDate: '2026-08-30',
          estimatedHours: 12,
          actualHours: 0,
          completion: 0,
          tags: 'Deployment',
          description: 'Deploy application to production.',
          isActive: true

        }

      ];

      this.tasks.sort((a, b) => b.taskId - a.taskId);

      this.totalRecords = this.tasks.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }

  saveTask() {

    this.submitted = true;

    if (

      !this.task.taskName ||
      !this.task.project ||
      !this.task.status

    ) {

      return;

    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const nextId = this.tasks.length
          ? Math.max(...this.tasks.map(x => x.taskId)) + 1
          : 1;

        const newTask = {

          ...this.task,

          taskId: nextId

        };

        this.tasks.unshift(newTask);

      }

      else {

        const index = this.tasks.findIndex(

          x => x.taskId === this.task.taskId

        );

        if (index !== -1) {

          this.tasks[index] = {

            ...this.task

          };

        }

      }

      this.tasks = [...this.tasks];

      this.totalRecords = this.tasks.length;

      this.page = 1;

      const message = this.isEdit

        ? 'Project task updated successfully.'

        : 'Project task created successfully.';

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(message);

    }, 500);

  }
    edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.tasks.find(
        x => x.taskId === id
      );

      if (selected) {

        this.task = {
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

          this.tasks = this.tasks.filter(
            x => x.taskId !== id
          );

          this.totalRecords = this.tasks.length;

          if (
            this.page > 1 &&
            this.pagedTasks.length === 0
          ) {

            this.page--;

          }

          this.tasks = [...this.tasks];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Project task deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.task = {

      taskId: 0,
      taskName: '',
      project: '',
      milestone: '',
      assignedTo: '',
      priority: '',
      status: '',
      startDate: '',
      dueDate: '',
      estimatedHours: '',
      actualHours: '',
      completion: 0,
      tags: '',
      description: '',
      isActive: true

    };

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredTasks() {

    return this.tasks.filter(x =>

      x.taskName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.project
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.milestone
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.assignedTo
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

      ||

      x.tags
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

    );

  }

  get pagedTasks() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredTasks.slice(

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
