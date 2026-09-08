import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';


@Service()

export class Api {

    private http = inject(HttpClient);

    get<T>(url: string): Observable<T> {
        return this.http.get<T>(url);
    }

    post<T>(
        url: string,
        payload: any
    ): Observable<T> {
        return this.http.post<T>(
            url,
            payload
        );
    }

    put<T>(
        url: string,
        payload: any
    ): Observable<T> {
        return this.http.put<T>(
            url,
            payload
        );
    }

    delete<T>(
        url: string
    ): Observable<T> {
        return this.http.delete<T>(url);
    }
}
