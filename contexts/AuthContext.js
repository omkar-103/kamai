'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('🔍 Checking auth, token:', token ? 'Present' : 'Missing');
      
      if (!token) {
        console.log('❌ No token found');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/verify', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('🔍 Auth verify response:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Auth verified for user:', data.user?.email);
        setUser(data.user);
      } else {
        console.log('❌ Auth verification failed:', response.status);
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('🚨 Auth check error:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('🔍 Login response:', response.status, data.success);

      if (data.success) {
        console.log('✅ Login successful, storing token');
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        setShowLoginModal(false);
        return { success: true };
      } else {
        console.log('❌ Login failed:', data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('🚨 Login network error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    console.log('🚪 Logging out');
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        showLoginModal,
        setShowLoginModal,
        showSignupModal,
        setShowSignupModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};