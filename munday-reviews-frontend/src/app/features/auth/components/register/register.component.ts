import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule
    ],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    registerForm!: FormGroup;
    hidePassword = true;
    hideConfirmPassword = true;
    isLoading = false;
    errorMessage = '';
    passwordStrength = 0;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.initForm();
    }

    private initForm(): void {
        this.registerForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
            ]],
            confirmPassword: ['', Validators.required],
            acceptTerms: [false, Validators.requiredTrue]
        }, { validators: this.passwordMatchValidator });

        // Update password strength when password changes
        this.registerForm.get('password')?.valueChanges.subscribe(password => {
            this.updatePasswordStrength(password);
        });
    }

    private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');

        if (!password || !confirmPassword) return null;

        return password.value === confirmPassword.value ? null : { 'passwordMismatch': true };
    }

    private updatePasswordStrength(password: string): void {
        if (!password) {
            this.passwordStrength = 0;
            return;
        }

        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength += 25;
        
        // Lowercase check
        if (/[a-z]/.test(password)) strength += 25;
        
        // Uppercase check
        if (/[A-Z]/.test(password)) strength += 25;
        
        // Special character check
        if (/[@$!%*?&]/.test(password)) strength += 25;

        this.passwordStrength = strength;
    }

    getStrengthText(): string {
        if (this.passwordStrength < 50) return 'Weak password';
        if (this.passwordStrength < 75) return 'Moderate password';
        if (this.passwordStrength < 100) return 'Strong password';
        return 'Very strong password';
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';

            this.authService.register(this.registerForm.value).subscribe({
                next: () => {
                    this.router.navigate(['/auth/login'], {
                        queryParams: { registered: true }
                    });
                },
                error: (error) => {
                    this.isLoading = false;
                    this.errorMessage = error.message || 'Registration failed. Please try again.';
                }
            });
        }
    }

    onGoogleSignup(): void {
        // TODO: Implement Google signup
        console.log('Google signup clicked');
    }

    onGithubSignup(): void {
        // TODO: Implement GitHub signup
        console.log('GitHub signup clicked');
    }
} 