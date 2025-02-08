import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Review } from '../models/review.model';

export interface ReviewsResponse {
    reviews: Review[];
    total: number;
}

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private readonly apiUrl = `${environment.apiUrl}/reviews`;

    constructor(private http: HttpClient) {}

    getReviews(params: {
        page: number;
        limit: number;
        search?: string;
        status?: string;
        sort?: string;
    }): Observable<ReviewsResponse> {
        let httpParams = new HttpParams()
            .set('page', params.page.toString())
            .set('limit', params.limit.toString());

        if (params.search) {
            httpParams = httpParams.set('search', params.search);
        }

        if (params.status) {
            httpParams = httpParams.set('status', params.status);
        }

        if (params.sort) {
            httpParams = httpParams.set('sort', params.sort);
        }

        return this.http.get<ReviewsResponse>(this.apiUrl, { params: httpParams });
    }

    getReview(id: string): Observable<Review> {
        return this.http.get<Review>(`${this.apiUrl}/${id}`);
    }

    createReview(review: Partial<Review>): Observable<Review> {
        return this.http.post<Review>(this.apiUrl, review);
    }

    updateReview(id: string, review: Partial<Review>): Observable<Review> {
        return this.http.put<Review>(`${this.apiUrl}/${id}`, review);
    }

    deleteReview(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
} 