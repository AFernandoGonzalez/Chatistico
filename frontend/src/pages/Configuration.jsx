import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette, faTextHeight, faCog, faSave, faBars, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import ChatbotPreview from '../components/ChatWidgetPreview';

const Configuration = () => {
  const [activeTab, setActiveTab] = useState('design');
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [textColor, setTextColor] = useState('#ffffff');
  const [iconColor, setIconColor] = useState('#000000');
  const [chatWidth, setChatWidth] = useState(350);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [widgetPosition, setWidgetPosition] = useState('br');
  const [horizontalSpacing, setHorizontalSpacing] = useState(0);
  const [verticalSpacing, setVerticalSpacing] = useState(0);
  const [botIconCircular, setBotIconCircular] = useState(false);
  const [chatIconCircular, setChatIconCircular] = useState(false);
  const [chatIconSize, setChatIconSize] = useState(55);

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
              <h2 className="text-2xl font-bold mb-2">Design</h2>
              <p className="text-gray-600 mb-4">Customize the appearance of the chat widget.</p>

              {/* Colors Section */}
              <section className="mb-6">
                <div className="text-lg font-semibold mb-2">Colors</div>
                <div className="space-y-4">
                  {/* Primary Color */}
                  <div className="flex items-center justify-between">
                    <div className="text-gray-700">Primary Color</div>
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-12 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Text Color */}
                  <div className="flex items-center justify-between">
                    <div className="text-gray-700">Text Color</div>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-12 h-12 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Chat Icon Color */}
                  <div className="flex items-center justify-between">
                    <div className="text-gray-700">Chat Icon Color</div>
                    <input
                      type="color"
                      value={iconColor}
                      onChange={(e) => setIconColor(e.target.value)}
                      className="w-12 h-12 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </section>

              {/* Chat Width Section */}
              <section className="mb-6">
                <div className="text-lg font-semibold mb-2">Chat Width (Desktop)</div>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="350"
                    max="600"
                    value={chatWidth}
                    onChange={(e) => setChatWidth(parseInt(e.target.value))}
                    className="flex-grow mr-3"
                  />
                  <div className="text-gray-700">{chatWidth}px</div>
                </div>
              </section>

              {/* Position Section */}
              <section className="mb-6">
                <div className="text-lg font-semibold mb-2">Position</div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-gray-700">Placement</div>
                    <select
                      name="widget_position"
                      value={widgetPosition}
                      onChange={(e) => setWidgetPosition(e.target.value)}
                      className="custom_select border border-gray-300 rounded-md px-2 py-1"
                    >
                      <option value="br">Bottom right</option>
                      <option value="bl">Bottom left</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-gray-700">Horizontal spacing</div>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="0"
                        max="300"
                        value={horizontalSpacing}
                        onChange={(e) => setHorizontalSpacing(parseInt(e.target.value))}
                        className="input-style-one border border-gray-300 rounded-md px-2 py-1 w-16"
                      />
                      <span className="ml-2">px</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-gray-700">Vertical spacing</div>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="0"
                        max="300"
                        value={verticalSpacing}
                        onChange={(e) => setVerticalSpacing(parseInt(e.target.value))}
                        className="input-style-one border border-gray-300 rounded-md px-2 py-1 w-16"
                      />
                      <span className="ml-2">px</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Bot Icon Section */}
              <section className="mb-6">
                <div className="text-lg font-semibold mb-2">Bot Icon</div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-gray-700">Circular shape</div>
                    <input
                      type="checkbox"
                      checked={botIconCircular}
                      onChange={(e) => setBotIconCircular(e.target.checked)}
                      className="toggle-checkbox"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-gray-700">Image</div>
                    <div className="flex items-center">
                      <div
                        className={`w-12 h-12 ${botIconCircular ? 'rounded-full' : ''} bg-cover bg-center`}
                        style={{ backgroundImage: "url('your-image-url')" }}
                      ></div>
                      <button className="ml-3 bg-gray-200 hover:bg-gray-300 text-black px-3 py-1 rounded-md">Change</button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Chat Icon Section */}
              <section className="mb-6">
                <div className="text-lg font-semibold mb-2">Chat Icon</div>
                <div className="text-gray-600 mb-2">Appears when chat is closed</div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-gray-700">Circular shape</div>
                    <input
                      type="checkbox"
                      checked={chatIconCircular}
                      onChange={(e) => setChatIconCircular(e.target.checked)}
                      className="toggle-checkbox"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-gray-700">Size</div>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="45"
                        max="75"
                        value={chatIconSize}
                        onChange={(e) => setChatIconSize(parseInt(e.target.value))}
                        className="slider w-full"
                      />
                      <div className="ml-3 text-gray-700">{chatIconSize}px</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-gray-700">Image</div>
                    <div className="flex items-center">
                      <div className={`w-12 h-12 flex justify-center items-center ${chatIconCircular ? 'rounded-full' : ''} bg-black`}>
                        <FontAwesomeIcon icon={faBars} style={{ color: "#FFFFFF" }} />
                      </div>
                      <button className="ml-3 bg-gray-200 hover:bg-gray-300 text-black px-3 py-1 rounded-md">Change</button>
                    </div>
                  </div>
                </div>
              </section>

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
              widgetPosition={widgetPosition}
              horizontalSpacing={horizontalSpacing}
              verticalSpacing={verticalSpacing}
              botIconCircular={botIconCircular}
              chatIconCircular={chatIconCircular}
              chatIconSize={chatIconSize}
            />
          </div>
        )}
      </div>

      {/* Toggle Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-4 bg-black text-white p-3 rounded-full"
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
