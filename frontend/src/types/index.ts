export interface Feature {
    id: string;
    name: string;
    description: string;
    purpose: string;
    implementation: string;
    technicalDetails: string;
    status: 'planned' | 'in-progress' | 'completed' | 'on-hold';
    priority: 'low' | 'medium' | 'high' | 'critical';
    attachments: Attachment[];
    createdAt: Date | string;
    updatedAt: Date | string;
    author: string;
    tags: string[];
}

export interface Attachment {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    url: string;
    publicId?: string;
    uploadedAt: Date | string;
}

export interface User {
    id: string; // Will be mapped from _id
    name?: string;
    email: string;
    role: 'admin' | 'user' | 'superadmin';
    enabled: boolean;
    lastLogin?: Date | string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
}

export interface UpdateUserRequest {
    name?: string;
    email?: string;
    role?: 'admin' | 'user' | 'superadmin';
}

export interface ToggleUserRequest {
    enabled: boolean;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface UsersResponse {
    users: User[];
    totalUsers: number;
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number; // Renamed from totalFeatures for generality
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
    // Backend pagination stats
    totalFeatures: number;
    totalCompleted: number;
    totalInProgress: number;
    totalPlanned: number;
    totalOnHold: number;
    totalCancelled?: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: PaginationInfo;
}

export interface FeatureStats {
    totalFeatures: number;
    statusCounts: Record<Feature['status'], number>;
    priorityCounts: Record<Feature['priority'], number>;
    // Add other stats fields as defined by your backend API
}
