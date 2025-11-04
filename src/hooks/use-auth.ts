import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/lib/api';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (!token || !userStr) {
        setAuthState({ isAuthenticated: false, isLoading: false, user: null });
        return;
      }

      // Try to get current user from backend to verify token is still valid
      try {
        const response = await authAPI.getCurrentUser();
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: response.user,
        });
      } catch (error) {
        // Token is invalid, clear it
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        setAuthState({ isAuthenticated: false, isLoading: false, user: null });
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setAuthState({ isAuthenticated: false, isLoading: false, user: null });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.success) {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: response.user,
        });
        return response;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({ isAuthenticated: false, isLoading: false, user: null });
      navigate('/', { replace: true });
    }
  };

  return {
    ...authState,
    login,
    logout,
    checkAuth,
  };
}

// Simple helper for checking if user is authenticated
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
}
