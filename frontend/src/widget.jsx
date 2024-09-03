import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ChatWidget from './components/ChatWidgetPreview';
import './index.css'; // General styles or specific widget styles

// Retrieve the global configuration object loaded by the widgetLoader script
const config = window.chatlingConfig || {};

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ChatWidget config={config} />
    </StrictMode>,
    document.getElementById('chatling-widget-container') // Widget entry point
);
