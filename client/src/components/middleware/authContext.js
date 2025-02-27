"use client";
import { createContext, useContext, useState, useEffect} from "react";
import { getSession } from "../../api/requestServices/sessionService";
import InactivityHandler from "@/components/middleware/InactivityHandler";
import { Loader } from "@/components/common/preloader";

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
    useEffect(() => {
        const checkSession = async () => {
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
                resetAuth();
            } finally {
                setLoading(false);
            }
        };
        checkSession();
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