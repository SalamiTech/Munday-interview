import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Organization } from '../models/organization.model';

export interface OrganizationsResponse {
    items: Organization[];
    total: number;
    currentPage: number;
    totalPages: number;
    limit: number;
}

export interface OrganizationStats {
    industry: string;
    count: number;
    averageRating: number;
    totalReviews: number;
}

@Injectable({
    providedIn: 'root'
})
export class OrganizationService {
    private readonly path = '/organizations';

    constructor(private apiService: ApiService) {}

    getOrganizations(params: {
        page?: number;
        limit?: number;
        search?: string;
        industry?: string;
        size?: string;
        sort?: string;
    }): Observable<OrganizationsResponse> {
        return this.apiService.get<OrganizationsResponse>(this.path, params);
    }

    getOrganization(id: string): Observable<Organization> {
        return this.apiService.get<Organization>(`${this.path}/${id}`);
    }

    createOrganization(organization: {
        name: string;
        description: string;
        industry: string;
        location: string;
        size: string;
        website?: string;
        logo?: string;
    }): Observable<Organization> {
        return this.apiService.post<Organization>(this.path, organization);
    }

    updateOrganization(id: string, organization: Partial<Organization>): Observable<Organization> {
        return this.apiService.put<Organization>(`${this.path}/${id}`, organization);
    }

    deleteOrganization(id: string): Observable<void> {
        return this.apiService.delete<void>(`${this.path}/${id}`);
    }

    verifyOrganization(id: string): Observable<Organization> {
        return this.apiService.post<Organization>(`${this.path}/${id}/verify`);
    }

    getOrganizationStats(): Observable<OrganizationStats[]> {
        return this.apiService.get<OrganizationStats[]>(`${this.path}/stats/industry`);
    }

    getTopOrganizations(limit: number = 5): Observable<Organization[]> {
        return this.apiService.get<Organization[]>(`${this.path}/top`, { limit });
    }
} 