import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { environment } from '../../../../environments/environment';



@Injectable({
    providedIn: 'root'
})
export class AuthService {

   /*
     * ============================================================
     * STATIC LOGIN USERS
     * ============================================================
     */
    private testUsers = [
        {
            email: 'superadmin@crm.com',
            password: 'superadmin123',
            firstName: 'Super',
            lastName: 'Admin',
            role: 'super-admin',
            permissions: [
                'manage-users',
                'manage-settings',
                'view-reports',
                'manage-all'
            ]
        },
        {
            email: 'admin@crm.com',
            password: 'admin123',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            permissions: [
                'manage-contacts',
                'manage-deals',
                'manage-leads',
                'manage-companies'
            ]
        },
        {
            email: 'user@crm.com',
            password: 'user123',
            firstName: 'Normal',
            lastName: 'User',
            role: 'user',
            permissions: [
                'view-contacts',
                'view-deals',
                'manage-leads',
                'add-leads'
            ]
        }
    ];

    /*
     * ============================================================
     * CURRENT USER
     * ============================================================
     */
    private currentUserSubject =
        new BehaviorSubject<LoginResponse | null>(
            this.getStoredUser()
        );

    currentUser$ =
        this.currentUserSubject.asObservable();

    /*
     * ============================================================
     * EXISTING API URLs
     * ============================================================
     */

    private apiUrl = `${environment.apiUrl}/Auth`;

    private menuApiUrl =
        `${environment.apiUrl}/Menu`;

    private companyApiUrl =
        `${environment.apiUrl}/Master`;


    constructor(
        private http: HttpClient
    ) { }


    /*
     * ============================================================
     * STATIC LOGIN
     * ============================================================
     */
    login(
        request: LoginRequest
    ): Observable<LoginResponse> {

        const email = request.userName?.trim().toLowerCase();
        const password = request.password;

        const user = this.testUsers.find(
            u =>
                u.email.toLowerCase() === email &&
                u.password === password
        );

        /*
         * Invalid username/password
         */
        if (!user) {

            return throwError(() => ({
                error: {
                    message: 'Invalid Username or Password'
                }
            }));

        }

        /*
         * Convert static role names to the role names
         * expected by your EXISTING SIDEBAR.
         *
         * Sidebar expects:
         * Super Admin
         * Admin
         * User
         */
        let sidebarRole = '';

        switch (user.role) {

            case 'super-admin':
                sidebarRole = 'Super Admin';
                break;

            case 'admin':
                sidebarRole = 'Admin';
                break;

            case 'user':
                sidebarRole = 'User';
                break;
        }

        /*
         * Static login response
         */
        const response = {
            token: `static-token-${user.role}`,
            userName: user.email,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: sidebarRole,
            permissions: user.permissions
        } as unknown as LoginResponse;

        /*
         * Store login information
         */
        if (typeof window !== 'undefined') {

            localStorage.setItem(
                'token',
                response.token
            );

            localStorage.setItem(
                'user',
                JSON.stringify(response)
            );
        }

        this.currentUserSubject.next(response);

        /*
         * Return static response
         */
        return of(response);
    }


    /*
     * ============================================================
     * LOGOUT
     * ============================================================
     */
    logout(): void {

        if (typeof window !== 'undefined') {

            localStorage.removeItem('token');

            localStorage.removeItem('user');
        }

        this.currentUserSubject.next(null);
    }


    /*
     * ============================================================
     * GET TOKEN
     * ============================================================
     */
    getToken(): string | null {

        if (typeof window === 'undefined') {
            return null;
        }

        return localStorage.getItem('token');
    }


    /*
     * ============================================================
     * IS LOGGED IN
     * ============================================================
     */
    isLoggedIn(): boolean {

        return !!this.getToken();
    }


    /*
     * ============================================================
     * GET CURRENT USER
     * ============================================================
     */
    getCurrentUser(): LoginResponse | null {

        return this.currentUserSubject.value;
    }


    /*
     * ============================================================
     * GET STORED USER
     * ============================================================
     */
    private getStoredUser(): LoginResponse | null {

        if (typeof window === 'undefined') {
            return null;
        }

        const user = localStorage.getItem('user');

        return user
            ? JSON.parse(user)
            : null;
    }


    // ============================================================
    // MENU APIs - KEEP YOUR EXISTING METHODS
    // ============================================================

    createMenu(menu: any): Observable<any> {

        return this.http.post(
            `${this.menuApiUrl}/create`,
            menu
        );
    }

    updateMenu(menu: any): Observable<any> {

        return this.http.post(
            `${this.menuApiUrl}/update`,
            menu
        );
    }

    deleteMenu(id: number): Observable<any> {

        return this.http.post(
            `${this.menuApiUrl}/delete/${id}`,
            {}
        );
    }

    getMenus(): Observable<any> {

        return this.http.get(
            `${this.menuApiUrl}/get-all`
        );
    }

    getMenuById(id: number): Observable<any> {

        return this.http.get(
            `${this.menuApiUrl}/get-by-id/${id}`
        );
    }


    // ============================================================
    // COMPANY APIs - KEEP YOUR EXISTING METHODS
    // ============================================================

    createCompany(company: any): Observable<any> {

        return this.http.post(
            `${this.companyApiUrl}/createcompany`,
            company
        );
    }

    updateCompany(company: any): Observable<any> {

        return this.http.post(
            `${this.companyApiUrl}/updatecompany`,
            company
        );
    }

    deleteCompany(id: number): Observable<any> {

        return this.http.post(
            `${this.companyApiUrl}/deletecompany/${id}`,
            {}
        );
    }

    getCompanies(): Observable<any> {

        return this.http.get(
            `${this.companyApiUrl}/getallcompany`
        );
    }

    getCompanyById(id: number): Observable<any> {

        return this.http.get(
            `${this.companyApiUrl}/getbyidcompany/${id}`
        );
    }


    // ============================================================
    // REGION APIs - KEEP YOUR EXISTING METHODS
    // ============================================================

    createRegion(region: any): Observable<any> {

        return this.http.post(
            `${this.companyApiUrl}/createregion`,
            region
        );
    }

    updateRegion(region: any): Observable<any> {

        return this.http.post(
            `${this.companyApiUrl}/updateregion`,
            region
        );
    }

    deleteRegion(id: number): Observable<any> {

        return this.http.post(
            `${this.companyApiUrl}/deleteregion/${id}`,
            {}
        );
    }

    getRegions(): Observable<any> {

        return this.http.get(
            `${this.companyApiUrl}/getallregion`
        );
    }

    getRegionById(id: number): Observable<any> {

        return this.http.get(
            `${this.companyApiUrl}/getbyidregion/${id}`
        );
    }
}
