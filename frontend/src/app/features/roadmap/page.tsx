'use client';

import { useMemo } from 'react';
import Navbar from '@/components/Navbar';
import FeatureCard from '@/components/FeatureCard';
import { useFeatures } from '@/lib/hooks';
import { CheckCircle, Clock, Calendar, Pause } from 'lucide-react';
import { Feature } from '@/types';

export default function RoadmapPage() {
    const { features } = useFeatures();

    const featuresByStatus = useMemo(() => {
        return {
            completed: features.filter(f => f.status === 'completed'),
            'in-progress': features.filter(f => f.status === 'in-progress'),
            planned: features.filter(f => f.status === 'planned'),
            'on-hold': features.filter(f => f.status === 'on-hold'),
        };
    }, [features]); const StatusSection = ({
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
                                {featuresByStatus.completed.length}
                            </div>
                            <div className="text-sm text-gray-600">Completed</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                    className="bg-green-600 h-2 rounded-full" style={{
                                        width: `${(featuresByStatus.completed.length / features.length) * 100}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                {featuresByStatus['in-progress'].length}
                            </div>
                            <div className="text-sm text-gray-600">In Progress</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full" style={{
                                        width: `${(featuresByStatus['in-progress'].length / features.length) * 100}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-yellow-600 mb-2">
                                {featuresByStatus.planned.length}
                            </div>
                            <div className="text-sm text-gray-600">Planned</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                    className="bg-yellow-600 h-2 rounded-full" style={{
                                        width: `${(featuresByStatus.planned.length / features.length) * 100}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-red-600 mb-2">
                                {featuresByStatus['on-hold'].length}
                            </div>
                            <div className="text-sm text-gray-600">On Hold</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                    className="bg-red-600 h-2 rounded-full" style={{
                                        width: `${(featuresByStatus['on-hold'].length / features.length) * 100}%`
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
            </div>
        </div>
    );
}
