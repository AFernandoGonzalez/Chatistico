import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette, faTextHeight, faCog, faSave, faTimes, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import ChatbotPreview from '../components/ChatWidgetPreview';

const Configuration = () => {
  const [activeTab, setActiveTab] = useState('design');
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [textColor, setTextColor] = useState('#ffffff');
  const [iconColor, setIconColor] = useState('#000000');
  const [chatWidth, setChatWidth] = useState(350);
  const [isChatOpen, setIsChatOpen] = useState(true);

  const handleSave = () => {
    alert('Settings saved!');
  };

  return (
    <div className="flex relative">
      {/* Sidebar Tabs */}
      <div className="w-[60px] bg-gray-100 border-r">
        <div className="flex flex-col space-y-4">
          <TabButton icon={faPalette} isActive={activeTab === 'design'} onClick={() => setActiveTab('design')} />
          <TabButton icon={faTextHeight} isActive={activeTab === 'texts'} onClick={() => setActiveTab('texts')} />
          <TabButton icon={faCog} isActive={activeTab === 'configure'} onClick={() => setActiveTab('configure')} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full min-w-[300px] p-6 flex flex-col lg:flex-row">
        <div className="w-full space-y-6">
          {activeTab === 'design' && (
            <div>
              <h2 className="text-2xl font-bold">Design</h2>
              <p>Customize the appearance of the chat widget.</p>

              <div>
                <label className="block text-gray-700">Primary Color</label>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full h-10 mt-1 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-gray-700">Text Color</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-10 mt-1 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-gray-700">Chat Icon Color</label>
                <input
                  type="color"
                  value={iconColor}
                  onChange={(e) => setIconColor(e.target.value)}
                  className="w-full h-10 mt-1 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-gray-700">Chat Width (Desktop)</label>
                <input
                  type="range"
                  min="350"
                  max="600"
                  value={chatWidth}
                  onChange={(e) => setChatWidth(e.target.value)}
                  className="w-full"
                />
                <div className="text-right">{chatWidth}px</div>
              </div>

              <button onClick={handleSave} className="mt-4 px-4 py-2 bg-black text-white rounded-md">
                <FontAwesomeIcon icon={faSave} className="mr-2" /> Save
              </button>
            </div>
          )}

          {activeTab === 'texts' && (
            <div>
              <h2 className="text-2xl font-bold">Texts</h2>
              {/* Add your content here */}
            </div>
          )}

          {activeTab === 'configure' && (
            <div>
              <h2 className="text-2xl font-bold">Configure</h2>
              {/* Add your content here */}
            </div>
          )}
        </div>
      </div>

      {/* Chatbot Preview */}
      <div className='bg-white w-full h-[100vh] p-6'>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Chatbot Preview</h3>

        {isChatOpen && (
          <div
            className="absolute top-0 right-0 mt-8"
            style={{
              width: `${chatWidth}px`,
              maxWidth: '600px',
              minWidth: '350px',
            }}
          >
            <ChatbotPreview
              primaryColor={primaryColor}
              textColor={textColor}
              iconColor={iconColor}
              chatWidth={chatWidth}
            />
          </div>
        )}
      </div>

      {/* Toggle Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-4 right-4 bg-black text-white p-3 rounded-full"
        >
          <FontAwesomeIcon icon={faCommentDots} />
        </button>
      )}
    </div>
  );
};

const TabButton = ({ icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center p-4 w-full text-left ${isActive ? 'bg-white text-blue-600 border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-200'
      }`}
  >
    <FontAwesomeIcon icon={icon} className="mr-3" />
  </button>
);

export default Configuration;
