import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Organization } from '../../../../core/models/organization.model';
import { Review } from '../../../../core/models/review.model';

@Component({
    selector: 'app-organization-details',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule
    ],
    templateUrl: './organization-details.component.html',
    styleUrls: ['./organization-details.component.scss']
})
export class OrganizationDetailsComponent implements OnInit {
    organization: Organization | null = null;
    reviews: Review[] = [];
    isLoading = false;
    error = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) {
            this.router.navigate(['/organizations']);
            return;
        }
        this.loadOrganization(id);
    }

    private loadOrganization(id: string): void {
        // TODO: Implement with OrganizationService
        this.isLoading = true;
        this.error = '';
        
        // Mock data for now
        setTimeout(() => {
            this.organization = {
                id,
                name: 'Tech Corp',
                description: 'Leading provider of innovative technology solutions.',
                industry: 'Technology',
                location: 'San Francisco, CA',
                employeeCount: 5000,
                averageRating: 4.5,
                totalReviews: 156,
                status: 'active',
                createdAt: new Date('2023-01-15')
            };
            this.loadReviews(id);
        }, 1000);
    }

    private loadReviews(organizationId: string): void {
        // TODO: Implement with ReviewService
        setTimeout(() => {
            this.reviews = [
                {
                    id: '1',
                    content: 'Great company culture and work-life balance.',
                    rating: 5,
                    status: 'approved',
                    organizationId,
                    organizationName: 'Tech Corp',
                    userId: 'user1',
                    userName: 'John Doe',
                    createdAt: new Date('2024-01-15')
                }
            ];
            this.isLoading = false;
        }, 500);
    }

    onWriteReview(): void {
        this.router.navigate(['/reviews/create'], {
            queryParams: { organizationId: this.organization?.id }
        });
    }
} 