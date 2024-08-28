import React, { useState } from 'react';
import ChatWidgetPreview from '../components/ChatWidgetPreview';

const Configuration = () => {
  const [themeColor, setThemeColor] = useState('#000000');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [iconColor, setIconColor] = useState('#FFFFFF');
  const [chatWidth, setChatWidth] = useState(400);
  const [horizontalSpacing, setHorizontalSpacing] = useState(20);
  const [verticalSpacing, setVerticalSpacing] = useState(20);
  const [headerTitle, setHeaderTitle] = useState('Support Bot');
  const [interfaceLanguage, setInterfaceLanguage] = useState('Auto');
  const [hoverMessageDesktop, setHoverMessageDesktop] = useState(false);
  const [hoverMessageMobile, setHoverMessageMobile] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [botIcon, setBotIcon] = useState(null);
  const [botIconShape, setBotIconShape] = useState('circle');
  const [botIconSize, setBotIconSize] = useState(57);
  const [chatIcon, setChatIcon] = useState(null);
  const [autoOpenChat, setAutoOpenChat] = useState(false);
  const [delayDuration, setDelayDuration] = useState(0);

  const handleSaveConfig = () => {
    alert('Configuration saved successfully!');
  };

  const handleBotIconUpload = (e) => {
    setBotIcon(URL.createObjectURL(e.target.files[0]));
  };

  const handleChatIconUpload = (e) => {
    setChatIcon(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="flex max-w-6xl mx-auto ">
      {/* Configuration Panel */}
      <div className="flex-grow p-6 bg-white shadow-md rounded-md mr-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Configuration</h1>
        
        {/* Design Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Design</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-600 mb-2">Primary Color</label>
              <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Text Color</label>
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Chat Icon Color</label>
              <input type="color" value={iconColor} onChange={(e) => setIconColor(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Chat Width (Desktop)</label>
              <input type="range" value={chatWidth} min="300" max="600" onChange={(e) => setChatWidth(e.target.value)} className="w-full" />
              <div className="text-gray-600">{chatWidth}px</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-600 mb-2">Horizontal Spacing</label>
              <input type="number" value={horizontalSpacing} min="0" max="300" onChange={(e) => setHorizontalSpacing(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Vertical Spacing</label>
              <input type="number" value={verticalSpacing} min="0" max="300" onChange={(e) => setVerticalSpacing(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Bot Icon</label>
              <input type="file" accept="image/*" onChange={handleBotIconUpload} className="w-full p-2 border border-gray-300 rounded-md mb-2" />
              <label className="block text-gray-600 mb-2">Icon Shape</label>
              <select value={botIconShape} onChange={(e) => setBotIconShape(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                <option value="circle">Circle</option>
                <option value="square">Square</option>
              </select>
              <label className="block text-gray-600 mb-2">Icon Size</label>
              <input type="range" min="30" max="100" value={botIconSize} onChange={(e) => setBotIconSize(e.target.value)} className="w-full" />
              <div className="text-gray-600">{botIconSize}px</div>
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Chat Icon</label>
              <input type="file" accept="image/*" onChange={handleChatIconUpload} className="w-full p-2 border border-gray-300 rounded-md mb-2" />
            </div>
          </div>
        </div>

        {/* Texts Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Texts</h2>
          <div>
            <label className="block text-gray-600 mb-2">Header Title</label>
            <input type="text" value={headerTitle} onChange={(e) => setHeaderTitle(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
        </div>

        {/* General Configuration */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">General Configuration</h2>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Interface Language</label>
            <select value={interfaceLanguage} onChange={(e) => setInterfaceLanguage(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
              <option value="Auto">Auto</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              {/* Add other languages as needed */}
            </select>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" checked={hoverMessageDesktop} onChange={(e) => setHoverMessageDesktop(e.target.checked)} className="mr-2" />
              <span className="text-gray-600">Enable Hovering Message on Desktop</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" checked={hoverMessageMobile} onChange={(e) => setHoverMessageMobile(e.target.checked)} className="mr-2" />
              <span className="text-gray-600">Enable Hovering Message on Mobile</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" checked={showSources} onChange={(e) => setShowSources(e.target.checked)} className="mr-2" />
              <span className="text-gray-600">Show Sources for AI Response</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" checked={autoOpenChat} onChange={(e) => setAutoOpenChat(e.target.checked)} className="mr-2" />
              <span className="text-gray-600">Auto-Open Chat (Premium Feature)</span>
            </label>
          </div>
          {autoOpenChat && (
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Delay Duration (seconds)</label>
              <input type="number" value={delayDuration} min="0" max="30" onChange={(e) => setDelayDuration(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveConfig}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          Save Configuration
        </button>
      </div>

      {/* Chatbot Preview */}
      <div className="w-96">
        <ChatWidgetPreview
          userId={12345} // Replace with actual userId
          themeColor={themeColor}
          textColor={textColor}
          iconColor={iconColor}
          chatWidth={chatWidth}
          headerTitle={headerTitle}
          botIcon={botIcon}
          botIconShape={botIconShape}
          botIconSize={botIconSize}
          hoverMessageDesktop={hoverMessageDesktop}
          hoverMessageMobile={hoverMessageMobile}
          showSources={showSources}
        />
      </div>
    </div>
  );
};

export default Configuration;
