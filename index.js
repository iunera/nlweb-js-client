// Main entry point for the nlweb-js-client package
export { default as ChatInterface } from './js/core/ChatInterface.js';
export { findChatInterface } from './js/init/ChatInterfaceInit.js';

// Re-export utility functions that might be useful
export { jsonLdToHtml, quickHash } from './js/utils/JsonUtils.js';

// Default export for backward compatibility
import { findChatInterface } from './js/init/ChatInterfaceInit.js';
export default findChatInterface;