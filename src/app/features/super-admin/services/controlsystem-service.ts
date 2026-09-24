import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../core/authentication/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class ControlsystemService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }


  // ================= SUBSCRIPTION PLAN =================

  // CREATE PLAN
  createPlan(plan: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/createplan`,
      plan
    );
  }

  // UPDATE PLAN
  updatePlan(plan: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/updateplan`,
      plan
    );
  }

  // DELETE PLAN
  deletePlan(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/deleteplan/${id}`,
      {}
    );
  }

  // GET ALL PLANS
  getPlans(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/SuperAdmin/getallplan`
    );
  }

  // GET PLAN BY ID
  getPlanById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/SuperAdmin/getbyidplan/${id}`
    );
  }


  // ================= ORGANIZATION =================

  // CREATE ORGANIZATION
  createOrganization(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/createorganization`,
      data
    );
  }

  // UPDATE ORGANIZATION
  updateOrganization(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/updateorganization`,
      data
    );
  }

  // DELETE ORGANIZATION
  deleteOrganization(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/deleteorganization/${id}`,
      {}
    );
  }

  // GET ALL ORGANIZATIONS
  getOrganizations(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/SuperAdmin/getallorganization`
    );
  }

  // GET ORGANIZATION BY ID
  getOrganizationById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/SuperAdmin/getorganizationbyid/${id}`
    );
  }


  // ================= COMPANY SUBSCRIPTION =================

  createCompanySubscription(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/createcompanysubscription`,
      data
    );
  }

  updateCompanySubscription(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/updatecompanysubscription`,
      data
    );
  }

  deleteCompanySubscription(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/deletecompanysubscription/${id}`,
      {}
    );
  }

  getCompanySubscriptions(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/SuperAdmin/getallcompanysubscription`
    );
  }

  getCompanySubscriptionById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/SuperAdmin/getbyidcompanysubscription/${id}`
    );
  }

  // ================= PAYMENT TRACKING =================

  createPaymentTracking(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/createpaymenttracking`,
      data
    );
  }

  updatePaymentTracking(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/updatepaymenttracking`,
      data
    );
  }

  deletePaymentTracking(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/deletepaymenttracking/${id}`,
      {}
    );
  }

  getPaymentTrackings(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/SuperAdmin/getallpaymenttracking`
    );
  }

  getPaymentTrackingById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/SuperAdmin/getbyidpaymenttracking/${id}`
    );
  }

  refundPaymentTracking(id: number, refundAmount: number, refundReason: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/refundpaymenttracking/${id}`,
      { refundAmount, refundReason }
    );
  }

  // ================= BILLING =================

  createBilling(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/createbilling`,
      data
    );
  }

  updateBilling(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/updatebilling`,
      data
    );
  }

  deleteBilling(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/deletebilling/${id}`,
      {}
    );
  }

  getBillings(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/SuperAdmin/getallbilling`
    );
  }

  getBillingById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/SuperAdmin/getbyidbilling/${id}`
    );
  }

  // ================= INVOICE =================

  createInvoice(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/createinvoice`,
      data
    );
  }

  updateInvoice(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/updateinvoice`,
      data
    );
  }

  deleteInvoice(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/deleteinvoice/${id}`,
      {}
    );
  }

  getInvoices(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/SuperAdmin/getallinvoice`
    );
  }

  getInvoiceById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/SuperAdmin/getbyidinvoice/${id}`
    );
  }

  // ================= COUPON =================

  createCoupon(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/createcoupon`,
      data
    );
  }

  updateCoupon(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/updatecoupon`,
      data
    );
  }

  deleteCoupon(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/deletecoupon/${id}`,
      {}
    );
  }

  getCoupons(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/SuperAdmin/getallcoupon`
    );
  }

  getCouponById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/SuperAdmin/getbyidcoupon/${id}`
    );
  }

  // ================= WORKFLOW RULE =================

  // CREATE WORKFLOW RULE
  createWorkflowRule(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/createworkflowrule`,
      data
    );
  }

  // UPDATE WORKFLOW RULE
  updateWorkflowRule(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/updateworkflowrule`,
      data
    );
  }

  // DELETE WORKFLOW RULE
  deleteWorkflowRule(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/deleteworkflowrule/${id}`,
      {}
    );
  }

  // GET ALL WORKFLOW RULES
  getWorkflowRules(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/SuperAdmin/getallworkflowrules`
    );
  }

  // GET WORKFLOW RULE BY ID
  getWorkflowRuleById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/SuperAdmin/getworkflowrulebyid/${id}`
    );
  }

  // ================= APPROVAL WORKFLOW =================

  // CREATE APPROVAL WORKFLOW
  createApprovalWorkflow(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/createapprovalworkflow`,
      data
    );
  }

  // UPDATE APPROVAL WORKFLOW
  updateApprovalWorkflow(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/updateapprovalworkflow`,
      data
    );
  }

  // DELETE APPROVAL WORKFLOW
  deleteApprovalWorkflow(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/deleteapprovalworkflow/${id}`,
      {}
    );
  }

  // GET ALL APPROVAL WORKFLOWS
  getApprovalWorkflows(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/SuperAdmin/getallapprovalworkflows`
    );
  }

  // GET APPROVAL WORKFLOW BY ID
  getApprovalWorkflowById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/SuperAdmin/getapprovalworkflowbyid/${id}`
    );
  }

  // ================= AUTO ASSIGNMENT RULE =================

  // CREATE AUTO ASSIGNMENT RULE
  createAutoAssignmentRule(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/createautoassignmentrule`,
      data
    );
  }

  // UPDATE AUTO ASSIGNMENT RULE
  updateAutoAssignmentRule(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/updateautoassignmentrule`,
      data
    );
  }

  // DELETE AUTO ASSIGNMENT RULE
  deleteAutoAssignmentRule(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/deleteautoassignmentrule/${id}`,
      {}
    );
  }

  // GET ALL AUTO ASSIGNMENT RULES
  getAutoAssignmentRules(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/SuperAdmin/getallautoassignmentrules`
    );
  }

  // GET AUTO ASSIGNMENT RULE BY ID
  getAutoAssignmentRuleById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/SuperAdmin/getautoassignmentrulebyid/${id}`
    );
  }

  // ================= ESCALATION RULE =================

  // CREATE ESCALATION RULE
  createEscalationRule(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/createescalationrule`,
      data
    );
  }

  // UPDATE ESCALATION RULE
  updateEscalationRule(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/updateescalationrule`,
      data
    );
  }

  // DELETE ESCALATION RULE
  deleteEscalationRule(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/deleteescalationrule/${id}`,
      {}
    );
  }

  // GET ALL ESCALATION RULES
  getEscalationRules(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/SuperAdmin/getallescalationrules`
    );
  }

  // GET ESCALATION RULE BY ID
  getEscalationRuleById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/SuperAdmin/getescalationrulebyid/${id}`
    );
  }

  // ================= SLA RULE =================

  // CREATE SLA RULE
  createSlarule(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/createslarule`,
      data
    );
  }

  // UPDATE SLA RULE
  updateSlarule(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/updateslarule`,
      data
    );
  }

  // DELETE SLA RULE
  deleteSlarule(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/deleteslarule/${id}`,
      {}
    );
  }

  // GET ALL SLA RULES
  getSlarules(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/SuperAdmin/getslarules`
    );
  }

  // GET SLA RULE BY ID
  getSlaruleById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/SuperAdmin/getslarulebyid/${id}`
    );
  }

  // ================= EMAIL AUTOMATION =================

  // CREATE EMAIL AUTOMATION
  createEmailAutomation(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/createemailautomation`,
      data
    );
  }

  // UPDATE EMAIL AUTOMATION
  updateEmailAutomation(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/updateemailautomation`,
      data
    );
  }

  // DELETE EMAIL AUTOMATION
  deleteEmailAutomation(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/deleteemailautomation/${id}`,
      {}
    );
  }

  // GET ALL EMAIL AUTOMATIONS
  getEmailAutomations(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/SuperAdmin/getallemailautomations`
    );
  }

  // GET EMAIL AUTOMATION BY ID
  getEmailAutomationById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/SuperAdmin/getemailautomationbyid/${id}`
    );
  }

  // ================= AUDIT LOGS =================

  // GET ALL AUDIT LOGS
  getAuditLogs(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/Auth/getallauditlogs`
    );
  }
  // ================= CRM MODULE CONFIGURATION =================
  // ================= LEAD SETTINGS =================

createLeadSetting(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/createleadsetting`,
    data
  );
}

updateLeadSetting(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/updateleadsetting`,
    data
  );
}

deleteLeadSetting(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/deleteleadsetting/${id}`,
    {}
  );
}

getLeadSettings(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/SuperAdmin/getallleadsetting`
  );
}


getLeadSettingById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/SuperAdmin/getbyleadsetting/${id}`
  );
}

// ================= PIPELINE SETTINGS =================

createPipelineSetting(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/createpipelinesetting`,
    data
  );
}

updatePipelineSetting(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/updatepipelinesetting`,
    data
  );
}

deletePipelineSetting(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/deletepipelinesetting/${id}`,
    {}
  );
}

getPipelineSettings(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/SuperAdmin/getallpipelinesetting`
  );
}

getPipelineSettingById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/SuperAdmin/getbypipelinesetting/${id}`
  );
}
// ================= OPPORTUNITY STAGES =================

createOpportunityStage(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/createopportunitystage`,
    data
  );
}

updateOpportunityStage(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/updateopportunitystage`,
    data
  );
}

deleteOpportunityStage(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/deleteopportunitystage/${id}`,
    {}
  );
}

getOpportunityStages(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/SuperAdmin/getallopportunitystage`
  );
}

getOpportunityStageById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/SuperAdmin/getbyopportunitystage/${id}`
  );
}
  // ================= ACTIVITY TYPE =================

  // CREATE ACTIVITY TYPE
  createActivityType(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/createactivitytype`,
      data
    );
  }

  // UPDATE ACTIVITY TYPE
  updateActivityType(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/updateactivitytype`,
      data
    );
  }

  // DELETE ACTIVITY TYPE
  deleteActivityType(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/SuperAdmin/deleteactivitytype/${id}`,
      {}
    );
  }

  // GET ALL ACTIVITY TYPES
  getActivityTypes(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/SuperAdmin/getallactivitytype`
    );
  }

  // GET ACTIVITY TYPE BY ID
  getActivityTypeById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/SuperAdmin/getbyidactivitytype/${id}`
    );
  }

  // ================= SOURCE =================

// CREATE SOURCE
createSource(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/createsource`,
    data
  );
}

// UPDATE SOURCE
updateSource(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/updatesource`,
    data
  );
}

// DELETE SOURCE
deleteSource(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/deletesource/${id}`,
    {}
  );
}

// GET ALL SOURCES
getSources(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/SuperAdmin/getallsources`
  );
}

// GET SOURCE BY ID
getSourceById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/SuperAdmin/getbyidsource/${id}`
  );
}

// ================= INDUSTRY =================

createIndustry(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/createindustry`,
    data
  );
}

updateIndustry(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/updateindustry`,
    data
  );
}

deleteIndustry(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/deleteindustry/${id}`,
    {}
  );
}

getIndustries(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/SuperAdmin/getallindustries`
  );
}

getIndustryById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/SuperAdmin/getbyidindustry/${id}`
  );
}
// ================= TERRITORY =================

createTerritory(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/createterritory`,
    data
  );
}

updateTerritory(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/updateterritory`,
    data
  );
}

deleteTerritory(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/deleteterritory/${id}`,
    {}
  );
}

getTerritories(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/SuperAdmin/getallterritories`
  );
}

getTerritoryById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/SuperAdmin/getbyterritory/${id}`
  );
}
// ================= SALES TARGET =================

createSalesTarget(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/createsalestarget`,
    data
  );
}

updateSalesTarget(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/updatesalestarget`,
    data
  );
}

deleteSalesTarget(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/deletesalestarget/${id}`,
    {}
  );
}

getSalesTargets(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/SuperAdmin/getallsalestargets`
  );
}

getSalesTargetById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/SuperAdmin/getbysalestarget/${id}`
  );
}

// ================= NUMBER SERIES =================

createNumberSeries(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/createnumberseries`,
    data
  );
}

updateNumberSeries(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/updatenumberseries`,
    data
  );
}

deleteNumberSeries(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/deletenumberseries/${id}`,
    {}
  );
}

getNumberSeries(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/SuperAdmin/getallnumberseries`
  );
}

getNumberSeriesById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/SuperAdmin/getbynumberseries/${id}`
  );
}
// ================= CUSTOM FIELDS =================

createCustomField(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/createcustomfield`,
    data
  );
}

updateCustomField(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/updatecustomfield`,
    data
  );
}

deleteCustomField(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/deletecustomfield/${id}`,
    {}
  );
}

getCustomFields(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/SuperAdmin/getallcustomfields`
  );
}

getCustomFieldById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/SuperAdmin/getbycustomfield/${id}`
  );
}

// ================= DEPARTMENT =================

// CREATE DEPARTMENT
createDepartment(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/Master/createdepartment`,
    data
  );
}

// UPDATE DEPARTMENT
updateDepartment(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/Master/updatedepartment`,
    data
  );
}

// DELETE DEPARTMENT
deleteDepartment(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/Master/deletedepartment/${id}`,
    {}
  );
}

// GET ALL DEPARTMENTS
getDepartments(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/Master/getalldepartment`
  );
}

// GET DEPARTMENT BY ID
getDepartmentById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/Master/getbydepartment/${id}`
  );
}
// ================= DESIGNATION =================

// CREATE DESIGNATION
createDesignation(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/Master/createdesignation`,
    data
  );
}

// UPDATE DESIGNATION
updateDesignation(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/Master/updatedesignation`,
    data
  );
}

// DELETE DESIGNATION
deleteDesignation(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/Master/deletedesignation/${id}`,
    {}
  );
}

// GET ALL DESIGNATIONS
getDesignations(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/Master/getalldesignation`
  );
}

// GET ACTIVE DEPARTMENTS OF THE LOGGED-IN USER'S COMPANY + REGION
getDepartmentsByScope(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/Master/getdepartmentsbyscope`
  );
}

// GET ACTIVE DESIGNATIONS OF A DEPARTMENT (LOGGED-IN USER'S COMPANY + REGION)
getDesignationsByScope(departmentId: number): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/Master/getdesignationsbyscope/${departmentId}`
  );
}

// GET DESIGNATION BY ID
getDesignationById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/Master/getbydesignation/${id}`
  );
}

// ================= BRANCH =================

// CREATE BRANCH
createBranch(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/createbranch`,
    data
  );
}

// UPDATE BRANCH
updateBranch(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/updatebranch`,
    data
  );
}

// DELETE BRANCH
deleteBranch(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/deletebranch/${id}`,
    {}
  );
}

// GET ALL BRANCHES
getBranches(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/SuperAdmin/getallbranch`
  );
}

// GET BRANCH BY ID
getBranchById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/SuperAdmin/getbybranch/${id}`
  );
}

// ================= BUSINESS UNIT =================

// CREATE BUSINESS UNIT
createBusinessUnit(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/createbusinessunit`,
    data
  );
}

// UPDATE BUSINESS UNIT
updateBusinessUnit(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/updatebusinessunit`,
    data
  );
}

// DELETE BUSINESS UNIT
deleteBusinessUnit(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/deletebusinessunit/${id}`,
    {}
  );
}

// GET ALL BUSINESS UNITS
getBusinessUnits(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/SuperAdmin/getallbusinessunit`
  );
}

// GET BUSINESS UNIT BY ID
getBusinessUnitById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/SuperAdmin/getbybusinessunit/${id}`
  );
}

// ================= COUNTRY =================

// GET ALL COUNTRIES
getCountries(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/Master/getallcountry`
  );
}

// ================= STATE =================

// GET ALL STATES
getStates(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/Master/getallstate`
  );
}

// ================= MARKETING LIST =================

// CREATE MARKETING LIST
createMarketingList(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/createmarketinglist`,
    data
  );
}

// UPDATE MARKETING LIST
updateMarketingList(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/updatemarketinglist`,
    data
  );
}

// DELETE MARKETING LIST
deleteMarketingList(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/deletemarketinglist/${id}`,
    {}
  );
}

// GET ALL MARKETING LISTS
getMarketingLists(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/SuperAdmin/getallmarketinglist`
  );
}

// GET MARKETING LIST BY ID
getMarketingListById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/SuperAdmin/getbymarketinglist/${id}`
  );
}

// ================= CAMPAIGN =================

// CREATE CAMPAIGN
createCampaign(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/createcampaign`,
    data
  );
}

// UPDATE CAMPAIGN
updateCampaign(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/updatecampaign`,
    data
  );
}

// DELETE CAMPAIGN
deleteCampaign(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/deletecampaign/${id}`,
    {}
  );
}

// GET ALL CAMPAIGNS
getCampaigns(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/SuperAdmin/getallcampaign`
  );
}

// GET CAMPAIGN BY ID
getCampaignById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/SuperAdmin/getbycampaign/${id}`
  );
}

// ================= EMAIL TEMPLATE =================

// GET ALL EMAIL TEMPLATES
getEmailTemplates(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/SuperAdmin/getallemailtemplate`
  );
}

// ================= EMAIL CAMPAIGN =================

// CREATE EMAIL CAMPAIGN
createEmailCampaign(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/createemailcampaign`,
    data
  );
}

// UPDATE EMAIL CAMPAIGN
updateEmailCampaign(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/updateemailcampaign`,
    data
  );
}

// DELETE EMAIL CAMPAIGN
deleteEmailCampaign(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/deleteemailcampaign/${id}`,
    {}
  );
}

// GET ALL EMAIL CAMPAIGNS
getEmailCampaigns(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/SuperAdmin/getallemailcampaign`
  );
}

// GET EMAIL CAMPAIGN BY ID
getEmailCampaignById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/SuperAdmin/getbyemailcampaign/${id}`
  );
}

// ================= SMS TEMPLATE =================

// GET ALL SMS TEMPLATES
getSMSTemplates(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/SuperAdmin/getallsmsTemplate`
  );
}

// ================= SMS CAMPAIGN =================

// CREATE SMS CAMPAIGN
createSmsCampaign(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/createsmsCampaign`,
    data
  );
}

// UPDATE SMS CAMPAIGN
updateSmsCampaign(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/updatesmsCampaign`,
    data
  );
}

// DELETE SMS CAMPAIGN
deleteSmsCampaign(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/deletesmsCampaign/${id}`,
    {}
  );
}

// GET ALL SMS CAMPAIGNS
getSmsCampaigns(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/SuperAdmin/getallsmsCampaign`
  );
}

// GET SMS CAMPAIGN BY ID
getSmsCampaignById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/SuperAdmin/getbysmsCampaign/${id}`
  );
}

// ================= WHATSAPP TEMPLATE =================

// GET ALL WHATSAPP TEMPLATES
getWhatsAppTemplates(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/SuperAdmin/getallwhatsapptemplate`
  );
}

// ================= WHATSAPP CAMPAIGN =================

// CREATE WHATSAPP CAMPAIGN
createWhatsAppCampaign(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/createwhatsappcampaign`,
    data
  );
}

// UPDATE WHATSAPP CAMPAIGN
updateWhatsAppCampaign(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/updatewhatsappcampaign`,
    data
  );
}

// DELETE WHATSAPP CAMPAIGN
deleteWhatsAppCampaign(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/deletewhatsappcampaign/${id}`,
    {}
  );
}

// GET ALL WHATSAPP CAMPAIGNS
getWhatsAppCampaigns(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/SuperAdmin/getallwhatsappcampaign`
  );
}

// GET WHATSAPP CAMPAIGN BY ID
getWhatsAppCampaignById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/SuperAdmin/getbywhatsappcampaign/${id}`
  );
}

// ================= COMPANY ADMINISTRATOR =================

// CREATE COMPANY ADMINISTRATOR
createCompanyAdministrator(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/createcompanyadministrator`,
    data
  );
}

// UPDATE COMPANY ADMINISTRATOR
updateCompanyAdministrator(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/updatecompanyadministrator`,
    data
  );
}

// DELETE COMPANY ADMINISTRATOR
deleteCompanyAdministrator(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/deletecompanyadministrator/${id}`,
    {}
  );
}

// GET ALL COMPANY ADMINISTRATORS
getCompanyAdministrators(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/SuperAdmin/getallcompanyadministrator`
  );
}

// GET COMPANY ADMINISTRATOR BY ID
getCompanyAdministratorById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/SuperAdmin/getbycompanyadministrator/${id}`
  );
}

// ================= USER =================

// CREATE USER (User Management screen) - saves the user, emails the login
// details and returns a token generated for the new user
createAdminUser(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/Admin/createuser`,
    data
  );
}

// UPDATE USER (User Management screen)
updateAdminUser(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/Admin/updateuser`,
    data
  );
}

// DELETE USER (User Management screen)
deleteAdminUser(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/Admin/deleteuser/${id}`,
    {}
  );
}

// GET ALL USERS (User Management screen)
getAdminUsers(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/Admin/getalluser`
  );
}

// GET USER BY ID (User Management screen)
getAdminUserById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/Admin/getbyiduser/${id}`
  );
}

// CREATE USER
createUser(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/createuser`,
    data
  );
}

// UPDATE USER
updateUser(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/updateuser`,
    data
  );
}

// DELETE USER
deleteUser(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/SuperAdmin/deleteuser/${id}`,
    {}
  );
}

// GET ALL USERS
getUsers(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/SuperAdmin/getalluser`
  );
}

// GET USER BY ID
getUserById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/SuperAdmin/getbyiduser/${id}`
  );
}

// ================= USER MENU (Menu Master) =================

// CREATE USER MENU
createUserMenu(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/UserMenu/create`,
    data
  );
}

// UPDATE USER MENU
updateUserMenu(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/UserMenu/update`,
    data
  );
}

// DELETE USER MENU
deleteUserMenu(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/UserMenu/delete/${id}`,
    {}
  );
}

// GET ALL USER MENUS
getUserMenus(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/UserMenu/get-all`
  );
}

// GET USER MENU BY ID
getUserMenuById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/UserMenu/get-by-id/${id}`
  );
}

// ================= USER ROLE (Role Master) =================

// CREATE USER ROLE
createUserRole(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/UserRole/create`,
    data
  );
}

// UPDATE USER ROLE
updateUserRole(data: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/UserRole/update`,
    data
  );
}

// DELETE USER ROLE
deleteUserRole(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.baseUrl}/UserRole/delete/${id}`,
    {}
  );
}

// GET ALL USER ROLES
getUserRoles(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(
    `${this.baseUrl}/UserRole/get-all`
  );
}

// GET USER ROLE BY ID
getUserRoleById(id: number): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}/UserRole/get-by-id/${id}`
  );
}
}
