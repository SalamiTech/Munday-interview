import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationService } from '../../../../core/services/organization.service';
import { Organization } from '../../../../core/models/organization.model';

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
export class OrganizationFormComponent implements OnInit {
    organizationForm: FormGroup;
    isLoading = false;
    errorMessage = '';
    isEditMode = false;
    organizationId: string | null = null;

    constructor(
        private fb: FormBuilder,
        private organizationService: OrganizationService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.organizationForm = this.initForm();
    }

    ngOnInit(): void {
        this.organizationId = this.route.snapshot.paramMap.get('id');
        if (this.organizationId) {
            this.isEditMode = true;
            this.loadOrganization(this.organizationId);
        }
    }

    private initForm(): FormGroup {
        return this.fb.group({
            name: ['', [Validators.required]],
            description: ['', [Validators.required]],
            website: [''],
            logo: [''],
            industry: ['', [Validators.required]],
            location: ['', [Validators.required]],
            employeeCount: [0, [Validators.required, Validators.min(1)]],
            status: ['active']
        });
    }

    private loadOrganization(id: string): void {
        this.isLoading = true;
        this.organizationService.getOrganization(id).subscribe({
            next: (organization) => {
                this.organizationForm.patchValue({
                    name: organization.name,
                    description: organization.description,
                    website: organization.website,
                    logo: organization.logo,
                    industry: organization.industry,
                    location: organization.location,
                    employeeCount: organization.employeeCount,
                    status: organization.status
                });
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = error.message;
                this.isLoading = false;
            }
        });
    }

    onSubmit(): void {
        if (this.organizationForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';

            const organizationData = this.organizationForm.value;

            const request = this.isEditMode && this.organizationId
                ? this.organizationService.updateOrganization(this.organizationId, organizationData)
                : this.organizationService.createOrganization(organizationData);

            request.subscribe({
                next: () => {
                    this.router.navigate(['/organizations']);
                },
                error: (error) => {
                    this.errorMessage = error.message;
                    this.isLoading = false;
                }
            });
        } else {
            this.markFormGroupTouched(this.organizationForm);
        }
    }

    onCancel(): void {
        this.router.navigate(['/organizations']);
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