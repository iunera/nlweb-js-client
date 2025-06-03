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
<link rel="stylesheet" href="https://cdn.example.com/nlweb-js-client/dist/css/chat-interface.css">

<!-- Include the JS -->
<script src="https://cdn.example.com/nlweb-js-client/dist/nlweb-js-client.min.js"></script>
```

Replace `https://cdn.example.com/nlweb-js-client/` with your actual CDN URL.

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
<link rel="stylesheet" href="dist/css/chat-interface.css">

<!-- Include the JS -->
<script src="dist/nlweb-js-client.min.js"></script>

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

See `example-bundled.html` for a complete example.

### Using as an ES Module

For more control and better integration with modern JavaScript applications, you can use the library as an ES module:

```javascript
import { ChatInterface, findChatInterface } from 'nlweb-js-client';

// Option 1: Use the helper function to find or create a chat interface
const chat = findChatInterface(
  '', // site (optional)
  'nlwebsearch', // display mode
  'generate', // generate mode
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

### Publishing Process

#### Automated Publishing (Recommended)

The repository includes GitHub Actions workflows to automate the publishing process:

**Release Workflow** (`.github/workflows/release.yml`):

This workflow is triggered automatically when the version in package.json is changed on the main branch:

- When you update the version in package.json on the main branch, the workflow will:
  - Check if the version already exists (and stop if it does)
  - Build the package
  - Create a git tag for the version
  - Publish the package to npm
  - Create a GitHub release

**Prerelease Workflow** (`.github/workflows/prerelease.yml`):

This workflow is triggered automatically when package.json is modified on any branch except main:

- When you modify package.json on any branch other than main, the workflow will:
  - Build the package
  - Generate a prerelease version using the branch name and timestamp
  - Publish the prerelease to npm with the "next" tag
  - Create a Git tag for the prerelease version
  - Create a GitHub release marked as a prerelease

To update the version in package.json, you can:
```bash
# For patch version (1.0.0 -> 1.0.1)
npm version patch

# For minor version (1.0.0 -> 1.1.0)
npm version minor

# For major version (1.0.0 -> 2.0.0)
npm version major

# Then push the changes to trigger the workflow
git push
```

#### Manual Publishing

If you prefer to publish manually:

```bash
# Make sure you're logged in to npm
npm login

# Build the package
npm run build

# Publish to npm
npm publish
```

## Uploading to a CDN

After publishing to npm, the package is automatically available via unpkg:

```html
<!-- Latest version -->
<link rel="stylesheet" href="https://unpkg.com/nlweb-js-client/dist/css/chat-interface.css">
<script src="https://unpkg.com/nlweb-js-client/dist/nlweb-js-client.min.js"></script>

<!-- Specific version -->
<link rel="stylesheet" href="https://unpkg.com/nlweb-js-client@1.0.0/dist/css/chat-interface.css">
<script src="https://unpkg.com/nlweb-js-client@1.0.0/dist/nlweb-js-client.min.js"></script>
```

You can also upload the contents of the `dist` directory to a CDN of your choice. Make sure to include both the JavaScript files and the CSS files.

Other CDN options include:
- AWS S3 + CloudFront
- Cloudflare
- jsDelivr

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

For more advanced configuration options and internal architecture details, refer to the documentation in the `js/README.md` file.
