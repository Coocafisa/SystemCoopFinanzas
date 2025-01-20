"use client";
import { useEffect } from 'react';
import { useAuth } from '@/api/auth/authContext';

export function ProtectedRoute({ children, allowedRoles = []}) {
    const auth = useAuth();
    const { user, loading, role } = auth;
    useEffect(() => {
        if (!loading) {
            if (!user) {
                window.location.href = '/'; 
            } else if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
                window.location.href = '/';
            }
        }
    }, [user, loading, role, allowedRoles]);
  
    if (loading) {
        return null;
    }   

    return user && (!allowedRoles.length === 0 || allowedRoles.includes(role)) ? children : null;
}
