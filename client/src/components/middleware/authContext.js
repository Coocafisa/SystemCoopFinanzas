"use client";
import { createContext, useContext, useState, useEffect} from "react";
import { getSession } from "../../api/requestServices/sessionService";
import InactivityHandler from "@/components/middleware/InactivityHandler";
import { Loader } from "@/components/common/preloader";
import { logError } from "../utils/logger";

const AuthContext = createContext();
export default function AuthProvider({ children }) {
    const [dataUser, setDataUser] = useState(null);
    const [dataRole, setDataRole] = useState(null);
    const [timeExpiration, setTimeExpiration] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const resetAuth = () => {
        setDataUser(null);
        setDataRole(null);
        setTimeExpiration(null);
    };
    const refreshSession = async () => {
        try {
            const session = await getSession();
            if (session.isAuthenticated) {
                setDataUser(session.user);
                setDataRole(session.role);
                setTimeExpiration(session.expiration);
            } else {
                resetAuth();
            }
        } catch (error) {
            logError(error);
            resetAuth();
        }
    };
    useEffect(() => {
        const checkSession = async () => {
            try {
                await refreshSession();
            } catch (error) {
                logError(error);
            } finally {
                setLoading(false);
            }
        };
        checkSession();
        const interval = setInterval(checkSession, 2 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);
    return loading ? (
        <Loader type={"info"} message={"Cargando..."} isLoading={true}/>
        ) : (        
        <AuthContext.Provider value={{ dataUser, dataRole, timeExpiration, loading}}>
            <InactivityHandler timeRemaining={timeExpiration}/>
            { children }
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}