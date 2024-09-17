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

        if (isChatOpen) {
            chatbotContainer.style.display = 'block';
            toggleButtonIcon.className = 'fas fa-times'; // Change toggle icon to close
            if (messages.length === 0) {
                performGetChatAction('getChatHistory');
            }
        } else {
            chatbotContainer.style.display = 'none';
            toggleButtonIcon.className = 'fas fa-comments'; // Change icon back to open
        }

        adjustToggleButtonVisibility(); // Ensure toggle button is properly handled
    }

    function adjustToggleButtonVisibility() {
        // Ensure the toggle button is visible when the chat is closed
        if (window.innerWidth <= 640) {
            toggleButton.style.display = isChatOpen ? 'none' : 'block';
        } else {
            toggleButton.style.display = 'block';
        }
    }

    // function loadFontAwesome() {
    //     const link = document.createElement('link');
    //     link.rel = 'stylesheet';
    //     link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
    //     document.head.appendChild(link);
    // }

    function loadChatbot(configuration) {
        config = configuration.data;

        const chatbotContainer = document.createElement('div');
        chatbotContainer.id = 'chatbot-container';
        chatbotContainer.style.position = 'fixed';
        chatbotContainer.style.bottom = '0px';
        chatbotContainer.style.right = '0px';
        chatbotContainer.style.boxShadow = '0px 10px 30px rgba(0, 0, 0, 0.2)';
        chatbotContainer.style.transition = 'all 0.3s ease-in-out';
        chatbotContainer.style.width = '350px';
        chatbotContainer.style.height = '600px';
        chatbotContainer.style.maxWidth = '100%';
        chatbotContainer.style.maxHeight = '100%';
        chatbotContainer.style.backgroundColor = '#ffffff';
        chatbotContainer.style.borderRadius = '16px';
        chatbotContainer.style.display = 'none';
        chatbotContainer.style.zIndex = '1000';
        chatbotContainer.style.overflow = 'hidden';
        document.body.appendChild(chatbotContainer);

        function adjustChatbotSize() {
            if (window.innerWidth <= 640) {
                chatbotContainer.style.bottom = '0';
                chatbotContainer.style.width = '100%';
                chatbotContainer.style.height = '100%';
                chatbotContainer.style.borderRadius = '0';
            } else {
                chatbotContainer.style.bottom = '0px';
                chatbotContainer.style.width = '350px';
                chatbotContainer.style.height = '600px';
                chatbotContainer.style.borderRadius = '16px';
            }
        }
        adjustChatbotSize();
        window.addEventListener('resize', adjustChatbotSize);

        // Chat Header
        const chatHeader = document.createElement('div');
        chatHeader.style.display = 'flex';
        chatHeader.style.alignItems = 'center';
        chatHeader.style.justifyContent = 'space-between';
        chatHeader.style.padding = '16px';
        chatHeader.style.backgroundColor = config.primary_color;
        chatHeader.style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)';
        chatbotContainer.appendChild(chatHeader);

        // Create a container for the avatar and title
        const avatarTitleContainer = document.createElement('div');
        avatarTitleContainer.style.display = 'flex';
        avatarTitleContainer.style.alignItems = 'center';

        // Agent Avatar
        const agentAvatar = document.createElement('img');
        agentAvatar.src = config.agent_avatar || 'https://images.unsplash.com/photo-1561212044-bac5ef688a07?w=900&auto=format&fit=crop&q=60'; // Default agent image
        agentAvatar.alt = 'Agent Avatar';
        agentAvatar.style.width = '48px';
        agentAvatar.style.height = '48px';
        agentAvatar.style.borderRadius = '50%';
        agentAvatar.style.marginRight = '8px';
        avatarTitleContainer.appendChild(agentAvatar);

        // Chat Title
        const chatTitle = document.createElement('h3');
        chatTitle.style.fontWeight = 'bold';
        chatTitle.style.fontSize = '1.25rem';
        chatTitle.style.color = config.text_color;
        chatTitle.textContent = config.chatbot_name || 'Chatbot';
        avatarTitleContainer.appendChild(chatTitle);

        chatHeader.appendChild(avatarTitleContainer);

        // Close Button
        const closeButton = document.createElement('button');
        closeButton.style.color = '#ffffff';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = toggleChat;
        chatHeader.appendChild(closeButton);

        // Chat Content
        const chatContent = document.createElement('div');
        chatContent.id = 'chat-content';
        chatContent.style.padding = '16px';
        chatContent.style.flex = '1';
        chatContent.style.overflowY = 'auto';
        chatContent.style.backgroundColor = '#f3f4f6';
        chatContent.style.height = 'calc(100% - 150px)';
        chatbotContainer.appendChild(chatContent);

        // Chat Input Area
        const chatInputContainer = document.createElement('div');
        chatInputContainer.style.display = 'flex';
        chatInputContainer.style.alignItems = 'center';
        chatInputContainer.style.padding = '10px';
        chatInputContainer.style.backgroundColor = '#ffffff';
        chatInputContainer.style.borderTop = '1px solid #e2e8f0';
        chatInputContainer.style.boxShadow = '0 -1px 5px rgba(0, 0, 0, 0.1)';
        chatbotContainer.appendChild(chatInputContainer);

        const inputField = document.createElement('input');
        inputField.id = 'chat-input-field';
        inputField.type = 'text';
        inputField.placeholder = 'Type your message...';
        inputField.style.width = '100%';
        inputField.style.padding = '12px';
        inputField.style.borderRadius = '8px';
        inputField.style.border = '1px solid #cbd5e1';
        inputField.style.outline = 'none';
        inputField.style.color = '#1f2937';
        inputField.style.backgroundColor = '#ffffff';
        inputField.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
        chatInputContainer.appendChild(inputField);

        const sendButton = document.createElement('button');
        sendButton.style.marginLeft = '8px';
        sendButton.style.width = '50px';
        sendButton.style.padding = '12px';
        sendButton.style.borderRadius = '50%';
        sendButton.style.color = config.primary_color;
        sendButton.style.cursor = 'pointer';
        sendButton.style.transition = 'background-color 0.2s ease-in-out';
        sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
        sendButton.onclick = sendMessage;
        chatInputContainer.appendChild(sendButton);

        // Append chatbot container to the body
        document.body.appendChild(chatbotContainer);

        // Create toggle button for chat
        toggleButton = document.createElement('button');
        toggleButton.style.position = 'fixed';
        toggleButton.style.bottom = '0';
        toggleButton.style.right = '0';
        toggleButton.style.padding = '12px';
        toggleButton.style.backgroundColor = '#2563eb';
        toggleButton.style.borderRadius = '50%';
        toggleButton.style.color = '#ffffff';
        toggleButton.style.boxShadow = '0px 10px 30px rgba(0, 0, 0, 0.2)';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.transition = 'all 0.3s ease-in-out';
        toggleButton.style.width = '60px';
        toggleButton.style.height = '60px';
        toggleButton.style.backgroundImage = `url('${config.chat_icon_image || ''}')`;
        toggleButton.style.backgroundSize = 'cover';
        toggleButton.style.backgroundPosition = 'center';
        toggleButton.onclick = toggleChat;

        const toggleButtonIcon = document.createElement('i');
        toggleButtonIcon.id = 'toggle-button-icon';
        toggleButtonIcon.className = 'fas fa-comments';
        toggleButton.appendChild(toggleButtonIcon);

        // Append the toggle button to the body
        document.body.appendChild(toggleButton);

        window.addEventListener('resize', adjustToggleButtonVisibility);

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
                    chatId = data.chatId;
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

        const chatMessageWrapper = document.createElement('div');

        messages.forEach(message => {
            const messageWrapper = document.createElement('div');

            if (message.role_id === 2) {
                messageWrapper.className = 'flex items-center justify-end space-x-3';
                const userMessage = document.createElement('div');
                userMessage.style.cssText = `
                    width: 70%;
                    padding: 10px 15px;
                    margin: 10px 0;
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
                    width: 70%;
                    padding: 10px 15px;
                    margin: 10px 0;
                    border-radius: 10px 10px 10px 2px;
                    background-color: rgb(231 231 231);
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

        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.style.cssText = 'padding: 10px; font-style: italic; color: gray;';
        typingIndicator.textContent = 'Bot is typing...';
        const chatContent = document.getElementById('chat-content');
        chatContent.appendChild(typingIndicator);
        chatContent.scrollTop = chatContent.scrollHeight;

        performPostChatAction('sendMessage', text)
            .then((data) => {
                typingIndicator.remove();

                if (data.aiMessage) {
                    messages.push(data.aiMessage);
                    displayMessages(messages);
                }
            })
            .catch((error) => {
                console.error('Error sending message:', error);
                typingIndicator.remove();
            });
    }

    function getOrCreateUserId() {
        let userId = localStorage.getItem('chat_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chat_user_id', userId);
        }
        return userId;
    }

    // loadFontAwesome();
    performGetChatAction('getConfiguration');
})();
