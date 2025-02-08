import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReviewService } from '../../../../core/services/review.service';
import { OrganizationService } from '../../../../core/services/organization.service';
import { Review } from '../../../../core/models/review.model';
import { Organization } from '../../../../core/models/organization.model';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-dashboard-home',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard-home.component.html',
    styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {
    recentReviews: Review[] = [];
    topOrganizations: Organization[] = [];
    reviewStats: {
        totalReviews: number;
        averageRating: number;
        ratingDistribution: { [key: number]: number };
    } = {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: {}
    };
    isLoading = true;
    error = '';

    constructor(
        private reviewService: ReviewService,
        private organizationService: OrganizationService
    ) {}

    ngOnInit(): void {
        this.loadDashboardData();
    }

    private loadDashboardData(): void {
        this.isLoading = true;
        this.error = '';

        forkJoin({
            reviews: this.reviewService.getReviews({ 
                page: 1, 
                limit: 5,
                sort: 'createdAt:DESC'
            }),
            organizations: this.organizationService.getTopOrganizations(5),
            stats: this.reviewService.getReviewStats()
        }).subscribe({
            next: (data) => {
                this.recentReviews = data.reviews.items;
                this.topOrganizations = data.organizations;
                this.reviewStats = data.stats;
                this.isLoading = false;
            },
            error: (error) => {
                this.error = error.message;
                this.isLoading = false;
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
} 