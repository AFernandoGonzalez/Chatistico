

const express = require('express');
const router = express.Router();
const supabase = require('../config/db'); 


const serveWidget = async (req, res) => {
    const { customerId } = req.params;

    try {
        const { data: config, error } = await supabase
            .from('chatbot_configurations')
            .select('*')
            .eq('chatbot_id', customerId)
            .single();

        if (error || !config) {
            return res.status(404).send('Configuration not found');
        }

        
        const widgetHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Widget for Customer ${customerId}</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    
                    color: ${config.text_color};
                    font-family: Arial, sans-serif;
                }
                .chat-widget {
                    width: ${config.chat_width || 350}px;
                    max-width: 600px;
                    min-width: 350px;
                    height: 600px;
                    max-height: 600px;
                    position: fixed;
                    ${config.widget_position.includes('t') ? 'top' : 'bottom'}: ${config.vertical_spacing}px;
                    ${config.widget_position.includes('r') ? 'right' : 'left'}: ${config.horizontal_spacing}px;
                    border-radius: 15px;
                    box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 10px;
                    overflow: hidden;
                    background-color: white;
                    display: none;
                }
                .chat-header {
                    padding: 10px;
                    background-color: ${config.primary_color};
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: ${config.text_color};
                }
                .chat-content {
                    padding: 10px;
                    background-color: #f0f0f0;
                    height: 470px;
                    overflow-y: auto;
                }
                .chat-input {
                    padding: 10px;
                    background-color: white;
                    display: flex;
                    align-items: center;
                }
                .chat-input input {
                    flex-grow: 1;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                .chat-input button {
                    margin-left: 10px;
                    background-color: ${config.icon_color};
                    color: ${config.text_color};
                    border: none;
                    padding: 10px;
                    border-radius: 4px;
                }
                .chat-toggle-button {
                    background-color: ${config.icon_color};
                    color: ${config.text_color};
                    width: ${config.chat_icon_size || 50}px;
                    height: ${config.chat_icon_size || 50}px;
                    border-radius: ${config.chat_icon_circular ? '50%' : '8px'};
                    background-image: url('${config.chat_icon_image}');
                    background-size: cover;
                    background-position: center;
                    position: fixed;
                    bottom: 10px;
                    right: 0;
                    cursor: pointer;
                    border: none;
                }
            </style>
        </head>
        <body>
            <div class="chat-widget" id="chatWidget">
                <div class="chat-header">
                    <h3>${config.chatbot_name}</h3>
                    <button onclick="toggleChat()">&#10006;</button>
                </div>
                <div class="chat-content" id="chatContent">
                    <!-- Messages will be loaded here -->
                </div>
                <div class="chat-input">
                    <input type="text" id="chatInput" placeholder="Type your message here">
                    <button onclick="sendMessage()">Send</button>
                </div>
            </div>
            <button class="chat-toggle-button" onclick="toggleChat()" id="toggleButton">&#9776;</button>
            
            <script>
                let isChatOpen = false;
                const toggleChat = () => {
                    const chatWidget = document.getElementById('chatWidget');
                    const toggleButton = document.getElementById('toggleButton');
                    isChatOpen = !isChatOpen;
                    chatWidget.style.display = isChatOpen ? 'block' : 'none';
                    toggleButton.textContent = isChatOpen ? '×' : '☰';
                };

                const sendMessage = () => {
                    const input = document.getElementById('chatInput');
                    const message = input.value;
                    if (message) {
                        
                        appendMessage(message, 'user');
                        
                        fetch('http:
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ chatbotId: '${customerId}', userId: 'YOUR_USER_ID', message })
                        })
                        .then(response => response.json())
                        .then(data => {
                            
                            appendMessage(data.reply, 'bot');
                        })
                        .catch(error => console.error('Error sending message:', error));
                        input.value = '';
                    }
                };

                const appendMessage = (text, sender) => {
                    const chatContent = document.getElementById('chatContent');
                    const messageDiv = document.createElement('div');
                    messageDiv.textContent = text;
                    messageDiv.className = sender === 'bot' ? 'message bot' : 'message user';
                    chatContent.appendChild(messageDiv);
                };

                
                fetch('http:
                    .then(response => response.json())
                    .then(data => {
                        const messages = data.chats.flatMap(chat => chat.messages);
                        messages.forEach(message => appendMessage(message.text, message.role_id === 1 ? 'bot' : 'user'));
                    })
                    .catch(error => console.error('Error fetching chat history:', error));
            </script>
        </body>
        </html>`;

        res.send(widgetHtml);
    } catch (err) {
        console.error("Error serving widget:", err);
        res.status(500).send('Internal Server Error');
    }
};


router.get('/:customerId', serveWidget);

module.exports = router;
