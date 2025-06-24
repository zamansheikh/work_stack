import { useState, useEffect, useCallback, useMemo } from 'react';
import { Feature, PaginatedResponse, PaginationInfo, User, CreateUserRequest, UpdateUserRequest, UsersResponse, ChangePasswordRequest } from '@/types';
import { featuresApi, handleApiError, userApi, authApi } from '@/lib/api';

interface UseFeaturesOptions {
    search?: string;
    status?: string;
    priority?: string;
    tags?: string[];
    page?: number;
    limit?: number;
}

interface UseFeaturesReturn {
    features: Feature[];
    pagination: PaginationInfo | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    clearError: () => void;
}

export function useFeatures(options: UseFeaturesOptions = {}): UseFeaturesReturn {
    const [features, setFeatures] = useState<Feature[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);

    // Extract individual values to avoid object reference issues
    const { search, status, priority, tags, page, limit } = options;
    const tagsString = tags?.join(',') || '';    // Memoize the options to prevent infinite re-renders
    const memoizedOptions = useMemo(() => ({
        search,
        status,
        priority,
        tags: tagsString ? tagsString.split(',') : undefined,
        page,
        limit,
    }), [search, status, priority, tagsString, page, limit]);

    const fetchFeatures = useCallback(async () => {
        try {
            setError(null);
            setIsLoading(true);
            const data: PaginatedResponse<Feature> = await featuresApi.getAll(memoizedOptions);
            setFeatures(data.items);
            setPagination(data.pagination);
        } catch (err) {
            const errorMessage = handleApiError(err);
            setError(errorMessage);
            console.error('Failed to fetch features:', err);
        } finally {
            setIsLoading(false);
        }
    }, [memoizedOptions]);

    useEffect(() => {
        fetchFeatures();
    }, [fetchFeatures]);

    return {
        features,
        pagination,
        isLoading,
        error,
        refetch: fetchFeatures,
        clearError,
    };
}

interface UseFeatureReturn {
    feature: Feature | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    clearError: () => void;
}

export function useFeature(id: string): UseFeatureReturn {
    const [feature, setFeature] = useState<Feature | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);

    const fetchFeature = useCallback(async () => {
        if (!id) return;

        try {
            setError(null);
            setIsLoading(true);
            const data = await featuresApi.getById(id);
            setFeature(data);
        } catch (err) {
            const errorMessage = handleApiError(err);
            setError(errorMessage);
            console.error('Failed to fetch feature:', err);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchFeature();
    }, [fetchFeature]);

    return {
        feature,
        isLoading,
        error,
        refetch: fetchFeature,
        clearError,
    };
}

// Hook for feature mutations (create, update, delete)
interface UseFeatureMutationsReturn {
    createFeature: (feature: Omit<Feature, 'id' | 'createdAt' | 'updatedAt' | 'attachments'>) => Promise<Feature>;
    updateFeature: (id: string, feature: Partial<Omit<Feature, 'id' | 'createdAt' | 'updatedAt' | 'attachments'>>) => Promise<Feature>;
    deleteFeature: (id: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
}

export function useFeatureMutations(): UseFeatureMutationsReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);

    const createFeature = async (feature: Omit<Feature, 'id' | 'createdAt' | 'updatedAt' | 'attachments'>) => {
        try {
            setError(null);
            setIsLoading(true);
            return await featuresApi.create(feature);
        } catch (err) {
            const errorMessage = handleApiError(err);
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const updateFeature = async (id: string, feature: Partial<Omit<Feature, 'id' | 'createdAt' | 'updatedAt' | 'attachments'>>) => {
        try {
            setError(null);
            setIsLoading(true);
            return await featuresApi.update(id, feature);
        } catch (err) {
            const errorMessage = handleApiError(err);
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteFeature = async (id: string) => {
        try {
            setError(null);
            setIsLoading(true);
            await featuresApi.delete(id);
        } catch (err) {
            const errorMessage = handleApiError(err);
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        createFeature,
        updateFeature,
        deleteFeature,
        isLoading,
        error,
        clearError,
    };
}

// User Management Hooks
interface UseUsersReturn {
    users: User[];
    totalUsers: number;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    clearError: () => void;
}

export function useUsers(): UseUsersReturn {
    const [users, setUsers] = useState<User[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);

    const fetchUsers = useCallback(async () => {
        try {
            setError(null);
            setIsLoading(true);
            const data: UsersResponse = await userApi.getAll();
            setUsers(data.users);
            setTotalUsers(data.totalUsers);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        totalUsers,
        isLoading,
        error,
        refetch: fetchUsers,
        clearError,
    };
}

interface UseUserMutationsReturn {
    createUser: (userData: CreateUserRequest) => Promise<User>;
    updateUser: (id: string, userData: UpdateUserRequest) => Promise<User>;
    toggleUser: (id: string, enabled: boolean) => Promise<User>;
    deleteUser: (id: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
}

export function useUserMutations(): UseUserMutationsReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);

    const createUser = useCallback(async (userData: CreateUserRequest): Promise<User> => {
        try {
            setError(null);
            setIsLoading(true);
            const user = await userApi.create(userData);
            return user;
        } catch (err) {
            const errorMessage = handleApiError(err);
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateUser = useCallback(async (id: string, userData: UpdateUserRequest): Promise<User> => {
        try {
            setError(null);
            setIsLoading(true);
            const user = await userApi.update(id, userData);
            return user;
        } catch (err) {
            const errorMessage = handleApiError(err);
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const toggleUser = useCallback(async (id: string, enabled: boolean): Promise<User> => {
        try {
            setError(null);
            setIsLoading(true);
            const user = await userApi.toggle(id, { enabled });
            return user;
        } catch (err) {
            const errorMessage = handleApiError(err);
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteUser = useCallback(async (id: string): Promise<void> => {
        try {
            setError(null);
            setIsLoading(true);
            await userApi.delete(id);
        } catch (err) {
            const errorMessage = handleApiError(err);
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        createUser,
        updateUser,
        toggleUser,
        deleteUser,
        isLoading,
        error,
        clearError,
    };
}

// Change Password Hook
interface UseChangePasswordReturn {
    changePassword: (passwordData: ChangePasswordRequest) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
}

export function useChangePassword(): UseChangePasswordReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);

    const changePassword = useCallback(async (passwordData: ChangePasswordRequest): Promise<void> => {
        try {
            setError(null);
            setIsLoading(true);
            await authApi.changePassword(passwordData);
        } catch (err) {
            const errorMessage = handleApiError(err);
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        changePassword,
        isLoading,
        error,
        clearError,
    };
}
