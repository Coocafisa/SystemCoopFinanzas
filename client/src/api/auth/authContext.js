"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { getSession } from '../authenticated/sessionService';
import { Loader } from '@/components/common/preloader';
import { useAlertState } from '@/components/utils/alertState';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [expiration, setExpiration] = useState(null);
    const { alert, setAlert, type, setType, loading, setLoading } = useAlertState();

    const resetAuth = () => {
        setUser(null);
        setRole(null);
    };

    useEffect(() => {
        const checkSession = async () => {
            try {
                
                const { isAuthenticated, user, role, expiration } = await getSession();
                console.log( isAuthenticated, user, role, expiration);

                if (isAuthenticated) {
                    setUser(user);
                    setRole(role);
                    setExpiration(expiration);
                } else {
                    resetAuth();
                    setAlert("No has iniciado sesión.");
                    setType("info");
                }
            } catch (error){
                setAlert("Error al iniciar sesión.");
                setType("error");
                resetAuth();
            } finally {
                    setLoading(false);
            }
        };
        checkSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, expiration, loading }}>
            {loading ? <Loader alert={alert} type={type} /> : children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}