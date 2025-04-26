import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          console.log('AuthContext: Verifying token');
          const response = await auth.verifyToken();
          console.log('AuthContext: Token verification response:', response);
          
          if (response && response.data) {
            setUser(response.data);
            // If we're on login page and have valid token, redirect to dashboard
            if (window.location.pathname === '/login') {
              console.log('AuthContext: Redirecting to dashboard from login page');
              navigate('/dashboard', { replace: true });
            }
          }
        } catch (error) {
          console.error('AuthContext: Token verification failed:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          // Only redirect to login if not already there
          if (!window.location.pathname.includes('/login')) {
            console.log('AuthContext: Redirecting to login page');
            navigate('/login', { replace: true });
          }
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, [token, navigate]);

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Attempting login');
      const response = await auth.login({ email, password });
      console.log('AuthContext: Login response:', response);
      
      if (response && response.data && response.data.token) {
        const { token: newToken, user: userData } = response.data;
        console.log('AuthContext: Setting token and user data');
        
        // Store token and update state
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
        
        // Navigate to dashboard
        console.log('AuthContext: Navigating to dashboard');
        navigate('/dashboard', { replace: true });
        
        return response;
      } else {
        console.error('AuthContext: Invalid login response:', response);
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      // Clear any existing token on error
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      throw error;
    }
  };

  const register = async (email, password) => {
    try {
      const response = await auth.register(email, password);
      // After successful registration, automatically log in
      const loginResponse = await auth.login({ email, password });
      const { token: newToken, user: userData } = loginResponse.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      return loginResponse;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    // Only redirect to login if not already there
    if (!window.location.pathname.includes('/login')) {
      navigate('/login', { replace: true });
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 