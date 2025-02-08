import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReviewService, ReviewsResponse } from '../../../../core/services/review.service';
import { Review } from '../../../../core/models/review.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
    selector: 'app-review-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule
    ],
    templateUrl: './review-list.component.html',
    styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent implements OnInit {
    reviews: Review[] = [];
    totalReviews = 0;
    totalPages = 0;
    pageSize = 10;
    currentPage = 1;
    isLoading = false;
    error = '';
    
    searchQuery = '';
    statusFilter = '';
    sortBy = 'date';
    private searchSubject = new Subject<string>();

    constructor(
        private reviewService: ReviewService,
        private router: Router
    ) {
        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(query => {
            this.searchQuery = query;
            this.currentPage = 1;
            this.loadReviews();
        });
    }

    ngOnInit(): void {
        this.loadReviews();
    }

    loadReviews(): void {
        this.isLoading = true;
        this.error = '';

        const params = {
            page: this.currentPage,
            limit: this.pageSize,
            search: this.searchQuery,
            status: this.statusFilter,
            sort: this.sortBy
        };

        this.reviewService.getReviews(params).subscribe({
            next: (response: ReviewsResponse) => {
                this.reviews = response.reviews;
                this.totalReviews = response.total;
                this.totalPages = Math.ceil(response.total / this.pageSize);
                this.isLoading = false;
            },
            error: (error: Error) => {
                this.error = error.message || 'Failed to load reviews';
                this.isLoading = false;
            }
        });
    }

    onSearch(query: string): void {
        this.searchSubject.next(query);
    }

    onFilterChange(): void {
        this.currentPage = 1;
        this.loadReviews();
    }

    onPageChange(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.loadReviews();
        }
    }

    onCreateReview(): void {
        this.router.navigate(['/reviews/create']);
    }

    onEditReview(review: Review): void {
        this.router.navigate(['/reviews/edit', review.id]);
    }

    onDeleteReview(review: Review): void {
        if (confirm('Are you sure you want to delete this review?')) {
            this.reviewService.deleteReview(review.id).subscribe({
                next: () => {
                    this.loadReviews();
                },
                error: (error: Error) => {
                    this.error = error.message || 'Failed to delete review';
                }
            });
        }
    }

    getStatusClass(status: string): string {
        return `status-chip ${status.toLowerCase()}`;
    }
} 