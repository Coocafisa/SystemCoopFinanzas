"use client";
import { useEffect } from 'react';
import { useAuth } from '@/components/middleware/authContext';

export function ProtectedRoute({ children, allowedRoles = [] }) {
    const { dataUser, loading, dataRole } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (!dataUser) {
                window.location.href = ("/")
            } else if (allowedRoles.length > 0 && !allowedRoles.includes(dataRole)) {
                window.location.href = ("/");
            }
        }
    }, [dataUser, loading, dataRole, allowedRoles]);

    return dataUser && (!allowedRoles.length === 0 || allowedRoles.includes(dataRole)) ? children : null;
};