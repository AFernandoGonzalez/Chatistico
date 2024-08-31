// src/index.js

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Import the context providers
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { ChatbotProvider } from './context/ChatbotContext';

// Render the app with context providers wrapped around it
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap the App component with context providers */}
    <AuthProvider>
      {/* <UserProvider> */}
        <ChatbotProvider>
          <App />
        </ChatbotProvider>
      {/* </UserProvider> */}
    </AuthProvider>
  </StrictMode>
);
