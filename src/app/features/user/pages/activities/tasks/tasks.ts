import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = '';

  tasks: any[] = [];

  task: any = {

    taskId: 0,
    taskTitle: '',
    taskType: '',
    relatedTo: '',
    customer: '',
    contactPerson: '',
    assignedTo: '',
    startDate: '',
    dueDate: '',
    priority: '',
    progress: 0,
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

    this.loadTasks();

  }

  loadTasks() {

    this.spinner.show();

    setTimeout(() => {

      this.tasks = [

        {
          taskId: 1,
          taskTitle: 'CRM Follow Up',
          taskType: 'Follow Up',
          relatedTo: 'Lead',
          customer: 'ABC Technologies',
          contactPerson: 'Rahul Sharma',
          assignedTo: 'Sales Executive',
          startDate: '2026-07-29',
          dueDate: '2026-07-30',
          priority: 'High',
          progress: 20,
          reminder: '30 Minutes Before',
          status: 'Pending',
          description: 'Follow up with customer regarding CRM proposal.',
          isActive: true
        },

        {
          taskId: 2,
          taskTitle: 'Send Proposal',
          taskType: 'Proposal',
          relatedTo: 'Opportunity',
          customer: 'XYZ Solutions',
          contactPerson: 'Priya Reddy',
          assignedTo: 'Sales Manager',
          startDate: '2026-07-29',
          dueDate: '2026-07-31',
          priority: 'Medium',
          progress: 55,
          reminder: '1 Hour Before',
          status: 'In Progress',
          description: 'Prepare and send proposal document.',
          isActive: true
        },

        {
          taskId: 3,
          taskTitle: 'Product Demo',
          taskType: 'Demo',
          relatedTo: 'Account',
          customer: 'Future Vision',
          contactPerson: 'Arjun Kumar',
          assignedTo: 'CRM Executive',
          startDate: '2026-07-30',
          dueDate: '2026-08-02',
          priority: 'High',
          progress: 100,
          reminder: '15 Minutes Before',
          status: 'Completed',
          description: 'Completed online CRM demo.',
          isActive: true
        },

        {
          taskId: 4,
          taskTitle: 'Contract Review',
          taskType: 'Documentation',
          relatedTo: 'Order',
          customer: 'Global InfoTech',
          contactPerson: 'Sneha Patel',
          assignedTo: 'Legal Team',
          startDate: '2026-08-01',
          dueDate: '2026-08-04',
          priority: 'Low',
          progress: 40,
          reminder: '1 Day Before',
          status: 'Pending',
          description: 'Review customer agreement.',
          isActive: true
        },

        {
          taskId: 5,
          taskTitle: 'Requirement Discussion',
          taskType: 'Meeting',
          relatedTo: 'Contact',
          customer: 'NextGen Pvt Ltd',
          contactPerson: 'Kiran Verma',
          assignedTo: 'Business Analyst',
          startDate: '2026-08-02',
          dueDate: '2026-08-06',
          priority: 'Medium',
          progress: 60,
          reminder: '30 Minutes Before',
          status: 'On Hold',
          description: 'Requirement gathering discussion.',
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

      !this.task.taskTitle ||
      !this.task.taskType ||
      !this.task.assignedTo ||
      !this.task.startDate ||
      !this.task.dueDate ||
      !this.task.priority ||
      !this.task.status

    ) {

      return;

    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newTask = {

          ...this.task,

          taskId: this.tasks.length
            ? Math.max(...this.tasks.map(x => x.taskId)) + 1
            : 1

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

      // Refresh table immediately

      this.tasks = [...this.tasks];

      this.totalRecords = this.tasks.length;

      this.page = 1;

      const message = this.isEdit

        ? 'Task updated successfully.'

        : 'Task created successfully.';

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

          // Refresh table immediately
          this.tasks = [...this.tasks];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Task deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.task = {

      taskId: 0,
      taskTitle: '',
      taskType: '',
      relatedTo: '',
      customer: '',
      contactPerson: '',
      assignedTo: '',
      startDate: '',
      dueDate: '',
      priority: '',
      progress: 0,
      reminder: '',
      status: '',
      description: '',
      isActive: true

    };

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredTasks() {

    return this.tasks.filter(x =>

      x.taskTitle
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.taskType
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.customer
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
