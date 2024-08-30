import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext'; // Import the AuthContext
import { updateProfile } from '../services/api'; // Import the API function for updating the profile

const Profile = () => {
  const { user } = useContext(AuthContext); // Use AuthContext to get the current user
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      // Assume `notifications` setting is part of user data
      setNotifications(user.notifications || true);
    }
  }, [user]);

  const handleSaveSettings = async () => {
    try {
      await updateProfile(user.id, { username, email, notifications });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Settings</h1>
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">
          Notifications:
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            className="ml-2"
          />
        </label>
      </div>
      <button
        onClick={handleSaveSettings}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Save Settings
      </button>
    </div>
  );
};

export default Profile;
