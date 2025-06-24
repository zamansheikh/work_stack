'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useUserMutations } from '@/lib/hooks';
import { userApi } from '@/lib/api';
import { User, UpdateUserRequest } from '@/types';
import { UserCog, Save, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function EditUserPage() {
    const { user: currentUser, isAuthenticated, isLoading: authLoading } = useAuth();
    const { updateUser, isLoading, error, clearError } = useUserMutations();
    const router = useRouter();
    const params = useParams();
    const userId = params?.id as string;

    const [userData, setUserData] = useState<User | null>(null);
    const [formData, setFormData] = useState<UpdateUserRequest>({
        name: '',
        email: '',
        role: 'admin',
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null); useEffect(() => {
        const loadUser = async () => {
            try {
                setIsLoadingUser(true);
                setLoadError(null);
                const user = await userApi.getById(userId);
                setUserData(user);
                setFormData({
                    name: user.name || '',
                    email: user.email,
                    role: user.role === 'superadmin' ? 'superadmin' : user.role,
                });
            } catch (err) {
                setLoadError(err instanceof Error ? err.message : 'Failed to load user');
            } finally {
                setIsLoadingUser(false);
            }
        };

        if (!authLoading && (!isAuthenticated || currentUser?.role !== 'superadmin')) {
            router.push('/admin');
            return;
        } if (userId && isAuthenticated) {
            loadUser();
        }
    }, [userId, authLoading, isAuthenticated, currentUser, router]);

    if (authLoading || isLoadingUser) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated || currentUser?.role !== 'superadmin') {
        return null;
    }

    if (loadError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading User</h3>
                    <p className="text-gray-600 mb-4">{loadError}</p>
                    <Link
                        href="/admin/users"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Back to Users
                    </Link>
                </div>
            </div>
        );
    }

    if (!userData) {
        return null;
    }

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.name?.trim()) {
            errors.name = 'Name is required';
        } if (!formData.email?.trim()) {
            errors.email = 'Email or username is required';
        }
        // Removed strict email validation to allow usernames

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearError();

        if (!validateForm()) {
            return;
        }

        try {
            await updateUser(userId, formData);
            router.push('/admin/users');
        } catch {
            // Error is handled by the hook
        }
    };

    const handleInputChange = (field: keyof UpdateUserRequest, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear validation error when user starts typing
        if (validationErrors[field]) {
            setValidationErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const isCurrentUser = userData.id === currentUser?.id;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <Link
                                href="/admin/users"
                                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    Update user information and permissions
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center mb-6">
                            <div className="rounded-full bg-blue-100 p-3 mr-4">
                                <UserCog className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    User Information
                                </h3>
                                {isCurrentUser && (
                                    <p className="text-sm text-yellow-600 mt-1">
                                        You are editing your own account
                                    </p>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertCircle className="h-5 w-5 text-red-400" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">
                                            Error Updating User
                                        </h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            {error}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        required
                                        value={formData.name || ''}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${validationErrors.name ? 'border-red-300' : ''
                                            }`}
                                        placeholder="Enter full name"
                                        disabled={isLoading}
                                    />
                                    {validationErrors.name && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                                    )}
                                </div>                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email or Username
                                    </label>
                                    <input
                                        type="text"
                                        name="email"
                                        id="email"
                                        required
                                        value={formData.email || ''} onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${validationErrors.email ? 'border-red-300' : ''
                                            }`}
                                        placeholder="Enter email or username"
                                        disabled={isLoading}
                                    />
                                    {validationErrors.email && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-500">
                                        You can enter either an email address or a username
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role || 'admin'}
                                    onChange={(e) => handleInputChange('role', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    disabled={isLoading || isCurrentUser} // Prevent users from changing their own role
                                >
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                    {userData.role === 'superadmin' && (
                                        <option value="superadmin">Super Admin</option>
                                    )}
                                </select>
                                <p className="mt-1 text-sm text-gray-500">
                                    {isCurrentUser
                                        ? 'You cannot change your own role.'
                                        : 'Admin users can manage features and content. Regular users have read-only access.'
                                    }
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-md">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Account Status</h4>
                                <div className="flex items-center space-x-2">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${userData.enabled
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {userData.enabled ? 'Active' : 'Disabled'}
                                    </span>
                                    {userData.lastLogin && (
                                        <span className="text-sm text-gray-500">
                                            Last login: {new Date(userData.lastLogin).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    Account status can be changed from the users list page.
                                </p>
                            </div>

                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                <Link
                                    href="/admin/users"
                                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Updating...
                                        </div>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Update User
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
