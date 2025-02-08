import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-organization-form',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule
    ],
    templateUrl: './organization-form.component.html',
    styleUrls: ['./organization-form.component.scss']
})
export class OrganizationFormComponent {
    organizationForm: FormGroup | undefined;
    isLoading = false;
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private router: Router
    ) {
        this.initForm();
    }

    private initForm(): void {
        this.organizationForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            industry: ['', Validators.required],
            location: ['', Validators.required],
            employeeCount: ['', [Validators.required, Validators.min(1)]]
        });
    }

    onSubmit(): void {
        if (this.organizationForm?.valid) {
            // TODO: Implement organization submission
            console.log(this.organizationForm?.value);
            this.router.navigate(['/organizations']);
        }
    }

    onCancel(): void {
        this.router.navigate(['/organizations']);
    }
} 