import React, { useState } from 'react';

const Settings = () => {
  const [username, setUsername] = useState(''); // Example state for a username
  const [email, setEmail] = useState(''); // Example state for an email
  const [notifications, setNotifications] = useState(true); // Example state for notifications

  const handleSaveSettings = () => {
    // Logic to save settings
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Settings</h1>
      
      {/* User Information */}
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

      {/* Notification Preferences */}
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

      {/* Save Button */}
      <button
        onClick={handleSaveSettings}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Save Settings
      </button>
    </div>
  );
};

export default Settings;
