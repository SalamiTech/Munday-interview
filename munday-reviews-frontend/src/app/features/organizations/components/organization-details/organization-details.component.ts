import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Organization } from '../../../../core/models/organization.model';
import { Review } from '../../../../core/models/review.model';
import { OrganizationService } from '../../../../core/services/organization.service';
import { ReviewService } from '../../../../core/services/review.service';
import { WebSocketService } from '../../../../core/services/websocket.service';
import { RatingChartComponent } from '../../../dashboard/components/rating-chart/rating-chart.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil, map } from 'rxjs';

interface WebSocketEvents {
    reviewCreated: Review;
    reviewUpdated: Review;
    reviewDeleted: string;
    organizationUpdated: Organization;
}

@Component({
    selector: 'app-organization-details',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        RatingChartComponent
    ],
    templateUrl: './organization-details.component.html',
    styleUrls: ['./organization-details.component.scss']
})
export class OrganizationDetailsComponent implements OnInit, OnDestroy {
    organization: Organization | null = null;
    reviews: Review[] = [];
    isLoading = false;
    error = '';
    ratingDistribution: { [key: number]: number } = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
    };
    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private organizationService: OrganizationService,
        private reviewService: ReviewService,
        private webSocketService: WebSocketService
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) {
            this.router.navigate(['/organizations']);
            return;
        }
        this.loadOrganizationData(id);
        this.setupWebSocket(id);
    }

    ngOnDestroy(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.webSocketService.emit('leaveOrganization', id);
        }
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupWebSocket(organizationId: string): void {
        // Join organization room
        this.webSocketService.emit('joinOrganization', organizationId);

        // Listen for review updates
        this.webSocketService.on<WebSocketEvents['reviewCreated']>('reviewCreated')
            .pipe(
                takeUntil(this.destroy$),
                map(review => review as Review)
            )
            .subscribe(review => {
                if (review.organizationId === this.organization?.id) {
                    this.reviews = [review, ...this.reviews];
                    this.updateOrganizationStats();
                }
            });

        this.webSocketService.on<WebSocketEvents['reviewUpdated']>('reviewUpdated')
            .pipe(
                takeUntil(this.destroy$),
                map(review => review as Review)
            )
            .subscribe(updatedReview => {
                const index = this.reviews.findIndex(r => r.id === updatedReview.id);
                if (index !== -1) {
                    this.reviews[index] = updatedReview;
                    this.updateOrganizationStats();
                }
            });

        this.webSocketService.on<WebSocketEvents['reviewDeleted']>('reviewDeleted')
            .pipe(
                takeUntil(this.destroy$),
                map(id => id as string)
            )
            .subscribe(reviewId => {
                this.reviews = this.reviews.filter(r => r.id !== reviewId);
                this.updateOrganizationStats();
            });

        this.webSocketService.on<WebSocketEvents['organizationUpdated']>('organizationUpdated')
            .pipe(
                takeUntil(this.destroy$),
                map(org => org as Organization)
            )
            .subscribe(updatedOrg => {
                if (updatedOrg.id === this.organization?.id) {
                    this.organization = updatedOrg;
                }
            });
    }

    private updateOrganizationStats(): void {
        if (!this.organization) return;

        // Reset rating distribution
        this.ratingDistribution = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        };

        // Calculate new rating distribution
        this.reviews.forEach(review => {
            this.ratingDistribution[review.rating]++;
        });

        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = this.reviews.length ? totalRating / this.reviews.length : 0;

        this.organization = {
            ...this.organization,
            averageRating,
            reviewCount: this.reviews.length
        };
    }

    loadOrganizationData(id: string): void {
        this.isLoading = true;
        this.error = '';
        
        this.organizationService.getOrganization(id).subscribe({
            next: (organization) => {
                this.organization = organization;
                const orgId = parseInt(id, 10);
                if (isNaN(orgId)) {
                    this.error = 'Invalid organization ID format';
                    this.isLoading = false;
                    return;
                }
                this.loadReviews(orgId);
            },
            error: (error: HttpErrorResponse) => {
                this.error = 'Failed to load organization details. Please try again.';
                this.isLoading = false;
            }
        });
    }

    loadReviews(organizationId: number): void {
        this.reviewService.getReviews({ 
            organizationId,
            limit: 10,
            sort: 'createdAt:DESC'
        }).subscribe({
            next: (response: { items: Review[] }) => {
                this.reviews = response.items;
                this.updateOrganizationStats();
                this.isLoading = false;
            },
            error: (error: HttpErrorResponse) => {
                this.error = 'Failed to load reviews. Please try again.';
                this.isLoading = false;
            }
        });
    }

    onWriteReview(): void {
        if (this.organization) {
            this.router.navigate(['/reviews/new'], {
                queryParams: { organizationId: this.organization.id }
            });
        }
    }

    onShare(): void {
        if (this.organization) {
            const url = window.location.href;
            if (navigator.share) {
                navigator.share({
                    title: this.organization.name,
                    text: `Check out ${this.organization.name} on Munday Reviews`,
                    url: url
                }).catch((error: Error) => console.log('Error sharing:', error));
            } else {
                navigator.clipboard.writeText(url)
                    .then(() => alert('Link copied to clipboard!'))
                    .catch((error: Error) => console.log('Error copying to clipboard:', error));
            }
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