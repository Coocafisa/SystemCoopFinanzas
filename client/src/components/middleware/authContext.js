"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { getSession } from "../../api/requestServices/sessionService";
import InactivityHandler from "@/components/middleware/InactivityHandler";
import { Loader } from "@/components/common/preloader";
import { logError } from "../utils/logger";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [dataUser, setDataUser] = useState(null);
    const [dataRole, setDataRole] = useState(null);
    const [timeExpiration, setTimeExpiration] = useState(null);
    const [loading, setLoading] = useState(true);
    const isMounted = useRef(true);

    const resetAuth = () => {
        setDataUser(null);
        setDataRole(null);
        setTimeExpiration(null);
    };

    const refreshSession = async () => {
        try {
            const session = await getSession();
            if (session?.isAuthenticated) {
                if (isMounted.current) {
                    setDataUser(session.user);
                    setDataRole(session.role);
                    setTimeExpiration(session.expiration);
                }
            } else {
                resetAuth();
            }
        } catch (error) {
            logError(error);
        }
    };

    useEffect(() => {
        isMounted.current = true;

        const checkSession = async () => {
            await refreshSession();
            if (isMounted.current) {
                setLoading(false);
            }
        };

        checkSession();

        const executeSessionCheck = () => {
            checkSession();
            setTimeout(executeSessionCheck, 2 * 60 * 1000);
        };

        const timeout = setTimeout(executeSessionCheck, 2 * 60 * 1000);

        return () => {
            isMounted.current = false;
            clearTimeout(timeout);
        };
    }, []);

    return loading ? (
        <Loader type={"info"} message={"Cargando..."} isLoading={true} />
    ) : (
        <AuthContext.Provider value={{ dataUser, dataRole, timeExpiration, loading }}>
            <InactivityHandler timeRemaining={timeExpiration} />
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
