'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Feature } from '@/types';
import { useFeatureMutations } from '@/lib/hooks';
import { useAuth } from '@/lib/auth-context';
import { featuresApi, handleApiError } from '@/lib/api';
import { Save, X, Upload, FileText, Image as ImageIcon, Trash2 } from 'lucide-react';

interface FeatureFormProps {
    feature?: Feature;
    onSave?: (feature: Feature) => void;
    onCancel?: () => void;
}

export default function FeatureForm({ feature, onSave, onCancel }: FeatureFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        purpose: '',
        implementation: '',
        technicalDetails: '',
        status: 'planned' as Feature['status'],
        priority: 'medium' as Feature['priority'],
        tags: [] as string[],
        author: '',
    }); const [tagInput, setTagInput] = useState('');
    const [attachments, setAttachments] = useState<Feature['attachments']>([]);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const { createFeature, updateFeature, isLoading, error, clearError } = useFeatureMutations();
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (feature) {
            setFormData({
                name: feature.name,
                description: feature.description,
                purpose: feature.purpose,
                implementation: feature.implementation,
                technicalDetails: feature.technicalDetails,
                status: feature.status,
                priority: feature.priority,
                tags: feature.tags || [],
                author: feature.author,
            });
            setAttachments(feature.attachments || []);
        } else if (user) {
            setFormData(prev => ({
                ...prev,
                author: user.name || user.email,
            }));
        }
    }, [feature, user]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        clearError();
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    }; const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        // For new features, just store the files to upload after creation
        if (!feature) {
            setPendingFiles(prev => [...prev, ...Array.from(files)]);
            return;
        }

        // For existing features, upload immediately
        setUploading(true);
        setUploadError(null);

        try {
            const newAttachments = await featuresApi.uploadAttachments(feature.id, Array.from(files));
            setAttachments(prev => [...prev, ...newAttachments]);
        } catch (err) {
            setUploadError(handleApiError(err));
        } finally {
            setUploading(false);
        }
    }; const handleRemoveAttachment = (attachmentId: string) => {
        setAttachments(prev => prev.filter(att => att.id !== attachmentId));
    }; const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        const featureData = {
            ...formData,
            // Don't include attachments in create/update - they're handled separately
        };

        try {
            let savedFeature: Feature;

            if (feature) {
                // Update existing feature
                savedFeature = await updateFeature(feature.id, featureData);
            } else {
                // Create new feature
                savedFeature = await createFeature(featureData);

                // Upload pending files for new feature
                if (pendingFiles.length > 0) {
                    setUploading(true);
                    try {
                        await featuresApi.uploadAttachments(savedFeature.id, pendingFiles);
                    } catch (uploadErr) {
                        setUploadError(handleApiError(uploadErr));
                        // Continue despite upload error
                    } finally {
                        setUploading(false);
                    }
                }
            }

            if (onSave) {
                onSave(savedFeature);
            } else {
                router.push(`/features/${savedFeature.id}`);
            }
        } catch {
            // Error is handled by the hook
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            router.back();
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="bg-white rounded-xl shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {feature ? 'Edit Feature' : 'Create New Feature'}
                    </h2>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Feature Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Enter feature name"
                            />
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                Status *
                            </label>
                            <select
                                id="status"
                                name="status"
                                required
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="planned">Planned</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="on-hold">On Hold</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                                Priority *
                            </label>
                            <select
                                id="priority"
                                name="priority"
                                required
                                value={formData.priority}
                                onChange={handleInputChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                rows={3}
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Brief description of the feature"
                            />
                        </div>
                    </div>
                </div>

                {/* Detailed Information */}
                <div className="bg-white rounded-xl shadow-md p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Detailed Information</h3>

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                                Purpose & Business Value *
                            </label>
                            <textarea
                                id="purpose"
                                name="purpose"
                                required
                                rows={4}
                                value={formData.purpose}
                                onChange={handleInputChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Explain why this feature is needed and what value it provides"
                            />
                        </div>

                        <div>
                            <label htmlFor="implementation" className="block text-sm font-medium text-gray-700 mb-2">
                                Implementation Approach *
                            </label>
                            <textarea
                                id="implementation"
                                name="implementation"
                                required
                                rows={4}
                                value={formData.implementation}
                                onChange={handleInputChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Describe how this feature will be implemented"
                            />
                        </div>

                        <div>
                            <label htmlFor="technicalDetails" className="block text-sm font-medium text-gray-700 mb-2">
                                Technical Details *
                            </label>
                            <textarea
                                id="technicalDetails"
                                name="technicalDetails"
                                required
                                rows={4}
                                value={formData.technicalDetails}
                                onChange={handleInputChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Technical specifications, architecture, dependencies, etc."
                            />
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div className="bg-white rounded-xl shadow-md p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Tags</h3>

                    <div className="flex items-center space-x-2 mb-4">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Add a tag"
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Add
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Attachments */}
                <div className="bg-white rounded-xl shadow-md p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Attachments</h3>

                    <div className="mb-6">
                        <label className="block">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                disabled={uploading}
                                className="sr-only"
                            />
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">
                                    {uploading ? 'Uploading...' : 'Click to upload files or drag and drop'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Images, documents, and other files
                                </p>
                            </div>
                        </label>
                    </div>

                    {uploadError && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {uploadError}
                        </div>
                    )}

                    {attachments.length > 0 && (
                        <div className="grid gap-4">
                            {attachments.map((attachment) => (
                                <div
                                    key={attachment.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            {attachment.fileType.startsWith('image/') ? (
                                                <ImageIcon className="w-6 h-6 text-green-600" />
                                            ) : (
                                                <FileText className="w-6 h-6 text-blue-600" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{attachment.fileName}</p>
                                            <p className="text-sm text-gray-500">
                                                {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveAttachment(attachment.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4 bg-white rounded-xl shadow-md p-6">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || uploading}
                        className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        {feature ? 'Update Feature' : 'Create Feature'}
                    </button>
                </div>
            </form>
        </div>
    );
}
