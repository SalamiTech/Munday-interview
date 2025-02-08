import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: 'login',
                loadComponent: () => import('./components/login/login.component')
                    .then(m => m.LoginComponent),
                title: 'Sign In - Munday Reviews'
            },
            {
                path: 'register',
                loadComponent: () => import('./components/register/register.component')
                    .then(m => m.RegisterComponent),
                title: 'Create Account - Munday Reviews'
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ]
    }
]; 