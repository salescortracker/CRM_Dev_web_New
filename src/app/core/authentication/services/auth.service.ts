import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  PasswordApiResponse,
  ResetPasswordRequest,
  VerifyOtpRequest
} from '../models/password.model';
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

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  private get storage(): Storage | null {
    return isPlatformBrowser(this.platformId) ? localStorage : null;
  }


  // ================= LOGIN =================

  login(request: LoginRequest) {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/Auth/login`,
      request
    );
  }


  // ================= FORGOT / RESET PASSWORD =================

  // POST Auth/forgot-password  { email }  ->  { success, message }
  forgotPassword(request: ForgotPasswordRequest) {
    return this.http.post<PasswordApiResponse>(
      `${this.baseUrl}/Auth/forgot-password`,
      request
    );
  }

  // POST Auth/verify-otp  { email, otp }  ->  { success, message }
  verifyOtp(request: VerifyOtpRequest) {
    return this.http.post<PasswordApiResponse>(
      `${this.baseUrl}/Auth/verify-otp`,
      request
    );
  }

  // POST Auth/reset-password  { email, newPassword }  ->  { success, message }
  resetPassword(request: ResetPasswordRequest) {
    return this.http.post<PasswordApiResponse>(
      `${this.baseUrl}/Auth/reset-password`,
      request
    );
  }

  // POST Auth/change-password (requires the logged-in user's token, which
  // the jwt interceptor adds). The API answers with a bare string rather
  // than an object, so it is read as text.
  changePassword(request: ChangePasswordRequest) {
    return this.http.post(
      `${this.baseUrl}/Auth/change-password`,
      request,
      { responseType: 'text' }
    );
  }


  // ================= LOGOUT =================

  logout(): void {

    this.storage?.removeItem('token');
    this.storage?.removeItem('user');
    this.storage?.removeItem('loginResponse');
    this.storage?.removeItem('loggedInUser');
    this.storage?.removeItem('isLoggedIn');

  }


  // ================= TOKEN =================

  getToken(): string | null {

    return this.storage?.getItem('token') ?? null;

  }


  // ================= CHECK LOGIN =================

  isLoggedIn(): boolean {

    return !!this.storage?.getItem('token');

  }


  // ================= CURRENT USER =================

  getCurrentUser(): LoginResponse | null {

    const user = this.storage?.getItem('user');

    if (!user) {
      return null;
    }

    return JSON.parse(user);

  }


  // ================= LAYOUT =================

  // 'super admin' | 'admin' | 'user' - which layout + dashboard the logged-in
  // user opens. Comes from the login response (decided by the server from the
  // user's assigned role). A session saved before that existed falls back to
  // the role name.
  getUserLayout(): string {

    const user = this.getCurrentUser();

    const normalize = (value: string | null | undefined) =>
      (value || '').replace(/[-_]/g, ' ').trim().toLowerCase();

    return normalize(user?.layout) || normalize(user?.role);

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
  // ROLE
  // =====================================================

  createRole(role: any) {

    return this.http.post<ApiResponse>(
      `${this.baseUrl}/Role/create`,
      role
    );

  }


  updateRole(role: any) {

    return this.http.post<ApiResponse>(
      `${this.baseUrl}/Role/update`,
      role
    );

  }


  deleteRole(id: number) {

    return this.http.post<ApiResponse>(
      `${this.baseUrl}/Role/delete/${id}`,
      {}
    );

  }


  getRoles() {

    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/Role/get-all`
    );

  }


  getRoleById(id: number) {

    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/Role/get-by-id/${id}`
    );

  }


  // =====================================================
  // LOGIN HISTORY
  // =====================================================

  getLoginHistory() {

    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/LoginHistory/get-all`
    );

  }


  // =====================================================
  // TEAM
  // =====================================================

  createTeam(team: any) {

    return this.http.post<ApiResponse>(
      `${this.baseUrl}/Team/create`,
      team
    );

  }


  updateTeam(team: any) {

    return this.http.post<ApiResponse>(
      `${this.baseUrl}/Team/update`,
      team
    );

  }


  deleteTeam(id: number) {

    return this.http.post<ApiResponse>(
      `${this.baseUrl}/Team/delete/${id}`,
      {}
    );

  }


  getTeams() {

    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/Team/get-all`
    );

  }


  getTeamById(id: number) {

    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/Team/get-by-id/${id}`
    );

  }


  // =====================================================
  // ACCESS POLICY
  // =====================================================

  createAccessPolicy(policy: any) {

    return this.http.post<ApiResponse>(
      `${this.baseUrl}/AccessPolicy/create`,
      policy
    );

  }


  updateAccessPolicy(policy: any) {

    return this.http.post<ApiResponse>(
      `${this.baseUrl}/AccessPolicy/update`,
      policy
    );

  }


  deleteAccessPolicy(id: number) {

    return this.http.post<ApiResponse>(
      `${this.baseUrl}/AccessPolicy/delete/${id}`,
      {}
    );

  }


  getAccessPolicies() {

    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/AccessPolicy/get-all`
    );

  }


  getAccessPolicyById(id: number) {

    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/AccessPolicy/get-by-id/${id}`
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
