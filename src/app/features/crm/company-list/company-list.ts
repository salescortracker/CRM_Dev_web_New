import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyInformationDto, CompanyService } from '../services/company.service';
import { Alertservice } from '../../../core/services/alertservice';

@Component({
  selector: 'app-company-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './company-list.html',
  styleUrl: './company-list.css',
})
export class CompanyList implements OnInit {

  searchText = '';
  industryFilter = '';
  statusFilter = '';

  companies: CompanyInformationDto[] = [];

  isLoading = false;

  private readonly avatarColors = ['blue', 'green', 'purple', 'orange', 'red', 'cyan'];

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private alert: Alertservice,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  // ================= GET ALL =================

  loadCompanies(): void {

    this.isLoading = true;

    this.companyService.getCompanies().subscribe({

      next: (res) => {

        this.companies = res?.success && res.data ? res.data : [];

        this.isLoading = false;

        this.cd.detectChanges();
      },

      error: (err) => {

        this.isLoading = false;

        this.alert.error(err?.error?.message || 'Failed to load companies.');

        this.cd.detectChanges();
      }
    });
  }

  // ================= FILTERS =================

  get industries(): string[] {

    const names = this.companies
      .map(x => x.industryName)
      .filter((x): x is string => !!x);

    return Array.from(new Set(names)).sort();
  }

  get filteredCompanies(): CompanyInformationDto[] {

    const search = this.searchText.toLowerCase().trim();

    return this.companies.filter(company => {

      const matchesSearch =
        !search ||
        [
          company.companyName,
          company.legalCompanyName,
          company.industryName,
          company.city,
          company.stateName,
          company.countryName,
          company.website,
          company.companyOwner
        ].some(v => (v || '').toLowerCase().includes(search));

      const matchesIndustry =
        !this.industryFilter ||
        company.industryName === this.industryFilter;

      const matchesStatus =
        !this.statusFilter ||
        company.companyStatus === this.statusFilter;

      return matchesSearch && matchesIndustry && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchText = '';
    this.industryFilter = '';
    this.statusFilter = '';
  }

  // ================= SUMMARY =================

  get activeCompanies(): number {
    return this.companies.filter(x => x.companyStatus === 'Active').length;
  }

  get inactiveCompanies(): number {
    return this.companies.filter(x => x.companyStatus === 'Inactive').length;
  }

  // ================= DISPLAY HELPERS =================

  getInitials(value: string): string {

    const words = (value || '').trim().split(/\s+/).filter(w => w.length > 0);

    if (words.length === 0) {
      return 'CO';
    }

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }

  getAvatarColor(company: CompanyInformationDto): string {
    return this.avatarColors[company.companyInformationId % this.avatarColors.length];
  }

  // ================= NAVIGATION =================

  createCompany(): void {
    this.router.navigate(['/company-create']);
  }

  editCompany(company: CompanyInformationDto): void {
    this.router.navigate(['/company-create'], {
      queryParams: { id: company.companyInformationId }
    });
  }

  openCompany(company: CompanyInformationDto): void {
    this.router.navigate(['/company-details'], {
      queryParams: { id: company.companyInformationId }
    });
  }

  // ================= DELETE =================

  deleteCompany(company: CompanyInformationDto): void {

    this.alert.deleteConfirm().then(result => {

      if (!result.isConfirmed) {
        return;
      }

      this.companyService.deleteCompany(company.companyInformationId).subscribe({

        next: (res) => {

          if (res?.success) {
            this.alert.success(res.message || 'Company deleted successfully.');
            this.loadCompanies();
          } else {
            this.alert.error(res?.message || 'Failed to delete company.');
          }
        },

        error: (err) => {
          this.alert.error(err?.error?.message || 'Failed to delete company.');
        }
      });
    });
  }
}
