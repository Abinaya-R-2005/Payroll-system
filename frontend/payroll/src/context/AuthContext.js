import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('payroll_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // 🔐 REAL LOGIN USING BACKEND
    const login = async (email, password, role) => {
  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message); // User not found / Invalid password
      return false;
    }

    const userData = {
      email,
      role: data.role,
      employeeId: data.employeeId
    };

    setUser(userData);
    localStorage.setItem("payroll_user", JSON.stringify(userData));
    return true;

  } catch (err) {
    alert("Backend server not reachable");
    return false;
  }
};



    const logout = () => {
        setUser(null);
        localStorage.removeItem("payroll_user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
