import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUser, setUser as saveUser, removeUser, getToken } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = getToken();
    const savedUser = getUser();
    if (token && savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    saveUser(userData);
  };

  const logout = () => {
    setUser(null);
    removeUser();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
