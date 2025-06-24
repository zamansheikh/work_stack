'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useChangePassword } from '@/lib/hooks';
import { ChangePasswordRequest } from '@/types';
import { Lock, Save, ArrowLeft, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ChangePasswordPage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { changePassword, isLoading, error, clearError } = useChangePassword();
    const router = useRouter();

    const [formData, setFormData] = useState<ChangePasswordRequest>({
        currentPassword: '',
        newPassword: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState(false);

    if (!authLoading && !isAuthenticated) {
        router.push('/login');
        return null;
    }

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.currentPassword) {
            errors.currentPassword = 'Current password is required';
        }

        if (!formData.newPassword) {
            errors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 6) {
            errors.newPassword = 'New password must be at least 6 characters';
        }

        if (formData.newPassword !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (formData.currentPassword === formData.newPassword) {
            errors.newPassword = 'New password must be different from current password';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearError();
        setSuccess(false);

        if (!validateForm()) {
            return;
        }

        try {
            await changePassword(formData);
            setSuccess(true);
            setFormData({ currentPassword: '', newPassword: '' });
            setConfirmPassword('');

            // Auto redirect after 3 seconds
            setTimeout(() => {
                router.push('/admin');
            }, 3000);
        } catch {
            // Error is handled by the hook
        }
    };

    const handleInputChange = (field: keyof ChangePasswordRequest, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear validation error when user starts typing
        if (validationErrors[field]) {
            setValidationErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <Link
                                href="/admin"
                                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    Update your account password
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center mb-6">
                            <div className="rounded-full bg-blue-100 p-3 mr-4">
                                <Lock className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Update Your Password
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Signed in as: {user?.name || user?.email}
                                </p>
                            </div>
                        </div>

                        {success && (
                            <div className="mb-6 rounded-md bg-green-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <CheckCircle className="h-5 w-5 text-green-400" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-green-800">
                                            Password Changed Successfully
                                        </h3>
                                        <div className="mt-2 text-sm text-green-700">
                                            Your password has been updated. You will be redirected to the dashboard shortly.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertCircle className="h-5 w-5 text-red-400" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">
                                            Error Changing Password
                                        </h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            {error}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                                    Current Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        name="currentPassword"
                                        id="currentPassword"
                                        required
                                        value={formData.currentPassword}
                                        onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10 ${validationErrors.currentPassword ? 'border-red-300' : ''
                                            }`}
                                        placeholder="Enter your current password"
                                        disabled={isLoading || success}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        disabled={isLoading || success}
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {validationErrors.currentPassword && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.currentPassword}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        name="newPassword"
                                        id="newPassword"
                                        required
                                        value={formData.newPassword}
                                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10 ${validationErrors.newPassword ? 'border-red-300' : ''
                                            }`}
                                        placeholder="Enter your new password"
                                        disabled={isLoading || success}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        disabled={isLoading || success}
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {validationErrors.newPassword && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.newPassword}</p>
                                )}
                                <p className="mt-1 text-sm text-gray-500">
                                    Password must be at least 6 characters long.
                                </p>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm New Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (validationErrors.confirmPassword) {
                                                setValidationErrors(prev => ({ ...prev, confirmPassword: '' }));
                                            }
                                        }}
                                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10 ${validationErrors.confirmPassword ? 'border-red-300' : ''
                                            }`}
                                        placeholder="Confirm your new password"
                                        disabled={isLoading || success}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={isLoading || success}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {validationErrors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                <Link
                                    href="/admin"
                                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isLoading || success}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Changing...
                                        </div>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Change Password
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
