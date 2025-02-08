import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    avatar?: string;
    createdAt: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    private tokenSubject = new BehaviorSubject<string | null>(null);
    
    currentUser$ = this.currentUserSubject.asObservable();
    isAuthenticated$ = this.currentUser$.pipe(map(user => !!user));
    
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'current_user';
    private readonly apiUrl = `${environment.apiUrl}/auth`;

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.loadStoredAuth();
    }

    private loadStoredAuth(): void {
        const token = localStorage.getItem(this.TOKEN_KEY);
        const userStr = localStorage.getItem(this.USER_KEY);

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                this.currentUserSubject.next(user);
                this.tokenSubject.next(token);
            } catch (error) {
                this.clearAuth();
            }
        }
    }

    login(credentials: { email: string; password: string; rememberMe?: boolean }): Observable<User> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => this.handleAuthResponse(response, credentials.rememberMe)),
            map(response => response.user),
            catchError(error => {
                console.error('Login error:', error);
                return throwError(() => new Error(this.getErrorMessage(error)));
            })
        );
    }

    register(userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        fullName: string;
    }): Observable<User> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
            tap(response => this.handleAuthResponse(response, true)),
            map(response => response.user),
            catchError(error => {
                console.error('Registration error:', error);
                return throwError(() => new Error(this.getErrorMessage(error)));
            })
        );
    }

    logout(): void {
        // Optionally call logout endpoint if needed
        this.clearAuth();
        this.router.navigate(['/auth/login']);
    }

    private handleAuthResponse(response: AuthResponse, remember: boolean = false): void {
        this.currentUserSubject.next(response.user);
        this.tokenSubject.next(response.token);

        if (remember) {
            localStorage.setItem(this.TOKEN_KEY, response.token);
            localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
        } else {
            sessionStorage.setItem(this.TOKEN_KEY, response.token);
            sessionStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
        }
    }

    private clearAuth(): void {
        this.currentUserSubject.next(null);
        this.tokenSubject.next(null);
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        sessionStorage.removeItem(this.TOKEN_KEY);
        sessionStorage.removeItem(this.USER_KEY);
    }

    getToken(): string | null {
        return this.tokenSubject.value;
    }

    private getErrorMessage(error: any): string {
        if (error.error?.message) {
            return error.error.message;
        }
        
        if (error.status === 401) {
            return 'Invalid email or password';
        }
        
        if (error.status === 409) {
            return 'An account with this email already exists';
        }
        
        return 'An unexpected error occurred. Please try again later.';
    }

    // Social Authentication Methods
    loginWithGoogle(): Observable<User> {
        // TODO: Implement Google OAuth login
        return of();
    }

    loginWithGithub(): Observable<User> {
        // TODO: Implement GitHub OAuth login
        return of();
    }
} 