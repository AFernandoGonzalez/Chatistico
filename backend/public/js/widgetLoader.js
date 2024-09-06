(function () {
    let isChatOpen = false;
    let config = {};  // Define config globally
    let messages = []; // Store messages locally
    let chatId = null; // Initialize chatId dynamically
    let sessionUserId = getOrCreateUserId(); // Use consistent naming for sessionUserId
    let role_id = 2; // Default role_id for customer
    let toggleButton; // Define toggleButton globally

    // Get script element and chatbot ID
    const scriptTag = document.currentScript;
    const chatbotId = scriptTag.getAttribute('data-widget-id');
    const backendUrl = 'http://localhost:8000/api/configuration'; // Your backend API endpoint

    function toggleChat() {
        isChatOpen = !isChatOpen;
        const chatbotContainer = document.getElementById('chatbot-container');
        const toggleButtonIcon = document.getElementById('toggle-button-icon');

        function test() {
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

        // Initial adjustment based on current window size
        test();

        // Add event listener to adjust size on window resize
        window.addEventListener('resize', test);

        if (isChatOpen) {
            chatbotContainer.style.display = 'block';
            toggleButtonIcon.className = 'fas fa-times';
            if (messages.length === 0) {  // Avoid redundant fetches
                fetchChatHistory();
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
        config = configuration; // Assign the fetched configuration to the global config variable

        console.log("config: ", config);

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

        // Function to adjust chatbot size based on window width
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
                chatbotContainer.style.bottom = ''; // Reset
                chatbotContainer.style.right = ''; // Reset
                chatbotContainer.style.top = ''; // Reset
                chatbotContainer.style.left = ''; // Reset
                chatbotContainer.style.borderRadius = ''; // Reset
            }
        }

        // Initial adjustment based on current window size
        adjustChatbotSize();

        // Add event listener to adjust size on window resize
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

        window.addEventListener('resize', adjustHeader)

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
                    toggleButton.classList.add('hidden'); // Hide toggle button when chat is open on small screens
                } else {
                    toggleButton.classList.remove('hidden'); // Show toggle button when chat is closed on small screens
                }
            } else {
                toggleButton.classList.remove('hidden'); // Always show toggle button on larger screens
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
                toggleChat();  // Opens the chat automatically
            }, config.auto_open_delay || 0);  // Use delay if specified, otherwise 0
        }
    }

    // Fetch chat history
    function fetchChatHistory() {
        const backendUrl = 'http://localhost:8000/api/chat/history';

        fetch(`${backendUrl}?chatbotId=${chatbotId}&sessionUserId=${sessionUserId}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                if (data.chats && data.chats.length > 0) {
                    messages = data.chats[0].messages || []; // Store messages locally
                    chatId = data.chats[0].id; // Set chatId dynamically
                    displayMessages(messages);
                } else {
                    // No existing chats, initialize a new chat
                    createNewChat();
                    // Display attention grabber for new users
                    const attentionMessage = {
                        text: config.attention_grabber,
                        role_id: 1  // Assuming role_id 1 is for the bot
                    };
                    messages.push(attentionMessage);
                    displayMessages(messages);
                }
            })
            .catch(error => console.error('Error fetching chat history:', error));
    }

    // Function to create a new chat if none exists
    function createNewChat() {
        const backendUrl = 'http://localhost:8000/api/chat/new';

        console.log("Creating new chat with chatbotId:", chatbotId, "and sessionUserId:", sessionUserId);

        fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chatbotId: chatbotId,
                sessionUserId: sessionUserId
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                chatId = data.chatId; // Get new chat ID
                messages = []; // Initialize empty message array
                displayMessages(messages); // Display empty messages or a welcome message
            })
            .catch(error => console.error('Error creating new chat:', error));
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
                // User Message Wrapper
                messageWrapper.className = 'flex items-center justify-end space-x-3';  // Align message to the right, with space between message and icon

                // User Message (Bubble)
                const userMessage = document.createElement('div');
                userMessage.style.cssText = `
                    box-sizing: border-box;
                    overflow-wrap: anywhere;
                    padding: 10px 15px;
                    border-radius: 10px 10px 2px 10px;  /* Adjusted radius for user bubble */
                    font-size: 13.5px;
                    transition: width 200ms linear;
                    background-color: ${config.primary_color};  /* Using dynamic primary color */
                    color: ${config.text_color};  /* Using dynamic text color */
                `;
                userMessage.textContent = message.text;

                // // User Icon Placeholder (Right side)
                // const userIcon = document.createElement('i');
                // userIcon.className = 'fas fa-user-circle text-4xl text-gray-500';  // Larger user icon for better visibility

                // Append user icon and message
                messageWrapper.appendChild(userMessage);  // Message comes first (right-aligned)
                // messageWrapper.appendChild(userIcon);  // Icon comes after for right-aligned user

            } else {
                // Bot Message Wrapper
                messageWrapper.className = 'flex items-center space-x-3';  // Align message to the left, with space between icon and message

                // Bot Icon Placeholder (Left side)
                const botIcon = document.createElement('i');
                botIcon.className = 'fas fa-robot text-4xl text-gray-500';  // Larger bot icon for better visibility

                // Bot Message (Bubble)
                const botMessage = document.createElement('div');
                botMessage.style.cssText = `
                    box-sizing: border-box;
                    overflow-wrap: anywhere;
                    padding: 10px 15px;
                    border-radius: 10px 10px 10px 2px;  /* Adjusted radius for bot bubble */
                    font-size: 13.5px;
                    transition: width 200ms linear;
                    background-color: rgb(241, 245, 249);  /* Light gray background */
                    color: rgb(0, 0, 0);  /* Black text */
                `;
                botMessage.textContent = message.text;

                // Append bot icon and message
                messageWrapper.appendChild(botIcon);  // Icon comes first (left-aligned)
                messageWrapper.appendChild(botMessage);  // Message comes after for left-aligned bot
            }

            // Append message wrapper to chat message container
            chatMessageWrapper.appendChild(messageWrapper);
        });

        // Append chat message wrapper to chat content
        chatContent.appendChild(chatMessageWrapper);

        // Scroll to the bottom of the chat
        chatContent.scrollTop = chatContent.scrollHeight;
    }





    // Send message
    function sendMessage() {
        const inputField = document.getElementById('chat-input-field');
        const text = inputField.value.trim();
        const backendUrl = 'http://localhost:8000/api/chat/message';

        console.log("sendMessage text: ", text);
        console.log("sendMessage chatId: ", chatId);

        if (!text) {
            console.error('Text is empty.');
            return;
        }

        if (!chatId) {
            console.error('chatId is not set.');
            return;
        }

        if (text && chatId) {
            // Create a user message element immediately
            const userMessage = {
                text: text,
                role_id: role_id,  // User role ID
            };
            messages.push(userMessage);
            displayMessages(messages);  // Re-render messages to display the new message bubble
            inputField.value = '';  // Clear the input field

            // Create typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'typing-indicator';
            typingIndicator.style.cssText = `
                padding: 10px;
                font-style: italic;
                color: gray;
            `;
            typingIndicator.textContent = 'Bot is typing...';

            // Append the typing indicator
            const chatContent = document.getElementById('chat-content');
            chatContent.appendChild(typingIndicator);

            // Scroll to bottom to ensure the typing indicator is visible
            chatContent.scrollTop = chatContent.scrollHeight;

            fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatId: chatId,
                    text: text,
                    role_id: role_id,  // Use dynamic role_id
                    sessionUserId: sessionUserId
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) throw new Error(data.error);

                    // Remove the typing indicator once the response is ready
                    typingIndicator.remove();

                    if (data.userMessage && data.aiMessage) {
                        // Append the AI message to the messages array
                        messages.push(data.aiMessage);

                        // Re-render the messages with updated styles for the bubbles
                        displayMessages(messages);
                    } else {
                        console.error('Message data is null or undefined:', data);
                    }
                })
                .catch(error => {
                    console.error('Error sending message:', error);
                    typingIndicator.remove();  // Remove typing indicator if there's an error
                });
        } else {
            console.error('Text is empty or chatId is not set.');
        }
    }



    // Generate or fetch user ID
    function getOrCreateUserId() {
        let userId = localStorage.getItem('chat_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9); // Generate a random user ID
            localStorage.setItem('chat_user_id', userId);
        }
        return userId;
    }

    // Load FontAwesome
    loadFontAwesome();
    loadTailwind();

    // Fetch configuration for the chatbot
    fetch(`${backendUrl}?chatbotId=${chatbotId}`)
        .then((response) => response.json())
        .then((configuration) => {
            if (configuration.error) throw new Error(configuration.error);
            loadChatbot(configuration);
        })
        .catch((error) => console.error('Error loading chatbot:', error));
})();
