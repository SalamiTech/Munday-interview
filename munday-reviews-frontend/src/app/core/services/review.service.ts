import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Review } from '../models/review.model';

export interface ReviewsResponse {
    items: Review[];
    total: number;
    currentPage: number;
    totalPages: number;
    limit: number;
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

    constructor(private apiService: ApiService) {}

    getReviews(params: {
        page?: number;
        limit?: number;
        search?: string;
        organizationId?: number;
        status?: string;
        sort?: string;
    }): Observable<ReviewsResponse> {
        return this.apiService.get<ReviewsResponse>(this.path, params);
    }

    getReview(id: string): Observable<Review> {
        return this.apiService.get<Review>(`${this.path}/${id}`);
    }

    createReview(review: {
        organizationId: number;
        title?: string;
        content: string;
        rating: number;
        pros?: string[];
        cons?: string[];
        isAnonymous?: boolean;
    }): Observable<Review> {
        return this.apiService.post<Review>(this.path, review);
    }

    updateReview(id: string, review: Partial<Review>): Observable<Review> {
        return this.apiService.put<Review>(`${this.path}/${id}`, review);
    }

    deleteReview(id: string): Observable<void> {
        return this.apiService.delete<void>(`${this.path}/${id}`);
    }

    markHelpful(id: string): Observable<Review> {
        return this.apiService.post<Review>(`${this.path}/${id}/helpful`);
    }

    reportReview(id: string, reason: string): Observable<Review> {
        return this.apiService.post<Review>(`${this.path}/${id}/report`, { reason });
    }

    getReviewStats(organizationId?: number): Observable<ReviewStats> {
        const params = organizationId ? { organizationId } : {};
        return this.apiService.get<ReviewStats>(`${this.path}/stats`, params);
    }
} 