import { Routes } from '@angular/router';

export const ORGANIZATION_ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                loadComponent: () => import('./components/organization-list/organization-list.component')
                    .then(m => m.OrganizationListComponent),
                title: 'Organizations - Munday Reviews'
            },
            {
                path: 'create',
                loadComponent: () => import('./components/organization-form/organization-form.component')
                    .then(m => m.OrganizationFormComponent),
                title: 'Create Organization - Munday Reviews'
            },
            {
                path: 'edit/:id',
                loadComponent: () => import('./components/organization-form/organization-form.component')
                    .then(m => m.OrganizationFormComponent),
                title: 'Edit Organization - Munday Reviews'
            },
            {
                path: ':id',
                loadComponent: () => import('./components/organization-details/organization-details.component')
                    .then(m => m.OrganizationDetailsComponent),
                title: 'Organization Details - Munday Reviews'
            }
        ]
    }
]; 