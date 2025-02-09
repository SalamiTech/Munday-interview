import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-toast'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-toast'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  info(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['info-toast'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  warning(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: ['warning-toast'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
} 