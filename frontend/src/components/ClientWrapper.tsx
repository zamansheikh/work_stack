'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AuthProvider } from '@/lib/auth-context';

interface ClientWrapperProps {
    children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render anything on the server to prevent hydration mismatch
    if (!mounted) {
        return <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }} />;
    }

    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}
