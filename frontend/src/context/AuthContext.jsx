// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../config/firebaseConfig'; // Import Firebase Auth
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { createUserInDB } from '../services/api'; // Import the API to register users in the backend

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null); // State to manage authentication errors

  // Check if the user is already logged in via Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        localStorage.setItem('user', JSON.stringify(firebaseUser)); // Store the user in localStorage
      } else {
        setUser(null);
        localStorage.removeItem('user'); // Clear user data when logged out
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null); // Reset any existing errors
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      localStorage.setItem('user', JSON.stringify(userCredential.user));
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
      // Register the user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      console.log("userCredential.user: ",userCredential.user)

      // Now register the user in your backend database with the firebase_uid
      await createUserInDB(firebaseUser.uid, firebaseUser.email);

      // Set the user state in the context
      setUser(firebaseUser);
      localStorage.setItem('user', JSON.stringify(firebaseUser));
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
      await signOut(auth);
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
