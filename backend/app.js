const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./Middleware/errorMiddleware');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', chatRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
