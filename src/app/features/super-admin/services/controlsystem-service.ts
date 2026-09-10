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
}
