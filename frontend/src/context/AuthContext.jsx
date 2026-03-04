import { createContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const timeout = setTimeout(() => {
                setLoading(false);
            }, 5000); // 5s timeout safety

            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await authService.getMe();
                    setUser(userData);
                } catch (error) {
                    localStorage.removeItem('token');
                }
            }
            clearTimeout(timeout);
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (userData) => {
        const data = await authService.login(userData);
        const { token, ...userWithoutToken } = data;
        setUser(userWithoutToken);
        return data;
    };

    const register = async (userData) => {
        const data = await authService.register(userData);
        const { token, ...userWithoutToken } = data;
        setUser(userWithoutToken);
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const userData = await authService.getMe();
            setUser(userData);
        } catch (error) {
            console.error('Failed to refresh user data:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, refreshUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
