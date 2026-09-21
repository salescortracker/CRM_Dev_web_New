import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { ApiResponse } from '../../../../../core/authentication/services/auth.service';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';
import { nullIfEmpty } from '../activities.util';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './notes.html',
  styleUrl: './notes.css',
})
export class Notes implements OnInit {

  private baseUrl = environment.apiUrl;

  submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  searchText = '';

  notes: any[] = [];

  note: any = this.getEmptyModel();

  constructor(
    private http: HttpClient,
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  // "noteDate" is the user-entered date shown as "Created Date" on the form;
  // it is separate from the audit CreatedDate stamped by the API.
  getEmptyModel() {

    return {

      noteId: 0,
      noteTitle: '',
      category: '',
      relatedTo: '',
      customer: '',
      contactPerson: '',
      assignedTo: '',
      priority: '',
      noteDate: '',
      reminderDate: '',
      status: '',
      description: '',
      isActive: true

    };

  }

  ngOnInit(): void {

    this.loadNotes();

  }

  //====================================================
  // Load
  //====================================================

  loadNotes(): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/getallactivitynotes`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.notes = res.data || [];

          } else {

            this.notes = [];

            this.alert.warning(res?.message || 'No Notes found.');

          }

          this.cd.detectChanges();

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Load notes error:', err);

          this.notes = [];

          this.alert.error(err?.error?.message || 'Failed to load Notes.');

          this.cd.detectChanges();

        }

      });

  }

  //====================================================
  // Save (Create / Update)
  //====================================================

  saveNote(): void {

    this.submitted = true;

    if (
      !this.note.noteTitle?.trim() ||
      !this.note.category ||
      !this.note.assignedTo?.trim() ||
      !this.note.noteDate ||
      !this.note.status
    ) {
      return;
    }

    const payload = {

      noteId: this.note.noteId,
      noteTitle: this.note.noteTitle.trim(),
      category: this.note.category,
      relatedTo: nullIfEmpty(this.note.relatedTo),
      customer: nullIfEmpty(this.note.customer),
      contactPerson: nullIfEmpty(this.note.contactPerson),
      assignedTo: this.note.assignedTo.trim(),
      priority: nullIfEmpty(this.note.priority),
      noteDate: this.note.noteDate,
      reminderDate: this.note.reminderDate || null,
      status: this.note.status,
      description: nullIfEmpty(this.note.description),
      isActive: !!this.note.isActive

    };

    const url = this.isEdit
      ? `${this.baseUrl}/Admin/updateactivitynote`
      : `${this.baseUrl}/Admin/createactivitynote`;

    const failMessage = this.isEdit
      ? 'Failed to update Note.'
      : 'Failed to create Note.';

    this.spinner.show();

    this.http
      .post<ApiResponse>(url, payload)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success) {

            this.alert.success(res.message);

            this.clear();

            this.page = 1;

            this.loadNotes();

          } else {

            this.alert.warning(res?.message || failMessage);

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Save note error:', err);

          this.alert.error(err?.error?.message || failMessage);

        }

      });

  }

  //====================================================
  // Edit
  //====================================================

  edit(id: number): void {

    this.spinner.show();

    this.http
      .get<ApiResponse<any>>(`${this.baseUrl}/Admin/getbyactivitynote/${id}`)
      .subscribe({

        next: (res: any) => {

          this.spinner.hide();

          if (res?.success && res.data) {

            const data = res.data;

            this.note = {

              noteId: data.noteId,
              noteTitle: data.noteTitle || '',
              category: data.category || '',
              relatedTo: data.relatedTo || '',
              customer: data.customer || '',
              contactPerson: data.contactPerson || '',
              assignedTo: data.assignedTo || '',
              priority: data.priority || '',
              noteDate: data.noteDate || '',
              reminderDate: data.reminderDate || '',
              status: data.status || '',
              description: data.description || '',
              isActive: !!data.isActive

            };

            this.isEdit = true;

            this.submitted = false;

            this.cd.detectChanges();

          } else {

            this.alert.warning(res?.message || 'Note not found.');

          }

        },

        error: (err) => {

          this.spinner.hide();

          console.error('Get note error:', err);

          this.alert.error(err?.error?.message || 'Failed to load Note.');

        }

      });

  }

  //====================================================
  // Delete
  //====================================================

  delete(id: number): void {

    this.alert.deleteConfirm().then(result => {

      if (!result.isConfirmed) return;

      this.spinner.show();

      this.http
        .post<ApiResponse>(`${this.baseUrl}/Admin/deleteactivitynote/${id}`, {})
        .subscribe({

          next: (res: any) => {

            this.spinner.hide();

            if (res?.success) {

              this.alert.success(res.message);

              // Editing the record that was just deleted - reset the form
              if (this.note.noteId === id) {
                this.clear();
              }

              if (this.page > 1 && this.pagedNotes.length === 1) {
                this.page = this.page - 1;
              }

              this.loadNotes();

            } else {

              this.alert.warning(res?.message || 'Failed to delete Note.');

            }

          },

          error: (err) => {

            this.spinner.hide();

            console.error('Delete note error:', err);

            this.alert.error(err?.error?.message || 'Failed to delete Note.');

          }

        });

    });

  }

  //====================================================
  // Clear
  //====================================================

  clear(): void {

    this.note = this.getEmptyModel();

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  //====================================================
  // Search / Pagination
  //====================================================

  get filteredNotes() {

    const search = this.searchText.toLowerCase();

    return this.notes.filter(x =>

      (x.noteTitle || '').toLowerCase().includes(search) ||

      (x.customer || '').toLowerCase().includes(search) ||

      (x.contactPerson || '').toLowerCase().includes(search) ||

      (x.assignedTo || '').toLowerCase().includes(search) ||

      (x.category || '').toLowerCase().includes(search) ||

      (x.priority || '').toLowerCase().includes(search) ||

      (x.status || '').toLowerCase().includes(search)

    );

  }

  get pagedNotes() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredNotes.slice(start, start + this.pageSize);

  }

  changePage(page: number) {

    this.page = page;

  }

  changePageSize(size: number) {

    this.pageSize = size;

    this.page = 1;

  }

}
