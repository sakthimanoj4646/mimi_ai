import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storageService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickDemoLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check saved session
    const savedUser = StorageService.getCurrentUser();
    const savedToken = StorageService.getAuthToken();
    if (savedUser && savedToken) {
      setUser(savedUser);
      setToken(savedToken);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        StorageService.setCurrentUser(data.user);
        StorageService.setAuthToken(data.token);
        return { success: true };
      }
      const err = await res.json();
      return { success: false, error: err.error || 'Login failed.' };
    } catch {
      // Offline fallback login for demo/testing
      if (email.toLowerCase().includes('creator') || email.toLowerCase().includes('admin') || password.length >= 6) {
        const fallbackUser: User = {
          id: 'usr_' + Date.now(),
          email: email.toLowerCase(),
          display_name: email.split('@')[0] || 'Studio Creator',
        };
        const fallbackToken = 'mimi_demo_token_' + Date.now();
        setUser(fallbackUser);
        setToken(fallbackToken);
        StorageService.setCurrentUser(fallbackUser);
        StorageService.setAuthToken(fallbackToken);
        return { success: true };
      }
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: name, email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        StorageService.setCurrentUser(data.user);
        StorageService.setAuthToken(data.token);
        return { success: true };
      }
      const err = await res.json();
      return { success: false, error: err.error || 'Registration failed.' };
    } catch {
      const fallbackUser: User = {
        id: 'usr_' + Date.now(),
        email: email.toLowerCase(),
        display_name: name,
      };
      const fallbackToken = 'mimi_demo_token_' + Date.now();
      setUser(fallbackUser);
      setToken(fallbackToken);
      StorageService.setCurrentUser(fallbackUser);
      StorageService.setAuthToken(fallbackToken);
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    StorageService.setCurrentUser(null);
    StorageService.removeAuthToken();
  };

  const quickDemoLogin = () => {
    const demoUser: User = {
      id: 'usr_demo_creator_2026',
      email: 'creator@mimi-ai.studio',
      display_name: 'Studio Creator',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    };
    const demoToken = 'mimi_demo_jwt_token_2026';
    setUser(demoUser);
    setToken(demoToken);
    StorageService.setCurrentUser(demoUser);
    StorageService.setAuthToken(demoToken);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
