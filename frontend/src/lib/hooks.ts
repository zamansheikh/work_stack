import { useState, useEffect, useCallback, useMemo } from 'react';
import { Feature, PaginatedResponse, PaginationInfo } from '@/types';
import { featuresApi, handleApiError } from '@/lib/api';

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
