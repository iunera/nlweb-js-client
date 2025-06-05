# NLWeb JS Client: AI-Powered Chat Interface for Web Applications

[![npm version](https://img.shields.io/npm/v/nlweb-js-client.svg)](https://www.npmjs.com/package/nlweb-js-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

NLWeb JS Client is a powerful, lightweight JavaScript library that enables developers to easily integrate AI-powered chat functionality into websites and web applications. This streaming chat interface client provides real-time, interactive conversational experiences for users through a customizable UI component.

Developed by [iunera](https://www.iunera.com), this library builds upon the JavaScript example implementation from [Microsoft NLWeb](https://github.com/microsoft/NLWeb). It offers a streamlined solution for connecting web applications to NLWeb servers, creating engaging AI chatbot experiences with minimal setup.

For a comprehensive guide on implementing NLWeb in production environments, read [iunera's detailed blog post on end-to-end chat integration with NLWeb](https://www.iunera.com/kraken/machine-learning-ai/nlweb-enables-ai-powered-websites/).

## Key Features

- **Real-time Streaming Responses**: Deliver dynamic, word-by-word AI responses for a natural conversational feel
- **Flexible Integration Options**: Multiple implementation methods including NPM, CDN, and direct download
- **Customizable UI Components**: Easily adapt the chat interface to match your website's design
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Configurable API Endpoints**: Connect to any NLWeb-compatible backend
- **Simple HTML Structure**: Straightforward integration with minimal markup requirements

## Installation

### NPM

```bash
npm install nlweb-js-client
```

### CDN

Include the library directly from a CDN for quick implementation:

```html
<!-- Include the CSS -->
<link rel="stylesheet" href="https://unpkg.com/nlweb-js-client/dist/css/chat-interface.css">

<!-- Include the JS -->
<script src="https://unpkg.com/nlweb-js-client/dist/nlweb-js-client.min.js"></script>
```

You can also use a specific version by adding the version number to the URL (e.g., `https://unpkg.com/nlweb-js-client@1.0.2/...`).

### Direct Download

Download the latest release from the [GitHub repository](https://github.com/iunera/nlweb-js-client/releases) and include the files directly in your project.

## Quick Start Guide

### Basic HTML Structure

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
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </div>
  </div>
</div>
```

### Implementation Methods

#### Using the Bundled Version

The simplest way to implement the chatbot interface:

```html
<!-- Include the CSS -->
<link rel="stylesheet" href="./dist/css/chat-interface.css">

<!-- Include the JS -->
<script src="./dist/nlweb-js-client.min.js"></script>
<!-- or -->
<script src="https://unpkg.com/nlweb-js-client/dist/nlweb-js-client.min.js"></script>

<script>
  // Configure the API endpoint
  window.chatApiEndpoint = "http://your-api-endpoint/ask";

  // Initialize the chat interface
  document.addEventListener('DOMContentLoaded', () => {
    const chat = NLWebJsClient();

    // You can interact with the chat interface
    chat.sendMessage('Hello, how can I help you today?');

    // Listen for events
    chat.on('message', (message) => {
      console.log('New message:', message);
    });
  });
</script>
```

See [example-bundled.html](examples/example-bundled.html) for a complete example.

#### Using as an ES Module

For modern JavaScript applications and more control:

```javascript
import { ChatInterface, findChatInterface } from 'nlweb-js-client';

// Option 1: Use the helper function to find or create a chat interface
const chat = findChatInterface(
  '', // site (optional)
  'nlwebsearch', // display mode
  'generate', // generate mode. Use `list` for just listing the results
  'http://your-api-endpoint/ask' // API endpoint
);

// Option 2: Create the chat interface directly
const chatInterface = new ChatInterface(
  '', // site (optional)
  'nlwebsearch', // display mode
  'generate', // generate mode
  'http://your-api-endpoint/ask' // API endpoint
);

// Send a message programmatically
chatInterface.sendMessage('Hello, how can I help you today?');

// Listen for events
chatInterface.on('message', (message) => {
  console.log('New message:', message);
});
```

## Configuration Options

### API Endpoint Configuration

Configure the backend API endpoint in two ways:

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

### Display Modes

Choose from different display modes to suit your application:

- `nlwebsearch`: Standard chat interface with search functionality
- `chat`: Simple chat interface without search functionality
- `embed`: Embedded chat interface for integration into existing UI

Example:
```javascript
const chat = findChatInterface('', 'chat', 'generate', 'http://your-api-endpoint/ask');
```

### Response Generation Modes

Control how AI responses are delivered:

- `generate`: Standard response generation
- `stream`: Streaming response generation (responses appear word by word)

Example:
```javascript
const chat = findChatInterface('', 'nlwebsearch', 'stream', 'http://your-api-endpoint/ask');
```

### Advanced Configuration

Further customize the chat interface with additional options:

```javascript
const options = {
  debug: true, // Enable debug logging
  autoOpen: false, // Don't open the chat interface automatically
  placeholder: 'Type your question...', // Custom placeholder for the input field
  theme: 'dark', // Use dark theme (default is 'light')
  maxMessages: 50, // Maximum number of messages to keep in history
};

const chat = findChatInterface('', 'nlwebsearch', 'generate', 'http://your-api-endpoint/ask', options);
```

## Development and Building

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Build Commands

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Development mode with watch
npm run dev
```

The build process creates the following files in the `dist` directory:

- `nlweb-js-client.js` - UMD build (unminified)
- `nlweb-js-client.min.js` - UMD build (minified)
- `nlweb-js-client.esm.js` - ES module build
- CSS files in the `dist/css` directory

### Publishing to npm

This library can be published to npm, making it available for installation via npm/yarn and automatically accessible via the unpkg CDN.

#### Prerequisites for Publishing

1. You need an npm account. If you don't have one, create it at [npmjs.com](https://www.npmjs.com/signup)
2. You need to be logged in to npm in your terminal: `npm login`
3. You need to have appropriate access rights to the npm package

## API Documentation

### Methods

The chat interface provides the following methods:

| Method | Description | Parameters |
|--------|-------------|------------|
| `sendMessage(message)` | Sends a message to the chat interface | `message` (string): The message to send |
| `clearChat()` | Clears all messages from the chat interface | None |
| `on(event, callback)` | Registers an event listener | `event` (string): Event name, `callback` (function): Event handler |
| `off(event, callback)` | Removes an event listener | `event` (string): Event name, `callback` (function): Event handler |
| `show()` | Shows the chat interface | None |
| `hide()` | Hides the chat interface | None |

### Events

| Event | Description | Callback Parameters |
|-------|-------------|---------------------|
| `message` | Fired when a new message is received | `message` (object): The message object |
| `send` | Fired when a message is sent | `message` (string): The message text |
| `open` | Fired when the chat interface is opened | None |
| `close` | Fired when the chat interface is closed | None |
| `error` | Fired when an error occurs | `error` (object): The error object |

Example:
```javascript
const chat = findChatInterface();

chat.on('message', (message) => {
  console.log('New message received:', message);
});

chat.on('error', (error) => {
  console.error('An error occurred:', error);
});
```

## Browser Compatibility

NLWeb JS Client is compatible with all modern browsers:

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

For older browsers, you may need to include polyfills for features like Promises, Fetch API, and EventSource.

## Troubleshooting

### Common Issues

1. **Chat interface not appearing**
   - Ensure the HTML structure is correct
   - Check browser console for JavaScript errors
   - Verify that the CSS file is properly loaded

2. **Messages not sending**
   - Check that the API endpoint is correctly configured
   - Verify network connectivity to the API endpoint
   - Look for CORS errors in the browser console

3. **Styling issues**
   - Make sure the CSS file is properly loaded
   - Check for CSS conflicts with your existing styles
   - Try using the bundled version which includes all necessary styles

### Debugging

To enable debug mode, set the `debug` option to `true`:

```javascript
const chat = findChatInterface('', 'nlwebsearch', 'generate', 'http://your-api-endpoint/ask', { debug: true });
```

This will output detailed logs to the browser console.

## Legacy Integration

For legacy usage or development purposes, you can still embed the chat interface script directly in your HTML file:

```html
<link rel="stylesheet" href="css/chat-interface.css">
<script type="module" src="js/init/ChatInterfaceInit.js"></script>
```

See [example.html](examples/example-bundled.html) for a complete example.

## Contributing

Contributions to NLWeb JS Client are welcome! Here's how you can contribute:

1. **Fork the repository**: Create your own fork of the project
2. **Create a branch**: Make your changes in a new branch
3. **Submit a pull request**: Open a PR from your branch to the main repository

### Development Guidelines

- Follow the existing code style and conventions
- Write clear, commented code
- Test your changes thoroughly
- Update documentation as needed

### Reporting Issues

If you find a bug or have a feature request, please open an issue on the GitHub repository. Include as much detail as possible:

- A clear description of the issue or feature
- Steps to reproduce (for bugs)
- Expected vs. actual behavior
- Screenshots if applicable
- Environment details (browser, OS, etc.)

## License

NLWeb JS Client is licensed under the [MIT License](LICENSE). See the LICENSE file for more details.

## About

NLWeb JS Client is maintained by [iunera](https://www.iunera.com), a company specializing in AI-powered solutions for businesses. This library is part of our commitment to making advanced AI technology accessible to web developers.

Built on Microsoft's NLWeb foundation, this client library enables seamless integration of conversational AI capabilities into any website or web application. For more information about implementing NLWeb in production environments, visit our [detailed guide](https://www.iunera.com/kraken/machine-learning-ai/nlweb-enables-ai-powered-websites/).

## Related Projects

Explore other projects from iunera that complement NLWeb JS Client:

- [NLWeb](https://github.com/iunera/NLWeb) - iunera's implementation of Microsoft's NLWeb framework for AI-powered websites
- [NLWeb Docker Image](https://hub.docker.com/r/iunera/nlweb) - Docker image for running NLWeb server
- [nlweb-js-client](https://github.com/iunera/nlweb-js-client) - This library, a JavaScript client for NLWeb integration
- [json-ld-markdown](https://github.com/iunera/json-ld-markdown) - A tool for embedding JSON-LD structured data in Markdown files
- [jsonld-schemaorg-javatypes](https://github.com/iunera/jsonld-schemaorg-javatypes) - Java types for Schema.org JSON-LD implementation
