import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReviewService } from '../../../../core/services/review.service';
import { OrganizationService } from '../../../../core/services/organization.service';
import { Review } from '../../../../core/models/review.model';
import { Organization } from '../../../../core/models/organization.model';
import { Subject, takeUntil, catchError } from 'rxjs';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-dashboard-home',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard-home.component.html',
    styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
    recentReviews: Review[] = [];
    topOrganizations: Organization[] = [];
    reviewStats: {
        totalReviews: number;
        averageRating: number;
        ratingDistribution: { [key: number]: number };
    } = {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        }
    };
    isLoading = true;
    error = '';

    private destroy$ = new Subject<void>();

    constructor(
        private reviewService: ReviewService,
        private organizationService: OrganizationService
    ) {}

    ngOnInit(): void {
        this.loadDashboardData();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadDashboardData(): void {
        this.isLoading = true;
        this.error = '';

        forkJoin({
            reviews: this.reviewService.getReviews({ 
                page: 1, 
                limit: 5,
                sort: 'createdAt:desc',
                status: 'approved'
            }),
            organizations: this.organizationService.getTopOrganizations(5),
            stats: this.reviewService.getReviewStats()
        }).pipe(
            takeUntil(this.destroy$),
            catchError(error => {
                console.error('Error loading dashboard data:', error);
                this.error = 'Failed to load dashboard data. Please try again.';
                this.isLoading = false;
                throw error;
            })
        ).subscribe({
            next: (data: any) => {  // Type as any temporarily to handle response structure
                this.recentReviews = data.reviews.items;
                this.topOrganizations = Array.isArray(data.organizations) ? data.organizations : 
                    (data.organizations?.organizations || []);
                this.reviewStats = data.stats?.stats || data.stats || this.reviewStats;
                this.isLoading = false;
            },
            error: () => {
                // Error already handled in catchError
            }
        });
    }

    getRatingPercentage(rating: number): number {
        if (!this.reviewStats.totalReviews) return 0;
        const count = this.reviewStats.ratingDistribution[rating] || 0;
        return (count / this.reviewStats.totalReviews) * 100;
    }

    getAverageRatingColor(): string {
        const rating = this.reviewStats.averageRating;
        if (rating >= 4) return 'success';
        if (rating >= 3) return 'warning';
        return 'error';
    }

    getAverageRatingIcon(): string {
        const rating = this.reviewStats.averageRating;
        if (rating >= 4) return 'trending_up';
        if (rating >= 3) return 'trending_flat';
        return 'trending_down';
    }

    getAverageRatingText(): string {
        const rating = this.reviewStats.averageRating;
        if (rating >= 4) return 'Excellent ratings';
        if (rating >= 3) return 'Good ratings';
        if (rating > 0) return 'Needs improvement';
        return 'No ratings yet';
    }

    getStarArray(rating: number = 0): ('full' | 'empty')[] {
        const roundedRating = Math.round(rating);
        return Array(5).fill('empty').map((_, index) => 
            index < roundedRating ? 'full' : 'empty'
        );
    }

    getOrgInitials(name: string): string {
        return name
            .split(' ')
            .map(word => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }

    truncateText(text: string, maxLength: number = 150): string {
        if (!text) return '';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    }
} 