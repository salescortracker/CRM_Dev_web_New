import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-lead-sources',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './lead-sources.html',
  styleUrl: './lead-sources.css',
})
export class LeadSources {
   submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;

  searchText = '';

  leadSources: any[] = [];

  leadSource: any = {

    leadSourceId: 0,

    sourceName: '',

    sourceCode: '',

    sourceCategory: '',

    priority: '',

    costPerLead: 0,

    conversionRate: 0,

    description: '',

    status: '',

    isActive: true

  };

  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.loadLeadSources();

  }

  loadLeadSources() {

    this.spinner.show();

    setTimeout(() => {

      this.leadSources = [

        {
          leadSourceId: 1,

          sourceName: 'Website',

          sourceCode: 'LS001',

          sourceCategory: 'Website',

          priority: 'High',

          costPerLead: 250,

          conversionRate: 35,

          description: 'Leads generated directly from the company website.',

          status: 'Active',

          isActive: true

        },

        {
          leadSourceId: 2,

          sourceName: 'Facebook Ads',

          sourceCode: 'LS002',

          sourceCategory: 'Social Media',

          priority: 'High',

          costPerLead: 400,

          conversionRate: 28,

          description: 'Leads acquired through Facebook advertising campaigns.',

          status: 'Active',

          isActive: true

        },

        {
          leadSourceId: 3,

          sourceName: 'Google Ads',

          sourceCode: 'LS003',

          sourceCategory: 'Digital Marketing',

          priority: 'High',

          costPerLead: 550,

          conversionRate: 40,

          description: 'Paid search campaign leads from Google Ads.',

          status: 'Active',

          isActive: true

        },
                {
          leadSourceId: 4,

          sourceName: 'Employee Referral',

          sourceCode: 'LS004',

          sourceCategory: 'Referral',

          priority: 'Medium',

          costPerLead: 100,

          conversionRate: 55,

          description: 'Qualified leads referred by existing employees.',

          status: 'Active',

          isActive: true

        },

        {
          leadSourceId: 5,

          sourceName: 'Trade Exhibition',

          sourceCode: 'LS005',

          sourceCategory: 'Events & Exhibition',

          priority: 'Low',

          costPerLead: 1200,

          conversionRate: 18,

          description: 'Leads collected from trade shows and exhibitions.',

          status: 'Inactive',

          isActive: false

        }

      ];

      this.leadSources.sort(
        (a, b) => b.leadSourceId - a.leadSourceId
      );

      this.totalRecords = this.leadSources.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }
    saveLeadSource() {

    this.submitted = true;

    if (
      !this.leadSource.sourceName ||
      !this.leadSource.sourceCode ||
      !this.leadSource.sourceCategory ||
      !this.leadSource.status
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newLeadSource = {

          ...this.leadSource,

          leadSourceId: this.leadSources.length
            ? Math.max(...this.leadSources.map(x => x.leadSourceId)) + 1
            : 1

        };

        this.leadSources.unshift(newLeadSource);

      } else {

        const index = this.leadSources.findIndex(
          x => x.leadSourceId === this.leadSource.leadSourceId
        );

        if (index !== -1) {

          this.leadSources[index] = {

            ...this.leadSource

          };

        }

      }

      this.leadSources = [...this.leadSources];

      this.totalRecords = this.leadSources.length;

      this.page = 1;

      const isUpdate = this.isEdit;

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(

        isUpdate
          ? 'Lead Source updated successfully.'
          : 'Lead Source created successfully.'

      );

    }, 500);

  }

  edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.leadSources.find(
        x => x.leadSourceId === id
      );

      if (selected) {

        this.leadSource = {

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

          this.leadSources = this.leadSources.filter(
            x => x.leadSourceId !== id
          );

          this.totalRecords = this.leadSources.length;

          if (
            this.page > 1 &&
            this.pagedLeadSources.length === 0
          ) {

            this.page--;

          }

          this.leadSources = [...this.leadSources];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Lead Source deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.leadSource = {

      leadSourceId: 0,

      sourceName: '',

      sourceCode: '',

      sourceCategory: '',

      priority: '',

      costPerLead: 0,

      conversionRate: 0,

      description: '',

      status: '',

      isActive: true

    };

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredLeadSources() {

    return this.leadSources.filter(x =>

      x.sourceName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.sourceCode
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.sourceCategory
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

  get pagedLeadSources() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredLeadSources.slice(
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
