import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/authentication/services/auth.service';

// Mirrors Business_Layer.DTOs.User.ContactDto (camelCase over the wire).
export interface ContactDto {
  contactInformationId: number;
  contactNumber: string;

  salutation: string;
  firstName: string;
  lastName?: string | null;
  designation?: string | null;
  department?: string | null;

  companyInformationId: number;
  companyName?: string | null;

  contactTypeId?: number | null;
  contactTypeName?: string | null;

  relationshipId?: number | null;
  relationshipName?: string | null;

  businessEmail: string;
  phone: string;
  alternatePhone?: string | null;
  website?: string | null;

  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;

  stateId?: number | null;
  stateName?: string | null;

  countryId?: number | null;
  countryName?: string | null;

  postalCode?: string | null;

  notes?: string | null;

  // Multi-tenant
  companyId: number;
  regionId: number;

  isActive: boolean;
  createdAt?: string | null;
  modifiedAt?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private baseUrl = `${environment.apiUrl}/UserManagement`;

  private masterUrl = `${environment.apiUrl}/Master`;

  constructor(private http: HttpClient) { }

  createContact(data: Partial<ContactDto>): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.baseUrl}/createcontact`,
      data
    );
  }

  updateContact(data: Partial<ContactDto>): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.baseUrl}/updatecontact`,
      data
    );
  }

  deleteContact(id: number): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.baseUrl}/deletecontact/${id}`,
      {}
    );
  }

  getContacts(): Observable<ApiResponse<ContactDto[]>> {
    return this.http.get<ApiResponse<ContactDto[]>>(
      `${this.baseUrl}/getallcontacts`
    );
  }

  getContactById(id: number): Observable<ApiResponse<ContactDto>> {
    return this.http.get<ApiResponse<ContactDto>>(
      `${this.baseUrl}/getbycontactid/${id}`
    );
  }

  // ================= DROPDOWNS (Master) =================

  getContactTypes(): Observable<ApiResponse<{ contactTypeId: number; contactTypeName: string; isActive: boolean }[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.masterUrl}/getallcontacttype`);
  }

  getRelationships(): Observable<ApiResponse<{ relationshipId: number; relationshipName: string; isActive: boolean }[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.masterUrl}/getallrelationship`);
  }
}
