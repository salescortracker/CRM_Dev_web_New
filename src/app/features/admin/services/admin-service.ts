import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../core/authentication/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // ================= BUSINESS HOUR =================

  // CREATE BUSINESS HOUR
  createBusinessHour(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/Admin/createbusinesshour`,
      data
    );
  }

  // UPDATE BUSINESS HOUR
  updateBusinessHour(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/Admin/updatebusinesshour`,
      data
    );
  }

  // DELETE BUSINESS HOUR
  deleteBusinessHour(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/Admin/deletebusinesshour/${id}`,
      {}
    );
  }

  // GET ALL BUSINESS HOURS
  getBusinessHours(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/Admin/getallbusinesshour`
    );
  }

  // GET BUSINESS HOUR BY ID
  getBusinessHourById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/Admin/getbybusinesshour/${id}`
    );
  }

  // ================= HOLIDAY CALENDAR =================

  // CREATE HOLIDAY CALENDAR
  createHolidayCalendar(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/Admin/createholidaycalendar`,
      data
    );
  }

  // UPDATE HOLIDAY CALENDAR
  updateHolidayCalendar(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/Admin/updateholidaycalendar`,
      data
    );
  }

  // DELETE HOLIDAY CALENDAR
  deleteHolidayCalendar(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/Admin/deleteholidaycalendar/${id}`,
      {}
    );
  }

  // GET ALL HOLIDAY CALENDARS
  getHolidayCalendars(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/Admin/getallholidaycalendar`
    );
  }

  // GET HOLIDAY CALENDAR BY ID
  getHolidayCalendarById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/Admin/getbyholidaycalendar/${id}`
    );
  }
}
