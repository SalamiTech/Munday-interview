import { Organization } from './organization.model';
import { User } from '../services/auth.service';

export interface Review {
    id: string;
    title?: string;
    content: string;
    rating: number;
    pros?: string[];
    cons?: string[];
    status: 'pending' | 'approved' | 'rejected';
    helpfulCount: number;
    reportCount: number;
    isAnonymous: boolean;
    userId: string;
    organizationId: string;
    moderatorId?: string;
    moderatedAt?: string;
    moderationNotes?: string;
    createdAt: string;
    updatedAt?: string;
    
    // Populated fields
    user?: User;
    organization?: Organization;
    moderator?: User;
} 