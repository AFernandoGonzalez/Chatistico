// widgetLoader.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatWidget from '../../src/components/ChatWidget';

(function () {
    // Debug: Log that the script has started running
    console.log('widgetLoader.js script started');

    const scriptTag = document.currentScript;
    const chatbotId = scriptTag.getAttribute('data-id');
    const userId = scriptTag.getAttribute('data-user');

    // Debug: Log extracted attributes from the script tag
    console.log('chatbotId:', chatbotId);
    console.log('userId:', userId);

    fetch(`http://localhost:8000/api/configuration?chatbotId=${chatbotId}`)
        .then(response => {
            // Debug: Log the response object
            console.log('Response from configuration API:', response);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(config => {
            // Debug: Log the configuration fetched from the server
            console.log('Fetched configuration:', config);

            const widgetRoot = document.createElement('div');
            widgetRoot.id = 'chatbot-root';
            document.body.appendChild(widgetRoot);

            const root = createRoot(widgetRoot);

            // Debug: Log before rendering the React component
            console.log('Rendering ChatWidget component');

            root.render(
                <React.StrictMode>
                    <ChatWidget
                        chatbotId={chatbotId}
                        userId={userId}
                        {...config}
                    />
                </React.StrictMode>
            );

            // Debug: Log after rendering the React component
            console.log('ChatWidget component rendered');
        })
        .catch(error => {
            // Debug: Log any errors encountered during fetch or rendering
            console.error('Error fetching chatbot configuration:', error);
            // Optionally, display an error message in the UI
        });

    // Debug: Log that the script has finished running
    console.log('widgetLoader.js script finished');
})();
