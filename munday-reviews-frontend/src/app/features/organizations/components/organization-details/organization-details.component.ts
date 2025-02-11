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
import { ReviewListComponent } from '../../../reviews/components/review-list/review-list.component';

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
        RatingChartComponent,
        ReviewListComponent
    ],
    templateUrl: './organization-details.component.html',
    styleUrls: ['./organization-details.component.scss']
})
export class OrganizationDetailsComponent implements OnInit, OnDestroy {
    organization: Organization | null = null;
    reviews: Review[] = [];
    isLoading = true;
    error = '';
    ratingDistribution: { [key: number]: number } = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
    };
    canEdit = false;
    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private organizationService: OrganizationService,
        private reviewService: ReviewService,
        private webSocketService: WebSocketService
    ) {}

    ngOnInit(): void {
        this.route.params
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                if (params['id']) {
                    this.loadOrganization(params['id']);
                    this.setupWebSocket(params['id']);
                }
            });
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

    loadOrganization(id: string): void {
        this.isLoading = true;
        this.error = '';

        this.organizationService.getOrganization(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (org) => {
                    this.organization = org;
                    this.isLoading = false;
                    // Check if user can edit (implement your logic here)
                    this.canEdit = true; // Temporary, replace with actual auth check
                },
                error: (err) => {
                    this.error = 'Failed to load organization details';
                    this.isLoading = false;
                    console.error('Error loading organization:', err);
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
            this.router.navigate(['/reviews/create'], {
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

    getOrgInitials(name: string): string {
        return name
            .split(' ')
            .map(word => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }

    onEdit(): void {
        if (this.organization) {
            this.router.navigate(['/organizations', this.organization.id, 'edit']);
        }
    }

    retryLoad(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadOrganization(id);
        }
    }
} 