import axios from "axios";
export async function verifyAuth() {
    try {
        const res = await axios.get("/api/get/user/status");
        
        return res.status === 200 && res.data.success;
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
        return false;
    }
}


import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useRedirectIfAuthenticated = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthStatus = async () => {
            const isAuthenticated = await verifyAuth();
            if (isAuthenticated) {
                navigate("/", { replace: true });
            }
        };

        checkAuthStatus();

        document.body.classList.add('loginPage');
        return () => {
            document.body.classList.remove('loginPage');
        };
    }, []);
};
