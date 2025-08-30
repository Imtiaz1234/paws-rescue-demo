import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    user: null,
    loading: true,
  });

  useEffect(() => {
    if (auth.token) {
      try {
        const decoded = jwtDecode(auth.token);
        setAuth(prev => ({ ...prev, user: decoded.user, loading: false }));
      } catch {
        setAuth({ token: null, user: null, loading: false });
      }
    } else {
      setAuth(prev => ({ ...prev, loading: false }));
    }
  }, [auth.token]);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setAuth({ token, user: decoded.user, loading: false });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ token: null, user: null, loading: false });
  };

  const setUser = (user) => setAuth(prev => ({ ...prev, user }));

  return (
    <AuthContext.Provider value={{ auth, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
