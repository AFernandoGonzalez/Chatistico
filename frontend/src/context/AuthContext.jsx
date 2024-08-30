import React, { createContext, useState, useEffect } from 'react';
import { loginUser, signupUser, logoutUser } from '../services/api';

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null); // State to manage authentication errors

  // Check if the user is already logged in (e.g., via a token in localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null); // Reset any existing errors
    try {
      const user = await loginUser(email, password);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Login error:', error);
      setAuthError('Failed to log in. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (email, password) => {
    setLoading(true);
    setAuthError(null); // Reset any existing errors
    try {
      const user = await signupUser(email, password);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Signup error:', error);
      setAuthError('Failed to sign up. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    setAuthError(null); // Reset any existing errors
    try {
      await logoutUser();
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      setAuthError('Failed to log out. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, authError }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
