(function () {
  console.log('Embed script loaded'); // Debug log

  // Get the current script tag to fetch attributes
  const scriptTag = document.currentScript;
  const chatbotId = scriptTag.getAttribute('data-id');
  const userId = scriptTag.getAttribute('data-user'); // Fetch userId from data attribute

  // Log IDs for debugging
  console.log('chatbotId:', chatbotId);
  console.log('userId:', userId);

  // Check if `chatbotId` or `userId` is undefined
  if (!chatbotId || !userId) {
    console.error('Missing chatbotId or userId.');
    return;
  }

  // Function to initialize the chatbot widget
  function initializeChatbotWidget(config) {
    const {
      chatbot_id,
      primary_color: primaryColor,
      text_color: textColor,
      icon_color: iconColor,
      chat_width: chatWidth,
      widget_position: widgetPosition,
      bot_icon_circular: botIconCircular,
      chat_icon_circular: chatIconCircular,
      chat_icon_size: chatIconSize,
      bot_icon_image: botIconImage,
      chat_icon_image: chatIconImage,
      chatbot_name: chatbotName,
    } = config;

    // Debugging: Log configuration
    console.log("Using chatbotId:", chatbot_id, primaryColor, textColor, iconColor, chatWidth, widgetPosition);

    // Create a container for the chatbot
    const container = document.createElement('div');
    container.id = `chatbot-container-${chatbot_id}`;
    container.className = 'chat-widget-preview fixed bottom-[50px] right-0 mb-5 bg-white shadow-lg overflow-hidden';
    container.style.width = `${chatWidth}px`;
    container.style.maxWidth = '600px';
    container.style.minWidth = '350px';
    container.style.height = '600px';
    container.style.maxHeight = '600px';
    document.body.appendChild(container);

    // Chat Header
    const header = document.createElement('div');
    header.className = 'flex items-center justify-between p-3 rounded-t-lg';
    header.style.backgroundColor = primaryColor;
    header.innerHTML = `
      <h3 class="font-bold text-xl" style="color: ${textColor}">${chatbotName}</h3>
      <button id="close-chat" class="close-chat" style="color: ${textColor}">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="fa fa-times" viewBox="0 0 16 16">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </button>
    `;
    container.appendChild(header);

    // Chat Content
    const content = document.createElement('div');
    content.className = 'chat-content p-4 flex-1 overflow-y-auto bg-gray-50 h-[470px]';
    content.id = `chatbot-content-${chatbot_id}`;
    container.appendChild(content);

    // Fetch chat history or initial messages
    const chatHistoryUrl = `http://localhost:8000/api/chat/history?userId=${userId}&chatbotId=${chatbot_id}`;
    fetch(chatHistoryUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.chats && Array.isArray(data.chats)) {
          // Display all chats for this user and chatbot
          data.chats.forEach(chat => {
            chat.messages.forEach(message => {
              const messageDiv = document.createElement('div');
              messageDiv.className = message.role_id === 1 ? 'flex items-start' : 'flex items-start justify-end';
              messageDiv.innerHTML = `
                ${message.role_id === 1 ? `
                <div class="flex-shrink-0 w-10 h-10 ${botIconCircular ? 'rounded-full' : 'rounded-md'} bg-cover bg-center mr-3" style="background-image: url('${botIconImage}')"></div>` : ''}
                <div class="message ${message.role_id === 1 ? 'bot' : 'user'} ${message.role_id === 1 ? 'bg-gray-200 text-gray-800' : ''} p-3 rounded-lg" style="${message.role_id !== 1 ? `background-color: ${primaryColor}; color: ${textColor}` : ''}">
                  ${message.text}
                </div>
              `;
              content.appendChild(messageDiv);
            });
          });
        } else {
          console.error('Invalid chat data:', data);
        }
      })
      .catch(error => console.error('Error fetching chat history:', error));

    // Chat Input
    const chatInput = document.createElement('div');
    chatInput.className = 'chat-input border-t p-3 bg-white flex items-center';
    chatInput.innerHTML = `
      <input type="text" placeholder="Type your message here" class="w-full p-3 rounded-md focus:outline-none text-black" />
      <button class="ml-2 p-2" id="send-message">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="fa fa-paper-plane" viewBox="0 0 16 16">
          <path d="M15.854.146a.5.5 0 0 1 .036.638l-7 10a.5.5 0 0 1-.832 0l-7-10A.5.5 0 0 1 .854.146L8 8.293 15.146.146a.5.5 0 0 1 .708 0z"/>
        </svg>
      </button>
    `;
    container.appendChild(chatInput);

    // Add event listener for send button
    const sendButton = chatInput.querySelector('#send-message');
    const inputField = chatInput.querySelector('input');
    sendButton.addEventListener('click', () => {
      const message = inputField.value;
      // Send message to server
      fetch(`http://localhost:8000/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatbotId: chatbot_id, userId, message })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const messageDiv = document.createElement('div');
          messageDiv.className = 'flex items-start justify-end';
          messageDiv.innerHTML = `
            <div class="message user p-3 rounded-lg" style="background-color: ${primaryColor}; color: ${textColor}">
              ${data.reply}
            </div>
          `;
          content.appendChild(messageDiv);
          inputField.value = '';
        })
        .catch(error => console.error('Error sending message:', error));
    });

    // Add event listener for close button
    const closeButton = header.querySelector('#close-chat');
    closeButton.addEventListener('click', () => {
      container.style.display = 'none';
    });

    // Toggle Button for Chat
    const toggleButton = document.createElement('button');
    toggleButton.style.backgroundColor = iconColor;
    toggleButton.style.color = textColor;
    toggleButton.style.width = `${chatIconSize}px`;
    toggleButton.style.height = `${chatIconSize}px`;
    toggleButton.style.borderRadius = chatIconCircular ? '50%' : '8px';
    toggleButton.style.backgroundImage = `url('${chatIconImage}')`;
    toggleButton.style.backgroundSize = 'cover';
    toggleButton.style.backgroundPosition = 'center';
    toggleButton.className = 'fixed bottom-[10px] right-0 p-3 rounded-full shadow-lg';
    toggleButton.innerHTML = chatIconImage ? '' : `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="fa ${container.style.display === 'none' ? 'fa-bars' : 'fa-times'}" viewBox="0 0 16 16">
      ${container.style.display === 'none' ? `
      <path d="M1 2.75a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75zm0 5a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1-.75-.75zm0 5a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1-.75-.75z"/>` : `
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>`}
    </svg>`;
    toggleButton.onclick = () => {
      const isHidden = container.style.display === 'none';
      container.style.display = isHidden ? 'block' : 'none';
      toggleButton.innerHTML = chatIconImage ? '' : `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="fa ${isHidden ? 'fa-times' : 'fa-bars'}" viewBox="0 0 16 16">
        ${isHidden ? `
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>` : `
        <path d="M1 2.75a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75zm0 5a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1-.75-.75zm0 5a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1-.75-.75z"/>`}
      </svg>`;
    };
    document.body.appendChild(toggleButton);
  }

  // Fetch configuration from your server
  fetch(`http://localhost:8000/api/configuration?chatbotId=${chatbotId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(config => {
      if (config) {
        // Initialize the chatbot widget with fetched configuration
        initializeChatbotWidget(config);
      } else {
        console.error('No configuration found for this chatbot.');
      }
    })
    .catch(error => {
      console.error('Error fetching chatbot configuration:', error);
    });
})();
