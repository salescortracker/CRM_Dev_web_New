import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Pipelinedetails {
  id: number;
  name: string;
}

interface PipelineStage {
  id: number;
  name: string;
  color: string;
}

interface Opportunity {
  id: number;
  number: string;
  name: string;
  customer: string;
  leadName: string;
  amount: number;
  probability: number;
  stageId: number;
  priority: string;
  expectedCloseDate: string;
  owner: string;
  source: string;
  description: string;
  pipelineId: number;
}

interface OpportunityForm {
  name: string;
  customer: string;
  leadName: string;
  amount: number;
  expectedCloseDate: string;
  stageId: number;
  priority: string;
  source: string;
  description: string;
  owner: string;
  pipelineId: number;
}

@Component({
  selector: 'app-pipeline',
  imports: [CommonModule,FormsModule],
  templateUrl: './pipeline.html',
  styleUrl: './pipeline.css',
})
export class Pipeline {
 // ============================================================
  // VIEW
  // ============================================================

  activeView: 'kanban' | 'list' = 'kanban';

  showOpportunityPanel = false;
  showCreateModal = false;

  // ============================================================
  // PIPELINES
  // ============================================================

  pipelines: Pipelinedetails[] = [
    {
      id: 1,
      name: 'Default Sales Pipeline'
    },
    {
      id: 2,
      name: 'Enterprise Pipeline'
    }
  ];

  selectedPipeline = 1;

  // ============================================================
  // STAGES
  // ============================================================

  stages: PipelineStage[] = [
    {
      id: 1,
      name: 'Qualification',
      color: '#6c757d'
    },
    {
      id: 2,
      name: 'Needs Analysis',
      color: '#0d6efd'
    },
    {
      id: 3,
      name: 'Proposal',
      color: '#6f42c1'
    },
    {
      id: 4,
      name: 'Negotiation',
      color: '#fd7e14'
    },
    {
      id: 5,
      name: 'Won',
      color: '#198754'
    },
    {
      id: 6,
      name: 'Lost',
      color: '#dc3545'
    }
  ];

  // ============================================================
  // FILTERS
  // ============================================================

  searchText = '';

  selectedOwner = 'All';
  selectedSource = 'All';
  selectedPriority = 'All';

  owners: string[] = [
    'All',
    'John Smith',
    'Sarah Wilson',
    'David Kumar',
    'Michael Brown'
  ];

  sources: string[] = [
    'All',
    'Website',
    'Referral',
    'LinkedIn',
    'Campaign',
    'Cold Call'
  ];

  priorities: string[] = [
    'All',
    'High',
    'Medium',
    'Low'
  ];

  // ============================================================
  // OPPORTUNITIES
  // ============================================================

  opportunities: Opportunity[] = [
    {
      id: 1,
      number: 'OPP-0001',
      name: 'CRM Enterprise Implementation',
      customer: 'ABC Technologies',
      leadName: 'Raj Kumar',
      amount: 250000,
      probability: 25,
      stageId: 1,
      priority: 'High',
      expectedCloseDate: '2026-09-15',
      owner: 'John Smith',
      source: 'Website',
      description: 'Enterprise CRM implementation opportunity.',
      pipelineId: 1
    },
    {
      id: 2,
      number: 'OPP-0002',
      name: 'HRMS SaaS Subscription',
      customer: 'Global Solutions',
      leadName: 'Priya Sharma',
      amount: 450000,
      probability: 50,
      stageId: 2,
      priority: 'High',
      expectedCloseDate: '2026-09-20',
      owner: 'Sarah Wilson',
      source: 'Referral',
      description: 'HRMS SaaS subscription for 250 employees.',
      pipelineId: 1
    },
    {
      id: 3,
      number: 'OPP-0003',
      name: 'Timesheet Management',
      customer: 'Tech Innovations',
      leadName: 'Arun Kumar',
      amount: 175000,
      probability: 65,
      stageId: 3,
      priority: 'Medium',
      expectedCloseDate: '2026-09-10',
      owner: 'David Kumar',
      source: 'LinkedIn',
      description: 'Timesheet management software implementation.',
      pipelineId: 1
    },
    {
      id: 4,
      number: 'OPP-0004',
      name: 'CRM Annual Subscription',
      customer: 'Digital World',
      leadName: 'Vijay Rao',
      amount: 320000,
      probability: 75,
      stageId: 4,
      priority: 'High',
      expectedCloseDate: '2026-09-05',
      owner: 'John Smith',
      source: 'Campaign',
      description: 'Annual CRM subscription and support.',
      pipelineId: 1
    },
    {
      id: 5,
      number: 'OPP-0005',
      name: 'ERP Integration',
      customer: 'Smart Industries',
      leadName: 'Ramesh Kumar',
      amount: 550000,
      probability: 100,
      stageId: 5,
      priority: 'High',
      expectedCloseDate: '2026-08-15',
      owner: 'Sarah Wilson',
      source: 'Referral',
      description: 'ERP integration project.',
      pipelineId: 1
    },
    {
      id: 6,
      number: 'OPP-0006',
      name: 'Mobile Application',
      customer: 'Future Systems',
      leadName: 'Suresh Kumar',
      amount: 120000,
      probability: 0,
      stageId: 6,
      priority: 'Low',
      expectedCloseDate: '2026-08-10',
      owner: 'Michael Brown',
      source: 'Cold Call',
      description: 'Mobile application development opportunity.',
      pipelineId: 1
    }
  ];

  // ============================================================
  // SELECTED OPPORTUNITY
  // ============================================================

  selectedOpportunity: Opportunity | null = null;

  // ============================================================
  // DRAGGED OPPORTUNITY
  // ============================================================

  draggedOpportunity: Opportunity | null = null;

  // ============================================================
  // CREATE FORM
  // ============================================================

  opportunityForm: OpportunityForm = this.createEmptyOpportunityForm();

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor() {}

  // ============================================================
  // EMPTY FORM
  // ============================================================

  private createEmptyOpportunityForm(): OpportunityForm {

    return {
      name: '',
      customer: '',
      leadName: '',
      amount: 0,
      expectedCloseDate: '',
      stageId: 1,
      priority: 'Medium',
      source: 'Website',
      description: '',
      owner: 'John Smith',
      pipelineId: this.selectedPipeline
    };
  }

  // ============================================================
  // FILTERED OPPORTUNITIES
  // ============================================================

  get filteredOpportunities(): Opportunity[] {

    const search = this.searchText
      .trim()
      .toLowerCase();

    return this.opportunities.filter(
      (opportunity: Opportunity) => {

        // Pipeline
        if (
          opportunity.pipelineId !==
          this.selectedPipeline
        ) {
          return false;
        }

        // Search
        if (search) {

          const searchText = [
            opportunity.name,
            opportunity.number,
            opportunity.customer,
            opportunity.leadName,
            opportunity.owner,
            opportunity.source
          ]
            .join(' ')
            .toLowerCase();

          if (!searchText.includes(search)) {
            return false;
          }
        }

        // Owner
        if (
          this.selectedOwner !== 'All' &&
          opportunity.owner !== this.selectedOwner
        ) {
          return false;
        }

        // Source
        if (
          this.selectedSource !== 'All' &&
          opportunity.source !== this.selectedSource
        ) {
          return false;
        }

        // Priority
        if (
          this.selectedPriority !== 'All' &&
          opportunity.priority !== this.selectedPriority
        ) {
          return false;
        }

        return true;
      }
    );
  }

  // ============================================================
  // OPEN OPPORTUNITY COUNT
  // ============================================================

  get openOpportunityCount(): number {

    return this.filteredOpportunities.filter(
      opportunity =>
        opportunity.stageId !== 5 &&
        opportunity.stageId !== 6
    ).length;
  }

  // ============================================================
  // OPEN PIPELINE TOTAL
  // ============================================================

  get pipelineTotal(): number {

    return this.filteredOpportunities
      .filter(
        opportunity =>
          opportunity.stageId !== 5 &&
          opportunity.stageId !== 6
      )
      .reduce(
        (total, opportunity) =>
          total + Number(opportunity.amount || 0),
        0
      );
  }

  // ============================================================
  // WEIGHTED PIPELINE
  // ============================================================

  get weightedPipeline(): number {

    return this.filteredOpportunities
      .filter(
        opportunity =>
          opportunity.stageId !== 5 &&
          opportunity.stageId !== 6
      )
      .reduce(
        (total, opportunity) =>
          total +
          (
            Number(opportunity.amount || 0) *
            Number(opportunity.probability || 0) /
            100
          ),
        0
      );
  }

  // ============================================================
  // WON TOTAL
  // ============================================================

  get wonTotal(): number {

    return this.filteredOpportunities
      .filter(
        opportunity =>
          opportunity.stageId === 5
      )
      .reduce(
        (total, opportunity) =>
          total + Number(opportunity.amount || 0),
        0
      );
  }

  // ============================================================
  // LOST TOTAL
  // ============================================================

  get lostTotal(): number {

    return this.filteredOpportunities
      .filter(
        opportunity =>
          opportunity.stageId === 6
      )
      .reduce(
        (total, opportunity) =>
          total + Number(opportunity.amount || 0),
        0
      );
  }

  // ============================================================
  // WON COUNT
  // ============================================================

  get wonOpportunityCount(): number {

    return this.filteredOpportunities.filter(
      opportunity =>
        opportunity.stageId === 5
    ).length;
  }

  // ============================================================
  // STAGE OPPORTUNITIES
  // ============================================================

  getStageOpportunities(
    stageId: number
  ): Opportunity[] {

    return this.filteredOpportunities.filter(
      opportunity =>
        opportunity.stageId === stageId
    );
  }

  // ============================================================
  // STAGE TOTAL
  // ============================================================

  getStageTotal(stageId: number): number {

    return this.getStageOpportunities(stageId)
      .reduce(
        (total, opportunity) =>
          total + Number(opportunity.amount || 0),
        0
      );
  }

  // ============================================================
  // GET STAGE
  // ============================================================

  getStage(
    stageId: number
  ): PipelineStage | undefined {

    return this.stages.find(
      stage =>
        stage.id === stageId
    );
  }

  // ============================================================
  // FORMAT CURRENCY
  // ============================================================

  formatCurrency(value: number): string {

    return new Intl.NumberFormat(
      'en-IN',
      {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }
    ).format(
      Number(value || 0)
    );
  }

  // ============================================================
  // PRIORITY CLASS
  // ============================================================

  getPriorityClass(
    priority: string
  ): string {

    switch (
      priority?.toLowerCase()
    ) {

      case 'high':
        return 'priority-high';

      case 'medium':
        return 'priority-medium';

      case 'low':
        return 'priority-low';

      default:
        return '';
    }
  }

  // ============================================================
  // TRACK BY
  // ============================================================

  trackById(
    index: number,
    opportunity: Opportunity
  ): number {

    return opportunity.id;
  }

  // ============================================================
  // DRAG START
  // ============================================================

  onDragStart(
    opportunity: Opportunity
  ): void {

    this.draggedOpportunity = opportunity;
  }

  // ============================================================
  // DRAG OVER
  // ============================================================

  onDragOver(
    event: DragEvent
  ): void {

    event.preventDefault();
  }

  // ============================================================
  // DROP
  // ============================================================

  onDrop(stageId: number): void {

    if (!this.draggedOpportunity) {
      return;
    }

    this.draggedOpportunity.stageId =
      stageId;

    this.updateProbabilityForStage(
      this.draggedOpportunity
    );

    this.draggedOpportunity = null;
  }

  // ============================================================
  // UPDATE PROBABILITY
  // ============================================================

  private updateProbabilityForStage(
    opportunity: Opportunity
  ): void {

    switch (opportunity.stageId) {

      case 1:
        opportunity.probability = 25;
        break;

      case 2:
        opportunity.probability = 50;
        break;

      case 3:
        opportunity.probability = 65;
        break;

      case 4:
        opportunity.probability = 75;
        break;

      case 5:
        opportunity.probability = 100;
        break;

      case 6:
        opportunity.probability = 0;
        break;

      default:
        opportunity.probability = 10;
    }
  }

  // ============================================================
  // VIEW OPPORTUNITY
  // ============================================================

  viewOpportunity(
    opportunity: Opportunity
  ): void {

    this.selectedOpportunity =
      opportunity;

    this.showOpportunityPanel = true;
  }

  // ============================================================
  // CLOSE OPPORTUNITY PANEL
  // ============================================================

  closeOpportunityPanel(): void {

    this.showOpportunityPanel = false;

    this.selectedOpportunity = null;
  }

  // ============================================================
  // MOVE OPPORTUNITY
  // ============================================================

  moveOpportunity(
    opportunity: Opportunity,
    stageId: number
  ): void {

    if (!opportunity) {
      return;
    }

    opportunity.stageId =
      Number(stageId);

    this.updateProbabilityForStage(
      opportunity
    );

    this.selectedOpportunity =
      opportunity;
  }

  // ============================================================
  // CREATE OPPORTUNITY
  // ============================================================

  openCreateOpportunity(): void {

    this.opportunityForm =
      this.createEmptyOpportunityForm();

    this.opportunityForm.pipelineId =
      this.selectedPipeline;

    this.showCreateModal = true;
  }

  // ============================================================
  // CLOSE CREATE MODAL
  // ============================================================

  closeCreateOpportunity(): void {

    this.showCreateModal = false;
  }

  // ============================================================
  // SAVE OPPORTUNITY
  // ============================================================

  saveOpportunity(): void {

    const form =
      this.opportunityForm;

    // Basic validation
    if (
      !form.name.trim() ||
      !form.customer.trim() ||
      Number(form.amount) <= 0
    ) {

      alert(
        'Please enter Opportunity Name, Customer and Amount.'
      );

      return;
    }

    const nextId =
      this.opportunities.length > 0
        ? Math.max(
            ...this.opportunities.map(
              opportunity =>
                opportunity.id
            )
          ) + 1
        : 1;

    const newOpportunity: Opportunity = {

      id: nextId,

      number:
        `OPP-${String(nextId).padStart(4, '0')}`,

      name:
        form.name.trim(),

      customer:
        form.customer.trim(),

      leadName:
        form.leadName.trim(),

      amount:
        Number(form.amount || 0),

      probability:
        this.getProbabilityByStage(
          Number(form.stageId)
        ),

      stageId:
        Number(form.stageId),

      priority:
        form.priority,

      expectedCloseDate:
        form.expectedCloseDate,

      owner:
        form.owner,

      source:
        form.source,

      description:
        form.description.trim(),

      pipelineId:
        this.selectedPipeline
    };

    this.opportunities.push(
      newOpportunity
    );

    this.showCreateModal = false;

    this.opportunityForm =
      this.createEmptyOpportunityForm();
  }

  // ============================================================
  // GET PROBABILITY
  // ============================================================

  private getProbabilityByStage(
    stageId: number
  ): number {

    switch (stageId) {

      case 1:
        return 25;

      case 2:
        return 50;

      case 3:
        return 65;

      case 4:
        return 75;

      case 5:
        return 100;

      case 6:
        return 0;

      default:
        return 10;
    }
  }

  // ============================================================
  // RESET FILTERS
  // ============================================================

  resetFilters(): void {

    this.searchText = '';

    this.selectedOwner = 'All';

    this.selectedSource = 'All';

    this.selectedPriority = 'All';
  }

}
