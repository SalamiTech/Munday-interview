import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';

interface Organization {
    id: string;
    name: string;
    description: string;
    industry: string;
    location: string;
    employeeCount: number;
    averageRating: number;
    totalReviews: number;
    status: 'active' | 'inactive';
    createdAt: Date;
}

@Component({
    selector: 'app-organization-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatChipsModule,
        MatTooltipModule,
        MatMenuModule,
        MatFormFieldModule,
        MatProgressBarModule
    ],
    template: `
        <div class="organizations-container">
            <!-- Header -->
            <div class="organizations-header">
                <div class="header-title">
                    <h1>Organizations</h1>
                    <span class="org-count">{{ totalOrganizations }} total</span>
                </div>
                <button mat-raised-button color="primary" (click)="onAddOrganization()">
                    <mat-icon>add</mat-icon>
                    New Organization
                </button>
            </div>

            <!-- Filters -->
            <mat-card class="filters-card">
                <div class="filters-grid">
                    <!-- Search -->
                    <mat-form-field appearance="outline">
                        <mat-label>Search organizations</mat-label>
                        <input matInput [formControl]="searchControl" placeholder="Search by name, industry, or location">
                        <mat-icon matSuffix>search</mat-icon>
                    </mat-form-field>

                    <!-- Industry Filter -->
                    <mat-form-field appearance="outline">
                        <mat-label>Industry</mat-label>
                        <mat-select [formControl]="industryControl">
                            <mat-option value="">All Industries</mat-option>
                            <mat-option *ngFor="let industry of industries" [value]="industry.value">
                                {{ industry.label }}
                            </mat-option>
                        </mat-select>
                    </mat-form-field>

                    <!-- Rating Filter -->
                    <mat-form-field appearance="outline">
                        <mat-label>Minimum Rating</mat-label>
                        <mat-select [formControl]="ratingControl">
                            <mat-option value="">Any Rating</mat-option>
                            <mat-option *ngFor="let rating of [4,3,2,1]" [value]="rating">
                                {{ rating }}+ Stars
                            </mat-option>
                        </mat-select>
                    </mat-form-field>

                    <!-- Status Filter -->
                    <mat-form-field appearance="outline">
                        <mat-label>Status</mat-label>
                        <mat-select [formControl]="statusControl">
                            <mat-option value="">All Status</mat-option>
                            <mat-option value="active">Active</mat-option>
                            <mat-option value="inactive">Inactive</mat-option>
                        </mat-select>
                    </mat-form-field>
                </div>

                <div class="active-filters">
                    <mat-chip-listbox>
                        <mat-chip *ngIf="searchControl.value" (removed)="searchControl.reset()">
                            Search: {{ searchControl.value }}
                            <button matChipRemove><mat-icon>cancel</mat-icon></button>
                        </mat-chip>
                        <mat-chip *ngIf="industryControl.value" (removed)="industryControl.reset()">
                            {{ getIndustryLabel(industryControl.value) }}
                            <button matChipRemove><mat-icon>cancel</mat-icon></button>
                        </mat-chip>
                        <mat-chip *ngIf="ratingControl.value" (removed)="ratingControl.reset()">
                            {{ ratingControl.value }}+ Stars
                            <button matChipRemove><mat-icon>cancel</mat-icon></button>
                        </mat-chip>
                        <mat-chip *ngIf="statusControl.value" (removed)="statusControl.reset()">
                            Status: {{ statusControl.value }}
                            <button matChipRemove><mat-icon>cancel</mat-icon></button>
                        </mat-chip>
                    </mat-chip-listbox>
                </div>
            </mat-card>

            <!-- Organizations Grid -->
            <div class="organizations-grid">
                <mat-card *ngFor="let org of organizations" class="organization-card">
                    <mat-card-header>
                        <div class="header-content">
                            <div class="org-info">
                                <mat-card-title>{{ org.name }}</mat-card-title>
                                <mat-card-subtitle>{{ org.industry }}</mat-card-subtitle>
                            </div>
                            <button mat-icon-button [matMenuTriggerFor]="menu">
                                <mat-icon>more_vert</mat-icon>
                            </button>
                            <mat-menu #menu="matMenu">
                                <button mat-menu-item (click)="onViewDetails(org)">
                                    <mat-icon>visibility</mat-icon>
                                    <span>View Details</span>
                                </button>
                                <button mat-menu-item (click)="onEdit(org)">
                                    <mat-icon>edit</mat-icon>
                                    <span>Edit</span>
                                </button>
                                <button mat-menu-item (click)="onDelete(org)" class="warn-text">
                                    <mat-icon color="warn">delete</mat-icon>
                                    <span>Delete</span>
                                </button>
                            </mat-menu>
                        </div>
                    </mat-card-header>

                    <mat-card-content>
                        <p class="description">{{ org.description }}</p>
                        
                        <div class="stats-grid">
                            <div class="stat-item">
                                <span class="label">Location</span>
                                <span class="value">{{ org.location }}</span>
                            </div>
                            <div class="stat-item">
                                <span class="label">Employees</span>
                                <span class="value">{{ org.employeeCount.toLocaleString() }}</span>
                            </div>
                            <div class="stat-item">
                                <span class="label">Reviews</span>
                                <span class="value">{{ org.totalReviews }}</span>
                            </div>
                        </div>

                        <div class="rating-section">
                            <div class="rating-header">
                                <div class="rating-stars">
                                    <mat-icon *ngFor="let star of [1,2,3,4,5]" 
                                             [class.filled]="org.averageRating >= star">
                                        {{ org.averageRating >= star ? 'star' : 'star_border' }}
                                    </mat-icon>
                                </div>
                                <span class="rating-value">{{ org.averageRating.toFixed(1) }}</span>
                            </div>
                            <mat-progress-bar 
                                mode="determinate" 
                                [value]="(org.averageRating / 5) * 100">
                            </mat-progress-bar>
                        </div>

                        <div class="status-section">
                            <span class="status-chip" [class]="org.status">
                                {{ org.status }}
                            </span>
                            <span class="created-date">Created {{ org.createdAt | date }}</span>
                        </div>
                    </mat-card-content>

                    <mat-card-actions>
                        <button mat-button color="primary" (click)="onViewReviews(org)">
                            VIEW REVIEWS
                        </button>
                        <button mat-button color="primary" (click)="onWriteReview(org)">
                            WRITE REVIEW
                        </button>
                    </mat-card-actions>
                </mat-card>
            </div>

            <!-- Pagination -->
            <mat-paginator 
                [length]="totalOrganizations"
                [pageSize]="pageSize"
                [pageSizeOptions]="[6, 12, 24, 48]"
                (page)="onPageChange($event)">
            </mat-paginator>
        </div>
    `,
    styles: [`
        .organizations-container {
            padding: var(--spacing-xl);
            max-width: 1400px;
            margin: 0 auto;
        }

        .organizations-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--spacing-lg);

            .header-title {
                h1 {
                    font-size: var(--font-size-xl);
                    margin: 0;
                    color: var(--text-primary);
                }

                .org-count {
                    color: var(--text-secondary);
                    font-size: var(--font-size-sm);
                }
            }

            button {
                mat-icon {
                    margin-right: var(--spacing-xs);
                }
            }
        }

        .filters-card {
            margin-bottom: var(--spacing-lg);
            
            .filters-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: var(--spacing-md);
                margin-bottom: var(--spacing-md);
            }

            .active-filters {
                display: flex;
                gap: var(--spacing-sm);
                min-height: 32px;
            }
        }

        .organizations-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            gap: var(--spacing-lg);
            margin-bottom: var(--spacing-lg);

            .organization-card {
                height: 100%;

                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    width: 100%;

                    .org-info {
                        flex: 1;
                        
                        mat-card-title {
                            font-size: var(--font-size-lg);
                            margin-bottom: var(--spacing-xs);
                        }

                        mat-card-subtitle {
                            color: var(--text-secondary);
                        }
                    }
                }

                .description {
                    color: var(--text-primary);
                    margin: var(--spacing-md) 0;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: var(--spacing-md);
                    margin: var(--spacing-md) 0;

                    .stat-item {
                        display: flex;
                        flex-direction: column;
                        gap: var(--spacing-xs);

                        .label {
                            color: var(--text-secondary);
                            font-size: var(--font-size-xs);
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        }

                        .value {
                            color: var(--text-primary);
                            font-weight: 500;
                        }
                    }
                }

                .rating-section {
                    margin: var(--spacing-md) 0;

                    .rating-header {
                        display: flex;
                        align-items: center;
                        gap: var(--spacing-sm);
                        margin-bottom: var(--spacing-xs);

                        .rating-stars {
                            display: flex;
                            gap: 2px;

                            mat-icon {
                                font-size: 18px;
                                width: 18px;
                                height: 18px;
                                
                                &.filled {
                                    color: var(--warning);
                                }
                            }
                        }

                        .rating-value {
                            color: var(--text-primary);
                            font-weight: 500;
                        }
                    }
                }

                .status-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: var(--spacing-md);

                    .status-chip {
                        text-transform: capitalize;
                        font-size: var(--font-size-xs);
                        font-weight: 500;
                        padding: var(--spacing-xs) var(--spacing-sm);
                        border-radius: var(--radius-sm);

                        &.active {
                            background-color: rgba(76, 175, 80, 0.1);
                            color: var(--success);
                        }

                        &.inactive {
                            background-color: rgba(158, 158, 158, 0.1);
                            color: var(--text-secondary);
                        }
                    }

                    .created-date {
                        color: var(--text-secondary);
                        font-size: var(--font-size-xs);
                    }
                }
            }
        }

        @media (max-width: 960px) {
            .organizations-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 768px) {
            .organizations-container {
                padding: var(--spacing-md);
            }

            .organizations-header {
                flex-direction: column;
                align-items: stretch;
                gap: var(--spacing-md);

                button {
                    width: 100%;
                }
            }
        }
    `]
})
export class OrganizationListComponent implements OnInit {
    organizations: Organization[] = [];
    totalOrganizations = 0;
    pageSize = 12;

    searchControl = new FormControl('');
    industryControl = new FormControl('');
    ratingControl = new FormControl('');
    statusControl = new FormControl('');

    industries = [
        { value: 'technology', label: 'Technology' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'finance', label: 'Finance' },
        { value: 'education', label: 'Education' },
        { value: 'manufacturing', label: 'Manufacturing' }
    ];

    ngOnInit(): void {
        // TODO: Replace with actual API call
        this.loadMockData();
    }

    loadMockData(): void {
        this.organizations = [
            {
                id: '1',
                name: 'Tech Corp',
                description: 'Leading provider of innovative technology solutions for enterprise businesses. Specializing in cloud computing, AI, and digital transformation.',
                industry: 'Technology',
                location: 'San Francisco, CA',
                employeeCount: 5000,
                averageRating: 4.5,
                totalReviews: 156,
                status: 'active',
                createdAt: new Date('2023-01-15')
            },
            {
                id: '2',
                name: 'Digital Solutions',
                description: 'Digital transformation consultancy helping businesses modernize their operations and improve efficiency through technology.',
                industry: 'Technology',
                location: 'New York, NY',
                employeeCount: 2500,
                averageRating: 4.2,
                totalReviews: 98,
                status: 'active',
                createdAt: new Date('2023-03-22')
            },
            {
                id: '3',
                name: 'Innovation Labs',
                description: 'Research and development firm focused on breakthrough technologies in AI, robotics, and sustainable energy solutions.',
                industry: 'Technology',
                location: 'Boston, MA',
                employeeCount: 1200,
                averageRating: 4.7,
                totalReviews: 75,
                status: 'active',
                createdAt: new Date('2023-06-10')
            }
        ];
        this.totalOrganizations = this.organizations.length;
    }

    onPageChange(event: PageEvent): void {
        // TODO: Implement pagination logic
        console.log('Page:', event);
    }

    getIndustryLabel(value: string): string {
        return this.industries.find(industry => industry.value === value)?.label || value;
    }

    onAddOrganization(): void {
        // TODO: Implement add organization logic
        console.log('Add organization');
    }

    onViewDetails(org: Organization): void {
        // TODO: Implement view details logic
        console.log('View details:', org);
    }

    onEdit(org: Organization): void {
        // TODO: Implement edit logic
        console.log('Edit:', org);
    }

    onDelete(org: Organization): void {
        // TODO: Implement delete logic
        console.log('Delete:', org);
    }

    onViewReviews(org: Organization): void {
        // TODO: Implement view reviews logic
        console.log('View reviews:', org);
    }

    onWriteReview(org: Organization): void {
        // TODO: Implement write review logic
        console.log('Write review:', org);
    }
} 