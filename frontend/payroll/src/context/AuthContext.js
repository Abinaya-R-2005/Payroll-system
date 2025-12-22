import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for persisted auth
        const storedUser = localStorage.getItem('payroll_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password, role) => {
        // Mock login logic
        const userData = { email, role, name: 'Test User' };
        setUser(userData);
        localStorage.setItem('payroll_user', JSON.stringify(userData));
        return true;
    };

    const register = (data) => {
        // Mock register logic
        console.log('Registered:', data);
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('payroll_user');
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
