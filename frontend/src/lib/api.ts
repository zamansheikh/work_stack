import { Feature, User, PaginatedResponse, FeatureStats, Attachment } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// API Error class for better error handling
export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public code?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// Token management
export const tokenManager = {
    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('auth_token');
    },

    setToken(token: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem('auth_token', token);
    },

    removeToken(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('auth_token');
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
};

// Base fetch wrapper with error handling
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function apiFetch(url: string, options: RequestInit = {}): Promise<any> {
    const token = tokenManager.getToken();
    const config: RequestInit = {
        ...options,
        mode: 'cors',
        credentials: 'omit',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    }; const fullUrl = `${API_BASE_URL}${url}`;
    // console.log('Making API request to:', fullUrl);

    try {
        const response = await fetch(fullUrl, config);
        // console.log('Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
            console.error('API Error:', errorData);
            throw new ApiError(
                errorData.message || `HTTP ${response.status}`,
                response.status,
                errorData.code
            );
        } const data = await response.json();
        // console.log('API Response:', data);
        return data;
    } catch (error) {
        console.error('Network error:', error);
        if (error instanceof ApiError) {
            throw error;
        }

        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new ApiError('CORS error - Backend server needs to allow frontend origin', 0);
        }

        throw new ApiError('Network error or server unavailable', 0);
    }
}

// Helper to map backend user to frontend User type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBackendUserToFrontend = (backendUser: any): User => {
    if (!backendUser) throw new ApiError('Invalid user data received from server', 500);
    return {
        id: backendUser._id || backendUser.id,
        email: backendUser.email,
        name: backendUser.name,
        role: backendUser.role,
        lastLogin: backendUser.lastLogin,
        createdAt: backendUser.createdAt || new Date().toISOString(),
    };
};

// Helper to map backend feature to frontend Feature type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBackendFeatureToFrontend = (backendFeature: any): Feature => {
    return {
        ...backendFeature,
        id: backendFeature._id || backendFeature.id,
        createdAt: backendFeature.createdAt ? new Date(backendFeature.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: backendFeature.updatedAt ? new Date(backendFeature.updatedAt).toISOString() : new Date().toISOString(),
    };
};

// Auth API
export const authApi = {
    async login(emailOrUsername: string, password: string): Promise<{ token: string; user: User }> {
        //! Create a new variable call email
        const email = emailOrUsername;
        const response = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (!response.success || !response.data || !response.data.token || !response.data.user) {
            throw new ApiError(response.message || 'Login failed: Invalid response from server', 401);
        }

        const { token, user: backendUser } = response.data;
        tokenManager.setToken(token);
        const frontendUser = mapBackendUserToFrontend(backendUser);
        return { token, user: frontendUser };
    },

    async getCurrentUser(): Promise<User> {
        const response = await apiFetch('/auth/me');

        if (!response.success || !response.data || !response.data.user) {
            throw new ApiError(response.message || 'Failed to get current user: Invalid response from server', 401);
        }

        const frontendUser = mapBackendUserToFrontend(response.data.user);
        return frontendUser;
    },

    logout(): void {
        tokenManager.removeToken();
    }
};

// Features API
export const featuresApi = {
    async getAll(params?: {
        search?: string;
        status?: string;
        priority?: string;
        tags?: string[];
        page?: number;
        limit?: number;
    }): Promise<PaginatedResponse<Feature>> {
        const searchParams = new URLSearchParams();

        if (params?.search) searchParams.append('search', params.search);
        if (params?.status) searchParams.append('status', params.status);
        if (params?.priority) searchParams.append('priority', params.priority);
        if (params?.tags?.length) {
            params.tags.forEach(tag => searchParams.append('tags', tag));
        }
        if (params?.page) searchParams.append('page', String(params.page));
        if (params?.limit) searchParams.append('limit', String(params.limit));

        const queryString = searchParams.toString();
        const url = `/features${queryString ? `?${queryString}` : ''}`;

        const response = await apiFetch(url);
        if (!response.success || !response.data || !Array.isArray(response.data.features) || !response.data.pagination) {
            throw new ApiError(response.message || 'Failed to fetch features: Invalid response structure', response.status || 500);
        }

        return {
            items: response.data.features.map(mapBackendFeatureToFrontend),
            pagination: {
                ...response.data.pagination,
                totalItems: response.data.pagination.totalFeatures,
            },
        };
    }, async getById(id: string): Promise<Feature | null> {
        try {
            const response = await apiFetch(`/features/${id}`);
            if (!response.success || !response.data) {
                return null;
            }
            // Backend returns feature nested under response.data.feature
            const featureData = response.data.feature || response.data;
            return mapBackendFeatureToFrontend(featureData);
        } catch (error) {
            if (error instanceof ApiError && error.status === 404) {
                return null;
            }
            throw error;
        }
    },

    async getStats(): Promise<FeatureStats> {
        const response = await apiFetch('/features/stats');
        if (!response.success || !response.data) {
            throw new ApiError(response.message || 'Failed to fetch feature statistics', response.status || 500);
        }
        return response.data;
    }, async create(featureData: Omit<Feature, 'id' | 'createdAt' | 'updatedAt' | 'attachments'>): Promise<Feature> {
        const response = await apiFetch('/features', {
            method: 'POST',
            body: JSON.stringify(featureData),
        });
        if (!response.success || !response.data) {
            throw new ApiError(response.message || 'Failed to create feature', response.status || 500);
        }
        // Backend might return feature nested under response.data.feature
        const featureResponse = response.data.feature || response.data;
        return mapBackendFeatureToFrontend(featureResponse);
    },

    async update(id: string, featureData: Partial<Omit<Feature, 'id' | 'createdAt' | 'updatedAt' | 'attachments'>>): Promise<Feature> {
        const response = await apiFetch(`/features/${id}`, {
            method: 'PUT',
            body: JSON.stringify(featureData),
        });
        if (!response.success || !response.data) {
            throw new ApiError(response.message || 'Failed to update feature', response.status || 500);
        }
        // Backend might return feature nested under response.data.feature
        const featureResponse = response.data.feature || response.data;
        return mapBackendFeatureToFrontend(featureResponse);
    },

    async uploadAttachments(featureId: string, files: File[]): Promise<Attachment[]> {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('attachments', file);
        });

        const token = tokenManager.getToken();
        const response = await fetch(`${API_BASE_URL}/upload/feature/${featureId}/attachments`, {
            method: 'POST',
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
            throw new ApiError(errorData.message || `HTTP ${response.status}`, response.status);
        }

        const responseData = await response.json();
        if (!responseData.success || !Array.isArray(responseData.data)) {
            throw new ApiError(responseData.message || 'Failed to upload attachments: Invalid response', response.status);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return responseData.data.map((att: any) => ({
            ...att,
            id: att._id || att.id,
            uploadedAt: att.uploadedAt ? new Date(att.uploadedAt).toISOString() : new Date().toISOString(),
        }));
    },

    async delete(id: string): Promise<void> {
        const response = await apiFetch(`/features/${id}`, { method: 'DELETE' });
        if (!response.success) {
            throw new ApiError(response.message || 'Failed to delete feature', response.status || 500);
        }
    }
};

// Helper function to handle API errors in components
export function handleApiError(error: unknown): string {
    if (error instanceof ApiError) {
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unexpected error occurred.';
}


