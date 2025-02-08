import { Routes } from '@angular/router';

export const REVIEWS_ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                loadComponent: () => import('./components/review-list/review-list.component')
                    .then(m => m.ReviewListComponent),
                title: 'Reviews - Munday Reviews'
            },
            {
                path: 'create',
                loadComponent: () => import('./components/review-form/review-form.component')
                    .then(m => m.ReviewFormComponent),
                title: 'Create Review - Munday Reviews'
            },
            {
                path: 'edit/:id',
                loadComponent: () => import('./components/review-form/review-form.component')
                    .then(m => m.ReviewFormComponent),
                title: 'Edit Review - Munday Reviews'
            }
        ]
    }
]; 