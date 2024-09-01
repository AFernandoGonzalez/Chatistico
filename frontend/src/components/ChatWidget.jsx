// frontend/src/pages/ChatWidget.js
import React, { useEffect, useState } from 'react';
import ChatWidgetPreview from '../components/ChatWidgetPreview';
import { useParams } from 'react-router-dom';

const ChatWidget = () => {
  const { id } = useParams();
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const response = await fetch(`http://localhost:8000/api/chatbots/configuration?id=${id}`);
      const data = await response.json();
      setConfig(data);
    };
    fetchConfig();
  }, [id]);

  if (!config) return <div>Loading...</div>;

  return (
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
  );
};

export default ChatWidget;
