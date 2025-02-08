import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../../../core/services/review.service';
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
    sortBy = 'createdAt:DESC';
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
            next: (response) => {
                this.reviews = response.items;
                this.totalReviews = response.total;
                this.totalPages = response.totalPages;
                this.isLoading = false;
            },
            error: (error) => {
                this.error = error.message;
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
                error: (error) => {
                    this.error = error.message;
                }
            });
        }
    }

    onMarkHelpful(review: Review): void {
        this.reviewService.markHelpful(review.id).subscribe({
            next: () => {
                this.loadReviews();
            },
            error: (error) => {
                this.error = error.message;
            }
        });
    }

    onReportReview(review: Review): void {
        const reason = prompt('Please provide a reason for reporting this review:');
        if (reason) {
            this.reviewService.reportReview(review.id, reason).subscribe({
                next: () => {
                    this.loadReviews();
                },
                error: (error) => {
                    this.error = error.message;
                }
            });
        }
    }

    getStatusClass(status: string): string {
        return `status-chip ${status.toLowerCase()}`;
    }
} 