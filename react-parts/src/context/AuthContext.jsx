/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import * as authAPI from '../api/auth';
import { getProfile } from '../api/profile';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const run = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setIsLoading(false);
                return;
            }
            try {
                const data = await getProfile();
                setUser(data);
            } catch {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            } finally {
                setIsLoading(false);
            }
        };
        run();
    }, []);

    const login = async (email, password) => {
        const data = await authAPI.login(email, password);
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        const profile = await getProfile();
        setUser(profile);
        return profile;
    };

    const register = async (email, username, password1, password2, role) => {
        const data = await authAPI.register(email, username, password1, password2, role);
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
