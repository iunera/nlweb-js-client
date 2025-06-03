# Chat Interface Embedding Guide

This document explains how to embed the chat interface script directly in your HTML and configure the API endpoint.

## Embedding the Script

The chat interface script can be embedded directly in your HTML file, allowing you to configure the API endpoint without modifying the JavaScript files.

### Basic Setup

1. Include the required CSS files:
   ```html
   <link rel="stylesheet" href="styles.css">
   <link rel="stylesheet" href="css/chat-interface.css">
   ```

2. Configure the API endpoint:
   ```html
   <script>
     // Configure the API endpoint here
     window.chatApiEndpoint = "http://your-api-endpoint/ask";
   </script>
   ```

3. Embed the chat interface script:
   ```html
   <script type="module">
     import ChatInterface from './js/core/ChatInterface.js';

     // Make ChatInterface available globally
     window.ChatInterface = ChatInterface;

     // Single global chat interface instance
     let chatInterface = null;

     /**
      * Finds or creates the chat interface
      * @param {string} site - The site to search
      * @param {string} display_mode - The display mode (dropdown or full)
      * @param {string} generate_mode - The generate mode (list, summarize, generate)
      * @param {string} apiEndpoint - The API endpoint for the chat
      * @returns {ChatInterface} The chat interface instance
      */
     function findChatInterface(site='', display_mode='nlwebsearch', generate_mode='generate', apiEndpoint=null) {
       // Use the configured API endpoint if not provided
       if (!apiEndpoint) {
         apiEndpoint = window.chatApiEndpoint || '/ask';
       }
       
       if (chatInterface) {
         return chatInterface;
       }
       chatInterface = new ChatInterface(site, display_mode, generate_mode, apiEndpoint);
       return chatInterface;
     }

     // Make findChatInterface available globally
     window.findChatInterface = findChatInterface;

     // Initialize the chat interface when the DOM is loaded
     document.addEventListener('DOMContentLoaded', () => {
       // Your initialization code here
       // ...
     });
   </script>
   ```

### HTML Structure

The chat interface requires the following HTML structure:

```html
<div id="ai-search-container">
  <div class="search-box">
    <input type="text" id="ai-search-input" placeholder="Ask">
    <button id="ai-search-button">Ask</button>
  </div>
  <div id="chat-container">
    <div id="close-icon">
      <!-- SVG for close icon -->
    </div>
  </div>
</div>
```

## Configuring the API Endpoint

The API endpoint can be configured in two ways:

1. **Via HTML**: Set `window.chatApiEndpoint` before the chat interface script:
   ```html
   <script>
     window.chatApiEndpoint = "http://your-api-endpoint/ask";
   </script>
   ```

2. **Via JavaScript**: Pass the API endpoint directly to the `findChatInterface` function:
   ```javascript
   const chat = findChatInterface('', 'nlwebsearch', 'generate', 'http://your-api-endpoint/ask');
   ```

## Example

See `index.html` for a complete example of embedding the chat interface script and configuring the API endpoint.

## Advanced Configuration

For more advanced configuration options, refer to the documentation in the `js/README.md` file.