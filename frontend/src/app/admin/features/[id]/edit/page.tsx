'use client';

import { useAuth } from '@/lib/auth-context';
import { useFeature } from '@/lib/hooks';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FeatureForm from '@/components/FeatureForm';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function EditFeaturePage() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const params = useParams();
    const router = useRouter();
    const featureId = params.id as string;
    const { feature, isLoading, error, refetch, clearError } = useFeature(featureId);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    const handleRetry = () => {
        clearError();
        refetch();
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-center">
                            <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-red-800">
                                    Failed to load feature
                                </h3>
                                <p className="text-red-700 mt-1">{error}</p>
                            </div>
                            <button
                                onClick={handleRetry}
                                className="ml-4 inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!feature) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Feature not found</h1>
                        <button
                            onClick={() => router.push('/admin')}
                            className="text-blue-600 hover:text-blue-700"
                        >
                            ← Back to Admin Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Edit Feature</h1>
                    <p className="text-gray-600 mt-2">
                        Update the details for &quot;{feature.name}&quot;
                    </p>
                </div>
                <FeatureForm feature={feature} />
            </div>
        </div>
    );
}
