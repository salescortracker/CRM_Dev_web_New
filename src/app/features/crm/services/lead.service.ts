import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, AuthService } from '../../../core/authentication/services/auth.service';

// Mirrors Business_Layer.DTOs.User.LeadDto (camelCase over the wire).
export interface LeadDto {
  leadId: number;
  leadNumber: string;

  salutation?: string | null;
  firstName: string;
  lastName: string;
  jobTitle?: string | null;

  email: string;
  phone?: string | null;
  mobile?: string | null;

  leadTypeId: number;
  leadTypeName?: string | null;

  leadOwnerId?: number | null;
  leadOwnerName?: string | null;

  leadSourceId: number;
  leadSourceName?: string | null;

  leadStatus: string;
  leadRating?: string | null;
  leadScore?: number | null;
  preferredContactMethod?: string | null;

  companyName: string;
  website?: string | null;

  industryId?: number | null;
  industryName?: string | null;

  companySize?: string | null;
  annualRevenue?: number | null;

  streetAddress?: string | null;
  city?: string | null;

  stateId?: number | null;
  stateName?: string | null;

  postalCode?: string | null;

  countryId?: number | null;
  countryName?: string | null;

  estimatedDealValue?: number | null;
  expectedCloseDate?: string | null;   // DateOnly -> 'yyyy-MM-dd'
  description?: string | null;

  companyId?: number | null;
  primaryContactId?: number | null;

  crmcompanyId: number;
  regionId: number;

  isActive: boolean;
  createdAt?: string | null;
  modifiedAt?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  private baseUrl = `${environment.apiUrl}/UserManagement`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Logged-in user's id, read from the JWT (same claim the user screens use).
  getCurrentUserId(): number | null {

    const token = this.authService.getToken();

    if (!token) {
      return null;
    }

    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(atob(payload));
      const id = decoded['UserId'] ?? decoded['userId'] ?? decoded['sub'];

      return id ? Number(id) : null;
    } catch {
      return null;
    }
  }

  // ================= LEAD CRUD =================

  createLead(data: Partial<LeadDto>): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.baseUrl}/createlead`,
      data
    );
  }

  updateLead(data: Partial<LeadDto>): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.baseUrl}/updatelead`,
      data
    );
  }

  deleteLead(id: number): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.baseUrl}/deletelead/${id}`,
      {}
    );
  }

  getLeads(): Observable<ApiResponse<LeadDto[]>> {
    return this.http.get<ApiResponse<LeadDto[]>>(
      `${this.baseUrl}/getallleads`
    );
  }

  getLeadById(id: number): Observable<ApiResponse<LeadDto>> {
    return this.http.get<ApiResponse<LeadDto>>(
      `${this.baseUrl}/getbyleadid/${id}`
    );
  }

  // ================= DROPDOWNS =================

  getLeadTypes(): Observable<ApiResponse<{ leadTypeId: number; leadTypeName: string }[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/getleadtypes`);
  }

  getLeadSources(): Observable<ApiResponse<{ leadSourceId: number; leadSourceName: string }[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/getleadsources`);
  }

  getIndustries(): Observable<ApiResponse<{ industryId: number; industryName: string }[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/getindustries`);
  }

  getCountries(): Observable<ApiResponse<{ countryId: number; countryName: string }[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/getcountries`);
  }

  getStates(countryId?: number | null): Observable<ApiResponse<{ stateId: number; countryId: number; stateName: string }[]>> {
    let params = new HttpParams();

    if (countryId) {
      params = params.set('countryId', countryId);
    }

    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/getstates`,
      { params }
    );
  }

  // Logged-in user's organisation (needed for CrmcompanyId / RegionId on save).
  getUserById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${environment.apiUrl}/SuperAdmin/getbyiduser/${id}`
    );
  }
}
