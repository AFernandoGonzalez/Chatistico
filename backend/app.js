const express = require('express');
const cors = require('cors');
const path = require('path');
const { errorHandler } = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const configRoutes = require('./routes/configRoutes');
const knowledgeBaseRoutes = require('./routes/knowledgeBaseRoutes');
const chatSetupRoutes = require('./routes/chatSetupRoutes');
const dotenv = require('dotenv');
dotenv.config();

const setupApp = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/api/auth', authRoutes);
    app.use('/api/chatbots', chatbotRoutes)
    app.use('/api/configuration', configRoutes)
    app.use('/api/knowledge-base', knowledgeBaseRoutes);
    app.use('/api/chat', chatRoutes);
    app.use('/api/public/embed/chatbot/configure', chatSetupRoutes);
    app.use(errorHandler);

    return app;
}

module.exports = setupApp;

