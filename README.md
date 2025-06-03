# NLWeb JS Client

A streaming chat interface client library for embedding AI-powered chat functionality in web applications.

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

## Usage

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
    // Use the chat interface...
  });
</script>
```

See `example-bundled.html` for a complete example.

### Using as an ES Module

```javascript
import { ChatInterface, findChatInterface } from 'nlweb-js-client';

// Create a new chat interface
const chat = findChatInterface('', 'nlwebsearch', 'generate', 'http://your-api-endpoint/ask');

// Or create it directly
const chatInterface = new ChatInterface('', 'nlwebsearch', 'generate', 'http://your-api-endpoint/ask');
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

## Uploading to a CDN

After building the library, you can upload the contents of the `dist` directory to a CDN of your choice. Make sure to include both the JavaScript files and the CSS files.

Common CDN options include:
- AWS S3 + CloudFront
- Cloudflare
- jsDelivr
- unpkg (automatically available if you publish to npm)

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

## Legacy Usage (Direct Embedding)

For legacy usage or development purposes, you can still embed the chat interface script directly in your HTML file. See `example.html` for a complete example.

## Advanced Configuration

For more advanced configuration options, refer to the documentation in the `js/README.md` file.
