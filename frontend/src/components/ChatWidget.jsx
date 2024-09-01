// ChatWidget.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBars, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const ChatWidget = ({
    chatbotId,
    userId,
    primaryColor,
    textColor,
    iconColor,
    chatWidth,
    botIconCircular,
    chatIconCircular,
    chatIconSize,
    botIconImage,
    chatIconImage,
    chatbotName
}) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Fetch chat history
        fetch(`http://localhost:8000/api/chat/history?userId=${userId}&chatbotId=${chatbotId}`)
            .then(response => response.json())
            .then(data => setMessages(data.chats.flatMap(chat => chat.messages)))
            .catch(error => console.error('Error fetching chat history:', error));
    }, [userId, chatbotId]);

    const sendMessage = (message) => {
        fetch(`http://localhost:8000/api/chat/message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatbotId, userId, message })
        })
            .then(response => response.json())
            .then(data => setMessages(prevMessages => [...prevMessages, { text: message }, { text: data.reply }]))
            .catch(error => console.error('Error sending message:', error));
    };

    return (
        <div>
            {isChatOpen && (
                <div
                    className="chat-widget fixed bottom-[50px] right-0 bg-white shadow-lg"
                    style={{
                        width: `${chatWidth}px`,
                        maxWidth: '600px',
                        minWidth: '350px',
                        height: '600px',
                        maxHeight: '600px',
                    }}
                >
                    <div className="chat-header p-3 rounded-t-lg" style={{ backgroundColor: primaryColor }}>
                        <h3 style={{ color: textColor }}>{chatbotName}</h3>
                        <button onClick={() => setIsChatOpen(false)} style={{ color: textColor }}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                    <div className="chat-content p-4 bg-gray-50 overflow-y-auto h-[470px]">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.role_id === 1 ? 'bot' : 'user'}`} style={{ backgroundColor: message.role_id !== 1 ? primaryColor : undefined, color: message.role_id !== 1 ? textColor : undefined }}>
                                {message.text}
                            </div>
                        ))}
                    </div>
                    <div className="chat-input p-3 bg-white flex items-center">
                        <input type="text" placeholder="Type your message here" className="flex-grow p-3" />
                        <button onClick={() => sendMessage(input.value)} style={{ color: iconColor }}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </div>
                </div>
            )}
            <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                style={{
                    backgroundColor: iconColor,
                    color: textColor,
                    width: `${chatIconSize}px`,
                    height: `${chatIconSize}px`,
                    borderRadius: chatIconCircular ? '50%' : '8px',
                    backgroundImage: `url('${chatIconImage}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
                className="chat-toggle-button fixed bottom-[10px] right-0 p-3 rounded-full shadow-lg"
            >
                {!chatIconImage && <FontAwesomeIcon icon={isChatOpen ? faTimes : faBars} />}
            </button>
        </div>
    );
};

export default ChatWidget;
