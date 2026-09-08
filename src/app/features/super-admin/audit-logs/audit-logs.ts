import { ChangeDetectorRef, Component } from '@angular/core';
import { ControlsystemService } from '../services/controlsystem-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../shared/pagination/pagination';
import { Exportservice } from '../../../core/services/exportservice';
import { Export } from '../../../shared/export/export';
// import { Pagination } from '../../../../shared/pagination/pagination';

export interface AuditLogEntry {
  id: string;
  module: string;
  action: string;
  severity: AuditSeverity;
  user: string;
  detail: string;
  relatedRoute?: string;
  createdAt: string;
}
export type AuditSeverity = 'Info' | 'Warning' | 'Critical';

@Component({
  selector: 'app-audit-logs',
  imports: [CommonModule,FormsModule,Pagination,Export],
  templateUrl: './audit-logs.html',
  styleUrl: './audit-logs.css',
})
export class AuditLogs {
  activityMessage = '';
  logs: AuditLogEntry[] = [];
  searchTerm = '';
  selectedModule = '';
  selectedSeverity: AuditSeverity | '' = '';
  page = 1;

pageSize = 5;

totalRecords = 0;

  constructor(private audit: ControlsystemService, private cdr: ChangeDetectorRef, private exportService: Exportservice) { }

  ngOnInit(): void {
    this.refreshLogs(false);
  }

  get moduleOptions(): string[] {
    return Array.from(new Set(this.logs.map((log) => log.module))).sort();
  }

  get filteredLogs(): AuditLogEntry[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.logs.filter((log) => {
      const matchesModule = !this.selectedModule || log.module === this.selectedModule;
      const matchesSeverity = !this.selectedSeverity || log.severity === this.selectedSeverity;
      const matchesQuery = !query ||
        log.action.toLowerCase().includes(query) ||
        log.detail.toLowerCase().includes(query) ||
        log.user.toLowerCase().includes(query) ||
        log.module.toLowerCase().includes(query);
      return matchesModule && matchesSeverity && matchesQuery;
    });
  }

  get totalEvents(): number {
    return this.logs.length;
  }

  get criticalEvents(): number {
    return this.logs.filter((log) => log.severity === 'Critical').length;
  }

  get securityEvents(): number {
    return this.logs.filter((log) => ['Security', 'Login Sessions'].includes(log.module)).length;
  }

  get approvalEvents(): number {
    return this.logs.filter((log) => log.module === 'Approvals').length;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedModule = '';
    this.selectedSeverity = '';
      this.page = 1;
  }

  refreshLogs(showMessage = true): void {
    this.audit.getAuditLogs().subscribe({
      next: (res: any) => {

        if (res.success) {

          this.logs = res.data.map((x: any) => ({

            id: x.auditId,

            module: x.tableName,

            action: x.actionType,

            user: x.userId?.toString() || '-',

            severity: this.getSeverity(x.actionType),

            detail: this.getDetails(x),

            createdAt: x.createdDate,

            relatedRoute: ''

          }));

          this.page = 1;
          this.totalRecords = this.logs.length;
          this.cdr.detectChanges();

          if (showMessage) {
            this.showActivity('Audit logs refreshed.');
          }

        }

      },

      error: (err) => {
        console.error(err);
      }
    });
  }

runMonitorCheck(): void {

  this.refreshLogs(false);

  this.showActivity('Monitor check completed.');

}

  openRelated(log: AuditLogEntry): void {
    // this.audit.open(log);
  }

  getSeverityClass(severity: AuditSeverity): string {
    return severity.toLowerCase();
  }

  trackByLog(_: number, log: AuditLogEntry): string {
    return log.id;
  }

  private showActivity(message: string): void {
    this.activityMessage = message;
    setTimeout(() => this.activityMessage = '', 3500);
  }
  getSeverity(action: string): 'Info' | 'Warning' | 'Critical' {

    switch (action?.toUpperCase()) {

      case 'DELETE':
        return 'Critical';

      case 'UPDATE':
        return 'Warning';

      default:
        return 'Info';
    }

  }
  getDetails(log: any): string {

    return `${log.actionType} performed on ${log.tableName} (Record Id : ${log.recordId})`;

  }
  get pagedLogs(): AuditLogEntry[] {

  const start = (this.page - 1) * this.pageSize;

  return this.filteredLogs.slice(

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

downloadExcel() {

  const data = this.filteredLogs.map(x => ({
    Time: x.createdAt,
    Module: x.module,
    Action: x.action,
    User: x.user,
    Severity: x.severity,
    Details: x.detail
  }));

  // this.exportService.exportToExcel(
  //     data,
  //     'AuditLogs'
  // );

}
downloadPdf() {

  const headers = [
    'Time',
    'Module',
    'Action',
    'User',
    'Severity',
    'Details'
  ];

  const body = this.filteredLogs.map(x => [

    new Date(x.createdAt).toLocaleString(),

    x.module,

    x.action,

    x.user,

    x.severity,

    x.detail

  ]);

  // // this.exportService.exportToPdf(
  // //     'Audit Logs Report',
  // //     headers,
  // //     body,
  // //     'AuditLogs'
  // // );

}
}
