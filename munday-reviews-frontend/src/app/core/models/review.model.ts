export interface Review {
    id: string;
    title?: string;
    content: string;
    rating: number;
    status: 'pending' | 'approved' | 'rejected';
    organizationId: string;
    organizationName: string;
    userId: string;
    userName: string;
    createdAt: Date;
    updatedAt?: Date;
} 