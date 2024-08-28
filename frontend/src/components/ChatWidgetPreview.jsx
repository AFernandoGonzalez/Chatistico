import React from 'react';
import ChatWidget from './ChatWidget';

const ChatWidgetPreview = ({
  userId,
  themeColor,
  textColor,
  iconColor,
  chatWidth,
  headerTitle,
  botIcon,
  botIconShape,
  botIconSize,
  hoverMessageDesktop,
  hoverMessageMobile,
  showSources,
}) => {
  return (
    <div className="chat-widget-preview p-4 bg-gray-50 shadow-md rounded-md">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Chatbot Widget Preview</h3>
      <div className="widget-container border-2 rounded-md p-4" style={{ borderColor: themeColor, width: `${chatWidth}px` }}>
        <ChatWidget
          userId={userId}
          themeColor={themeColor}
          textColor={textColor}
          iconColor={iconColor}
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

export default ChatWidgetPreview;
