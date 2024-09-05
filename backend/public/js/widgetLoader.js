(function () {
    let isChatOpen = false;
    let config = {};  // Define config globally
    let messages = []; // Store messages locally
    let chatId = null; // Initialize chatId dynamically
    let sessionUserId = getOrCreateUserId(); // Use consistent naming for sessionUserId
    let role_id = 2; // Default role_id for customer

    // Get script element and chatbot ID
    const scriptTag = document.currentScript;
    const chatbotId = scriptTag.getAttribute('data-widget-id');
    const backendUrl = 'http://localhost:8000/api/configuration'; // Your backend API endpoint

    function toggleChat() {
        isChatOpen = !isChatOpen;
        const chatbotContainer = document.getElementById('chatbot-container');
        const toggleButtonIcon = document.getElementById('toggle-button-icon');

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

    function loadChatbot(configuration) {
        config = configuration;  // Assign the fetched configuration to the global config variable

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

        messages.forEach(message => {
            const messageWrapper = document.createElement('div');
            if (message.role_id === 2) {  // Assuming role_id 2 is for the user/customer
                // User Message
                messageWrapper.className = 'flex items-start justify-end';
                const userMessage = document.createElement('div');
                userMessage.className = 'message user p-3 rounded-lg';
                userMessage.style.backgroundColor = config.primary_color;
                userMessage.style.color = config.text_color;
                userMessage.textContent = message.text;
                messageWrapper.appendChild(userMessage);
            } else {
                // Bot Message
                messageWrapper.className = 'flex items-start';
                const botIcon = document.createElement('div');
                botIcon.className = `flex-shrink-0 w-10 h-10 ${config.botIconCircular ? 'rounded-full' : 'rounded-md'} bg-cover bg-center mr-3`;
                botIcon.style.backgroundImage = `url('${config.botIconImage}')`;

                const botMessage = document.createElement('div');
                botMessage.className = 'message bot bg-gray-200 text-gray-800 p-3 rounded-lg';
                botMessage.textContent = message.text;

                messageWrapper.appendChild(botIcon);
                messageWrapper.appendChild(botMessage);
            }

            chatContent.appendChild(messageWrapper);
        });

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
            displayMessages(messages);
            inputField.value = '';  // Clear the input field

            // Show a typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'typing-indicator';
            typingIndicator.textContent = 'Bot is typing...';
            document.getElementById('chat-content').appendChild(typingIndicator);

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
                        displayMessages(messages);  // Re-render the messages
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

    // Fetch configuration for the chatbot
    fetch(`${backendUrl}?chatbotId=${chatbotId}`)
        .then((response) => response.json())
        .then((configuration) => {
            if (configuration.error) throw new Error(configuration.error);
            loadChatbot(configuration);
        })
        .catch((error) => console.error('Error loading chatbot:', error));
})();

// (function () {
//     let isChatOpen = false;
//     let config = {};  // Define config globally
//     let messages = []; // Store messages locally
//     let chatId = null; // Initialize chatId dynamically
//     let userId = getOrCreateUserId(); // Initialize userId dynamically
//     let role_id = 2; // Default role_id for customer

//     // Get script element and chatbot ID
//     const scriptTag = document.currentScript;
//     const chatbotId = scriptTag.getAttribute('data-widget-id');
//     const backendUrl = 'http://localhost:8000/api/configuration'; // Your backend API endpoint

//     function toggleChat() {
//         isChatOpen = !isChatOpen;
//         const chatbotContainer = document.getElementById('chatbot-container');
//         const toggleButtonIcon = document.getElementById('toggle-button-icon');

//         if (isChatOpen) {
//             chatbotContainer.style.display = 'block';
//             toggleButtonIcon.className = 'fas fa-times';
//             fetchChatHistory();
//         } else {
//             chatbotContainer.style.display = 'none';
//             toggleButtonIcon.className = 'fas fa-bars';
//         }
//     }

//     function loadFontAwesome() {
//         const link = document.createElement('link');
//         link.rel = 'stylesheet';
//         link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
//         document.head.appendChild(link);
//     }

//     function loadChatbot(configuration) {
//         config = configuration;  // Assign the fetched configuration to the global config variable

//         // Create chatbot container
//         const chatbotContainer = document.createElement('div');
//         chatbotContainer.id = 'chatbot-container';
//         chatbotContainer.className = 'chat-widget-preview fixed bottom-[50px] right-0 mb-5 shadow-lg overflow-hidden';
//         chatbotContainer.style.width = `${config.chat_width || 350}px`;
//         chatbotContainer.style.maxWidth = '600px';
//         chatbotContainer.style.minWidth = '350px';
//         chatbotContainer.style.height = '600px';
//         chatbotContainer.style.maxHeight = '600px';
//         chatbotContainer.style.backgroundColor = '#ffffff'; // Default background
//         chatbotContainer.style.display = 'none'; // Start hidden
//         document.body.appendChild(chatbotContainer);

//         // Chat Header
//         const chatHeader = document.createElement('div');
//         chatHeader.className = 'flex items-center justify-between p-3 rounded-t-lg';
//         chatHeader.style.backgroundColor = config.primary_color;
//         chatbotContainer.appendChild(chatHeader);

//         const chatTitle = document.createElement('h3');
//         chatTitle.className = 'font-bold text-xl';
//         chatTitle.style.color = config.text_color;
//         chatTitle.textContent = config.chatbot_name || 'Chatbot';
//         chatHeader.appendChild(chatTitle);

//         // Close button in chat header
//         const closeButton = document.createElement('button');
//         closeButton.style.color = config.text_color;
//         closeButton.innerHTML = '<i class="fas fa-times"></i>'; // Close icon
//         closeButton.onclick = toggleChat;
//         chatHeader.appendChild(closeButton);

//         // Chat Content
//         const chatContent = document.createElement('div');
//         chatContent.id = 'chat-content';
//         chatContent.className = 'chat-content p-4 flex-1 overflow-y-auto bg-gray-50';
//         chatContent.style.height = '470px';
//         chatbotContainer.appendChild(chatContent);

//         // Chat Input
//         const chatInputContainer = document.createElement('div');
//         chatInputContainer.className = 'chat-input border-t p-3 bg-white flex items-center';
//         chatbotContainer.appendChild(chatInputContainer);

//         const inputField = document.createElement('input');
//         inputField.id = 'chat-input-field';
//         inputField.type = 'text';
//         inputField.placeholder = 'Type your message here';
//         inputField.className = 'w-full p-3 rounded-md focus:outline-none text-black';
//         chatInputContainer.appendChild(inputField);

//         // Send button with paper plane icon
//         const sendButton = document.createElement('button');
//         sendButton.className = 'ml-2 p-2';
//         sendButton.innerHTML = `<i class="fas fa-paper-plane" style="color: ${config.icon_color};"></i>`;
//         sendButton.onclick = sendMessage;
//         chatInputContainer.appendChild(sendButton);

//         // Append the chatbot container to the body
//         document.body.appendChild(chatbotContainer);

//         // Create toggle button for chat
//         const toggleButton = document.createElement('button');
//         toggleButton.className = 'fixed bottom-[10px] right-0 p-3 rounded-full shadow-lg';
//         toggleButton.style.backgroundColor = config.icon_color;
//         toggleButton.style.color = config.text_color;
//         toggleButton.style.width = `${config.chatIconSize || 50}px`;
//         toggleButton.style.height = `${config.chatIconSize || 50}px`;
//         toggleButton.style.borderRadius = config.chatIconCircular ? '50%' : '8px';
//         toggleButton.style.backgroundImage = `url('${config.chatIconImage || ''}')`;
//         toggleButton.style.backgroundSize = 'cover';
//         toggleButton.style.backgroundPosition = 'center';
//         toggleButton.onclick = toggleChat;

//         const toggleButtonIcon = document.createElement('i');
//         toggleButtonIcon.id = 'toggle-button-icon';
//         toggleButtonIcon.className = 'fas fa-bars'; // Default icon
//         toggleButton.appendChild(toggleButtonIcon);

//         // Only show icon if no image is set
//         if (!config.chatIconImage) {
//             toggleButton.appendChild(toggleButtonIcon);
//         }

//         // Append the toggle button to the body
//         document.body.appendChild(toggleButton);
//     }

// // Fetch chat history
// function fetchChatHistory() {
//     const backendUrl = 'http://localhost:8000/api/chat/history';

//     fetch(`${backendUrl}?chatbotId=${chatbotId}&sessionUserId=${userId}`)
//         .then(response => response.json())
//         .then(data => {
//             if (data.error) throw new Error(data.error);
//             if (data.chats && data.chats.length > 0) {
//                 messages = data.chats[0].messages || []; // Store messages locally
//                 chatId = data.chats[0].id; // Set chatId dynamically
//                 displayMessages(messages);
//             } else {
//                 // No existing chats, initialize a new chat
//                 createNewChat();
//             }
//         })
//         .catch(error => console.error('Error fetching chat history:', error));
// }

// // Function to create a new chat if none exists
// function createNewChat() {
//     const backendUrl = 'http://localhost:8000/api/chat/new';

//     console.log("Creating new chat with chatbotId:", chatbotId, "and sessionUserId:", userId);

//     fetch(backendUrl, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             chatbotId: chatbotId,
//             sessionUserId: userId
//         }),
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.error) throw new Error(data.error);
//         chatId = data.chatId; // Get new chat ID
//         messages = []; // Initialize empty message array
//         displayMessages(messages); // Display empty messages or a welcome message
//     })
//     .catch(error => console.error('Error creating new chat:', error));
// }


//     // Display fetched chat messages
//     function displayMessages(messages) {
//         const chatContent = document.getElementById('chat-content');
//         chatContent.innerHTML = ''; // Clear existing content

//         messages.forEach(message => {
//             const messageWrapper = document.createElement('div');
//             if (message.role_id === 2) {  // Assuming role_id 2 is for the user/customer
//                 // User Message
//                 messageWrapper.className = 'flex items-start justify-end';
//                 const userMessage = document.createElement('div');
//                 userMessage.className = 'message user p-3 rounded-lg';
//                 userMessage.style.backgroundColor = config.primary_color;
//                 userMessage.style.color = config.text_color;
//                 userMessage.textContent = message.text;
//                 messageWrapper.appendChild(userMessage);
//             } else {
//                 // Bot Message
//                 messageWrapper.className = 'flex items-start';
//                 const botIcon = document.createElement('div');
//                 botIcon.className = `flex-shrink-0 w-10 h-10 ${config.botIconCircular ? 'rounded-full' : 'rounded-md'} bg-cover bg-center mr-3`;
//                 botIcon.style.backgroundImage = `url('${config.botIconImage}')`;

//                 const botMessage = document.createElement('div');
//                 botMessage.className = 'message bot bg-gray-200 text-gray-800 p-3 rounded-lg';
//                 botMessage.textContent = message.text;

//                 messageWrapper.appendChild(botIcon);
//                 messageWrapper.appendChild(botMessage);
//             }

//             chatContent.appendChild(messageWrapper);
//         });

//         // Scroll to the bottom of the chat
//         chatContent.scrollTop = chatContent.scrollHeight;
//     }

//     // Send message
//     function sendMessage() {
//         const inputField = document.getElementById('chat-input-field');
//         const text = inputField.value.trim();
//         const backendUrl = 'http://localhost:8000/api/chat/message';

//         console.log("sendMessage text: ", text);
//         console.log("sendMessage chatId: ", chatId);

//         if (!text) {
//             console.error('Text is empty.');
//             return;
//         }

//         if (!chatId) {
//             console.error('chatId is not set.');
//             return;
//         }

//         if (text && chatId) {
//             // Create a user message element immediately
//             const userMessage = {
//                 text: text,
//                 role_id: role_id,  // User role ID
//             };
//             messages.push(userMessage);
//             displayMessages(messages);
//             inputField.value = '';  // Clear the input field

//             // Show a typing indicator
//             const typingIndicator = document.createElement('div');
//             typingIndicator.className = 'typing-indicator';
//             typingIndicator.textContent = 'Bot is typing...';
//             document.getElementById('chat-content').appendChild(typingIndicator);

//             fetch(backendUrl, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     chatId: chatId,
//                     text: text,
//                     role_id: role_id,  // Use dynamic role_id
//                     sessionUserId: userId
//                 }),
//             })
//                 .then(response => response.json())
//                 .then(data => {
//                     if (data.error) throw new Error(data.error);

//                     // Remove the typing indicator once the response is ready
//                     typingIndicator.remove();

//                     if (data.userMessage && data.aiMessage) {
//                         // Append the AI message to the messages array
//                         messages.push(data.aiMessage);
//                         displayMessages(messages);  // Re-render the messages
//                     } else {
//                         console.error('Message data is null or undefined:', data);
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error sending message:', error);
//                     typingIndicator.remove();  // Remove typing indicator if there's an error
//                 });
//         } else {
//             console.error('Text is empty or chatId is not set.');
//         }
//     }



//     // Generate or fetch user ID
//     function getOrCreateUserId() {
//         let userId = localStorage.getItem('chat_user_id');
//         if (!userId) {
//             userId = 'user_' + Math.random().toString(36).substr(2, 9); // Generate a random user ID
//             localStorage.setItem('chat_user_id', userId);
//         }
//         return userId;
//     }

//     // Load FontAwesome
//     loadFontAwesome();

//     // Fetch configuration for the chatbot
//     fetch(`${backendUrl}?chatbotId=${chatbotId}`)
//         .then((response) => response.json())
//         .then((configuration) => {
//             if (configuration.error) throw new Error(configuration.error);
//             loadChatbot(configuration);
//         })
//         .catch((error) => console.error('Error loading chatbot:', error));
// })();
