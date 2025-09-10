import axios from "axios";
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import AuthContext from "./authContextInstance";


export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    const authInProgress = useRef(false);

    const checkAuth = async () => {
        if (authInProgress.current) {
            return;
        }

        authInProgress.current = true;

        try {
            const res = await axios.get("/api/get/user", { withCredentials: true });

            setIsLoggedIn(res.data.success);

            if (res.data.success) {
                setUserData(res.data.data.user);
            }
        } catch (error) {
            console.error("Erro ao verificar autenticação:", error);
            setIsLoggedIn(false);
            setUserData(null);
        } finally {
            setIsLoading(false);
            authInProgress.current = false;
        }
    };

    const getUserData = async () => {
        if (!isLoggedIn) return;

        try {
            const res = await axios.get("/api/get/user", { withCredentials: true });
            setUserData(res.data.data.user);
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
            setUserData(null);
        }
    };

    const clear = () => {
        setIsLoggedIn(false);
        setUserData(null);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                userData,
                setUserData,
                getUserData,
                isLoading,
                clearUserData: clear
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
