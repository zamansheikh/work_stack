'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User } from '@/types';
import { authApi, tokenManager, handleApiError } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (emailOrUsername: string, password: string) => Promise<void>;
    logout: () => void;
    error: string | null;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    // Wait for client-side mounting
    useEffect(() => {
        setMounted(true);
    }, []);

    const clearError = () => setError(null); const login = async (emailOrUsername: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);
            const { user: loggedInUser } = await authApi.login(emailOrUsername, password);
            setUser(loggedInUser);
        } catch (err) {
            const errorMessage = handleApiError(err);
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authApi.logout();
        setUser(null);
    };

    const checkAuthStatus = useCallback(async () => {
        if (!mounted) return;

        if (!tokenManager.isAuthenticated()) {
            setIsLoading(false);
            return;
        }

        try {
            const currentUser = await authApi.getCurrentUser();
            setUser(currentUser);
        } catch {
            tokenManager.removeToken();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, [mounted]);

    useEffect(() => {
        if (mounted) {
            checkAuthStatus();
        }
    }, [mounted, checkAuthStatus]);

    // Don't render anything until mounted to avoid hydration issues
    if (!mounted) {
        return null;
    }

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        error,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
