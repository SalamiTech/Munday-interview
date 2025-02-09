import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Organization } from '../../../../core/models/organization.model';
import { OrganizationService } from '../../../../core/services/organization.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-organization-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './organization-list.component.html'
})
export class OrganizationListComponent implements OnInit {
    organizations: Organization[] = [];
    filteredOrganizations: Organization[] = [];
    isLoading = false;
    error = '';

    // Filters
    searchControl = new FormControl('');
    industryControl = new FormControl('');
    ratingControl = new FormControl('');
    statusControl = new FormControl('');

    // Pagination
    currentPage = 1;
    pageSize = 12;
    totalPages = 1;

    industries = [
        { value: 'technology', label: 'Technology' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'finance', label: 'Finance' },
        { value: 'education', label: 'Education' },
        { value: 'retail', label: 'Retail' },
        { value: 'manufacturing', label: 'Manufacturing' },
        { value: 'services', label: 'Services' },
        { value: 'other', label: 'Other' }
    ];

    ratings = [
        { value: '4', label: '4+ Stars' },
        { value: '3', label: '3+ Stars' },
        { value: '2', label: '2+ Stars' },
        { value: '1', label: '1+ Stars' }
    ];

    constructor(private organizationService: OrganizationService) {}

    ngOnInit(): void {
        this.loadOrganizations();
        this.setupFilters();
    }

    private setupFilters(): void {
        // Setup search with debounce
        this.searchControl.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(() => this.applyFilters());

        // Setup other filters
        this.industryControl.valueChanges.subscribe(() => this.applyFilters());
        this.ratingControl.valueChanges.subscribe(() => this.applyFilters());
        this.statusControl.valueChanges.subscribe(() => this.applyFilters());
    }

    loadOrganizations(): void {
        this.isLoading = true;
        this.error = '';

        this.organizationService.getOrganizations({
            page: this.currentPage,
            limit: this.pageSize
        }).subscribe({
            next: (response) => {
                this.organizations = response.items;
                this.filteredOrganizations = this.organizations;
                this.totalPages = response.totalPages;
                this.isLoading = false;
            },
            error: (error) => {
                this.error = 'Failed to load organizations. Please try again.';
                this.isLoading = false;
            }
        });
    }

    private applyFilters(): void {
        let filtered = [...this.organizations];
        const searchTerm = this.searchControl.value?.toLowerCase();
        const industry = this.industryControl.value;
        const rating = Number(this.ratingControl.value);
        const status = this.statusControl.value;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(org => 
                org.name.toLowerCase().includes(searchTerm) ||
                org.description.toLowerCase().includes(searchTerm) ||
                org.location.toLowerCase().includes(searchTerm)
            );
        }

        // Apply industry filter
        if (industry) {
            filtered = filtered.filter(org => org.industry === industry);
        }

        // Apply rating filter
        if (rating) {
            filtered = filtered.filter(org => org.averageRating >= rating);
        }

        // Apply status filter
        if (status) {
            filtered = filtered.filter(org => org.status === status);
        }

        this.filteredOrganizations = filtered;
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadOrganizations();
    }

    getIndustryLabel(value: string): string {
        return this.industries.find(i => i.value === value)?.label || value;
    }

    onViewDetails(org: Organization): void {
        // Navigation handled by router link in template
    }

    onWriteReview(org: Organization): void {
        // Navigation handled by router link in template
    }

    trackByOrganizationId(index: number, org: Organization): string {
        return org.id;
    }
} 