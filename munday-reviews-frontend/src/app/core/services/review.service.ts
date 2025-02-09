import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { WebSocketService } from './websocket.service';
import { Review } from '../models/review.model';

export interface ReviewFilters {
    startDate?: string;
    endDate?: string;
    minRating?: number;
    maxRating?: number;
    keyword?: string;
    status?: 'pending' | 'approved' | 'rejected';
    organizationId?: number;
    page?: number;
    limit?: number;
    sort?: string;
}

export interface ReviewsResponse {
    items: Review[];
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
}

export interface ReviewStats {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
}

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private readonly path = '/reviews';
    private reviewStatsSubject = new BehaviorSubject<ReviewStats>({
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    });
    private organizationStatsSubject = new Map<number, BehaviorSubject<ReviewStats>>();

    reviewStats$ = this.reviewStatsSubject.asObservable();

    constructor(
        private apiService: ApiService,
        private webSocketService: WebSocketService
    ) {
        this.setupWebSocketListeners();
    }

    private setupWebSocketListeners(): void {
        // Global stats updates
        this.webSocketService.on<ReviewStats>('statsUpdate')
            .subscribe(stats => {
                this.reviewStatsSubject.next(stats);
            });

        // Organization-specific stats updates
        this.webSocketService.on<{ organizationId: number; stats: ReviewStats }>('orgStatsUpdate')
            .subscribe(({ organizationId, stats }) => {
                if (!this.organizationStatsSubject.has(organizationId)) {
                    this.organizationStatsSubject.set(
                        organizationId,
                        new BehaviorSubject<ReviewStats>({
                            totalReviews: 0,
                            averageRating: 0,
                            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                        })
                    );
                }
                this.organizationStatsSubject.get(organizationId)?.next(stats);
            });
    }

    getOrganizationStats$(organizationId: number): Observable<ReviewStats> {
        if (!this.organizationStatsSubject.has(organizationId)) {
            this.organizationStatsSubject.set(
                organizationId,
                new BehaviorSubject<ReviewStats>({
                    totalReviews: 0,
                    averageRating: 0,
                    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                })
            );
            this.webSocketService.emit('joinOrganization', organizationId.toString());
        }
        return this.organizationStatsSubject.get(organizationId)!.asObservable();
    }

    getReviews(filters: ReviewFilters): Observable<ReviewsResponse> {
        return this.apiService.get<ReviewsResponse>(this.path, filters);
    }

    getReview(id: string): Observable<Review> {
        return this.apiService.get<Review>(`${this.path}/${id}`);
    }

    createReview(review: {
        organizationId: number;
        title: string;
        content: string;
        rating: number;
        pros?: string[];
        cons?: string[];
        isAnonymous?: boolean;
    }): Observable<Review> {
        return this.apiService.post<Review>(this.path, review)
            .pipe(
                tap(createdReview => {
                    this.webSocketService.emit('reviewCreated', createdReview);
                })
            );
    }

    updateReview(id: string, review: Partial<Review>): Observable<Review> {
        return this.apiService.patch<Review>(`${this.path}/${id}`, review)
            .pipe(
                tap(updatedReview => {
                    this.webSocketService.emit('reviewUpdated', updatedReview);
                })
            );
    }

    deleteReview(id: string, organizationId: number): Observable<void> {
        return this.apiService.delete<void>(`${this.path}/${id}`)
            .pipe(
                tap(() => {
                    this.webSocketService.emit('reviewDeleted', { reviewId: id, organizationId });
                })
            );
    }

    markHelpful(id: string): Observable<Review> {
        return this.apiService.post<Review>(`${this.path}/${id}/helpful`)
            .pipe(
                tap(updatedReview => {
                    this.webSocketService.emit('reviewUpdated', updatedReview);
                })
            );
    }

    reportReview(id: string, reason: string): Observable<Review> {
        return this.apiService.post<Review>(`${this.path}/${id}/report`, { reason })
            .pipe(
                tap(updatedReview => {
                    this.webSocketService.emit('reviewUpdated', updatedReview);
                })
            );
    }

    getReviewStats(organizationId?: number): Observable<ReviewStats> {
        const params = organizationId ? { organizationId } : {};
        return this.apiService.get<ReviewStats>(`${this.path}/stats`, params)
            .pipe(
                tap(stats => {
                    if (organizationId) {
                        this.organizationStatsSubject.get(organizationId)?.next(stats);
                    } else {
                        this.reviewStatsSubject.next(stats);
                    }
                })
            );
    }

    leaveOrganization(organizationId: number): void {
        this.webSocketService.emit('leaveOrganization', organizationId.toString());
        this.organizationStatsSubject.delete(organizationId);
    }
} 