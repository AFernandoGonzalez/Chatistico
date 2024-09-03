// widgetLoader.js
(function () {
    let isChatOpen = false;

    function toggleChat() {
        isChatOpen = !isChatOpen;
        const chatbotContainer = document.getElementById('chatbot-container');
        const toggleButtonIcon = document.getElementById('toggle-button-icon');

        if (isChatOpen) {
            chatbotContainer.style.display = 'block';
            toggleButtonIcon.className = 'fas fa-times';
            fetchChatHistory();
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

    function loadChatbot(config) {
        // Create chatbot container
        const chatbotContainer = document.createElement('div');
        chatbotContainer.id = 'chatbot-container';
        chatbotContainer.className = 'chat-widget-preview fixed bottom-[50px] right-0 mb-5 shadow-lg overflow-hidden';
        chatbotContainer.style.width = `${config.chat_width || 350}px`;
        chatbotContainer.style.maxWidth = '600px';
        chatbotContainer.style.minWidth = '350px';
        chatbotContainer.style.height = '600px';
        chatbotContainer.style.maxHeight = '600px';
        chatbotContainer.style.backgroundColor = '#ffffff'; // Default background
        chatbotContainer.style.display = 'none'; // Start hidden
        document.body.appendChild(chatbotContainer);

        // Chat Header
        const chatHeader = document.createElement('div');
        chatHeader.className = 'flex items-center justify-between p-3 rounded-t-lg';
        chatHeader.style.backgroundColor = config.primary_color;
        chatbotContainer.appendChild(chatHeader);

        const chatTitle = document.createElement('h3');
        chatTitle.className = 'font-bold text-xl';
        chatTitle.style.color = config.text_color;
        chatTitle.textContent = config.chatbot_name || 'Chatbot';
        chatHeader.appendChild(chatTitle);

        // Close button in chat header
        const closeButton = document.createElement('button');
        closeButton.style.color = config.text_color;
        closeButton.innerHTML = '<i class="fas fa-times"></i>'; // Close icon
        closeButton.onclick = toggleChat;
        chatHeader.appendChild(closeButton);

        // Chat Content
        const chatContent = document.createElement('div');
        chatContent.id = 'chat-content';
        chatContent.className = 'chat-content p-4 flex-1 overflow-y-auto bg-gray-50';
        chatContent.style.height = '470px';
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
        const toggleButton = document.createElement('button');
        toggleButton.className = 'fixed bottom-[10px] right-0 p-3 rounded-full shadow-lg';
        toggleButton.style.backgroundColor = config.icon_color;
        toggleButton.style.color = config.text_color;
        toggleButton.style.width = `${config.chatIconSize || 50}px`;
        toggleButton.style.height = `${config.chatIconSize || 50}px`;
        toggleButton.style.borderRadius = config.chatIconCircular ? '50%' : '8px';
        toggleButton.style.backgroundImage = `url('${config.chatIconImage || ''}')`;
        toggleButton.style.backgroundSize = 'cover';
        toggleButton.style.backgroundPosition = 'center';
        toggleButton.onclick = toggleChat;

        const toggleButtonIcon = document.createElement('i');
        toggleButtonIcon.id = 'toggle-button-icon';
        toggleButtonIcon.className = 'fas fa-bars'; // Default icon
        toggleButton.appendChild(toggleButtonIcon);

        // Only show icon if no image is set
        if (!config.chatIconImage) {
            toggleButton.appendChild(toggleButtonIcon);
        }

        // Append the toggle button to the body
        document.body.appendChild(toggleButton);
    }

    // Fetch chat history
    function fetchChatHistory() {
        const userId = '1'; // Replace with actual user ID
        const chatbotId = '1'; // Replace with actual chatbot ID
        const backendUrl = 'http://localhost:8000/api/chat/history'; // Your backend API endpoint

        fetch(`${backendUrl}?userId=${userId}&chatbotId=${chatbotId}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                displayMessages(data.chats);
            })
            .catch(error => console.error('Error fetching chat history:', error));
    }

    // Display fetched chat messages
    function displayMessages(chats) {
        const chatContent = document.getElementById('chat-content');
        chatContent.innerHTML = ''; // Clear existing content

        chats.forEach(chat => {
            chat.messages.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.className = message.role_id === 'user' ? 'message user p-3 rounded-lg' : 'message bot bg-gray-200 text-gray-800 p-3 rounded-lg';
                messageElement.textContent = message.text;
                messageElement.style.backgroundColor = message.role_id === 'user' ? '#0000FF' : '#F0F0F0'; // User messages in blue, bot messages in grey
                messageElement.style.color = message.role_id === 'user' ? '#FFFFFF' : '#000000'; // Text color based on role
                chatContent.appendChild(messageElement);
            });
        });
    }

    // Send message
    function sendMessage() {
        const chatId = '1';
        const role_id = '1';
        const inputField = document.getElementById('chat-input-field');
        const text = inputField.value.trim();
        const backendUrl = 'http://localhost:8000/api/chat/message'; // Your backend API endpoint

        if (text) {
            fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatId: chatId,
                    text: text,
                    role_id: role_id,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) throw new Error(data.error);
                    displayMessages([{ messages: [data.message] }]); // Display the new message
                    inputField.value = ''; // Clear the input field
                })
                .catch(error => console.error('Error sending message:', error));
        }
    }

    // Load FontAwesome
    loadFontAwesome();

    // Get script element and chatbot ID
    const scriptTag = document.currentScript;
    const chatbotId = scriptTag.getAttribute('data-widget-id');
    const backendUrl = 'http://localhost:8000/api/configuration'; // Your backend API endpoint

    // Fetch configuration for the chatbot
    fetch(`${backendUrl}?chatbotId=${chatbotId}`)
        .then((response) => response.json())
        .then((config) => {
            if (config.error) throw new Error(config.error);
            loadChatbot(config);
        })
        .catch((error) => console.error('Error loading chatbot:', error));
})();
