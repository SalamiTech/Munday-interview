import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReviewService, ReviewFilters, ReviewsResponse } from '../../../../core/services/review.service';
import { Review } from '../../../../core/models/review.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastService } from '../../../../core/services/toast.service';

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
export class ReviewListComponent implements OnInit, OnDestroy {
    @Input() organizationId?: number;
    reviews: Review[] = [];
    totalReviews = 0;
    totalPages = 0;
    pageSize = 10;
    currentPage = 1;
    isLoading = false;
    error = '';
    
    searchQuery = '';
    statusFilter: 'all' | 'pending' | 'approved' | 'rejected' = 'all';
    sortBy = 'createdAt:DESC';
    private searchSubject = new Subject<string>();
    private destroy$ = new Subject<void>();

    constructor(
        private reviewService: ReviewService,
        private router: Router,
        private toastService: ToastService
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadReviews(): void {
        this.isLoading = true;
        this.error = '';

        const filters: ReviewFilters = {
            page: this.currentPage,
            limit: this.pageSize,
            keyword: this.searchQuery || undefined,
            status: this.statusFilter === 'all' ? undefined : this.statusFilter
        };

        this.reviewService.getReviews(filters)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response: ReviewsResponse) => {
                    this.reviews = response.items;
                    this.totalReviews = response.total;
                    this.totalPages = response.totalPages;
                    this.isLoading = false;
                },
                error: (error) => {
                    this.toastService.error('Failed to load reviews');
                    this.isLoading = false;
                }
            });
    }

    onSearch(query: string): void {
        this.searchQuery = query;
        this.currentPage = 1;
        this.loadReviews();
    }

    onStatusChange(status: 'all' | 'pending' | 'approved' | 'rejected'): void {
        this.statusFilter = status;
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
            this.reviewService.deleteReview(review.id, Number(review.organizationId))
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.reviews = this.reviews.filter(r => r.id !== review.id);
                        this.totalReviews--;
                        this.toastService.success('Review deleted successfully');
                    },
                    error: (error) => {
                        this.toastService.error('Failed to delete review');
                    }
                });
        }
    }

    onMarkHelpful(review: Review): void {
        this.reviewService.markHelpful(review.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    const updatedReview = { ...review, helpfulCount: review.helpfulCount + 1 };
                    this.reviews = this.reviews.map(r => r.id === review.id ? updatedReview : r);
                },
                error: (error) => {
                    this.toastService.error('Failed to mark review as helpful');
                }
            });
    }

    onReportReview(review: Review): void {
        const reason = prompt('Please provide a reason for reporting this review:');
        if (reason) {
            this.reviewService.reportReview(review.id, reason)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        const updatedReview = { ...review, reportCount: review.reportCount + 1 };
                        this.reviews = this.reviews.map(r => r.id === review.id ? updatedReview : r);
                        this.toastService.success('Review reported successfully');
                    },
                    error: (error) => {
                        this.toastService.error('Failed to report review');
                    }
                });
        }
    }

    getStatusClass(status: string): string {
        return `status-chip ${status.toLowerCase()}`;
    }
} 