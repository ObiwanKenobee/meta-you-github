import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import apiClient from '../services/ApiClient';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  ageGroup: string;
  role: string;
  preferences: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      apiClient.setToken(token);
      await loadUser();
    }
    setIsLoading(false);
  };

  const loadUser = async () => {
    try {
      const response = await apiClient.getUserProfile();
      if (response.success) {
        setUser(response.data);
      } else {
        // Try to refresh token
        const refreshed = await apiClient.refreshToken();
        if (refreshed) {
          const retryResponse = await apiClient.getUserProfile();
          if (retryResponse.success) {
            setUser(retryResponse.data);
          }
        } else {
          // Clear invalid tokens
          apiClient.clearToken();
        }
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      apiClient.clearToken();
    }
  };

  const login = async (credentials: any): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const response = await apiClient.login(credentials);
      
      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const response = await apiClient.register(userData);
      
      if (response.success) {
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      apiClient.clearToken();
    }
  };

  const refreshUser = async () => {
    if (apiClient.isAuthenticated()) {
      await loadUser();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};