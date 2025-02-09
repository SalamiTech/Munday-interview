import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { ReviewService, ReviewFilters, ReviewStats } from '../../../../core/services/review.service';
import { OrganizationService } from '../../../../core/services/organization.service';
import { Review } from '../../../../core/models/review.model';
import { Organization } from '../../../../core/models/organization.model';
import { RatingChartComponent } from '../rating-chart/rating-chart.component';

@Component({
    selector: 'app-dashboard-home',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        RatingChartComponent
    ],
    templateUrl: './dashboard-home.component.html',
    styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
    recentReviews: Review[] = [];
    topOrganizations: Organization[] = [];
    reviewStats: ReviewStats = {
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

    filterForm: FormGroup;
    currentPage = 1;
    pageSize = 10;
    totalPages = 1;
    hasMore = false;

    private destroy$ = new Subject<void>();

    constructor(
        private reviewService: ReviewService,
        private organizationService: OrganizationService,
        private fb: FormBuilder
    ) {
        this.filterForm = this.fb.group({
            startDate: [''],
            endDate: [''],
            minRating: [''],
            maxRating: [''],
            keyword: [''],
            status: ['approved']
        });
    }

    ngOnInit(): void {
        this.setupFilterSubscription();
        this.setupReviewStatsSubscription();
        this.loadTopOrganizations();
        this.loadReviews();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupFilterSubscription(): void {
        this.filterForm.valueChanges.pipe(
            takeUntil(this.destroy$),
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(() => {
            this.currentPage = 1;
            this.loadReviews();
        });
    }

    private setupReviewStatsSubscription(): void {
        this.reviewService.reviewStats$
            .pipe(takeUntil(this.destroy$))
            .subscribe(stats => {
                this.reviewStats = stats;
            });
    }

    loadReviews(page: number = this.currentPage): void {
        this.isLoading = true;
        this.error = '';

        const filters: ReviewFilters = {
            ...this.filterForm.value,
            page,
            limit: this.pageSize
        };

        this.reviewService.getReviews(filters)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.recentReviews = response.items;
                    this.totalPages = response.totalPages;
                    this.hasMore = response.hasMore;
                    this.currentPage = response.page;
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error loading reviews:', error);
                    this.error = 'Failed to load reviews. Please try again.';
                    this.isLoading = false;
                }
            });
    }

    private loadTopOrganizations(): void {
        this.organizationService.getTopOrganizations(5)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (organizations) => {
                    this.topOrganizations = organizations;
                },
                error: (error) => {
                    console.error('Error loading top organizations:', error);
                }
            });
    }

    loadMore(): void {
        if (this.hasMore) {
            this.loadReviews(this.currentPage + 1);
        }
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

    getOrgInitials(name: string): string {
        return name
            .split(' ')
            .map(word => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }

    resetFilters(): void {
        this.filterForm.reset({
            status: 'approved'
        });
    }

    markHelpful(reviewId: string): void {
        this.reviewService.markHelpful(reviewId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (updatedReview) => {
                    this.recentReviews = this.recentReviews.map(review =>
                        review.id === updatedReview.id ? updatedReview : review
                    );
                },
                error: (error) => {
                    console.error('Error marking review as helpful:', error);
                }
            });
    }

    reportReview(reviewId: string): void {
        // In a real application, you might want to show a dialog to get the reason
        const reason = 'inappropriate content';
        this.reviewService.reportReview(reviewId, reason)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (updatedReview) => {
                    this.recentReviews = this.recentReviews.map(review =>
                        review.id === updatedReview.id ? updatedReview : review
                    );
                },
                error: (error) => {
                    console.error('Error reporting review:', error);
                }
            });
    }
} 