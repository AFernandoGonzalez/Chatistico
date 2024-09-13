

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { ChatbotProvider } from './context/ChatbotContext';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap the App component with context providers */}
    <ToastContainer />
    <AuthProvider>
      {/* <UserProvider> */}
        <ChatbotProvider>
          <App />
        </ChatbotProvider>
      {/* </UserProvider> */}
    </AuthProvider>
  </StrictMode>
);
