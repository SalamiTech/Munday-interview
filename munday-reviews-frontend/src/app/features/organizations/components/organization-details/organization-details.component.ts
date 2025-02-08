import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Organization } from '../../../../core/models/organization.model';
import { Review } from '../../../../core/models/review.model';
import { OrganizationService } from '../../../../core/services/organization.service';
import { ReviewService } from '../../../../core/services/review.service';

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
        private router: Router,
        private organizationService: OrganizationService,
        private reviewService: ReviewService
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) {
            this.router.navigate(['/organizations']);
            return;
        }
        this.loadOrganizationData(id);
    }

    loadOrganizationData(id: string): void {
        this.isLoading = true;
        this.error = '';
        
        this.organizationService.getOrganization(id).subscribe({
            next: (organization) => {
                this.organization = organization;
                this.loadReviews(parseInt(id));
            },
            error: (error) => {
                this.error = error.message;
                this.isLoading = false;
            }
        });
    }

    loadReviews(organizationId: number): void {
        this.reviewService.getReviews({ 
            organizationId,
            limit: 5,
            sort: 'createdAt:DESC'
        }).subscribe({
            next: (response) => {
                this.reviews = response.items;
                this.isLoading = false;
            },
            error: (error) => {
                this.error = error.message;
                this.isLoading = false;
            }
        });
    }

    onWriteReview(): void {
        if (this.organization?.id) {
            this.router.navigate(['/reviews/create'], {
                queryParams: { organizationId: parseInt(this.organization.id) }
            });
        }
    }

    getAverageRating(): number {
        return this.organization?.averageRating || 0;
    }

    isStarFilled(star: number): boolean {
        return (this.organization?.averageRating || 0) >= star;
    }

    getStarDisplay(star: number): string {
        return this.isStarFilled(star) ? '★' : '☆';
    }

    getUserName(review: Review): string {
        return review.user?.fullName || 'Anonymous';
    }
} 