import Link from 'next/link';
import { Feature } from '@/types';
import { Calendar, User, Tag, Paperclip, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
    feature: Feature;
    className?: string;
}

const FeatureCard = ({ feature, className }: FeatureCardProps) => {
    const getStatusColor = (status: Feature['status']) => {
        switch (status) {
            case 'completed':
            case 'in-progress':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'planned':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'on-hold':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPriorityColor = (priority: Feature['priority']) => {
        switch (priority) {
            case 'critical':
                return 'bg-red-500';
            case 'high':
                return 'bg-orange-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'low':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className={cn(
            "bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col min-h-[480px]",
            className
        )}>
            {/* Content Body */}
            <div className="flex flex-col flex-grow">
                {/* Header */}
                <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                            <div className={cn("w-3 h-3 rounded-full", getPriorityColor(feature.priority))} />
                            <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium border",
                                getStatusColor(feature.status)
                            )}>
                                {feature.status.charAt(0).toUpperCase() + feature.status.slice(1).replace('-', ' ')}
                            </span>
                        </div>
                        {feature.attachments.length > 0 && (
                            <div className="flex items-center text-gray-500">
                                <Paperclip className="w-4 h-4 mr-1" />
                                <span className="text-sm">{feature.attachments.length}</span>
                            </div>
                        )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {feature.name}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {feature.description}
                    </p>
                </div>

                {/* Purpose Section */}
                <div className="px-6 pb-4">
                    <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-green-900 mb-2">Why this feature?</h4>
                        <p className="text-green-800 text-sm line-clamp-3">
                            {feature.purpose}
                        </p>
                    </div>
                </div>

                {/* Tags */}
                {feature.tags.length > 0 && (
                    <div className="px-6 pb-4 mt-auto">
                        <div className="flex flex-wrap gap-2">
                            {feature.tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                                >
                                    <Tag className="w-3 h-3 mr-1" />
                                    {tag}
                                </span>
                            ))}
                            {feature.tags.length > 3 && (
                                <span className="text-xs text-gray-500">+{feature.tags.length - 3} more</span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {feature.author}
                        </div>
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(feature.updatedAt).toLocaleDateString()}
                        </div>
                    </div>

                    <Link
                        href={`/features/${feature.id}`}
                        className="flex items-center text-[#8BC342] hover:text-[#6fa332] font-medium transition-colors"
                    >
                        View Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FeatureCard;
