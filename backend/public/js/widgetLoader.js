
(function () {
    let isChatOpen = false;
    let config = {};
    let messages = [];
    let chatId = null;
    let sessionUserId = getOrCreateUserId();
    let role_id = 2;
    let toggleButton;

    const scriptTag = document.currentScript;
    const chatbotId = scriptTag.getAttribute('data-widget-id');
    const backendUrl = 'http://localhost:8000/api/public/embed/chatbot/configure';

    function toggleChat() {
        isChatOpen = !isChatOpen;
        const chatbotContainer = document.getElementById('chatbot-container');
        const toggleButtonIcon = document.getElementById('toggle-button-icon');

        function toggleWS() {
            if (window.innerWidth <= 640) {
                if (isChatOpen) {
                    toggleButton.classList.add('hidden');
                } else {
                    toggleButton.classList.remove('hidden');
                }
            } else {
                toggleButton.classList.remove('hidden');
            }
        }
        toggleWS();
        window.addEventListener('resize', toggleWS);

        if (isChatOpen) {
            chatbotContainer.style.display = 'block';
            toggleButtonIcon.className = 'fas fa-times';
            if (messages.length === 0) {
                performGetChatAction('getChatHistory');
            }
        } else {
            chatbotContainer.style.display = 'none';
            toggleButtonIcon.className = 'fas fa-bars';
        }
    }

    function loadFontAwesome() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
        document.head.appendChild(link);
    }

    function loadTailwind() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
        document.head.appendChild(link);
    }

    function loadChatbot(configuration) {
        config = configuration.data;
        console.log("loadChatbot config", config);
        
        // Create chatbot container
        const chatbotContainer = document.createElement('div');
        chatbotContainer.id = 'chatbot-container';
        chatbotContainer.className = 'chat-widget-preview fixed bottom-[50px] right-0 mb-5 shadow-lg overflow-hidden';
        chatbotContainer.style.width = `${config.chat_width || 350}px`;
        chatbotContainer.style.maxWidth = '600px';
        chatbotContainer.style.minWidth = '350px';
        chatbotContainer.style.height = '600px';
        chatbotContainer.style.maxHeight = '600px';
        chatbotContainer.style.backgroundColor = '#ffffff';
        chatbotContainer.style.display = 'none';
        chatbotContainer.style.zIndex = '10';
        document.body.appendChild(chatbotContainer);

        // Adjust size for responsiveness
        function adjustChatbotSize() {
            if (window.innerWidth <= 640) {
                chatbotContainer.style.maxWidth = '100%';
                chatbotContainer.style.maxHeight = '100%';
                chatbotContainer.style.width = '100%';
                chatbotContainer.style.height = '100%';
                chatbotContainer.style.bottom = '0';
                chatbotContainer.style.right = '0';
                chatbotContainer.style.top = '0';
                chatbotContainer.style.left = '0';
                chatbotContainer.style.borderRadius = '0';
            } else {
                chatbotContainer.style.width = `${config.chat_width || 350}px`;
                chatbotContainer.style.maxWidth = '600px';
                chatbotContainer.style.minWidth = '350px';
                chatbotContainer.style.height = '600px';
                chatbotContainer.style.maxHeight = '600px';
                chatbotContainer.style.bottom = '';
                chatbotContainer.style.right = '';
                chatbotContainer.style.top = '';
                chatbotContainer.style.left = '';
                chatbotContainer.style.borderRadius = '';
            }
        }
        adjustChatbotSize();
        window.addEventListener('resize', adjustChatbotSize);

        // Chat Header
        const chatHeader = document.createElement('div');
        chatHeader.className = 'flex items-center justify-between p-3';
        chatHeader.style.backgroundColor = config.primary_color;
        chatbotContainer.appendChild(chatHeader);

        function adjustHeader() {
            if (window.innerWidth <= 640) {
                chatHeader.classList.remove('rounded-t-lg');
            } else {
                chatHeader.classList.add('rounded-t-lg');
            }
        }

        adjustHeader();

        window.addEventListener('resize', adjustHeader);

        const chatTitle = document.createElement('h3');
        chatTitle.className = 'font-bold text-xl';
        chatTitle.style.color = config.text_color;
        chatTitle.textContent = config.chatbot_name || 'Chatbot';
        chatHeader.appendChild(chatTitle);

        // Close button in chat header
        const closeButton = document.createElement('button');
        closeButton.style.color = config.text_color;
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.onclick = toggleChat;
        chatHeader.appendChild(closeButton);

        // Chat Content
        const chatContent = document.createElement('div');
        chatContent.id = 'chat-content';
        chatContent.className = 'chat-content p-4 flex-1 overflow-y-auto bg-gray-50';
        chatContent.style.height = '82%';
        chatbotContainer.appendChild(chatContent);

        // Chat Input
        const chatInputContainer = document.createElement('div');
        chatInputContainer.className = 'chat-input border-t p-3 bg-white flex items-center';
        chatbotContainer.appendChild(chatInputContainer);

        const inputField = document.createElement('input');
        inputField.id = 'chat-input-field';
        inputField.type = 'text';
        inputField.placeholder = 'Type your message here';
        inputField.className = 'w-full p-3 rounded-md focus:outline-none text-black';
        chatInputContainer.appendChild(inputField);

        // Send button with paper plane icon
        const sendButton = document.createElement('button');
        sendButton.className = 'ml-2 p-2';
        sendButton.innerHTML = `<i class="fas fa-paper-plane" style="color: ${config.icon_color};"></i>`;
        sendButton.onclick = sendMessage;
        chatInputContainer.appendChild(sendButton);

        // Append the chatbot container to the body
        document.body.appendChild(chatbotContainer);

        // Create toggle button for chat
        toggleButton = document.createElement('button');
        toggleButton.className = 'fixed bottom-[10px] right-0 p-3 rounded-full shadow-lg';
        toggleButton.style.backgroundColor = config.icon_color;
        toggleButton.style.color = config.text_color;
        toggleButton.style.width = `${config.chat_icon_size || 50}px`;
        toggleButton.style.height = `${config.chat_icon_size || 50}px`;
        toggleButton.style.borderRadius = config.chat_icon_circular ? '50%' : '8px';
        toggleButton.style.backgroundImage = `url('${config.chat_icon_image || ''}')`;
        toggleButton.style.backgroundSize = 'cover';
        toggleButton.style.backgroundPosition = 'center';
        toggleButton.onclick = toggleChat;

        // Function to handle visibility of the toggle button
        function adjustToggleButtonVisibility() {
            if (window.innerWidth <= 640) {
                if (isChatOpen) {
                    toggleButton.classList.add('hidden');
                } else {
                    toggleButton.classList.remove('hidden');
                }
            } else {
                toggleButton.classList.remove('hidden');
            }
        }

        window.addEventListener('resize', adjustToggleButtonVisibility);

        const toggleButtonIcon = document.createElement('i');
        toggleButtonIcon.id = 'toggle-button-icon';
        toggleButtonIcon.className = 'fas fa-bars'; // Default icon
        toggleButton.appendChild(toggleButtonIcon);

        // Only show icon if no image is set
        if (!config.chat_icon_image) {
            toggleButton.appendChild(toggleButtonIcon);
        }

        // Append the toggle button to the body
        document.body.appendChild(toggleButton);

        // Initial call to adjust toggle button visibility
        adjustToggleButtonVisibility();

        // Auto open chat if configured to do so
        if (config.auto_open_behavior === 'auto') {
            setTimeout(() => {
                toggleChat();
            }, config.auto_open_delay || 0);
        }
    }

    // Fetch chat data using GET
    function performGetChatAction(action) {
        const url = `${backendUrl}?action=${action}&chatbotId=${chatbotId}&sessionUserId=${sessionUserId}`;

        fetch(url, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error:', data.error);
                } else {
                    if (action === 'getChatHistory') {
                        if (data.chats.length > 0) {
                            messages = data.chats[0].messages || [];
                            chatId = data.chats[0].id;
                            displayMessages(messages);
                        } else {
                            // If no existing chat, create a new one
                            performPostChatAction('createNewChat');
                        }
                    } else if (action === 'getConfiguration') {
                        loadChatbot(data);
                    }
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Perform POST actions for chat
    function performPostChatAction(action, text = null) {
        const payload = {
            action: action,
            chatbotId: chatbotId,
            sessionUserId: sessionUserId,
            text: text,
            role_id: role_id,
            chatId: chatId
        };

        return fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error:', data.error);
                    throw new Error(data.error);
                }
                if (action === 'createNewChat') {
                    chatId = data.chatId;  // Update chatId after creating a new chat
                    messages = [];
                    displayMessages(messages);
                }
                return data;
            })
            .catch(error => {
                console.error('Error:', error);
                throw error;
            });
    }
    // Display fetched chat messages
    function displayMessages(messages) {
        const chatContent = document.getElementById('chat-content');
        chatContent.innerHTML = ''; // Clear existing content

        // Wrapper for the chat messages
        const chatMessageWrapper = document.createElement('div');
        chatMessageWrapper.className = 'chat-message space-y-4';  // Space between messages

        messages.forEach(message => {
            const messageWrapper = document.createElement('div');

            if (message.role_id === 2) {  // Assuming role_id 2 is for the user/customer
                messageWrapper.className = 'flex items-center justify-end space-x-3';  // Align message to the right
                const userMessage = document.createElement('div');
                userMessage.style.cssText = `
                    padding: 10px 15px;
                    border-radius: 10px 10px 2px 10px;
                    background-color: ${config.primary_color};
                    color: ${config.text_color};
                `;
                userMessage.textContent = message.text;
                messageWrapper.appendChild(userMessage);
            } else {
                messageWrapper.className = 'flex items-center space-x-3';
                const botMessage = document.createElement('div');
                botMessage.style.cssText = `
                    padding: 10px 15px;
                    border-radius: 10px 10px 10px 2px;
                    background-color: rgb(241, 245, 249);
                    color: rgb(0, 0, 0);
                `;
                botMessage.textContent = message.text;
                messageWrapper.appendChild(botMessage);
            }

            chatMessageWrapper.appendChild(messageWrapper);
        });

        chatContent.appendChild(chatMessageWrapper);
        chatContent.scrollTop = chatContent.scrollHeight;
    }

    // Send message
    function sendMessage() {
        const inputField = document.getElementById('chat-input-field');
        const text = inputField.value.trim();

        if (!text) {
            return console.error('Text is empty.');
        }

        if (!chatId) {
            performPostChatAction('createNewChat'); 
            return;
        }
        const userMessage = { text, role_id: role_id };
        messages.push(userMessage);
        displayMessages(messages);
        inputField.value = '';

        // Display typing indicator for the bot response
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.style.cssText = 'padding: 10px; font-style: italic; color: gray;';
        typingIndicator.textContent = 'Bot is typing...';
        const chatContent = document.getElementById('chat-content');
        chatContent.appendChild(typingIndicator);
        chatContent.scrollTop = chatContent.scrollHeight;

        // Perform the POST request to send the message
        performPostChatAction('sendMessage', text)
            .then((data) => {
                // Remove typing indicator once the AI response is received
                typingIndicator.remove();

                // Only render the AI response here to avoid duplicating the user's message
                if (data.aiMessage) {
                    messages.push(data.aiMessage);  // Only push the bot's response
                    displayMessages(messages);      // Re-render messages with AI response
                }
            })
            .catch((error) => {
                console.error('Error sending message:', error);
                typingIndicator.remove();  // Remove typing indicator on error
            });
    }

    // Generate or fetch user ID
    function getOrCreateUserId() {
        let userId = localStorage.getItem('chat_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chat_user_id', userId);
        }
        return userId;
    }

    // Load resources
    loadFontAwesome();
    loadTailwind();

    performGetChatAction('getConfiguration');
})();
