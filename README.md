# NLWeb JS Client

A streaming chat interface client library for embedding AI-powered chat functionality in web applications. This library provides an easy way to add interactive, AI-powered chat capabilities to your website or web application.

## Features

- Real-time streaming responses
- Customizable UI components
- Support for multiple integration methods (bundled, ES modules)
- Configurable API endpoints
- Responsive design that works on desktop and mobile
- Simple HTML structure for easy integration

## Installation

### NPM

```bash
npm install nlweb-js-client
```

### CDN

You can include the library directly from a CDN:

```html
<!-- Include the CSS -->
<link rel="stylesheet" href="https://unpkg.com/nlweb-js-client/dist/css/chat-interface.css">

<!-- Include the JS -->
<script src="https://unpkg.com/nlweb-js-client/dist/nlweb-js-client.min.js"></script>
```

You can also use a specific version by adding the version number to the URL (e.g., `https://unpkg.com/nlweb-js-client@1.0.0/...`).

### Direct Download

You can also download the latest release from the [GitHub repository](https://github.com/iunera/nlweb-js-client/releases) and include the files directly in your project.

## Usage

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
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </div>
  </div>
</div>
```

### Using the Bundled Version

The simplest way to use the library is to include the bundled version:

```html
<!-- Include the CSS -->
<link rel="stylesheet" href="./dist/css/chat-interface.css">

<!-- Include the JS -->
<script src="./dist/nlweb-js-client.min.js"></script>

<script>
  // The library is available as NLWebJsClient
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

See [example-bundled.html](example-bundled.html) for a complete example.

### Using as an ES Module

For more control and better integration with modern JavaScript applications, you can use the library as an ES module:

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

## Building the Library

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

The build process will create the following files in the `dist` directory:

- `nlweb-js-client.js` - UMD build (unminified)
- `nlweb-js-client.min.js` - UMD build (minified)
- `nlweb-js-client.esm.js` - ES module build
- CSS files in the `dist/css` directory

## Publishing to npm

This library can be published to npm, making it available for installation via npm/yarn and automatically accessible via the unpkg CDN.

### Prerequisites for Publishing

1. You need an npm account. If you don't have one, create it at [npmjs.com](https://www.npmjs.com/signup)
2. You need to be logged in to npm in your terminal: `npm login`
3. You need to have appropriate access rights to the npm package

## Configuration

### API Endpoint

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

### Display Modes

The chat interface supports different display modes:

- `nlwebsearch`: Standard chat interface with search functionality
- `chat`: Simple chat interface without search functionality
- `embed`: Embedded chat interface for integration into existing UI

Example:
```javascript
const chat = findChatInterface('', 'chat', 'generate', 'http://your-api-endpoint/ask');
```

### Generate Modes

The generate mode determines how responses are generated:

- `generate`: Standard response generation
- `stream`: Streaming response generation (responses appear word by word)

Example:
```javascript
const chat = findChatInterface('', 'nlwebsearch', 'stream', 'http://your-api-endpoint/ask');
```

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

The chat interface emits the following events:

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

## Legacy Usage (Direct Embedding)

For legacy usage or development purposes, you can still embed the chat interface script directly in your HTML file:

```html
<link rel="stylesheet" href="css/chat-interface.css">
<script type="module" src="js/init/ChatInterfaceInit.js"></script>
```

See `example.html` for a complete example.

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

## Advanced Configuration

The chat interface can be further customized with additional options:

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

For more information about the internal architecture and code organization, refer to the documentation in the `js/README.md` file.

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
