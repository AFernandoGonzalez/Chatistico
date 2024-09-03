(function () {
    // Function to dynamically load the CSS file for the widget
    function loadCSS(href) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
      console.log('CSS loaded:', href); // Debug statement
    }
  
    // Function to dynamically load the JS file for the widget
    function loadScript(src, onLoad) {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = onLoad;
      document.head.appendChild(script);
      console.log('Script loaded:', src); // Debug statement
    }
  
    // Function to fetch the widget configuration from the backend
    async function fetchConfig(widgetId) {
      console.log('Fetching config for widgetId:', widgetId); // Debug statement
      try {
        const response = await fetch(`http://localhost:8000/api/configuration?chatbotId=${widgetId}`);
        const config = await response.json();
        console.log('Config fetched:', config); // Debug statement
        return config;
      } catch (error) {
        console.error('Error fetching widget config:', error);
        return null;
      }
    }
  
    // Check if the widget already exists to avoid multiple instances
    if (!document.getElementById('chatling-widget-container')) {
      // Create a container for the chat widget
      const container = document.createElement('div');
      container.id = 'chatling-widget-container';
      document.body.appendChild(container);
      console.log('Widget container created'); // Debug statement
  
      // Retrieve the widget ID from the script tag's data attribute
      const widgetId = document.currentScript.getAttribute('data-widget-id');
      console.log('Retrieved widgetId:', widgetId); // Debug statement
  
      // Fetch the configuration and then load the widget
      fetchConfig(widgetId).then((config) => {
        if (!config) {
          console.error('No config found for widgetId:', widgetId);
          return;
        }
  
        window.chatlingConfig = config; // Store the config globally for widget use
  
        // Load CSS for the widget
        loadCSS('http://localhost:8000/css/widget.css');
  
        // Load the React app for the widget
        loadScript('http://localhost:8000/js/widget.js', function () {
          console.log('Chatling widget loaded successfully.');
        });
      });
    }
  })();
  