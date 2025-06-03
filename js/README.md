# JavaScript Library Structure

This directory contains the refactored JavaScript libraries for the zclient application. The code has been reorganized into a proper library structure with
separation of concerns.

## Directory Structure

- `core/`: Core functionality classes
    - `ChatInterface.js`: Main class for the chat interface
    - `ManagedEventSource.js`: Handles EventSource connections with retry logic
- `ui/`: UI-related components
    - `ChatInterfaceUI.js`: UI-related components and methods for the ChatInterface
- `utils/`: Utility functions
    - `JsonUtils.js`: Utility functions for JSON handling and rendering
- `init/`: Initialization code
    - `ChatInterfaceInit.js`: Initialization script for the ChatInterface

## CSS

The CSS styles have been moved from JavaScript strings to a proper CSS file:

- `zclient/css/chat-interface.css`: Contains all the CSS styles for the chat interface

## Backward Compatibility

For backward compatibility, the following files have been updated to import from the new structure:

- `zclient/remoteStreaming.js`: Imports and re-exports from the new structure
- `zclient/chat-init.js`: Imports and re-exports from the new structure
- `zclient/chart-interface-style.js`: Imports and re-exports from the new structure

## Usage

To use the chat interface in your HTML, include the following:

```html

<link rel="stylesheet" href="css/chat-interface.css">
<script type="module" src="js/init/ChatInterfaceInit.js"></script>
```

Then, you can initialize the chat interface using:

```javascript
const chatInterface = findChatInterface();
```

Or, if you need more control:

```javascript
import ChatInterface from './js/core/ChatInterface.js';

const chatInterface = new ChatInterface(site, display_mode, generate_mode, apiEndpoint);
```