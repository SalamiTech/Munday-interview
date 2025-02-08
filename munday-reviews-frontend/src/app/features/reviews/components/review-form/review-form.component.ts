import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
export class ReviewFormComponent {
    reviewForm!: FormGroup;
    isLoading = false;
    errorMessage = '';

    organizations = [
        { value: 'tech-corp', label: 'Tech Corp' },
        { value: 'digital-solutions', label: 'Digital Solutions' },
        { value: 'innovation-labs', label: 'Innovation Labs' }
    ];

    constructor(
        private fb: FormBuilder,
        private router: Router
    ) {
        this.initForm();
    }

    private initForm(): void {
        this.reviewForm = this.fb.group({
            organization: ['', Validators.required],
            rating: ['', Validators.required],
            content: ['', [Validators.required, Validators.minLength(10)]]
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

    onSubmit(): void {
        if (this.reviewForm.valid) {
            // TODO: Implement review submission
            console.log(this.reviewForm.value);
            this.router.navigate(['/reviews']);
        }
    }

    onCancel(): void {
        this.router.navigate(['/reviews']);
    }
} 