

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserProfile, updateUserProfile } from '../services/api';
import { AuthContext } from './AuthContext';


export const UserContext = createContext();


export const UserProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  
  useEffect(() => {
    if (user) {
      getUserProfile().then(setProfile);
    }
  }, [user]);

  
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
