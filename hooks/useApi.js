'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export const useApi = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const makeRequest = async (url, options = {}) => {
    const token = localStorage.getItem('authToken');
    console.log('🌐 Making request to:', url, 'Token:', token ? 'Present' : 'Missing');

    if (!token) {
      console.log('❌ No token available for request');
      logout();
      router.push('/login');
      return null;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      console.log('🔍 API Response:', url, response.status);

      if (response.status === 401) {
        console.log('🚨 Unauthorized - redirecting to login');
        logout();
        router.push('/login');
        return null;
      }

      return response;
    } catch (error) {
      console.error('🚨 API Request failed:', error);
      throw error;
    }
  };

  return { makeRequest };
};