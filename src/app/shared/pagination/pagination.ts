import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  @Input() page = 1;

  @Input() pageSize = 10;

  @Input() totalRecords = 0;

  @Output()
  pageChanged = new EventEmitter<number>();

  @Output()
  pageSizeChanged = new EventEmitter<number>();

  pageSizes = [5, 10, 20, 50, 100];

  get totalPages() {

    return Math.ceil(this.totalRecords / this.pageSize);

  }

  previous() {

    if (this.page > 1) {

      this.pageChanged.emit(this.page - 1);

    }

  }

  next() {

    if (this.page < this.totalPages) {

      this.pageChanged.emit(this.page + 1);

    }

  }
}
