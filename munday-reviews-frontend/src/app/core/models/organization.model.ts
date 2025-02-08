export interface Organization {
    id: string;
    name: string;
    description?: string;
    website?: string;
    logo?: string;
    industry?: string;
    size?: string;
    location?: string;
    employeeCount: number;
    status: 'active' | 'inactive';
    isVerified: boolean;
    verifiedBy?: string;
    verifiedAt?: string;
    averageRating?: number;
    totalReviews?: number;
    createdAt: string;
    updatedAt?: string;
} 