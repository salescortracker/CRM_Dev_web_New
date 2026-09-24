import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/authentication/services/auth.service';

// Mirrors Business_Layer.DTOs.User.CompanyInformationDto (camelCase over the wire).
export interface CompanyInformationDto {
  companyInformationId: number;

  companyName: string;
  legalCompanyName?: string | null;

  industryId: number;
  industryName?: string | null;

  companyTypeId: number;
  companyTypeName?: string | null;

  companyOwner: string;
  companyStatus: string;

  website?: string | null;
  companyPhone?: string | null;
  companyEmail?: string | null;
  companyDescription?: string | null;

  addressLine1?: string | null;
  addressLine2?: string | null;
  city: string;

  stateId: number;
  stateName?: string | null;

  countryId: number;
  countryName?: string | null;

  postalCode?: string | null;

  numberOfEmployees?: string | null;
  annualRevenue?: number | null;

  gstnumber?: string | null;
  pannumber?: string | null;
  cinregistrationNumber?: string | null;
  linkedInCompanyUrl?: string | null;

  primaryContactName?: string | null;
  primaryContactDesignation?: string | null;
  primaryContactEmail?: string | null;
  primaryContactPhone?: string | null;

  // Multi-tenant
  companyId: number;
  regionId: number;

  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private baseUrl = `${environment.apiUrl}/UserManagement`;

  constructor(private http: HttpClient) { }

  createCompany(data: Partial<CompanyInformationDto>): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.baseUrl}/createcompany`,
      data
    );
  }

  updateCompany(data: Partial<CompanyInformationDto>): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.baseUrl}/updatecompany`,
      data
    );
  }

  deleteCompany(id: number): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.baseUrl}/deletecompany/${id}`,
      {}
    );
  }

  getCompanies(): Observable<ApiResponse<CompanyInformationDto[]>> {
    return this.http.get<ApiResponse<CompanyInformationDto[]>>(
      `${this.baseUrl}/getallcompanies`
    );
  }

  getCompanyById(id: number): Observable<ApiResponse<CompanyInformationDto>> {
    return this.http.get<ApiResponse<CompanyInformationDto>>(
      `${this.baseUrl}/getcompanybyid/${id}`
    );
  }

  // Dropdown not covered by LeadService (industries/countries/states are).
  getCompanyTypes(): Observable<ApiResponse<{ companyTypeId: number; companyTypeName: string }[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/getcompanytypes`);
  }
}
