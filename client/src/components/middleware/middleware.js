"use client";
import { useEffect } from 'react';
import { useAuth } from '@/api/requestAuth/authContext';
import { useRouter } from 'next/navigation';

export function ProtectedRoute({ children, allowedRoles = [] }) {
    const router = useRouter();
    const { dataUser, loading, dataRole } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (!dataUser) {
                window.location.href = ("/")
            } else if (allowedRoles.length > 0 && !allowedRoles.includes(dataRole)) {
                window.location.href = ("/");
            }
        }
    }, [dataUser, loading, dataRole, allowedRoles, router]);

    return dataUser && (!allowedRoles.length === 0 || allowedRoles.includes(dataRole)) ? children : null;
}

