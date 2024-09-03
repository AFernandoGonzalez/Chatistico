const express = require('express');
const cors = require('cors');
const path = require('path');
const { errorHandler } = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const embedRoutes = require('./routes/embedRoutes');
const chatRoutes = require('./routes/chatRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const configRoutes = require('./routes/configRoutes');
const knowledgeBaseRoutes = require('./routes/knowledgeBaseRoutes');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/embed', embedRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/chatbots', chatbotRoutes)
app.use('/api/configuration', configRoutes)
app.use('/api/knowledge-base', knowledgeBaseRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
