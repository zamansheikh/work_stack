import { User } from '@/types';
import { Users, CheckCircle, XCircle, Shield } from 'lucide-react';

interface UserStatsProps {
    users: User[];
}

export function UserStats({ users }: UserStatsProps) {
    const stats = {
        total: users.length,
        active: users.filter(u => u.enabled).length,
        disabled: users.filter(u => !u.enabled).length,
        admins: users.filter(u => u.role === 'admin' || u.role === 'superadmin').length,
        superAdmins: users.filter(u => u.role === 'superadmin').length,
        regularUsers: users.filter(u => u.role === 'user').length,
    };

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
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
                                    {stats.total}
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
                                    {stats.active}
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
                            <Shield className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Admins
                                </dt>
                                <dd className="text-lg font-medium text-gray-900">
                                    {stats.admins}
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
                                    Disabled
                                </dt>
                                <dd className="text-lg font-medium text-gray-900">
                                    {stats.disabled}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
