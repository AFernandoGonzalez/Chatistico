(function () {
    console.log('Embed script loaded'); // Debug log
    const scriptTag = document.currentScript;  
    const chatbotId = scriptTag.getAttribute('data-id');  
    const existingIframe = document.querySelector(`iframe[src='http://localhost:5173/widget/${chatbotId}']`);
    
    if (existingIframe) {
      console.log('Existing iframe found, not adding another one');
      return;
    }
    
    const iframe = document.createElement('iframe');
    iframe.src = `http://localhost:5173/widget/${chatbotId}`;
    iframe.style.border = 'none';
    iframe.style.position = 'fixed';
    iframe.style.bottom = '20px';
    iframe.style.right = '20px';
    iframe.style.width = '400px';   
    iframe.style.height = '600px';
    iframe.style.zIndex = '2147483647';
    
    document.body.appendChild(iframe);
    console.log('Iframe added');
  })();
  