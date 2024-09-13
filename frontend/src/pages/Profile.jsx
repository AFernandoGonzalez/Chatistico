import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updateProfile } from '../services/api';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [notifications, setNotifications] = useState(user?.notifications ?? true);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setNotifications(user.notifications ?? true);
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
    <div className="bg-background min-h-screen h-full py-8">
      <div className="container mx-auto max-w-4xl p-6">
        <h1 className="text-xl font-bold text-primary mb-8">Account Settings</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-600 font-semibold mb-2">Username</label>
            <input
              disabled
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-2">Email</label>
            <input
              disabled
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="flex items-center text-gray-600 font-semibold">
              Notifications
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                className="ml-3 h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
              />
            </label>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          className="mt-8 w-full bg-primary text-white py-3 rounded-full font-semibold shadow-lg md:w-[300px] hover:bg-primary-dark transition-all"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Profile;
