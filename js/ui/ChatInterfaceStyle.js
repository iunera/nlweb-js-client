/**
 * CSS Styles for the streaming chat interface
 * This module provides backward compatibility with the old chart-interface-style.js
 */

// The CSS styles are now in a separate CSS file: /css/chat-interface.css
// This module is just a placeholder for backward compatibility

/**
 * Applies the CSS styles to the document
 * This function is a no-op since the styles are now loaded via a <link> tag
 */
export function applyStylesOnChatInterface() {
    // No-op: Styles are now loaded via a <link> tag in the HTML
    console.log('ChatInterface styles are now loaded via CSS file');
}

// Export a placeholder for the styles string for backward compatibility
export const ChartInterfaceStyle = '/* Styles moved to /css/chat-interface.css */';