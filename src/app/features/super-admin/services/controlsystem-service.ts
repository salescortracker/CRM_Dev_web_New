import { Injectable  } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ControlsystemService {
     constructor(
        private http: HttpClient
    ) { }
    // ================= SUBSCRIPTION PLAN =================

private planApiUrl =
`${environment.apiUrl}/SuperAdmin`;

    
// CREATE PLAN
createPlan(plan: any): Observable<any> {
  return this.http.post(
    `${this.planApiUrl}/createplan`,
    plan
  );
}


// UPDATE PLAN
updatePlan(plan: any): Observable<any> {
  return this.http.post(
    `${this.planApiUrl}/updateplan`,
    plan
  );
}


// DELETE PLAN
deletePlan(id: number): Observable<any> {
  return this.http.post(
    `${this.planApiUrl}/deleteplan/${id}`,
    {}
  );
}


// GET ALL PLANS
getPlans(): Observable<any> {
  return this.http.get(
    `${this.planApiUrl}/getallplan`
  );
}


// GET PLAN BY ID
getPlanById(id: number): Observable<any> {
  return this.http.get(
    `${this.planApiUrl}/getbyidplan/${id}`
  );
}

// ================= ORGANIZATION =================

// CREATE
createOrganization(data:any){
   return this.http.post(
      `${this.planApiUrl}/createorganization`,
      data
   );
}

// UPDATE
updateOrganization(data:any){
   return this.http.post(
      `${this.planApiUrl}/updateorganization`,
      data
   );
}

// DELETE
deleteOrganization(id: number): Observable<any> {
  return this.http.post(
    `${this.planApiUrl}/deleteorganization/${id}`,
    {}
  );
}

// GET ALL
getOrganizations(): Observable<any> {
  return this.http.get(
    `${this.planApiUrl}/getallorganization`
  );
}

// GET BY ID
getOrganizationById(id: number): Observable<any> {
  return this.http.get(
    `${this.planApiUrl}/getorganizationbyid/${id}`
  );
}


// ================= AUDIT LOGS =================
private auditLogsApiUrl =
`${environment.apiUrl}/Auth`;

getAuditLogs(): Observable<any> {
  return this.http.get(
    `${this.auditLogsApiUrl}/getallauditlogs`
  );
}
}
