import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                loadComponent: () => import('./components/dashboard-home/dashboard-home.component')
                    .then(m => m.DashboardHomeComponent),
                title: 'Dashboard - Munday Reviews'
            }
        ]
    }
]; 