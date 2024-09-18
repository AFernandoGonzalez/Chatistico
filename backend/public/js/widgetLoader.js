(function () {
  let isChatOpen = false;
  let config = {};
  let messages = [];
  let chatId = null;
  let sessionUserId = getOrCreateUserId();
  let role_id = 2;
  let toggleButton;

  const scriptTag = document.currentScript;
  const chatbotId = scriptTag.getAttribute("data-widget-id");
  const backendUrl = "http://localhost:8000/api/public/embed/chatbot/configure";

  function toggleChat() {
    isChatOpen = !isChatOpen;
    const chatbotContainer = document.getElementById("chatbot-container");
    const toggleButtonIcon = document.getElementById("toggle-button-icon");

    if (isChatOpen) {
      chatbotContainer.style.display = "block";
      toggleButtonIcon.className = "fas fa-times"; // Change toggle icon to close
      if (messages.length === 0) {
        performGetChatAction("getChatHistory");
      }
    } else {
      chatbotContainer.style.display = "none";
      toggleButtonIcon.className = "fas fa-comments";
    }

    adjustToggleButtonVisibility();
  }

  function adjustToggleButtonVisibility() {
    if (window.innerWidth <= 640) {
      toggleButton.style.display = isChatOpen ? "none" : "block";
    } else {
      toggleButton.style.display = "block";
    }
  }

  function displayValidationError(message) {
    const chatContent = document.getElementById("chat-content");

    // Create a container for the error message
    const errorWrapper = document.createElement("div");
    errorWrapper.style.display = "flex";
    errorWrapper.style.justifyContent = "center";
    errorWrapper.style.margin = "10px 0";

    // Create the error message element
    const errorMessage = document.createElement("div");
    errorMessage.style.backgroundColor = "#f8d7da";
    errorMessage.style.color = "#721c24";
    errorMessage.style.padding = "10px 15px";
    errorMessage.style.borderRadius = "5px";
    errorMessage.style.fontSize = "0.9rem";
    errorMessage.textContent = message;

    // Append the error message to the wrapper
    errorWrapper.appendChild(errorMessage);

    // Append the error message to the chat content
    chatContent.appendChild(errorWrapper);

    // Scroll to the bottom to show the latest message
    chatContent.scrollTop = chatContent.scrollHeight;

    setTimeout(() => {
      errorWrapper.remove();
    }, 5000);
  }

  function loadChatbot(configuration) {
    config = configuration.data;

    const chatbotContainer = document.createElement("div");
    chatbotContainer.id = "chatbot-container";
    chatbotContainer.style.position = "fixed";
    // chatbotContainer.style.bottom = "80px";
    chatbotContainer.style.right = "10px";
    chatbotContainer.style.boxShadow = "0px 10px 30px rgba(0, 0, 0, 0.2)";
    chatbotContainer.style.transition = "all 0.3s ease-in-out";
    chatbotContainer.style.width = "350px";
    chatbotContainer.style.height = "600px";
    chatbotContainer.style.maxWidth = "100%";
    chatbotContainer.style.maxHeight = "100%";
    chatbotContainer.style.backgroundColor = "#ffffff";
    chatbotContainer.style.borderRadius = "16px";
    chatbotContainer.style.display = "none";
    chatbotContainer.style.zIndex = "1000";
    chatbotContainer.style.overflow = "hidden";
    document.body.appendChild(chatbotContainer);

    function adjustChatbotSize() {
      if (window.innerWidth <= 640) {
        chatbotContainer.style.bottom = "0";
        chatbotContainer.style.width = "100%";
        chatbotContainer.style.height = "100%";
        chatbotContainer.style.borderRadius = "0";
      } else {
        chatbotContainer.style.bottom = "80px";
        chatbotContainer.style.width = "350px";
        chatbotContainer.style.height = "600px";
        chatbotContainer.style.borderRadius = "16px";
      }
    }
    adjustChatbotSize();
    window.addEventListener("resize", adjustChatbotSize);

    // Chat Header
    const chatHeader = document.createElement("div");
    chatHeader.style.display = "flex";
    chatHeader.style.alignItems = "center";
    chatHeader.style.justifyContent = "space-between";
    chatHeader.style.padding = "16px";
    chatHeader.style.backgroundColor = config.primary_color;
    chatHeader.style.borderBottom = "1px solid rgba(0, 0, 0, 0.1)";
    chatbotContainer.appendChild(chatHeader);

    // Create a container for the avatar and title
    const avatarTitleContainer = document.createElement("div");
    avatarTitleContainer.style.display = "flex";
    avatarTitleContainer.style.alignItems = "center";

    // Agent Avatar
    const agentAvatar = document.createElement("img");
    agentAvatar.src =
      config.agent_avatar ||
      "https://images.unsplash.com/photo-1561212044-bac5ef688a07?w=900&auto=format&fit=crop&q=60";
    agentAvatar.alt = "Agent Avatar";
    agentAvatar.style.width = "48px";
    agentAvatar.style.height = "48px";
    agentAvatar.style.borderRadius = "50%";
    agentAvatar.style.marginRight = "8px";
    avatarTitleContainer.appendChild(agentAvatar);

    // Chat Title
    const chatTitle = document.createElement("h3");
    chatTitle.style.fontWeight = "bold";
    chatTitle.style.fontSize = "1.25rem";
    chatTitle.style.color = config.text_color;
    chatTitle.textContent = config.chatbot_name || "Chatbot";
    avatarTitleContainer.appendChild(chatTitle);

    chatHeader.appendChild(avatarTitleContainer);

    // Close Button
    const closeButton = document.createElement("button");
    closeButton.style.color = "#ffffff";
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.style.cursor = "pointer";
    closeButton.onclick = toggleChat;
    chatHeader.appendChild(closeButton);

    // Chat Content
    const chatContent = document.createElement("div");
    chatContent.id = "chat-content";
    chatContent.style.padding = "16px";
    chatContent.style.flex = "1";
    chatContent.style.overflowY = "auto";
    chatContent.style.backgroundColor = "#f3f4f6";
    chatContent.style.height = "calc(100% - 150px)";
    chatbotContainer.appendChild(chatContent);

    // Chat Input Area
    const chatInputContainer = document.createElement("div");
    chatInputContainer.style.display = "flex";
    chatInputContainer.style.alignItems = "center";
    chatInputContainer.style.padding = "10px";
    chatInputContainer.style.backgroundColor = "#ffffff";
    chatInputContainer.style.borderTop = "1px solid #e2e8f0";
    chatInputContainer.style.boxShadow = "0 -1px 5px rgba(0, 0, 0, 0.1)";
    chatbotContainer.appendChild(chatInputContainer);

    const inputField = document.createElement("input");
    inputField.id = "chat-input-field";
    inputField.type = "text";
    inputField.placeholder = "Type your message...";
    inputField.style.width = "100%";
    inputField.style.padding = "12px";
    inputField.style.borderRadius = "8px";
    inputField.style.border = "1px solid #cbd5e1";
    inputField.style.outline = "none";
    inputField.style.color = "#1f2937";
    inputField.style.backgroundColor = "#ffffff";
    inputField.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        sendMessage();
      }
    });
    chatInputContainer.appendChild(inputField);

    const sendButton = document.createElement("button");
    sendButton.style.marginLeft = "8px";
    sendButton.style.width = "50px";
    sendButton.style.padding = "12px";
    sendButton.style.borderRadius = "50%";
    sendButton.style.color = config.primary_color;
    sendButton.style.cursor = "pointer";
    sendButton.style.transition = "background-color 0.2s ease-in-out";
    sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
    sendButton.onclick = sendMessage;
    chatInputContainer.appendChild(sendButton);

    // Append chatbot container to the body
    document.body.appendChild(chatbotContainer);

    // Create toggle button for chat
    toggleButton = document.createElement("button");
    toggleButton.style.position = "fixed";
    toggleButton.style.bottom = "10px";
    toggleButton.style.right = "10px";
    toggleButton.style.padding = "12px";
    toggleButton.style.backgroundColor = "#2563eb";
    toggleButton.style.borderRadius = "50%";
    toggleButton.style.color = "#ffffff";
    toggleButton.style.boxShadow = "0px 10px 30px rgba(0, 0, 0, 0.2)";
    toggleButton.style.cursor = "pointer";
    toggleButton.style.transition = "all 0.3s ease-in-out";
    toggleButton.style.width = "60px";
    toggleButton.style.height = "60px";
    toggleButton.style.backgroundImage = `url('${
      config.chat_icon_image || ""
    }')`;
    toggleButton.style.backgroundSize = "cover";
    toggleButton.style.backgroundPosition = "center";
    toggleButton.onclick = toggleChat;

    const toggleButtonIcon = document.createElement("i");
    toggleButtonIcon.id = "toggle-button-icon";
    toggleButtonIcon.className = "fas fa-comments";
    toggleButton.appendChild(toggleButtonIcon);

    // Append the toggle button to the body
    document.body.appendChild(toggleButton);

    window.addEventListener("resize", adjustToggleButtonVisibility);

    // Auto open chat if configured to do so
    if (config.auto_open_behavior === "auto") {
      setTimeout(() => {
        toggleChat();
      }, config.auto_open_delay || 0);
    }
  }

  // Fetch chat data using GET
  function performGetChatAction(action) {
    const url = `${backendUrl}?action=${action}&chatbotId=${chatbotId}&sessionUserId=${sessionUserId}`;

    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          // console.error('Error:', data.error);
          displayValidationError(data.error);
        } else {
          if (action === "getChatHistory") {
            if (data.chats.length > 0) {
              messages = data.chats[0].messages || [];
              chatId = data.chats[0].id;
              displayMessages(messages);
            } else {
              performPostChatAction("createNewChat");
            }
          } else if (action === "getConfiguration") {
            loadChatbot(data);
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Perform POST actions for chat
  function performPostChatAction(action, text = null) {
    const payload = {
      action: action,
      chatbotId: chatbotId,
      sessionUserId: sessionUserId,
      text: text,
      role_id: role_id,
      chatId: chatId,
    };

    return fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error:", data.error);
          throw new Error(data.error);
        }
        if (action === "createNewChat") {
          chatId = data.chatId;
          messages = [];
          displayMessages(messages);
        }
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
        displayValidationError(
          error.message || "An error occurred while processing your request."
        );
        throw error;
      });
  }

  // Display fetched chat messages
  function displayMessages(messages) {
    const chatContent = document.getElementById("chat-content");
    chatContent.innerHTML = "";

    const chatMessageWrapper = document.createElement("div");
    const lastMessageIndex = messages.length - 1;

    messages.forEach((message, index) => {
      const messageWrapper = document.createElement("div");
      messageWrapper.style.display = "flex";
      messageWrapper.style.flexDirection = "column";
      messageWrapper.style.marginBottom = "10px";

      // Only apply the fade-in effect to the last message
      if (index === lastMessageIndex) {
        messageWrapper.style.animation = "fadeInUp 0.7s ease-in-out";
      }

      if (message.role_id === 2) {
        // User's message (aligned to the right)
        messageWrapper.style.alignItems = "flex-end";

        // Display "You" above the message
        const userName = document.createElement("span");
        userName.style.fontSize = "0.9rem";
        userName.style.color = "gray";
        userName.textContent = "You";
        messageWrapper.appendChild(userName);

        // User message bubble
        const userMessage = document.createElement("div");
        userMessage.style.cssText = `
                width: 70%;
                padding: 10px 15px;
                margin: 10px 0;
                border-radius: 10px 10px 2px 10px;
                background-color: ${config.primary_color};
                color: ${config.text_color};
            `;

        // Apply the text fade-in effect only to the last message
        if (index === lastMessageIndex) {
          userMessage.style.animation = "fadeInText 0.6s ease-in-out 0.3s"; // Text fades in after bubble
          userMessage.style.animationFillMode = "backwards";
        }

        userMessage.textContent = message.text;
        messageWrapper.appendChild(userMessage);
      } else {
        // Bot's message (aligned to the left)
        messageWrapper.style.alignItems = "flex-start";

        // Display bot's name above the message
        const botName = document.createElement("span");
        botName.style.fontSize = "0.9rem";
        botName.style.color = "gray";
        botName.textContent = config.chatbot_name || "Bot";
        messageWrapper.appendChild(botName);

        // Bot message bubble
        const botMessage = document.createElement("div");
        botMessage.style.cssText = `
                width: 70%;
                padding: 10px 15px;
                margin: 10px 0;
                border-radius: 10px 10px 10px 2px;
                background-color: rgb(231, 231, 231);
                color: rgb(0, 0, 0);
            `;

        // Apply the text fade-in effect only to the last message
        if (index === lastMessageIndex) {
          botMessage.style.animation = "fadeInText 0.6s ease-in-out 0.3s"; // Text fades in after bubble
          botMessage.style.animationFillMode = "backwards";
        }

        botMessage.textContent = message.text;
        messageWrapper.appendChild(botMessage);
      }

      chatMessageWrapper.appendChild(messageWrapper);
    });

    chatContent.appendChild(chatMessageWrapper);
    chatContent.scrollTop = chatContent.scrollHeight; // Scroll to the bottom of chat
  }

  // Add the CSS for fade-in animation effect if not already added
  if (!document.getElementById("chat-styles")) {
    const style = document.createElement("style");
    style.id = "chat-styles";
    style.textContent = `
    @keyframes fadeInUp {
        0% {
            opacity: 0;
            transform: translateY(20px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeInText {
        from { opacity: 0 }
        to { opacity: 1 }
    }
    `;
    document.head.appendChild(style);
  }

  // Send message
  function sendMessage() {
    const inputField = document.getElementById("chat-input-field");
    const text = inputField.value.trim();

    if (text.length < 1 || text.length > 150) {
      displayValidationError(
        "Message must be between 1 and 150 characters long."
      ); // Show error in chatbot
      return;
    }

    if (!text) {
      return console.error("Text is empty.");
    }

    if (!chatId) {
      performPostChatAction("createNewChat");
      return;
    }
    const userMessage = { text, role_id: role_id };
    messages.push(userMessage);
    displayMessages(messages);
    inputField.value = "";

    // Typing indicator
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "typing-indicator";
    typingIndicator.style.cssText = "display: flex; align-items: center;";

    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("span");
      dot.className = `dot dot-${i}`;
      dot.style.cssText = `
                display: inline-block;
                width: 8px;
                height: 8px;
                margin: 0 2px;
                border-radius: 50%;
                background-color: gray;
                animation: bounce 1.4s infinite both;
                animation-delay: ${i * 0.2}s;
            `;
      typingIndicator.appendChild(dot);
    }

    // Append typing indicator to chat content
    const chatContent = document.getElementById("chat-content");
    chatContent.appendChild(typingIndicator);
    chatContent.scrollTop = chatContent.scrollHeight;

    // Post the message to the server
    performPostChatAction("sendMessage", text)
      .then((data) => {
        typingIndicator.remove();

        if (data.aiMessage) {
          messages.push(data.aiMessage);
          displayMessages(messages);
        }
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        typingIndicator.remove();
      });
  }

  // Add the CSS animation for the dots
  const style = document.createElement("style");
  style.textContent = `
    @keyframes bounce {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-5px);
        }
    }
    
    .dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        margin: 0 2px;
        border-radius: 50%;
        background-color: gray;
    }
    `;
  document.head.appendChild(style);

  function getOrCreateUserId() {
    let userId = localStorage.getItem("chat_user_id");
    if (!userId) {
      userId = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("chat_user_id", userId);
    }
    return userId;
  }

  performGetChatAction("getConfiguration");
})();
