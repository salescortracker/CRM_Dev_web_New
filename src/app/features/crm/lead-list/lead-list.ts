import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LeadDto, LeadService } from '../services/lead.service';
import { Alertservice } from '../../../core/services/alertservice';

@Component({
  selector: 'app-lead-list',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './lead-list.html',
  styleUrl: './lead-list.css',
})
export class LeadList implements OnInit {

  // =========================================================
  // DATA
  // =========================================================

  leads: LeadDto[] = [];

  filteredLeads: LeadDto[] = [];

  isLoading: boolean = false;

  // =========================================================
  // SEARCH / FILTER
  // =========================================================

  searchText: string = '';

  selectedStatus: string = 'All';

  selectedOwner: string = 'All';

  leadStatuses: string[] = [
    'New',
    'Contacted',
    'Qualified',
    'Nurturing',
    'Unqualified',
    'Lost'
  ];

  // =========================================================
  // SELECTION
  // =========================================================

  selectedLeads: number[] = [];

  allSelected: boolean = false;

  // =========================================================
  // PAGINATION
  // =========================================================

  pageSize: number = 10;

  currentPage: number = 1;

  private readonly avatarClasses = [
    'avatar-blue',
    'avatar-purple',
    'avatar-green',
    'avatar-orange',
    'avatar-red'
  ];

  constructor(
    private router: Router,
    private leadService: LeadService,
    private alert: Alertservice,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLeads();
  }

  // =========================================================
  // GET ALL LEADS
  // =========================================================

  loadLeads(): void {

    this.isLoading = true;

    this.leadService.getLeads().subscribe({

      next: (res) => {

        this.leads = res?.success && res.data ? res.data : [];

        this.isLoading = false;

        this.applyFilters();

        this.cd.detectChanges();
      },

      error: (err) => {

        this.isLoading = false;

        this.alert.error(
          err?.error?.message || 'Failed to load leads.'
        );

        this.cd.detectChanges();
      }
    });
  }

  refreshLeads(): void {

    this.searchText = '';
    this.selectedStatus = 'All';
    this.selectedOwner = 'All';

    this.loadLeads();
  }

  // =========================================================
  // SUMMARY
  // =========================================================

  get totalLeads(): number {
    return this.leads.length;
  }

  get newLeads(): number {
    return this.countByStatus('New');
  }

  get contactedLeads(): number {
    return this.countByStatus('Contacted');
  }

  get qualifiedLeads(): number {
    return this.countByStatus('Qualified');
  }

  get conversionRate(): number {

    if (this.leads.length === 0) {
      return 0;
    }

    return Math.round(
      (this.qualifiedLeads / this.leads.length) * 1000
    ) / 10;
  }

  private countByStatus(status: string): number {
    return this.leads.filter(x => x.leadStatus === status).length;
  }

  // =========================================================
  // SEARCH / FILTER
  // =========================================================

  get owners(): string[] {

    const names = this.leads
      .map(x => x.leadOwnerName)
      .filter((x): x is string => !!x);

    return Array.from(new Set(names)).sort();
  }

  get hasActiveFilters(): boolean {
    return (
      !!this.searchText.trim() ||
      this.selectedStatus !== 'All' ||
      this.selectedOwner !== 'All'
    );
  }

  applyFilters(): void {

    const search = this.searchText.trim().toLowerCase();

    this.filteredLeads = this.leads.filter(lead => {

      const matchesSearch =
        !search ||
        [
          this.getLeadName(lead),
          lead.leadNumber,
          lead.email,
          lead.phone,
          lead.mobile,
          lead.companyName
        ].some(v => (v || '').toLowerCase().includes(search));

      const matchesStatus =
        this.selectedStatus === 'All' ||
        lead.leadStatus === this.selectedStatus;

      const matchesOwner =
        this.selectedOwner === 'All' ||
        lead.leadOwnerName === this.selectedOwner;

      return matchesSearch && matchesStatus && matchesOwner;
    });

    this.currentPage = 1;

    this.clearSelection();
  }

  clearStatus(): void {
    this.selectedStatus = 'All';
    this.applyFilters();
  }

  clearOwner(): void {
    this.selectedOwner = 'All';
    this.applyFilters();
  }

  resetFilters(): void {

    this.searchText = '';
    this.selectedStatus = 'All';
    this.selectedOwner = 'All';

    this.applyFilters();
  }

  // =========================================================
  // PAGINATION
  // =========================================================

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredLeads.length / this.pageSize));
  }

  get pagedLeads(): LeadDto[] {

    const start = (this.currentPage - 1) * this.pageSize;

    return this.filteredLeads.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get rangeStart(): number {
    return this.filteredLeads.length === 0
      ? 0
      : (this.currentPage - 1) * this.pageSize + 1;
  }

  get rangeEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredLeads.length);
  }

  goToPage(page: number): void {

    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;

    this.clearSelection();
  }

  // =========================================================
  // DISPLAY HELPERS
  // =========================================================

  getLeadName(lead: LeadDto): string {
    return `${lead.firstName || ''} ${lead.lastName || ''}`.trim();
  }

  getInitials(value: string): string {

    if (!value) {
      return '';
    }

    const words = value.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  }

  getAvatarClass(lead: LeadDto): string {
    return this.avatarClasses[lead.leadId % this.avatarClasses.length];
  }

  // CSS modifier for the status pill (.status.new / .contacted / ...)
  getStatusClass(status: string): string {
    return (status || '').toLowerCase();
  }

  getScoreClass(score?: number | null): string {

    const value = score ?? 0;

    if (value >= 80) {
      return 'high';
    }

    return value >= 60 ? 'medium' : 'low';
  }

  // =========================================================
  // SELECT
  // =========================================================

  toggleSelection(id: number, event: Event): void {

    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {

      if (!this.selectedLeads.includes(id)) {
        this.selectedLeads.push(id);
      }

    } else {

      this.selectedLeads = this.selectedLeads.filter(x => x !== id);
    }

    this.updateSelectAll();
  }

  toggleAllSelection(event: Event): void {

    const checkbox = event.target as HTMLInputElement;

    this.selectedLeads = checkbox.checked
      ? this.pagedLeads.map(x => x.leadId)
      : [];

    this.allSelected = checkbox.checked;
  }

  updateSelectAll(): void {

    this.allSelected =
      this.pagedLeads.length > 0 &&
      this.selectedLeads.length === this.pagedLeads.length;
  }

  isSelected(id: number): boolean {
    return this.selectedLeads.includes(id);
  }

  clearSelection(): void {

    this.selectedLeads = [];

    this.allSelected = false;
  }

  // =========================================================
  // DELETE LEAD
  // =========================================================

  deleteLead(lead: LeadDto): void {

    this.alert.deleteConfirm().then(result => {

      if (!result.isConfirmed) {
        return;
      }

      this.leadService.deleteLead(lead.leadId).subscribe({

        next: (res) => {

          if (res?.success) {
            this.alert.success(res.message || 'Lead deleted successfully.');
            this.loadLeads();
          } else {
            this.alert.error(res?.message || 'Failed to delete lead.');
          }
        },

        error: (err) => {
          this.alert.error(err?.error?.message || 'Failed to delete lead.');
        }
      });
    });
  }

  bulkDelete(): void {

    if (this.selectedLeads.length === 0) {
      return;
    }

    const ids = [...this.selectedLeads];

    this.alert
      .confirm(`Delete ${ids.length} selected lead(s)?`)
      .then(result => {

        if (!result.isConfirmed) {
          return;
        }

        let pending = ids.length;
        let failed = 0;

        ids.forEach(id => {

          this.leadService.deleteLead(id).subscribe({

            next: (res) => {
              if (!res?.success) {
                failed++;
              }
              this.onBulkDeleteDone(--pending, failed);
            },

            error: () => {
              failed++;
              this.onBulkDeleteDone(--pending, failed);
            }
          });
        });
      });
  }

  private onBulkDeleteDone(pending: number, failed: number): void {

    if (pending > 0) {
      return;
    }

    if (failed > 0) {
      this.alert.warning(`${failed} lead(s) could not be deleted.`);
    } else {
      this.alert.success('Selected leads deleted successfully.');
    }

    this.loadLeads();
  }

  // =========================================================
  // NAVIGATION
  // =========================================================

  createLead(): void {
    this.router.navigate(['/leads-create']);
  }

  editLead(lead: LeadDto): void {
    this.router.navigate(['/leads-create'], {
      queryParams: { id: lead.leadId }
    });
  }

  openLead(lead: LeadDto): void {
    this.router.navigate(['/leads-details'], {
      queryParams: { id: lead.leadId }
    });
  }
}
