'use client';

import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'piksel2025!';
const SESSION_KEY = 'piksel_admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        const sessionData = JSON.parse(session);
        const now = new Date().getTime();
        
        // Check if session is still valid
        if (sessionData.expires > now) {
          setIsAuthenticated(true);
        } else {
          // Session expired, remove it
          localStorage.removeItem(SESSION_KEY);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      const sessionData = {
        authenticated: true,
        expires: new Date().getTime() + SESSION_DURATION,
        timestamp: new Date().getTime()
      };
      
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
};
