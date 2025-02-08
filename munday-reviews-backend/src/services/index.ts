export * from './base.service';
export * from './user.service';
export * from './organization.service';
export * from './review.service';

// Create service instances
import { UserService } from './user.service';
import { OrganizationService } from './organization.service';
import { ReviewService } from './review.service';

export const userService = new UserService();
export const organizationService = new OrganizationService();
export const reviewService = new ReviewService(); 