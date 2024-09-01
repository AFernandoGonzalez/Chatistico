const supabase = require('../config/db');

// Get all chatbots
const getChatbots = async (req, res) => {
  try {
    const { data: chatbots, error } = await supabase
      .from('chatbots')
      .select('*');

    if (error) {
      throw error;
    }

    res.status(200).json(chatbots);
  } catch (error) {
    console.error('Error fetching chatbots:', error);
    res.status(500).json({ message: 'Failed to retrieve chatbots' });
  }
};

// Create a new chatbot
// Create a new chatbot and default configuration
const createChatbot = async (req, res) => {
  const { userId, name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: 'Name and description are required.' });
  }

  try {
    // Begin a transaction
    const { data: newChatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .insert([{ user_id: userId, name, description }])
      .select('*')
      .single(); // Use single() to get a single object instead of an array

    if (chatbotError) {
      throw chatbotError;
    }

    // Insert default configuration
    const defaultConfig = {
      chatbot_id: newChatbot.id,
      primary_color: '#000000',
      text_color: '#ffffff',
      icon_color: '#000000',
      chat_width: 350,
      widget_position: 'br',
      horizontal_spacing: 0,
      vertical_spacing: 0,
      bot_icon_circular: false,
      chat_icon_circular: false,
      chat_icon_size: 55,
      bot_icon_image: null,
      chat_icon_image: null,
      chatbot_name: name || 'Support Bot',
    };

    const { error: configError } = await supabase
      .from('chatbot_configurations')
      .insert([defaultConfig]);

    if (configError) {
      throw configError;
    }

    res.status(201).json(newChatbot);
  } catch (error) {
    console.error('Error creating chatbot:', error);
    res.status(500).json({ message: 'Failed to create chatbot' });
  }
};


// Get a chatbot by ID
const getChatbotById = async (req, res) => {
  const { id } = req.params;
  try {
    const { data: chatbot, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!chatbot) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }

    res.status(200).json(chatbot);
  } catch (error) {
    console.error('Error fetching chatbot:', error);
    res.status(500).json({ message: 'Failed to retrieve chatbot' });
  }
};

// Delete a chatbot
const deleteChatbot = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('chatbots')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.status(200).json({ message: 'Chatbot deleted successfully' });
  } catch (error) {
    console.error('Error deleting chatbot:', error);
    res.status(500).json({ message: 'Failed to delete chatbot' });
  }
};

// Rename a chatbot
const renameChatbot = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const { error } = await supabase
      .from('chatbots')
      .update({ name, description })
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.status(200).json({ message: 'Chatbot renamed successfully' });
  } catch (error) {
    console.error('Error renaming chatbot:', error);
    res.status(500).json({ message: 'Failed to rename chatbot' });
  }
};


const getChatbotWidget = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send('Chatbot ID is required');
  }

  try {
    const { data: config, error } = await supabase
      .from('chatbot_configurations')
      .select('*')
      .eq('chatbot_id', id)
      .single();

    if (error || !config) {
      throw new Error('Failed to fetch configuration');
    }

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${config.chatbot_name} - Chatbot Widget</title>
        <style>
          body { margin: 0; font-family: Arial, sans-serif; }
          #chatbot-container {
            width: 100%;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: ${config.primary_color};
          }
          .chat-widget {
            width: ${config.chat_width}px;
            max-width: 600px;
            min-width: 350px;
            height: 600px;
            max-height: 600px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }
          .chat-header {
            padding: 10px;
            background-color: ${config.primary_color};
            color: ${config.text_color};
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .chat-content {
            padding: 15px;
            flex: 1;
            overflow-y: auto;
            background-color: #f9f9f9;
          }
          .chat-message {
            margin-bottom: 15px;
          }
          .bot-message {
            background-color: #e9e9e9;
            color: #333;
            padding: 10px;
            border-radius: 5px;
            max-width: 80%;
          }
          .user-message {
            background-color: ${config.primary_color};
            color: ${config.text_color};
            padding: 10px;
            border-radius: 5px;
            max-width: 80%;
            align-self: flex-end;
          }
          .chat-input {
            display: flex;
            padding: 10px;
            background-color: white;
            border-top: 1px solid #ddd;
          }
          .chat-input input {
            flex: 1;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          .chat-input button {
            margin-left: 8px;
            background-color: ${config.icon_color};
            color: ${config.text_color};
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div id="chatbot-container">
          <div class="chat-widget">
            <div class="chat-header">
              <h3>${config.chatbot_name}</h3>
              <button id="close-btn" style="background:none; border:none; color:${config.text_color};">×</button>
            </div>
            <div class="chat-content">
              <div class="chat-message bot-message">
                Hi, how can I help you today?
              </div>
              <div class="chat-message user-message">
                How can I track my order?
              </div>
              <div class="chat-message bot-message">
                To track your order's shipment, go to the Orders page in your account and click on the <strong>Track</strong> button next to the order.
              </div>
            </div>
            <div class="chat-input">
              <input type="text" placeholder="Type your message here">
              <button><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="${config.text_color}" d="M2,21l21-9L2,3v7l15,2L2,17V21z"></path></svg></button>
            </div>
          </div>
        </div>
        <script>
          document.getElementById('close-btn').addEventListener('click', function() {
            document.querySelector('.chat-widget').style.display = 'none';
          });
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to load chatbot widget');
  }
};




module.exports = {
  getChatbots, createChatbot, getChatbotById, deleteChatbot,
  renameChatbot, getChatbotWidget
};
