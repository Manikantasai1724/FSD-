import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    skillsTeach?: string[];
    skillsLearn?: string[];
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('se_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('se_token'));

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get('/auth/me');
      const userData = res.data;
      setUser(userData);
      localStorage.setItem('se_current_user', JSON.stringify(userData));
    } catch {
      // Token may be invalid
    }
  }, [token]);

  useEffect(() => {
    if (token && !user) {
      refreshUser();
    }
  }, [token, user, refreshUser]);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = res.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('se_token', newToken);
      localStorage.setItem('se_current_user', JSON.stringify(userData));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    }
  };

  const signup = async (data: {
    name: string;
    email: string;
    password: string;
    skillsTeach?: string[];
    skillsLearn?: string[];
  }) => {
    try {
      const res = await api.post('/auth/signup', data);
      const { token: newToken, user: userData } = res.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('se_token', newToken);
      localStorage.setItem('se_current_user', JSON.stringify(userData));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Signup failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('se_token');
    localStorage.removeItem('se_current_user');
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      const res = await api.put('/users/me', data);
      const updated = res.data;
      setUser(updated);
      localStorage.setItem('se_current_user', JSON.stringify(updated));
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn: !!user && !!token, login, signup, logout, updateUser, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
