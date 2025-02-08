import { inject } from '@angular/core';
import { Router, type CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.isAuthenticated$.pipe(
        map(isAuthenticated => {
            if (isAuthenticated) {
                return true;
            }
            
            // Store the attempted URL for redirecting
            const returnUrl = state.url;
            router.navigate(['/auth/login'], {
                queryParams: { returnUrl }
            });
            return false;
        })
    );
};

export class AuthGuard {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this.authService.isAuthenticated$.pipe(
            take(1),
            map(isAuthenticated => {
                if (isAuthenticated) {
                    return true;
                }
                
                // Store the attempted URL for redirecting
                const currentUrl = this.router.routerState.snapshot.url;
                return this.router.createUrlTree(['/auth/login'], {
                    queryParams: { returnUrl: currentUrl }
                });
            })
        );
    }

    canActivateChild(): Observable<boolean | UrlTree> {
        return this.canActivate();
    }
} 