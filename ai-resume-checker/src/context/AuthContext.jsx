import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const updateUser = (updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userData = await authService.getMe();
          let profileData = null;
          try {
            const { profileService } = await import('../services/profileService');
            profileData = await profileService.getProfile();
          } catch (e) {
            console.error('No profile found or error fetching profile');
          }
          
          setIsAuthenticated(true);
          setUser({ 
            ...userData,
            name: profileData?.full_name || userData.full_name || userData.email,
            avatar: profileData?.profile_photo || null
          });
        } catch (error) {
          console.error('Failed to load user session', error);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('access_token', token);
    setIsAuthenticated(true);
    setUser({ name: userData.full_name || userData.email, ...userData });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const isAdmin = user?.email === 'prudhvibehara34@gmail.com';

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, updateUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
