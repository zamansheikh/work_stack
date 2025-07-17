'use client';

import { useMemo, useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FeatureCard from '@/components/FeatureCard';
import { useFeatures } from '@/lib/hooks';
import { CheckCircle, Clock, Calendar, Pause } from 'lucide-react';
import { Feature } from '@/types';

export default function RoadmapPage() {
    const [page, setPage] = useState(1);
    const [allFeatures, setAllFeatures] = useState<Feature[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const { features, pagination, isLoading } = useFeatures({
        limit: 20,
        page,
    });

    // Handle features accumulation for pagination
    useEffect(() => {
        if (page === 1) {
            // First page - replace all features
            setAllFeatures(features);
        } else {
            // Subsequent pages - append to existing features
            // Filter out any duplicates by ID that might already exist in the previous pages
            setAllFeatures(prev => {
                const existingIds = new Set(prev.map(f => f.id));
                const newUniqueFeatures = features.filter(f => !existingIds.has(f.id));
                return [...prev, ...newUniqueFeatures];
            });
        }
        setIsLoadingMore(false);
    }, [features, page]);

    const featuresByStatus = useMemo(() => {
        return {
            completed: allFeatures.filter(f => f.status === 'completed'),
            'in-progress': allFeatures.filter(f => f.status === 'in-progress'),
            planned: allFeatures.filter(f => f.status === 'planned'),
            'on-hold': allFeatures.filter(f => f.status === 'on-hold'),
        };
    }, [allFeatures]);

    const handleShowMore = () => {
        setIsLoadingMore(true);
        setPage(prev => prev + 1);
    };

    const hasNextPage = pagination?.hasNextPage || false; const StatusSection = ({
        title,
        features: sectionFeatures,
        icon: Icon,
        iconColor,
        description
    }: {
        title: string;
        features: Feature[];
        icon: React.ComponentType<{ className?: string }>;
        iconColor: string;
        description: string;
    }) => (
        <div className="mb-12">
            <div className="flex items-center mb-6">
                <Icon className={`w-8 h-8 ${iconColor} mr-3`} />
                <div>                <h2 className="text-3xl font-bold text-gray-900">
                    {title} ({sectionFeatures.length})
                </h2>
                    <p className="text-gray-600">{description}</p>
                </div>
            </div>            {sectionFeatures.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {sectionFeatures.map((feature) => (
                        <FeatureCard key={feature.id} feature={feature} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    No features in this category yet.
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Development Roadmap
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Track our progress building the BowlersNetwork ecosystem. See what we&apos;ve completed,
                        what we&apos;re currently working on, and what&apos;s planned for the future.
                    </p>
                </div>

                {/* Progress Overview */}
                <div className="bg-white rounded-xl shadow-md p-8 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Progress Overview</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                                {pagination?.totalCompleted || featuresByStatus.completed.length}
                            </div>
                            <div className="text-sm text-gray-600">Completed</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                    className="bg-green-600 h-2 rounded-full" style={{
                                        width: `${((pagination?.totalCompleted || featuresByStatus.completed.length) / (pagination?.totalFeatures || allFeatures.length)) * 100}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                {pagination?.totalInProgress || featuresByStatus['in-progress'].length}
                            </div>
                            <div className="text-sm text-gray-600">In Progress</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full" style={{
                                        width: `${((pagination?.totalInProgress || featuresByStatus['in-progress'].length) / (pagination?.totalFeatures || allFeatures.length)) * 100}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-yellow-600 mb-2">
                                {pagination?.totalPlanned || featuresByStatus.planned.length}
                            </div>
                            <div className="text-sm text-gray-600">Planned</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                    className="bg-yellow-600 h-2 rounded-full" style={{
                                        width: `${((pagination?.totalPlanned || featuresByStatus.planned.length) / (pagination?.totalFeatures || allFeatures.length)) * 100}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-red-600 mb-2">
                                {pagination?.totalOnHold || featuresByStatus['on-hold'].length}
                            </div>
                            <div className="text-sm text-gray-600">On Hold</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                    className="bg-red-600 h-2 rounded-full" style={{
                                        width: `${((pagination?.totalOnHold || featuresByStatus['on-hold'].length) / (pagination?.totalFeatures || allFeatures.length)) * 100}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature Sections */}
                <StatusSection
                    title="Completed Features"
                    features={featuresByStatus.completed}
                    icon={CheckCircle}
                    iconColor="text-green-600"
                    description="Features that have been successfully implemented and deployed"
                />

                <StatusSection
                    title="Currently In Progress"
                    features={featuresByStatus['in-progress']}
                    icon={Clock}
                    iconColor="text-blue-600"
                    description="Features currently being developed by our team"
                />

                <StatusSection
                    title="Planned Features"
                    features={featuresByStatus.planned}
                    icon={Calendar}
                    iconColor="text-yellow-600"
                    description="Features scheduled for future development"
                />

                <StatusSection
                    title="On Hold"
                    features={featuresByStatus['on-hold']}
                    icon={Pause}
                    iconColor="text-red-600"
                    description="Features temporarily paused due to dependencies or changing priorities"
                />

                {/* Load More Button */}
                {hasNextPage && (
                    <div className="flex justify-center mt-12">
                        <button
                            onClick={handleShowMore}
                            disabled={isLoadingMore || isLoading}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[#8BC342] to-[#6fa332] hover:from-[#6fa332] hover:to-[#5c8a28] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8BC342] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoadingMore ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Loading...
                                </>
                            ) : (
                                'Load More Features'
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
