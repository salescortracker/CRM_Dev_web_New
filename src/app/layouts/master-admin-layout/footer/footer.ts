import { Component } from '@angular/core';

@Component({
  selector: 'app-master-admin-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class MasterAdminFooter {
  year = new Date().getFullYear();
}
