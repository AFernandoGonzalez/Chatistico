// src/context/UserContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserProfile, updateUserProfile } from '../services/api';
import { AuthContext } from './AuthContext';

// Create the context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  // Fetch user profile when user is logged in
  useEffect(() => {
    if (user) {
      getUserProfile().then(setProfile);
    }
  }, [user]);

  // Update user profile function
  const updateProfile = async (username, email, notifications) => {
    const updatedProfile = await updateUserProfile(username, email, notifications);
    setProfile(updatedProfile);
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};
