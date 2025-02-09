export interface Organization {
    id: string;
    name: string;
    description: string;
    industry: string;
    location: string;
    employeeCount: number;
    website?: string;
    logo?: string;
    status: 'active' | 'inactive';
    averageRating: number;
    reviewCount: number;
    averageSalary?: number;
    interviewSuccessRate: number;
    createdAt: string;
    updatedAt: string;
} 