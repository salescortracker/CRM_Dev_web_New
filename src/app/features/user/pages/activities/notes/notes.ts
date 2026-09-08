import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './notes.html',
  styleUrl: './notes.css',
})
export class Notes {
   submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = '';

  notes: any[] = [];

  note: any = {

    noteId: 0,
    noteTitle: '',
    category: '',
    relatedTo: '',
    customer: '',
    contactPerson: '',
    assignedTo: '',
    priority: '',
    createdDate: '',
    reminderDate: '',
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

    this.loadNotes();

  }

  loadNotes() {

    this.spinner.show();

    setTimeout(() => {

      this.notes = [

        {
          noteId: 1,
          noteTitle: 'CRM Requirement Discussion',
          category: 'Meeting Notes',
          relatedTo: 'Opportunity',
          customer: 'ABC Technologies',
          contactPerson: 'Rahul Sharma',
          assignedTo: 'Sales Executive',
          priority: 'High',
          createdDate: '2026-07-30',
          reminderDate: '2026-08-02',
          status: 'Open',
          description: 'Customer discussed CRM workflow requirements.',
          isActive: true
        },

        {
          noteId: 2,
          noteTitle: 'Quotation Follow-up',
          category: 'Follow-up Notes',
          relatedTo: 'Quotation',
          customer: 'XYZ Solutions',
          contactPerson: 'Priya Reddy',
          assignedTo: 'Business Executive',
          priority: 'Medium',
          createdDate: '2026-07-31',
          reminderDate: '2026-08-03',
          status: 'Completed',
          description: 'Quotation approved by customer.',
          isActive: true
        },

        {
          noteId: 3,
          noteTitle: 'Demo Feedback',
          category: 'Sales Notes',
          relatedTo: 'Lead',
          customer: 'Future Vision',
          contactPerson: 'Arjun Kumar',
          assignedTo: 'Sales Manager',
          priority: 'High',
          createdDate: '2026-08-01',
          reminderDate: '2026-08-05',
          status: 'In Progress',
          description: 'Customer requested additional demo session.',
          isActive: true
        },

        {
          noteId: 4,
          noteTitle: 'Support Resolution',
          category: 'Support Notes',
          relatedTo: 'Account',
          customer: 'Global InfoTech',
          contactPerson: 'Sneha Patel',
          assignedTo: 'Support Engineer',
          priority: 'Low',
          createdDate: '2026-08-02',
          reminderDate: '',
          status: 'Completed',
          description: 'Support ticket resolved successfully.',
          isActive: true
        },

        {
          noteId: 5,
          noteTitle: 'Renewal Reminder',
          category: 'Customer Notes',
          relatedTo: 'Order',
          customer: 'NextGen Pvt Ltd',
          contactPerson: 'Kiran Verma',
          assignedTo: 'Account Manager',
          priority: 'Medium',
          createdDate: '2026-08-03',
          reminderDate: '2026-08-10',
          status: 'Open',
          description: 'Follow-up before contract renewal.',
          isActive: true
        }

      ];

      this.notes.sort((a, b) => b.noteId - a.noteId);

      this.totalRecords = this.notes.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }

  saveNote() {

    this.submitted = true;

    if (

      !this.note.noteTitle ||
      !this.note.category ||
      !this.note.assignedTo ||
      !this.note.createdDate ||
      !this.note.status

    ) {

      return;

    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newNote = {

          ...this.note,

          noteId: this.notes.length
            ? Math.max(...this.notes.map(x => x.noteId)) + 1
            : 1

        };

        this.notes.unshift(newNote);

      }

      else {

        const index = this.notes.findIndex(

          x => x.noteId === this.note.noteId

        );

        if (index !== -1) {

          this.notes[index] = {

            ...this.note

          };

        }

      }

      // Refresh table immediately

      this.notes = [...this.notes];

      this.totalRecords = this.notes.length;

      this.page = 1;

      const message = this.isEdit
        ? 'Note updated successfully.'
        : 'Note created successfully.';

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(message);

    }, 500);

  }
    edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.notes.find(
        x => x.noteId === id
      );

      if (selected) {

        this.note = {
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

          this.notes = this.notes.filter(
            x => x.noteId !== id
          );

          this.totalRecords = this.notes.length;

          if (
            this.page > 1 &&
            this.pagedNotes.length === 0
          ) {

            this.page--;

          }

          // Refresh table immediately

          this.notes = [...this.notes];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Note deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.note = {

      noteId: 0,
      noteTitle: '',
      category: '',
      relatedTo: '',
      customer: '',
      contactPerson: '',
      assignedTo: '',
      priority: '',
      createdDate: '',
      reminderDate: '',
      status: '',
      description: '',
      isActive: true

    };

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredNotes() {

    return this.notes.filter(x =>

      x.noteTitle
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.customer
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.contactPerson
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.assignedTo
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.category
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

  get pagedNotes() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredNotes.slice(

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
