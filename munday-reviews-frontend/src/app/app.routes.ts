import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './core/components/layout/layout.component';
import { NotFoundComponent } from './core/components/error-pages/not-found/not-found.component';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes')
            .then(m => m.AUTH_ROUTES)
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./features/dashboard/dashboard.routes')
                    .then(m => m.DASHBOARD_ROUTES)
            },
            {
                path: 'reviews',
                loadChildren: () => import('./features/reviews/reviews.routes')
                    .then(m => m.REVIEWS_ROUTES)
            },
            {
                path: 'organizations',
                loadChildren: () => import('./features/organizations/organizations.routes')
                    .then(m => m.ORGANIZATION_ROUTES)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '404',
        component: NotFoundComponent
    },
    {
        path: '**',
        redirectTo: '404'
    }
]; 