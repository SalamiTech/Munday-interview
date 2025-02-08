import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../../../../core/services/review.service';
import { OrganizationService } from '../../../../core/services/organization.service';
import { Organization } from '../../../../core/models/organization.model';
import { OrganizationOption } from '../../../../core/models/organization-option.model';
import { Review } from '../../../../core/models/review.model';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-review-form',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule
    ],
    templateUrl: './review-form.component.html',
    styleUrls: ['./review-form.component.scss']
})
export class ReviewFormComponent implements OnInit {
    reviewForm!: FormGroup;
    organizationOptions: OrganizationOption[] = [];
    isLoading = false;
    errorMessage = '';
    isEditMode = false;
    reviewId: string | null = null;

    constructor(
        private fb: FormBuilder,
        private reviewService: ReviewService,
        private organizationService: OrganizationService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.initForm();
    }

    ngOnInit(): void {
        this.loadOrganizations();
        this.reviewId = this.route.snapshot.paramMap.get('id');
        
        if (this.reviewId) {
            this.isEditMode = true;
            this.loadReview(this.reviewId);
        }

        // Check for organization pre-selection from query params
        const orgId = this.route.snapshot.queryParamMap.get('organizationId');
        if (orgId) {
            this.reviewForm.patchValue({ organization: orgId });
        }
    }

    private initForm(): void {
        this.reviewForm = this.fb.group({
            organization: ['', Validators.required],
            title: [''],
            rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
            content: ['', [Validators.required, Validators.minLength(10)]],
            pros: [[]],
            cons: [[]],
            isAnonymous: [false]
        });
    }

    private loadOrganizations(): void {
        this.isLoading = true;
        this.organizationService.getOrganizations({
            limit: 100,
            sort: 'name:ASC'
        }).pipe(
            map(response => response.items.map(org => ({
                value: org.id,
                label: org.name
            })))
        ).subscribe({
            next: (options) => {
                this.organizationOptions = options;
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = error.message;
                this.isLoading = false;
            }
        });
    }

    private loadReview(id: string): void {
        this.isLoading = true;
        this.reviewService.getReview(id).subscribe({
            next: (review) => {
                this.reviewForm.patchValue({
                    organization: review.organizationId,
                    title: review.title,
                    rating: review.rating,
                    content: review.content,
                    pros: review.pros,
                    cons: review.cons,
                    isAnonymous: review.isAnonymous
                });
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = error.message;
                this.isLoading = false;
            }
        });
    }

    getRatingLabel(rating: number): string {
        const labels: { [key: number]: string } = {
            1: 'Poor',
            2: 'Fair',
            3: 'Good',
            4: 'Very Good',
            5: 'Excellent'
        };
        return labels[rating] || 'Select a rating';
    }

    setRating(rating: number): void {
        this.reviewForm.patchValue({ rating });
    }

    addItem(type: 'pros' | 'cons', item: string): void {
        if (!item.trim()) return;
        const currentItems = this.reviewForm.get(type)?.value || [];
        this.reviewForm.patchValue({
            [type]: [...currentItems, item.trim()]
        });
    }

    removeItem(type: 'pros' | 'cons', index: number): void {
        const currentItems = this.reviewForm.get(type)?.value || [];
        this.reviewForm.patchValue({
            [type]: currentItems.filter((_: any, i: number) => i !== index)
        });
    }

    onSubmit(): void {
        if (this.reviewForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';

            const reviewData = {
                ...this.reviewForm.value,
                organizationId: this.reviewForm.value.organization
            };
            delete reviewData.organization;

            const request = this.isEditMode && this.reviewId
                ? this.reviewService.updateReview(this.reviewId, reviewData)
                : this.reviewService.createReview(reviewData);

            request.subscribe({
                next: () => {
                    this.router.navigate(['/reviews']);
                },
                error: (error) => {
                    this.errorMessage = error.message;
                    this.isLoading = false;
                }
            });
        } else {
            this.markFormGroupTouched(this.reviewForm);
        }
    }

    onCancel(): void {
        this.router.navigate(['/reviews']);
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }
} 