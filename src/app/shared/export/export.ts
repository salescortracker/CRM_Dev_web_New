import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './export.html',
  styleUrl: './export.css',
})
export class Export {
   showMenu = false;

  @Output() excel = new EventEmitter<void>();

  @Output() pdf = new EventEmitter<void>();

  toggleMenu() {
    this.showMenu = !this.showMenu;
    console.log('Clicked', this.showMenu);
  }

  exportExcel() {
    this.showMenu = false;
    this.excel.emit();
  }

  exportPdf() {
    this.showMenu = false;
    this.pdf.emit();
  }
}
