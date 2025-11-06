import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        setUser({ email: userEmail });
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await auth.login(email, password);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('userEmail', email);
      setIsAuthenticated(true);
      setUser({ email });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid email or password';
      throw new Error(errorMessage);
    }
  };

  const register = async (email: string, password: string, confirmPassword: string) => {
    try {
      const response = await auth.register(email, password, confirmPassword);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('userEmail', email);
      setIsAuthenticated(true);
      setUser({ email });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 