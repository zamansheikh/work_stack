'use client';

import { useAuth } from '@/lib/auth-context';
import { useUsers, useUserMutations } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    Plus,
    Search,
    Users,
    Shield,
    ShieldCheck,
    ShieldX,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    Mail,
    User as UserIcon,
    Home
} from 'lucide-react';
import Link from 'next/link';

export default function UsersManagement() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { users, totalUsers, isLoading: usersLoading, error, refetch } = useUsers();
    const { toggleUser, deleteUser, isLoading: isMutating } = useUserMutations();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [userToToggle, setUserToToggle] = useState<{ id: string; enabled: boolean } | null>(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
        // Check if user is super admin
        if (!authLoading && isAuthenticated && user?.role !== 'superadmin') {
            router.push('/admin'); // Redirect to regular admin dashboard
        }
    }, [authLoading, isAuthenticated, user, router]);

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8BC342]"></div>
            </div>
        );
    }

    if (!isAuthenticated || user?.role !== 'superadmin') {
        return null;
    }

    const filteredUsers = users.filter(userItem =>
        userItem.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userItem.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userItem.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleClick = (userId: string, currentEnabled: boolean) => {
        setUserToToggle({ id: userId, enabled: !currentEnabled });
    };

    const handleToggleConfirm = async () => {
        if (!userToToggle) return;

        try {
            await toggleUser(userToToggle.id, userToToggle.enabled);
            setUserToToggle(null);
            refetch();
        } catch (error) {
            console.error('Failed to toggle user:', error);
        }
    };

    const handleToggleCancel = () => {
        setUserToToggle(null);
    };

    const handleDeleteClick = (userId: string) => {
        // Prevent super admin from deleting themselves
        if (userId === user?.id) {
            alert('You cannot delete your own account.');
            return;
        }
        setUserToDelete(userId);
    };

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;

        try {
            await deleteUser(userToDelete);
            setUserToDelete(null);
            refetch();
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const handleDeleteCancel = () => {
        setUserToDelete(null);
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'superadmin':
                return <ShieldCheck className="h-4 w-4" />;
            case 'admin':
                return <Shield className="h-4 w-4" />;
            default:
                return <UserIcon className="h-4 w-4" />;
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'superadmin':
                return 'bg-purple-100 text-purple-800';
            case 'admin':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Manage users and their permissions
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/admin"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8BC342]"
                            >
                                <Home className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Link>
                            <Link
                                href="/admin/users/new"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-[#8BC342] to-[#6fa332] hover:from-[#6fa332] hover:to-[#5c8a28] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8BC342]"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                New User
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Stats */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Users className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Total Users
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {totalUsers}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <CheckCircle className="h-6 w-6 text-green-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Active Users
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {users.filter(u => u.enabled).length}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <XCircle className="h-6 w-6 text-red-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Disabled Users
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {users.filter(u => !u.enabled).length}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Management */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="sm:flex sm:items-center sm:justify-between mb-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                All Users
                            </h3>
                            <div className="mt-3 sm:mt-0 sm:ml-4">
                                <div className="flex rounded-md shadow-sm">
                                    <div className="relative flex-grow focus-within:z-10">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search users..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="block w-full rounded-md border-gray-300 pl-10 focus:border-[#8BC342] focus:ring-[#8BC342] sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        {usersLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8BC342]"></div>
                            </div>
                        ) : (
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Last Login
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created
                                            </th>
                                            <th className="relative px-6 py-3">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredUsers.map((userItem) => (
                                            <tr key={userItem.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                <Mail className="h-5 w-5 text-gray-500" />
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {userItem.name || 'No Name'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {userItem.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(userItem.role)}`}>
                                                        {getRoleIcon(userItem.role)}
                                                        <span className="ml-1 capitalize">{userItem.role}</span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${userItem.enabled
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {userItem.enabled ? 'Active' : 'Disabled'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {userItem.lastLogin ? (
                                                        <div className="flex items-center">
                                                            <Clock className="h-4 w-4 mr-1" />
                                                            {new Date(userItem.lastLogin).toLocaleDateString()}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">Never</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(userItem.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={`/admin/users/${userItem.id}/edit`}
                                                            className="text-[#8BC342] hover:text-[#6fa332]"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                        <button
                                                            className={`${userItem.enabled ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'
                                                                }`}
                                                            onClick={() => handleToggleClick(userItem.id, userItem.enabled)}
                                                            disabled={isMutating || userItem.id === user?.id}
                                                            title={userItem.id === user?.id ? 'Cannot disable your own account' : ''}
                                                        >
                                                            {userItem.enabled ? <ShieldX className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                                                        </button>
                                                        <button
                                                            className="text-red-600 hover:text-red-900"
                                                            onClick={() => handleDeleteClick(userItem.id)}
                                                            disabled={isMutating || userItem.id === user?.id}
                                                            title={userItem.id === user?.id ? 'Cannot delete your own account' : ''}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredUsers.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No users found.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Toggle User Status Modal */}
            {userToToggle && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                                {userToToggle.enabled ? <ShieldCheck className="h-6 w-6 text-yellow-600" /> : <ShieldX className="h-6 w-6 text-yellow-600" />}
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mt-4">
                                {userToToggle.enabled ? 'Enable User' : 'Disable User'}
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    Are you sure you want to {userToToggle.enabled ? 'enable' : 'disable'} this user?
                                    {!userToToggle.enabled && ' The user will not be able to log in.'}
                                </p>
                            </div>
                            <div className="items-center px-4 py-3">
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={handleToggleCancel}
                                        className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                        disabled={isMutating}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleToggleConfirm}
                                        className={`px-4 py-2 text-white text-base font-medium rounded-md w-24 focus:outline-none focus:ring-2 disabled:opacity-50 ${userToToggle.enabled
                                                ? 'bg-green-600 hover:bg-green-700 focus:ring-green-300'
                                                : 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-300'
                                            }`}
                                        disabled={isMutating}
                                    >
                                        {isMutating ? 'Processing...' : (userToToggle.enabled ? 'Enable' : 'Disable')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {userToDelete && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mt-4">Delete User</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    Are you sure you want to delete this user? This action cannot be undone.
                                </p>
                            </div>
                            <div className="items-center px-4 py-3">
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={handleDeleteCancel}
                                        className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                        disabled={isMutating}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteConfirm}
                                        className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-24 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
                                        disabled={isMutating}
                                    >
                                        {isMutating ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
