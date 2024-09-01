import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatWidgetPreview from '../components/ChatWidgetPreview'; // Use your existing component
import { getConfiguration } from '../services/api'; // Import your API service

const ChatWidget = () => {
  const { id } = useParams(); // Get the chatbot ID from the URL params
  const [config, setConfig] = useState(null);

  useEffect(() => {
    // Fetch configuration data from the backend
    const fetchConfig = async () => {
      try {
        const data = await getConfiguration(id);
        setConfig(data); // Set the fetched configuration to state
      } catch (error) {
        console.error('Error fetching configuration:', error);
      }
    };

    fetchConfig();
  }, [id]);

  // Render the widget using the fetched configuration
  return config ? (
    <ChatWidgetPreview
      primaryColor={config.primary_color}
      textColor={config.text_color}
      iconColor={config.icon_color}
      chatWidth={config.chat_width}
      botIconCircular={config.bot_icon_circular}
      chatIconCircular={config.chat_icon_circular}
      chatIconSize={config.chat_icon_size}
      botIconImage={config.bot_icon_image}
      chatIconImage={config.chat_icon_image}
      chatbotName={config.chatbot_name}
    />
  ) : (
    <div>Loading widget...</div>
  );
};

export default ChatWidget;
