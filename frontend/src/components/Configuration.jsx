import React, { useState } from 'react';

const Configuration = () => {
  const [themeColor, setThemeColor] = useState('#000000'); // Default color
  const [apiKey, setApiKey] = useState(''); // API key state
  const [responseDelay, setResponseDelay] = useState(1); // Response delay state

  const handleSaveConfig = () => {
    // Logic to save configuration
    // You would typically send this data to a server to be saved
    alert('Configuration saved successfully!');
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Configuration</h1>
      
      {/* Theme Color Configuration */}
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">
          Theme Color:
          <input
            type="color"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            className="ml-2"
          />
        </label>
      </div>

      {/* API Key Configuration */}
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">
          API Key:
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter your API key"
          />
        </label>
      </div>

      {/* Response Delay Configuration */}
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">
          Response Delay (seconds):
          <input
            type="number"
            value={responseDelay}
            onChange={(e) => setResponseDelay(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            min="1"
            max="10"
          />
        </label>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSaveConfig}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
      >
        Save Configuration
      </button>
    </div>
  );
};

export default Configuration;
