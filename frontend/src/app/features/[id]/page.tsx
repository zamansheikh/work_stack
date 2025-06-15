'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useFeature } from '@/lib/hooks';
import { ArrowLeft, Calendar, User, Tag, Paperclip, Download, ExternalLink, FileText, Image as ImageIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FeatureDetailPage() {
    const params = useParams();
    const featureId = params.id as string;
    const { feature, isLoading, error, refetch, clearError } = useFeature(featureId);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'planned':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'on-hold':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPriorityColor = (priority: string) => {
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

    const handleRetry = () => {
        clearError();
        refetch();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-lg text-gray-600">Loading feature...</span>
                    </div>
                </div>
            </div>
        );
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
                    <div className="mt-8">
                        <Link
                            href="/"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Features
                        </Link>
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
                        <Link href="/" className="text-blue-600 hover:text-blue-700">
                            ← Back to Features
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Features
                    </Link>
                </div>

                {/* Header */}
                <div className="bg-white rounded-xl shadow-md p-8 mb-8">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className={cn("w-4 h-4 rounded-full", getPriorityColor(feature.priority))} />
                            <span className={cn(
                                "px-3 py-1 rounded-full text-sm font-medium border",
                                getStatusColor(feature.status)
                            )}>
                                {feature.status.charAt(0).toUpperCase() + feature.status.slice(1).replace('-', ' ')}
                            </span>
                            <span className="text-sm text-gray-500 capitalize">{feature.priority} Priority</span>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {feature.name}
                    </h1>

                    <p className="text-xl text-gray-600 mb-6">
                        {feature.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            {feature.author}
                        </div>
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Created {new Date(feature.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Updated {new Date(feature.updatedAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-8">
                    {/* Purpose */}
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why This Feature?</h2>
                        <div className="bg-blue-50 rounded-lg p-6">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                {feature.purpose}
                            </p>
                        </div>
                    </div>

                    {/* Implementation */}
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">How We&apos;re Building It</h2>
                        <div className="bg-green-50 rounded-lg p-6">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                {feature.implementation}
                            </p>
                        </div>
                    </div>

                    {/* Technical Details */}
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Details</h2>
                        <div className="bg-purple-50 rounded-lg p-6">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                {feature.technicalDetails}
                            </p>
                        </div>
                    </div>

                    {/* Tags */}
                    {feature.tags && feature.tags.length > 0 && (
                        <div className="bg-white rounded-xl shadow-md p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tags</h2>
                            <div className="flex flex-wrap gap-3">
                                {feature.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700"
                                    >
                                        <Tag className="w-4 h-4 mr-2" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Attachments */}
                    {feature.attachments && feature.attachments.length > 0 && (
                        <div className="bg-white rounded-xl shadow-md p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                <Paperclip className="w-6 h-6 mr-2" />
                                Attachments ({feature.attachments.length})
                            </h2>
                            <div className="grid gap-4">
                                {feature.attachments.map((attachment) => (
                                    <div
                                        key={attachment.id}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                {attachment.fileType.startsWith('image/') ? (
                                                    <ImageIcon className="w-8 h-8 text-green-600" />
                                                ) : (
                                                    <FileText className="w-8 h-8 text-blue-600" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{attachment.fileName}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB •
                                                    Uploaded {new Date(attachment.uploadedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <a
                                                href={attachment.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                            <a
                                                href={attachment.url}
                                                download={attachment.fileName}
                                                className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
