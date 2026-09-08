import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-milestones',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './milestones.html',
  styleUrl: './milestones.css',
})
export class Milestones {
   submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = '';

  milestones: any[] = [];

  milestone: any = {

    milestoneId: 0,
    milestoneName: '',
    project: '',
    owner: '',
    dueDate: '',
    status: '',
    completion: 0,
    estimatedHours: '',
    actualHours: '',
    priority: '',
    targetDate: '',
    description: '',
    isActive: true

  };

  constructor(

    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef

  ) { }

  ngOnInit(): void {

    this.loadMilestones();

  }

  loadMilestones() {

    this.spinner.show();

    setTimeout(() => {

      this.milestones = [

        {

          milestoneId: 1,
          milestoneName: 'Requirement Gathering',
          project: 'CRM Implementation',
          owner: 'Rahul Sharma',
          dueDate: '2026-08-10',
          status: 'Completed',
          completion: 100,
          estimatedHours: 40,
          actualHours: 38,
          priority: 'High',
          targetDate: '2026-08-10',
          description: 'Collect business requirements from client.',
          isActive: true

        },

        {

          milestoneId: 2,
          milestoneName: 'Database Design',
          project: 'ERP Integration',
          owner: 'Anil Kumar',
          dueDate: '2026-08-18',
          status: 'In Progress',
          completion: 65,
          estimatedHours: 60,
          actualHours: 42,
          priority: 'Critical',
          targetDate: '2026-08-18',
          description: 'Design database architecture.',
          isActive: true

        },

        {

          milestoneId: 3,
          milestoneName: 'UI Development',
          project: 'Support Portal',
          owner: 'Priya Reddy',
          dueDate: '2026-08-22',
          status: 'Pending',
          completion: 20,
          estimatedHours: 80,
          actualHours: 12,
          priority: 'Medium',
          targetDate: '2026-08-22',
          description: 'Develop responsive UI screens.',
          isActive: true

        },

        {

          milestoneId: 4,
          milestoneName: 'System Testing',
          project: 'Data Migration',
          owner: 'Kiran Kumar',
          dueDate: '2026-08-30',
          status: 'Delayed',
          completion: 55,
          estimatedHours: 50,
          actualHours: 48,
          priority: 'High',
          targetDate: '2026-08-28',
          description: 'Perform functional and integration testing.',
          isActive: true

        },

        {

          milestoneId: 5,
          milestoneName: 'Go Live',
          project: 'Internal HR Portal',
          owner: 'Sandeep',
          dueDate: '2026-09-05',
          status: 'Pending',
          completion: 5,
          estimatedHours: 25,
          actualHours: 2,
          priority: 'Low',
          targetDate: '2026-09-05',
          description: 'Deploy application to production.',
          isActive: true

        }

      ];

      this.milestones.sort((a, b) => b.milestoneId - a.milestoneId);

      this.totalRecords = this.milestones.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }

  saveMilestone() {

    this.submitted = true;

    if (

      !this.milestone.milestoneName ||
      !this.milestone.project ||
      !this.milestone.dueDate ||
      !this.milestone.status

    ) {

      return;

    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const nextId = this.milestones.length
          ? Math.max(...this.milestones.map(x => x.milestoneId)) + 1
          : 1;

        const newMilestone = {

          ...this.milestone,

          milestoneId: nextId

        };

        this.milestones.unshift(newMilestone);

      }

      else {

        const index = this.milestones.findIndex(

          x => x.milestoneId === this.milestone.milestoneId

        );

        if (index !== -1) {

          this.milestones[index] = {

            ...this.milestone

          };

        }

      }

      this.milestones = [...this.milestones];

      this.totalRecords = this.milestones.length;

      this.page = 1;

      const message = this.isEdit

        ? 'Milestone updated successfully.'

        : 'Milestone created successfully.';

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(message);

    }, 500);

  }
    edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.milestones.find(
        x => x.milestoneId === id
      );

      if (selected) {

        this.milestone = {
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

          this.milestones = this.milestones.filter(
            x => x.milestoneId !== id
          );

          this.totalRecords = this.milestones.length;

          if (
            this.page > 1 &&
            this.pagedMilestones.length === 0
          ) {

            this.page--;

          }

          this.milestones = [...this.milestones];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Milestone deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.milestone = {

      milestoneId: 0,
      milestoneName: '',
      project: '',
      owner: '',
      dueDate: '',
      status: '',
      completion: 0,
      estimatedHours: '',
      actualHours: '',
      priority: '',
      targetDate: '',
      description: '',
      isActive: true

    };

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredMilestones() {

    return this.milestones.filter(x =>

      x.milestoneName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.project
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.owner
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

  get pagedMilestones() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredMilestones.slice(

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
