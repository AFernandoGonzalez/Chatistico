// (function () {
//     const scriptTag = document.getElementById('chatling-embed-script');
//     const chatbotId = scriptTag.getAttribute('data-id');
//     const displayType = scriptTag.getAttribute('data-display') || 'floating';

//     // Fetch the configuration from the server
//     fetch(`http://localhost:8000/api/configuration?chatbotId=${chatbotId}`)
//         .then(response => response.json())
//         .then(config => {
//             if (!config || !config.id) {
//                 console.error('Chatbot configuration not found.');
//                 return;
//             }

//             const iframe = document.createElement('iframe');
//             iframe.style.border = 'none';
//             iframe.id = 'chatling-chat-iframe';

//             if (displayType === 'fullscreen') {
//                 iframe.style.position = 'fixed';
//                 iframe.style.top = '0';
//                 iframe.style.left = '0';
//                 iframe.style.width = '100%';
//                 iframe.style.height = '100%';
//                 iframe.style.zIndex = '2147483647';
//             } else if (displayType === 'page_inline') {
//                 const inlineDiv = document.getElementById('chatling-inline-bot');
//                 if (inlineDiv) {
//                     inlineDiv.appendChild(iframe);
//                 } else {
//                     console.error('Inline bot container not found.');
//                     return;
//                 }
//             } else {
//                 // Floating chat setup
//                 iframe.style.position = 'fixed';
//                 iframe.style.bottom = `${config.vertical_spacing}px`;
//                 iframe.style.right = `${config.horizontal_spacing}px`;
//                 iframe.style.width = `${config.chat_width}px`;
//                 iframe.style.height = '80vh';
//                 iframe.style.zIndex = '2147483647';
//                 iframe.style.backgroundColor = config.primary_color; // Set background color from configuration
//                 // Set additional styles from configuration if needed
//             }

//             iframe.src = `http://localhost:8000/api/chatbots/widget?id=${chatbotId}`;
//             document.body.appendChild(iframe);
//         })
//         .catch(error => console.error('Failed to load chatbot:', error));
// })();

// embed.js - This script will be hosted on your server
(function () {
    const scriptTag = document.currentScript; // Gets the current script tag
    const chatbotId = scriptTag.getAttribute('data-id'); // Fetches the chatbot ID from data attribute
  
    // Check if an iframe with the chatbot ID already exists
    const existingIframe = document.querySelector(`iframe[src='http://localhost:5173/widget/${chatbotId}']`);
    if (existingIframe) {
      return; // If the iframe already exists, do not create another one
    }
  
    const iframe = document.createElement('iframe');
    iframe.src = `http://localhost:5173/widget/${chatbotId}`; // Replace with your production URL
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '600px'; // Adjust height as needed
  
    document.body.appendChild(iframe); // Appends the iframe to the body
  })();
  