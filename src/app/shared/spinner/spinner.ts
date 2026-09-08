import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Spinnerservice } from '../../core/services/spinnerservice';

@Component({
  selector: 'app-spinner',
  imports: [CommonModule],
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
})
export class Spinner implements OnInit{
  showOverlay = false;
constructor(public spinner: Spinnerservice, private cdr: ChangeDetectorRef) { }
ngOnInit() {
    this.spinner.loading$.subscribe((loading) => {
        this.showOverlay = loading;
        this.cdr.detectChanges();
      });
}
}
