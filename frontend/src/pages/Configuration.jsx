import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette, faTextHeight, faSave, faCommentDots, faRobot, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import ChatbotPreview from '../components/ChatWidgetPreview';
import { getConfiguration, saveConfiguration } from '../services/api';
import { useParams } from 'react-router-dom';

const Configuration = () => {
  const { id: chatbotId } = useParams();
  const [activeTab, setActiveTab] = useState('design');
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [textColor, setTextColor] = useState('#ffffff');
  const [iconColor, setIconColor] = useState('#000000');
  const [chatWidth, setChatWidth] = useState(350);
  const [widgetPosition, setWidgetPosition] = useState('br');
  const [horizontalSpacing, setHorizontalSpacing] = useState(0);
  const [verticalSpacing, setVerticalSpacing] = useState(0);
  const [botIconCircular, setBotIconCircular] = useState(false);
  const [chatIconCircular, setChatIconCircular] = useState(false);
  const [chatIconSize, setChatIconSize] = useState(55);
  const [botIconImage, setBotIconImage] = useState('');
  const [chatIconImage, setChatIconImage] = useState('');
  const [chatbotName, setChatbotName] = useState('Support Bot');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchConfiguration = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        const data = await getConfiguration(chatbotId);
        if (data) {
          setPrimaryColor(data.primary_color || '#000000');
          setTextColor(data.text_color || '#ffffff');
          setIconColor(data.icon_color || '#000000');
          setChatWidth(data.chat_width || 350);
          setWidgetPosition(data.widget_position || 'br');
          setHorizontalSpacing(data.horizontal_spacing || 0);
          setVerticalSpacing(data.vertical_spacing || 0);
          setBotIconCircular(data.bot_icon_circular || false);
          setChatIconCircular(data.chat_icon_circular || false);
          setChatIconSize(data.chat_icon_size || 55);
          setBotIconImage(data.bot_icon_image || '');
          setChatIconImage(data.chat_icon_image || '');
          setChatbotName(data.chatbot_name || 'Support Bot');
        }
      } catch (error) {
        console.error('Error fetching configuration:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchConfiguration();
  }, [chatbotId]);

  const handleSave = async () => {
    if (!chatbotId) {
      alert('Chatbot ID is missing.');
      return;
    }

    if (!chatbotName || !primaryColor || !textColor || !iconColor || chatWidth === undefined) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      const config = {
        primary_color: primaryColor,
        text_color: textColor,
        icon_color: iconColor,
        chat_width: chatWidth,
        widget_position: widgetPosition,
        horizontal_spacing: horizontalSpacing,
        vertical_spacing: verticalSpacing,
        bot_icon_circular: botIconCircular,
        chat_icon_circular: chatIconCircular,
        chat_icon_size: chatIconSize,
        bot_icon_image: botIconImage || '',
        chat_icon_image: chatIconImage || '',
        chatbot_name: chatbotName || '',
      };

      console.log('Saving configuration for chatbotId:', chatbotId);

      await saveConfiguration(chatbotId, config);
      alert('Settings saved!');
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  };

  const handleBotIconImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBotIconImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChatIconImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setChatIconImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching data
  }

  return (
<div className="flex relative">
  <div className="w-full min-w-[300px] p-6 flex flex-col lg:flex-row">
    <div className="w-full space-y-6">
      {activeTab === 'design' && (
        <div>
          <h2 className="text-2xl font-bold text-primary mb-4">Design</h2>
          <p className="text-gray-600 mb-6">Customize the appearance of the chat widget.</p>

          {/* Chatbot Name */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Chatbot Name</label>
            <input
              type="text"
              value={chatbotName}
              onChange={(e) => setChatbotName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Enter chatbot name"
            />
          </div>

          {/* Colors Section */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-primary mb-2">Colors</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">Primary Color</label>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-12 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">Text Color</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-12 h-12 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">Chat Icon Color</label>
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
            <h3 className="text-lg font-semibold text-primary mb-2">Chat Width (Desktop)</h3>
            <div className="flex items-center">
              <input
                type="range"
                min="350"
                max="600"
                value={chatWidth}
                onChange={(e) => setChatWidth(parseInt(e.target.value))}
                className="flex-grow accent-primary"
              />
              <span className="ml-4 text-gray-700">{chatWidth}px</span>
            </div>
          </section>

          {/* Bot Icon Section */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-primary mb-2">Bot Icon</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">Circular Shape</label>
                <input
                  type="checkbox"
                  checked={botIconCircular}
                  onChange={(e) => setBotIconCircular(e.target.checked)}
                  className="toggle-checkbox"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">Image</label>
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 ${botIconCircular ? 'rounded-full' : ''} bg-cover bg-center flex items-center justify-center`}
                  >
                    {botIconImage ? (
                      <img
                        src={botIconImage}
                        alt="Bot Icon"
                        className={`w-full h-full ${botIconCircular ? 'rounded-full' : ''}`}
                      />
                    ) : (
                      <FontAwesomeIcon icon={faRobot} size="2x" style={{ color: '#ccc' }} />
                    )}
                  </div>
                  <label className="ml-3 bg-gray-200 hover:bg-gray-300 text-black px-3 py-1 rounded-md cursor-pointer">
                    Change
                    <input type="file" onChange={handleBotIconImageChange} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Chat Icon Section */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-primary mb-2">Chat Icon</h3>
            <div className="text-gray-600 mb-2">Appears when chat is closed</div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">Circular Shape</label>
                <input
                  type="checkbox"
                  checked={chatIconCircular}
                  onChange={(e) => setChatIconCircular(e.target.checked)}
                  className="toggle-checkbox"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">Size</label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="45"
                    max="55"
                    value={chatIconSize}
                    onChange={(e) => setChatIconSize(parseInt(e.target.value))}
                    className="slider w-full"
                  />
                  <span className="ml-4 text-gray-700">{chatIconSize}px</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">Image</label>
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 ${chatIconCircular ? 'rounded-full' : ''} bg-cover bg-center flex items-center justify-center`}
                  >
                    {chatIconImage ? (
                      <img
                        src={chatIconImage}
                        alt="Chat Icon"
                        className={`w-full h-full ${chatIconCircular ? 'rounded-full' : ''}`}
                      />
                    ) : (
                      <FontAwesomeIcon icon={faUserCircle} size="2x" style={{ color: '#ccc' }} />
                    )}
                  </div>
                  <label className="ml-3 bg-gray-200 hover:bg-gray-300 text-black px-3 py-1 rounded-md cursor-pointer">
                    Change
                    <input type="file" onChange={handleChatIconImageChange} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </section>

          <button
            onClick={handleSave}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-md shadow-lg hover:bg-primary-dark transition"
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" /> Save
          </button>
        </div>
      )}

    </div>
  </div>

  {/* Chatbot Preview */}
  <div className="bg-white w-full p-6 shadow-lg">
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
          botIconCircular={botIconCircular}
          chatIconCircular={chatIconCircular}
          chatIconSize={chatIconSize}
          botIconImage={botIconImage}
          chatIconImage={chatIconImage}
          chatbotName={chatbotName}
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

export default Configuration;
