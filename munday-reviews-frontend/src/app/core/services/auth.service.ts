import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

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

    constructor(
        private apiService: ApiService,
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
        return this.apiService.post<AuthResponse>('/auth/login', credentials)
            .pipe(
                map(response => {
                    this.handleAuthResponse(response, credentials.rememberMe);
                    return response.user;
                })
            );
    }

    register(userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }): Observable<User> {
        return this.apiService.post<AuthResponse>('/auth/register', userData)
            .pipe(
                map(response => {
                    this.handleAuthResponse(response);
                    return response.user;
                })
            );
    }

    logout(): void {
        this.clearAuth();
        this.router.navigate(['/auth/login']);
    }

    private handleAuthResponse(response: AuthResponse, remember: boolean = false): void {
        const { user, token } = response;
        
        if (remember) {
            localStorage.setItem(this.TOKEN_KEY, token);
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        } else {
            sessionStorage.setItem(this.TOKEN_KEY, token);
            sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
        }

        this.currentUserSubject.next(user);
        this.tokenSubject.next(token);
    }

    private clearAuth(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        sessionStorage.removeItem(this.TOKEN_KEY);
        sessionStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
        this.tokenSubject.next(null);
    }

    getToken(): string | null {
        return this.tokenSubject.value;
    }

    loginWithGoogle(): Observable<User> {
        // TODO: Implement Google OAuth login
        return this.apiService.get<AuthResponse>('/auth/google')
            .pipe(map(response => {
                this.handleAuthResponse(response);
                return response.user;
            }));
    }

    loginWithGithub(): Observable<User> {
        // TODO: Implement GitHub OAuth login
        return this.apiService.get<AuthResponse>('/auth/github')
            .pipe(map(response => {
                this.handleAuthResponse(response);
                return response.user;
            }));
    }
} 