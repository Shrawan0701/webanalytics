import React, { createContext, useState, useContext, useEffect } from 'react';
import api from './api';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setCurrentUser(JSON.parse(savedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;

        // Optionally verify token is still valid
        // await verifyToken();
      } catch (error) {
        console.error('Error initializing auth:', error);
        logout();
      }
    }

    setLoading(false);
  };

  const verifyToken = async () => {
    try {
      await api.get('/auth/validate');
    } catch (error) {
      console.error('Token validation failed:', error);
      logout();
      throw error;
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/signin', { username, password });
      const { accessToken, id, username: user, email } = response.data;

      const userData = { id, username: user, email };

      setToken(accessToken);
      setCurrentUser(userData);

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));

      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post('/auth/signup', { username, email, password });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  };

  const updateUser = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateUser,
    token,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
