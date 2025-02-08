import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    get<T>(path: string, params: any = {}): Observable<T> {
        let httpParams = new HttpParams();
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                httpParams = httpParams.set(key, params[key].toString());
            }
        });

        return this.http.get<T>(`${this.apiUrl}${path}`, { params: httpParams })
            .pipe(catchError(this.handleError));
    }

    post<T>(path: string, body: any = {}): Observable<T> {
        return this.http.post<T>(`${this.apiUrl}${path}`, body)
            .pipe(catchError(this.handleError));
    }

    put<T>(path: string, body: any = {}): Observable<T> {
        return this.http.put<T>(`${this.apiUrl}${path}`, body)
            .pipe(catchError(this.handleError));
    }

    delete<T>(path: string): Observable<T> {
        return this.http.delete<T>(`${this.apiUrl}${path}`)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = error.error.message;
        } else {
            // Server-side error
            errorMessage = error.error?.message || error.message;
        }

        return throwError(() => new Error(errorMessage));
    }
} 