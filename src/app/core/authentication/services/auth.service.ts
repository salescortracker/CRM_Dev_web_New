import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { environment } from '../../../../environments/environment';

export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success?: boolean;
}


@Injectable({
    providedIn: 'root'
})
export class AuthService {

   private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }


  // ================= LOGIN =================

  login(request: LoginRequest) {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/Auth/login`,
      request
    );
  }


  // ================= LOGOUT =================

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

  }


  // ================= TOKEN =================

  getToken(): string | null {

    return localStorage.getItem('token');

  }


  // ================= CHECK LOGIN =================

  isLoggedIn(): boolean {

    return !!localStorage.getItem('token');

  }


  // ================= CURRENT USER =================

  getCurrentUser(): LoginResponse | null {

    const user = localStorage.getItem('user');

    if (!user) {
      return null;
    }

    return JSON.parse(user);

  }


  // =====================================================
  // MENU
  // =====================================================

  createMenu(menu: any) {

    return this.http.post<ApiResponse>(
      `${this.baseUrl}/Menu/create`,
      menu
    );

  }


  updateMenu(menu: any) {

    return this.http.post<ApiResponse>(
      `${this.baseUrl}/Menu/update`,
      menu
    );

  }


  deleteMenu(id: number) {

    return this.http.post<ApiResponse>(
      `${this.baseUrl}/Menu/delete/${id}`,
      {}
    );

  }


  getMenus() {

    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/Menu/get-all`
    );

  }


  getMenuById(id: number) {

    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/Menu/get-by-id/${id}`
    );

  }


  // =====================================================
  // COMPANY
  // =====================================================

  createCompany(company: any) {

    return this.http.post<ApiResponse>(
      `${this.baseUrl}/Master/createcompany`,
      company
    );

  }


  updateCompany(company: any) {

    return this.http.post<ApiResponse>(
      `${this.baseUrl}/Master/updatecompany`,
      company
    );

  }


  deleteCompany(id: number) {

    return this.http.post<ApiResponse>(
      `${this.baseUrl}/Master/deletecompany/${id}`,
      {}
    );

  }


  getCompanies() {

    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/Master/getallcompany`
    );

  }


  getCompanyById(id: number) {

    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/Master/getbyidcompany/${id}`
    );

  }


  // =====================================================
  // REGION
  // =====================================================

  createRegion(region: any) {

    return this.http.post<ApiResponse>(
      `${this.baseUrl}/Master/createregion`,
      region
    );

  }


  updateRegion(region: any) {

    return this.http.post<ApiResponse>(
      `${this.baseUrl}/Master/updateregion`,
      region
    );

  }


  deleteRegion(id: number) {

    return this.http.post<ApiResponse>(
      `${this.baseUrl}/Master/deleteregion/${id}`,
      {}
    );

  }


  getRegions() {

    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/Master/getallregion`
    );

  }


  getRegionById(id: number) {

    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/Master/getbyidregion/${id}`
    );

  }
}
