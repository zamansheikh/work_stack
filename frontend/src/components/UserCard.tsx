import { User } from '@/types';
import {
    Shield,
    ShieldCheck,
    ShieldX,
    User as UserIcon,
    CheckCircle,
    XCircle,
    Clock,
    Mail
} from 'lucide-react';

interface UserCardProps {
    user: User;
    currentUserId?: string;
    onEdit: (userId: string) => void;
    onToggle: (userId: string, enabled: boolean) => void;
    onDelete: (userId: string) => void;
    isMutating?: boolean;
}

export function UserCard({
    user,
    currentUserId,
    onEdit,
    onToggle,
    onDelete,
    isMutating = false
}: UserCardProps) {
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
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const isCurrentUser = user.id === currentUserId;

    return (
        <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <Mail className="h-6 w-6 text-gray-500" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                                {user.name || 'No Name'}
                            </h3>
                            {isCurrentUser && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                    You
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-2">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                {getRoleIcon(user.role)}
                                <span className="ml-1 capitalize">{user.role}</span>
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.enabled
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                {user.enabled ? (
                                    <>
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Active
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Disabled
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onEdit(user.id)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        disabled={isMutating}
                    >
                        <UserIcon className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onToggle(user.id, user.enabled)}
                        className={`p-1 ${user.enabled ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'
                            }`}
                        disabled={isMutating || isCurrentUser}
                        title={isCurrentUser ? 'Cannot disable your own account' : ''}
                    >
                        {user.enabled ? <ShieldX className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                    </button>
                    <button
                        onClick={() => onDelete(user.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        disabled={isMutating || isCurrentUser}
                        title={isCurrentUser ? 'Cannot delete your own account' : ''}
                    >
                        <XCircle className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                    Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                </span>
                <span className="mx-2">•</span>
                <span>
                    Created: {new Date(user.createdAt).toLocaleDateString()}
                </span>
            </div>
        </div>
    );
}
